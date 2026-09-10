import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
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
  const [sent, setSent] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Placeholder: no messaging backend is connected yet.
    setSent(true);
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
        <form onSubmit={onSubmit} className="glass-panel mx-auto grid max-w-2xl gap-4 rounded-4xl p-6 sm:p-8">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm">
              نام
            </label>
            <input id="name" required className={fieldClass} placeholder="نام شما" />
          </div>
          <div>
            <label htmlFor="contact" className="mb-2 block text-sm">
              راه ارتباطی (ایمیل یا شماره تماس)
            </label>
            <input id="contact" required dir="ltr" className={`${fieldClass} text-right`} placeholder="you@example.com" />
          </div>
          <div>
            <label htmlFor="message" className="mb-2 block text-sm">
              پیام
            </label>
            <textarea id="message" required rows={5} className={fieldClass} placeholder="سوال خود را بنویسید." />
          </div>
          <p className="text-xs leading-6 text-muted-foreground">
            ارسال خودکار پیام هنوز فعال نشده است؛ این فرم به‌زودی به سامانه پشتیبانی متصل می‌شود.
          </p>
          <NeonButton type="submit" size="lg">
            ارتباط با پشتیبانی
          </NeonButton>
          {sent ? (
            <p role="status" className="rounded-2xl border border-neon-purple/40 bg-background/60 p-4 text-sm leading-7">
              پیام شما ثبت شد. پس از اتصال سامانه پشتیبانی، پاسخ‌گویی انجام می‌شود.
            </p>
          ) : null}
        </form>
      </Section>
      <Faq />
    </>
  );
}
