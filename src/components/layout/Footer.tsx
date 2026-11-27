import { ShoppingBag, BookOpen, ShieldCheck, Headphones, ExternalLink, ShieldAlert, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import {
  CONTACT_INSTAGRAM_URL,
  CONTACT_PHONE,
  CONTACT_PHONE_PERSIAN,
  CONTACT_TELEGRAM_URL,
} from "@/components/brand/ContactLinks";
import { toPersianDigits, useDynamicProducts } from "@/lib/products";

const navigationColumns = [
  {
    title: "محصولات و اشتراک‌ها",
    links: [
      { to: "/products/telegram-premium", label: "خرید اشتراک تلگرام پرمیوم" },
      { to: "/products/telegram-stars", label: "خرید استارز تلگرام فوری" },
      { to: "/products/canva-pro", label: "خرید اشتراک کانوا پرو (Canva Pro)" },
      { to: "/products/chatgpt-plus", label: "خرید اکانت قانونی ChatGPT Plus" },
      { to: "/products/claude", label: "خرید اکانت قانونی Claude Pro" },
      { to: "/products/gemini", label: "خرید اشتراک Gemini Pro دوماهه" },
      { to: "/products/gemini-pro", label: "خرید اشتراک Gemini Pro ۱۸ ماهه" },
      { to: "/products/vaich-life-planner", label: "خرید پلنر لایفاستایل هوشمند" },
      { to: "/products/vaich-study-planner", label: "خرید پلنر تحصیلی وایچ (جدید)" },
    ],
  },
  {
    title: "دسترسی سریع و آموزش",
    links: [
      { to: "/products", label: "کاتالوگ کامل محصولات و قیمت‌ها" },
      { to: "/blog", label: "مجله و مقالات تخصصی AI" },
      { to: "/why", label: "راهنمای خرید و چرا VAICH" },
      { to: "/faq", label: "سوالات متداول مشتریان" },
      { to: "/support", label: "پشتیبانی آنلاین و مشاوره" },
    ],
  },
  {
    title: "قوانین و نمادهای اعتماد",
    links: [
      { to: "/terms", label: "قوانین و ضمانت فعال‌سازی" },
      { to: "/terms#refund", label: "رویه بازگشت وجه (مواد ۳۷ و ۳۸)" },
      { to: "/support#complaints", label: "ثبت و پیگیری شکایات (پاسخ < ۴۸ ساعت)" },
      { to: "/privacy", label: "حفظ حریم خصوصی کاربران" },
    ],
  },
];

function getDynamicShamsiYear(): string {
  try {
    const parts = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      timeZone: "Asia/Tehran",
    }).formatToParts(new Date());
    const yearPart = parts.find((p) => p.type === "year")?.value;
    if (yearPart) return yearPart;
  } catch {
    // Fallback below
  }
  const gYear = new Date().getFullYear();
  return toPersianDigits(gYear - 621);
}

