import { prisma } from "@/lib/prisma";

function formatDate(d: Date) {
  return d.toLocaleDateString("ko-KR", { year: "numeric", month: "2-digit", day: "2-digit" })
    .replace(/\. /g, ".").replace(/\.$/, "");
}

export default async function ContactsPage() {
  const contacts = await prisma.contact.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "20px", fontFamily: "'Pretendard', sans-serif", fontWeight: 700, color: "#0F172A", marginBottom: "24px" }}>
        문의함 ({contacts.length})
      </h1>

      {contacts.length === 0 ? (
        <div style={{ padding: "60px", textAlign: "center", backgroundColor: "white", border: "1px solid #E2E8F0" }}>
          <p style={{ color: "#94A3B8", fontSize: "14px", fontFamily: "'Pretendard', sans-serif" }}>
            접수된 문의가 없습니다.
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {contacts.map(c => (
            <div key={c.id} style={{
              backgroundColor: "white", border: "1px solid #E2E8F0", padding: "20px 24px",
              borderLeft: c.read ? "3px solid #E2E8F0" : "3px solid #0F172A",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ fontSize: "14px", fontWeight: 600, fontFamily: "'Pretendard', sans-serif", color: "#0F172A" }}>
                    {c.name}
                  </span>
                  <span style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>
                    {c.email}
                  </span>
                </div>
                <span style={{ fontSize: "12px", color: "#94A3B8", fontFamily: "Inter, sans-serif" }}>
                  {formatDate(c.createdAt)}
                </span>
              </div>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "#475569", fontFamily: "'Pretendard', sans-serif", marginBottom: "6px" }}>
                {c.subject}
              </p>
              <p style={{ fontSize: "13px", color: "#64748B", fontFamily: "'Pretendard', sans-serif", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                {c.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
