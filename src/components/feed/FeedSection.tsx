"use client";

import { useState, useEffect } from "react";
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
  return Math.max(1, Math.ceil(text.replace(/<[^>]*>/g, "").length / 400));
}

function stripHtml(text: string | null) {
  if (!text) return null;
  return text.replace(/<[^>]*>/g, "");
}

// ── 커버스토리 (첫 번째 브리핑) ───────────────────────────────────
function CoverStory({ post, index }: { post: FeedPost; index: number }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const summary = stripHtml(post.summary);
  const lead = summary ? summary.slice(0, 200) + (summary.length > 200 ? "…" : "") : null;

  return (
    <article
      onClick={() => router.push(`/post/${post.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: "pointer", padding: "48px 0 52px" }}
    >
      {/* 에디션 메타 */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: "32px",
      }}>
        <span style={{
          fontSize: "10px", fontFamily: "Inter, monospace", fontWeight: 700,
          letterSpacing: "0.25em", color: "var(--text-placeholder)",
          textTransform: "uppercase",
        }}>
          {post.postType === "NOTICE" ? "Notice" : "Cover Story"}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{
            fontSize: "10px", fontFamily: "Inter, monospace",
            color: "var(--text-disabled)", letterSpacing: "0.12em",
          }}>
            {formatDate(post.createdAt)}
          </span>
          <span style={{
            fontSize: "10px", fontFamily: "Inter, monospace",
            color: "var(--text-disabled)", letterSpacing: "0.15em",
          }}>
            #{String(index + 1).padStart(3, "0")}
          </span>
        </div>
      </div>

      {/* 큰 제목 */}
      <h1 style={{
        fontSize: "clamp(32px, 5vw, 52px)",
        fontFamily: "'Pretendard', sans-serif",
        fontWeight: 900,
        color: "var(--text-primary)",
        letterSpacing: "-0.035em",
        lineHeight: 1.1,
        margin: 0,
        transition: "opacity 0.2s",
        opacity: hovered ? 0.75 : 1,
        wordBreak: "keep-all",
      }}>
        {post.title}
      </h1>

      {/* 리드 문장 */}
      {lead && (
        <p style={{
          fontSize: "17px",
          fontFamily: "'Pretendard', sans-serif",
          color: "var(--text-muted)",
          lineHeight: 1.85,
          margin: "24px 0 0",
          maxWidth: "560px",
          wordBreak: "keep-all",
        }}>
          {lead}
        </p>
      )}

      {/* 읽기 링크 */}
      <div style={{ marginTop: "28px", display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{
          fontSize: "12px", fontFamily: "Inter, sans-serif", fontWeight: 700,
          color: "var(--text-primary)", letterSpacing: "0.12em",
          textTransform: "uppercase",
          borderBottom: `1px solid ${hovered ? "var(--text-primary)" : "transparent"}`,
          transition: "border-color 0.2s",
          paddingBottom: "1px",
        }}>
          Read
        </span>
        <span style={{
          fontSize: "12px", color: "var(--text-primary)",
          transform: hovered ? "translateX(4px)" : "translateX(0)",
          transition: "transform 0.2s",
          display: "inline-block",
        }}>→</span>
      </div>
    </article>
  );
}

// ── 일반 브리핑 아이템 ─────────────────────────────────────────────
function BriefingItem({ post, index }: { post: FeedPost; index: number }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const summary = stripHtml(post.summary);
  const lead = summary ? summary.slice(0, 110) + (summary.length > 110 ? "…" : "") : null;
  const readTime = estimateReadTime(post.summary);

  return (
    <article
      onClick={() => router.push(`/post/${post.id}`)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "32px 0",
        borderTop: "1px solid var(--border)",
        cursor: "pointer",
        display: "grid",
        gridTemplateColumns: "40px 1fr",
        gap: "0 24px",
        alignItems: "start",
      }}
    >
      {/* 인덱스 번호 */}
      <span style={{
        fontSize: "11px", fontFamily: "Inter, monospace",
        color: "var(--text-disabled)", letterSpacing: "0.1em",
        paddingTop: "4px",
      }}>
        {String(index + 1).padStart(3, "0")}
      </span>

      <div>
        {/* 메타 */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          {post.postType === "NOTICE" && (
            <span style={{
              fontSize: "9px", fontFamily: "Inter, monospace", fontWeight: 700,
              letterSpacing: "0.18em", color: "#64748B",
              border: "1px solid #CBD5E1", padding: "2px 8px",
            }}>NOTICE</span>
          )}
          <span style={{
            fontSize: "11px", fontFamily: "Inter, monospace",
            color: "var(--text-placeholder)", letterSpacing: "0.08em",
          }}>
            {formatDate(post.createdAt)}
          </span>
          <span style={{ fontSize: "10px", color: "var(--text-disabled)", fontFamily: "Inter" }}>·</span>
          <span style={{ fontSize: "11px", fontFamily: "Inter", color: "var(--text-disabled)" }}>
            {readTime}min read
          </span>
        </div>

        {/* 제목 */}
        <h2 style={{
          fontSize: "clamp(17px, 2.2vw, 22px)",
          fontFamily: "'Pretendard', sans-serif",
          fontWeight: 800,
          color: "var(--text-primary)",
          letterSpacing: "-0.025em",
          lineHeight: 1.25,
          margin: "0 0 10px",
          wordBreak: "keep-all",
          opacity: hovered ? 0.75 : 1,
          transition: "opacity 0.15s",
        }}>
          {post.title}
        </h2>

        {/* 요약 */}
        {lead && (
          <p style={{
            fontSize: "14px",
            fontFamily: "'Pretendard', sans-serif",
            color: "var(--text-muted)",
            lineHeight: 1.75,
            margin: 0,
            wordBreak: "keep-all",
          }}>
            {lead}
          </p>
        )}
      </div>
    </article>
  );
}

// ── 섹션 헤더 ─────────────────────────────────────────────────────
function MagazineHeader({ edition }: { edition: number }) {
  const now = new Date();
  const dateStr = `${now.getFullYear()} · ${now.toLocaleString("en-US", { month: "long" })}`;

  return (
    <div style={{ paddingTop: "40px", marginBottom: "0" }}>
      <div style={{
        display: "flex", alignItems: "baseline",
        justifyContent: "space-between",
        paddingBottom: "14px",
        borderBottom: "2.5px solid var(--text-primary)",
      }}>
        <span style={{
          fontSize: "11px", fontFamily: "Inter, sans-serif",
          fontWeight: 700, letterSpacing: "0.28em",
          color: "var(--text-primary)", textTransform: "uppercase",
        }}>
          Intelligence Briefing
        </span>
        <span style={{
          fontSize: "11px", fontFamily: "Inter, monospace",
          color: "var(--text-placeholder)", letterSpacing: "0.1em",
        }}>
          {dateStr} · No.{String(edition).padStart(3, "0")}
        </span>
      </div>
    </div>
  );
}

// ── 메인 피드 ─────────────────────────────────────────────────────
export default function FeedSection() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetch("/api/posts?take=20")
      .then(r => r.json())
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
      setPosts(prev => [...prev, ...(data.posts ?? [])]);
      setCursor(data.nextCursor ?? null);
    } catch {}
    finally { setLoadingMore(false); }
  };

  const coverPost = posts[0] ?? null;
  const restPosts = posts.slice(1);
  const edition = posts.length;

  return (
    <div style={{ backgroundColor: "var(--bg-primary)" }}>
      <div style={{
        maxWidth: "720px", margin: "0 auto",
        padding: "0 clamp(24px, 5vw, 48px) 120px",
      }}>

        {/* 로딩 */}
        {loading && (
          <div style={{ paddingTop: "120px", textAlign: "center" }}>
            <p style={{
              fontFamily: "Inter, monospace", fontSize: "10px",
              letterSpacing: "0.3em", color: "var(--text-placeholder)",
            }}>LOADING</p>
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && posts.length === 0 && (
          <div style={{ paddingTop: "120px", textAlign: "center" }}>
            <p style={{
              fontFamily: "Inter, monospace", fontSize: "10px",
              letterSpacing: "0.25em", color: "var(--text-disabled)",
            }}>NO BRIEFINGS YET</p>
          </div>
        )}

        {/* 매거진 레이아웃 */}
        {!loading && posts.length > 0 && (
          <>
            <MagazineHeader edition={edition} />

            {/* 커버스토리 */}
            <CoverStory post={coverPost!} index={0} />

            {/* 구분선 */}
            <div style={{
              height: "2px",
              background: "linear-gradient(90deg, var(--text-primary) 0%, transparent 100%)",
              marginBottom: "0",
            }} />

            {/* 나머지 브리핑 */}
            {restPosts.map((post, i) => (
              <BriefingItem key={post.id} post={post} index={i + 1} />
            ))}

            {/* 더 보기 */}
            {cursor && (
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "40px", textAlign: "center" }}>
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  style={{
                    fontFamily: "Inter, monospace", fontSize: "10px",
                    fontWeight: 700, letterSpacing: "0.25em",
                    color: "var(--text-muted)", background: "none",
                    border: "1px solid var(--border)",
                    cursor: loadingMore ? "not-allowed" : "pointer",
                    opacity: loadingMore ? 0.5 : 1,
                    padding: "12px 48px", transition: "all 0.15s",
                    textTransform: "uppercase",
                  }}
                  onMouseEnter={e => { if (!loadingMore) { (e.currentTarget).style.borderColor = "var(--text-primary)"; (e.currentTarget).style.color = "var(--text-primary)"; }}}
                  onMouseLeave={e => { (e.currentTarget).style.borderColor = "var(--border)"; (e.currentTarget).style.color = "var(--text-muted)"; }}
                >
                  {loadingMore ? "Loading..." : "More"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
