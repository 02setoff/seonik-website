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

// 선익 메인 컬러 팔레트만 사용
const CATEGORY_META: Record<string, { accent: string; label: string; bg: string; border: string }> = {
  RADAR: { accent: "#0F172A",  label: "RADAR INTEL",  bg: "#F1F5F9", border: "#CBD5E1" },
  CORE:  { accent: "#334155",  label: "CORE BRIEF",   bg: "#F8F9FA", border: "#E2E8F0" },
  FLASH: { accent: "#64748B",  label: "FLASH ALERT",  bg: "#F8F9FA", border: "#E2E8F0" },
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
      backgroundColor: "white",
      display: "flex", flexDirection: "column",
      overflowY: "hidden",
    }}>

      {/* ── 상단 바 ── */}
      <div style={{
        borderBottom: "1px solid #E2E8F0", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(16px, 4vw, 32px)", height: "56px",
        backgroundColor: "white",
      }}>
        {/* 카테고리 배지 */}
        <span style={{
          fontSize: "10px", fontFamily: "Inter, sans-serif",
          fontWeight: 700, letterSpacing: "0.12em",
          padding: "4px 12px",
          backgroundColor: meta.bg, color: meta.accent,
          border: `1px solid ${meta.border}`,
        }}>
          {meta.label}
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "#94A3B8" }}>
            {formatDate(post.createdAt)}
          </span>
          {/* 닫기 */}
          <button onClick={onClose}
            className="hover:bg-[#F8F9FA] transition-colors"
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#94A3B8", padding: "6px", display: "flex", alignItems: "center",
              borderRadius: "4px",
            }}>
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
            fontWeight: 800, color: "#0F172A",
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
                letterSpacing: "0.15em", color: "#94A3B8", marginBottom: "12px",
              }}>
                EXECUTIVE SUMMARY
              </p>
              <div style={{
                borderLeft: `3px solid ${meta.accent}`,
                padding: "16px 20px",
                backgroundColor: meta.bg,
              }}>
                <p style={{
                  fontSize: "15px", fontFamily: "'Pretendard', sans-serif",
                  color: "#334155", lineHeight: "1.8", fontWeight: 500, margin: 0,
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
                letterSpacing: "0.15em", color: "#CBD5E1", flexShrink: 0, margin: 0,
              }}>
                BRIEFING DETAILS
              </p>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#F1F5F9" }} />
            </div>
          )}

          {/* 본문 */}
          {post.content ? (
            <div
              className="post-content"
              style={{
                fontSize: "clamp(14px, 3.5vw, 15px)", fontFamily: "'Pretendard', sans-serif",
                lineHeight: "1.95", color: "#374151",
                wordBreak: "break-word", overflowWrap: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#CBD5E1" }}>
              내용이 없습니다.
            </p>
          )}
        </div>
      </div>

      {/* ── 하단 고정 바 ── */}
      <div style={{
        borderTop: "1px solid #E2E8F0", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px clamp(16px, 4vw, 32px)", backgroundColor: "#FAFAFA",
      }}>
        {/* 링크 복사 */}
        <button onClick={handleCopy}
          className="transition-all"
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "7px 14px",
            backgroundColor: copied ? "#0F172A" : "white",
            color: copied ? "white" : "#64748B",
            border: `1px solid ${copied ? "#0F172A" : "#E2E8F0"}`,
            cursor: "pointer",
            fontSize: "12px", fontFamily: "Inter, sans-serif",
          }}>
          <Link2 size={12} />
          <span>{copied ? "복사됨!" : "링크 복사"}</span>
        </button>

        {/* 저장하기 */}
        {session ? (
          <button onClick={handleLike} disabled={likeLoading}
            style={{
              display: "flex", alignItems: "center", gap: "7px",
              padding: "8px 20px",
              backgroundColor: liked ? "#0F172A" : "white",
              color: liked ? "white" : "#475569",
              border: `1px solid ${liked ? "#0F172A" : "#E2E8F0"}`,
              cursor: likeLoading ? "not-allowed" : "pointer",
              fontSize: "13px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600,
              opacity: likeLoading ? 0.6 : 1,
              transition: "all 0.15s",
            }}>
            <Check size={14} strokeWidth={2.5} />
            <span>{liked ? "저장됨" : "저장하기"}</span>
            <span style={{
              color: liked ? "rgba(255,255,255,0.5)" : "#0F172A",
              fontSize: "12px", fontWeight: 700, marginLeft: "2px",
            }}>
              {likeCount}
            </span>
          </button>
        ) : (
          <div style={{
            display: "flex", alignItems: "center", gap: "6px",
            padding: "8px 16px",
            backgroundColor: "white", color: "#94A3B8",
            border: "1px solid #E2E8F0",
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
