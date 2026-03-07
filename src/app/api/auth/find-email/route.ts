import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

// POST /api/auth/find-email
// 이름으로 이메일 찾기: 미등록 이름이면 에러, 등록된 이름이면 해당 이메일로 안내 발송
export async function POST(request: Request) {
  try {
    // Rate limiting: IP당 10분에 5회
    const ip = getClientIp(request);
    const rl = rateLimit(`find-email:${ip}`, 5, 10 * 60 * 1000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." },
        { status: 429 }
      );
    }

    const { name } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: "이름을 입력해 주세요." }, { status: 400 });
    }

    const user = await prisma.user.findFirst({
      where: { name: name.trim() },
      select: { email: true, name: true },
    });

    // 미등록 이름이면 에러 반환 (이메일 발송 안 함)
    if (!user?.email) {
      return NextResponse.json(
        { error: "사용자 이름을 다시한번 확인해주세요." },
        { status: 404 }
      );
    }

    // 이메일 발송 (환경변수 설정된 경우)
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
      });

      const siteUrl = process.env.NEXTAUTH_URL || "https://seonik.kr";

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
            <p style="font-size:14px;color:#475569;line-height:1.8;margin-bottom:24px;">
              본 메일은 회원님이 <strong style="color:#0F172A;">선익(SEONIK)</strong>에 이메일 가입을 진행하신 이메일 주소로 발송되었습니다.<br/>
              이 이메일로 선익에 로그인해 주세요.
            </p>
            <div style="background:#F8F9FA;border-left:3px solid #0F172A;padding:16px 20px;margin-bottom:28px;">
              <p style="font-size:13px;color:#475569;margin:0;line-height:1.7;">
                보안을 위해 이메일 주소는 본 메일에 표시되지 않습니다.<br/>
                본인이 이 이메일로 가입하셨다면, 이 이메일 주소로 로그인하시면 됩니다.
              </p>
            </div>
            <a href="${siteUrl}" style="display:inline-block;background:#0F172A;color:white;text-decoration:none;padding:12px 28px;font-size:14px;font-weight:600;">
              선익 로그인 →
            </a>
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
