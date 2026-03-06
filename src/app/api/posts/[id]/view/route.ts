import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.post.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "서버 오류" }, { status: 500 });
  }
}
