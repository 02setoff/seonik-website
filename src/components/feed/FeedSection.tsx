"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, Eye, Link2, Lock } from "lucide-react";
import { useSession } from "next-auth/react";
import { PostItem } from "./PostModal";

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}`;
}

// ── 분류 등급 배지 ────────────────────────────────────────────────
function ClassificationBadge({ isFree }: { isFree?: boolean }) {
  return isFree ? (
    <span style={{
      fontSize: "9px", fontFamily: "Courier New, monospace", fontWeight: 700,
      letterSpacing: "0.18em", color: "#14532D",
      border: "1.5px solid #14532D", padding: "2px 8px", whiteSpace: "nowrap",
    }}>● 공개</span>
  ) : (
    <span style={{
      fontSize: "9px", fontFamily: "Courier New, monospace", fontWeight: 700,
      letterSpacing: "0.18em", color: "#78350F",
      border: "1.5px solid #B45309", padding: "2px 8px", whiteSpace: "nowrap",
    }}>● 구독</span>
  );
}

// ── 섹션 번호 + 구분선 ───────────────────────────────────────────
function DocSection({ num, label, children }: { num: string; label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "30px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "18px" }}>
        <span style={{
          fontSize: "10px", fontFamily: "Courier New, monospace", fontWeight: 700,
          letterSpacing: "0.1em", color: "#0F172A", whiteSpace: "nowrap",
        }}>{num}</span>
        <span style={{
          fontSize: "9px", fontFamily: "Courier New, monospace", fontWeight: 700,
          letterSpacing: "0.2em", color: "#9CA3AF", whiteSpace: "nowrap",
        }}>{label.toUpperCase()}</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "#D4CAB8" }} />
      </div>
      {children}
    </div>
  );
}

// ── A4 브리핑 문서 ───────────────────────────────────────────────
function BriefingDocument({ post, index }: { post: PostItem; index: number }) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState<boolean | null>(null);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // TODO: 유료 전환 시 실제 구독 상태로 교체
  const isSubscribed = true;
  const showSubscriberContent = isSubscribed || post.isFree;
  const isLocked = post.isSubscriberOnly && !showSubscriberContent;

  const docCode = post.code || `SNK-${post.id.slice(0, 6).toUpperCase()}`;

  const handleLike = useCallback(async () => {
    if (!session || likeLoading) return;
    setLikeLoading(true);
    try {
      const res = await fetch(`/api/posts/${post.id}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok) { setLiked(data.liked); setLikeCount(data.count); }
    } finally { setLikeLoading(false); }
  }, [session, likeLoading, post.id]);

  const handleCopy = useCallback(() => {
    const url = `${window.location.origin}/?p=${post.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => {});
  }, [post.id]);

  return (
    <div
      className="intel-doc"
      style={{
        marginBottom: "64px",
        backgroundColor: "var(--doc-paper)",
        border: "1px solid var(--doc-border)",
        boxShadow: "0 2px 6px rgba(0,0,0,0.06), 0 16px 40px rgba(0,0,0,0.08)",
        position: "relative",
      }}
    >
      {/* ── 상단 헤더 밴드 ── */}
      <div style={{
        backgroundColor: "var(--doc-band)",
        borderBottom: "1px solid var(--doc-border)",
        padding: "10px clamp(18px,5vw,44px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "8px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span style={{
            fontSize: "9px", fontFamily: "Courier New, monospace", fontWeight: 700,
            letterSpacing: "0.28em", color: "#0F172A",
          }}>SEONIK INTELLIGENCE</span>
          <span style={{ width: "1px", height: "10px", backgroundColor: "#C8BFAF", display: "inline-block" }} />
          <span style={{
            fontSize: "9px", fontFamily: "Courier New, monospace",
            color: "#9CA3AF", letterSpacing: "0.12em",
          }}>{formatDate(post.createdAt)}</span>
          <span style={{ width: "1px", height: "10px", backgroundColor: "#C8BFAF", display: "inline-block" }} />
          <span style={{
            fontSize: "9px", fontFamily: "Courier New, monospace",
            color: "#9CA3AF", letterSpacing: "0.12em",
          }}>{docCode}</span>
        </div>
        <ClassificationBadge isFree={post.isFree} />
      </div>

      {/* ── 이중 구분선 (공식 문서 헤더 마킹) ── */}
      <div style={{
        borderTop: "3px solid #0F172A",
        borderBottom: "1px solid #0F172A",
        height: "4px",
      }} />

      {/* ── META 필드 블록 (FROM / DATE / REF / SUBJECT / SOURCE) ── */}
      <div style={{
        padding: "20px clamp(18px,5vw,44px) 18px",
        borderBottom: "1px solid var(--doc-rule)",
      }}>
        {/* FROM / DATE / REF */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "max-content 1fr",
          gap: "5px 18px",
          marginBottom: "14px",
          fontSize: "10px",
          fontFamily: "Courier New, monospace",
          lineHeight: 1.6,
        }}>
          <span style={{ color: "#9CA3AF", letterSpacing: "0.1em" }}>FROM</span>
          <span style={{ color: "#4B5563" }}>선익 정보분석팀 · SEONIK Intelligence Analysis</span>
          <span style={{ color: "#9CA3AF", letterSpacing: "0.1em" }}>DATE</span>
          <span style={{ color: "#4B5563", letterSpacing: "0.04em" }}>{formatDate(post.createdAt)}</span>
          <span style={{ color: "#9CA3AF", letterSpacing: "0.1em" }}>REF</span>
          <span style={{ color: "#4B5563", letterSpacing: "0.04em" }}>{docCode}</span>
        </div>

        <div style={{ borderTop: "1px solid var(--doc-rule)", marginBottom: "14px" }} />

        {/* SUBJECT */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "max-content 1fr",
          gap: "0 18px",
          alignItems: "start",
          marginBottom: post.source ? "8px" : 0,
        }}>
          <span style={{
            fontSize: "10px", fontFamily: "Courier New, monospace",
            letterSpacing: "0.1em", color: "#9CA3AF",
            paddingTop: "4px", whiteSpace: "nowrap",
          }}>SUBJECT</span>
          <h2 style={{
            fontSize: "clamp(16px, 2.6vw, 22px)",
            fontFamily: "'Pretendard', sans-serif",
            fontWeight: 800, letterSpacing: "-0.025em", lineHeight: 1.32,
            color: "#0F172A", margin: 0, wordBreak: "break-word",
          }}>
            {post.title}
          </h2>
        </div>

        {/* SOURCE */}
        {post.source && (
          <div style={{
            display: "grid",
            gridTemplateColumns: "max-content 1fr",
            gap: "0 18px",
          }}>
            <span style={{
              fontSize: "10px", fontFamily: "Courier New, monospace",
              letterSpacing: "0.1em", color: "#9CA3AF",
            }}>SOURCE</span>
            <span style={{
              fontSize: "11px", fontFamily: "Courier New, monospace",
              color: "#6B7280", letterSpacing: "0.04em",
            }}>{post.source}</span>
          </div>
        )}
      </div>

      {/* ── 본문 섹션들 ── */}
      <div style={{ padding: "28px clamp(18px,5vw,44px) 24px" }}>

        {/* 01. 브리핑 요약 */}
        {post.summary && (
          <DocSection num="01" label="브리핑 요약">
            <p style={{
              fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
              color: "#374151", lineHeight: "1.95",
              borderLeft: "3px solid #0F172A",
              paddingLeft: "18px", margin: 0,
            }}>
              {post.summary}
            </p>
          </DocSection>
        )}

        {/* 02. 비즈니스 모델 해부 */}
        {post.bmBreakdown && (
          <DocSection num="02" label="비즈니스 모델 해부">
            <div
              className="post-content"
              style={{
                fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
                lineHeight: "1.95", color: "#374151",
                wordBreak: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: post.bmBreakdown }}
            />
          </DocSection>
        )}

        {/* 03. 실행 가이드 */}
        {showSubscriberContent && post.playbook && (
          <DocSection num="03" label="실행 가이드">
            <div
              className="post-content"
              style={{
                fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
                lineHeight: "1.95", color: "#374151",
                wordBreak: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: post.playbook }}
            />
          </DocSection>
        )}

        {/* 04. 체크리스트 */}
        {showSubscriberContent && post.actionItems && (
          <DocSection num="04" label="체크리스트">
            <div
              className="post-content"
              style={{
                fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
                lineHeight: "1.95", color: "#374151",
                wordBreak: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: post.actionItems }}
            />
          </DocSection>
        )}

        {/* 잠금 안내 (비구독자 전용) */}
        {isLocked && (
          <div style={{
            padding: "28px 24px", textAlign: "center",
            border: "1px dashed #B45309",
            backgroundColor: "rgba(180,83,9,0.03)",
            marginTop: "4px",
          }}>
            {/* 레드액션 마킹 바 */}
            <div style={{ marginBottom: "20px" }}>
              {[85, 70, 78].map((w, i) => (
                <div key={i} style={{
                  height: "10px", backgroundColor: "#1E293B",
                  opacity: 0.13, margin: "7px auto", width: `${w}%`,
                }} />
              ))}
            </div>
            <Lock size={15} style={{ color: "#B45309", marginBottom: "10px" }} />
            <p style={{
              fontSize: "10px", fontFamily: "Courier New, monospace",
              letterSpacing: "0.14em", color: "#9CA3AF",
              margin: "0 0 18px",
            }}>RESTRICTED — SUBSCRIBER ACCESS ONLY</p>
            <button style={{
              padding: "8px 28px", backgroundColor: "#0F172A", color: "#FDFCF8",
              border: "none", fontFamily: "Courier New, monospace", fontWeight: 700,
              fontSize: "10px", letterSpacing: "0.18em", cursor: "pointer",
            }}>SUBSCRIBE →</button>
          </div>
        )}

        {/* 기존 content 하위 호환 */}
        {post.content && !post.bmBreakdown && !post.playbook && (
          <DocSection num="01" label="상세 내용">
            <div
              className="post-content"
              style={{
                fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
                lineHeight: "1.95", color: "#374151",
                wordBreak: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </DocSection>
        )}
      </div>

      {/* ── 하단 문서 푸터 (이중선) ── */}
      <div style={{
        borderTop: "3px solid #0F172A",
        borderBottom: "1px solid #0F172A",
        height: "4px",
      }} />
      <div style={{
        backgroundColor: "var(--doc-band)",
        borderTop: "1px solid var(--doc-border)",
        padding: "10px clamp(18px,5vw,44px)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "8px",
      }}>
        {/* 왼쪽: 문서번호 + 조회수 + COPY */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{
            fontSize: "9px", fontFamily: "Courier New, monospace",
            color: "#9CA3AF", letterSpacing: "0.12em",
          }}>DOC {String(index + 1).padStart(3, "0")}</span>

          <span style={{
            fontSize: "9px", fontFamily: "Courier New, monospace",
            color: "#9CA3AF", letterSpacing: "0.08em",
            display: "flex", alignItems: "center", gap: "4px",
          }}>
            <Eye size={9} strokeWidth={1.5} /> {post.viewCount ?? 0}
          </span>

          <button
            onClick={handleCopy}
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              padding: "3px 10px",
              fontSize: "9px", fontFamily: "Courier New, monospace",
              fontWeight: 700, letterSpacing: "0.14em",
              backgroundColor: copied ? "#0F172A" : "transparent",
              color: copied ? "#FDFCF8" : "#9CA3AF",
              border: "1px solid #C8BFAF",
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            <Link2 size={9} />
            {copied ? "COPIED" : "COPY LINK"}
          </button>
        </div>

        {/* 오른쪽: SAVE */}
        {session ? (
          <button
            onClick={handleLike}
            disabled={likeLoading}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "3px 14px",
              fontSize: "9px", fontFamily: "Courier New, monospace",
              fontWeight: 700, letterSpacing: "0.14em",
              backgroundColor: liked ? "#0F172A" : "transparent",
              color: liked ? "#FDFCF8" : "#6B7280",
              border: "1px solid #C8BFAF",
              cursor: likeLoading ? "not-allowed" : "pointer",
              opacity: likeLoading ? 0.6 : 1, transition: "all 0.15s",
            }}
          >
            <Check size={9} strokeWidth={2.5} />
            {liked ? "SAVED" : "SAVE"}
            <span style={{ opacity: 0.6, marginLeft: "2px" }}>{likeCount}</span>
          </button>
        ) : (
          <span style={{
            fontSize: "9px", fontFamily: "Courier New, monospace",
            color: "#9CA3AF", letterSpacing: "0.1em",
            display: "flex", alignItems: "center", gap: "5px",
          }}>
            <Lock size={9} /> 로그인 필요
          </span>
        )}
      </div>
    </div>
  );
}

// ── 메인 컴포넌트 ─────────────────────────────────────────────────
export default function FeedSection() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    fetch("/api/posts?take=5")
      .then((r) => r.json())
      .then((data: { posts: PostItem[]; nextCursor: string | null }) => {
        setPosts(data.posts ?? []);
        setCursor(data.nextCursor ?? null);
        setLoading(false);
      })
      .catch(() => { setLoading(false); });
  }, []);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/posts?take=5&cursor=${cursor}`);
      const data: { posts: PostItem[]; nextCursor: string | null } = await res.json();
      setPosts((prev) => [...prev, ...(data.posts ?? [])]);
      setCursor(data.nextCursor ?? null);
    } catch {}
    finally { setLoadingMore(false); }
  };

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "70vh", paddingBottom: "120px" }}>
      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "52px clamp(16px, 4vw, 32px) 0" }}>

        {/* 로딩 */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "96px", gap: "6px" }}>
            <p style={{
              fontFamily: "Courier New, monospace", fontWeight: 700,
              fontSize: "12px", color: "var(--text-primary)",
              letterSpacing: "0.3em",
            }}>SEONIK INTELLIGENCE</p>
            <p style={{
              fontFamily: "Courier New, monospace", fontSize: "9px",
              letterSpacing: "0.22em", color: "var(--text-placeholder)", marginTop: "4px",
            }}>RETRIEVING BRIEFINGS...</p>
            <div style={{ display: "flex", gap: "6px", marginTop: "20px" }}>
              {[0, 150, 300].map((delay) => (
                <span key={delay} className="animate-bounce" style={{
                  display: "block", width: "4px", height: "4px",
                  backgroundColor: "var(--text-muted)", animationDelay: `${delay}ms`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* 빈 상태 */}
        {!loading && posts.length === 0 && (
          <div style={{ textAlign: "center", paddingTop: "96px" }}>
            <p style={{
              fontSize: "10px", fontFamily: "Courier New, monospace",
              color: "var(--text-disabled)", letterSpacing: "0.22em",
            }}>NO BRIEFINGS ON FILE</p>
          </div>
        )}

        {/* 브리핑 문서 목록 */}
        {!loading && posts.length > 0 && (
          <>
            {posts.map((post, i) => (
              <BriefingDocument key={post.id} post={post} index={i} />
            ))}

            {cursor && (
              <div style={{ display: "flex", justifyContent: "center", paddingTop: "8px" }}>
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  style={{
                    fontFamily: "Courier New, monospace", fontSize: "10px",
                    fontWeight: 700, letterSpacing: "0.22em",
                    color: "var(--text-muted)", background: "none",
                    border: "1px solid var(--border)",
                    cursor: loadingMore ? "not-allowed" : "pointer",
                    opacity: loadingMore ? 0.5 : 1, padding: "12px 44px",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    if (!loadingMore) {
                      (e.currentTarget as HTMLButtonElement).style.color = "var(--text-primary)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
                  }}
                >
                  {loadingMore ? "RETRIEVING..." : "LOAD MORE BRIEFINGS"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
