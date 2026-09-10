import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/layout/Section";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "حریم خصوصی | VAICH" },
      { name: "description", content: "سیاست حریم خصوصی و نحوه استفاده VAICH از اطلاعات مشتریان." },
      { property: "og:title", content: "حریم خصوصی | VAICH" },
      { property: "og:description", content: "سیاست حریم خصوصی VAICH." },
    ],
  }),
  component: () => (
    <Section className="aurora" title="حریم خصوصی">
      <div className="glass-panel space-y-4 rounded-4xl p-6 text-sm leading-8 text-muted-foreground sm:p-10">
        <p>این متن نمونه است و قابل ویرایش خواهد بود.</p>
        <p>اطلاعاتی که هنگام ثبت سفارش وارد می‌کنید تنها برای انجام همان سفارش استفاده می‌شود.</p>
        <p>جزئیات کامل سیاست حریم خصوصی پس از نهایی شدن در همین صفحه منتشر می‌شود.</p>
      </div>
    </Section>
  ),
});
