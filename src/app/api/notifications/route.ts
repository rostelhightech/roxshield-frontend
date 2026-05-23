import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSessionOrFail } from "@/lib/api-auth";

export async function GET() {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const notifications = await db.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const unreadCount = await db.notification.count({
    where: { userId: session.user.id, isRead: false },
  });

  return NextResponse.json({ notifications, unreadCount });
}

// Marquer comme lue
export async function PATCH(request: NextRequest) {
  const session = await getSessionOrFail();
  if (session instanceof NextResponse) return session;

  const body = await request.json();
  const { notificationId, markAllRead } = body;

  if (markAllRead) {
    await db.notification.updateMany({
      where: { userId: session.user.id, isRead: false },
      data: { isRead: true },
    });
  } else if (notificationId) {
    await db.notification.update({
      where: { id: notificationId, userId: session.user.id },
      data: { isRead: true },
    });
  }

  return NextResponse.json({ success: true });
}
