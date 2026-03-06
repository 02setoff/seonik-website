import { prisma } from "@/lib/prisma";
import Link from "next/link";

function formatDate(d: Date) {
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    .replace(/\. /g, ".").replace(/\.$/, "");
}

export default async function AdminDashboard() {
  const [posts, contacts] = await Promise.all([
    prisma.post.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.contact.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
  ]);

  const published = posts.filter(p => p.published).length;
  const unreadContacts = contacts.filter(c => !c.read).length;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <h1 style={{ fontSize: "24px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A" }}>
          대시보드
        </h1>
        <Link href="/admin/posts/new"
          style={{
            padding: "10px 24px",
            backgroundColor: "#0F172A",
            color: "white",
            fontSize: "13px",
            fontFamily: "'Pretendard', sans-serif",
            fontWeight: 600,
            textDecoration: "none",
          }}>
          + 새 글 작성
        </Link>
      </div>

      {/* 통계 카드 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "40px" }}>
        {[
          { label: "전체 글", value: posts.length },
          { label: "게시된 글", value: published },
          { label: "새 문의", value: unreadContacts },
        ].map(stat => (
          <div key={stat.label} style={{ backgroundColor: "white", border: "1px solid #E2E8F0", padding: "24px" }}>
            <p style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "Inter, sans-serif", marginBottom: "8px" }}>
              {stat.label}
            </p>
            <p style={{ fontSize: "32px", fontWeight: 700, color: "#0F172A", fontFamily: "Inter, sans-serif" }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* 글 목록 */}
      <h2 style={{ fontSize: "16px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "16px" }}>
        전체 글
      </h2>
      <div style={{ backgroundColor: "white", border: "1px solid #E2E8F0" }}>
        {posts.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", color: "#94A3B8", fontSize: "14px", fontFamily: "'Pretendard', sans-serif" }}>
            작성된 글이 없습니다. 새 글을 작성해보세요.
          </div>
        ) : (
          posts.map((post, i) => (
            <div key={post.id} style={{
              display: "flex", alignItems: "center", gap: "16px",
              padding: "16px 20px",
              borderBottom: i < posts.length - 1 ? "1px solid #E2E8F0" : "none",
            }}>
              <span style={{
                fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 600,
                padding: "2px 8px",
                backgroundColor: post.category === "FLASH" ? "#FEF3C7" : post.category === "RADAR" ? "#DBEAFE" : "#DCFCE7",
                color: post.category === "FLASH" ? "#92400E" : post.category === "RADAR" ? "#1E40AF" : "#166534",
              }}>
                {post.category}
              </span>
              <p style={{ flex: 1, fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#0F172A", fontWeight: 500 }}>
                {post.title}
              </p>
              <span style={{
                fontSize: "11px", padding: "2px 8px",
                backgroundColor: post.published ? "#DCFCE7" : "#F1F5F9",
                color: post.published ? "#166534" : "#64748B",
                fontFamily: "'Pretendard', sans-serif",
              }}>
                {post.published ? "게시됨" : "초안"}
              </span>
              <span style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" }}>
                {formatDate(post.createdAt)}
              </span>
              <Link href={`/admin/posts/${post.id}/edit`}
                style={{ fontSize: "12px", color: "#475569", fontFamily: "'Pretendard', sans-serif", textDecoration: "none" }}>
                수정
              </Link>
              <AdminDeleteButton postId={post.id} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 삭제 버튼은 client component 필요
import AdminDeleteButton from "./AdminDeleteButton";
