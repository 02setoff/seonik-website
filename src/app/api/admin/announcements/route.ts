import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email || session.user.email !== ADMIN_EMAIL) return null;
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const all = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(all);
}

export async function POST(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json();
  const { title, description, region, affiliation, stage, deadline, applyUrl, organization, source, sourceId } = body;

  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const announcement = await prisma.announcement.create({
    data: {
      title,
      description: description ?? null,
      region: region ?? "전국",
      affiliation: affiliation ?? "전체",
      stage: stage ?? "전체",
      deadline: deadline ? new Date(deadline) : null,
      applyUrl: applyUrl ?? null,
      organization: organization ?? null,
      source: source ?? "수동",
      sourceId: sourceId ?? null,
    },
  });

  return NextResponse.json(announcement, { status: 201 });
}

export async function DELETE(req: Request) {
  const session = await requireAdmin();
  if (!session) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await prisma.announcement.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
