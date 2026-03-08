"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminNoticeDeleteButton({ id }: { id: string }) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/notices/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
      setConfirm(false);
    }
  };

  if (!confirm) {
    return (
      <button
        onClick={() => setConfirm(true)}
        style={{
          padding: "5px 12px", fontSize: "12px", fontFamily: "'Pretendard', sans-serif",
          backgroundColor: "transparent", color: "#EF4444",
          border: "1px solid #FCA5A5", cursor: "pointer",
        }}
      >
        삭제
      </button>
    );
  }

  return (
    <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
      <span style={{ fontSize: "12px", color: "#EF4444", fontFamily: "'Pretendard', sans-serif" }}>삭제?</span>
      <button
        onClick={handleDelete}
        disabled={loading}
        style={{
          padding: "5px 10px", fontSize: "12px", fontFamily: "'Pretendard', sans-serif",
          backgroundColor: "#EF4444", color: "white", border: "none",
          cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? "..." : "확인"}
      </button>
      <button
        onClick={() => setConfirm(false)}
        style={{
          padding: "5px 10px", fontSize: "12px", fontFamily: "'Pretendard', sans-serif",
          backgroundColor: "transparent", color: "#64748B",
          border: "1px solid #CBD5E1", cursor: "pointer",
        }}
      >
        취소
      </button>
    </div>
  );
}
