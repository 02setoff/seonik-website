import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { name, email, password, occupation, howFound, joinReason, newsletterConsent, privacyConsent } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "이름, 이메일, 비밀번호는 필수입니다." },
        { status: 400 }
      );
    }

    if (!occupation || !howFound || !joinReason) {
      return NextResponse.json(
        { error: "모든 항목을 입력해 주세요." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "비밀번호는 6자 이상이어야 합니다." },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "이미 사용 중인 이메일입니다." },
        { status: 400 }
      );
    }

    // 이메일 인증 확인
    const verification = await prisma.emailVerification.findFirst({
      where: { email, verified: true },
      orderBy: { createdAt: "desc" },
    });
    if (!verification || new Date() > verification.expiresAt) {
      return NextResponse.json(
        { error: "이메일 인증이 완료되지 않았습니다." },
        { status: 400 }
      );
    }

    if (name) {
      const nameExists = await prisma.user.findFirst({ where: { name } });
      if (nameExists) {
        return NextResponse.json(
          { error: "이미 사용 중인 이름입니다." },
          { status: 400 }
        );
      }
    }

    // 개인정보처리방침 동의 확인 (개인정보보호법 제15조)
    if (!privacyConsent) {
      return NextResponse.json(
        { error: "개인정보처리방침에 동의해 주세요." },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        name: name || null, email, password: hashed,
        occupation: occupation || null,
        howFound: howFound || null,
        joinReason: joinReason || null,
        newsletterConsent: newsletterConsent ?? false,
        newsletterConsentAt: newsletterConsent ? new Date() : null,
        privacyConsentAt: new Date(), // 개인정보처리방침 동의 일시 기록
      },
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
