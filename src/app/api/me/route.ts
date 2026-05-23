import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail } from "@/lib/api-auth";

export async function GET() {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    include: { organization: true },
  });

  if (!user) return NextResponse.json({ error: "Utilisateur non trouve" }, { status: 404 });

  return NextResponse.json({
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    department: user.department,
    position: user.position,
    role: user.role,
    locale: user.locale,
    riskScore: user.riskScore,
    organization: user.organization ? {
      id: user.organization.id,
      name: user.organization.name,
      plan: user.organization.plan,
      sector: user.organization.sector,
      country: user.organization.country,
      city: user.organization.city,
      size: user.organization.size,
    } : null,
  });
}

export async function PATCH(request: NextRequest) {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const body = await request.json();
  const { name, phone, department, position, locale } = body;

  const updated = await db.user.update({
    where: { id: session.user.id },
    data: {
      ...(name !== undefined && { name }),
      ...(phone !== undefined && { phone }),
      ...(department !== undefined && { department }),
      ...(position !== undefined && { position }),
      ...(locale !== undefined && { locale }),
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      department: true,
      position: true,
      role: true,
      locale: true,
    },
  });

  return NextResponse.json(updated);
}
