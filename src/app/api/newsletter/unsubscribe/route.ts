import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 이메일 수신거부: GET /api/newsletter/unsubscribe?email=xxx
// 이메일 본문의 링크를 클릭하면 즉시 수신거부 처리
export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get("email");
  if (!email) {
    return new NextResponse("잘못된 요청입니다.", { status: 400 });
  }

  try {
    // newsletterConsentAt은 삭제하지 않음 — 정보통신망법 제50조의5:
    // 수신 동의 기록은 수신거부 후 6개월간 보관 의무
    await prisma.user.updateMany({
      where: { email },
      data: {
        newsletterConsent: false,
        newsletterUnsubscribedAt: new Date(),
        // newsletterConsentAt은 의도적으로 유지 (법적 근거 보관)
      },
    });
  } catch {
    // 존재하지 않는 이메일이어도 무시 (보안상 정보 노출 방지)
  }

  // 수신거부 완료 페이지로 리다이렉트
  const siteUrl = process.env.NEXTAUTH_URL || "https://seonik.kr";
  return NextResponse.redirect(`${siteUrl}/?unsubscribed=1`);
}
