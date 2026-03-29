"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { X, Search, Check } from "lucide-react";
import { PostItem } from "@/components/feed/PostModal";

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

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPost?: (post: PostItem) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  }).replace(/. /g, ".").replace(/.$/, "");
}

export default function SearchModal({ isOpen, onClose, onSelectPost }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<SearchResult[]>([]);
  const [mode, setMode] = useState<"search" | "ai">("search");
  const [modeAnim, setModeAnim] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const isAI = mode === "ai";

  // 포스트 목록 로드
  useEffect(() => {
    if (isOpen && posts.length === 0) {
      fetch("/api/posts?take=100")
        .then(r => r.json())
        .then((data) => { setPosts(data.posts ?? []); })
        .catch(() => {});
    }
  }, [isOpen, posts.length]);

  const results = query.trim() && !isAI
    ? posts.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        (p.category ?? "").toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setMode("search");
    } else {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (isOpen) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleSelect = useCallback((result: SearchResult) => {
    if (onSelectPost) {
      onSelectPost({
        id: result.id,
        title: result.title,
        summary: result.summary,
        content: result.content,
        category: result.category,
        createdAt: result.createdAt,
        viewCount: result.viewCount,
        likeCount: result._count.likes,
      });
    }
    onClose();
  }, [onSelectPost, onClose]);

  const handleModeToggle = () => {
    setModeAnim(true);
    setTimeout(() => {
      setMode(m => m === "search" ? "ai" : "search");
      setQuery("");
      setModeAnim(false);
      setTimeout(() => inputRef.current?.focus(), 60);
    }, 180);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: "72px", paddingLeft: "20px", paddingRight: "20px",
        backgroundColor: "rgba(0,0,0,0.65)", backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        backgroundColor: "var(--modal-bg)",
        width: "100%", maxWidth: "640px",
        overflow: "hidden",
        boxShadow: "0 24px 64px rgba(0,0,0,0.3)",
        border: "1px solid var(--border)",
        transition: "all 0.2s ease",
      }}>
        {/* 검색 입력 영역 */}
        <div
          style={{
            display: "flex", alignItems: "center", gap: "12px",
            padding: "16px 20px",
            borderBottom: "1px solid var(--border)",
            backgroundColor: isAI ? "rgba(234,179,8,0.06)" : "transparent",
            transition: "background-color 0.3s ease",
          }}
        >
          {/* 모드 전환 버튼 (돋보기) */}
          <button
            onClick={handleModeToggle}
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
              /* AI 모드 아이콘: 포인트 컬러 */
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
              </svg>
            ) : (
              <Search size={18} style={{ color: "var(--text-placeholder)" }} />
            )}
          </button>

          {/* 모드 라벨 (AI일 때만) */}
          {isAI && (
            <span style={{
              fontSize: "10px", fontFamily: "Inter, sans-serif",
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
            onChange={(e) => { if (!isAI) setQuery(e.target.value); }}
            readOnly={isAI}
            className="flex-1 text-base outline-none bg-transparent"
            style={{
              fontFamily: "'Pretendard', sans-serif",
              color: isAI ? "#EAB308" : "var(--text-primary)",
              caretColor: "var(--text-primary)",
              cursor: isAI ? "default" : "text",
              opacity: modeAnim ? 0 : 1,
              transition: "opacity 0.18s ease, color 0.3s ease",
            }}
          />

          <button
            onClick={onClose}
            style={{
              color: "var(--text-placeholder)", background: "none",
              border: "none", cursor: "pointer", transition: "color 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-placeholder)"; }}
          >
            <X size={18} />
          </button>
        </div>

        {/* 결과 영역 */}
        <div className="overflow-y-auto" style={{ maxHeight: "420px" }}>
          {isAI ? (
            /* 창업 AI 준비 중 */
            <div style={{ padding: "48px 20px", textAlign: "center" }}>
              <div style={{
                width: "48px", height: "48px", margin: "0 auto 16px",
                border: "1.5px solid #EAB308",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              </div>
              <p style={{
                fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
                fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px",
              }}>창업 AI</p>
              <p style={{
                fontSize: "12px", fontFamily: "'Pretendard', sans-serif",
                color: "var(--text-placeholder)", lineHeight: "1.7",
              }}>
                선익의 창업 AI 서비스가 곧 출시됩니다.<br />
                검색 아이콘을 다시 누르면 브리핑 검색으로 돌아갑니다.
              </p>
            </div>
          ) : query.trim() === "" ? (
            <div style={{ padding: "32px 20px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: "13px", color: "var(--text-placeholder)" }}>
                {posts.length === 0 ? "아직 게시된 브리핑이 없습니다." : "브리핑 제목을 검색하세요"}
              </p>
              {posts.length > 0 && (
                <p style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "var(--text-disabled)", marginTop: "6px", letterSpacing: "0.06em" }}>
                  ☆ 아이콘을 누르면 창업 AI로 전환됩니다
                </p>
              )}
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: "32px 20px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: "13px", color: "var(--text-placeholder)" }}>
                &ldquo;{query}&rdquo;에 대한 브리핑이 없습니다
              </p>
            </div>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {results.map(result => (
                <li
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    cursor: "pointer", padding: "14px 20px",
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
                  <span style={{ display: "flex", alignItems: "center", gap: "3px", flexShrink: 0, fontSize: "11px", fontFamily: "Inter", color: "var(--text-disabled)" }}>
                    <Check size={11} />
                    {result._count.likes}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* 하단 힌트 */}
        <div style={{ padding: "10px 20px", borderTop: "1px solid var(--border-light)", display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "var(--text-placeholder)" }}>
            {isAI ? "창업 AI · 준비 중" : "ESC 닫기 · 클릭하여 열기"}
          </span>
          {!isAI && (
            <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "var(--text-disabled)" }}>
              ☆ 창업 AI 전환
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
