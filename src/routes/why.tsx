import { createFileRoute } from "@tanstack/react-router";
import { Features } from "@/components/sections/Features";
import { Trust } from "@/components/sections/Trust";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SupportCta } from "@/components/sections/SupportCta";

export const Route = createFileRoute("/why")({
  head: () => ({
    meta: [
      { title: "چرا VAICH | خرید مطمئن اشتراک هوش مصنوعی" },
      {
        name: "description",
        content: "تحویل سریع، پشتیبانی، قیمت شفاف و تجربه‌ای ساده در خرید اشتراک هوش مصنوعی از VAICH.",
      },
      { property: "og:title", content: "چرا VAICH" },
      { property: "og:description", content: "دلایل انتخاب VAICH برای خرید اشتراک هوش مصنوعی." },
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
