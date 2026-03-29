"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
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

const MONTHS_KR = ["1월","2월","3월","4월","5월","6월","7월","8월","9월","10월","11월","12월"];

function groupByYearMonth(posts: FeedPost[]) {
  const grouped: Record<number, Record<number, FeedPost[]>> = {};
  for (const post of posts) {
    const d = new Date(post.createdAt);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    if (!grouped[y]) grouped[y] = {};
    if (!grouped[y][m]) grouped[y][m] = [];
    grouped[y][m].push(post);
  }
  return grouped;
}

// ── 웰컴 섹션 ─────────────────────────────────────────────────────
function WelcomeSection({ name, memberCount }: { name: string; memberCount: number | null }) {
  return (
    <div style={{ padding: "80px 0 56px", textAlign: "center" }}>
      <h1 style={{
        fontSize: "clamp(26px, 3.5vw, 42px)",
        fontFamily: "'Pretendard', sans-serif",
        fontWeight: 900,
        color: "var(--text-primary)",
        letterSpacing: "-0.035em",
        lineHeight: 1.25,
        margin: 0,
        wordBreak: "keep-all",
      }}>
        실행가 {name}의<br />
        성장을 항상 응원합니다.
      </h1>

      {memberCount !== null && (
        <p style={{
          marginTop: "20px",
          fontSize: "14px",
          fontFamily: "'Pretendard', sans-serif",
          color: "var(--text-placeholder)",
          lineHeight: 1.7,
        }}>
          선익은 실행가{" "}
          <span style={{ color: "var(--text-primary)", fontWeight: 700 }}>
            {memberCount.toLocaleString()}
          </span>
          명과 함께 나아가겠습니다.
        </p>
      )}

      {/* 짧은 구분선 */}
      <div style={{
        width: "40px", height: "1px",
        backgroundColor: "var(--border)",
        margin: "40px auto 0",
      }} />
    </div>
  );
}

// ── 브리핑 행 ─────────────────────────────────────────────────────
function BriefingRow({
  post, animDelay, onClick,
}: {
  post: FeedPost; index: number; animDelay: number; onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), animDelay);
    return () => clearTimeout(t);
  }, [animDelay]);

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: "10px 0",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(10px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      <p style={{
        fontSize: "clamp(15px, 1.8vw, 19px)",
        fontFamily: "'Pretendard', sans-serif",
        fontWeight: 700,
        color: "var(--text-primary)",
        letterSpacing: "-0.02em",
        lineHeight: 1.4,
        margin: 0,
        opacity: hovered ? 0.5 : 1,
        transition: "opacity 0.15s",
        wordBreak: "keep-all",
      }}>
        {post.title}
      </p>
    </div>
  );
}

