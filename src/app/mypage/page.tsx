"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check } from "lucide-react";
import PostModal, { PostItem } from "@/components/feed/PostModal";

interface LikedPost {
  post: { id: string; title: string; summary: string | null; content: string | null; category: string; createdAt: string; viewCount: number; _count: { likes: number }; };
  createdAt: string;
}
interface RecentView {
  post: { id: string; title: string; summary: string | null; content: string | null; category: string; createdAt: string; viewCount: number; _count: { likes: number }; };
  viewedAt: string;
}
interface CategoryStat { category: string; count: number; }
interface UserProfile {
  id: string; name: string | null; email: string | null;
  occupation: string | null; howFound: string | null; joinReason: string | null;
  createdAt: string; likes: LikedPost[]; recentViews: RecentView[]; categoryStats: CategoryStat[]; totalRead: number;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\. /g, ".").replace(/\.$/, "");
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }).replace(/\. /g, ".").replace(/\.$/, "");
}

const LABEL: Record<string, string> = { occupation: "직업", howFound: "선익을 알게 된 경로", joinReason: "가입 이유" };

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { if (status === "unauthenticated") router.push("/"); }, [status, router]);
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user").then(r => r.json()).then(data => { setProfile(data); setProfileLoaded(true); }).catch(() => { setProfileLoaded(true); });
    }
  }, [status]);

  const handleDelete = async () => {
    setDeleting(true);
    try { const res = await fetch("/api/user", { method: "DELETE" }); if (res.ok) await signOut({ callbackUrl: "/" }); }
    finally { setDeleting(false); }
  };

  if (status === "loading" || (status === "authenticated" && !profileLoaded))
    return <div style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 40px", textAlign: "center" }}><p style={{ color: "var(--text-placeholder)", fontFamily: "'Pretendard', sans-serif" }}>로딩 중...</p></div>;
  if (!profile)
    return <div style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 40px", textAlign: "center" }}><p style={{ color: "var(--text-placeholder)", fontFamily: "'Pretendard', sans-serif" }}>회원 정보를 불러올 수 없습니다. 다시 로그인해 주세요.</p></div>;

  const toPostItem = (p2: RecentView["post"] | LikedPost["post"]): PostItem => ({ id: p2.id, title: p2.title, summary: p2.summary, content: p2.content, category: p2.category, createdAt: p2.createdAt, viewCount: p2.viewCount, likeCount: p2._count.likes });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const likedPostItems = profile.likes.map(l => toPostItem(l.post));

  const SectionTitle = ({ text, count }: { text: string; count?: number }) => (
    <h2 style={{ fontSize: "16px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px", letterSpacing: "0.05em" }}>
      {text}{count !== undefined && <span style={{ color: "var(--text-placeholder)", fontWeight: 400 }}> ({count})</span>}
    </h2>
  );

  return (
    <>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "clamp(40px,8vw,64px) clamp(20px,5vw,40px)" }}>
        <div style={{ marginBottom: "48px" }}>
          <h1 style={{ fontSize: "28px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>마이페이지</h1>
          <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-placeholder)" }}>회원 정보 및 활동 내역</p>
        </div>

        {/* 프로필 카드 */}
        <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", padding: "32px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
            <div>
              <p style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "var(--text-primary)" }}>{profile.name || "이름 없음"}</p>
              <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)", marginTop: "4px" }}>{profile.email}</p>
            </div>
            <Link href="/mypage/edit" style={{ padding: "8px 18px", backgroundColor: "var(--bg-card)", color: "var(--text-primary)", border: "1px solid var(--border)", fontSize: "13px", fontFamily: "'Pretendard', sans-serif", fontWeight: 500, textDecoration: "none" }}>프로필 수정</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderTop: "1px solid var(--border-light)", paddingTop: "24px" }}>
            {(["occupation", "howFound", "joinReason"] as const).map(key => (
              <div key={key}>
                <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)", letterSpacing: "0.05em", marginBottom: "4px" }}>{LABEL[key].toUpperCase()}</p>
                <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: profile[key] ? "var(--text-primary)" : "var(--text-disabled)" }}>{profile[key] || "—"}</p>
              </div>
            ))}
            <div>
              <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)", letterSpacing: "0.05em", marginBottom: "4px" }}>JOINED</p>
              <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-primary)" }}>{formatDate(profile.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* 읽기 통계 */}
        <div style={{ marginBottom: "32px" }}>
          <SectionTitle text="나의 활동" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", padding: "20px 24px" }}>
              <p style={{ fontSize: "10px", fontFamily: "Courier New, monospace", color: "var(--text-placeholder)", letterSpacing: "0.12em", marginBottom: "8px" }}>TOTAL READ</p>
              <p style={{ fontSize: "28px", fontFamily: "Courier New, monospace", fontWeight: 700, color: "var(--text-primary)" }}>
                {profile.totalRead}
                <span style={{ fontSize: "12px", color: "var(--text-placeholder)", fontWeight: 400, marginLeft: "4px", fontFamily: "'Pretendard', sans-serif" }}>편</span>
              </p>
            </div>
            <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", padding: "20px 24px" }}>
              <p style={{ fontSize: "10px", fontFamily: "Courier New, monospace", color: "var(--text-placeholder)", letterSpacing: "0.12em", marginBottom: "8px" }}>SAVED</p>
              <p style={{ fontSize: "28px", fontFamily: "Courier New, monospace", fontWeight: 700, color: "var(--text-primary)" }}>
                {profile.likes.length}
                <span style={{ fontSize: "12px", color: "var(--text-placeholder)", fontWeight: 400, marginLeft: "4px", fontFamily: "'Pretendard', sans-serif" }}>건</span>
              </p>
            </div>
          </div>
        </div>

        {/* 최근 읽은 게시물 */}
        <div style={{ marginBottom: "32px" }}>
          <SectionTitle text="최근 읽은 게시물" count={profile.recentViews.length} />
          {profile.recentViews.length === 0 ? (
            <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", padding: "48px", textAlign: "center" }}><p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-disabled)" }}>아직 읽은 게시물이 없습니다.</p></div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {profile.recentViews.map((v, i) => (
                <button key={v.post.id + i} onClick={() => setSelectedPost(toPostItem(v.post))}
                  style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", padding: "14px 20px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center" }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "10px", fontFamily: "Courier New, monospace", color: "var(--text-placeholder)", letterSpacing: "0.04em", marginBottom: "4px" }}>
                      {formatDateTime(v.viewedAt)}
                    </p>
                    <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.post.title}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 저장한 브리핑 */}
        <div style={{ marginBottom: "48px" }}>
          <SectionTitle text="저장한 브리핑" count={profile.likes.length} />
          {profile.likes.length === 0 ? (
            <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", padding: "48px", textAlign: "center" }}>
              <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-disabled)" }}>저장한 브리핑이 없습니다.</p>
              <p style={{ fontSize: "12px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-disabled)", marginTop: "6px" }}>글을 읽다가 ✓ 저장하기를 누르면 여기에 모입니다.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {profile.likes.map((l) => {
                const post = toPostItem(l.post);
                return (
                  <button key={post.id} onClick={() => setSelectedPost(post)}
                    style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", padding: "16px 20px", textAlign: "left", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", transition: "box-shadow 0.15s" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ marginBottom: "5px" }}>
                        <span style={{ fontSize: "10px", fontFamily: "Courier New, monospace", color: "var(--text-placeholder)", letterSpacing: "0.06em" }}>
                          저장 {formatDate(l.createdAt)}
                        </span>
                      </div>
                      <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "3px", marginLeft: "16px", flexShrink: 0, color: "var(--text-placeholder)", fontSize: "12px", fontFamily: "Inter, sans-serif" }}>
                      <Check size={11} />
                      <span>{post.likeCount ?? 0}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* 회원 탈퇴 */}
        <div style={{ borderTop: "1px solid var(--border-light)", paddingTop: "32px" }}>
          <h2 style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, color: "#EF4444", marginBottom: "12px" }}>회원 탈퇴</h2>
          <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-placeholder)", marginBottom: "16px" }}>탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.</p>
          <button onClick={() => setDeleteConfirm(true)} style={{ padding: "8px 18px", backgroundColor: "var(--bg-card)", color: "#EF4444", border: "1px solid #FCA5A5", cursor: "pointer", fontSize: "13px", fontFamily: "'Pretendard', sans-serif" }}>회원 탈퇴</button>
        </div>
      </div>
      {/* 회원 탈퇴 확인 오버레이 */}
      {deleteConfirm && (
        <div
          style={{ position: "fixed", inset: 0, zIndex: 500, backgroundColor: "rgba(15,23,42,0.75)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}
          onClick={() => setDeleteConfirm(false)}
        >
          <div
            style={{ backgroundColor: "var(--modal-bg)", padding: "clamp(28px,6vw,44px)", maxWidth: "400px", width: "100%", boxShadow: "0 24px 48px rgba(0,0,0,0.3)" }}
            onClick={(e) => e.stopPropagation()}
          >
            <p style={{ fontSize: "10px", fontFamily: "Inter, sans-serif", color: "#EF4444", letterSpacing: "0.15em", marginBottom: "16px" }}>WITHDRAWAL</p>
            <h3 style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>회원 탈퇴</h3>
            <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-secondary)", lineHeight: "1.75", marginBottom: "32px" }}>
              탈퇴 시 <strong style={{ color: "#EF4444" }}>모든 데이터(읽기 이력, 저장한 브리핑)가 즉시 삭제</strong>되며 복구할 수 없습니다.<br />
              정말 탈퇴하시겠습니까?
            </p>
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{ flex: 1, padding: "12px", backgroundColor: "#EF4444", color: "white", border: "none", cursor: deleting ? "not-allowed" : "pointer", fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, opacity: deleting ? 0.6 : 1 }}
              >
                {deleting ? "처리 중..." : "탈퇴 확인"}
              </button>
              <button
                onClick={() => setDeleteConfirm(false)}
                style={{ flex: 1, padding: "12px", backgroundColor: "transparent", color: "var(--text-muted)", border: "1px solid var(--border)", cursor: "pointer", fontSize: "14px", fontFamily: "'Pretendard', sans-serif" }}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}
