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
      letterSpacing: "0.18em", color: "#166534",
      border: "1.5px solid #166534", padding: "2px 8px",
    }}>● 공개</span>
  ) : (
    <span style={{
      fontSize: "9px", fontFamily: "Courier New, monospace", fontWeight: 700,
      letterSpacing: "0.18em", color: "#92400E",
      border: "1.5px solid #D4AF37", padding: "2px 8px",
    }}>● 구독</span>
  );
}

// ── 섹션 번호 + 구분선 ───────────────────────────────────────────
function DocSection({ num, label, children }: { num: string; label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "32px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "18px" }}>
        <span style={{
          fontSize: "11px", fontFamily: "Courier New, monospace", fontWeight: 700,
          letterSpacing: "0.1em", color: "var(--text-primary)",
          whiteSpace: "nowrap",
        }}>{num}</span>
        <span style={{
          fontSize: "10px", fontFamily: "Courier New, monospace", fontWeight: 700,
          letterSpacing: "0.14em", color: "var(--text-disabled)",
          whiteSpace: "nowrap",
        }}>{label}</span>
        <div style={{ flex: 1, height: "1px", backgroundColor: "var(--border)" }} />
      </div>
      {children}
    </div>
  );
}

// ── 개별 브리핑 문서 ─────────────────────────────────────────────
function BriefingDocument({ post, index }: { post: PostItem; index: number }) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState<boolean | null>(null);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);
  const [likeLoading, setLikeLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // TODO: 유료 전환 시 실제 구독 DB 체크로 교체
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
    <div style={{
      marginBottom: "48px",
      border: "1px solid var(--text-primary)",
      backgroundColor: "var(--bg-primary)",
    }}>

      {/* ── 문서 헤더 상단 스트립 ── */}
      <div style={{
        borderBottom: "2px solid var(--text-primary)",
        padding: "12px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "10px",
        backgroundColor: "var(--bg-subtle)",
      }}>
        {/* 왼쪽: 문서 분류 + 코드 + 날짜 */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <span style={{
            fontSize: "9px", fontFamily: "Courier New, monospace", fontWeight: 700,
            letterSpacing: "0.2em", color: "var(--bg-primary)",
            backgroundColor: "var(--text-primary)", padding: "3px 10px",
          }}>INTEL BRIEF</span>
          <span style={{
            fontSize: "10px", fontFamily: "Courier New, monospace",
            color: "var(--text-secondary)", letterSpacing: "0.12em", fontWeight: 600,
          }}>{docCode}</span>
          <span style={{
            width: "1px", height: "12px", backgroundColor: "var(--border)",
            display: "inline-block",
          }} />
          <span style={{
            fontSize: "10px", fontFamily: "Courier New, monospace",
            color: "var(--text-placeholder)", letterSpacing: "0.1em",
          }}>{formatDate(post.createdAt)}</span>
        </div>

        {/* 오른쪽: 분류 등급 + 조회수 */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{
            display: "flex", alignItems: "center", gap: "4px",
            fontSize: "10px", fontFamily: "Courier New, monospace",
            color: "var(--text-placeholder)", letterSpacing: "0.05em",
          }}>
            <Eye size={10} strokeWidth={1.5} /> {post.viewCount ?? 0}
          </span>
          <ClassificationBadge isFree={post.isFree} />
        </div>
      </div>

      {/* ── SUBJECT / SOURCE 필드 블록 ── */}
      <div style={{
        borderBottom: "1px solid var(--border)",
        padding: "16px 20px",
      }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "max-content 1fr",
          gap: "8px 16px",
          alignItems: "start",
        }}>
          {/* SUBJECT */}
          <span style={{
            fontSize: "10px", fontFamily: "Courier New, monospace", fontWeight: 700,
            letterSpacing: "0.15em", color: "var(--text-disabled)",
            paddingTop: "3px",
          }}>SUBJECT</span>
          <h2 style={{
            fontSize: "clamp(17px, 2.8vw, 22px)",
            fontFamily: "'Pretendard', sans-serif",
            fontWeight: 800,
            color: "var(--text-primary)",
            lineHeight: 1.35,
            letterSpacing: "-0.02em",
            margin: 0,
            wordBreak: "break-word",
          }}>
            {post.title}
          </h2>

          {/* SOURCE */}
          {post.source && (
            <>
              <span style={{
                fontSize: "10px", fontFamily: "Courier New, monospace", fontWeight: 700,
                letterSpacing: "0.15em", color: "var(--text-disabled)",
                paddingTop: "2px",
              }}>SOURCE</span>
              <span style={{
                fontSize: "12px", fontFamily: "Courier New, monospace",
                color: "var(--text-secondary)", letterSpacing: "0.04em",
              }}>{post.source}</span>
            </>
          )}
        </div>
      </div>

      {/* ── 본문 섹션들 ── */}
      <div style={{ padding: "28px 20px 20px" }}>

        {/* 01. 브리핑 요약 */}
        {post.summary && (
          <DocSection num="01" label="브리핑 요약">
            <p style={{
              fontSize: "14px",
              fontFamily: "'Pretendard', sans-serif",
              color: "var(--text-secondary)",
              lineHeight: "1.95",
              borderLeft: "3px solid var(--text-primary)",
              paddingLeft: "18px",
              margin: 0,
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
                lineHeight: "1.95", color: "var(--text-secondary)",
                wordBreak: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: post.bmBreakdown }}
            />
          </DocSection>
        )}

        {/* 03. 실행 가이드 (구독자 전용) */}
        {showSubscriberContent && post.playbook && (
          <DocSection num="03" label="실행 가이드">
            {/* TODO: 유료 전환 시 비구독자에게 블러/잠금 처리 */}
            <div
              className="post-content"
              style={{
                fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
                lineHeight: "1.95", color: "var(--text-secondary)",
                wordBreak: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: post.playbook }}
            />
          </DocSection>
        )}

        {/* 04. 체크리스트 (구독자 전용) */}
        {showSubscriberContent && post.actionItems && (
          <DocSection num="04" label="체크리스트">
            {/* TODO: 유료 전환 시 비구독자에게 블러/잠금 처리 */}
            <div
              className="post-content"
              style={{
                fontSize: "14px", fontFamily: "'Pretendard', sans-serif",
                lineHeight: "1.95", color: "var(--text-secondary)",
                wordBreak: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: post.actionItems }}
            />
          </DocSection>
        )}

        {/* 잠금 안내 (비구독자) */}
        {isLocked && (
          <div style={{
            padding: "28px 24px", textAlign: "center",
            border: "1px dashed #D4AF37",
            backgroundColor: "rgba(212,175,55,0.03)",
            marginTop: "4px",
          }}>
            {/* 레드액션 바 */}
            <div style={{ marginBottom: "18px" }}>
              {[88, 72, 80].map((w, i) => (
                <div key={i} style={{
                  height: "11px", backgroundColor: "var(--text-primary)",
                  opacity: 0.12, margin: "7px auto",
                  width: `${w}%`,
                }} />
              ))}
            </div>
            <Lock size={16} style={{ color: "#D4AF37", marginBottom: "10px" }} />
            <p style={{
              fontSize: "11px", fontFamily: "Courier New, monospace",
              letterSpacing: "0.1em", color: "var(--text-muted)",
              margin: "0 0 16px",
            }}>
              실행 가이드 및 체크리스트 — 구독자 전용 정보
            </p>
            <button style={{
              padding: "8px 24px", backgroundColor: "#D4AF37", color: "#0F172A",
              border: "none", fontFamily: "Courier New, monospace", fontWeight: 700,
              fontSize: "11px", letterSpacing: "0.14em", cursor: "pointer",
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
                lineHeight: "1.95", color: "var(--text-secondary)",
                wordBreak: "break-word",
              }}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </DocSection>
        )}
      </div>

      {/* ── 문서 푸터 ── */}
      <div style={{
        borderTop: "1px solid var(--border)",
        padding: "10px 20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        backgroundColor: "var(--bg-subtle)",
      }}>
        {/* 문서 번호 + 시리얼 */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{
            fontSize: "9px", fontFamily: "Courier New, monospace",
            color: "var(--text-disabled)", letterSpacing: "0.1em",
          }}>DOC {String(index + 1).padStart(3, "0")}</span>

          <button
            onClick={handleCopy}
            style={{
              display: "flex", alignItems: "center", gap: "5px",
              padding: "4px 10px",
              fontSize: "9px", fontFamily: "Courier New, monospace",
              fontWeight: 700, letterSpacing: "0.14em",
              backgroundColor: copied ? "var(--text-primary)" : "transparent",
              color: copied ? "var(--bg-primary)" : "var(--text-disabled)",
              border: "1px solid var(--border)",
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            <Link2 size={9} />
            {copied ? "COPIED" : "COPY LINK"}
          </button>
        </div>

        {/* 저장 */}
        {session ? (
          <button
            onClick={handleLike}
            disabled={likeLoading}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "4px 14px",
              fontSize: "9px", fontFamily: "Courier New, monospace",
              fontWeight: 700, letterSpacing: "0.14em",
              backgroundColor: liked ? "var(--text-primary)" : "transparent",
              color: liked ? "var(--bg-primary)" : "var(--text-secondary)",
              border: "1px solid var(--border)",
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
            color: "var(--text-disabled)", letterSpacing: "0.1em",
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
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px clamp(20px, 5vw, 40px) 0" }}>

        {/* 로딩 */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "96px", gap: "4px" }}>
            <p style={{
              fontFamily: "Courier New, monospace", fontWeight: 700,
              fontSize: "16px", color: "var(--text-primary)",
              lineHeight: 1, letterSpacing: "0.2em",
            }}>SEONIK INTEL</p>
            <p style={{
              fontFamily: "Courier New, monospace", fontSize: "9px",
              letterSpacing: "0.22em", color: "var(--text-placeholder)", marginTop: "6px",
            }}>LOADING BRIEFINGS...</p>
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
            }}>
              NO BRIEFINGS AVAILABLE
            </p>
          </div>
        )}

        {/* 브리핑 문서 목록 */}
        {!loading && posts.length > 0 && (
          <>
            {posts.map((post, i) => (
              <BriefingDocument key={post.id} post={post} index={i} />
            ))}

            {/* 더 보기 */}
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
                    opacity: loadingMore ? 0.5 : 1, padding: "12px 40px",
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
                  {loadingMore ? "LOADING..." : "LOAD MORE INTEL"}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
