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

const CATEGORY_COLORS: Record<string, string> = {
  RADAR: "#3B82F6",
  CORE: "#8B5CF6",
  FLASH: "#F59E0B",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  }).replace(/. /g, ".").replace(/.$/, "");
}

export default function SearchModal({ isOpen, onClose, onSelectPost }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && posts.length === 0) {
      fetch("/api/posts").then(r => r.json()).then(setPosts).catch(() => {});
    }
  }, [isOpen, posts.length]);

  const results = query.trim()
    ? posts.filter(p =>
        p.title.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (!isOpen) { setQuery(""); }
    else { setTimeout(() => inputRef.current?.focus(), 50); }
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

  const setCategory = useCallback((cat: string) => setQuery(cat), []);

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

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 200,
        display: "flex", alignItems: "flex-start", justifyContent: "center",
        paddingTop: "64px", paddingLeft: "20px", paddingRight: "20px",
        backgroundColor: "rgba(0, 0, 0, 0.65)", backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        backgroundColor: "var(--modal-bg)",
        width: "100%", maxWidth: "640px",
        borderRadius: "8px", overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        border: "1px solid var(--border)",
      }}>
        <div className="flex items-center gap-3" style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
          <Search size={18} style={{ color: "var(--text-placeholder)", flexShrink: 0 }} />
          <input
            ref={inputRef}
            type="text"
            placeholder="브리핑 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-base outline-none bg-transparent"
            style={{
              fontFamily: "'Pretendard', sans-serif",
              color: "var(--text-primary)",
              caretColor: "var(--text-primary)",
            }}
          />
          <button
            onClick={onClose}
            style={{ color: "var(--text-placeholder)", background: "none", border: "none", cursor: "pointer", transition: "color 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "var(--text-placeholder)"; }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "420px" }}>
          {query.trim() === "" ? (
            <div style={{ padding: "32px 20px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: "14px", color: "var(--text-placeholder)" }}>
                {posts.length === 0 ? "아직 게시된 글이 없습니다." : "RADAR · CORE · FLASH 브리핑을 검색해보세요"}
              </p>
              {posts.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  {["RADAR", "CORE", "FLASH"].map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)}
                      style={{
                        padding: "4px 12px", fontSize: "11px", letterSpacing: "0.06em",
                        fontFamily: "Inter, sans-serif", borderRadius: "4px", cursor: "pointer",
                        border: "1px solid var(--border)", color: "var(--text-placeholder)",
                        background: "none", transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--text-primary)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-placeholder)"; }}>
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: "32px 20px", textAlign: "center" }}>
              <p style={{ fontFamily: "'Pretendard', sans-serif", fontSize: "14px", color: "var(--text-placeholder)" }}>
                &ldquo;{query}&rdquo;에 대한 브리핑이 없습니다
              </p>
            </div>
          ) : (
            <ul>
              {results.map(result => (
                <li
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="flex items-center justify-between cursor-pointer transition-colors duration-150"
                  style={{ padding: "14px 20px", borderBottom: "1px solid var(--border-light)" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLLIElement).style.backgroundColor = "var(--bg-hover)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLLIElement).style.backgroundColor = "transparent"; }}
                >
                  <div className="min-w-0 mr-4">
                    <p className="text-sm font-medium truncate" style={{ fontFamily: "'Pretendard', sans-serif", color: "var(--text-primary)" }}>
                      {result.title}
                    </p>
                    <p className="text-xs mt-0.5 tracking-wide" style={{
                      fontFamily: "Inter, sans-serif",
                      color: CATEGORY_COLORS[result.category] || "var(--text-placeholder)",
                      fontWeight: 600,
                    }}>
                      {result.category} · {formatDate(result.createdAt)}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 shrink-0"
                    style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "var(--text-disabled)" }}>
                    <Check size={11} />
                    {result._count.likes}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-4" style={{ padding: "10px 20px", borderTop: "1px solid var(--border-light)" }}>
          <span style={{ fontFamily: "Inter, sans-serif", fontSize: "11px", color: "var(--text-placeholder)" }}>ESC로 닫기 · 클릭하여 글 읽기</span>
        </div>
      </div>
    </div>
  );
}
