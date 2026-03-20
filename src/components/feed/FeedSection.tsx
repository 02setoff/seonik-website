"use client";

import { useState, useEffect } from "react";
import { Check, Eye } from "lucide-react";
import PostModal, { PostItem } from "./PostModal";

// 카테고리별 좌측 포인트 컬러
const CATEGORY_ACCENT: Record<string, string> = {
  RADAR: "#0F172A",
  CORE:  "#334155",
  FLASH: "#64748B",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  }).replace(/\. /g, ".").replace(/\.$/, "");
}

// ── 피처드 카드 (최신 글 1개, 전체 폭) ──────────────────────────
function FeaturedCard({ post, onClick }: { post: PostItem; onClick: () => void }) {
  const accent = CATEGORY_ACCENT[post.category] ?? CATEGORY_ACCENT.RADAR;
  return (
    <button
      onClick={onClick}
      className="group w-full text-left transition-all duration-200 ease-out hover:shadow-[0_6px_24px_rgba(0,0,0,0.10)] hover:-translate-y-0.5"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderLeft: `4px solid ${accent}`,
        borderRadius: 0,
        display: "grid",
        gridTemplateColumns: "1fr auto",
      }}
    >
      <div style={{ padding: "clamp(24px,4vw,40px)" }}>
        {/* 배지 + 날짜 */}
        <div className="flex items-center gap-3 mb-4">
          <span style={{
            fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700,
            letterSpacing: "0.12em", padding: "3px 10px",
            backgroundColor: "var(--bg-subtle)", color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}>
            {post.category}
          </span>
          <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)" }}>
            LATEST
          </span>
        </div>

        {/* 제목 */}
        <h2 style={{
          fontSize: "clamp(18px,3vw,26px)",
          fontFamily: "'Pretendard', sans-serif",
          fontWeight: 800,
          color: "var(--text-primary)",
          lineHeight: 1.35,
          letterSpacing: "-0.02em",
          marginBottom: post.summary ? "16px" : "24px",
          wordBreak: "break-word",
        }}>
          {post.title}
        </h2>

        {/* 요약 */}
        {post.summary && (
          <p style={{
            fontSize: "clamp(13px,2vw,15px)",
            fontFamily: "'Pretendard', sans-serif",
            color: "var(--text-muted)",
            lineHeight: 1.75,
            marginBottom: "24px",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as React.CSSProperties["WebkitBoxOrient"],
            overflow: "hidden",
          }}>
            {post.summary}
          </p>
        )}

        {/* 메타 */}
        <div className="flex items-center gap-4" style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}>
          <span style={{ color: "var(--text-placeholder)" }}>{formatDate(post.createdAt)}</span>
          <span className="flex items-center gap-1 font-bold" style={{ color: "var(--text-secondary)" }}>
            <Check size={11} strokeWidth={2.5} />
            {post.likeCount ?? 0}
          </span>
          {post.viewCount != null && (
            <span className="flex items-center gap-1" style={{ color: "var(--text-placeholder)" }}>
              <Eye size={11} strokeWidth={2} />
              {post.viewCount}
            </span>
          )}
          <span style={{
            fontSize: "11px", fontFamily: "Inter, sans-serif", fontWeight: 600,
            color: "var(--text-primary)", letterSpacing: "0.05em",
            borderBottom: "1px solid var(--text-primary)", paddingBottom: "1px",
            marginLeft: "auto",
          }}>
            READ BRIEFING →
          </span>
        </div>
      </div>
    </button>
  );
}

