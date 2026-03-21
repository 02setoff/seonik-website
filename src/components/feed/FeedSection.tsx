"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, Eye, Link2, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { PostItem } from "./PostModal";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// ── 섹션 구분선 ──────────────────────────────────────────────────
function SectionDivider({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", margin: "28px 0 20px" }}>
      <span style={{
        fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700,
        letterSpacing: "0.14em", color: "var(--text-disabled)", whiteSpace: "nowrap",
      }}>{label}</span>
      <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }} />
    </div>
  );
}

// ── 개별 브리핑 풀 아티클 ────────────────────────────────────────
function BriefingArticle({ post, isFirst }: { post: PostItem; isFirst: boolean }) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState<boolean | null>(null);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // TODO: 유료 전환 시 실제 구독 DB 체크로 교체
  const isSubscribed = true;
  const showSubscriberContent = isSubscribed || post.isFree;

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
    const url = `${window.location.origin}/?p=${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, [post.id]);

  const isLocked = post.isSubscriberOnly && !showSubscriberContent;

  return (
    <article style={{
      borderTop: `${isFirst ? "2px" : "1px"} solid var(--text-primary)`,
      paddingTop: "36px",
      paddingBottom: "52px",
    }}>

      {/* ── 메타 헤더 ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        marginBottom: "20px", flexWrap: "wrap",
      }}>
        {post.code && (
          <span style={{
            fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700,
            letterSpacing: "0.16em", color: "var(--bg-primary)",
            backgroundColor: "var(--text-primary)", padding: "3px 10px",
          }}>{post.code}</span>
        )}
        <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)" }}>
          {formatDate(post.createdAt)}
        </span>
        <span style={{ width: "1px", height: "10px", backgroundColor: "var(--border)", display: "inline-block" }} />
        {post.isFree ? (
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#16A34A", fontFamily: "Inter, sans-serif" }}>무료</span>
        ) : (
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#D4AF37", fontFamily: "Inter, sans-serif" }}>구독</span>
        )}
        <span style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "var(--text-placeholder)", fontFamily: "Inter, sans-serif", marginLeft: "auto" }}>
          <Eye size={11} strokeWidth={2} /> {post.viewCount ?? 0}
        </span>
      </div>

      {/* ── 제목 ── */}
      <h2 style={{
        fontSize: isFirst ? "clamp(24px, 4vw, 34px)" : "clamp(20px, 3vw, 26px)",
        fontFamily: "'Pretendard', sans-serif",
        fontWeight: 800,
        color: "var(--text-primary)",
        lineHeight: 1.25,
        letterSpacing: "-0.025em",
        marginBottom: "20px",
        wordBreak: "break-word",
      }}>
        {post.title}
      </h2>

      {/* ── 출처 ── */}
      {post.source && (
        <p style={{
          fontSize: "12px", fontFamily: "'Pretendard', sans-serif",
          color: "var(--text-placeholder)",
          marginBottom: "24px",
          paddingBottom: "20px",
          borderBottom: "1px solid var(--border-light)",
        }}>
          📡 첩보 소스: {post.source}
        </p>
      )}

      {/* ── 브리핑 요약 ── */}
      {post.summary && (
        <div style={{ marginBottom: "8px" }}>
          <p style={{
            fontSize: "15px",
            fontFamily: "'Pretendard', sans-serif",
            color: "var(--text-secondary)",
            lineHeight: "1.95",
            borderLeft: "3px solid var(--text-primary)",
            paddingLeft: "18px",
          }}>
            {post.summary}
          </p>
        </div>
      )}

      {/* ── BM 심층 해부 ── */}
      {post.bmBreakdown && (
        <>
          <SectionDivider label="비즈니스 모델 해부" />
          <div
            className="post-content"
            style={{
              fontSize: "15px", fontFamily: "'Pretendard', sans-serif",
              lineHeight: "1.95", color: "var(--text-secondary)",
              wordBreak: "break-word",
            }}
            dangerouslySetInnerHTML={{ __html: post.bmBreakdown }}
          />
        </>
      )}

      {/* ── 실행 가이드 (구독자 전용) ── */}
      {showSubscriberContent && post.playbook && (
        <>
          <SectionDivider label="실행 가이드" />
          {/* TODO: 유료 전환 시 비구독자에게 블러 처리 + 잠금 오버레이로 교체 */}
          <div
            className="post-content"
            style={{
              fontSize: "15px", fontFamily: "'Pretendard', sans-serif",
              lineHeight: "1.95", color: "var(--text-secondary)",
              wordBreak: "break-word",
            }}
            dangerouslySetInnerHTML={{ __html: post.playbook }}
          />
        </>
      )}

      {/* ── 체크리스트 (구독자 전용) ── */}
      {showSubscriberContent && post.actionItems && (
        <>
          <SectionDivider label="체크리스트" />
          {/* TODO: 유료 전환 시 비구독자에게 블러 처리 + 잠금 오버레이로 교체 */}
          <div
            className="post-content"
            style={{
              fontSize: "15px", fontFamily: "'Pretendard', sans-serif",
              lineHeight: "1.95", color: "var(--text-secondary)",
              wordBreak: "break-word",
            }}
            dangerouslySetInnerHTML={{ __html: post.actionItems }}
          />
        </>
      )}

      {/* ── 잠금 안내 ── */}
      {isLocked && (
        <div style={{
          marginTop: "28px", padding: "28px", textAlign: "center",
          border: "1px solid #D4AF37", backgroundColor: "var(--bg-subtle)",
        }}>
          <Lock size={20} style={{ color: "#D4AF37", marginBottom: "10px" }} />
          <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)", margin: "0 0 14px" }}>
            실행 가이드와 체크리스트는 구독 회원 전용입니다.
          </p>
          <button style={{
            padding: "9px 22px", backgroundColor: "#D4AF37", color: "#0F172A",
            border: "none", fontFamily: "'Pretendard', sans-serif", fontWeight: 700,
            fontSize: "13px", cursor: "pointer",
          }}>구독하고 전략 받기 →</button>
        </div>
      )}

      {/* ── 기존 content 하위 호환 ── */}
      {post.content && !post.bmBreakdown && !post.playbook && (
        <>
          <SectionDivider label="상세 내용" />
          <div
            className="post-content"
            style={{
              fontSize: "15px", fontFamily: "'Pretendard', sans-serif",
              lineHeight: "1.95", color: "var(--text-secondary)",
              wordBreak: "break-word",
            }}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </>
      )}

      {/* ── 하단 액션 바 ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        marginTop: "32px", paddingTop: "20px",
        borderTop: "1px solid var(--border-light)",
      }}>
        <button
          onClick={handleCopy}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "7px 14px", fontSize: "12px", fontFamily: "Inter, sans-serif",
            backgroundColor: copied ? "var(--text-primary)" : "var(--bg-subtle)",
            color: copied ? "var(--bg-primary)" : "var(--text-muted)",
            border: "1px solid var(--border)",
            cursor: "pointer", transition: "all 0.15s",
          }}>
          <Link2 size={11} />
          {copied ? "복사됨" : "링크 복사"}
        </button>

        {session && (
          <button
            onClick={handleLike}
            disabled={likeLoading}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "7px 16px", fontSize: "12px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600,
              backgroundColor: liked ? "var(--text-primary)" : "var(--bg-subtle)",
              color: liked ? "var(--bg-primary)" : "var(--text-secondary)",
              border: "1px solid var(--border)",
              cursor: likeLoading ? "not-allowed" : "pointer",
              opacity: likeLoading ? 0.6 : 1, transition: "all 0.15s",
            }}>
            <Check size={12} strokeWidth={2.5} />
            {liked === true ? "저장됨" : "저장하기"}
            <span style={{
              fontSize: "11px", fontWeight: 700, marginLeft: "2px",
              color: liked ? "rgba(255,255,255,0.6)" : "var(--text-muted)",
            }}>{likeCount}</span>
          </button>
        )}
      </div>
    </article>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────
export default function FeedSection() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetch("/api/posts?take=5")
      .then((r) => r.json())
      .then((data: { posts: PostItem[]; nextCursor: string | null }) => {
        setPosts(data.posts ?? []);
        setCursor(data.nextCursor ?? null);
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, []);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/posts?take=5&cursor=${cursor}`);
      const data: { posts: PostItem[]; nextCursor: string | null } = await res.json();
      setPosts((prev) => [...prev, ...(data.posts ?? [])]);
      setCursor(data.nextCursor ?? null);
    } catch {}
    finally { setLoadingMore(false); }
  };

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "70vh", paddingBottom: "120px" }}>
      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "48px clamp(20px, 5vw, 40px) 0" }}>

        {/* 로딩 */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "96px", gap: "4px" }}>
            <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 700, fontSize: "22px", color: "var(--text-primary)", lineHeight: 1 }}>선익</p>
            <p style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", letterSpacing: "0.15em", color: "var(--text-placeholder)", marginTop: "3px" }}>SEONIK</p>
            <div style={{ display: "flex", gap: "6px", marginTop: "16px" }}>
              {[0, 150, 300].map((delay) => (
                <span key={delay} className="animate-bounce" style={{
                  display: "block", width: "4px", height: "4px", borderRadius: "50%",
                  backgroundColor: "var(--text-muted)", animationDelay: `${delay}ms`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && posts.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: "96px" }}>
            <p style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", color: "var(--text-disabled)", letterSpacing: "0.1em" }}>
              NO BRIEFINGS AVAILABLE
            </p>
          </div>
        )}

        {/* 브리핑 목록 */}
        {!loading && posts.length > 0 && (
          <>
            {posts.map((post, i) => (
              <BriefingArticle key={post.id} post={post} isFirst={i === 0} />
            ))}

            {/* 더 보기 */}
            {cursor && (
              <div style={{ display: "flex", justifyContent: "center", paddingTop: "16px" }}>
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  style={{
                    fontFamily: "'Pretendard', sans-serif", fontSize: "13px",
                    fontWeight: 600, color: "var(--text-muted)", background: "none",
                    border: "1px solid var(--border)",
                    cursor: loadingMore ? "not-allowed" : "pointer",
                    opacity: loadingMore ? 0.5 : 1, padding: "13px 48px",
                    transition: "all 0.15s", letterSpacing: "0.03em",
                  }}
                  onMouseEnter={(e) => {
                    if (!loadingMore) {
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                  }}
                >
                  {loadingMore ? "불러오는 중..." : "이전 브리핑 더 보기"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
