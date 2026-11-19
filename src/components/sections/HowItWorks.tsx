import { Section } from "@/components/layout/Section";
import { toPersianDigits } from "@/lib/products";
import { CheckCircle2, CreditCard, Sparkles, ArrowLeft } from "lucide-react";
import { Link } from "@tanstack/react-router";

const steps = [
  {
    step: 1,
    title: "انتخاب سرویس و پلن دلخواه",
    desc: "محصول مورد نظر (هوش مصنوعی، تلگرام پرمیوم، استارز یا پلنر) را با قیمت شفاف و متغیرهای دلخواه انتخاب کنید.",
    icon: (
      <Sparkles className="h-6 w-6 text-purple-500" />
    ),
  },
  {
    step: 2,
    title: "پرداخت آسان و مطمئن",
    desc: "سفارش خود را به راحتی از طریق پرداخت آنلاین یا واریز کارت‌به‌کارت با تایید فوری ثبت و نهایی فرمایید.",
    icon: (
      <CreditCard className="h-6 w-6 text-blue-500" />
    ),
  },
  {
    step: 3,
    title: "تحویل سریع و فعال‌سازی قانونی",
    desc: "اشتراک شما در کمترین زمان ممکن همراه با ضمانت کامل و پشتیبانی تخصصی فعال و تحویل داده می‌شود.",
    icon: (
      <CheckCircle2 className="h-6 w-6 text-emerald-500" />
    ),
  },
];

export function HowItWorks() {
  return (
    <Section
      id="how-it-works"
      title="نحوه خرید در ۳ مرحله ساده"
      subtitle="مسیر خرید در وایچ بسیار شفاف، سریع و بدون اتلاف وقت طراحی شده است."
    >
      <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <div
            key={s.step}
            className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card/70 p-5 sm:p-6 shadow-xs hover:border-primary/50 hover:shadow-xl transition-all duration-300"
          >
            <div>
              <div className="flex items-center justify-between gap-3 mb-4">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/80 border border-border/70 shadow-xs group-hover:scale-105 transition-transform">
                  {s.icon}
                </span>
                <span className="gradient-text font-mono text-3xl sm:text-4xl font-black">
                  ۰{toPersianDigits(s.step)}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-foreground">
                {s.title}
              </h3>
              <p className="mt-2 text-xs sm:text-sm leading-6 sm:leading-7 text-muted-foreground font-medium">
                {s.desc}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-border/40 flex items-center text-xs font-bold text-primary gap-1">
              <span>گام {toPersianDigits(s.step)} از ۳</span>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
