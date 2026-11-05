import { createFileRoute } from "@tanstack/react-router";
import { BlogSection } from "@/components/sections/BlogSection";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "مجله تخصصی و مقالات آموزشی | وایچ (VAICH)" },
      {
        name: "description",
        content:
          "مجموعه مقالات تخصصی، راهنماهای کاربردی و یادداشت‌های تحلیلی یونس حیاتی در زمینه بهره‌وری فردی، هوش مصنوعی، پلنرهای دیجیتال و مدیریت زمان در وایچ.",
      },
      { property: "og:title", content: "مجله تخصصی و مقالات آموزشی | وایچ" },
      {
        property: "og:description",
        content:
          "مقالات تخصصی و راهنماهای کاربردی هوش مصنوعی و پلنر دیجیتال با امضای یونس حیاتی در وایچ.",
      },
      { property: "og:url", content: "https://vaich.ir/blog" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "canonical", href: "https://vaich.ir/blog" }],
  }),
  component: BlogIndexPage,
});

function BlogIndexPage() {
  return (
    <div className="py-6 sm:py-10">
      <BlogSection />
    </div>
  );
}
