import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.email === process.env.ADMIN_EMAIL;
}

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, summary, content, category, published } = await request.json();
  if (!title || !category) return NextResponse.json({ error: "제목과 카테고리는 필수입니다." }, { status: 400 });

  const session = await getServerSession(authOptions);
  const author = await prisma.user.findUnique({ where: { email: session!.user!.email! } });

  const post = await prisma.post.create({
    data: { title, summary, content, category, published: published ?? false, authorId: author?.id },
  });
  return NextResponse.json(post, { status: 201 });
}
