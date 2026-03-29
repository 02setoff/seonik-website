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

// ── 카운트업 훅 ───────────────────────────────────────────────────
function useCountUp(target: number | null, duration = 1600): number {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (target === null) return;
    if (target === 0) { setCount(0); return; }
    let startTime: number | null = null;
    let raf: number;
    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(animate);
    };
    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return count;
}

// ── 웰컴 섹션 (뷰포트 정중앙) ────────────────────────────────────
function WelcomeSection({ name, memberCount }: { name: string; memberCount: number | null }) {
  const displayCount = useCountUp(memberCount);
  return (
    <div style={{
      minHeight: "calc(100vh - 64px)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
    }}>
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
            {displayCount.toLocaleString()}
          </span>
          명과 함께 나아가겠습니다.
        </p>
      )}

      <div style={{
        width: "40px", height: "1px",
        backgroundColor: "var(--border)",
        margin: "40px auto 0",
      }} />
    </div>
  );
}

// ── 브리핑 행 (데스크탑 + 모바일 공용) ──────────────────────────
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
        padding: "0 0 14px",
        cursor: "pointer",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(0)" : "translateX(10px)",
        transition: "opacity 0.3s ease, transform 0.3s ease",
      }}
    >
      {/* 제목 */}
      <p style={{
        fontSize: "clamp(15px, 1.8vw, 19px)",
        fontFamily: "'Pretendard', sans-serif",
        fontWeight: 700,
        color: "var(--text-primary)",
        letterSpacing: "-0.02em",
        lineHeight: "28px",
        margin: 0,
        opacity: hovered ? 0.45 : 1,
        transition: "opacity 0.15s",
        wordBreak: "keep-all",
      }}>
        {post.title}
      </p>

      {/* 요약 미리보기 — 호버 시 슬라이드 다운 */}
      {post.summary && (
        <div style={{
          overflow: "hidden",
          maxHeight: hovered ? "44px" : "0",
          opacity: hovered ? 0.6 : 0,
          marginTop: hovered ? "5px" : "0",
          transition: "max-height 0.22s ease, opacity 0.22s ease, margin-top 0.22s ease",
        }}>
          <p style={{
            fontSize: "12px",
            fontFamily: "'Pretendard', sans-serif",
            color: "var(--text-muted)",
            lineHeight: 1.55,
            margin: 0,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
            overflow: "hidden",
          }}>
            {post.summary}
          </p>
        </div>
      )}
    </div>
  );
}

// ── 데스크탑 아카이브 (3열 그리드) ───────────────────────────────
const LABEL_BLOCK_H = 48; // 브리핑 목차 라벨 높이(28px) + marginBottom(20px)

