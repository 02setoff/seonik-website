"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Search } from "lucide-react";
import PostModal from "@/components/feed/PostModal";
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

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

export default function BottomSearchBar() {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<SearchResult[]>([]);
  const [mode, setMode] = useState<"search" | "ai">("search");
  const [modeAnim, setModeAnim] = useState(false);
  const [focused, setFocused] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
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

  const showResults = focused && !isAI && results.length > 0;

  return (
    <>
      {/* 검색 결과 드롭업 */}
      {showResults && (
        <div style={{
          position: "fixed",
          bottom: "60px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(680px, calc(100vw - 48px))",
          backgroundColor: "var(--modal-bg)",
          border: "1px solid var(--border)",
          borderBottom: "none",
          boxShadow: "0 -12px 40px rgba(0,0,0,0.15)",
          maxHeight: "360px",
          overflowY: "auto",
          zIndex: 99,
        }}>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {results.map(result => (
              <li
                key={result.id}
                onMouseDown={() => handleSelect(result)}
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
                  <p style={{
                    fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
                    fontWeight: 600, color: "var(--text-primary)",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    margin: 0,
                  }}>
                    {result.title}
                  </p>
                  <p style={{
                    fontSize: "11px", fontFamily: "Inter, sans-serif",
                    color: "var(--text-placeholder)", marginTop: "3px",
                    letterSpacing: "0.04em",
                  }}>
                    {formatDate(result.createdAt)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 고정 바 */}
      <div style={{
        position: "fixed",
        bottom: 0, left: 0, right: 0,
        zIndex: 100,
        backgroundColor: "var(--bg-primary)",
        borderTop: "1px solid var(--border)",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 24px",
      }}>
        <div style={{
          width: "min(680px, 100%)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}>
          {/* 돋보기 아이콘 */}
          <Search
            size={16}
            style={{
              color: isAI ? "#EAB308" : "var(--text-placeholder)",
              flexShrink: 0,
              transition: "color 0.3s",
            }}
          />

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
              flex: 1,
              background: "transparent",
              border: "none",
              outline: "none",
              fontFamily: "'Pretendard', sans-serif",
              fontSize: "15px",
              color: isAI ? "#EAB308" : "var(--text-primary)",
              caretColor: "var(--text-primary)",
              cursor: isAI ? "default" : "text",
              opacity: modeAnim ? 0 : 1,
              transition: "opacity 0.18s ease, color 0.3s ease",
            }}
          />

          {/* 창업 AI 토글 버튼 */}
          <button
            onMouseDown={e => { e.preventDefault(); handleModeToggle(); }}
            style={{
              flexShrink: 0,
              padding: "6px 16px",
              fontSize: "11px",
              fontFamily: "Inter, sans-serif",
              fontWeight: 700,
              letterSpacing: "0.08em",
              border: "1px solid",
              borderRadius: "20px",
              cursor: "pointer",
              opacity: modeAnim ? 0 : 1,
              transform: modeAnim ? "scale(0.9)" : "scale(1)",
              transition: "opacity 0.18s, transform 0.18s, background-color 0.2s, color 0.2s, border-color 0.2s",
              backgroundColor: isAI ? "#EAB308" : "transparent",
              color: isAI ? "#0F172A" : "var(--text-placeholder)",
              borderColor: isAI ? "#EAB308" : "var(--border)",
            }}
            onMouseEnter={e => {
              if (!isAI) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#EAB308";
                (e.currentTarget as HTMLButtonElement).style.color = "#EAB308";
              }
            }}
            onMouseLeave={e => {
              if (!isAI) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                (e.currentTarget as HTMLButtonElement).style.color = "var(--text-placeholder)";
              }
            }}
          >
            {isAI ? "검색" : "창업 AI"}
          </button>
        </div>
      </div>

      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}
