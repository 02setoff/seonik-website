import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

// POST /api/auth/find-email
// 이름으로 이메일 찾기: 이름에 해당하는 계정의 이메일 주소로 안내 메일 발송
export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "이름을 입력해 주세요." }, { status: 400 });
    }

    // 항상 success 반환 (이름 존재 여부 노출 방지)
    const user = await prisma.user.findFirst({
      where: { name: name.trim() },
      select: { email: true, name: true },
    });

    if (user?.email && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
      });

      const siteUrl = process.env.NEXTAUTH_URL || "https://seonik.kr";

      // 이메일 일부 마스킹: abc@gmail.com → a**@gmail.com
      const [localPart, domain] = user.email.split("@");
      const maskedEmail = localPart.length <= 2
        ? localPart[0] + "*".repeat(localPart.length - 1) + "@" + domain
        : localPart[0] + "*".repeat(localPart.length - 2) + localPart[localPart.length - 1] + "@" + domain;

      await transporter.sendMail({
        from: `"선익 SEONIK" <${process.env.GMAIL_USER}>`,
        to: user.email,
        subject: "[선익] 이메일 찾기 안내",
        html: `
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 0;color:#0F172A;">
            <div style="border-bottom:2px solid #0F172A;padding-bottom:20px;margin-bottom:32px;">
              <p style="font-size:11px;letter-spacing:0.15em;color:#94A3B8;margin:0 0 6px;">SEONIK 선익 — 이메일 찾기</p>
            </div>
            <p style="font-size:16px;font-weight:600;margin-bottom:16px;">안녕하세요, ${user.name}님</p>
            <p style="font-size:14px;color:#475569;line-height:1.7;margin-bottom:24px;">
              요청하신 이메일 찾기 결과입니다.<br/>
              회원님의 등록된 이메일 주소는 다음과 같습니다.
            </p>
            <div style="background:#F8F9FA;border:1px solid #E2E8F0;padding:20px 24px;margin-bottom:32px;">
              <p style="font-size:18px;font-weight:700;color:#0F172A;margin:0;letter-spacing:0.05em;">${maskedEmail}</p>
            </div>
            <p style="font-size:13px;color:#94A3B8;margin-bottom:32px;">
              이메일 주소의 일부는 보안을 위해 마스킹 처리됩니다.<br/>
              본 메일은 회원님의 이메일 주소로 발송되었습니다.
            </p>
            <a href="${siteUrl}" style="display:inline-block;background:#0F172A;color:white;text-decoration:none;padding:12px 28px;font-size:14px;font-weight:600;">
              선익으로 돌아가기 →
            </a>
            <div style="margin-top:40px;padding-top:20px;border-top:1px solid #F1F5F9;">
              <p style="font-size:11px;color:#CBD5E1;margin:0;">先益 — Know First, Win First.</p>
            </div>
          </div>
        `,
      });
    }

    // 항상 성공 응답 (보안)
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true }); // 오류도 성공처럼 반환
  }
}
