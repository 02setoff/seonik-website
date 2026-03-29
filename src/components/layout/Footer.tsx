"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import ContactModal from "./ContactModal";
import { PostItem } from "@/components/feed/PostModal";
import PostModal from "@/components/feed/PostModal";

interface SearchResult {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  category: string;
  createdAt: string;
  viewCount: number;
  _count: { likes: number };
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function FeedFooter() {
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

  // ── 검색 상태 ──
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<SearchResult[]>([]);
  const [mode, setMode] = useState<"search" | "ai">("search");
  const [modeAnim, setModeAnim] = useState(false);
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isAI = mode === "ai";

  useEffect(() => {
    fetch("/api/posts?take=100")
      .then(r => r.json())
      .then(data => setPosts(data.posts ?? []))
      .catch(() => {});
  }, []);

  const results = query.trim() && !isAI
    ? posts.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        (p.category ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleModeToggle = () => {
    setModeAnim(true);
    setTimeout(() => {
      setMode(m => m === "search" ? "ai" : "search");
      setQuery("");
      setModeAnim(false);
      setTimeout(() => inputRef.current?.focus(), 60);
    }, 180);
  };

  const handleSelect = useCallback((result: SearchResult) => {
    setSelectedPost({
      id: result.id,
      title: result.title,
      summary: result.summary,
      content: result.content,
      category: result.category,
      createdAt: result.createdAt,
      viewCount: result.viewCount,
      likeCount: result._count.likes,
    });
    setQuery("");
    setFocused(false);
  }, []);

  const showResults = focused && (results.length > 0 || (query.trim() !== "" && !isAI) || isAI);

  return (
    <>
      {/* ── 검색 섹션 (푸터 위) ── */}
      <div style={{ backgroundColor: "var(--bg-primary)", paddingTop: "40px" }}>
        <div style={{
          maxWidth: "680px", margin: "0 auto",
          padding: "0 clamp(24px, 5vw, 40px) 0",
          position: "relative",
        }}>
          {/* 결과 드롭업 (검색창 위로 펼침) */}
          {showResults && (
            <div style={{
              position: "absolute", bottom: "100%", left: "clamp(24px, 5vw, 40px)",
              right: "clamp(24px, 5vw, 40px)",
              backgroundColor: "var(--modal-bg)",
              border: "1px solid var(--border)",
              borderBottom: "none",
              boxShadow: "0 -8px 32px rgba(0,0,0,0.1)",
              maxHeight: "320px", overflowY: "auto",
              zIndex: 10,
            }}>
              {isAI ? (
                <div style={{ padding: "32px 20px", textAlign: "center" }}>
                  <div style={{
                    width: "40px", height: "40px", margin: "0 auto 12px",
                    border: "1.5px solid #EAB308",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                    </svg>
                  </div>
                  <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>창업 AI</p>
                  <p style={{ fontSize: "12px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-placeholder)", lineHeight: 1.7 }}>
                    선익의 창업 AI 서비스가 곧 출시됩니다.<br />
                    아이콘을 다시 누르면 브리핑 검색으로 돌아갑니다.
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center" }}>
                  <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-placeholder)" }}>
                    &ldquo;{query}&rdquo;에 대한 브리핑이 없습니다
                  </p>
                </div>
              ) : (
                <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
                  {results.map(result => (
                    <li
                      key={result.id}
                      onMouseDown={() => handleSelect(result)}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        cursor: "pointer", padding: "13px 20px",
                        borderBottom: "1px solid var(--border-light)",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLLIElement).style.backgroundColor = "var(--bg-hover)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLLIElement).style.backgroundColor = "transparent"; }}
                    >
                      <div style={{ minWidth: 0, marginRight: "16px" }}>
                        <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {result.title}
                        </p>
                        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)", marginTop: "2px", letterSpacing: "0.04em" }}>
                          {formatDate(result.createdAt)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* 검색 입력창 */}
          <div style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "16px 20px",
            border: "1px solid var(--border)",
            backgroundColor: isAI ? "rgba(234,179,8,0.06)" : "var(--bg-card)",
            transition: "background-color 0.3s ease, border-color 0.2s ease",
            borderColor: focused ? "var(--text-primary)" : "var(--border)",
          }}>
            {/* 모드 전환 버튼 */}
            <button
              onMouseDown={e => { e.preventDefault(); handleModeToggle(); }}
              title={isAI ? "검색 모드로 전환" : "창업 AI 모드로 전환"}
              style={{
                background: "none", border: "none", cursor: "pointer",
                flexShrink: 0, padding: "2px",
                opacity: modeAnim ? 0 : 1,
                transition: "opacity 0.18s ease, transform 0.18s ease",
                transform: modeAnim ? "scale(0.8)" : "scale(1)",
                display: "flex", alignItems: "center",
              }}
            >
              {isAI ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              ) : (
                <Search size={18} style={{ color: "var(--text-placeholder)" }} />
              )}
            </button>

            {/* AI 모드 라벨 */}
            {isAI && (
              <span style={{
                fontSize: "11px", fontFamily: "Inter, sans-serif",
                fontWeight: 700, color: "#EAB308",
                letterSpacing: "0.12em", flexShrink: 0,
                opacity: modeAnim ? 0 : 1,
                transition: "opacity 0.18s ease",
              }}>
                창업 AI
              </span>
            )}

            {/* 입력창 */}
            <input
              ref={inputRef}
              type="text"
              placeholder={isAI ? "창업 AI — 서비스 준비 중입니다" : "브리핑 검색..."}
              value={query}
              onChange={e => { if (!isAI) setQuery(e.target.value); }}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              readOnly={isAI}
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                fontFamily: "'Pretendard', sans-serif", fontSize: "15px",
                color: isAI ? "#EAB308" : "var(--text-primary)",
                caretColor: "var(--text-primary)",
                cursor: isAI ? "default" : "text",
                opacity: modeAnim ? 0 : 1,
                transition: "opacity 0.18s ease, color 0.3s ease",
              }}
            />

            {/* 힌트 텍스트 */}
            {!isAI && (
              <span style={{
                fontSize: "11px", fontFamily: "Inter, sans-serif",
                color: "var(--text-disabled)", flexShrink: 0,
                letterSpacing: "0.06em",
              }}>
                ☆ 창업 AI
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── 다크 푸터 ── */}
      <footer>
        <div
          className="bg-[#060E1C] flex flex-col items-center gap-4 px-5 md:px-10"
          style={{ padding: "48px 0 36px", textAlign: "center" }}
        >
          {/* 브랜드 */}
          <div className="flex flex-col items-center">
            <p
              className="font-bold text-white leading-none"
              style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif" }}
            >
              선익
            </p>
            <p
              className="font-semibold text-[#475569] leading-none"
              style={{ fontSize: "11px", marginTop: "5px", fontFamily: "Inter, sans-serif", letterSpacing: "0.15em" }}
            >
              SEONIK
            </p>
          </div>

          {/* 저작권 + 모토 */}
          <div className="flex flex-col items-center gap-1">
            <p className="text-[#475569]" style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif" }}>
              &copy; 2026 SEONIK 선익. All rights reserved.
            </p>
            <p className="text-[#475569]" style={{ fontSize: "13px", fontFamily: "Inter, sans-serif" }}>
              先益 — 앞서나가는 정보로 실행가들을 이롭게
            </p>
          </div>

          {/* 법적 링크 */}
          <div className="flex items-center gap-4">
            <Link href="/terms"
              className="text-[#475569] hover:text-white transition-colors duration-200"
              style={{ fontSize: "13px", fontFamily: "Inter, sans-serif" }}>
              이용약관
            </Link>
            <span style={{ color: "#2D3748", fontSize: "13px" }}>|</span>
            <Link href="/privacy"
              className="text-[#475569] hover:text-white transition-colors duration-200"
              style={{ fontSize: "13px", fontFamily: "Inter, sans-serif" }}>
              개인정보처리방침
            </Link>
            <span style={{ color: "#2D3748", fontSize: "13px" }}>|</span>
            <Link href="/disclaimer"
              className="text-[#475569] hover:text-white transition-colors duration-200"
              style={{ fontSize: "13px", fontFamily: "Inter, sans-serif" }}>
              면책 조항
            </Link>
          </div>

          {/* 연락처 */}
          <button
            onClick={() => setIsContactOpen(true)}
            className="text-[#475569] hover:text-white transition-colors duration-200"
            style={{ fontSize: "13px", fontFamily: "Inter, sans-serif" }}
          >
            seonik.official@gmail.com
          </button>
        </div>
      </footer>

      <ContactModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}