export function Footer() {
  const { instagramUrl } = useDynamicProducts();
  const activeInstagram = instagramUrl || CONTACT_INSTAGRAM_URL;
  const currentShamsiYear = getDynamicShamsiYear();

  const socials = [
    {
      label: "اینستاگرام",
      href: activeInstagram,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
      ),
    },
    {
      label: "تلگرام",
      href: CONTACT_TELEGRAM_URL,
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
        </svg>
      ),
    },
  ];

  return (
    <footer className="mt-24 border-t border-border/70 bg-surface/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-7 text-muted-foreground">
            VAICH مرجع تخصصی خدمات دیجیتالی و اشتراک‌های قانونی هوش مصنوعی؛ شفاف، با تحویل سریع، تضمین اصالت و پشتیبانی اختصاصی ۲۴ ساعته.
          </p>
          <div className="space-y-1.5 text-xs text-muted-foreground">
            <p>
              <span className="font-semibold text-foreground">تلفن پشتیبانی:</span>{" "}
              <a href={`tel:${CONTACT_PHONE}`} className="font-bold text-foreground hover:text-neon-blue transition-colors" dir="ltr">
                {CONTACT_PHONE_PERSIAN}
              </a>
            </p>
            <p>
              <span className="font-semibold text-foreground">ایمیل سازمانی:</span>{" "}
              <a href="mailto:support@vaich.ir" className="hover:text-foreground transition-colors" dir="ltr">
                support@vaich.ir
              </a>
            </p>
            <p className="text-[11px] text-muted-foreground/80 leading-5">
              ساعات پاسخگویی تلفنی: شنبه تا پنج‌شنبه ۹ الی ۲۱ (پشتیبانی آنلاین و چت: ۲۴ ساعته ۷ روز هفته)
            </p>
          </div>
          <ul className="flex gap-2 pt-1">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-neon-blue/50 hover:text-foreground"
                >
                  {s.icon}
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {navigationColumns.map((col) => (
          <details
            key={col.title}
            open
            className="group md:open border-b border-border/50 md:border-none py-3 md:py-0"
          >
            <summary className="flex cursor-pointer md:cursor-default list-none items-center justify-between text-sm font-bold text-foreground">
              <span>{col.title}</span>
              <span className="md:hidden text-muted-foreground transition-transform duration-200 group-open:rotate-180">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </summary>
            <ul className="space-y-2.5 pt-2.5 md:pt-4">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to as any}
                    className="text-xs sm:text-sm text-muted-foreground transition-colors hover:text-foreground inline-block py-0.5"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>

      {/* Enamad 5-Star Trust & Compliance Section */}
      <div className="border-t border-border/60 bg-card/40 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-[1.5fr_1fr] items-center">
            {/* Legal Statement & Complaints Notice */}
            <div className="space-y-2 text-right">
              <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span>ضمانت اصالت، شفافیت حقوقی و امنیت خرید در VAICH</span>
              </div>
              <p className="text-[12px] leading-6 text-muted-foreground">
                کلیه فعالیت‌های فروشگاه اینترنتی وایچ (VAICH) تابع قوانین و مقررات جمهوری اسلامی ایران و قانون تجارت الکترونیک است. در راستای ماده ۲۵ آیین‌نامه اجرایی قانون تجارت الکترونیک، شکایات ثبت‌شده در سامانه رسیدگی به شکایات سایت ظرف کمتر از ۴۸ ساعت کاری بررسی و پاسخ داده خواهند شد.
              </p>
              <div className="flex flex-wrap gap-4 pt-1 text-[11px]">
                <Link to="/support" hash="complaints" className="text-primary hover:underline font-semibold flex items-center gap-1">
                  <span>سامانه آنلاین ثبت و پیگیری شکایات</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
                <span className="text-border">|</span>
                <Link to="/terms" hash="refund" className="text-muted-foreground hover:text-foreground transition-colors">
                  رویه شفاف انصراف از خرید و بازگشت وجه (ماده ۳۷ و ۳۸)
                </Link>
              </div>
            </div>

            {/* Official Enamad Trust Seal Badge */}
            <div className="flex items-center justify-center md:justify-end">
              <div
                className="flex items-center justify-center rounded-2xl border border-border/80 bg-white dark:bg-card p-3 shadow-xs hover:border-primary/50 transition-all min-w-[110px] min-h-[110px]"
                dangerouslySetInnerHTML={{
                  __html: `<a referrerpolicy='origin' target='_blank' href='https://trustseal.enamad.ir/?id=8384738&Code=uheWuqQQ5oUE4yf9V0AiQ0sdFaLdLhdP' title='نماد اعتماد الکترونیکی (اینماد)'><img referrerpolicy='origin' src='/enamad-logo.png' width='90' height='90' alt='نماد اعتماد الکترونیکی (اینماد)' style='cursor:pointer; max-height: 90px; width: auto; display: block;' code='uheWuqQQ5oUE4yf9V0AiQ0sdFaLdLhdP'></a>`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-border/70 px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        © {currentShamsiYear} VAICH — تمامی حقوق مادی و معنوی برای فروشگاه اینترنتی وایچ محفوظ است.
      </div>
    </footer>
  );
}
