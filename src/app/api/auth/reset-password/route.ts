import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// POST /api/auth/reset-password
// 코드 검증 + 새 비밀번호 설정
export async function POST(request: Request) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: "모든 항목을 입력해 주세요." }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: "비밀번호는 6자 이상이어야 합니다." }, { status: 400 });
    }

    // 코드 검증
    const record = await prisma.passwordReset.findFirst({
      where: { email, code, used: false },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json({ error: "유효하지 않은 코드입니다." }, { status: 400 });
    }

    if (new Date() > record.expiresAt) {
      return NextResponse.json({ error: "코드가 만료되었습니다. 다시 요청해 주세요." }, { status: 400 });
    }

    // 비밀번호 업데이트
    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.updateMany({
      where: { email },
      data: {
        password: hashed,
        loginAttempts: 0,     // 잠금 해제
        loginLockedUntil: null,
      },
    });

    // 코드 사용 처리
    await prisma.passwordReset.update({
      where: { id: record.id },
      data: { used: true },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
