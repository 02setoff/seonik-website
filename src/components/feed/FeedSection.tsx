"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { SECTIONS } from "@/lib/constants";
import PostModal, { PostItem } from "./PostModal";
import PersonalizedSection from "./PersonalizedSection";

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
    <div style={{ backgroundColor: "var(--bg-card)", border: "1px dashed var(--border)", overflow: "hidden", borderRadius: 0 }}>
      <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
        <div className="absolute inset-0 flex items-center justify-center">
          <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-disabled)" }}>
            콘텐츠 준비 중
          </p>
        </div>
      </div>
      <div className="flex items-center justify-between" style={{ padding: "16px", borderTop: "1px dashed var(--border)" }}>
        <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "var(--text-disabled)" }}>—</span>
        <span style={{ fontSize: "12px", color: "var(--text-disabled)" }}>—</span>
      </div>
    </div>
  );
}

function PostCard({ post, onClick }: { post: Post; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group overflow-hidden text-left hover:shadow-[0_4px_12px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-200 ease-out"
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
        <span className="font-medium uppercase tracking-wide"
          style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)" }}>
          {post.category}
        </span>
        <div className="flex items-center gap-3" style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}>
          <span className="flex items-center gap-1 font-bold" style={{ color: "var(--text-primary)" }}>
            <Check size={11} strokeWidth={2.5} />
            {post._count.likes}
          </span>
          <span style={{ fontFamily: "'Pretendard', sans-serif", color: "var(--text-disabled)" }}>{formatDate(post.createdAt)}</span>
        </div>
      </div>
    </button>
  );
}

export default function FeedSection() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

  useEffect(() => {
    fetch("/api/posts").then(r => r.json()).then((data: Post[]) => {
      setPosts(data);
      setLoading(false);
      // URL ?p=postId 파라미터로 특정 글 바로 열기 (링크 공유)
      try {
        const params = new URLSearchParams(window.location.search);
        const postId = params.get("p");
        if (postId) {
          const found = data.find((p) => p.id === postId);
          if (found) setSelectedPost({
            id: found.id, title: found.title, summary: found.summary, content: found.content,
            category: found.category, createdAt: found.createdAt,
            viewCount: found.viewCount, likeCount: found._count.likes,
          });
        }
      } catch {}
    }).catch(() => { setLoading(false); });
  }, []);

  const toPostItem = (p: Post): PostItem => ({
    id: p.id, title: p.title, summary: p.summary, content: p.content,
    category: p.category, createdAt: p.createdAt,
    viewCount: p.viewCount, likeCount: p._count.likes,
  });

  return (
    <>
      <div className="pb-16" style={{ backgroundColor: "var(--bg-primary)" }}>
        <div className="mx-auto px-5 md:px-10" style={{ maxWidth: "1280px" }}>

          {/* 로딩 인디케이터 — 선익 SEONIK 브랜드 */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-32 gap-1">
              <p style={{ fontFamily: "'Pretendard', sans-serif", fontWeight: 700, fontSize: "22px", color: "var(--text-primary)", lineHeight: 1 }}>선익</p>
              <p style={{ fontFamily: "Inter, sans-serif", fontSize: "9px", letterSpacing: "0.15em", color: "var(--text-placeholder)", marginTop: "3px" }}>SEONIK</p>
              <div className="flex gap-1.5 mt-4">
                {[0, 150, 300].map(delay => (
                  <span
                    key={delay}
                    className="animate-bounce"
                    style={{
                      display: "block", width: "4px", height: "4px", borderRadius: "50%",
                      backgroundColor: "var(--text-muted)", animationDelay: `${delay}ms`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {!loading && SECTIONS.map((section, idx) => {
            const sectionPosts = posts.filter(p => p.category === section.id);
            const empties = Math.max(0, 4 - sectionPosts.length);

            return (
              <div key={section.id} style={{ marginTop: idx === 0 ? "32px" : "48px" }}>
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 mb-6">
                  <Link
                    href={`/${section.id.toLowerCase()}`}
                    className="font-bold tracking-[0.05em] transition-colors duration-150"
                    style={{ fontSize: "clamp(16px,4vw,20px)", fontFamily: "Inter, sans-serif", color: "var(--text-primary)", textDecoration: "none" }}
                  >
                    {section.title}
                  </Link>
                  <span style={{ fontSize: "clamp(16px,4vw,20px)", color: "var(--text-placeholder)" }}>—</span>
                  <span className="font-normal"
                    style={{ fontSize: "clamp(13px,3.5vw,16px)", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)" }}>
                    {section.subtitle}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5 xl:gap-6">
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

      <PersonalizedSection onSelectPost={(post) => setSelectedPost(post)} />

      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}