// ── 아카이브 섹션 ─────────────────────────────────────────────────
function ArchiveSection({ posts }: { posts: FeedPost[] }) {
  const router = useRouter();
  const grouped = groupByYearMonth(posts);
  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  const defaultYear = years[0] ?? null;
  const defaultMonth = defaultYear
    ? Math.max(...Object.keys(grouped[defaultYear]).map(Number))
    : null;

  const [selectedYear, setSelectedYear] = useState<number | null>(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(defaultMonth);
  const [animKey, setAnimKey] = useState(0);

  const selectMonth = useCallback((y: number, m: number) => {
    setSelectedYear(y);
    setSelectedMonth(m);
    setAnimKey(k => k + 1);
  }, []);

  const currentPosts =
    selectedYear && selectedMonth
      ? (grouped[selectedYear]?.[selectedMonth] ?? [])
      : [];

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      paddingTop: "48px",
      paddingBottom: "120px",
      minHeight: "360px",
    }}>

      {/* ── 1열: 연도 ── */}
      <div>
        {years.map(year => {
          const months = Object.keys(grouped[year]).map(Number).sort((a, b) => b - a);
          const active = selectedYear === year;
          return (
            <button
              key={year}
              onClick={() => selectMonth(year, months[0])}
              style={{
                display: "block", background: "none", border: "none",
                cursor: "pointer", padding: "0 0 20px",
                fontSize: "26px", fontFamily: "Inter, sans-serif",
                fontWeight: active ? 800 : 300,
                color: active ? "var(--text-primary)" : "var(--text-disabled)",
                letterSpacing: "-0.03em", lineHeight: 1.15,
                transition: "color 0.2s",
              }}
            >
              {year}
            </button>
          );
        })}
      </div>

      {/* ── 2열: 월 (가운데 정렬) ── */}
      <div style={{ paddingTop: "4px", display: "flex", flexDirection: "column", alignItems: "center" }}>
        {selectedYear && Object.keys(grouped[selectedYear])
          .map(Number).sort((a, b) => b - a)
          .map(month => {
            const isMonth = selectedMonth === month;
            return (
              <button
                key={month}
                onClick={() => selectMonth(selectedYear, month)}
                style={{
                  display: "block", background: "none", border: "none",
                  cursor: "pointer", padding: "6px 0",
                  fontSize: "20px", fontFamily: "Inter, sans-serif",
                  fontWeight: isMonth ? 700 : 300,
                  color: isMonth ? "var(--text-primary)" : "var(--text-disabled)",
                  letterSpacing: "-0.02em", lineHeight: 1.2,
                  transition: "color 0.15s",
                  textAlign: "center",
                }}
                onMouseEnter={e => { if (!isMonth) (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
                onMouseLeave={e => { if (!isMonth) (e.currentTarget as HTMLButtonElement).style.color = "var(--text-disabled)"; }}
              >
                {month}
              </button>
            );
          })
        }
      </div>

      {/* ── 3열: 브리핑 목록 ── */}
      <div style={{ paddingLeft: "0" }} key={animKey}>
        {currentPosts.length === 0 ? (
          <p style={{
            paddingTop: "40px",
            fontSize: "11px", fontFamily: "Inter, monospace",
            color: "var(--text-disabled)", letterSpacing: "0.2em",
          }}>
            NO BRIEFINGS
          </p>
        ) : (
          <>
            {currentPosts.map((post, i) => (
              <BriefingRow
                key={post.id}
                post={post}
                index={i}
                animDelay={i * 50}
                onClick={() => router.push(`/post/${post.id}`)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ── 메인 ─────────────────────────────────────────────────────────
export default function FeedSection() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [memberCount, setMemberCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const name = session?.user?.name || session?.user?.email?.split("@")[0] || "실행가";

  useEffect(() => {
    fetch("/api/posts?take=200")
      .then(r => r.json())
      .then((data: { posts: FeedPost[] }) => {
        setPosts(data.posts ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    fetch("/api/stats")
      .then(r => r.json())
      .then((data: { userCount: number | null }) => setMemberCount(data.userCount))
      .catch(() => {});
  }, []);

  return (
    <div style={{ backgroundColor: "var(--bg-primary)" }}>
      <div style={{
        maxWidth: "760px", margin: "0 auto",
        padding: "0 clamp(24px, 5vw, 48px)",
      }}>

        {/* 웰컴 */}
        <WelcomeSection name={name} memberCount={memberCount} />

        {/* 로딩 */}
        {loading && (
          <div style={{ padding: "80px 0", textAlign: "center" }}>
            <p style={{
              fontFamily: "Inter, monospace", fontSize: "10px",
              letterSpacing: "0.3em", color: "var(--text-placeholder)",
            }}>LOADING</p>
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && posts.length === 0 && (
          <div style={{ padding: "80px 0", textAlign: "center" }}>
            <p style={{
              fontFamily: "Inter, monospace", fontSize: "10px",
              letterSpacing: "0.25em", color: "var(--text-disabled)",
            }}>NO BRIEFINGS YET</p>
          </div>
        )}

        {/* 아카이브 */}
        {!loading && posts.length > 0 && (
          <ArchiveSection posts={posts} />
        )}

      </div>
    </div>
  );
}
