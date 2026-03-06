import { prisma } from "@/lib/prisma";

export const metadata = { title: "회원 관리 — 선익 SEONIK Admin" };

function formatDate(d: Date) {
  return d.toLocaleDateString("ko-KR", {
    year: "numeric", month: "2-digit", day: "2-digit",
  }).replace(/\. /g, ".").replace(/\.$/, "");
}

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { posts: true } },
    },
  });

  return (
    <div>
      <div style={{ marginBottom: "32px" }}>
        <h1 className="font-bold text-[#0F172A]"
          style={{ fontSize: "24px", fontFamily: "Inter, sans-serif", marginBottom: "6px" }}>
          회원 관리
        </h1>
        <p className="text-[#64748B]"
          style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif" }}>
          총 {users.length}명의 회원이 가입되어 있습니다.
        </p>
      </div>

      {users.length === 0 ? (
        <div className="bg-white border border-[#E2E8F0] flex items-center justify-center py-20">
          <p className="text-[#CBD5E1]" style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif" }}>
            아직 가입한 회원이 없습니다.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#E2E8F0] overflow-hidden">
          {/* 테이블 헤더 */}
          <div className="grid border-b border-[#E2E8F0] bg-[#F8F9FA]"
            style={{ gridTemplateColumns: "1fr 1.5fr 120px 80px", padding: "12px 20px" }}>
            {["이름", "이메일", "가입일", "역할"].map(h => (
              <p key={h} className="text-[#64748B] font-semibold uppercase tracking-wide"
                style={{ fontSize: "11px", fontFamily: "Inter, sans-serif" }}>
                {h}
              </p>
            ))}
          </div>

          {/* 회원 목록 */}
          {users.map((user, idx) => (
            <div
              key={user.id}
              className="grid border-b border-[#F1F5F9] last:border-0 hover:bg-[#F8F9FA] transition-colors duration-150"
              style={{ gridTemplateColumns: "1fr 1.5fr 120px 80px", padding: "16px 20px" }}
            >
              <p className="text-[#0F172A] font-medium"
                style={{ fontSize: "14px", fontFamily: "'Pretendard', sans-serif" }}>
                {user.name || <span className="text-[#CBD5E1]">미설정</span>}
              </p>
              <p className="text-[#475569]"
                style={{ fontSize: "14px", fontFamily: "Inter, sans-serif" }}>
                {user.email}
              </p>
              <p className="text-[#94A3B8]"
                style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif" }}>
                {formatDate(user.createdAt)}
              </p>
              <p style={{ fontSize: "11px", fontFamily: "Inter, sans-serif" }}>
                {user.email === process.env.ADMIN_EMAIL ? (
                  <span className="bg-[#0F172A] text-white px-2 py-0.5"
                    style={{ fontSize: "10px", letterSpacing: "0.05em" }}>
                    ADMIN
                  </span>
                ) : (
                  <span className="bg-[#E2E8F0] text-[#64748B] px-2 py-0.5"
                    style={{ fontSize: "10px", letterSpacing: "0.05em" }}>
                    USER
                  </span>
                )}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* 안내 메시지 */}
      <div className="bg-[#FFF9C4] border border-[#FCD34D] mt-8" style={{ padding: "16px 20px" }}>
        <p className="text-[#78350F] font-medium"
          style={{ fontSize: "13px", fontFamily: "'Pretendard', sans-serif", marginBottom: "4px" }}>
          회원 데이터 활용 안내
        </p>
        <p className="text-[#92400E]"
          style={{ fontSize: "12px", fontFamily: "'Pretendard', sans-serif", lineHeight: "1.6" }}>
          회원 이메일로 뉴스레터 발송, 맞춤형 콘텐츠 제공, 전용 알림 서비스 등을 추후 구현할 수 있습니다.
          현재는 이메일+비밀번호 회원만 표시됩니다 (Google 로그인 연동 시 Google 계정도 표시).
        </p>
      </div>
    </div>
  );
}
