import { prisma } from "@/lib/prisma";

// ── 지역 정규화 ──────────────────────────────────────────────────────
const REGION_MAP: Record<string, string> = {
  서울특별시: "서울", 서울시: "서울", 서울: "서울",
  경기도: "경기", 경기: "경기",
  인천광역시: "인천", 인천: "인천",
  부산광역시: "부산", 부산: "부산",
  대구광역시: "대구", 대구: "대구",
  대전광역시: "대전", 대전: "대전",
  광주광역시: "광주", 광주: "광주",
  울산광역시: "울산", 울산: "울산",
  세종특별자치시: "세종", 세종: "세종",
  강원도: "강원", 강원특별자치도: "강원", 강원: "강원",
  충청북도: "충북", 충북: "충북",
  충청남도: "충남", 충남: "충남",
  전라북도: "전북", 전북특별자치도: "전북", 전북: "전북",
  전라남도: "전남", 전남: "전남",
  경상북도: "경북", 경북: "경북",
  경상남도: "경남", 경남: "경남",
  제주특별자치도: "제주", 제주: "제주",
};

function normalizeRegion(raw: string): string {
  if (!raw || /전국|전체|없음/.test(raw) || raw.trim() === "") return "전국";
  const parts = raw.split(/[,·\/\s]+/).map((r) => r.trim()).filter(Boolean);
  const mapped = parts.map((r) => {
    for (const [key, val] of Object.entries(REGION_MAP)) {
      if (r.includes(key) || key.includes(r)) return val;
    }
    return null;
  }).filter(Boolean) as string[];
  const unique = mapped.filter((v, i, a) => a.indexOf(v) === i);
  return unique.length > 0 ? unique.join(",") : "전국";
}

// K-스타트업 biz_enyy 필드 → 창업단계 변환
// "예비창업자,1년미만,2년미만,3년미만,5년미만,7년미만,10년미만"
function normalizeKstartupStage(bizEnyy: string): string {
  if (!bizEnyy) return "전체";
  const stages: string[] = [];
  if (bizEnyy.includes("예비창업자")) stages.push("예비창업자");
  if (/[123]년미만/.test(bizEnyy)) stages.push("초기창업자");
  if (/[5-9]년미만|10년미만/.test(bizEnyy)) stages.push("성장기창업자");
  return stages.length > 0 ? stages.join(",") : "전체";
}

// 기업마당 trgetNm 필드 → 창업단계 변환
function normalizeBizinfoStage(trgetNm: string): string {
  if (!trgetNm) return "전체";
  const stages: string[] = [];
  if (trgetNm.includes("예비")) stages.push("예비창업자");
  if (trgetNm.includes("초기") || trgetNm.includes("7년") || trgetNm.includes("3년")) stages.push("초기창업자");
  if (trgetNm.includes("성장") || trgetNm.includes("중소")) stages.push("성장기창업자");
  return stages.length > 0 ? stages.join(",") : "전체";
}

// ── XML 파싱 유틸 ────────────────────────────────────────────────────
// 기업마당: <fieldName><![CDATA[value]]></fieldName> 또는 <fieldName>value</fieldName>
function xmlField(xml: string, field: string): string {
  const m = xml.match(new RegExp(`<${field}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${field}>`));
  return m ? m[1].replace(/<[^>]+>/g, "").trim() : "";
}

// 기업마당 reqstBeginEndDe: "2026-04-10 ~ 2026-04-30" → Date
function parseBizinfoDeadline(raw: string): Date | null {
  if (!raw) return null;
  const match = raw.match(/~\s*(\d{4}-\d{2}-\d{2})/);
  if (match) return new Date(match[1]);
  return null;
}

// K-스타트업 날짜: "20261231" → Date
function parseKstartupDate(raw: string): Date | null {
  if (!raw || raw.length < 8) return null;
  const d = new Date(`${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`);
  return isNaN(d.getTime()) ? null : d;
}

// ── Upsert ───────────────────────────────────────────────────────────
type AnnData = {
  title: string;
  description: string | null;
  region: string;
  affiliation: string;
  stage: string;
  deadline: Date | null;
  applyUrl: string | null;
  organization: string | null;
};

async function upsert(source: string, sourceId: string, data: AnnData) {
  const existing = await prisma.announcement.findFirst({ where: { source, sourceId } });
  if (existing) {
    await prisma.announcement.update({
      where: { id: existing.id },
      data: { title: data.title, description: data.description, deadline: data.deadline },
    });
  } else {
    await prisma.announcement.create({ data: { ...data, source, sourceId } }).catch(() => {});
  }
}

