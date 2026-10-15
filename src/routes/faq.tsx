import { createFileRoute } from "@tanstack/react-router";
import { Faq, faqItems } from "@/components/sections/Faq";
import { SupportCta } from "@/components/sections/SupportCta";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "سوالات متداول درباره خرید اشتراک‌های هوش مصنوعی | VAICH" },
      {
        name: "description",
        content: "پاسخ کامل به تمام پرسش‌های متداول در خصوص خرید اکانت ChatGPT Plus، فعال‌سازی Gemini Pro و Claude Pro، نحوه پرداخت و پشتیبانی در VAICH.",
      },
      { property: "og:title", content: "سوالات متداول | VAICH" },
      { property: "og:description", content: "پرسش‌های رایج درباره خرید، تحویل و پشتیبانی اشتراک هوش مصنوعی." },
      { property: "og:url", content: "https://vaich.ir/faq" },
    ],
    links: [
      { rel: "canonical", href: "https://vaich.ir/faq" },
    ],
  }),
  component: FaqPageComponent,
});

function FaqPageComponent() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Faq />
      <SupportCta />
    </>
  );
}
