import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { notFound } from "next/navigation";

function formatDate(d: Date) {
  return d.toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  }).replace(/\. /g, ".").replace(/\.$/, "");
}

function formatDateTime(d: Date) {
  return d.toLocaleString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

const CATEGORY_BG: Record<string, string> = {
  FLASH: "#FEF3C7", RADAR: "#DBEAFE", CORE: "#DCFCE7",
};
const CATEGORY_COLOR: Record<string, string> = {
  FLASH: "#92400E", RADAR: "#1E40AF", CORE: "#166534",
};

export default async function PostStatsPage({ params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      _count: { select: { likes: true, postViews: true } },
      likes: {
        include: {
          user: { select: { id: true, name: true, email: true, occupation: true, createdAt: true } },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) notFound();

  // 유저별 조회 통계 집계
  const allViews = await prisma.postView.findMany({
    where: { postId: params.id },
    include: {
      user: { select: { id: true, name: true, email: true, occupation: true } },
    },
    orderBy: { viewedAt: "desc" },
  });

  // userId별 그룹핑 (첫 번째 = 최신)
  const viewerMap = new Map<string, { user: typeof allViews[0]["user"]; count: number; lastViewedAt: Date }>();
  for (const v of allViews) {
    if (!viewerMap.has(v.userId)) {
      viewerMap.set(v.userId, { user: v.user, count: 1, lastViewedAt: v.viewedAt });
    } else {
      viewerMap.get(v.userId)!.count++;
    }
  }
  const viewers = Array.from(viewerMap.values()).sort((a, b) => b.count - a.count);

  const likeRate = post.viewCount > 0
    ? Math.round((post._count.likes / post.viewCount) * 100)
    : 0;

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto" }}>
      {/* 뒤로가기 + 헤더 */}
      <div style={{ marginBottom: "28px" }}>
        <Link href="/admin"
          style={{ fontSize: "13px", color: "#94A3B8", fontFamily: "Inter, sans-serif", textDecoration: "none", display: "inline-block", marginBottom: "12px" }}>
          ← 대시보드
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span style={{
            fontSize: "10px", fontFamily: "Inter, sans-serif", fontWeight: 700,
            padding: "3px 8px",
            backgroundColor: CATEGORY_BG[post.category] || "#F1F5F9",
            color: CATEGORY_COLOR[post.category] || "#64748B",
          }}>
            {post.category}
          </span>
          <h1 style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", margin: 0 }}>
            {post.title}
          </h1>
          <span style={{
            fontSize: "11px", padding: "2px 8px",
            backgroundColor: post.published ? "#DCFCE7" : "#F1F5F9",
            color: post.published ? "#166534" : "#64748B",
            fontFamily: "'Pretendard', sans-serif",
          }}>
            {post.published ? "게시됨" : "초안"}
          </span>
        </div>
        <p style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "Inter, sans-serif", marginTop: "6px" }}>
          작성일: {formatDate(post.createdAt)}
        </p>
      </div>

      {/* 핵심 지표 4개 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "전체 조회수", value: post.viewCount.toLocaleString(), sub: "총 조회" },
          { label: "고유 독자", value: viewers.length.toLocaleString(), sub: "회원 기준" },
          { label: "체크(좋아요)", value: post._count.likes.toLocaleString(), sub: "누적 체크" },
          { label: "체크율", value: `${likeRate}%`, sub: "조회 대비 체크" },
        ].map(stat => (
          <div key={stat.label} style={{ backgroundColor: "white", border: "1px solid #E2E8F0", padding: "20px 24px" }}>
            <p style={{ fontSize: "11px", color: "#94A3B8", fontFamily: "Inter, sans-serif", marginBottom: "6px", letterSpacing: "0.05em" }}>
              {stat.label}
            </p>
            <p style={{ fontSize: "28px", fontWeight: 700, color: "#0F172A", fontFamily: "Inter, sans-serif", margin: 0 }}>
              {stat.value}
            </p>
            <p style={{ fontSize: "11px", color: "#CBD5E1", fontFamily: "Inter, sans-serif", marginTop: "4px" }}>
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* 읽은 회원 목록 */}
        <div style={{ backgroundColor: "white", border: "1px solid #E2E8F0", padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "14px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A", letterSpacing: "0.05em", margin: 0 }}>
              읽은 회원
            </h2>
            <span style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>
              {viewers.length}명
            </span>
          </div>
          {viewers.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#CBD5E1", fontFamily: "'Pretendard', sans-serif" }}>아직 읽은 회원이 없습니다.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["이름", "직업", "읽은 횟수", "마지막 조회"].map(h => (
                      <th key={h} style={{
                        textAlign: "left", padding: "6px 8px",
                        fontSize: "10px", fontFamily: "Inter, sans-serif",
                        color: "#94A3B8", letterSpacing: "0.05em",
                        borderBottom: "1px solid #F1F5F9",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {viewers.map((v, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #F8F9FA" }}>
                      <td style={{ padding: "9px 8px" }}>
                        <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#0F172A", margin: 0 }}>
                          {v.user.name || "—"}
                        </p>
                        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", margin: 0 }}>
                          {v.user.email}
                        </p>
                      </td>
                      <td style={{ padding: "9px 8px", fontSize: "12px", fontFamily: "'Pretendard', sans-serif", color: "#64748B" }}>
                        {v.user.occupation || "—"}
                      </td>
                      <td style={{ padding: "9px 8px", textAlign: "center" }}>
                        <span style={{
                          fontSize: "12px", fontFamily: "Inter, sans-serif", fontWeight: 700,
                          color: v.count >= 3 ? "#1E40AF" : "#0F172A",
                        }}>
                          {v.count}
                        </span>
                      </td>
                      <td style={{ padding: "9px 8px", fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", whiteSpace: "nowrap" }}>
                        {formatDateTime(v.lastViewedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 체크한 회원 목록 */}
        <div style={{ backgroundColor: "white", border: "1px solid #E2E8F0", padding: "24px 28px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "14px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A", letterSpacing: "0.05em", margin: 0 }}>
              체크한 회원
            </h2>
            <span style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>
              {post.likes.length}명
            </span>
          </div>
          {post.likes.length === 0 ? (
            <p style={{ fontSize: "13px", color: "#CBD5E1", fontFamily: "'Pretendard', sans-serif" }}>아직 체크한 회원이 없습니다.</p>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    {["이름", "직업", "체크일"].map(h => (
                      <th key={h} style={{
                        textAlign: "left", padding: "6px 8px",
                        fontSize: "10px", fontFamily: "Inter, sans-serif",
                        color: "#94A3B8", letterSpacing: "0.05em",
                        borderBottom: "1px solid #F1F5F9",
                      }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {post.likes.map((like, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #F8F9FA" }}>
                      <td style={{ padding: "9px 8px" }}>
                        <p style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#0F172A", margin: 0 }}>
                          {like.user.name || "—"}
                        </p>
                        <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", margin: 0 }}>
                          {like.user.email}
                        </p>
                      </td>
                      <td style={{ padding: "9px 8px", fontSize: "12px", fontFamily: "'Pretendard', sans-serif", color: "#64748B" }}>
                        {like.user.occupation || "—"}
                      </td>
                      <td style={{ padding: "9px 8px", fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", whiteSpace: "nowrap" }}>
                        {formatDate(like.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* 수정 링크 */}
      <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
        <Link href={`/admin/posts/${post.id}/edit`}
          style={{
            padding: "9px 20px", backgroundColor: "#0F172A", color: "white",
            fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
            fontWeight: 500, textDecoration: "none",
          }}>
          글 수정
        </Link>
        <Link href="/admin"
          style={{
            padding: "9px 20px", backgroundColor: "white", color: "#64748B",
            border: "1px solid #E2E8F0",
            fontSize: "13px", fontFamily: "'Pretendard', sans-serif",
            fontWeight: 500, textDecoration: "none",
          }}>
          대시보드로
        </Link>
      </div>
    </div>
  );
}
