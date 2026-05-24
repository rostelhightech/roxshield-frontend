import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail } from "@/lib/api-auth";

function sanitize(str: string) {
  return str.replace(/[<>]/g, "").trim().slice(0, 200);
}

const VALID_LOCALES = ["fr", "en"];

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
  const name = body.name !== undefined ? sanitize(body.name) : undefined;
  const phone = body.phone !== undefined ? sanitize(body.phone) : undefined;
  const department = body.department !== undefined ? sanitize(body.department) : undefined;
  const position = body.position !== undefined ? sanitize(body.position) : undefined;
  const locale = body.locale !== undefined && VALID_LOCALES.includes(body.locale) ? body.locale : undefined;

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
