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

const CATEGORY_META: Record<string, { color: string; label: string; bg: string }> = {
  RADAR: { color: "#3B82F6", label: "RADAR INTEL", bg: "#EFF6FF" },
  CORE:  { color: "#8B5CF6", label: "CORE BRIEF",  bg: "#F5F3FF" },
  FLASH: { color: "#F59E0B", label: "FLASH ALERT", bg: "#FFFBEB" },
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
  const backdropMouseDown = useRef(false);
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [copied, setCopied] = useState(false);

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

  const meta = CATEGORY_META[post.category] || { color: "#64748B", label: post.category, bg: "#F8F9FA" };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 300,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        backgroundColor: "rgba(15, 23, 42, 0.8)", backdropFilter: "blur(6px)",
      }}
      onMouseDown={(e) => { backdropMouseDown.current = e.target === e.currentTarget; }}
      onClick={(e) => { if (backdropMouseDown.current && e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        backgroundColor: "#ffffff", width: "100%", maxWidth: "760px",
        maxHeight: "88vh", overflow: "hidden",
        display: "flex", flexDirection: "column",
        boxShadow: "0 24px 64px rgba(15,23,42,0.25)",
      }}>

        {/* 카테고리 컬러 탑 바 */}
        <div style={{ height: "4px", backgroundColor: meta.color, flexShrink: 0 }} />

        {/* 헤더 */}
        <div style={{ padding: "24px 36px 20px", flexShrink: 0, borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px" }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* 카테고리 배지 + 날짜 */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{
                  display: "inline-block", padding: "3px 10px",
                  backgroundColor: meta.bg, color: meta.color,
                  fontSize: "10px", fontFamily: "Inter, sans-serif",
                  fontWeight: 700, letterSpacing: "0.1em",
                }}>
                  {meta.label}
                </span>
                <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.05em" }}>
                  INTEL DATE: {formatDate(post.createdAt)}
                </span>
              </div>
              {/* 제목 */}
              <h2 style={{
                fontSize: "24px", fontFamily: "'Pretendard', sans-serif",
                fontWeight: 800, color: "#0F172A", lineHeight: "1.3",
                letterSpacing: "-0.02em",
              }}>
                {post.title}
              </h2>
            </div>
            <button onClick={onClose}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#CBD5E1", flexShrink: 0, padding: "4px", marginTop: "2px" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#0F172A")}
              onMouseLeave={e => (e.currentTarget.style.color = "#CBD5E1")}
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* 본문 스크롤 영역 */}
        <div style={{ overflowY: "auto", flex: 1, padding: "28px 36px 24px" }}>

          {/* EXECUTIVE SUMMARY */}
          {post.summary && (
            <div style={{ marginBottom: "28px" }}>
              <p style={{
                fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700,
                letterSpacing: "0.12em", color: meta.color, marginBottom: "10px",
              }}>
                EXECUTIVE SUMMARY
              </p>
              <div style={{
                borderLeft: `3px solid ${meta.color}`,
                paddingLeft: "16px",
                backgroundColor: meta.bg,
                padding: "14px 16px 14px 18px",
              }}>
                <p style={{
                  fontSize: "15px", fontFamily: "'Pretendard', sans-serif",
                  color: "#374151", lineHeight: "1.75", fontWeight: 500,
                  margin: 0,
                }}>
                  {post.summary}
                </p>
              </div>
            </div>
          )}

          {/* BRIEFING 구분선 */}
          {post.content && (
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <p style={{
                fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700,
                letterSpacing: "0.12em", color: "#94A3B8", flexShrink: 0, margin: 0,
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
              style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", lineHeight: "1.9", color: "#374151" }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          ) : (
            <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#CBD5E1" }}>
              내용이 없습니다.
            </p>
          )}
        </div>

        {/* 푸터 */}
        <div style={{
          borderTop: "1px solid #F1F5F9", flexShrink: 0,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 36px", backgroundColor: "#FAFAFA",
        }}>
          {/* 링크 복사 */}
          <button
            onClick={handleCopy}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "6px 12px",
              backgroundColor: copied ? "#0F172A" : "white",
              color: copied ? "white" : "#94A3B8",
              border: `1px solid ${copied ? "#0F172A" : "#E2E8F0"}`,
              cursor: "pointer",
              fontSize: "12px", fontFamily: "Inter, sans-serif",
              transition: "all 0.15s ease",
            }}
          >
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
                padding: "7px 18px",
                backgroundColor: liked ? meta.color : "white",
                color: liked ? "white" : "#94A3B8",
                border: `1px solid ${liked ? meta.color : "#E2E8F0"}`,
                cursor: "pointer",
                fontSize: "13px", fontFamily: "Inter, sans-serif", fontWeight: 500,
                transition: "all 0.15s ease",
                opacity: likeLoading ? 0.6 : 1,
              }}
            >
              <Check size={14} />
              <span>{liked ? "저장됨" : "저장하기"}</span>
              <span style={{
                color: liked ? "rgba(255,255,255,0.55)" : "#CBD5E1",
                fontSize: "12px", marginLeft: "2px",
              }}>
                {likeCount}
              </span>
            </button>
          ) : (
            <div style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "7px 14px",
              backgroundColor: "white", color: "#CBD5E1",
              border: "1px solid #E2E8F0",
              fontSize: "13px", fontFamily: "Inter, sans-serif",
            }}>
              <Lock size={13} />
              <span>회원 전용</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
