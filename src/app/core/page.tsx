import { prisma } from "@/lib/prisma";
import CategoryPostGrid from "@/components/feed/CategoryPostGrid";

export const metadata = { title: "CORE — 선익 SEONIK" };

export default async function CorePage() {
  const raw = await prisma.post.findMany({
    where: { category: "CORE", published: true },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { likes: true } } },
  });

  const posts = raw.map(p => ({
    id: p.id,
    title: p.title,
    summary: p.summary,
    content: p.content,
    category: p.category,
    createdAt: p.createdAt.toISOString(),
    viewCount: p.viewCount,
    likeCount: p._count.likes,
  }));

  return (
    <div className="mx-auto px-5 md:px-10 py-10 md:py-12" style={{ maxWidth: "1280px" }}>
      <h1 className="font-bold text-[#0F172A]"
        style={{ fontSize: "clamp(24px,6vw,32px)", fontFamily: "Inter, sans-serif", marginBottom: "6px" }}>
        CORE
      </h1>
      <p className="text-[#64748B]"
        style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", marginBottom: "40px" }}>
        비즈니스 모델 해부
      </p>
      <CategoryPostGrid posts={posts} category="CORE" />
    </div>
  );
}
