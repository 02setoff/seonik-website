import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function checkAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.email !== process.env.ADMIN_EMAIL) {
    return null;
  }
  return session;
}

export async function GET() {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const notices = await prisma.notice.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(notices);
}

export async function POST(request: Request) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { type, title, content, important, published, scheduledAt } = body;

  if (!type || !title || !content) {
    return NextResponse.json({ error: "type, title, content는 필수입니다." }, { status: 400 });
  }

  const notice = await prisma.notice.create({
    data: {
      type,
      title,
      content,
      important: important ?? false,
      published: published ?? true,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    },
  });
  return NextResponse.json(notice, { status: 201 });
}