function DesktopArchive({
  grouped, years, selectedYear, selectedMonth, currentPosts, animKey, selectMonth,
}: {
  grouped: Record<number, Record<number, FeedPost[]>>;
  years: number[];
  selectedYear: number | null;
  selectedMonth: number | null;
  currentPosts: FeedPost[];
  animKey: number;
  selectMonth: (y: number, m: number) => void;
}) {
  const router = useRouter();
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr 1fr",
      columnGap: "clamp(16px, 3vw, 40px)",
      paddingTop: "48px",
      paddingBottom: "120px",
      minHeight: "360px",
    }}>
      {/* 1열: 연도 */}
      <div style={{ display: "flex", flexDirection: "column", paddingTop: `${LABEL_BLOCK_H}px` }}>
        {years.map(year => {
          const months = Object.keys(grouped[year]).map(Number).sort((a, b) => b - a);
          const active = selectedYear === year;
          return (
            <button
              key={year}
              onClick={() => selectMonth(year, months[0])}
              style={{
                display: "block", background: "none", border: "none", cursor: "pointer",
                padding: "0", margin: "0 0 16px",
                fontSize: "20px", fontFamily: "Inter, sans-serif",
                fontWeight: active ? 800 : 300,
                color: active ? "var(--text-primary)" : "var(--text-disabled)",
                letterSpacing: "-0.03em", lineHeight: "28px",
                transition: "color 0.2s", textAlign: "right",
              }}
            >
              {year}
            </button>
          );
        })}
      </div>

      {/* 2열: 브리핑 목차 라벨 + 월 */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <p style={{
          fontSize: "clamp(20px, 2.8vw, 34px)",
          fontFamily: "'Pretendard', sans-serif",
          fontWeight: 800,
          color: "var(--text-primary)",
          letterSpacing: "-0.03em",
          lineHeight: "28px",
          margin: `0 0 ${LABEL_BLOCK_H - 28}px`,
          whiteSpace: "nowrap",
        }}>
          브리핑 목차
        </p>
        {selectedYear && Object.keys(grouped[selectedYear])
          .map(Number).sort((a, b) => b - a)
          .map(month => {
            const isMonth = selectedMonth === month;
            return (
              <button
                key={month}
                onClick={() => selectMonth(selectedYear, month)}
                style={{
                  display: "block", background: "none", border: "none", cursor: "pointer",
                  padding: "0", margin: "0 0 16px",
                  fontSize: "20px", fontFamily: "Inter, sans-serif",
                  fontWeight: isMonth ? 700 : 300,
                  color: isMonth ? "var(--text-primary)" : "var(--text-disabled)",
                  letterSpacing: "-0.02em", lineHeight: "28px",
                  transition: "color 0.15s", textAlign: "center",
                }}
                onMouseEnter={e => { if (!isMonth) (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)"; }}
                onMouseLeave={e => { if (!isMonth) (e.currentTarget as HTMLButtonElement).style.color = "var(--text-disabled)"; }}
              >
                {month}
              </button>
            );
          })}
      </div>

      {/* 3열: 브리핑 목록 */}
      <div key={animKey} style={{ paddingTop: `${LABEL_BLOCK_H}px` }}>
        {currentPosts.length === 0 ? (
          <p style={{
            fontSize: "11px", fontFamily: "Inter, monospace",
            color: "var(--text-disabled)", letterSpacing: "0.2em",
          }}>NO BRIEFINGS</p>
        ) : (
          <>
            {currentPosts.map((post, i) => (
              <BriefingRow
                key={post.id} post={post} index={i} animDelay={i * 50}
                onClick={() => router.push(`/post/${post.id}`)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ── 모바일 아카이브 (탭 + 세로 목록) ────────────────────────────
function MobileArchive({
  grouped, years, selectedYear, selectedMonth, currentPosts, animKey, selectMonth,
}: {
  grouped: Record<number, Record<number, FeedPost[]>>;
  years: number[];
  selectedYear: number | null;
  selectedMonth: number | null;
  currentPosts: FeedPost[];
  animKey: number;
  selectMonth: (y: number, m: number) => void;
}) {
  const router = useRouter();
  const months = selectedYear
    ? Object.keys(grouped[selectedYear]).map(Number).sort((a, b) => b - a)
    : [];

  return (
    <div style={{ paddingTop: "32px", paddingBottom: "100px" }}>

      {/* 섹션 제목 */}
      <p style={{
        fontSize: "clamp(20px, 6vw, 28px)",
        fontFamily: "'Pretendard', sans-serif",
        fontWeight: 800,
        color: "var(--text-primary)",
        letterSpacing: "-0.03em",
        margin: "0 0 20px",
      }}>
        브리핑 목차
      </p>

      {/* 연도 탭 — 복수 연도일 때만 표시 */}
      {years.length > 1 && (
        <div style={{ display: "flex", gap: "4px", marginBottom: "16px", flexWrap: "wrap" }}>
          {years.map(year => {
            const active = selectedYear === year;
            const ym = Object.keys(grouped[year]).map(Number).sort((a, b) => b - a);
            return (
              <button
                key={year}
                onClick={() => selectMonth(year, ym[0])}
                style={{
                  padding: "5px 14px",
                  fontSize: "13px", fontFamily: "Inter, sans-serif",
                  fontWeight: active ? 700 : 400,
                  color: active ? "var(--bg-primary)" : "var(--text-secondary)",
                  backgroundColor: active ? "var(--text-primary)" : "transparent",
                  border: "1px solid",
                  borderColor: active ? "var(--text-primary)" : "var(--border)",
                  borderRadius: "4px",
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                {year}
              </button>
            );
          })}
        </div>
      )}

      {/* 월 칩 — 가로 스크롤 */}
      <div style={{
        display: "flex", gap: "8px",
        overflowX: "auto", paddingBottom: "4px",
        marginBottom: "28px",
        scrollbarWidth: "none",
      }}>
        {months.map(month => {
          const active = selectedMonth === month;
          return (
            <button
              key={month}
              onClick={() => selectMonth(selectedYear!, month)}
              style={{
                flexShrink: 0,
                padding: "7px 18px",
                fontSize: "14px", fontFamily: "Inter, sans-serif",
                fontWeight: active ? 700 : 400,
                color: active ? "var(--bg-primary)" : "var(--text-secondary)",
                backgroundColor: active ? "var(--text-primary)" : "transparent",
                border: "1px solid",
                borderColor: active ? "var(--text-primary)" : "var(--border)",
                borderRadius: "999px",
                cursor: "pointer", whiteSpace: "nowrap",
                transition: "all 0.15s",
              }}
            >
              {month}월
            </button>
          );
        })}
      </div>

      {/* 구분선 */}
      <div style={{ height: "1px", backgroundColor: "var(--border)", marginBottom: "24px" }} />

      {/* 브리핑 목록 */}
      <div key={animKey}>
        {currentPosts.length === 0 ? (
          <p style={{
            fontSize: "11px", fontFamily: "Inter, monospace",
            color: "var(--text-disabled)", letterSpacing: "0.2em",
          }}>NO BRIEFINGS</p>
        ) : (
          <>
            {currentPosts.map((post, i) => (
              <div
                key={post.id}
                onClick={() => router.push(`/post/${post.id}`)}
                style={{
                  padding: "16px 0",
                  borderBottom: "1px solid var(--border)",
                  cursor: "pointer",
                }}
              >
                <p style={{
                  fontSize: "16px", fontFamily: "'Pretendard', sans-serif",
                  fontWeight: 700, color: "var(--text-primary)",
                  letterSpacing: "-0.02em", lineHeight: 1.4,
                  margin: 0, wordBreak: "keep-all",
                }}>
                  {post.title}
                </p>
                {post.summary && (
                  <p style={{
                    marginTop: "6px",
                    fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
                    color: "var(--text-muted)", lineHeight: 1.55,
                    margin: "6px 0 0",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical" as const,
                    overflow: "hidden",
                  }}>
                    {post.summary}
                  </p>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ── 아카이브 래퍼 (isMobile 분기) ────────────────────────────────
function ArchiveSection({ posts }: { posts: FeedPost[] }) {
  const grouped = groupByYearMonth(posts);
  const years = Object.keys(grouped).map(Number).sort((a, b) => b - a);

  const defaultYear = years[0] ?? null;
  const defaultMonth = defaultYear
    ? Math.max(...Object.keys(grouped[defaultYear]).map(Number))
    : null;

  const [selectedYear, setSelectedYear] = useState<number | null>(defaultYear);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(defaultMonth);
  const [animKey, setAnimKey] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const selectMonth = useCallback((y: number, m: number) => {
    setSelectedYear(y);
    setSelectedMonth(m);
    setAnimKey(k => k + 1);
  }, []);

  const currentPosts =
    selectedYear && selectedMonth
      ? (grouped[selectedYear]?.[selectedMonth] ?? [])
      : [];

  const sharedProps = { grouped, years, selectedYear, selectedMonth, currentPosts, animKey, selectMonth };

  return isMobile
    ? <MobileArchive {...sharedProps} />
    : <DesktopArchive {...sharedProps} />;
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
        <WelcomeSection name={name} memberCount={memberCount} />

        {loading && (
          <div style={{ padding: "80px 0", textAlign: "center" }}>
            <p style={{
              fontFamily: "Inter, monospace", fontSize: "10px",
              letterSpacing: "0.3em", color: "var(--text-placeholder)",
            }}>LOADING</p>
          </div>
        )}

        {!loading && posts.length === 0 && (
          <div style={{ padding: "80px 0", textAlign: "center" }}>
            <p style={{
              fontFamily: "Inter, monospace", fontSize: "10px",
              letterSpacing: "0.25em", color: "var(--text-disabled)",
            }}>NO BRIEFINGS YET</p>
          </div>
        )}

        {!loading && posts.length > 0 && (
          <ArchiveSection posts={posts} />
        )}
      </div>
    </div>
  );
}
