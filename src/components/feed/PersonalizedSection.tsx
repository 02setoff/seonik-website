"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Check } from "lucide-react";
import { PostItem } from "./PostModal";

interface Post {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  category: string;
  createdAt: string;
  viewCount: number;
  _count: { likes: number };
}

interface PersonalizedData {
  byOccupation: Post[];
  byJoinReason: Post[];
  mostSaved: Post[];
  mySaved: Post[];
  byOccupationFallback: boolean;
  byJoinReasonFallback: boolean;
  userOccupation: string | null;
  userJoinReason: string | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  }).replace(/\. /g, ".").replace(/\.$/, "");
}

// CSS 변수 사용 — 라이트/다크 모드 자동 대응
const CATEGORY_COLORS: Record<string, string> = {
  RADAR: "var(--text-primary)", CORE: "var(--text-secondary)", FLASH: "var(--text-muted)",
};

function PostCard({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group overflow-hidden text-left hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 ease-out w-full"
      style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 0 }}
    >
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0 flex items-center justify-center p-6" style={{ backgroundColor: "var(--bg-card)" }}>
          <p className="font-semibold text-center leading-snug line-clamp-3"
            style={{ fontSize: "17px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-primary)" }}>
            {post.title}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between" style={{ padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
        <span className="font-bold uppercase tracking-wide"
          style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: CATEGORY_COLORS[post.category] || "var(--text-placeholder)" }}>
          {post.category}
        </span>
        <div className="flex items-center gap-3" style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "var(--text-disabled)" }}>
          <span className="flex items-center gap-1">
            <Check size={11} strokeWidth={2.5} />
            <span className="font-bold" style={{ color: "var(--text-primary)" }}>{post._count.likes}</span>
          </span>
          <span style={{ fontFamily: "'Pretendard', sans-serif" }}>{formatDate(post.createdAt)}</span>
        </div>
      </div>
    </button>
  );
}

interface SectionRowProps {
  title: string;
  subtitle: string;
  posts: Post[];
  onSelectPost: (post: PostItem) => void;
  toPostItem: (p: Post) => PostItem;
}

function SectionRow({ title, subtitle, posts, onSelectPost, toPostItem }: SectionRowProps) {
  const [expanded, setExpanded] = useState(false);
  const displayPosts = expanded ? posts : posts.slice(0, 4);
  const hasMore = posts.length > 4;

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-3">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 min-w-0">
          <span className="font-bold tracking-[0.04em]"
            style={{ fontSize: "clamp(15px,4vw,18px)", fontFamily: "Inter, sans-serif", color: "var(--text-primary)" }}>
            {title}
          </span>
          <span style={{ fontSize: "clamp(15px,4vw,18px)", color: "var(--text-placeholder)" }}>—</span>
          <span style={{ fontSize: "clamp(12px,3vw,15px)", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)" }}>
            {subtitle}
          </span>
        </div>
        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              fontSize: "12px", fontFamily: "Inter, sans-serif", color: "var(--text-muted)",
              background: "none", border: "none", cursor: "pointer",
              letterSpacing: "0.05em", padding: "4px 0", flexShrink: 0, marginLeft: "16px",
            }}
          >
            {expanded ? "접기" : `전체 보기 (${posts.length})`}
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
        {displayPosts.map((post) => (
          <PostCard key={post.id} post={post} onClick={() => onSelectPost(toPostItem(post))} />
        ))}
      </div>
    </div>
  );
}

export default function PersonalizedSection({ onSelectPost }: { onSelectPost: (post: PostItem) => void }) {
  const { data: session } = useSession();
  const [data, setData] = useState<PersonalizedData | null>(null);

  useEffect(() => {
    if (!session) return;
    fetch("/api/posts/personalized")
      .then((r) => r.json())
      .then(setData)
      .catch(() => {});
  }, [session]);

  if (!session || !data) return null;

  const toPostItem = (p: Post): PostItem => ({
    id: p.id, title: p.title, summary: p.summary, content: p.content,
    category: p.category, createdAt: p.createdAt, viewCount: p.viewCount, likeCount: p._count.likes,
  });

  const sections = [
    data.byOccupation.length > 0 && {
      title: data.byOccupationFallback ? "지금 뜨는 브리핑" : (data.userOccupation ?? ""),
      subtitle: data.byOccupationFallback ? "회원들이 가장 많이 읽은" : "같은 직업 회원이 많이 본",
      posts: data.byOccupation,
    },
    data.byJoinReason.length > 0 && {
      title: data.byJoinReasonFallback ? "최신 브리핑" : (data.userJoinReason ?? ""),
      subtitle: data.byJoinReasonFallback ? "방금 발행된 인텔리전스" : "같은 목적으로 가입한 회원이 많이 본",
      posts: data.byJoinReason,
    },
    data.mostSaved.length > 0 && {
      title: "많이 저장된 브리핑",
      subtitle: "회원들이 가장 많이 저장한",
      posts: data.mostSaved,
    },
    data.mySaved.length > 0 && {
      title: "나의 저장 브리핑",
      subtitle: "내가 저장한 인텔리전스",
      posts: data.mySaved,
    },
  ].filter(Boolean) as { title: string; subtitle: string; posts: Post[] }[];

  if (sections.length === 0) return null;

  return (
    <div className="mx-auto px-5 md:px-10 pb-12" style={{ maxWidth: "1280px" }}>
      <div style={{ borderTop: "1px solid var(--border)", paddingTop: "48px" }}>
        <p style={{
          fontSize: "11px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)",
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "36px",
        }}>
          나의 맞춤 브리핑
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "48px" }}>
          {sections.map((sec, i) => (
            <SectionRow
              key={i}
              title={sec.title}
              subtitle={sec.subtitle}
              posts={sec.posts}
              onSelectPost={onSelectPost}
              toPostItem={toPostItem}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
