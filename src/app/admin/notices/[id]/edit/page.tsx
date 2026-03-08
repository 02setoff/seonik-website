import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditNoticeForm from "./EditNoticeForm";

export const dynamic = "force-dynamic";

export default async function EditNoticePage({ params }: { params: { id: string } }) {
  const notice = await prisma.notice.findUnique({ where: { id: params.id } });
  if (!notice) notFound();

  return (
    <EditNoticeForm notice={{
      id: notice.id,
      type: notice.type,
      title: notice.title,
      content: notice.content,
      important: notice.important,
      published: notice.published,
    }} />
  );
}
