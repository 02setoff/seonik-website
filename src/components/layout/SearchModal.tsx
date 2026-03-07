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
        backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)",
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{
        backgroundColor: "#ffffff", width: "100%", maxWidth: "640px",
        borderRadius: "8px", overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>
        <div className="flex items-center gap-3 border-b border-[#E2E8F0]" style={{ padding: "16px 20px" }}>
          <Search size={18} className="text-[#94A3B8] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="브리핑 검색..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 text-[#0F172A] text-base outline-none bg-transparent placeholder:text-[#94A3B8]"
            style={{ fontFamily: "'Pretendard', sans-serif" }}
          />
          <button onClick={onClose} className="text-[#94A3B8] hover:text-[#0F172A] transition-colors duration-200">
            <X size={18} />
          </button>
        </div>

        <div className="overflow-y-auto" style={{ maxHeight: "420px" }}>
          {query.trim() === "" ? (
            <div style={{ padding: "32px 20px" }} className="text-center">
              <p className="text-[#94A3B8] text-sm" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                {posts.length === 0 ? "아직 게시된 글이 없습니다." : "RADAR · CORE · FLASH 브리핑을 검색해보세요"}
              </p>
              {posts.length > 0 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  {["RADAR", "CORE", "FLASH"].map(cat => (
                    <button key={cat} onClick={() => setCategory(cat)}
                      className="px-3 py-1 border border-[#E2E8F0] text-[#94A3B8] hover:border-[#0F172A] hover:text-[#0F172A] transition-colors duration-200 text-xs tracking-wide"
                      style={{ fontFamily: "Inter, sans-serif", borderRadius: "4px" }}>
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : results.length === 0 ? (
            <div style={{ padding: "32px 20px" }} className="text-center">
              <p className="text-[#94A3B8] text-sm" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                &ldquo;{query}&rdquo;에 대한 브리핑이 없습니다
              </p>
            </div>
          ) : (
            <ul>
              {results.map(result => (
                <li
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="flex items-center justify-between hover:bg-[#F8F9FA] cursor-pointer transition-colors duration-150 border-b border-[#F1F5F9] last:border-0"
                  style={{ padding: "14px 20px" }}
                >
                  <div className="min-w-0 mr-4">
                    <p className="text-[#0F172A] text-sm font-medium truncate" style={{ fontFamily: "'Pretendard', sans-serif" }}>
                      {result.title}
                    </p>
                    <p className="text-xs mt-0.5 tracking-wide" style={{
                      fontFamily: "Inter, sans-serif",
                      color: CATEGORY_COLORS[result.category] || "#94A3B8",
                      fontWeight: 600,
                    }}>
                      {result.category} · {formatDate(result.createdAt)}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-[#CBD5E1] shrink-0"
                    style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}>
                    <Check size={11} />
                    {result._count.likes}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-[#F1F5F9] flex items-center gap-4" style={{ padding: "10px 20px" }}>
          <span className="text-[#94A3B8] text-xs" style={{ fontFamily: "Inter, sans-serif" }}>ESC로 닫기 · 클릭하여 글 읽기</span>
        </div>
      </div>
    </div>
  );
}