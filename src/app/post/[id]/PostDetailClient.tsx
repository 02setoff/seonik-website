"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Check, Link2, Lock, Eye, ArrowLeft } from "lucide-react";

interface Post {
  id: string;
  code: string | null;
  title: string;
  summary: string | null;
  source: string | null;
  bmBreakdown: string | null;
  playbook: string | null;
  actionItems: string | null;
  deepDive: string | null;
  seonikNote: string | null;
  content: string | null;
  postType: string;
  isFree: boolean;
  isSubscriberOnly: boolean;
  createdAt: string;
  viewCount: number;
  likeCount: number;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// ── 읽기 진행 바 ───────────────────────────────────────────────
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = doc.scrollTop || document.body.scrollTop;
      const total = doc.scrollHeight - doc.clientHeight;
      setProgress(total > 0 ? Math.min((scrolled / total) * 100, 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0,
      height: "2px",
      width: `${progress}%`,
      backgroundColor: "var(--text-primary)",
      zIndex: 9999,
      transition: "width 0.08s linear",
      transformOrigin: "left",
    }} />
  );
}

// ── 섹션 헤더 ──────────────────────────────────────────────────
function Section({ num, label, locked, children }: {
  num: string; label: string; locked?: boolean; children: React.ReactNode;
}) {
  return (
    <div style={{ marginBottom: "40px" }}>
      <div style={{
        display: "flex", alignItems: "center", gap: "14px",
        marginBottom: "20px",
        paddingBottom: "12px",
        borderBottom: "1px solid var(--border)",
      }}>
        <span style={{
          fontSize: "11px", fontFamily: "Courier New, monospace", fontWeight: 700,
          letterSpacing: "0.1em", color: "var(--text-primary)",
        }}>{num}</span>
        <span style={{
          fontSize: "12px", fontFamily: "Courier New, monospace", fontWeight: 700,
          letterSpacing: "0.16em", color: "var(--text-secondary)",
          textTransform: "uppercase" as const,
        }}>{label}</span>
        {locked && (
          <span style={{
            display: "flex", alignItems: "center", gap: "4px",
            fontSize: "9px", fontFamily: "Courier New, monospace",
            color: "var(--text-placeholder)", letterSpacing: "0.12em",
            marginLeft: "auto",
          }}>
            <Lock size={9} /> 구독자 전용
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ── 구독자 잠금 블록 ───────────────────────────────────────────
function LockedBlock() {
  return (
    <div style={{
      padding: "32px 24px",
      border: "1px dashed var(--border)",
      textAlign: "center",
      backgroundColor: "var(--bg-subtle)",
    }}>
      <div style={{ marginBottom: "20px" }}>
        {[80, 65, 73].map((w, i) => (
          <div key={i} style={{
            height: "10px",
            backgroundColor: "var(--text-primary)",
            opacity: 0.08,
            margin: "7px auto",
            width: `${w}%`,
          }} />
        ))}
      </div>
      <Lock size={18} style={{ color: "var(--text-placeholder)", marginBottom: "12px" }} />
      <p style={{
        fontSize: "11px", fontFamily: "Courier New, monospace",
        letterSpacing: "0.12em", color: "var(--text-placeholder)",
        margin: "0 0 20px",
      }}>
        이 섹션은 구독자 전용입니다
      </p>
      <button style={{
        padding: "9px 28px",
        backgroundColor: "var(--text-primary)",
        color: "var(--bg-primary)",
        border: "none",
        fontFamily: "Courier New, monospace",
        fontWeight: 700,
        fontSize: "10px",
        letterSpacing: "0.18em",
        cursor: "pointer",
      }}>
        구독하기 →
      </button>
    </div>
  );
}

export default function PostDetailClient({ post }: { post: Post }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [liked, setLiked] = useState<boolean | null>(null);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const [likeLoading, setLikeLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // TODO: 유료 전환 시 실제 구독 상태로 교체
  const isSubscribed = false;

  const handleLike = useCallback(async () => {
    if (!session || likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok) { setLiked(data.liked); setLikeCount(data.count); }
    } finally { setLikeLoading(false); }
  }, [session, likeLoading, post.id]);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, []);

  const docCode = post.code || `SNK-${post.id.slice(0, 6).toUpperCase()}`;
  const isBriefing = post.postType === "BRIEFING";
  const hasStructuredContent = isBriefing && (
    post.summary || post.bmBreakdown || post.playbook || post.actionItems
  );

  return (
    <>
      {/* 읽기 진행 바 */}
      <ReadingProgressBar />

      <div style={{
        backgroundColor: "var(--bg-primary)",
        minHeight: "100vh",
        paddingBottom: "120px",
      }}>
        <div style={{
          maxWidth: "720px",
          margin: "0 auto",
          padding: "40px clamp(16px, 4vw, 40px) 0",
        }}>

          {/* 뒤로 가기 */}
          <button
            onClick={() => router.back()}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              fontSize: "12px", fontFamily: "Courier New, monospace",
              letterSpacing: "0.1em", color: "var(--text-placeholder)",
              background: "none", border: "none", cursor: "pointer",
              padding: "0", marginBottom: "36px",
            }}
          >
            <ArrowLeft size={12} /> 피드로 돌아가기
          </button>

          {/* 헤더: 타입 + 코드 + 날짜 */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            marginBottom: "20px", flexWrap: "wrap",
          }}>
            {post.postType === "BRIEFING" && (
              <span style={{
                fontSize: "9px", fontFamily: "Courier New, monospace", fontWeight: 700,
                letterSpacing: "0.2em", color: "var(--text-primary)",
                border: "1px solid var(--text-primary)", padding: "2px 8px",
              }}>BRIEFING</span>
            )}
            {post.postType === "NOTICE" && (
              <span style={{
                fontSize: "9px", fontFamily: "Courier New, monospace", fontWeight: 700,
                letterSpacing: "0.18em", color: "#64748B",
                border: "1px solid #CBD5E1", padding: "2px 8px",
              }}>공지</span>
            )}
            <span style={{
              fontSize: "10px", fontFamily: "Courier New, monospace",
              color: "var(--text-placeholder)", letterSpacing: "0.08em",
            }}>{docCode}</span>
            <span style={{ width: "1px", height: "10px", backgroundColor: "var(--border)", display: "inline-block" }} />
            <span style={{
              fontSize: "10px", fontFamily: "Courier New, monospace",
              color: "var(--text-placeholder)", letterSpacing: "0.08em",
            }}>{formatDate(post.createdAt)}</span>
            <span style={{
              display: "flex", alignItems: "center", gap: "3px",
              fontSize: "10px", fontFamily: "Courier New, monospace",
              color: "var(--text-disabled)", letterSpacing: "0.04em",
              marginLeft: "auto",
            }}>
              <Eye size={10} strokeWidth={1.5} /> {post.viewCount}
            </span>
          </div>

          {/* 제목 */}
          <h1 style={{
            fontSize: "clamp(22px, 4vw, 32px)",
            fontFamily: "'Pretendard', sans-serif",
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
            lineHeight: 1.3,
            margin: "0 0 16px",
            wordBreak: "break-word",
          }}>
            {post.title}
          </h1>

          {/* 출처 */}
          {post.source && (
            <p style={{
              fontSize: "12px", fontFamily: "Courier New, monospace",
              color: "var(--text-placeholder)", letterSpacing: "0.06em",
              marginBottom: "8px",
            }}>
              SOURCE · {post.source}
            </p>
          )}

          {/* 두꺼운 구분선 */}
          <div style={{ borderTop: "2px solid var(--text-primary)", margin: "28px 0 36px" }} />

          {/* 구조화된 브리핑 섹션 */}
          {hasStructuredContent && (
            <>
              {post.summary && (
                <Section num="01" label="브리핑 요약">
                  <p style={{
                    fontSize: "15px", fontFamily: "'Pretendard', sans-serif",
                    color: "var(--text-secondary)", lineHeight: "1.9",
                    borderLeft: "3px solid var(--text-primary)", paddingLeft: "20px", margin: 0,
                  }}>
                    {post.summary}
                  </p>
                </Section>
              )}
              {post.bmBreakdown && (
                <Section num="02" label="비즈니스 모델 해부">
                  <div className="post-content" style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", lineHeight: "1.9", color: "var(--text-secondary)", wordBreak: "break-word" }}
                    dangerouslySetInnerHTML={{ __html: post.bmBreakdown }} />
                </Section>
              )}
              {post.playbook && (
                <Section num="03" label="실행 가이드">
                  <div className="post-content" style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", lineHeight: "1.9", color: "var(--text-secondary)", wordBreak: "break-word" }}
                    dangerouslySetInnerHTML={{ __html: post.playbook }} />
                </Section>
              )}
              {post.actionItems && (
                <Section num="04" label="체크리스트">
                  <div className="post-content" style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", lineHeight: "1.9", color: "var(--text-secondary)", wordBreak: "break-word" }}
                    dangerouslySetInnerHTML={{ __html: post.actionItems }} />
                </Section>
              )}
              {(post.deepDive || post.seonikNote) && (
                <div style={{ margin: "8px 0 36px", display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ flex: 1, borderTop: "1px dashed var(--border)" }} />
                  <span style={{ fontSize: "9px", fontFamily: "Courier New, monospace", letterSpacing: "0.18em", color: "var(--text-disabled)", whiteSpace: "nowrap" }}>SUBSCRIBER ONLY</span>
                  <div style={{ flex: 1, borderTop: "1px dashed var(--border)" }} />
                </div>
              )}
              {post.deepDive && (
                <Section num="05" label="심층 분석" locked>
                  {isSubscribed ? (
                    <div className="post-content" style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", lineHeight: "1.9", color: "var(--text-secondary)", wordBreak: "break-word" }}
                      dangerouslySetInnerHTML={{ __html: post.deepDive }} />
                  ) : <LockedBlock />}
                </Section>
              )}
              {post.seonikNote && (
                <Section num="06" label="선익 코멘트" locked>
                  {isSubscribed ? (
                    <div className="post-content" style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", lineHeight: "1.9", color: "var(--text-secondary)", wordBreak: "break-word" }}
                      dangerouslySetInnerHTML={{ __html: post.seonikNote }} />
                  ) : <LockedBlock />}
                </Section>
              )}
            </>
          )}

          {/* 일반 본문 */}
          {!hasStructuredContent && post.content && (
            <div className="post-content" style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", lineHeight: "1.9", color: "var(--text-secondary)", wordBreak: "break-word" }}
              dangerouslySetInnerHTML={{ __html: post.content }} />
          )}

          {/* 액션 버튼 */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            borderTop: "1px solid var(--border)",
            marginTop: "48px", paddingTop: "20px",
            flexWrap: "wrap", gap: "12px",
          }}>
            <button
              onClick={handleCopy}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "7px 14px",
                fontSize: "10px", fontFamily: "Courier New, monospace",
                fontWeight: 700, letterSpacing: "0.14em",
                backgroundColor: copied ? "var(--text-primary)" : "transparent",
                color: copied ? "var(--bg-primary)" : "var(--text-muted)",
                border: "1px solid var(--border)",
                cursor: "pointer", transition: "all 0.15s",
              }}
            >
              <Link2 size={10} />
              {copied ? "링크 복사됨" : "링크 복사"}
            </button>

            {session && (
              <button
                onClick={handleLike}
                disabled={likeLoading}
                style={{
                  display: "flex", alignItems: "center", gap: "7px",
                  padding: "7px 18px",
                  fontSize: "10px", fontFamily: "Courier New, monospace",
                  fontWeight: 700, letterSpacing: "0.14em",
                  backgroundColor: liked ? "var(--text-primary)" : "transparent",
                  color: liked ? "var(--bg-primary)" : "var(--text-secondary)",
                  border: "1px solid var(--border)",
                  cursor: likeLoading ? "not-allowed" : "pointer",
                  opacity: likeLoading ? 0.6 : 1, transition: "all 0.15s",
                }}
              >
                <Check size={10} strokeWidth={2.5} />
                {liked ? "저장됨" : "저장하기"}
                <span style={{ opacity: 0.5, marginLeft: "2px" }}>{likeCount}</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </>
  );
}
