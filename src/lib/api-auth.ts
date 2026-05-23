import { auth } from "@/auth";
import { NextResponse } from "next/server";

/**
 * Get authenticated session or return 401 response.
 * Usage: const session = await getSessionOrFail(); if (session instanceof NextResponse) return session;
 */
export async function getSessionOrFail() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  return session;
}

export type AuthSession = Awaited<ReturnType<typeof auth>> & {
  user: { id: string; role: string; organizationId: string | null };
};
