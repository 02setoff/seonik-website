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

// 선익 메인 컬러 팔레트만 사용
const CATEGORY_COLORS: Record<string, string> = {
  RADAR: "#0F172A", CORE: "#334155", FLASH: "#64748B",
};

function PostCard({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group bg-white border border-[#E2E8F0] overflow-hidden text-left hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 ease-out w-full"
    >
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0 bg-white flex items-center justify-center p-6">
          <p className="text-[#0F172A] font-semibold text-center leading-snug line-clamp-3"
            style={{ fontSize: "17px", fontFamily: "'Pretendard', sans-serif" }}>
            {post.title}
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-[#E2E8F0]" style={{ padding: "12px 16px" }}>
        <span className="font-bold uppercase tracking-wide"
          style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: CATEGORY_COLORS[post.category] || "#94A3B8" }}>
          {post.category}
        </span>
        <div className="flex items-center gap-3 text-[#CBD5E1]" style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}>
          <span className="flex items-center gap-1">
            <Check size={11} strokeWidth={2.5} />
            <span className="font-bold text-[#0F172A]">{post._count.likes}</span>
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
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center flex-wrap gap-y-1">
          <span className="font-bold text-[#0F172A] tracking-[0.04em]"
            style={{ fontSize: "18px", fontFamily: "Inter, sans-serif" }}>
            {title}
          </span>
          <span className="text-[#94A3B8] mx-3" style={{ fontSize: "18px" }}>—</span>
          <span className="text-[#64748B]"
            style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif" }}>
            {subtitle}
          </span>
        </div>
        {hasMore && (
          <button
            onClick={() => setExpanded((v) => !v)}
            style={{
              fontSize: "12px", fontFamily: "Inter, sans-serif", color: "#64748B",
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
    <div className="mx-auto" style={{ maxWidth: "1280px", padding: "0 40px 48px" }}>
      <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "48px" }}>
        <p style={{
          fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8",
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
