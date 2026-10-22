import { createFileRoute } from "@tanstack/react-router";
import { Features } from "@/components/sections/Features";
import { Trust } from "@/components/sections/Trust";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SupportCta } from "@/components/sections/SupportCta";

export const Route = createFileRoute("/why")({
  head: () => ({
    meta: [
      { title: "چرا VAICH | مزایای خرید مستقیم خدمات دیجیتال و اشتراک‌های هوش مصنوعی" },
      {
        name: "description",
        content: "چرا خرید از VAICH؟ تحویل فوری، پشتیبانی ۲۴ ساعته، ضمانت کامل خدمات دیجیتال و اشتراک‌های هوش مصنوعی با قیمت شفاف و منصفانه.",
      },
      { property: "og:title", content: "چرا VAICH | مزایای خرید مستقیم خدمات دیجیتال و اشتراک‌های هوش مصنوعی" },
      { property: "og:description", content: "دلایل انتخاب VAICH برای خرید مطمئن و قانونی خدمات دیجیتال و اشتراک‌های هوش مصنوعی." },
      { property: "og:url", content: "https://vaich.ir/why" },
    ],
    links: [
      { rel: "canonical", href: "https://vaich.ir/why" },
    ],
  }),
  component: () => (
    <>
      <Features />
      <Trust />
      <HowItWorks />
      <SupportCta />
    </>
  ),
});
