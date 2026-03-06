import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE_URL = "https://seonik.kr";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 발행된 포스트 목록 가져오기
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { id: true, updatedAt: true, category: true },
    orderBy: { updatedAt: "desc" },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  return staticRoutes;
}
