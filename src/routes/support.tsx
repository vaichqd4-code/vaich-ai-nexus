import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent } from "react";
import { Section } from "@/components/layout/Section";
import { NeonButton } from "@/components/ui/NeonButton";
import { ContactLinks } from "@/components/brand/ContactLinks";
import { Faq } from "@/components/sections/Faq";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "پشتیبانی | VAICH" },
      {
        name: "description",
        content: "برای پرسش درباره اشتراک‌های هوش مصنوعی با تیم پشتیبانی VAICH در ارتباط باشید.",
      },
      { property: "og:title", content: "پشتیبانی | VAICH" },
      { property: "og:description", content: "تیم پشتیبانی VAICH آماده کمک به شماست." },
    ],
  }),
  component: SupportPage,
});

const fieldClass =
  "w-full rounded-2xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-neon-blue/70 focus:ring-2 focus:ring-ring/40";

function SupportPage() {
  const handleOpenChat = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (typeof window !== "undefined" && (window as any).$crisp) {
      (window as any).$crisp.push(["do", "chat:open"]);
    }
  };

  return (
    <>
      <Section
        className="aurora"
        title="پشتیبانی"
        subtitle="سوالی دارید؟ تیم پشتیبانی VAICH آماده کمک به شماست."
      >
        <div className="mx-auto mb-8 max-w-3xl">
          <p className="mb-4 text-center text-sm text-muted-foreground">
            سریع‌ترین راه‌های ارتباط با ما:
          </p>
          <ContactLinks />
        </div>
        <form onSubmit={handleOpenChat} className="glass-panel mx-auto grid max-w-2xl gap-4 rounded-4xl p-6 sm:p-8">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm">
              نام
            </label>
            <input id="name" className={fieldClass} placeholder="نام شما" />
          </div>
          <div>
            <label htmlFor="contact" className="mb-2 block text-sm">
              راه ارتباطی (ایمیل یا شماره تماس)
            </label>
            <input id="contact" dir="ltr" className={`${fieldClass} text-right`} placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="message" className="mb-2 block text-sm">
              پیام
            </label>
            <textarea id="message" rows={5} className={fieldClass} placeholder="سوال خود را بنویسید." />
          </div>
          <NeonButton type="submit" size="lg">
            ارتباط با پشتیبانی
          </NeonButton>
        </form>
      </Section>
      <Faq />
    </>
  );
}
