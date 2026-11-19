import { Section } from "@/components/layout/Section";
import { Zap, ShieldCheck, Tag, Headphones } from "lucide-react";

const features = [
  {
    title: "تحویل سریع و آنی",
    desc: "بررسی و فعال‌سازی فوری در کوتاه‌ترین زمان ممکن تا بدون اتلاف وقت از سرویس استفاده کنید.",
    icon: <Zap className="h-6 w-6 text-amber-500" />,
  },
  {
    title: "ضمانت فعال‌سازی قانونی",
    desc: "تمامی اشتراک‌ها با پرداخت رسمی و قانونی تهیه شده و دارای ضمانت سلامت تا پایان دوره هستند.",
    icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
  },
  {
    title: "قیمت‌گذاری شفاف و منصفانه",
    desc: "قیمت‌ها بدون هزینه پنهان با بیشترین تخفیف ممکن نسبت به خرید مستقیم ارزی عرضه می‌شوند.",
    icon: <Tag className="h-6 w-6 text-blue-500" />,
  },
  {
    title: "پشتیبانی اختصاصی ۲۴ ساعته",
    desc: "پاسخگویی دلسوزانه و راهنمای گام‌به‌گام راه‌اندازی و استفاده ایمن از طریق تلگرام و وب‌سایت.",
    icon: <Headphones className="h-6 w-6 text-purple-500" />,
  },
];

export function Features() {
  return (
    <Section
      id="why"
      title="چرا VAICH؟"
      subtitle="ارزش‌هایی که خرید خدمات دیجیتال و اشتراک‌های آنلاین را در وایچ متمایز و مطمئن می‌کند."
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {features.map((f) => (
          <div
            key={f.title}
            className="group rounded-3xl border border-border/80 bg-card/70 p-4 sm:p-5.5 shadow-xs hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <span className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-secondary/80 border border-border/70 group-hover:scale-105 transition-transform mb-3.5">
                {f.icon}
              </span>
              <h3 className="text-sm sm:text-base font-black text-foreground">
                {f.title}
              </h3>
              <p className="mt-1.5 text-[11px] sm:text-xs leading-5 sm:leading-6 text-muted-foreground/90 font-medium">
                {f.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
