"use client";

import { useRouter } from "next/navigation";

export default function AdminDeleteButton({ postId }: { postId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("이 글을 삭제하시겠습니까?")) return;
    await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <button onClick={handleDelete}
      style={{
        fontSize: "12px", color: "#EF4444", fontFamily: "'Pretendard', sans-serif",
        background: "none", border: "none", cursor: "pointer", padding: 0,
      }}>
      삭제
    </button>
  );
}
