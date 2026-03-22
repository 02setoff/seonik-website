"use client";

import { useEffect, useState, useRef } from "react";
import { X, Check, Lock, Link2 } from "lucide-react";
import { useSession } from "next-auth/react";

export interface PostItem {
  id: string;
  code?: string | null;
  title: string;
  summary: string | null;
  source?: string | null;
  bmBreakdown?: string | null;
  playbook?: string | null;
  actionItems?: string | null;
  deepDive?: string | null;    // 05단계 — 구독자 전용
  seonikNote?: string | null;  // 06단계 — 구독자 전용
  content: string | null;
  postType?: string;           // BRIEFING | NOTICE | GENERAL
  category: string;
  isFree?: boolean;
  isSubscriberOnly?: boolean;
  createdAt: string;
  viewCount?: number;
  likeCount?: number;
}

const ACCENT = "#0F172A";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  }).replace(/\. /g, ".").replace(/\.$/, "");
}

// 섹션 헤더 컴포넌트
function SectionHeader({ label }: { label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
      <p style={{
        fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700,
        letterSpacing: "0.15em", color: "var(--text-disabled)", flexShrink: 0, margin: 0,
      }}>
        {label}
      </p>
      <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }} />
    </div>
  );
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

  // TODO: 유료 전환 시 실제 구독 DB 체크로 교체 (현재는 모든 로그인 회원에게 전체 공개)
  const isSubscribed = true;

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
    } finally { setLikeLoading(false); }
  };

  if (!post) return null;

  const docCode = post.code || post.id.slice(0, 8).toUpperCase();
  const showSubscriberContent = isSubscribed || post.isFree;

  return (
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
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{
            fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700,
            letterSpacing: "0.12em", padding: "4px 12px",
            backgroundColor: "var(--bg-subtle)", color: "var(--text-primary)",
            border: "1px solid var(--border)",
          }}>INTEL BRIEF</span>
          {post.isFree ? (
            <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#16A34A" }}>🔓 무료</span>
          ) : (
            <span style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#D4AF37" }}>🔒 구독</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)" }}>
            {formatDate(post.createdAt)}
          </span>
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

          {/* ── 섹션 1: 코드명 + 헤드라인 ── */}
          <div style={{ marginBottom: "36px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
              <span style={{
                fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700,
                letterSpacing: "0.18em", backgroundColor: "var(--text-primary)",
                color: "var(--bg-primary)", padding: "2px 10px",
              }}>INTEL BRIEF</span>
              <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "var(--text-disabled)", letterSpacing: "0.12em", fontWeight: 600 }}>
                {docCode}
              </span>
            </div>
            <div style={{ borderTop: "2px solid var(--text-primary)", paddingTop: "18px" }}>
              <h1 style={{
                fontSize: "clamp(20px, 4vw, 32px)", fontFamily: "'Pretendard', sans-serif",
                fontWeight: 800, color: "var(--text-primary)", lineHeight: "1.35",
                letterSpacing: "-0.02em", marginBottom: "16px",
                wordBreak: "break-word", overflowWrap: "break-word",
              }}>
                {post.title}
              </h1>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
                {post.source && (
                  <p style={{ fontSize: "12px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-placeholder)", marginBottom: "4px" }}>
                    📡 첩보 소스: {post.source}
                  </p>
                )}
                <p style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "var(--text-disabled)" }}>
                  발행일: {formatDate(post.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* ── 섹션 2: 지휘관 요약 ── */}
          {post.summary && (
            <div style={{ marginBottom: "36px" }}>
              <SectionHeader label="▶ 브리핑 요약" />
              <div style={{ borderLeft: `3px solid ${ACCENT}`, padding: "16px 20px", backgroundColor: "var(--bg-subtle)" }}>
                <p style={{
                  fontSize: "15px", fontFamily: "'Pretendard', sans-serif",
                  color: "var(--text-secondary)", lineHeight: "1.8", fontWeight: 500, margin: 0,
                }}>
                  {post.summary}
                </p>
              </div>
            </div>
          )}

          {/* ── 섹션 3: BM 심층 해부 ── */}
          {post.bmBreakdown && (
            <div style={{ marginBottom: "36px" }}>
              <SectionHeader label="▶ 비즈니스 모델 심층 해부" />
              <div className="post-content" style={{
                fontSize: "clamp(14px, 3.5vw, 15px)", fontFamily: "'Pretendard', sans-serif",
                lineHeight: "1.95", color: "var(--text-secondary)",
                wordBreak: "break-word", overflowWrap: "break-word",
              }}
                dangerouslySetInnerHTML={{ __html: post.bmBreakdown }}
              />
            </div>
          )}

          {/* ── 섹션 4: 실행 가이드 (구독자 전용) ── */}
          {/* TODO: 유료 전환 시 비구독자에게 블러 처리 + 잠금 오버레이로 교체 */}
          {showSubscriberContent && post.playbook && (
            <div style={{ marginBottom: "36px" }}>
              <SectionHeader label="▶ 실행 가이드 (Playbook)" />
              <div className="post-content" style={{
                fontSize: "clamp(14px, 3.5vw, 15px)", fontFamily: "'Pretendard', sans-serif",
                lineHeight: "1.95", color: "var(--text-secondary)",
                wordBreak: "break-word", overflowWrap: "break-word",
              }}
                dangerouslySetInnerHTML={{ __html: post.playbook }}
              />
            </div>
          )}
          {!showSubscriberContent && post.isSubscriberOnly && (
            <div style={{ marginBottom: "36px", position: "relative" }}>
              <SectionHeader label="▶ 실행 가이드 (Playbook)" />
              <div style={{
                padding: "32px", textAlign: "center",
                border: "1px solid #D4AF37", backgroundColor: "var(--bg-subtle)",
              }}>
                <Lock size={24} style={{ color: "#D4AF37", marginBottom: "12px" }} />
                <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)", margin: "0 0 16px" }}>
                  실행 가이드는 구독 회원 전용입니다.
                </p>
                <button style={{
                  padding: "10px 24px", backgroundColor: "#D4AF37", color: "#0F172A",
                  border: "none", fontFamily: "'Pretendard', sans-serif", fontWeight: 700,
                  fontSize: "13px", cursor: "pointer",
                }}>
                  구독하고 전략 받기 →
                </button>
              </div>
            </div>
          )}

          {/* ── 섹션 5: 체크리스트 (구독자 전용) ── */}
          {/* TODO: 유료 전환 시 비구독자에게 블러 처리 + 잠금 오버레이로 교체 */}
          {showSubscriberContent && post.actionItems && (
            <div style={{ marginBottom: "36px" }}>
              <SectionHeader label="▶ 오늘의 체크리스트" />
              <div className="post-content" style={{
                fontSize: "clamp(14px, 3.5vw, 15px)", fontFamily: "'Pretendard', sans-serif",
                lineHeight: "1.95", color: "var(--text-secondary)",
                wordBreak: "break-word", overflowWrap: "break-word",
              }}
                dangerouslySetInnerHTML={{ __html: post.actionItems }}
              />
            </div>
          )}

          {/* ── 기존 content 필드 (하위 호환) ── */}
          {post.content && !post.bmBreakdown && !post.playbook && (
            <div style={{ marginBottom: "36px" }}>
              <SectionHeader label="BRIEFING DETAILS" />
              <div className="post-content" style={{
                fontSize: "clamp(14px, 3.5vw, 15px)", fontFamily: "'Pretendard', sans-serif",
                lineHeight: "1.95", color: "var(--text-secondary)",
                wordBreak: "break-word", overflowWrap: "break-word",
              }}
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── 하단 고정 바 ── */}
      <div style={{
        borderTop: "1px solid var(--border)", flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px clamp(16px, 4vw, 32px)", backgroundColor: "var(--bg-primary)",
      }}>
        <button
          onClick={handleCopy}
          style={{
            display: "flex", alignItems: "center", gap: "6px", padding: "7px 14px",
            backgroundColor: copied ? "#0F172A" : "var(--bg-card)",
            color: copied ? "white" : "var(--text-muted)",
            border: `1px solid ${copied ? "#0F172A" : "var(--border)"}`,
            cursor: "pointer", fontSize: "12px", fontFamily: "Inter, sans-serif",
          }}>
          <Link2 size={12} />
          <span>{copied ? "복사됨!" : "링크 복사"}</span>
        </button>

        {session ? (
          <button
            onClick={handleLike}
            disabled={likeLoading}
            style={{
              display: "flex", alignItems: "center", gap: "7px", padding: "8px 20px",
              backgroundColor: liked ? "#0F172A" : "var(--bg-card)",
              color: liked ? "white" : "var(--text-secondary)",
              border: `1px solid ${liked ? "#0F172A" : "var(--border)"}`,
              cursor: likeLoading ? "not-allowed" : "pointer",
              fontSize: "13px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600,
              opacity: likeLoading ? 0.6 : 1, transition: "all 0.15s",
            }}>
            <Check size={14} strokeWidth={2.5} />
            <span>{liked ? "저장됨" : "저장하기"}</span>
            <span style={{
              color: liked ? "rgba(255,255,255,0.5)" : "var(--text-primary)",
              fontSize: "12px", fontWeight: 700, marginLeft: "2px",
            }}>{likeCount}</span>
          </button>
        ) : (
          <div style={{
            display: "flex", alignItems: "center", gap: "6px", padding: "8px 16px",
            backgroundColor: "var(--bg-card)", color: "var(--text-placeholder)",
            border: "1px solid var(--border)", fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
          }}>
            <Lock size={13} />
            <span>회원 전용</span>
          </div>
        )}
      </div>
    </div>
  );
}
