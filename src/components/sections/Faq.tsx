import { Section } from "@/components/layout/Section";

/** Answers are intentionally general and easy to edit later. */
export const faqItems = [
  {
    q: "بعد از خرید چگونه اشتراک را دریافت می‌کنم؟",
    a: "پس از ثبت سفارش، اطلاعات اشتراک از طریق راه ارتباطی که در فرم سفارش وارد کرده‌اید برای شما ارسال می‌شود.",
  },
  {
    q: "آیا امکان دریافت پشتیبانی وجود دارد؟",
    a: "بله، پیش و پس از خرید می‌توانید از بخش پشتیبانی با تیم VAICH در ارتباط باشید.",
  },
  {
    q: "روش پرداخت چگونه است؟",
    a: "درگاه پرداخت در حال آماده‌سازی است. در حال حاضر سفارش ثبت می‌شود و روش پرداخت از طریق پشتیبانی هماهنگ می‌گردد.",
  },
  {
    q: "اگر هنگام استفاده مشکلی پیش آمد چه کار کنم؟",
    a: "موضوع را از بخش پشتیبانی مطرح کنید تا بررسی شود.",
  },
];

export function Faq({ withSection = true }: { withSection?: boolean }) {
  const list = (
    <div className="space-y-3">
      {faqItems.map((item) => (
        <details
          key={item.q}
          className="group rounded-3xl border border-border bg-card/60 p-5 transition-colors duration-300 open:border-neon-purple/40"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-bold sm:text-base">
            <span className="min-w-0">{item.q}</span>
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-border text-muted-foreground transition-transform duration-300 group-open:rotate-45">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </span>
          </summary>
          <p className="mt-3 text-sm leading-8 text-muted-foreground">{item.a}</p>
        </details>
      ))}
    </div>
  );

  if (!withSection) return list;

  return (
    <Section id="faq" title="سوالات متداول">
      {list}
    </Section>
  );
}
