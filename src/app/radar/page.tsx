import { prisma } from "@/lib/prisma";
import CategoryPostGrid from "@/components/feed/CategoryPostGrid";

export const metadata = { title: "RADAR — 선익 SEONIK" };

export default async function RadarPage() {
  const raw = await prisma.post.findMany({
    where: { category: "RADAR", published: true },
    orderBy: { createdAt: "desc" },
    take: 10, // 9개 표시 + 다음 페이지 여부 확인용 1개
    include: { _count: { select: { likes: true } } },
  });

  const hasMore = raw.length > 9;
  const items = hasMore ? raw.slice(0, 9) : raw;
  const nextCursor = hasMore ? items[items.length - 1].id : null;

  const posts = items.map(p => ({
    id: p.id, title: p.title, summary: p.summary, content: p.content,
    category: p.category, createdAt: p.createdAt.toISOString(),
    viewCount: p.viewCount, likeCount: p._count.likes,
  }));

  return (
    <div className="mx-auto px-5 md:px-10 py-10 md:py-12" style={{ maxWidth: "1280px" }}>
      <h1 className="font-bold"
        style={{ fontSize: "clamp(24px,6vw,32px)", fontFamily: "Inter, sans-serif", marginBottom: "6px", color: "var(--text-primary)" }}>
        RADAR
      </h1>
      <p style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", marginBottom: "40px", color: "var(--text-muted)" }}>
        최신 트렌드 브리핑
      </p>
      <CategoryPostGrid posts={posts} category="RADAR" initialNextCursor={nextCursor} />
    </div>
  );
}
