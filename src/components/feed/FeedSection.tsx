"use client";

import { useState, useEffect } from "react";
import { Eye, Check } from "lucide-react";
import { useRouter } from "next/navigation";

interface FeedPost {
  id: string;
  title: string;
  summary: string | null;
  postType: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// ── 포스트 타입 배지 ──────────────────────────────────────────────
function TypeBadge({ type }: { type: string }) {
  if (type === "BRIEFING") {
    return (
      <span style={{
        fontSize: "9px", fontFamily: "Courier New, monospace", fontWeight: 700,
        letterSpacing: "0.2em", color: "var(--text-primary)",
        border: "1px solid var(--text-primary)",
        padding: "2px 7px", whiteSpace: "nowrap", flexShrink: 0,
      }}>BRIEFING</span>
    );
  }
  if (type === "NOTICE") {
    return (
      <span style={{
        fontSize: "9px", fontFamily: "Courier New, monospace", fontWeight: 700,
        letterSpacing: "0.18em", color: "#64748B",
        border: "1px solid #CBD5E1",
        padding: "2px 7px", whiteSpace: "nowrap", flexShrink: 0,
      }}>공지</span>
    );
  }
  return null; // GENERAL은 배지 없음
}

// ── 피드 아이템 ───────────────────────────────────────────────────
function FeedItem({ post }: { post: FeedPost }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);

  const oneLine = post.summary
    ? post.summary.replace(/<[^>]*>/g, "").slice(0, 120) + (post.summary.replace(/<[^>]*>/g, "").length > 120 ? "…" : "")
    : null;

  return (
    <div
      onClick={() => router.push(`/post/${post.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "20px 16px",
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
        backgroundColor: hovered ? "var(--bg-hover)" : "transparent",
        transition: "background-color 0.12s",
      }}
    >
      {/* 타입 배지 + 날짜 */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        marginBottom: "10px",
      }}>
        <TypeBadge type={post.postType ?? "BRIEFING"} />
        <span style={{
          fontSize: "11px", fontFamily: "Courier New, monospace",
          color: "var(--text-placeholder)", letterSpacing: "0.06em",
        }}>{formatDate(post.createdAt)}</span>
      </div>

      {/* 제목 */}
      <h2 style={{
        fontSize: "clamp(15px, 2.2vw, 18px)",
        fontFamily: "'Pretendard', sans-serif",
        fontWeight: 700,
        color: "var(--text-primary)",
        letterSpacing: "-0.01em",
        lineHeight: 1.4,
        margin: "0 0 7px",
        wordBreak: "break-word",
      }}>
        {post.title}
      </h2>

      {/* 한줄 요약 */}
      {oneLine && (
        <p style={{
          fontSize: "13px",
          fontFamily: "'Pretendard', sans-serif",
          color: "var(--text-muted)",
          lineHeight: 1.65,
          margin: "0 0 12px",
          wordBreak: "break-word",
        }}>
          {oneLine}
        </p>
      )}

      {/* 통계 */}
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <span style={{
          fontSize: "11px", fontFamily: "Courier New, monospace",
          color: "var(--text-disabled)", letterSpacing: "0.04em",
          display: "flex", alignItems: "center", gap: "4px",
        }}>
          <Eye size={10} strokeWidth={1.5} />
          {post.viewCount}
        </span>
        <span style={{
          fontSize: "11px", fontFamily: "Courier New, monospace",
          color: "var(--text-disabled)", letterSpacing: "0.04em",
          display: "flex", alignItems: "center", gap: "4px",
        }}>
          <Check size={10} strokeWidth={2} />
          {post.likeCount}
        </span>
      </div>
    </div>
  );
}

// ── 메인 피드 섹션 ────────────────────────────────────────────────
export default function FeedSection() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetch("/api/posts?take=20")
      .then((r) => r.json())
      .then((data: { posts: FeedPost[]; nextCursor: string | null }) => {
        setPosts(data.posts ?? []);
        setCursor(data.nextCursor ?? null);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/posts?take=20&cursor=${cursor}`);
      const data: { posts: FeedPost[]; nextCursor: string | null } = await res.json();
      setPosts((prev) => [...prev, ...(data.posts ?? [])]);
      setCursor(data.nextCursor ?? null);
    } catch {}
    finally { setLoadingMore(false); }
  };

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "70vh", paddingBottom: "120px" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px clamp(16px, 4vw, 24px) 0" }}>

        {/* 로딩 */}
        {loading && (
          <div style={{ paddingTop: "80px", textAlign: "center" }}>
            <p style={{
              fontFamily: "Courier New, monospace", fontSize: "10px",
              letterSpacing: "0.22em", color: "var(--text-placeholder)",
            }}>LOADING...</p>
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && posts.length === 0 && (
          <div style={{ paddingTop: "80px", textAlign: "center" }}>
            <p style={{
              fontFamily: "Courier New, monospace", fontSize: "10px",
              letterSpacing: "0.22em", color: "var(--text-disabled)",
            }}>게시된 글이 없습니다.</p>
          </div>
        )}

        {/* 피드 목록 */}
        {!loading && posts.length > 0 && (
          <>
            <div style={{ borderTop: "1px solid var(--border)" }}>
              {posts.map((post) => (
                <FeedItem key={post.id} post={post} />
              ))}
            </div>

            {cursor && (
              <div style={{ textAlign: "center", paddingTop: "32px" }}>
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  style={{
                    fontFamily: "Courier New, monospace", fontSize: "10px",
                    fontWeight: 700, letterSpacing: "0.2em",
                    color: "var(--text-muted)", background: "none",
                    border: "1px solid var(--border)",
                    cursor: loadingMore ? "not-allowed" : "pointer",
                    opacity: loadingMore ? 0.5 : 1,
                    padding: "10px 36px", transition: "all 0.15s",
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
  );
}
