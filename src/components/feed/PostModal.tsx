"use client";

import { useEffect, useState, useRef } from "react";
import { X, Check, Lock } from "lucide-react";
import { useSession } from "next-auth/react";

export interface PostItem {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  category: string;
  createdAt: string;
  viewCount?: number;
  likeCount?: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  }).replace(/\. /g, ".").replace(/\.$/, "");
}

interface PostModalProps {
  post: PostItem | null;
  onClose: () => void;
}

export default function PostModal({ post, onClose }: PostModalProps) {
  const backdropMouseDown = useRef(false);
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (post) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [post, onClose]);

  useEffect(() => {
    document.body.style.overflow = post ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [post]);

  useEffect(() => {
    if (!post) return;
    fetch(`/api/posts/${post.id}/view`, { method: "POST" }).catch(() => {});
    fetch(`/api/posts/${post.id}/like`)
      .then(r => r.json())
      .then(d => { setLiked(d.liked); setLikeCount(d.count ?? post.likeCount ?? 0); })
      .catch(() => { setLikeCount(post.likeCount ?? 0); });
  }, [post]);

  const handleLike = async () => {
    if (!session || likeLoading || !post) return;
    setLikeLoading(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok) { setLiked(data.liked); setLikeCount(data.count); }
    } finally {
      setLikeLoading(false);
    }
  };

  if (!post) return null;

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        backgroundColor: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(4px)",
      }}
      onMouseDown={(e) => { backdropMouseDown.current = e.target === e.currentTarget; }}
      onClick={(e) => { if (backdropMouseDown.current && e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        backgroundColor: "#ffffff", width: "100%", maxWidth: "680px",
        maxHeight: "82vh", overflow: "hidden",
        display: "flex", flexDirection: "column",
      }}>
        {/* 헤더 */}
        <div className="border-b border-[#E2E8F0] flex-shrink-0" style={{ padding: "28px 32px 24px" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-[#94A3B8] font-medium uppercase tracking-wide mb-2"
                style={{ fontSize: "11px", fontFamily: "Inter, sans-serif" }}>
                {post.category} · {formatDate(post.createdAt)}
              </p>
              <h2 className="font-bold text-[#0F172A] leading-snug"
                style={{ fontSize: "22px", fontFamily: "'Pretendard', sans-serif" }}>
                {post.title}
              </h2>
            </div>
            <button onClick={onClose}
              className="text-[#94A3B8] hover:text-[#0F172A] transition-colors duration-200 flex-shrink-0 mt-1">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 본문 */}
        <div className="overflow-y-auto flex-1" style={{ padding: "28px 32px" }}>
          {post.summary && (
            <p className="text-[#475569] font-medium leading-relaxed mb-6"
              style={{ fontSize: "16px", fontFamily: "'Pretendard', sans-serif", borderLeft: "3px solid #E2E8F0", paddingLeft: "16px" }}>
              {post.summary}
            </p>
          )}
          {post.content ? (
            <div
              className="text-[#374151] leading-relaxed post-content"
              style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", lineHeight: "1.85" }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p className="text-[#CBD5E1]" style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif" }}>
              내용이 없습니다.
            </p>
          )}
        </div>

        {/* 푸터: 체크 */}
        <div className="border-t border-[#E2E8F0] flex-shrink-0 flex items-center justify-end"
          style={{ padding: "16px 32px" }}>
          {session ? (
            <button
              onClick={handleLike}
              disabled={likeLoading}
              title={liked ? "체크 취소" : "체크하기"}
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "6px 14px",
                backgroundColor: liked ? "#0F172A" : "white",
                color: liked ? "white" : "#94A3B8",
                border: `1px solid ${liked ? "#0F172A" : "#E2E8F0"}`,
                cursor: "pointer",
                fontSize: "13px", fontFamily: "Inter, sans-serif",
                transition: "all 0.15s ease",
                opacity: likeLoading ? 0.6 : 1,
              }}
            >
              <Check size={14} />
              <span>{likeCount}</span>
            </button>
          ) : (
            <div
              title="로그인 후 체크할 수 있습니다"
              style={{
                display: "flex", alignItems: "center", gap: "6px",
                padding: "6px 14px",
                backgroundColor: "white", color: "#CBD5E1",
                border: "1px solid #E2E8F0",
                fontSize: "13px", fontFamily: "Inter, sans-serif",
              }}
            >
              <Lock size={14} />
              <span>회원 전용</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
