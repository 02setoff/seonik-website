import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// 혼동하기 어려운 문자 제외 (0/O, 1/l/I 등)
function generateTempPassword(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
  let result = "";
  for (let i = 0; i < 12; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// POST /api/auth/forgot-password
// 이름 + 이메일 매칭 검증 후 임시 비밀번호 발급 및 발송
export async function POST(request: Request) {
  try {
    // Rate limiting: IP당 10분에 5회
    const ip = getClientIp(request);
    const rl = rateLimit(`forgot-password:${ip}`, 5, 10 * 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." },
        { status: 429 }
      );
    }

    const { name, email } = await request.json();
    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "이름과 이메일을 모두 입력해 주세요." }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
      },
      select: { id: true, email: true, name: true },
    });

    // 이름+이메일 불일치 시 에러 반환
    if (!user?.email) {
      return NextResponse.json(
        { error: "이름과 이메일이 회원정보와 일치하지 않습니다. 다시한번 확인해주세요." },
        { status: 404 }
      );
    }

    // 임시 비밀번호 생성
    const tempPassword = generateTempPassword();
    const hashed = await bcrypt.hash(tempPassword, 12);

    // 기존 비밀번호를 임시 비밀번호로 교체 + 강제 재설정 플래그 설정
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        mustResetPassword: true,
        loginAttempts: 0,
        loginLockedUntil: null,
      },
    });

    // 기존 미사용 PasswordReset 코드 정리
    await prisma.passwordReset.deleteMany({
      where: { email: user.email, used: false },
    });

    // 이메일 발송
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
      });

      const siteUrl = process.env.NEXTAUTH_URL || "https://seonik.kr";

      await transporter.sendMail({
        from: `"선익 SEONIK" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: "[선익] 임시 비밀번호 발급 안내",
        html: `
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 0;color:#0F172A;">
            <div style="border-bottom:2px solid #0F172A;padding-bottom:20px;margin-bottom:32px;">
              <p style="font-size:11px;letter-spacing:0.15em;color:#94A3B8;margin:0 0 6px;">SEONIK 선익 — 임시 비밀번호 안내</p>
            </div>
            <p style="font-size:16px;font-weight:600;margin-bottom:16px;">안녕하세요, ${user.name}님</p>
            <p style="font-size:14px;color:#475569;line-height:1.8;margin-bottom:24px;">
              비밀번호 재설정 요청에 따라 임시 비밀번호를 발급해 드립니다.<br/>
              아래 임시 비밀번호로 로그인 후, <strong style="color:#0F172A;">즉시 새 비밀번호로 재설정</strong>해 주세요.
            </p>

            <div style="background:#0F172A;padding:28px;text-align:center;margin-bottom:20px;">
              <p style="font-size:11px;letter-spacing:0.15em;color:#64748B;margin:0 0 12px;">임시 비밀번호 (일회용)</p>
              <p style="font-size:28px;font-weight:700;color:white;margin:0;letter-spacing:0.2em;font-family:monospace;">${tempPassword}</p>
            </div>

            <div style="background:#FEF2F2;border:1px solid #FECACA;padding:16px 20px;margin-bottom:28px;">
              <p style="font-size:13px;color:#DC2626;font-weight:700;margin:0 0 6px;">⚠ 주의사항</p>
              <ul style="font-size:13px;color:#EF4444;margin:0;padding-left:18px;line-height:1.8;">
                <li>기존 비밀번호로는 더 이상 로그인이 불가합니다.</li>
                <li>임시 비밀번호로 로그인하면 즉시 비밀번호 재설정 화면으로 이동합니다.</li>
                <li>본인이 요청하지 않으셨다면 즉시 고객센터로 연락해 주세요.</li>
              </ul>
            </div>

            <a href="${siteUrl}" style="display:inline-block;background:#0F172A;color:white;text-decoration:none;padding:12px 28px;font-size:14px;font-weight:600;margin-bottom:24px;">
              선익 로그인 →
            </a>

            <p style="font-size:12px;color:#94A3B8;margin-top:24px;">
              문의: seonik.official@gmail.com
            </p>
            <div style="margin-top:40px;padding-top:20px;border-top:1px solid #F1F5F9;">
              <p style="font-size:11px;color:#CBD5E1;margin:0;">先益 — 앞서나가는 정보로 실행가들을 이롭게</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
