"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import PostModal, { PostItem } from "./PostModal";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  }).replace(/\. /g, ".").replace(/\.$/, "");
}

interface CategoryPostGridProps {
  posts: PostItem[];
  category: string;
  initialNextCursor?: string | null;
}

export default function CategoryPostGrid({ posts: initialPosts, category, initialNextCursor }: CategoryPostGridProps) {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const [cursor, setCursor] = useState<string | null>(initialNextCursor ?? null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);

  const loadMore = async () => {
    if (!cursor || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/posts?category=${category}&take=9&cursor=${cursor}`);
      const data = await res.json();
      setPosts(prev => [...prev, ...data.posts]);
      setCursor(data.nextCursor ?? null);
    } catch {
      // silent
    } finally {
      setLoadingMore(false);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-disabled)" }}>
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
            className="text-left hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 ease-out"
            style={{
              backgroundColor: "var(--bg-card)",
              border: "1px solid var(--border)",
              padding: "24px",
              borderRadius: 0,
            }}
          >
            <p className="font-medium uppercase tracking-wide mb-3"
              style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "var(--text-placeholder)" }}>
              {category} · {formatDate(post.createdAt)}
            </p>
            <h2 className="font-bold leading-snug mb-3"
              style={{ fontSize: "18px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-primary)" }}>
              {post.title}
            </h2>
            {post.summary && (
              <p className="leading-relaxed line-clamp-3"
                style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "var(--text-muted)" }}>
                {post.summary}
              </p>
            )}
            <div className="flex items-center gap-3 mt-4"
              style={{ fontSize: "12px", fontFamily: "Inter, sans-serif" }}>
              <span className="flex items-center gap-1 font-bold" style={{ color: "var(--text-primary)" }}>
                <Check size={11} strokeWidth={2.5} />
                {post.likeCount ?? 0}
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* 더 보기 버튼 — cursor 있을 때만 표시 */}
      {cursor && (
        <div className="flex justify-center mt-10">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            style={{
              border: "1px solid var(--border)",
              padding: "12px 40px",
              fontSize: "13px", fontFamily: "Inter, sans-serif",
              letterSpacing: "0.05em", color: "var(--text-secondary)",
              background: "none", cursor: loadingMore ? "not-allowed" : "pointer",
              opacity: loadingMore ? 0.6 : 1,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!loadingMore) (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--bg-hover)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            }}
          >
            {loadingMore ? "불러오는 중..." : "더 보기"}
          </button>
        </div>
      )}

      <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />
    </>
  );
}
