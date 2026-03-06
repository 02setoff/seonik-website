import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

// 레이트 리미팅: IP당 10분에 최대 3회
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const WINDOW_MS = 10 * 60 * 1000; // 10분
  const MAX_REQUESTS = 3;

  const entry = rateLimitMap.get(ip);
  if (entry) {
    if (now < entry.resetAt) {
      if (entry.count >= MAX_REQUESTS) return false;
      entry.count++;
    } else {
      rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    }
  } else {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  }

  // 오래된 항목 정리 (메모리 누수 방지)
  if (rateLimitMap.size > 500) {
    Array.from(rateLimitMap.entries()).forEach(([key, val]) => {
      if (now > val.resetAt) rateLimitMap.delete(key);
    });
  }

  return true;
}

function sanitize(str: string): string {
  return str.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function POST(request: NextRequest) {
  // IP 추출
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  // 레이트 리밋 체크
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "너무 많은 요청입니다. 10분 후 다시 시도해 주세요." },
      { status: 429 }
    );
  }

  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "모든 항목을 입력해주세요." }, { status: 400 });
    }

    // 입력 길이 검증
    if (name.length > 50) return NextResponse.json({ error: "이름은 50자 이하로 입력해주세요." }, { status: 400 });
    if (email.length > 100) return NextResponse.json({ error: "이메일은 100자 이하로 입력해주세요." }, { status: 400 });
    if (subject.length > 200) return NextResponse.json({ error: "제목은 200자 이하로 입력해주세요." }, { status: 400 });
    if (message.length > 2000) return NextResponse.json({ error: "내용은 2000자 이하로 입력해주세요." }, { status: 400 });

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "올바른 이메일 형식이 아닙니다." }, { status: 400 });
    }

    // DB 저장
    await prisma.contact.create({ data: { name, email, subject, message } });

    // Gmail 이메일 발송 (GMAIL_APP_PASSWORD가 설정된 경우에만 실행)
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      });

      await transporter.sendMail({
        from: `"선익 SEONIK" <${process.env.GMAIL_USER}>`,
        to: process.env.GMAIL_USER,
        subject: `[선익 문의] ${sanitize(subject)}`,
        html: `
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 0;color:#0F172A;">
            <div style="border-bottom:2px solid #0F172A;padding-bottom:20px;margin-bottom:32px;">
              <p style="font-size:11px;letter-spacing:0.15em;color:#94A3B8;margin:0;">SEONIK 선익</p>
              <h1 style="font-size:20px;font-weight:700;margin:6px 0 0;">새 문의가 접수되었습니다</h1>
            </div>
            <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #E2E8F0;width:80px;font-size:12px;color:#64748B;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">발신자</td>
                <td style="padding:12px 0;border-bottom:1px solid #E2E8F0;font-size:14px;">${sanitize(name)} &lt;${sanitize(email)}&gt;</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #E2E8F0;font-size:12px;color:#64748B;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">제목</td>
                <td style="padding:12px 0;border-bottom:1px solid #E2E8F0;font-size:14px;">${sanitize(subject)}</td>
              </tr>
            </table>
            <div style="background:#F8F9FA;padding:24px;margin-bottom:32px;">
              <p style="font-size:12px;color:#64748B;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px;">내용</p>
              <p style="font-size:14px;line-height:1.8;margin:0;white-space:pre-wrap;">${sanitize(message)}</p>
            </div>
            <p style="font-size:12px;color:#94A3B8;text-align:center;margin:0;">先益 — Know First, Win First.</p>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (err) {
    console.error("Contact error:", err);
    return NextResponse.json({ error: "서버 오류가 발생했습니다." }, { status: 500 });
  }
}
