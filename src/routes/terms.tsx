import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/layout/Section";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "قوانین و مقررات | VAICH" },
      { name: "description", content: "قوانین و مقررات استفاده از خدمات و خرید اشتراک در VAICH." },
      { property: "og:title", content: "قوانین و مقررات | VAICH" },
      { property: "og:description", content: "شرایط استفاده از خدمات VAICH." },
    ],
  }),
  component: () => (
    <Section className="aurora" title="قوانین و مقررات">
      <div className="glass-panel space-y-4 rounded-4xl p-6 text-sm leading-8 text-muted-foreground sm:p-10">
        <p>این متن نمونه است و قابل ویرایش خواهد بود.</p>
        <p>با ثبت سفارش در VAICH، شرایط استفاده از خدمات را می‌پذیرید.</p>
        <p>جزئیات کامل قوانین پس از نهایی شدن در همین صفحه منتشر می‌شود.</p>
      </div>
    </Section>
  ),
});
