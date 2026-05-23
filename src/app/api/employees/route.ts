import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail } from "@/lib/api-auth";

export async function GET(request: NextRequest) {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = (session.user as any).organizationId;
  if (!orgId) return NextResponse.json({ error: "Aucune organisation" }, { status: 400 });

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || "";
  const department = searchParams.get("department") || "";

  const where: any = { organizationId: orgId };
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  if (department) {
    where.department = department;
  }

  const [employees, departments] = await Promise.all([
    db.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        position: true,
        role: true,
        riskScore: true,
        createdAt: true,
        _count: {
          select: {
            trainingProgress: { where: { status: "COMPLETED" } },
          },
        },
      },
      orderBy: { riskScore: "desc" },
    }),
    db.user.groupBy({
      by: ["department"],
      where: { organizationId: orgId, department: { not: null } },
      _count: true,
    }),
  ]);

  return NextResponse.json({
    employees: employees.map((e) => ({
      ...e,
      trainingsCompleted: e._count.trainingProgress,
      _count: undefined,
    })),
    departments: departments.map((d) => d.department).filter(Boolean),
  });
}

export async function POST(request: NextRequest) {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = (session.user as any).organizationId;
  const role = (session.user as any).role;
  if (!orgId) return NextResponse.json({ error: "Aucune organisation" }, { status: 400 });
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await request.json();
  const { name, email, department, position } = body;

  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

  // Vérifier si l'email existe déjà
  const existing = await db.user.findUnique({ where: { email } });
  if (existing) return NextResponse.json({ error: "Cet email existe déjà" }, { status: 409 });

  const user = await db.user.create({
    data: {
      email,
      name: name || null,
      department: department || null,
      position: position || null,
      role: "EMPLOYEE",
      organizationId: orgId,
      riskScore: 50,
    },
    select: {
      id: true,
      name: true,
      email: true,
      department: true,
      position: true,
      role: true,
      riskScore: true,
      createdAt: true,
    },
  });

  // Log
  await db.activityLog.create({
    data: {
      action: "employee_added",
      description: `Employé "${name || email}" ajouté`,
      userId: session.user.id,
      organizationId: orgId,
    },
  });

  return NextResponse.json(user, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const orgId = (session.user as any).organizationId;
  const role = (session.user as any).role;
  if (!orgId) return NextResponse.json({ error: "Aucune organisation" }, { status: 400 });
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  // Vérifier que l'employé appartient à l'org
  const user = await db.user.findFirst({
    where: { id, organizationId: orgId },
    select: { id: true, name: true, email: true },
  });
  if (!user) return NextResponse.json({ error: "Employé non trouvé" }, { status: 404 });

  // Ne pas permettre de supprimer un admin
  const target = await db.user.findUnique({ where: { id }, select: { role: true } });
  if (target?.role === "ADMIN" || target?.role === "SUPER_ADMIN") {
    return NextResponse.json({ error: "Impossible de supprimer un administrateur" }, { status: 403 });
  }

  // Supprimer les données liées puis l'utilisateur
  await db.trainingProgress.deleteMany({ where: { userId: id } });
  await db.activityLog.deleteMany({ where: { userId: id } });
  await db.notification.deleteMany({ where: { userId: id } });
  await db.user.delete({ where: { id } });

  await db.activityLog.create({
    data: {
      action: "employee_removed",
      description: `Employé "${user.name || user.email}" supprimé`,
      userId: session.user.id,
      organizationId: orgId,
    },
  });

  return NextResponse.json({ success: true });
}