// ── 일반 카드 ────────────────────────────────────────────────────
function PostCard({ post, onClick }: { post: PostItem; onClick: () => void }) {
  const accent = CATEGORY_ACCENT[post.category] ?? CATEGORY_ACCENT.RADAR;
  return (
    <button
      onClick={onClick}
      className="group overflow-hidden text-left transition-all duration-200 ease-out hover:shadow-[0_4px_16px_rgba(0,0,0,0.10)] hover:-translate-y-1"
      style={{
        backgroundColor: "var(--bg-card)",
        border: "1px solid var(--border)",
        borderTop: `3px solid ${accent}`,
        borderRadius: 0,
        display: "flex", flexDirection: "column",
      }}
    >
      <div style={{ padding: "20px 20px 16px", flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
        {/* 카테고리 배지 */}
        <span style={{
          fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700,
          letterSpacing: "0.12em", color: "var(--text-placeholder)", alignSelf: "flex-start",
        }}>
          {post.category}
        </span>

        {/* 제목 */}
        <p className="font-bold leading-snug line-clamp-3"
          style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-primary)", flex: 1 }}>
          {post.title}
        </p>

        {/* 요약 (있을 때만) */}
        {post.summary && (
          <p className="line-clamp-2"
            style={{ fontSize: "12px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)", lineHeight: 1.65 }}>
            {post.summary}
          </p>
        )}
      </div>

      {/* 하단 메타 */}
      <div className="flex items-center justify-between"
        style={{ padding: "10px 20px", borderTop: "1px solid var(--border)" }}>
        <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "var(--text-disabled)" }}>
          {formatDate(post.createdAt)}
        </span>
        <div className="flex items-center gap-3" style={{ fontSize: "11px", fontFamily: "Inter, sans-serif" }}>
          <span className="flex items-center gap-1 font-bold" style={{ color: "var(--text-secondary)" }}>
            <Check size={10} strokeWidth={2.5} />
            {post.likeCount ?? 0}
          </span>
          {post.viewCount != null && (
            <span className="flex items-center gap-1" style={{ color: "var(--text-placeholder)" }}>
              <Eye size={10} strokeWidth={2} />
              {post.viewCount}
            </span>
          )}
        </div>
      </div>
    </button>
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
      .then(r => r.json())
      .then((data: { posts: PostItem[]; nextCursor: string | null }) => {
        setPosts(data.posts ?? []);
        setCursor(data.nextCursor ?? null);
        setLoading(false);
        try {
          const params = new URLSearchParams(window.location.search);
          const postId = params.get("p");
          if (postId) {
            const found = (data.posts ?? []).find(p => p.id === postId);
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
      setPosts(prev => [...prev, ...(data.posts ?? [])]);
      setCursor(data.nextCursor ?? null);
    } catch {}
    finally { setLoadingMore(false); }
  };

  const [featured, ...rest] = posts;

  return (
    <>
      <div className="pb-20" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="mx-auto px-5 md:px-10" style={{ maxWidth: "1280px" }}>

          {/* 로딩 */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-1">
              <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 700, fontSize: "22px", color: "var(--text-primary)", lineHeight: 1 }}>선익</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", letterSpacing: "0.15em", color: "var(--text-placeholder)", marginTop: "3px" }}>SEONIK</p>
              <div className="flex gap-1.5 mt-4">
                {[0, 150, 300].map(delay => (
                  <span key={delay} className="animate-bounce" style={{
                    display: "block", width: "4px", height: "4px", borderRadius: "50%",
                    backgroundColor: "var(--text-muted)", animationDelay: `${delay}ms`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {!loading && (
            <div style={{ marginTop: "40px" }}>

              {/* 섹션 헤더 */}
              <div className="flex flex-wrap items-baseline justify-between gap-4 mb-8">
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="font-bold tracking-[0.05em]"
                    style={{ fontSize: "clamp(15px,3.5vw,18px)", fontFamily: "Inter, sans-serif", color: "var(--text-primary)" }}>
                    BRIEFING
                  </span>
                  <span style={{ fontSize: "clamp(15px,3.5vw,18px)", color: "var(--text-placeholder)" }}>—</span>
                  <span className="font-normal"
                    style={{ fontSize: "clamp(13px,3vw,15px)", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)" }}>
                    앞서나가는 실행가를 위한 브리핑
                  </span>
                </div>
                {posts.length > 0 && (
                  <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "var(--text-disabled)" }}>
                    {posts.length}{cursor ? "+" : ""}개
                  </span>
                )}
              </div>

              {posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-disabled)" }}>
                    아직 게시된 브리핑이 없습니다.
                  </p>
                </div>
              ) : (
                <>
                  {/* 피처드 카드 */}
                  {featured && (
                    <div className="mb-5">
                      <FeaturedCard post={featured} onClick={() => setSelectedPost(featured)} />
                    </div>
                  )}

                  {/* 나머지 그리드 */}
                  {rest.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                      {rest.map(post => (
                        <PostCard key={post.id} post={post} onClick={() => setSelectedPost(post)} />
                      ))}
                    </div>
                  )}

                  {/* 더 보기 */}
                  {cursor && (
                    <div className="flex justify-center mt-12">
                      <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        style={{
                          border: "1px solid var(--border)",
                          padding: "12px 48px",
                          fontSize: "12px", fontFamily: "Inter, sans-serif",
                          letterSpacing: "0.08em", color: "var(--text-secondary)",
                          background: "none", cursor: loadingMore ? "not-allowed" : "pointer",
                          opacity: loadingMore ? 0.6 : 1, transition: "all 0.2s",
                        }}
                        onMouseEnter={e => { if (!loadingMore) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-hover)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}>
                        {loadingMore ? "불러오는 중..." : "MORE BRIEFINGS"}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}
