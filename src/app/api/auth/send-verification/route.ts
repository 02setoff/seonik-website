import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return NextResponse.json({ error: "이메일이 필요합니다." }, { status: 400 });

    // 이미 가입된 이메일 확인
    const existing = await prisma.user.findUnique({ where: { email }, select: { id: true } });
    if (existing) return NextResponse.json({ error: "이미 가입된 이메일입니다." }, { status: 400 });

    // 6자리 인증 코드 생성
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10분 후 만료

    // 기존 인증 요청 삭제 후 새로 생성
    await prisma.emailVerification.deleteMany({ where: { email } });
    await prisma.emailVerification.create({ data: { email, code, expiresAt } });

    // 이메일 발송
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
      });
      await transporter.sendMail({
        from: `"선익 SEONIK" <${process.env.GMAIL_USER}>`,
        to: email,
        subject: "[선익] 이메일 인증 코드",
        html: `
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:480px;margin:0 auto;padding:40px 0;color:#0F172A;">
            <div style="border-bottom:2px solid #0F172A;padding-bottom:16px;margin-bottom:32px;">
              <p style="font-size:11px;letter-spacing:0.15em;color:#94A3B8;margin:0 0 4px;">SEONIK 선익</p>
              <h1 style="font-size:18px;font-weight:700;margin:0;">이메일 인증</h1>
            </div>
            <p style="font-size:14px;color:#475569;margin:0 0 24px;line-height:1.6;">
              선익 회원가입을 위한 인증 코드입니다.<br/>
              아래 6자리 코드를 10분 이내에 입력해 주세요.
            </p>
            <div style="background:#F8F9FA;border:1px solid #E2E8F0;padding:24px;text-align:center;margin:0 0 32px;">
              <p style="font-size:36px;font-weight:700;letter-spacing:0.2em;color:#0F172A;margin:0;font-family:monospace;">
                ${code}
              </p>
            </div>
            <p style="font-size:12px;color:#CBD5E1;margin:0;">
              이 코드는 10분간 유효합니다. 본인이 요청하지 않은 경우 무시하세요.
            </p>
            <p style="font-size:12px;color:#94A3B8;text-align:center;margin-top:32px;">先益 — Know First, Win First.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Send verification error:", err);
    return NextResponse.json({ error: "인증 코드 발송에 실패했습니다." }, { status: 500 });
  }
}
