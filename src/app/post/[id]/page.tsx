import { notFound, redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PostDetailClient from "./PostDetailClient";

interface Props {
  params: { id: string };
}

export default async function PostDetailPage({ params }: Props) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const post = await prisma.post.findUnique({
    where: { id: params.id, published: true },
    include: { author: { select: { name: true } }, _count: { select: { likes: true } } },
  });

  if (!post) notFound();

  // 조회수 카운트 (비동기 처리)
  if (session.user?.email) {
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
      prisma.postView.create({
        data: { userId: user.id, postId: post.id },
      }).then(() =>
        prisma.post.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } })
      ).catch(() => {});
    }
  }

  const serialized = {
    id: post.id,
    code: post.code,
    title: post.title,
    summary: post.summary,
    source: post.source,
    bmBreakdown: post.bmBreakdown,
    playbook: post.playbook,
    actionItems: post.actionItems,
    deepDive: post.deepDive,
    seonikNote: post.seonikNote,
    content: post.content,
    postType: post.postType,
    isFree: post.isFree,
    isSubscriberOnly: post.isSubscriberOnly,
    createdAt: post.createdAt.toISOString(),
    viewCount: post.viewCount,
    likeCount: post._count.likes,
  };

  return <PostDetailClient post={serialized} />;
}
