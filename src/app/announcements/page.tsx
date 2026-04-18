import AnnouncementFeed from "@/components/announcements/AnnouncementFeed";

export const metadata = {
  title: "창업 공고 | 선익",
  description: "지역·소속·창업단계에 맞는 창업 공고를 한 곳에서 확인하세요.",
};

export default function AnnouncementsPage() {
  return <AnnouncementFeed />;
}
