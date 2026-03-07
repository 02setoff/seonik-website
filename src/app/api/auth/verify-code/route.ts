import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json();
    if (!email || !code) return NextResponse.json({ error: "이메일과 코드가 필요합니다." }, { status: 400 });

    const record = await prisma.emailVerification.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (!record) return NextResponse.json({ error: "인증 요청을 찾을 수 없습니다. 코드를 다시 발송해 주세요." }, { status: 400 });
    if (new Date() > record.expiresAt) return NextResponse.json({ error: "인증 코드가 만료되었습니다. 다시 시도해 주세요." }, { status: 400 });
    if (record.code !== code.trim()) return NextResponse.json({ error: "인증 코드가 올바르지 않습니다." }, { status: 400 });

    // 인증 완료 처리
    await prisma.emailVerification.update({ where: { id: record.id }, data: { verified: true } });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Verify code error:", err);
    return NextResponse.json({ error: "인증에 실패했습니다." }, { status: 500 });
  }
}
