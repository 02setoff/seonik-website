import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "모든 항목을 입력해주세요." }, { status: 400 });
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
        subject: `[선익 문의] ${subject}`,
        html: `
          <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 0;color:#0F172A;">
            <div style="border-bottom:2px solid #0F172A;padding-bottom:20px;margin-bottom:32px;">
              <p style="font-size:11px;letter-spacing:0.15em;color:#94A3B8;margin:0;">SEONIK 선익</p>
              <h1 style="font-size:20px;font-weight:700;margin:6px 0 0;">새 문의가 접수되었습니다</h1>
            </div>
            <table style="width:100%;border-collapse:collapse;margin-bottom:32px;">
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #E2E8F0;width:80px;font-size:12px;color:#64748B;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">발신자</td>
                <td style="padding:12px 0;border-bottom:1px solid #E2E8F0;font-size:14px;">${name} &lt;${email}&gt;</td>
              </tr>
              <tr>
                <td style="padding:12px 0;border-bottom:1px solid #E2E8F0;font-size:12px;color:#64748B;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">제목</td>
                <td style="padding:12px 0;border-bottom:1px solid #E2E8F0;font-size:14px;">${subject}</td>
              </tr>
            </table>
            <div style="background:#F8F9FA;padding:24px;margin-bottom:32px;">
              <p style="font-size:12px;color:#64748B;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin:0 0 12px;">내용</p>
              <p style="font-size:14px;line-height:1.8;margin:0;white-space:pre-wrap;">${message.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
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
