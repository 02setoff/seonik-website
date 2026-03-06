import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditPostForm from "./EditPostForm";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({ where: { id: params.id } });
  if (!post) notFound();
  return <EditPostForm post={post} />;
}
