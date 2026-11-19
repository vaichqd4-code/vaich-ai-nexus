import { Section } from "@/components/layout/Section";
import { ChevronDown, HelpCircle } from "lucide-react";

export const faqItems = [
  {
    q: "آیا اشتراک‌ها و لایسنس‌ها قانونی هستند و ضمانت دارند؟",
    a: "بله، ۱۰۰٪ تمامی سرویس‌ها (ChatGPT Plus، Claude Pro، Google AI Pro، تلگرام پرمیوم و کانوا پرو) به‌صورت کاملاً قانونی با پرداخت ارزی رسمی فعال می‌شوند و تا آخرین روز اشتراک دارای ضمانت سلامت و پایداری هستند.",
  },
  {
    q: "فعال‌سازی و تحویل سرویس‌ها چقدر زمان می‌برد؟",
    a: "پس از ثبت سفارش و تأیید واریز، اکثر سرویس‌ها ظرف مدت زمان کوتاهی (معمولاً بین ۵ تا ۳۰ دقیقه در ساعات کاری) تحویل داده شده و آموزش‌های لازم ارسال می‌گردد.",
  },
  {
    q: "فعال‌سازی تلگرام پرمیوم و استارز به چه اطلاعاتی نیاز دارد؟",
    a: "هیچ نیازی به رمز عبور، شماره تلفن یا کد ورود به تلگرام شما نیست! تلگرام پرمیوم از طریق گیفت رسمی و استارز از طریق واریز مستقیم صرفاً با آیدی تلگرام (@Username) شما ارسال می‌شود و حریم خصوصی شما کاملاً محفوظ است.",
  },
  {
    q: "اشتراک کانوا پرو (Canva Pro) چگونه فعال می‌شود؟",
    a: "فعال‌سازی از طریق ارسال لینک دعوت تیمی رسمی روی ایمیل شخصی شما انجام می‌پذیرد؛ هیچ نیازی به پسورد نیست و تمام طرح‌ها و پروژه‌های شما کاملاً خصوصی باقی می‌ماند.",
  },
  {
    q: "پلنر هوشمند گوگل‌شیت به چه صورت تحویل داده می‌شود؟",
    a: "بلافاصله پس از پرداخت، لینک کپی اختصاصی فایل Google Sheets در اختیارتان قرار می‌گیرد. این نرم‌افزار دائمی و لایف‌تایم بوده و نیاز به تمدید ماهانه ندارد.",
  },
  {
    q: "روش‌های پرداخت چگونه است و چطور پشتیبانی بگیرم؟",
    a: "هم امکان پرداخت امن آنلاین در سایت وجود دارد و هم کارت‌به‌کارت مستقیم. پشتیبانی فنی وایچ از طریق آیدی تلگرام @youneshayati و تلفن 09193872172 به صورت ۲۴ ساعته پاسخگوی شماست.",
  },
];

export function Faq({ withSection = true }: { withSection?: boolean }) {
  const list = (
    <div className="space-y-3">
      {faqItems.map((item) => (
        <details
          key={item.q}
          className="group rounded-3xl border border-border/80 bg-card/60 p-4.5 sm:p-5 transition-all duration-300 open:border-primary/50 open:bg-card/90 open:shadow-md"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-xs sm:text-sm font-black text-foreground">
            <span className="min-w-0 flex items-center gap-2">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <HelpCircle className="h-3.5 w-3.5" />
              </span>
              <span>{item.q}</span>
            </span>
            <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-secondary/80 text-muted-foreground transition-transform duration-300 group-open:rotate-180">
              <ChevronDown className="h-4 w-4" />
            </span>
          </summary>
          <p className="mt-3.5 pt-3 border-t border-border/40 text-xs sm:text-sm leading-6 sm:leading-7 text-muted-foreground/90 font-medium">
            {item.a}
          </p>
        </details>
      ))}
    </div>
  );

  if (!withSection) return list;

  return (
    <Section
      id="faq"
      title="سوالات متداول"
      subtitle="پاسخ به پرتکرارترین پرسش‌های خریداران درباره فعال‌سازی، ضمانت و پشتیبانی وایچ."
    >
      {list}
    </Section>
  );
}
