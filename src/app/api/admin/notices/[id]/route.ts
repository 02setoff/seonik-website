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

export async function GET(request: Request, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const notice = await prisma.notice.findUnique({ where: { id: params.id } });
  if (!notice) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(notice);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await request.json();
  const { type, title, content, important, published, scheduledAt } = body;

  const notice = await prisma.notice.update({
    where: { id: params.id },
    data: {
      type,
      title,
      content,
      important,
      published,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    },
  });
  return NextResponse.json(notice);
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  if (!await checkAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await prisma.notice.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
