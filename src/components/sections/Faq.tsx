import { Section } from "@/components/layout/Section";

/** Answers are intentionally general and easy to edit later. */
export const faqItems = [
  {
    q: "بعد از خرید چگونه سفارش یا اشتراک را دریافت می‌کنم؟",
    a: "پس از ثبت سفارش و تأیید پرداخت، دسترسی مستقیم به خدمات دیجیتال و اشتراک‌های هوش مصنوعی از طریق راه ارتباطی ثبت‌شده شما ارسال و تحویل داده می‌شود.",
  },
  {
    q: "ضمانت اکانت‌های هوش مصنوعی در VAICH شامل چه مواردی است؟",
    a: "تمامی اشتراک‌های هوش مصنوعی (ChatGPT Plus، Claude Pro و Google AI Pro / Gemini) به‌صورت قانونی و با ضمانت فعال‌سازی سالم اولیه و تحویل کامل ارائه می‌شوند. پس از تحویل موفق، حفظ سلامت اکانت به رعایت نکات استفاده ایمن (IP ثابت و تمیز، تغییر ندادن مکرر VPN، عدم استفاده هم‌زمان چند نفر و رعایت قوانین پلتفرم) توسط کاربر بستگی دارد.",
  },
  {
    q: "چطور از مسدود یا بن شدن اکانت ChatGPT یا Claude جلوگیری کنیم؟",
    a: "همیشه با یک VPN معتبر و دارای IP ثابت و غیرآلوده وارد شوید، هنگام باز بودن سایت یا اپلیکیشن کشور/سرور VPN را پشت سر هم تغییر ندهید، اکانت شخصی را با دیگران به اشتراک نگذارید و از پرامپت‌های مغایر با قوانین سرویس‌دهنده پرهیز کنید.",
  },
  {
    q: "آیا امکان دریافت پشتیبانی و راهنمایی وجود دارد؟",
    a: "بله، پیش و پس از خرید می‌توانید از طریق بخش پشتیبانی تلگرام با تیم پشتیبانی فنی VAICH در ارتباط باشید.",
  },
  {
    q: "روش پرداخت چگونه است؟",
    a: "پرداخت به صورت کارت‌به‌کارت انجام می‌شود. پس از تکمیل فرم سفارش، با لمس دکمه «ارسال رسید در ربات»، ابتدا رسید متنی کپی‌شده و سپس تصویر فیش واریزی را در ربات تلگرام ارسال می‌کنید تا در اولین فرصت بررسی، فعال‌سازی و تحویل داده شود.",
  },
  {
    q: "اگر هنگام راه‌اندازی یا استفاده مشکلی پیش آمد چه کار کنم؟",
    a: "تیم پشتیبانی VAICH در تمام ساعات آماده پاسخگویی، رفع مشکلات احتمالی راه‌اندازی و ارائه راهنمای استفاده ایمن به شماست.",
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
