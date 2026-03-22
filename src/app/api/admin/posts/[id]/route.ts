import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

async function isAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user?.email === process.env.ADMIN_EMAIL;
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { title, summary, source, bmBreakdown, playbook, actionItems,
          deepDive, seonikNote, content, postType,
          category, code, isFree, isSubscriberOnly, published } = await request.json();

  // 발행 상태 변경 감지 (초안 → 발행 전환 시 뉴스레터)
  const prevPost = await prisma.post.findUnique({ where: { id: params.id }, select: { published: true } });
  const isNewlyPublished = published === true && prevPost?.published === false;

  const post = await prisma.post.update({
    where: { id: params.id },
    data: {
      title, summary, source, bmBreakdown, playbook, actionItems,
      deepDive: deepDive ?? null, seonikNote: seonikNote ?? null,
      content, postType: postType || "BRIEFING",
      category: category || "", code: code || null,
      isFree: isFree ?? true, isSubscriberOnly: isSubscriberOnly ?? false,
      published,
    },
  });

  if (isNewlyPublished && process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    try {
      const subscribers = await prisma.user.findMany({
        where: { newsletterConsent: true, email: { not: null } },
        select: { email: true, name: true },
      });
      if (subscribers.length > 0) {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
        });
        const siteUrl = process.env.NEXTAUTH_URL || "https://seonik.kr";
        const safeTitle = title.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        const safeSummary = summary ? summary.replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";
        await Promise.allSettled(
          subscribers
            .filter(s => s.email)
            .map(s => transporter.sendMail({
              from: `"선익 SEONIK" <${process.env.GMAIL_USER}>`,
              to: s.email!,
              subject: `[선익] 새 브리핑: ${safeTitle}`,
              html: `
                <div style="font-family:'Helvetica Neue',Arial,sans-serif;max-width:600px;margin:0 auto;padding:40px 0;color:#0F172A;">
                  <div style="border-bottom:2px solid #0F172A;padding-bottom:20px;margin-bottom:32px;">
                    <p style="font-size:11px;letter-spacing:0.15em;color:#94A3B8;margin:0 0 6px;">SEONIK 선익 — 새 브리핑</p>
                    <span style="display:inline-block;background:#F1F5F9;color:#64748B;font-size:11px;font-weight:600;letter-spacing:0.05em;padding:3px 10px;">${category}</span>
                  </div>
                  <h1 style="font-size:22px;font-weight:700;margin:0 0 16px;line-height:1.4;">${safeTitle}</h1>
                  ${safeSummary ? `<p style="font-size:15px;color:#475569;line-height:1.7;border-left:3px solid #E2E8F0;padding-left:16px;margin:0 0 32px;">${safeSummary}</p>` : ""}
                  <a href="${siteUrl}/?p=${post.id}" style="display:inline-block;background:#0F172A;color:white;text-decoration:none;padding:12px 28px;font-size:14px;font-weight:600;letter-spacing:0.02em;">브리핑 읽기 →</a>
                  <div style="margin-top:40px;padding-top:20px;border-top:1px solid #F1F5F9;">
                    <p style="font-size:11px;color:#CBD5E1;margin:0 0 8px;">
                      이 메일은 회원가입 시 이메일 알림 수신에 동의하셨기 때문에 발송되었습니다.
                    </p>
                    <p style="font-size:11px;color:#CBD5E1;margin:0 0 8px;">
                      발신: 선익 SEONIK &lt;${process.env.GMAIL_USER}&gt;
                    </p>
                    <div style="display:flex;gap:16px;flex-wrap:wrap;">
                      <a href="${siteUrl}/api/newsletter/unsubscribe?email=${encodeURIComponent(s.email!)}"
                        style="font-size:11px;color:#94A3B8;text-decoration:underline;">
                        수신거부 (클릭 시 즉시 처리)
                      </a>
                      <a href="${siteUrl}/privacy"
                        style="font-size:11px;color:#94A3B8;text-decoration:underline;">
                        개인정보처리방침
                      </a>
                    </div>
                  </div>
                  <p style="font-size:12px;color:#94A3B8;text-align:center;margin-top:16px;">先益 — Know First, Win First.</p>
                </div>
              `,
            }))
        );
      }
    } catch (err) {
      console.error("Newsletter send error:", err);
    }
  }

  return NextResponse.json(post);
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.post.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
