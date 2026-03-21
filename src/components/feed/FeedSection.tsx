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

function formatDocId(index: number, iso: string) {
  const d = new Date(iso);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `BRF-${yy}${mm}${dd}-${String(index + 1).padStart(3, "0")}`;
}

// ── 브리핑 카드 ──────────────────────────────────────────────────
function BriefCard({
  post,
  index,
  onClick,
  featured = false,
}: {
  post: PostItem;
  index: number;
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
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderLeft: `3px solid ${isLocked ? "#D4AF37" : "var(--text-primary)"}`,
        padding: featured ? "28px 26px 22px" : "20px 22px 16px",
        cursor: "pointer",
        transition: "box-shadow 0.2s, transform 0.18s",
        boxShadow: hover
          ? "0 8px 32px rgba(0,0,0,0.09)"
          : "0 1px 4px rgba(0,0,0,0.03)",
        transform: hover ? "translateY(-2px)" : "none",
      }}
    >
      {/* ── 발행자 헤더 ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <div style={{
            width: "22px", height: "22px",
            backgroundColor: "var(--text-primary)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <span style={{ color: "var(--bg-primary)", fontSize: "9px", fontWeight: 900, fontFamily: "Pretendard, sans-serif", letterSpacing: "-0.02em" }}>선</span>
          </div>
          <span style={{ fontSize: "11px", fontWeight: 700, fontFamily: "Inter, sans-serif", color: "var(--text-primary)", letterSpacing: "0.08em" }}>SEONIK</span>
          <span style={{ fontSize: "11px", color: "var(--text-disabled)", fontFamily: "Inter, sans-serif" }}>·</span>
          <span style={{ fontSize: "11px", color: "var(--text-placeholder)", fontFamily: "Inter, sans-serif" }}>{formatRelativeTime(post.createdAt)}</span>
        </div>
        <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", color: "var(--text-disabled)", letterSpacing: "0.06em" }}>
          {formatDate(post.createdAt)}
        </span>
      </div>

      {/* ── 분류 스탬프 + 배지 ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
        <span style={{
          fontSize: "9px", fontWeight: 700, letterSpacing: "0.18em",
          backgroundColor: "var(--text-primary)", color: "var(--bg-primary)",
          padding: "2px 9px", fontFamily: "Inter, sans-serif",
        }}>
          INTEL BRIEF
        </span>
        <span style={{ fontSize: "9px", color: "var(--text-disabled)", fontFamily: "Inter, sans-serif", letterSpacing: "0.1em", fontWeight: 600 }}>
          {post.code || formatDocId(index, post.createdAt)}
        </span>
        {featured && (
          <span style={{
            fontSize: "8px", fontWeight: 700, letterSpacing: "0.14em",
            border: "1px solid var(--text-primary)", color: "var(--text-primary)",
            padding: "1px 6px", fontFamily: "Inter, sans-serif", marginLeft: "2px",
          }}>LATEST</span>
        )}
        {/* 무료/구독 배지 */}
        {post.isFree ? (
          <span style={{
            marginLeft: "auto", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em",
            color: "#16A34A", border: "1px solid #16A34A", padding: "1px 7px",
            fontFamily: "Inter, sans-serif",
          }}>🔓 무료</span>
        ) : (
          <span style={{
            marginLeft: "auto", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em",
            color: "#D4AF37", border: "1px solid #D4AF37", padding: "1px 7px",
            fontFamily: "Inter, sans-serif",
          }}>🔒 구독</span>
        )}
      </div>

      {/* ── 제목 ── */}
      <h2 style={{
        fontSize: featured ? "clamp(17px, 2.8vw, 22px)" : "clamp(14px, 2vw, 17px)",
        fontFamily: "'Pretendard', sans-serif", fontWeight: 800,
        color: "var(--text-primary)", lineHeight: 1.35, letterSpacing: "-0.02em",
        marginBottom: "8px", wordBreak: "break-word",
      }}>
        {post.title}
      </h2>

      {/* ── 출처 ── */}
      {post.source && (
        <p style={{
          fontSize: "11px", fontFamily: "'Pretendard', sans-serif",
          color: "var(--text-placeholder)", lineHeight: 1.6, marginBottom: "8px",
        }}>
          📡 출처: {post.source}
        </p>
      )}

      {/* ── 요약 ── */}
      {post.summary && (
        <p style={{
          fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
          color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: "12px",
          display: "-webkit-box",
          WebkitLineClamp: featured ? 3 : 2,
          WebkitBoxOrient: "vertical" as React.CSSProperties["WebkitBoxOrient"],
          overflow: "hidden",
        }}>
          {post.summary}
        </p>
      )}

      {/* ── 잠금 블러 (구독 전용 + 비구독자) ── */}
      {isLocked && (
        <div style={{
          position: "relative", marginBottom: "12px",
          padding: "14px 18px",
          backgroundColor: "var(--bg-subtle)",
          border: "1px solid #D4AF37",
          filter: "blur(2px)",
          userSelect: "none",
        }}>
          <p style={{ fontSize: "13px", color: "var(--text-muted)", margin: 0, fontFamily: "'Pretendard', sans-serif" }}>
            전략 가이드와 실행 체크리스트는 구독 후 열람 가능합니다.
          </p>
        </div>
      )}

      {/* ── 인게이지먼트 바 ── */}
      <div style={{
        display: "flex", alignItems: "center", gap: "14px",
        borderTop: "1px solid var(--border-light)", paddingTop: "12px",
        fontFamily: "Inter, sans-serif", fontSize: "11px",
      }}>
        <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-muted)" }}>
          <Check size={10} strokeWidth={2.5} />
          {post.likeCount ?? 0}
        </span>
        {post.viewCount != null && (
          <span style={{ display: "flex", alignItems: "center", gap: "4px", color: "var(--text-placeholder)" }}>
            <Eye size={10} strokeWidth={2} />
            {post.viewCount}
          </span>
        )}
        {isLocked ? (
          <span style={{
            marginLeft: "auto", fontWeight: 700, letterSpacing: "0.1em",
            color: "#D4AF37", display: "flex", alignItems: "center", gap: "4px", fontSize: "10px",
          }}>
            <Lock size={10} /> 구독하고 전략 받기
          </span>
        ) : (
          <span style={{
            marginLeft: "auto", fontWeight: 700, letterSpacing: "0.1em",
            color: hover ? "var(--text-primary)" : "var(--text-muted)",
            display: "flex", alignItems: "center", gap: "4px",
            transition: "color 0.15s", fontSize: "10px",
          }}>
            READ BRIEF <ArrowRight size={10} strokeWidth={2.5} />
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

  const [lead, ...rest] = posts;

  return (
    <>
      <div style={{ backgroundColor: "var(--bg-subtle)", minHeight: "70vh", paddingBottom: "96px" }}>
        {/* ── 피드 서브헤더 (sticky) ── */}
        <div style={{
          backgroundColor: "var(--header-bg)", borderBottom: "1px solid var(--border)",
          position: "sticky", top: "64px", zIndex: 10,
        }}>
          <div style={{
            maxWidth: "720px", margin: "0 auto", padding: "9px 20px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", fontFamily: "Inter, sans-serif" }}>
              <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em", color: "var(--text-primary)" }}>INTEL FEED</span>
              <span style={{ width: "1px", height: "10px", backgroundColor: "var(--border)", display: "inline-block" }} />
              <span style={{ fontSize: "10px", letterSpacing: "0.1em", color: "var(--text-placeholder)", fontWeight: 500 }}>SEONIK INTELLIGENCE</span>
            </div>
            {!loading && posts.length > 0 && (
              <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", color: "var(--text-disabled)", letterSpacing: "0.06em" }}>
                {posts.length}{cursor ? "+" : ""}건
              </span>
            )}
          </div>
        </div>

        {/* ── 피드 컨텐츠 ── */}
        <div style={{ maxWidth: "720px", margin: "0 auto", padding: "20px 20px 0" }}>
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

          {!loading && posts.length === 0 && (
            <div style={{ textAlign: "center", paddingTop: "96px" }}>
              <p style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "var(--text-disabled)", letterSpacing: "0.1em" }}>
                NO BRIEFINGS AVAILABLE
              </p>
            </div>
          )}

          {!loading && posts.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[lead, ...rest].map((post, i) =>
                post && (
                  <BriefCard
                    key={post.id}
                    post={post}
                    index={i}
                    featured={i === 0}
                    onClick={() => setSelectedPost(post)}
                  />
                )
              )}

              {cursor && (
                <div style={{ display: "flex", justifyContent: "center", paddingTop: "20px", paddingBottom: "8px" }}>
                  <button
                    onClick={loadMore}
                    disabled={loadingMore}
                    style={{
                      fontFamily: "Inter, sans-serif", fontSize: "10px", letterSpacing: "0.14em",
                      fontWeight: 700, color: "var(--text-muted)", background: "none",
                      border: "1px solid var(--border)", cursor: loadingMore ? "not-allowed" : "pointer",
                      opacity: loadingMore ? 0.5 : 1, padding: "10px 28px", transition: "all 0.15s",
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
                    {loadingMore ? "LOADING..." : "LOAD MORE ↓"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}
