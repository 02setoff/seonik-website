import { prisma } from "@/lib/prisma";
import Link from "next/link";
import AdminNoticeDeleteButton from "./AdminNoticeDeleteButton";

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  "서비스": { bg: "#0F172A", color: "white" },
  "약관": { bg: "#F1F5F9", color: "#475569" },
  "업데이트": { bg: "#F0FDF4", color: "#16A34A" },
  "긴급": { bg: "#FEF2F2", color: "#DC2626" },
};

function formatDate(d: Date) {
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" }).replace(/\. /g, ".").replace(/\.$/, "");
}

export const dynamic = "force-dynamic";

export default async function AdminNoticesPage() {
  const notices = await prisma.notice.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
        <h1 style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A" }}>
          공지사항 관리
        </h1>
        <Link href="/admin/notices/new"
          style={{
            padding: "9px 20px", backgroundColor: "#0F172A", color: "white",
            fontSize: "13px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600,
            textDecoration: "none",
          }}>
          + 새 공지 작성
        </Link>
      </div>

      {notices.length === 0 ? (
        <div style={{ padding: "48px", textAlign: "center", border: "1px solid #E2E8F0" }}>
          <p style={{ fontSize: "14px", color: "#94A3B8", fontFamily: "'Pretendard', sans-serif" }}>등록된 공지사항이 없습니다.</p>
        </div>
      ) : (
        <div style={{ border: "1px solid #E2E8F0" }}>
          {/* 헤더 */}
          <div style={{ display: "grid", gridTemplateColumns: "80px 1fr 100px 80px 80px 120px", gap: "0", backgroundColor: "#F8F9FA", borderBottom: "1px solid #E2E8F0", padding: "10px 16px" }}>
            <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", fontWeight: 700 }}>유형</span>
            <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", fontWeight: 700 }}>제목</span>
            <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", fontWeight: 700 }}>날짜</span>
            <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", fontWeight: 700 }}>중요</span>
            <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", fontWeight: 700 }}>공개</span>
            <span style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", fontWeight: 700 }}>관리</span>
          </div>

          {notices.map((notice, idx) => {
            const typeMeta = TYPE_COLORS[notice.type] || { bg: "#F1F5F9", color: "#475569" };
            return (
              <div
                key={notice.id}
                style={{
                  display: "grid", gridTemplateColumns: "80px 1fr 100px 80px 80px 120px",
                  gap: "0", padding: "12px 16px", alignItems: "center",
                  borderBottom: idx < notices.length - 1 ? "1px solid #F1F5F9" : "none",
                  backgroundColor: "white",
                }}
              >
                <span style={{
                  fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700,
                  padding: "2px 8px", backgroundColor: typeMeta.bg, color: typeMeta.color,
                  display: "inline-block",
                }}>
                  {notice.type.toUpperCase()}
                </span>
                <p style={{
                  fontSize: "14px", fontFamily: "'Pretendard', sans-serif", fontWeight: 600,
                  color: "#0F172A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  paddingRight: "12px", margin: 0,
                }}>
                  {notice.title}
                </p>
                <span style={{ fontSize: "12px", fontFamily: "Inter, sans-serif", color: "#94A3B8" }}>
                  {formatDate(notice.createdAt)}
                </span>
                <span style={{ fontSize: "13px", color: notice.important ? "#EF4444" : "#CBD5E1" }}>
                  {notice.important ? "● 중요" : "—"}
                </span>
                <span style={{ fontSize: "13px", color: notice.published ? "#16A34A" : "#94A3B8" }}>
                  {notice.published ? "공개" : "비공개"}
                </span>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <Link href={`/admin/notices/${notice.id}/edit`}
                    style={{
                      padding: "5px 12px", fontSize: "12px", fontFamily: "'Pretendard', sans-serif",
                      backgroundColor: "#F8F9FA", color: "#475569",
                      border: "1px solid #E2E8F0", textDecoration: "none",
                    }}>
                    수정
                  </Link>
                  <AdminNoticeDeleteButton id={notice.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
