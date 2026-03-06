"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, Eye } from "lucide-react";
import PostModal, { PostItem } from "@/components/feed/PostModal";

interface LikedPost {
  post: {
    id: string;
    title: string;
    summary: string | null;
    content: string | null;
    category: string;
    createdAt: string;
    viewCount: number;
    _count: { likes: number };
  };
  createdAt: string;
}

interface UserProfile {
  id: string;
  name: string | null;
  email: string | null;
  occupation: string | null;
  howFound: string | null;
  joinReason: string | null;
  createdAt: string;
  likes: LikedPost[];
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  }).replace(/\. /g, ".").replace(/\.$/, "");
}

const LABEL: Record<string, string> = {
  occupation: "직업",
  howFound: "선익을 알게 된 경로",
  joinReason: "가입 이유",
};

export default function MyPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [profileLoaded, setProfileLoaded] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/user")
        .then(r => r.json())
        .then(data => { setProfile(data); setProfileLoaded(true); })
        .catch(() => { setProfileLoaded(true); });
    }
  }, [status]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch("/api/user", { method: "DELETE" });
      if (res.ok) {
        await signOut({ callbackUrl: "/" });
      }
    } finally {
      setDeleting(false);
    }
  };

  if (status === "loading" || (status === "authenticated" && !profileLoaded)) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 40px", textAlign: "center" }}>
        <p style={{ color: "#94A3B8", fontFamily: "'Pretendard', sans-serif" }}>로딩 중...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "80px 40px", textAlign: "center" }}>
        <p style={{ color: "#94A3B8", fontFamily: "'Pretendard', sans-serif" }}>회원 정보를 불러올 수 없습니다. 다시 로그인해 주세요.</p>
      </div>
    );
  }

  const likedPostItems: PostItem[] = profile.likes.map(l => ({
    id: l.post.id,
    title: l.post.title,
    summary: l.post.summary,
    content: l.post.content,
    category: l.post.category,
    createdAt: l.post.createdAt,
    viewCount: l.post.viewCount,
    likeCount: l.post._count.likes,
  }));

  return (
    <>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "64px 40px" }}>
        {/* 헤더 */}
        <div style={{ marginBottom: "48px" }}>
          <h1 style={{ fontSize: "28px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "4px" }}>
            마이페이지
          </h1>
          <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#94A3B8" }}>
            회원 정보 및 활동 내역
          </p>
        </div>

        {/* 프로필 카드 */}
        <div style={{ backgroundColor: "white", border: "1px solid #E2E8F0", padding: "32px", marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
            <div>
              <p style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A" }}>
                {profile.name || "이름 없음"}
              </p>
              <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#64748B", marginTop: "4px" }}>
                {profile.email}
              </p>
            </div>
            <Link href="/mypage/edit"
              style={{
                padding: "8px 18px", backgroundColor: "white", color: "#0F172A",
                border: "1px solid #E2E8F0", fontSize: "13px",
                fontFamily: "'Pretendard', sans-serif", fontWeight: 500, textDecoration: "none",
              }}>
              프로필 수정
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderTop: "1px solid #F1F5F9", paddingTop: "24px" }}>
            {(["occupation", "howFound", "joinReason"] as const).map(key => (
              <div key={key}>
                <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.05em", marginBottom: "4px" }}>
                  {LABEL[key].toUpperCase()}
                </p>
                <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: profile[key] ? "#0F172A" : "#CBD5E1" }}>
                  {profile[key] || "—"}
                </p>
              </div>
            ))}
            <div>
              <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.05em", marginBottom: "4px" }}>
                JOINED
              </p>
              <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#0F172A" }}>
                {formatDate(profile.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* 체크한 게시물 */}
        <div style={{ marginBottom: "48px" }}>
          <h2 style={{ fontSize: "16px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "16px", letterSpacing: "0.05em" }}>
            체크한 게시물 <span style={{ color: "#94A3B8", fontWeight: 400 }}>({likedPostItems.length})</span>
          </h2>

          {likedPostItems.length === 0 ? (
            <div style={{ backgroundColor: "white", border: "1px solid #E2E8F0", padding: "48px", textAlign: "center" }}>
              <p style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#CBD5E1" }}>
                아직 체크한 게시물이 없습니다.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {likedPostItems.map(post => (
                <button key={post.id} onClick={() => setSelectedPost(post)}
                  style={{
                    backgroundColor: "white", border: "1px solid #E2E8F0",
                    padding: "16px 20px", textAlign: "left", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                  }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", marginBottom: "4px" }}>
                      {post.category} · {formatDate(post.createdAt)}
                    </p>
                    <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {post.title}
                    </p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginLeft: "16px", flexShrink: 0, color: "#CBD5E1", fontSize: "12px", fontFamily: "Inter, sans-serif" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "3px" }}><Eye size={11} />{post.viewCount ?? 0}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "3px" }}><Check size={11} />{post.likeCount ?? 0}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 회원 탈퇴 */}
        <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "32px" }}>
          <h2 style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600, color: "#EF4444", marginBottom: "12px" }}>
            회원 탈퇴
          </h2>
          <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#94A3B8", marginBottom: "16px" }}>
            탈퇴 시 모든 데이터가 삭제되며 복구할 수 없습니다.
          </p>
          {!deleteConfirm ? (
            <button onClick={() => setDeleteConfirm(true)}
              style={{
                padding: "8px 18px", backgroundColor: "white", color: "#EF4444",
                border: "1px solid #FCA5A5", cursor: "pointer",
                fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
              }}>
              회원 탈퇴
            </button>
          ) : (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#EF4444" }}>
                정말 탈퇴하시겠습니까?
              </p>
              <button onClick={handleDelete} disabled={deleting}
                style={{
                  padding: "8px 18px", backgroundColor: "#EF4444", color: "white",
                  border: "none", cursor: deleting ? "not-allowed" : "pointer",
                  fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
                  opacity: deleting ? 0.6 : 1,
                }}>
                {deleting ? "처리 중..." : "확인"}
              </button>
              <button onClick={() => setDeleteConfirm(false)}
                style={{
                  padding: "8px 18px", backgroundColor: "white", color: "#64748B",
                  border: "1px solid #E2E8F0", cursor: "pointer",
                  fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
                }}>
                취소
              </button>
            </div>
          )}
        </div>
      </div>

      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}
