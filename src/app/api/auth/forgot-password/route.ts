import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

// POST /api/auth/forgot-password
// 이름 + 이메일로 일회성 비밀번호 재설정 코드 발송
export async function POST(request: Request) {
  try {
    const { name, email } = await request.json();
    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "이름과 이메일을 모두 입력해 주세요." }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { name: name.trim(), email: email.trim().toLowerCase() },
      select: { id: true, email: true, name: true },
    });

    // 항상 성공 응답 (계정 존재 여부 노출 방지)
    if (user?.email && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      // 기존 미사용 코드 삭제
      await prisma.passwordReset.deleteMany({
        where: { email: user.email, used: false },
      });

      // 6자리 코드 생성 (10분 유효)
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      await prisma.passwordReset.create({
        data: { email: user.email, code, expiresAt },
      });

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
      });

      const siteUrl = process.env.NEXTAUTH_URL || "https://seonik.kr";

      await transporter.sendMail({
        from: `"선익 SEONIK" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: "[선익] 비밀번호 재설정 코드",
        html: `
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 0;color:#0F172A;">
            <div style="border-bottom:2px solid #0F172A;padding-bottom:20px;margin-bottom:32px;">
              <p style="font-size:11px;letter-spacing:0.15em;color:#94A3B8;margin:0 0 6px;">SEONIK 선익 — 비밀번호 재설정</p>
            </div>
            <p style="font-size:16px;font-weight:600;margin-bottom:16px;">안녕하세요, ${user.name}님</p>
            <p style="font-size:14px;color:#475569;line-height:1.7;margin-bottom:24px;">
              비밀번호 재설정 코드입니다. 아래 코드를 입력하여 새 비밀번호를 설정하세요.<br/>
              <strong>10분 이내에 사용해 주세요.</strong>
            </p>
            <div style="background:#0F172A;padding:24px;text-align:center;margin-bottom:32px;">
              <p style="font-size:32px;font-weight:700;color:white;margin:0;letter-spacing:0.4em;font-family:monospace;">${code}</p>
            </div>
            <a href="${siteUrl}/reset-password" style="display:inline-block;background:#0F172A;color:white;text-decoration:none;padding:12px 28px;font-size:14px;font-weight:600;margin-bottom:24px;">
              비밀번호 재설정 페이지로 →
            </a>
            <p style="font-size:12px;color:#94A3B8;margin-top:24px;">
              본인이 요청하지 않으셨다면 이 이메일을 무시하셔도 됩니다.
            </p>
            <div style="margin-top:40px;padding-top:20px;border-top:1px solid #F1F5F9;">
              <p style="font-size:11px;color:#CBD5E1;margin:0;">先益 — Know First, Win First.</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
