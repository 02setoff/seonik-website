import { prisma } from "@/lib/prisma";
import CategoryPostGrid from "@/components/feed/CategoryPostGrid";

export const metadata = { title: "CORE — 선익 SEONIK" };

export default async function CorePage() {
  const raw = await prisma.post.findMany({
    where: { category: "CORE", published: true },
    orderBy: { createdAt: "desc" },
  });

  const posts = raw.map(p => ({
    id: p.id,
    title: p.title,
    summary: p.summary,
    content: p.content,
    category: p.category,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "48px 40px" }}>
      <h1 className="font-bold text-[#0F172A]"
        style={{ fontSize: "32px", fontFamily: "Inter, sans-serif", marginBottom: "6px" }}>
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
