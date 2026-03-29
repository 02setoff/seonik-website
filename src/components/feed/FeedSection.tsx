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

function estimateReadTime(text: string | null) {
  if (!text) return 1;
  const plain = text.replace(/<[^>]*>/g, "");
  return Math.max(1, Math.ceil(plain.length / 400));
}

// ── 타입 배지 ──────────────────────────────────────────────────────
function TypeBadge({ type }: { type: string }) {
  if (type === "BRIEFING") {
    return (
      <span style={{
        fontSize: "9px", fontFamily: "Inter, monospace", fontWeight: 700,
        letterSpacing: "0.18em", color: "var(--text-primary)",
        border: "1px solid var(--text-primary)",
        padding: "2px 8px", whiteSpace: "nowrap", flexShrink: 0,
      }}>BRIEFING</span>
    );
  }
  if (type === "NOTICE") {
    return (
      <span style={{
        fontSize: "9px", fontFamily: "Inter, monospace", fontWeight: 700,
        letterSpacing: "0.15em", color: "#64748B",
        border: "1px solid #CBD5E1",
        padding: "2px 8px", whiteSpace: "nowrap", flexShrink: 0,
      }}>NOTICE</span>
    );
  }
  return null;
}

// ── 피드 아이템 ───────────────────────────────────────────────────
function FeedItem({ post, index }: { post: FeedPost; index: number }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const isBriefing = post.postType === "BRIEFING";

  const summaryText = post.summary
    ? post.summary.replace(/<[^>]*>/g, "")
    : null;
  const summary = summaryText
    ? summaryText.slice(0, 140) + (summaryText.length > 140 ? "…" : "")
    : null;

  const readTime = estimateReadTime(post.summary);

  return (
    <article
      onClick={() => router.push(`/post/${post.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "28px 0 24px",
        borderBottom: "1px solid var(--border)",
        cursor: "pointer",
        position: "relative",
        transition: "background-color 0.15s",
      }}
    >
      {/* 호버 시 왼쪽 액센트 바 */}
      <div style={{
        position: "absolute", left: "-24px", top: 0, bottom: 0,
        width: "2px",
        backgroundColor: hovered ? "var(--text-primary)" : "transparent",
        transition: "background-color 0.2s ease",
      }} />

      {/* 상단: 배지 + 날짜 + 인덱스 */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "12px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <TypeBadge type={post.postType ?? "BRIEFING"} />
          <span style={{
            fontSize: "11px", fontFamily: "Inter, monospace",
            color: "var(--text-placeholder)", letterSpacing: "0.08em",
          }}>
            {formatDate(post.createdAt)}
          </span>
        </div>
        {isBriefing && (
          <span style={{
            fontSize: "10px", fontFamily: "Inter, monospace",
            color: "var(--text-disabled)", letterSpacing: "0.15em",
          }}>
            #{String(index + 1).padStart(3, "0")}
          </span>
        )}
      </div>

      {/* 제목 */}
      <h2 style={{
        fontSize: "clamp(17px, 2.5vw, 21px)",
        fontFamily: "'Pretendard', sans-serif",
        fontWeight: 800,
        color: "var(--text-primary)",
        letterSpacing: "-0.025em",
        lineHeight: 1.35,
        margin: "0 0 10px",
        wordBreak: "break-word",
        transition: "opacity 0.15s",
        opacity: hovered ? 0.85 : 1,
      }}>
        {post.title}
      </h2>

      {/* 요약 */}
      {summary && (
        <p style={{
          fontSize: "13.5px",
          fontFamily: "'Pretendard', sans-serif",
          color: "var(--text-muted)",
          lineHeight: 1.8,
          margin: "0 0 16px",
          wordBreak: "break-word",
        }}>
          {summary}
        </p>
      )}

      {/* 메타 정보 */}
      <div style={{
        display: "flex", alignItems: "center", gap: "14px",
        marginTop: summary ? "0" : "12px",
      }}>
        <span style={{
          fontSize: "11px", fontFamily: "Inter, monospace",
          color: "var(--text-disabled)", letterSpacing: "0.04em",
          display: "flex", alignItems: "center", gap: "4px",
        }}>
          <Eye size={10} strokeWidth={1.5} />
          {post.viewCount}
        </span>
        <span style={{
          fontSize: "11px", fontFamily: "Inter, monospace",
          color: "var(--text-disabled)", letterSpacing: "0.04em",
          display: "flex", alignItems: "center", gap: "4px",
        }}>
          <Check size={10} strokeWidth={2} />
          {post.likeCount}
        </span>
        {isBriefing && (
          <>
            <span style={{ fontSize: "10px", color: "var(--text-disabled)", fontFamily: "Inter" }}>·</span>
            <span style={{
              fontSize: "11px", fontFamily: "Inter, monospace",
              color: "var(--text-disabled)", letterSpacing: "0.04em",
            }}>
              {readTime}min read
            </span>
          </>
        )}
      </div>
    </article>
  );
}

// ── 섹션 헤더 ─────────────────────────────────────────────────────
function SectionHeader() {
  return (
    <div style={{ paddingBottom: "20px", marginBottom: "0" }}>
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        paddingBottom: "12px",
        borderBottom: "2px solid var(--text-primary)",
      }}>
        <span style={{
          fontSize: "10px", fontFamily: "Inter, sans-serif",
          fontWeight: 700, letterSpacing: "0.2em",
          color: "var(--text-primary)",
          textTransform: "uppercase",
        }}>
          Intelligence Briefing
        </span>
        <span style={{
          fontSize: "10px", fontFamily: "Inter, monospace",
          color: "var(--text-placeholder)", letterSpacing: "0.1em",
        }}>
          SEONIK
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
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "70vh" }}>
      <div style={{
        maxWidth: "680px", margin: "0 auto",
        padding: "48px clamp(24px, 5vw, 40px) 80px",
      }}>

        {/* 로딩 */}
        {loading && (
          <div style={{ paddingTop: "100px", textAlign: "center" }}>
            <p style={{
              fontFamily: "Inter, monospace", fontSize: "10px",
              letterSpacing: "0.25em", color: "var(--text-placeholder)",
            }}>LOADING...</p>
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && posts.length === 0 && (
          <div style={{ paddingTop: "100px", textAlign: "center" }}>
            <p style={{
              fontFamily: "Inter, monospace", fontSize: "10px",
              letterSpacing: "0.2em", color: "var(--text-disabled)",
            }}>NO BRIEFINGS YET</p>
          </div>
        )}

        {/* 피드 목록 */}
        {!loading && posts.length > 0 && (
          <>
            <SectionHeader />
            <div style={{ paddingLeft: "24px" }}>
              {posts.map((post, i) => (
                <FeedItem key={post.id} post={post} index={i} />
              ))}
            </div>

            {cursor && (
              <div style={{ textAlign: "center", paddingTop: "40px" }}>
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  style={{
                    fontFamily: "Inter, monospace", fontSize: "10px",
                    fontWeight: 700, letterSpacing: "0.2em",
                    color: "var(--text-muted)", background: "none",
                    border: "1px solid var(--border)",
                    cursor: loadingMore ? "not-allowed" : "pointer",
                    opacity: loadingMore ? 0.5 : 1,
                    padding: "11px 40px", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { if (!loadingMore) { (e.currentTarget).style.borderColor = "var(--text-primary)"; (e.currentTarget).style.color = "var(--text-primary)"; } }}
                  onMouseLeave={e => { (e.currentTarget).style.borderColor = "var(--border)"; (e.currentTarget).style.color = "var(--text-muted)"; }}
                >
                  {loadingMore ? "LOADING..." : "MORE"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
