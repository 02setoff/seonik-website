import { prisma } from "@/lib/prisma";
import CategoryPostGrid from "@/components/feed/CategoryPostGrid";

export const metadata = { title: "FLASH — 선익 SEONIK" };

export default async function FlashPage() {
  const raw = await prisma.post.findMany({
    where: { category: "FLASH", published: true },
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
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 40px" }}>
      <h1 className="font-bold text-[#0F172A]"
        style={{ fontSize: "32px", fontFamily: "Inter, sans-serif", marginBottom: "6px" }}>
        FLASH
      </h1>
      <p className="text-[#64748B]"
        style={{ fontSize: "15px", fontFamily: "'Pretendard', sans-serif", marginBottom: "40px" }}>
        긴급 인사이트
      </p>
      <CategoryPostGrid posts={posts} category="FLASH" />
    </div>
  );
}
