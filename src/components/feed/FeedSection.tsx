"use client";

import { useState, useEffect } from "react";
import { Check, Eye, ArrowRight, ChevronRight } from "lucide-react";
import PostModal, { PostItem } from "./PostModal";

function formatDate(iso: string) {
  const d = new Date(iso);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}.${mm}.${dd}`;
}

function formatDocId(index: number, iso: string) {
  const d = new Date(iso);
  const yy = String(d.getFullYear()).slice(2);
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `BRF-${yy}${mm}${dd}-${String(index + 1).padStart(3, "0")}`;
}

// ── 첫 번째: LEAD 문서 (전체폭, 강조) ────────────────────────────
function LeadEntry({ post, index, onClick }: { post: PostItem; index: number; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="w-full text-left"
      style={{
        display: "block",
        borderTop: "2px solid var(--text-primary)",
        borderBottom: "1px solid var(--border)",
        padding: "clamp(24px,4vw,40px) 0",
        background: hover ? "var(--bg-hover)" : "transparent",
        transition: "background 0.15s",
        cursor: "pointer",
      }}
    >
      {/* 문서 메타 헤더 */}
      <div className="flex items-center gap-3 mb-5" style={{ fontFamily: "Inter, sans-serif" }}>
        <span style={{
          fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em",
          backgroundColor: "var(--text-primary)",
          padding: "3px 10px",
          color: "var(--bg-primary)",
        }}>
          INTEL BRIEF
        </span>
        <span style={{ fontSize: "10px", letterSpacing: "0.1em", color: "var(--text-placeholder)", fontWeight: 600 }}>
          {formatDocId(index, post.createdAt)}
        </span>
        <span style={{ fontSize: "10px", color: "var(--border)", letterSpacing: "0.05em" }}>·</span>
        <span style={{ fontSize: "10px", letterSpacing: "0.08em", color: "var(--text-placeholder)" }}>
          {formatDate(post.createdAt)}
        </span>
      </div>

      {/* 제목 */}
      <h2 style={{
        fontSize: "clamp(20px,3.5vw,30px)",
        fontFamily: "'Pretendard', sans-serif",
        fontWeight: 800,
        color: "var(--text-primary)",
        lineHeight: 1.3,
        letterSpacing: "-0.025em",
        marginBottom: "16px",
        wordBreak: "break-word",
      }}>
        {post.title}
      </h2>

      {/* 요약 */}
      {post.summary && (
        <p style={{
          fontSize: "clamp(13px,2vw,15px)",
          fontFamily: "'Pretendard', sans-serif",
          color: "var(--text-secondary)",
          lineHeight: 1.8,
          marginBottom: "24px",
          maxWidth: "760px",
        }}>
          {post.summary}
        </p>
      )}

      {/* 하단 메타 */}
      <div className="flex items-center gap-5" style={{ fontFamily: "Inter, sans-serif", fontSize: "12px" }}>
        <span className="flex items-center gap-1.5" style={{ color: "var(--text-muted)" }}>
          <Check size={11} strokeWidth={2.5} />
          {post.likeCount ?? 0}
        </span>
        {post.viewCount != null && (
          <span className="flex items-center gap-1.5" style={{ color: "var(--text-placeholder)" }}>
            <Eye size={11} strokeWidth={2} />
            {post.viewCount}
          </span>
        )}
        <span className="flex items-center gap-1.5 font-semibold" style={{
          color: "var(--text-primary)", letterSpacing: "0.06em",
          marginLeft: "auto",
          fontSize: "11px",
        }}>
          FULL BRIEFING <ArrowRight size={12} strokeWidth={2} />
        </span>
      </div>
    </button>
  );
}

// ── 나머지: 문서 목록 엔트리 ─────────────────────────────────────
function DocEntry({ post, index, onClick }: { post: PostItem; index: number; onClick: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="w-full text-left"
      style={{
        display: "grid",
        gridTemplateColumns: "clamp(80px,18vw,120px) 1fr auto",
        gap: "clamp(16px,3vw,32px)",
        alignItems: "start",
        borderBottom: "1px solid var(--border)",
        padding: "20px 0",
        background: hover ? "var(--bg-hover)" : "transparent",
        transition: "background 0.15s",
        cursor: "pointer",
      }}
    >
      {/* 좌측: 문서번호 + 날짜 */}
      <div style={{ fontFamily: "Inter, sans-serif", paddingTop: "3px" }}>
        <p style={{ fontSize: "9px", letterSpacing: "0.12em", color: "var(--text-placeholder)", marginBottom: "4px", fontWeight: 600 }}>
          {formatDocId(index, post.createdAt)}
        </p>
        <p style={{ fontSize: "11px", color: "var(--text-disabled)" }}>
          {formatDate(post.createdAt)}
        </p>
      </div>

      {/* 중앙: 제목 + 요약 */}
      <div>
        <h3 style={{
          fontSize: "clamp(14px,2vw,16px)",
          fontFamily: "'Pretendard', sans-serif",
          fontWeight: 700,
          color: "var(--text-primary)",
          lineHeight: 1.4,
          marginBottom: post.summary ? "6px" : 0,
          wordBreak: "break-word",
        }}>
          {post.title}
        </h3>
        {post.summary && (
          <p style={{
            fontSize: "13px",
            fontFamily: "'Pretendard', sans-serif",
            color: "var(--text-muted)",
            lineHeight: 1.65,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as React.CSSProperties["WebkitBoxOrient"],
            overflow: "hidden",
          }}>
            {post.summary}
          </p>
        )}
      </div>

      {/* 우측: 통계 + 화살표 */}
      <div className="flex flex-col items-end gap-1.5" style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", paddingTop: "2px", flexShrink: 0 }}>
        <span className="flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
          <Check size={10} strokeWidth={2.5} />
          {post.likeCount ?? 0}
        </span>
        {post.viewCount != null && (
          <span className="flex items-center gap-1" style={{ color: "var(--text-placeholder)" }}>
            <Eye size={10} strokeWidth={2} />
            {post.viewCount}
          </span>
        )}
        <ChevronRight
          size={12} strokeWidth={2}
          style={{ color: hover ? "var(--text-primary)" : "var(--text-disabled)", transition: "color 0.15s", marginTop: "4px" }}
        />
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

  const today = (() => {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
  })();

  const [lead, ...rest] = posts;

  return (
    <>
      <div className="pb-24" style={{ backgroundColor: "var(--bg-primary)", minHeight: "70vh" }}>
        <div className="mx-auto px-5 md:px-10" style={{ maxWidth: "1100px" }}>

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

              {/* 문서 헤더 바 */}
              <div style={{
                borderTop: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
                padding: "10px 0",
                marginBottom: "0",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                flexWrap: "wrap",
                gap: "8px",
              }}>
                <div className="flex items-center gap-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.18em", color: "var(--text-primary)" }}>
                    SEONIK INTELLIGENCE
                  </span>
                  <span style={{ width: "1px", height: "12px", backgroundColor: "var(--border)", display: "inline-block" }} />
                  <span style={{ fontSize: "10px", letterSpacing: "0.1em", color: "var(--text-placeholder)", fontWeight: 500 }}>
                    BRIEFING INDEX
                  </span>
                </div>
                <div className="flex items-center gap-4" style={{ fontFamily: "Inter, sans-serif" }}>
                  <span style={{ fontSize: "10px", color: "var(--text-placeholder)", letterSpacing: "0.06em" }}>
                    {today}
                  </span>
                  {posts.length > 0 && (
                    <span style={{ fontSize: "10px", color: "var(--text-disabled)", letterSpacing: "0.06em" }}>
                      총 {posts.length}{cursor ? "+" : ""}건
                    </span>
                  )}
                </div>
              </div>

              {posts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32">
                  <p style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", color: "var(--text-disabled)", letterSpacing: "0.1em" }}>
                    NO BRIEFINGS AVAILABLE
                  </p>
                </div>
              ) : (
                <>
                  {/* 리드 문서 */}
                  {lead && (
                    <LeadEntry post={lead} index={0} onClick={() => setSelectedPost(lead)} />
                  )}

                  {/* 문서 목록 */}
                  {rest.map((post, i) => (
                    <DocEntry
                      key={post.id}
                      post={post}
                      index={i + 1}
                      onClick={() => setSelectedPost(post)}
                    />
                  ))}

                  {/* 더 보기 */}
                  {cursor && (
                    <div className="flex justify-center pt-10" style={{ borderTop: "1px solid var(--border)", marginTop: "0" }}>
                      <button
                        onClick={loadMore}
                        disabled={loadingMore}
                        style={{
                          fontFamily: "Inter, sans-serif",
                          fontSize: "11px", letterSpacing: "0.12em", fontWeight: 600,
                          color: "var(--text-muted)",
                          background: "none", border: "none",
                          cursor: loadingMore ? "not-allowed" : "pointer",
                          opacity: loadingMore ? 0.5 : 1,
                          padding: "8px 0",
                          transition: "color 0.15s",
                        }}
                        onMouseEnter={e => { if (!loadingMore) (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}>
                        {loadingMore ? "LOADING..." : "LOAD MORE BRIEFINGS ↓"}
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
