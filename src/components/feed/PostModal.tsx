"use client";

import { useEffect, useState, useRef } from "react";
import { X, Check, Lock, Link2 } from "lucide-react";
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

// accent: 좌측 border 포인트 컬러로만 사용 (장식용)
const CATEGORY_META: Record<string, { accent: string; label: string }> = {
  RADAR: { accent: "#0F172A", label: "RADAR INTEL" },
  CORE:  { accent: "#334155", label: "CORE BRIEF"  },
  FLASH: { accent: "#64748B", label: "FLASH ALERT" },
};

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
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // ESC 키 닫기
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    if (post) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [post, onClose]);

  // 바디 스크롤 잠금
  useEffect(() => {
    document.body.style.overflow = post ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [post]);

  // 조회/저장 상태 로드
  useEffect(() => {
    if (!post) return;
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    fetch(`/api/posts/${post.id}/view`, { method: "POST" }).catch(() => {});
    fetch(`/api/posts/${post.id}/like`)
      .then(r => r.json())
      .then(d => { setLiked(d.liked); setLikeCount(d.count ?? post.likeCount ?? 0); })
      .catch(() => { setLikeCount(post.likeCount ?? 0); });
  }, [post]);

  const handleCopy = () => {
    const url = `${window.location.origin}/?p=${post!.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  };

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

  const meta = CATEGORY_META[post.category] || CATEGORY_META.RADAR;

  return (
    /* 전체 화면 오버레이 */
    <div style={{
      position: "fixed", inset: 0, zIndex: 400,
      backgroundColor: "var(--modal-bg)",
      display: "flex", flexDirection: "column",
      overflowY: "hidden",
    }}>

      {/* ── 상단 바 ── */}
      <div style={{
        borderBottom: "1px solid var(--border)", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(16px, 4vw, 32px)", height: "56px",
        backgroundColor: "var(--modal-bg)",
      }}>
        {/* 카테고리 배지 */}
        <span style={{
          fontSize: "10px", fontFamily: "Inter, sans-serif",
          fontWeight: 700, letterSpacing: "0.12em",
          padding: "4px 12px",
          backgroundColor: "var(--bg-subtle)",
          color: "var(--text-primary)",
          border: "1px solid var(--border)",
        }}>
          {meta.label}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)" }}>
            {formatDate(post.createdAt)}
          </span>
          {/* 닫기 */}
          <button
            onClick={onClose}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-placeholder)", padding: "6px",
              display: "flex", alignItems: "center", borderRadius: "4px",
              transition: "background-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-hover)")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* ── 본문 영역 (스크롤) ── */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto" }}>
        <div style={{ maxWidth: "760px", margin: "0 auto", padding: "clamp(28px,5vw,48px) clamp(16px,4vw,32px) 80px" }}>

          {/* 제목 */}
          <h1 style={{
            fontSize: "clamp(20px, 4vw, 32px)",
            fontFamily: "'Pretendard', sans-serif",
            fontWeight: 800, color: "var(--text-primary)",
            lineHeight: "1.35", letterSpacing: "-0.02em",
            marginBottom: "32px",
            wordBreak: "break-word", overflowWrap: "break-word",
          }}>
            {post.title}
          </h1>

          {/* EXECUTIVE SUMMARY */}
          {post.summary && (
            <div style={{ marginBottom: "36px" }}>
              <p style={{
                fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700,
                letterSpacing: "0.15em", color: "var(--text-placeholder)", marginBottom: "12px",
              }}>
                EXECUTIVE SUMMARY
              </p>
              <div style={{
                borderLeft: `3px solid ${meta.accent}`,
                padding: "16px 20px",
                backgroundColor: "var(--bg-subtle)",
              }}>
                <p style={{
                  fontSize: "15px", fontFamily: "'Pretendard', sans-serif",
                  color: "var(--text-secondary)", lineHeight: "1.8", fontWeight: 500, margin: 0,
                }}>
                  {post.summary}
                </p>
              </div>
            </div>
          )}

          {/* 구분선 */}
          {post.content && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "28px" }}>
              <p style={{
                fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700,
                letterSpacing: "0.15em", color: "var(--text-disabled)", flexShrink: 0, margin: 0,
              }}>
                BRIEFING DETAILS
              </p>
              <div style={{ flex: 1, height: "1px", backgroundColor: "var(--bg-subtle)" }} />
            </div>
          )}

          {/* 본문 */}
          {post.content ? (
            <div
              className="post-content"
              style={{
                fontSize: "clamp(14px, 3.5vw, 15px)", fontFamily: "'Pretendard', sans-serif",
                lineHeight: "1.95", color: "var(--text-secondary)",
                wordBreak: "break-word", overflowWrap: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-disabled)" }}>
              내용이 없습니다.
            </p>
          )}
        </div>
      </div>

      {/* ── 하단 고정 바 ── */}
      <div style={{
        borderTop: "1px solid var(--border)", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px clamp(16px, 4vw, 32px)", backgroundColor: "var(--bg-primary)",
      }}>
        {/* 링크 복사 */}
        <button
          onClick={handleCopy}
          className="transition-all"
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "7px 14px",
            backgroundColor: copied ? "#0F172A" : "var(--bg-card)",
            color: copied ? "white" : "var(--text-muted)",
            border: `1px solid ${copied ? "#0F172A" : "var(--border)"}`,
            cursor: "pointer",
            fontSize: "12px", fontFamily: "Inter, sans-serif",
          }}>
          <Link2 size={12} />
          <span>{copied ? "복사됨!" : "링크 복사"}</span>
        </button>

        {/* 저장하기 */}
        {session ? (
          <button
            onClick={handleLike}
            disabled={likeLoading}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "8px 20px",
              backgroundColor: liked ? "#0F172A" : "var(--bg-card)",
              color: liked ? "white" : "var(--text-secondary)",
              border: `1px solid ${liked ? "#0F172A" : "var(--border)"}`,
              cursor: likeLoading ? "not-allowed" : "pointer",
              fontSize: "13px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600,
              opacity: likeLoading ? 0.6 : 1,
              transition: "all 0.15s",
            }}>
            <Check size={14} strokeWidth={2.5} />
            <span>{liked ? "저장됨" : "저장하기"}</span>
            <span style={{
              color: liked ? "rgba(255,255,255,0.5)" : "var(--text-primary)",
              fontSize: "12px", fontWeight: 700, marginLeft: "2px",
            }}>
              {likeCount}
            </span>
          </button>
        ) : (
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "8px 16px",
            backgroundColor: "var(--bg-card)", color: "var(--text-placeholder)",
            border: "1px solid var(--border)",
            fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
          }}>
            <Lock size={13} />
            <span>회원 전용</span>
          </div>
        )}
      </div>
    </div>
  );
}
