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

const CATEGORY_COLORS: Record<string, string> = {
  RADAR: "#3B82F6", CORE: "#8B5CF6", FLASH: "#F59E0B",
};

function PostCard({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group bg-white border border-[#E2E8F0] overflow-hidden text-left hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-200 ease-out"
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
        <span className="font-medium uppercase tracking-wide"
          style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: CATEGORY_COLORS[post.category] || "#94A3B8" }}>
          {post.category}
        </span>
        <div className="flex items-center gap-3 text-[#CBD5E1]" style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}>
          <span className="flex items-center gap-1"><Check size={11} />{post._count.likes}</span>
          <span style={{ fontFamily: "'Pretendard', sans-serif" }}>{formatDate(post.createdAt)}</span>
        </div>
      </div>
    </button>
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

  const hasOccupation = data.byOccupation.length > 0;
  const hasJoinReason = data.byJoinReason.length > 0;
  if (!hasOccupation && !hasJoinReason) return null;


  const toPostItem = (p: Post): PostItem => ({
    id: p.id, title: p.title, summary: p.summary, content: p.content,
    category: p.category, createdAt: p.createdAt, viewCount: p.viewCount, likeCount: p._count.likes,
  });

  return (
    <div className="mx-auto" style={{ maxWidth: "1280px", padding: "0 40px 48px" }}>
      <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "48px" }}>
        <p style={{
          fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8",
          letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "36px",
        }}>
          나의 맞춤 브리핑
        </p>

        {hasOccupation && (
          <div style={{ marginBottom: hasJoinReason ? "48px" : "0" }}>
            <div className="flex items-center mb-6">
              <span className="font-bold text-[#0F172A] tracking-[0.04em]"
                style={{ fontSize: "18px", fontFamily: "Inter, sans-serif" }}>
                {data.byOccupationFallback ? "지금 뜨는 브리핑" : data.userOccupation}
              </span>
              <span className="text-[#94A3B8] mx-3" style={{ fontSize: "18px" }}>—</span>
              <span className="text-[#64748B]"
                style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif" }}>
                {data.byOccupationFallback
                  ? "회원들이 가장 많이 읽은"
                  : "같은 직업 회원이 많이 본"}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
              {data.byOccupation.map((post) => (
                <PostCard key={post.id} post={post} onClick={() => onSelectPost(toPostItem(post))} />
              ))}
            </div>
          </div>
        )}

        {hasJoinReason && (
          <div>
            <div className="flex items-center mb-6">
              <span className="font-bold text-[#0F172A] tracking-[0.04em]"
                style={{ fontSize: "18px", fontFamily: "Inter, sans-serif" }}>
                {data.byJoinReasonFallback ? "최신 브리핑" : data.userJoinReason}
              </span>
              <span className="text-[#94A3B8] mx-3" style={{ fontSize: "18px" }}>—</span>
              <span className="text-[#64748B]"
                style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif" }}>
                {data.byJoinReasonFallback
                  ? "방금 발행된 인텔리전스"
                  : "같은 목적으로 가입한 회원이 많이 본"}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
              {data.byJoinReason.map((post) => (
                <PostCard key={post.id} post={post} onClick={() => onSelectPost(toPostItem(post))} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
