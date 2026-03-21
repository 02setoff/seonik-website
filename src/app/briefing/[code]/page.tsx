import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Metadata } from "next";

interface Props {
  params: { code: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await prisma.post.findFirst({
    where: { code: params.code, published: true },
    select: { title: true, summary: true },
  });
  if (!post) return { title: "브리핑 | 선익 SEONIK" };
  return {
    title: `${post.title} | 선익 SEONIK`,
    description: post.summary ?? undefined,
  };
}

function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
      <p style={{
        fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700,
        letterSpacing: "0.15em", color: "#94A3B8", flexShrink: 0, margin: 0,
      }}>
        {label}
      </p>
      <div style={{ flex: 1, height: "1px", backgroundColor: "#E2E8F0" }} />
    </div>
  );
}

export default async function BriefingDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const post = await prisma.post.findFirst({
    where: { code: params.code, published: true },
  });

  if (!post) notFound();

  // TODO: 유료 전환 시 실제 구독 DB 체크로 교체 (현재는 모든 로그인 회원에게 전체 공개)
  const isSubscribed = true;
  const showSubscriberContent = isSubscribed || post.isFree;

  // 조회수 증가 (fire-and-forget)
  prisma.post.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } }).catch(() => {});

  const formatDate = (d: Date) => {
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F8F9FA" }}>
      {/* ── 상단 네비 ── */}
      <div style={{
        position: "sticky", top: 0, zIndex: 10,
        backgroundColor: "white", borderBottom: "1px solid #E2E8F0",
        padding: "0 clamp(16px, 4vw, 32px)", height: "56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link href="/" style={{
          fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
          color: "#94A3B8", textDecoration: "none",
        }}>
          ← 피드로 돌아가기
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {post.isFree ? (
            <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#16A34A" }}>🔓 무료</span>
          ) : (
            <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#D4AF37" }}>🔒 구독</span>
          )}
        </div>
      </div>

      {/* ── 본문 ── */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "clamp(32px,6vw,56px) clamp(16px,4vw,32px) 96px" }}>

        {/* ── 섹션 1: 코드명 + 헤드라인 ── */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
            <span style={{
              fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700,
              letterSpacing: "0.18em", backgroundColor: "#0F172A",
              color: "white", padding: "2px 10px",
            }}>INTEL BRIEF</span>
            <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#CBD5E1", letterSpacing: "0.12em", fontWeight: 600 }}>
              {post.code}
            </span>
          </div>
          <div style={{ borderTop: "2px solid #0F172A", paddingTop: "20px" }}>
            <h1 style={{
              fontSize: "clamp(22px, 4vw, 36px)", fontFamily: "'Pretendard', sans-serif",
              fontWeight: 800, color: "#0F172A", lineHeight: "1.35",
              letterSpacing: "-0.02em", marginBottom: "20px", wordBreak: "break-word",
            }}>
              {post.title}
            </h1>
            <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "14px" }}>
              {post.source && (
                <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#94A3B8", marginBottom: "4px" }}>
                  📡 첩보 소스: {post.source}
                </p>
              )}
              <p style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "#CBD5E1" }}>
                발행일: {formatDate(post.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* ── 섹션 2: 지휘관 요약 ── */}
        {post.summary && (
          <div style={{ marginBottom: "40px" }}>
            <SectionHeader label="▶ 브리핑 요약" />
            <div style={{ borderLeft: "3px solid #0F172A", padding: "18px 22px", backgroundColor: "#F1F5F9" }}>
              <p style={{
                fontSize: "15px", fontFamily: "'Pretendard', sans-serif",
                color: "#475569", lineHeight: "1.8", fontWeight: 500, margin: 0,
              }}>
                {post.summary}
              </p>
            </div>
          </div>
        )}

        {/* ── 섹션 3: BM 심층 해부 ── */}
        {post.bmBreakdown && (
          <div style={{ marginBottom: "40px" }}>
            <SectionHeader label="▶ 비즈니스 모델 심층 해부" />
            <div className="post-content" style={{
              fontSize: "clamp(14px, 3.5vw, 15px)", fontFamily: "'Pretendard', sans-serif",
              lineHeight: "1.95", color: "#475569", wordBreak: "break-word",
            }}
              dangerouslySetInnerHTML={{ __html: post.bmBreakdown }}
            />
          </div>
        )}

        {/* ── 섹션 4: 실행 가이드 (구독자 전용) ── */}
        {/* TODO: 유료 전환 시 비구독자에게 블러 처리 + 잠금 오버레이로 교체 */}
        {showSubscriberContent && post.playbook && (
          <div style={{ marginBottom: "40px" }}>
            <SectionHeader label="▶ 실행 가이드 (Playbook)" />
            <div className="post-content" style={{
              fontSize: "clamp(14px, 3.5vw, 15px)", fontFamily: "'Pretendard', sans-serif",
              lineHeight: "1.95", color: "#475569", wordBreak: "break-word",
            }}
              dangerouslySetInnerHTML={{ __html: post.playbook }}
            />
          </div>
        )}
        {!showSubscriberContent && (
          <div style={{ marginBottom: "40px" }}>
            <SectionHeader label="▶ 실행 가이드 (Playbook)" />
            <div style={{
              padding: "36px", textAlign: "center",
              border: "1px solid #D4AF37", backgroundColor: "#FFFBEB",
            }}>
              <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#92400E", margin: "0 0 16px", fontWeight: 600 }}>
                🔒 실행 가이드는 구독 회원 전용입니다.
              </p>
              <Link href="/" style={{
                display: "inline-block", padding: "10px 24px",
                backgroundColor: "#D4AF37", color: "#0F172A",
                fontFamily: "'Pretendard', sans-serif", fontWeight: 700,
                fontSize: "13px", textDecoration: "none",
              }}>
                구독하고 전략 받기 →
              </Link>
            </div>
          </div>
        )}

        {/* ── 섹션 5: 체크리스트 (구독자 전용) ── */}
        {/* TODO: 유료 전환 시 비구독자에게 블러 처리 + 잠금 오버레이로 교체 */}
        {showSubscriberContent && post.actionItems && (
          <div style={{ marginBottom: "40px" }}>
            <SectionHeader label="▶ 오늘의 체크리스트" />
            <div className="post-content" style={{
              fontSize: "clamp(14px, 3.5vw, 15px)", fontFamily: "'Pretendard', sans-serif",
              lineHeight: "1.95", color: "#475569", wordBreak: "break-word",
            }}
              dangerouslySetInnerHTML={{ __html: post.actionItems }}
            />
          </div>
        )}

        {/* ── 기존 content 필드 (하위 호환) ── */}
        {post.content && !post.bmBreakdown && !post.playbook && (
          <div style={{ marginBottom: "40px" }}>
            <SectionHeader label="BRIEFING DETAILS" />
            <div className="post-content" style={{
              fontSize: "clamp(14px, 3.5vw, 15px)", fontFamily: "'Pretendard', sans-serif",
              lineHeight: "1.95", color: "#475569", wordBreak: "break-word",
            }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        )}

        {/* ── 하단 네비 ── */}
        <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "28px", textAlign: "center" }}>
          <Link href="/" style={{
            fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
            color: "#94A3B8", textDecoration: "none",
          }}>
            ← 전체 브리핑 목록으로
          </Link>
          <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#CBD5E1", marginTop: "12px" }}>
            先益 — Know First, Win First.
          </p>
        </div>
      </div>
    </div>
  );
}
