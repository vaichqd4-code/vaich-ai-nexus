import { Section } from "@/components/layout/Section";
import { toPersianDigits } from "@/lib/products";
import { Star, ShieldCheck, CheckCircle2, Clock, Users, Award, Lock } from "lucide-react";

const STATS = [
  {
    value: "+۲,۵۰۰",
    label: "سفارش موفق و تحویل‌شده",
    sub: "اشتراک و پلنر",
    icon: <Users className="h-5 w-5 text-primary" />,
  },
  {
    value: "۴.۹ / ۵",
    label: "میانگین رضایت خریداران",
    sub: "بر اساس نظرات ثبت‌شده",
    icon: <Star className="h-5 w-5 fill-amber-400 text-amber-400" />,
  },
  {
    value: "< ۱۵ دقیقه",
    label: "میانگین زمان تحویل",
    sub: "در ساعات کاری",
    icon: <Clock className="h-5 w-5 text-emerald-500" />,
  },
  {
    value: "۱۰۰٪",
    label: "ضمانت پایداری و اصالت",
    sub: "پشتیبانی فعال تا پایان دوره",
    icon: <ShieldCheck className="h-5 w-5 text-blue-500" />,
  },
];

const CUSTOMER_REVIEWS = [
  {
    name: "سارا م.",
    role: "خریدار ChatGPT Plus قانونی",
    rating: 5,
    date: "۱۴۰۵/۰۸/۲۴",
    comment: "تحویل اکانت خیلی سریع انجام شد و بدون نیاز به هیچ اطلاعات حساسی اکانت اختصاصی برام فعال شد. پشتیبانی با حوصله نحوه اتصال رو توضیح دادن.",
  },
  {
    name: "احسان ک.",
    role: "خریدار اشتراک تلگرام پرمیوم گیفتی",
    rating: 5,
    date: "۱۴۰۵/۰۸/۲۶",
    comment: "گیفت تلگرام ظرف کمتر از ۵ دقیقه بعد از ثبت سفارش مستقیماً روی آیدیم نشست بدون اینکه نیاز به پسورد یا دسترسی باشه. واقعاً عالی بود.",
  },
  {
    name: "مهرداد ف.",
    role: "خریدار پلنر هوشمند گوگل‌شیت (Deluxe)",
    rating: 5,
    date: "۱۴۰۵/۰۸/۱۹",
    comment: "کامل‌ترین پلنری بود که تا حالا دیدم؛ بخش ردیاب عادات و داشبورد کنترل مالی واقعاً نظم روزمره‌م رو متحول کرد. دسترسی دائمیش هم عالیه.",
  },
  {
    name: "نیلوفر ر.",
    role: "خریدار اشتراک کانوا پرو (Canva Pro)",
    rating: 5,
    date: "۱۴۰۵/۰۸/۲۷",
    comment: "لینک دعوت تیمی روی ایمیل شخصیم اومد و تمام امکانات مجیک استودیو، فونت فارسی و دانلود طرح‌ها بدون واترمارک باز شد. ممنون از قیمت خوبتون.",
  },
];

export function Trust() {
  return (
    <Section
      id="trust"
      title="نظرات مشتریان و آمار اعتماد"
      subtitle="تجربه خریداران و آمار ثبت‌شده فروشگاه وایچ؛ شفافیت بالاترین اولویت ماست."
    >
      {/* 1. Trust Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-12">
        {STATS.map((s) => (
          <div
            key={s.label}
            className="flex flex-col items-center justify-center text-center rounded-3xl border border-border/80 bg-card/70 p-4 sm:p-5 shadow-xs hover:border-primary/40 transition-colors"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-secondary/80 border border-border/70 mb-2.5">
              {s.icon}
            </span>
            <p className="gradient-text font-mono text-xl sm:text-2xl font-black">
              {s.value}
            </p>
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
        {CUSTOMER_REVIEWS.map((r) => (
          <div
            key={r.name + r.role}
            className="flex flex-col justify-between rounded-3xl border border-border/80 bg-card/60 p-4 sm:p-5 shadow-xs hover:border-primary/40 hover:shadow-lg transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-1">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-[10px] font-mono text-muted-foreground">
                  {toPersianDigits(r.date)}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] leading-6 text-foreground/90 font-medium line-clamp-4">
                «{r.comment}»
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between gap-2">
              <div>
                <span className="text-xs sm:text-sm font-black text-foreground block">
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
