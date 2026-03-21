"use client";

import { useState, useEffect } from "react";
import { Check, Eye, ArrowRight, Lock } from "lucide-react";
import PostModal, { PostItem } from "./PostModal";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

function formatRelativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  const hrs = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (min < 1) return "방금";
  if (hrs < 1) return `${min}분 전`;
  if (days < 1) return `${hrs}시간 전`;
  if (days === 1) return "어제";
  if (days < 7) return `${days}일 전`;
  if (days < 30) return `${Math.floor(days / 7)}주 전`;
  if (days < 365) return `${Math.floor(days / 30)}개월 전`;
  return `${Math.floor(days / 365)}년 전`;
}

// ── 브리핑 카드 ──────────────────────────────────────────────────
function BriefCard({
  post,
  onClick,
  featured = false,
}: {
  post: PostItem;
  onClick: () => void;
  featured?: boolean;
}) {
  const [hover, setHover] = useState(false);

  // TODO: 유료 전환 시 실제 구독 DB 체크로 교체
  const isSubscribed = true;
  const isLocked = post.isSubscriberOnly && !isSubscribed;

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: featured ? "28px 0 32px" : "24px 0 28px",
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
        backgroundColor: hover ? "var(--bg-hover)" : "transparent",
        transition: "background-color 0.15s",
        paddingLeft: "clamp(16px, 4vw, 0px)",
        paddingRight: "clamp(16px, 4vw, 0px)",
      }}
    >
      {/* ── 발행자 + 날짜 ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "26px", height: "26px",
            backgroundColor: "var(--text-primary)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ color: "var(--bg-primary)", fontSize: "10px", fontWeight: 900, fontFamily: "Pretendard, sans-serif" }}>선</span>
          </div>
          <span style={{ fontSize: "13px", fontWeight: 700, fontFamily: "'Pretendard', sans-serif", color: "var(--text-primary)" }}>선익 SEONIK</span>
          <span style={{ fontSize: "13px", color: "var(--text-disabled)", fontFamily: "Inter, sans-serif" }}>·</span>
          <span style={{ fontSize: "13px", color: "var(--text-placeholder)", fontFamily: "'Pretendard', sans-serif" }}>{formatRelativeTime(post.createdAt)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {post.isFree ? (
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#16A34A", fontFamily: "Inter, sans-serif" }}>🔓 무료</span>
          ) : (
            <span style={{ fontSize: "10px", fontWeight: 700, color: "#D4AF37", fontFamily: "Inter, sans-serif" }}>🔒 구독</span>
          )}
          <span style={{ fontSize: "12px", color: "var(--text-disabled)", fontFamily: "Inter, sans-serif" }}>{formatDate(post.createdAt)}</span>
        </div>
      </div>

      {/* ── 코드명 배지 ── */}
      {(post.code || featured) && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
          <span style={{
            fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em",
            backgroundColor: "var(--text-primary)", color: "var(--bg-primary)",
            padding: "2px 8px", fontFamily: "Inter, sans-serif",
          }}>INTEL BRIEF</span>
          {post.code && (
            <span style={{ fontSize: "10px", color: "var(--text-disabled)", fontFamily: "Inter, sans-serif", letterSpacing: "0.08em", fontWeight: 600 }}>
              {post.code}
            </span>
          )}
          {featured && (
            <span style={{
              fontSize: "8px", fontWeight: 700, letterSpacing: "0.14em",
              border: "1px solid var(--text-primary)", color: "var(--text-primary)",
              padding: "1px 6px", fontFamily: "Inter, sans-serif",
            }}>LATEST</span>
          )}
        </div>
      )}

      {/* ── 제목 ── */}
      <h2 style={{
        fontSize: featured ? "clamp(20px, 3.5vw, 28px)" : "clamp(16px, 2.5vw, 21px)",
        fontFamily: "'Pretendard', sans-serif",
        fontWeight: 800,
        color: "var(--text-primary)",
        lineHeight: 1.3,
        letterSpacing: "-0.02em",
        marginBottom: "10px",
        wordBreak: "break-word",
      }}>
        {post.title}
      </h2>

      {/* ── 출처 ── */}
      {post.source && (
        <p style={{
          fontSize: "12px", fontFamily: "'Pretendard', sans-serif",
          color: "var(--text-placeholder)", marginBottom: "10px",
        }}>
          📡 {post.source}
        </p>
      )}

      {/* ── 요약 ── */}
      {post.summary && (
        <p style={{
          fontSize: featured ? "15px" : "14px",
          fontFamily: "'Pretendard', sans-serif",
          color: "var(--text-secondary)",
          lineHeight: 1.85,
          marginBottom: "16px",
          display: "-webkit-box",
          WebkitLineClamp: featured ? 3 : 2,
          WebkitBoxOrient: "vertical" as React.CSSProperties["WebkitBoxOrient"],
          overflow: "hidden",
        }}>
          {post.summary}
        </p>
      )}

      {/* ── 잠금 안내 ── */}
      {isLocked && (
        <div style={{
          marginBottom: "14px", padding: "12px 16px",
          border: "1px dashed #D4AF37", color: "var(--text-muted)",
          fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
        }}>
          🔒 전략 가이드와 체크리스트는 구독 후 열람 가능합니다.
        </div>
      )}

      {/* ── 하단 메타 ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: "16px",
        fontFamily: "Inter, sans-serif", fontSize: "13px",
        color: "var(--text-placeholder)",
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Check size={12} strokeWidth={2.5} />
          {post.likeCount ?? 0}
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Eye size={12} strokeWidth={2} />
          {post.viewCount ?? 0}
        </span>
        {isLocked ? (
          <span style={{
            marginLeft: "auto", fontWeight: 700, color: "#D4AF37",
            display: "flex", alignItems: "center", gap: "5px", fontSize: "12px",
          }}>
            <Lock size={11} /> 구독하고 전략 받기
          </span>
        ) : (
          <span style={{
            marginLeft: "auto", fontWeight: 600,
            color: hover ? "var(--text-primary)" : "var(--text-muted)",
            display: "flex", alignItems: "center", gap: "5px",
            transition: "color 0.15s", fontSize: "12px", letterSpacing: "0.05em",
          }}>
            READ BRIEF <ArrowRight size={12} strokeWidth={2.5} />
          </span>
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
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

  useEffect(() => {
    fetch("/api/posts?take=9")
      .then((r) => r.json())
      .then((data: { posts: PostItem[]; nextCursor: string | null }) => {
        setPosts(data.posts ?? []);
        setCursor(data.nextCursor ?? null);
        setLoading(false);
        try {
          const params = new URLSearchParams(window.location.search);
          const postId = params.get("p");
          if (postId) {
            const found = (data.posts ?? []).find((p) => p.id === postId);
            if (found) setSelectedPost(found);
          }
        } catch {}
      })
      .catch(() => { setLoading(false); });
  }, []);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/posts?take=9&cursor=${cursor}`);
      const data: { posts: PostItem[]; nextCursor: string | null } = await res.json();
      setPosts((prev) => [...prev, ...(data.posts ?? [])]);
      setCursor(data.nextCursor ?? null);
    } catch {}
    finally { setLoadingMore(false); }
  };

  return (
    <>
      <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "70vh", paddingBottom: "96px" }}>

        {/* ── 피드 서브헤더 (sticky) ── */}
        <div style={{
          backgroundColor: "var(--header-bg)",
          borderBottom: "1px solid var(--border)",
          position: "sticky", top: "64px", zIndex: 10,
        }}>
          <div style={{
            maxWidth: "680px", margin: "0 auto",
            padding: "10px clamp(16px, 4vw, 24px)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "Inter, sans-serif" }}>
              <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.18em", color: "var(--text-primary)" }}>INTEL FEED</span>
              <span style={{ width: "1px", height: "10px", backgroundColor: "var(--border)", display: "inline-block" }} />
              <span style={{ fontSize: "11px", letterSpacing: "0.08em", color: "var(--text-placeholder)" }}>SEONIK</span>
            </div>
            {!loading && posts.length > 0 && (
              <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "var(--text-disabled)" }}>
                {posts.length}{cursor ? "+" : ""}
              </span>
            )}
          </div>
        </div>

        {/* ── 피드 컨텐츠 ── */}
        <div style={{ maxWidth: "680px", margin: "0 auto", padding: "0 clamp(16px, 4vw, 24px)" }}>

          {/* 로딩 */}
          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: "96px", gap: "4px" }}>
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

          {/* 카드 목록 */}
          {!loading && posts.length > 0 && (
            <>
              <div style={{ borderTop: "1px solid var(--border)" }}>
                {posts.map((post, i) =>
                  post && (
                    <BriefCard
                      key={post.id}
                      post={post}
                      featured={i === 0}
                      onClick={() => setSelectedPost(post)}
                    />
                  )
                )}
              </div>

              {/* 더보기 */}
              {cursor && (
                <div style={{ display: "flex", justifyContent: "center", paddingTop: "32px" }}>
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    style={{
                      fontFamily: "Inter, sans-serif", fontSize: "12px", letterSpacing: "0.1em",
                      fontWeight: 600, color: "var(--text-muted)", background: "none",
                      border: "1px solid var(--border)", cursor: loadingMore ? "not-allowed" : "pointer",
                      opacity: loadingMore ? 0.5 : 1, padding: "12px 36px", transition: "all 0.15s",
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
                    {loadingMore ? "LOADING..." : "더 보기"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}
