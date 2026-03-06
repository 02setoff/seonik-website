"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Check } from "lucide-react";
import { SECTIONS } from "@/lib/constants";
import PostModal, { PostItem } from "./PostModal";

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

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  }).replace(/\. /g, ".").replace(/\.$/, "");
}

function EmptyCard() {
  return (
    <div className="bg-white border border-dashed border-[#E2E8F0] overflow-hidden" style={{ borderRadius: 0 }}>
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-[#CBD5E1]" style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif" }}>
            콘텐츠 준비 중
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-dashed border-[#E2E8F0]" style={{ padding: "16px" }}>
        <span className="text-[#E2E8F0]" style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}>—</span>
        <span className="text-[#E2E8F0]" style={{ fontSize: "12px" }}>—</span>
      </div>
    </div>
  );
}

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
        <span className="text-[#94A3B8] font-medium uppercase tracking-wide"
          style={{ fontSize: "11px", fontFamily: "Inter, sans-serif" }}>
          {post.category}
        </span>
        <div className="flex items-center gap-3 text-[#CBD5E1]" style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}>
          <span className="flex items-center gap-1">
            <Eye size={11} />
            {post.viewCount}
          </span>
          <span className="flex items-center gap-1">
            <Check size={11} />
            {post._count.likes}
          </span>
          <span style={{ fontFamily: "'Pretendard', sans-serif" }}>{formatDate(post.createdAt)}</span>
        </div>
      </div>
    </button>
  );
}

export default function FeedSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

  useEffect(() => {
    fetch("/api/posts").then(r => r.json()).then(setPosts).catch(() => {});
  }, []);

  const toPostItem = (p: Post): PostItem => ({
    id: p.id, title: p.title, summary: p.summary, content: p.content,
    category: p.category, createdAt: p.createdAt,
    viewCount: p.viewCount, likeCount: p._count.likes,
  });

  return (
    <>
      <div className="bg-[#F8F9FA] pb-16">
        <div className="mx-auto" style={{ maxWidth: "1280px", padding: "0 40px" }}>
          {SECTIONS.map((section, idx) => {
            const sectionPosts = posts.filter(p => p.category === section.id);
            const empties = Math.max(0, 4 - sectionPosts.length);

            return (
              <div key={section.id} style={{ marginTop: idx === 0 ? "32px" : "48px" }}>
                <div className="flex items-center mb-6">
                  <Link
                    href={`/${section.id.toLowerCase()}`}
                    className="font-bold text-[#0F172A] tracking-[0.05em] hover:text-[#475569] transition-colors duration-150"
                    style={{ fontSize: "20px", fontFamily: "Inter, sans-serif" }}
                  >
                    {section.title}
                  </Link>
                  <span className="text-[#94A3B8] mx-3" style={{ fontSize: "20px" }}>—</span>
                  <span className="font-normal text-[#64748B]"
                    style={{ fontSize: "16px", fontFamily: "'Pretendard', sans-serif" }}>
                    {section.subtitle}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
                  {sectionPosts.map(post => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onClick={() => setSelectedPost(toPostItem(post))}
                    />
                  ))}
                  {Array.from({ length: empties }).map((_, i) => (
                    <EmptyCard key={`empty-${i}`} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}
