"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import PostModal, { PostItem } from "./PostModal";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  }).replace(/\. /g, ".").replace(/\.$/, "");
}

export default function CategoryPostGrid({ posts, category }: { posts: PostItem[]; category: string }) {
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p className="text-[#CBD5E1]" style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif" }}>
          아직 게시된 글이 없습니다.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {posts.map(post => (
          <button
            key={post.id}
            onClick={() => setSelectedPost(post)}
            className="bg-white border border-[#E2E8F0] p-6 text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out"
          >
            <p className="text-[#94A3B8] font-medium uppercase tracking-wide mb-3"
              style={{ fontSize: "11px", fontFamily: "Inter, sans-serif" }}>
              {category} · {formatDate(post.createdAt)}
            </p>
            <h2 className="text-[#0F172A] font-bold leading-snug mb-3"
              style={{ fontSize: "18px", fontFamily: "'Pretendard', sans-serif" }}>
              {post.title}
            </h2>
            {post.summary && (
              <p className="text-[#64748B] leading-relaxed line-clamp-3"
                style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif" }}>
                {post.summary}
              </p>
            )}
            <div className="flex items-center gap-3 mt-4"
              style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}>
              <span className="flex items-center gap-1 font-bold text-[#0F172A]">
                <Check size={11} strokeWidth={2.5} />
                {post.likeCount ?? 0}
              </span>
            </div>
          </button>
        ))}
      </div>

      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}
