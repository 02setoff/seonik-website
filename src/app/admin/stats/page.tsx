import { prisma } from "@/lib/prisma";

export const metadata = { title: "통계 — 선익 SEONIK" };

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div style={{ backgroundColor: "white", border: "1px solid #E2E8F0", padding: "24px 28px" }}>
      <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.08em", marginBottom: "8px" }}>{label}</p>
      <p style={{ fontSize: "28px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A" }}>{value}</p>
    </div>
  );
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div style={{ marginBottom: "10px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
        <span style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#475569" }}>{label}</span>
        <span style={{ fontSize: "13px", fontFamily: "Inter, sans-serif", color: "#94A3B8" }}>{value}</span>
      </div>
      <div style={{ height: "6px", backgroundColor: "#F1F5F9" }}>
        <div style={{ height: "100%", width: `${pct}%`, backgroundColor: "#0F172A", transition: "width 0.3s" }} />
      </div>
    </div>
  );
}

export default async function StatsPage() {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const [
    totalUsers,
    newUsersWeek,
    newUsersMonth,
    totalPosts,
    totalLikes,
    topPosts,
    occupationStats,
    howFoundStats,
    joinReasonStats,
    recentUsers,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: monthAgo } } }),
    prisma.post.count({ where: { published: true } }),
    prisma.like.count(),
    prisma.post.findMany({
      where: { published: true },
      orderBy: { viewCount: "desc" },
      take: 10,
      select: { id: true, title: true, category: true, viewCount: true, _count: { select: { likes: true } } },
    }),
    prisma.user.groupBy({ by: ["occupation"], _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
    prisma.user.groupBy({ by: ["howFound"], _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
    prisma.user.groupBy({ by: ["joinReason"], _count: { id: true }, orderBy: { _count: { id: "desc" } } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { name: true, email: true, occupation: true, createdAt: true },
    }),
  ]);

  const totalViews = topPosts.reduce((sum, p) => sum + p.viewCount, 0);
  const maxViews = topPosts[0]?.viewCount || 1;

  return (
    <div>
      <h1 style={{ fontSize: "22px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "32px" }}>
        사이트 통계
      </h1>

      {/* 주요 지표 */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px", marginBottom: "40px" }}>
        <StatCard label="전체 회원" value={totalUsers} />
        <StatCard label="이번 주 신규 가입" value={newUsersWeek} />
        <StatCard label="이번 달 신규 가입" value={newUsersMonth} />
        <StatCard label="게시된 글" value={totalPosts} />
        <StatCard label="전체 조회수" value={totalViews.toLocaleString()} />
        <StatCard label="전체 체크(좋아요)" value={totalLikes} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", marginBottom: "40px" }}>
        {/* 조회수 TOP 글 */}
        <div style={{ backgroundColor: "white", border: "1px solid #E2E8F0", padding: "24px 28px" }}>
          <h2 style={{ fontSize: "14px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A", letterSpacing: "0.05em", marginBottom: "20px" }}>
            조회수 TOP 글
          </h2>
          {topPosts.map(p => (
            <Bar key={p.id} label={p.title.length > 24 ? p.title.slice(0, 24) + "…" : p.title} value={p.viewCount} max={maxViews} />
          ))}
          {topPosts.length === 0 && <p style={{ fontSize: "13px", color: "#CBD5E1", fontFamily: "'Pretendard', sans-serif" }}>데이터 없음</p>}
        </div>

        {/* 체크수 TOP 글 */}
        <div style={{ backgroundColor: "white", border: "1px solid #E2E8F0", padding: "24px 28px" }}>
          <h2 style={{ fontSize: "14px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A", letterSpacing: "0.05em", marginBottom: "20px" }}>
            체크수 TOP 글
          </h2>
          {[...topPosts].sort((a, b) => b._count.likes - a._count.likes).map(p => (
            <Bar key={p.id} label={p.title.length > 24 ? p.title.slice(0, 24) + "…" : p.title}
              value={p._count.likes} max={Math.max(...topPosts.map(x => x._count.likes), 1)} />
          ))}
          {topPosts.length === 0 && <p style={{ fontSize: "13px", color: "#CBD5E1", fontFamily: "'Pretendard', sans-serif" }}>데이터 없음</p>}
        </div>
      </div>

      {/* 회원 분석 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "24px", marginBottom: "40px" }}>
        {[
          { title: "직업 분포", data: occupationStats.map(x => ({ label: x.occupation || "미입력", value: x._count.id })) },
          { title: "유입 경로", data: howFoundStats.map(x => ({ label: x.howFound || "미입력", value: x._count.id })) },
          { title: "가입 이유", data: joinReasonStats.map(x => ({ label: x.joinReason || "미입력", value: x._count.id })) },
        ].map(({ title, data }) => (
          <div key={title} style={{ backgroundColor: "white", border: "1px solid #E2E8F0", padding: "24px 28px" }}>
            <h2 style={{ fontSize: "14px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A", letterSpacing: "0.05em", marginBottom: "20px" }}>
              {title}
            </h2>
            {data.map(({ label, value }) => (
              <Bar key={label} label={label} value={value} max={data[0]?.value || 1} />
            ))}
            {data.length === 0 && <p style={{ fontSize: "13px", color: "#CBD5E1", fontFamily: "'Pretendard', sans-serif" }}>데이터 없음</p>}
          </div>
        ))}
      </div>

      {/* 최근 가입 회원 */}
      <div style={{ backgroundColor: "white", border: "1px solid #E2E8F0", padding: "24px 28px" }}>
        <h2 style={{ fontSize: "14px", fontFamily: "Inter, sans-serif", fontWeight: 700, color: "#0F172A", letterSpacing: "0.05em", marginBottom: "20px" }}>
          최근 가입 회원
        </h2>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              {["이름", "이메일", "직업", "가입일"].map(h => (
                <th key={h} style={{ textAlign: "left", padding: "8px 12px", fontSize: "11px", fontFamily: "Inter, sans-serif", color: "#94A3B8", letterSpacing: "0.05em", borderBottom: "1px solid #F1F5F9" }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentUsers.map((u, i) => (
              <tr key={i}>
                <td style={{ padding: "10px 12px", fontSize: "14px", fontFamily: "'Pretendard', sans-serif", color: "#0F172A" }}>{u.name || "—"}</td>
                <td style={{ padding: "10px 12px", fontSize: "13px", fontFamily: "Inter, sans-serif", color: "#64748B" }}>{u.email}</td>
                <td style={{ padding: "10px 12px", fontSize: "13px", fontFamily: "'Pretendard', sans-serif", color: "#64748B" }}>{u.occupation || "—"}</td>
                <td style={{ padding: "10px 12px", fontSize: "13px", fontFamily: "Inter, sans-serif", color: "#94A3B8" }}>
                  {new Date(u.createdAt).toLocaleDateString("ko-KR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {recentUsers.length === 0 && <p style={{ fontSize: "13px", color: "#CBD5E1", fontFamily: "'Pretendard', sans-serif" }}>가입 회원이 없습니다.</p>}
      </div>
    </div>
  );
}
