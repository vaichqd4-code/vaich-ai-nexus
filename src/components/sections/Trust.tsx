import { Section } from "@/components/layout/Section";
import { toPersianDigits } from "@/lib/products";
import { Star, ShieldCheck, CheckCircle2, Clock, Users, Award, Lock } from "lucide-react";

const STATS = [
  {
    prefix: "+",
    number: "۸۵۰",
    unit: "",
    label: "سفارش موفق و تحویل‌شده",
    sub: "اشتراک و ابزارهای دیجیتال",
    icon: <Users className="h-5 w-5 text-primary" />,
  },
  {
    prefix: "",
    number: "۴.۹",
    unit: "از ۵",
    label: "میانگین رضایت خریداران",
    sub: "بر اساس نظرات واقعی مشتریان",
    icon: <Star className="h-5 w-5 fill-amber-400 text-amber-400" />,
  },
  {
    prefix: "زیر",
    number: "۲۰",
    unit: "دقیقه",
    label: "میانگین زمان تحویل",
    sub: "در تمامی ساعات کاری",
    icon: <Clock className="h-5 w-5 text-emerald-500" />,
  },
  {
    prefix: "",
    number: "۱۰۰",
    unit: "٪",
    label: "ضمانت قانونی فعال‌سازی",
    sub: "پشتیبانی و تأیید اولیه سفارش",
    icon: <ShieldCheck className="h-5 w-5 text-blue-500" />,
  },
];

const CUSTOMER_REVIEWS = [
  {
    name: ".",
    role: "خریدار پلنر گوگل‌شیت",
    rating: 5,
    date: "۱۴۰۴/۰۸/۲۸",
    comment: "عالیه",
  },
  {
    name: "مهدی",
    role: "خریدار تلگرام پرمیوم",
    rating: 5,
    date: "۱۴۰۴/۰۸/۲۶",
    comment: "اولش شک داشتم چون بدون پسورد بود، ولی به ۵ دقیقه نکشید دیدم گیفت روی آیدیم فعال شد. دمتون گرم واقعا پشتیبانی تلگرامتون خیلی سریع و باحوصله راه انداخت.",
  },
  {
    name: "Ali.R",
    role: "خریدار Canva Pro",
    rating: 4,
    date: "۱۴۰۴/۰۸/۲۴",
    comment: "خوب بود، دعوت‌نامه اومد رو ایمیلم و مجیک استودیو فعال شد. قیمتش هم مناسب بود.",
  },
  {
    name: "علیرضا",
    role: "خریدار ChatGPT Plus",
    rating: 5,
    date: "۱۴۰۴/۰۸/۲۱",
    comment: "من برای کدنویسی نیاز داشتم، رو جیمیل شخصیم بدون پسورد فعال شد و مدل‌ها بدون قطعی کار میکنن. ممنون از تحویل سریعتون.",
  },
];

export function Trust() {
  return (
    <Section
      id="trust"
      title="نظرات مشتریان و آمار اعتماد"
      subtitle="تجربه خریداران و آمار ثبت‌شده فروشگاه وایچ؛ شفافیت بالاترین اولویت ماست."
    >
      {/* 1. Trust Stats Bar with Crisp Persian Typography */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center text-center rounded-3xl border border-border/80 bg-card/70 p-4 sm:p-5 shadow-xs hover:border-primary/40 transition-colors"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/80 border border-border/70 mb-2.5">
              {s.icon}
            </span>
            <div className="flex items-baseline justify-center gap-1 font-sans font-black select-none" dir="rtl">
              {s.prefix && (
                <span className="text-primary text-base sm:text-lg font-bold">{s.prefix}</span>
              )}
              <span className="gradient-text text-2xl sm:text-3xl font-black tracking-tight">
                {s.number}
              </span>
              {s.unit && (
                <span className="text-muted-foreground text-xs sm:text-sm font-bold mr-0.5">{s.unit}</span>
              )}
            </div>
            <h4 className="mt-1 text-xs sm:text-sm font-bold text-foreground">
              {s.label}
            </h4>
            <span className="text-[10px] sm:text-xs text-muted-foreground/80 mt-0.5 font-medium">
              {s.sub}
            </span>
          </div>
        ))}
      </div>

      {/* 2. Customer Reviews Carousel / Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
        {CUSTOMER_REVIEWS.map((r, idx) => (
          <div
            key={r.name + r.role + idx}
            className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs hover:border-primary/40 hover:shadow-lg transition-all"
          >
            <div className="flex-1 flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-1">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[11px] font-sans font-semibold text-muted-foreground/80">
                  {toPersianDigits(r.date)}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] leading-6 text-foreground/90 font-medium my-auto py-1">
                «{r.comment}»
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
              <div>
                <span className="text-xs sm:text-sm font-black text-foreground block font-sans">
                  {r.name}
                </span>
                <span className="text-[10px] text-muted-foreground block truncate max-w-[170px]">
                  {r.role}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                <CheckCircle2 className="h-3 w-3" />
                <span>تأییدشده</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Secure Payment & Legal Seals Row */}
      <div className="mt-8 sm:mt-10 rounded-2xl border border-border/70 bg-secondary/30 p-3.5 sm:p-4.5 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-bold text-muted-foreground">
        <div className="inline-flex items-center gap-2 text-foreground">
          <Lock className="h-4 w-4 text-emerald-500" />
          <span>پرداخت امن و رمزنگاری‌شده SSL</span>
        </div>
        <span className="hidden sm:inline text-border">•</span>
        <div className="inline-flex items-center gap-2 text-foreground">
          <ShieldCheck className="h-4 w-4 text-primary" />
          <span>تضمین اصالت قانونی لایسنس و فعال‌سازی</span>
        </div>
        <span className="hidden sm:inline text-border">•</span>
        <div className="inline-flex items-center gap-2 text-foreground">
          <Award className="h-4 w-4 text-amber-500" />
          <span>پشتیبانی فنی و پیگیری تا رضایت کامل</span>
        </div>
      </div>
    </Section>
  );
}