// ── K-스타트업 API ────────────────────────────────────────────────────
// Endpoint: https://apis.data.go.kr/B552735/kisedKstartupService01/getAnnouncementInformation01
// XML: <col name="필드명">값</col> 구조
async function fetchKStartup(key: string): Promise<number> {
  let page = 1, saved = 0;

  while (true) {
    const url = `https://apis.data.go.kr/B552735/kisedKstartupService01/getAnnouncementInformation01?serviceKey=${encodeURIComponent(key)}&pageNo=${page}&numOfRows=100`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) break;

    const xml = await res.text();
    const itemMatches = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g));
    if (itemMatches.length === 0) break;

    for (const [, itemXml] of itemMatches) {
      // col 방식: <col name="key">value</col>
      const cols: Record<string, string> = {};
      for (const [, name, val] of Array.from(itemXml.matchAll(/<col name="([^"]+)"[^>]*>([\s\S]*?)<\/col>/g))) {
        cols[name] = val.replace(/<!\[CDATA\[|\]\]>/g, "").replace(/<[^>]+>/g, "").trim();
      }

      const sourceId = cols["pbanc_sn"];
      if (!sourceId) continue;

      await upsert("K-스타트업", sourceId, {
        title: (cols["biz_pbanc_nm"] || cols["intg_pbanc_biz_nm"] || "제목 없음").slice(0, 500),
        description: cols["pbanc_ctnt"] || null,
        region: normalizeRegion(cols["supt_regin"] || ""),
        affiliation: "전체",
        stage: normalizeKstartupStage(cols["biz_enyy"] || ""),
        deadline: parseKstartupDate(cols["pbanc_rcpt_end_dt"]),
        applyUrl: cols["detl_pg_url"] || null,
        organization: cols["pbanc_ntrp_nm"] || null,
      });
      saved++;
    }

    if (itemMatches.length < 100) break;
    page++;
  }

  return saved;
}

// ── 기업마당 API ─────────────────────────────────────────────────────
// Endpoint: https://apis.data.go.kr/1421000/bizinfo/pblancBsnsService
// XML: 일반 태그 구조 <pblancNm>값</pblancNm>
async function fetchBizInfo(key: string): Promise<number> {
  let page = 1, saved = 0;

  while (true) {
    const url = `https://apis.data.go.kr/1421000/bizinfo/pblancBsnsService?serviceKey=${encodeURIComponent(key)}&pageNo=${page}&numOfRows=100`;
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) break;

    const xml = await res.text();
    const itemMatches = Array.from(xml.matchAll(/<item>([\s\S]*?)<\/item>/g));
    if (itemMatches.length === 0) break;

    for (const [, itemXml] of itemMatches) {
      const sourceId = xmlField(itemXml, "pblancId");
      if (!sourceId) continue;

      await upsert("기업마당", sourceId, {
        title: (xmlField(itemXml, "pblancNm") || "제목 없음").slice(0, 500),
        description: xmlField(itemXml, "bsnsSumryCn").replace(/<[^>]+>/g, "").slice(0, 1000) || null,
        region: normalizeRegion(xmlField(itemXml, "jrsdInsttNm")),
        affiliation: "전체",
        stage: normalizeBizinfoStage(xmlField(itemXml, "trgetNm")),
        deadline: parseBizinfoDeadline(xmlField(itemXml, "reqstBeginEndDe")),
        applyUrl: xmlField(itemXml, "pblancUrl") || null,
        organization: xmlField(itemXml, "jrsdInsttNm") || xmlField(itemXml, "excInsttNm") || null,
      });
      saved++;
    }

    if (itemMatches.length < 100) break;
    page++;
  }

  return saved;
}

// ── 공개 함수 ─────────────────────────────────────────────────────────
export async function syncAnnouncements(): Promise<{ kstartup: number; bizinfo: number; total: number }> {
  const key = process.env.PUBLIC_DATA_API_KEY;
  if (!key) throw new Error("PUBLIC_DATA_API_KEY 환경변수 없음");

  const [kstartup, bizinfo] = await Promise.all([
    fetchKStartup(key),
    fetchBizInfo(key),
  ]);

  const total = await prisma.announcement.count({ where: { published: true } });
  return { kstartup, bizinfo, total };
}
