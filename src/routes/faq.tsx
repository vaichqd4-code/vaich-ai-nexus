import { createFileRoute } from "@tanstack/react-router";
import { Faq } from "@/components/sections/Faq";
import { SupportCta } from "@/components/sections/SupportCta";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "سوالات متداول | VAICH" },
      {
        name: "description",
        content: "پاسخ پرسش‌های رایج درباره خرید، دریافت و پشتیبانی اشتراک‌های هوش مصنوعی VAICH.",
      },
      { property: "og:title", content: "سوالات متداول | VAICH" },
      { property: "og:description", content: "پرسش‌های رایج درباره خرید اشتراک هوش مصنوعی." },
    ],
  }),
  component: () => (
    <>
      <Faq />
      <SupportCta />
    </>
  ),
});
