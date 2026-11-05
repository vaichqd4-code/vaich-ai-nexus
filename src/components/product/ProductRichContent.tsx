import { toPersianDigits, type Product } from "@/lib/products";
import {
  Check,
  X,
  Sparkles,
  TrendingUp,
  Brain,
  ShieldCheck,
  Zap,
  Laptop,
  CalendarCheck,
  BarChart3,
  Flame,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
  FolderGit2,
  Lock,
} from "lucide-react";

interface ProductRichContentProps {
  product: Product;
  isPlanner: boolean;
  isLifetime: boolean;
}

export function ProductRichContent({ product, isPlanner, isLifetime }: ProductRichContentProps) {
  const isChatGPT = product.slug.includes("chatgpt");
  const isClaude = product.slug.includes("claude");
  const isGemini = product.slug.includes("gemini");

  if (isPlanner) {
    return (
      <section className="mt-14 space-y-12 border-t border-border/80 pt-10">
        {/* ۱. معرفی جامع و عمیق محصول با ساختار سئو شده */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>معرفی جامع سیستم برنامه‌ریزی هوشمند وایچ</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            چرا پلنر دیجیتال گوگل‌شیت، موثرترین ابزار برای شکست اهمال‌کاری و مدیریت زمان است؟
          </h2>

          <p className="text-sm sm:text-base leading-8 text-muted-foreground">
            اکثر افراد سال جدید یا هر ماه را با انگیزه بالا و خرید دفترهای کاغذی گران‌قیمت شروع می‌کنند، اما بعد از چند روز دفترها خاک می‌خورند و دوباره در چرخه سردرگمی، فراموشی کارها و استرس عقب‌ماندن گرفتار می‌شوند. مشکل از تنبلی یا بی‌استعدادی شما نیست؛ مشکل از ابزارهای تاریخ‌گذشته و ساکنی است که هیچ تعاملی با ذهن مدرن ما ندارند.
          </p>

          <p className="text-sm sm:text-base leading-8 text-muted-foreground">
            <strong>پلنر هوشمند زندگی VAICH</strong> بر بستر امن گوگل‌شیت (Google Sheets) طراحی شده است تا به عنوان یک دستیار برنامه‌ریزی هوشمند، بدون نیاز به نصب هیچ نرم‌افزار سنگین یا خرید اشتراک ماهانه، روی گوشی، تبلت و لپ‌تاپ همیشه همراه شما باشد. این پلنر با ردیاب خودکار عادات، محاسبه لحظه‌ای درصد پیشرفت و نمایش نمودارهای تحلیلی، دوپامین طبیعی حاصل از تیک‌زدن اهداف را در مغز شما آزاد کرده و عادت‌های خوب را به بخشی جدانشدنی از روزمرگی‌تان تبدیل می‌کند.
          </p>
        </div>

        {/* ۲. کارت‌های ویژگی مرحله‌به‌مرحله و کاربردهای عملی */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 transition-all hover:border-primary/50 hover:bg-secondary/40 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">ردیاب عادات ماهانه با فرمول خودکار</h3>
            <p className="text-xs leading-6 text-muted-foreground">
              با وارد کردن عادات روزمره (ورزش، مطالعه، آب‌خوردن، مدیتیشن)، فرمول‌های ریاضی درصد موفقیت هر روز و هر هفته را به صورت لحظه‌ای محاسبه و با رنگ‌های پویا نمایش می‌دهند.
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 transition-all hover:border-primary/50 hover:bg-secondary/40 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">نمودارهای تحلیلی و انگیزشی ۲بعدی و ۳بعدی</h3>
            <p className="text-xs leading-6 text-muted-foreground">
              مشاهده روند رشد شخصی در قالب چارت‌های گرافیکی چشم‌نواز؛ ذهن شما با دیدن نمودارهای صعودی پیشرفت خود، انگیزه درونی فوق‌العاده‌ای برای تداوم پیدا می‌کند.
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 transition-all hover:border-primary/50 hover:bg-secondary/40 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neon-blue/10 border border-neon-blue/20 text-neon-blue">
              <Laptop className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">همگام‌سازی ابری و دسترسی روی تمام دستگاه‌ها</h3>
            <p className="text-xs leading-6 text-muted-foreground">
              فایل در اکانت شخصی گوگل درایو خودتان ذخیره می‌شود. صبح‌ها کارها را روی لپ‌تاپ چک کنید و در طول روز با گوشی همراه عادات‌تان را تیک بزنید؛ همیشه به‌روز و در دسترس.
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 transition-all hover:border-primary/50 hover:bg-secondary/40 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300">
              <Flame className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">ویژه کنکور، امتحانات و رشد شغلی</h3>
            <p className="text-xs leading-6 text-muted-foreground">
              دارای جداول هدف‌گذاری هوشمند بر اساس متد SMART، ثبت ساعت مطالعه روزانه و مدیریت پروژه‌های کاری؛ بدون شلوغی‌های اضافه برای تمرکز صددرصدی روی اولویت‌ها.
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 transition-all hover:border-primary/50 hover:bg-secondary/40 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">مالکیت دائمی و بدون اشتراک ماهانه</h3>
            <p className="text-xs leading-6 text-muted-foreground">
              برخلاف اپلیکیشن‌های خارجی که ماهیانه چندین دلار اشتراک طلب می‌کنند، این پلنر با یک‌بار پرداخت برای همیشه متعلق به شماست و نیازی به هیچ تمدیدی ندارد.
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 transition-all hover:border-primary/50 hover:bg-secondary/40 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">راه‌اندازی فوری در ۳ دقیقه با راهنمای فارسی</h3>
            <p className="text-xs leading-6 text-muted-foreground">
              بلافاصله پس از پرداخت، لینک اختصاصی کپی (Make a Copy) در گوگل درایو برای شما باز می‌شود و همراه با وویس و ویدیوی راهنما در کمتر از ۳ دقیقه شیت شما آماده کار است.
            </p>
          </div>
        </div>

        {/* ۳. جدول مقایسه حرفه‌ای: پلنر دیجیتال وایچ در برابر دفاتر کاغذی و اپلیکیشن‌ها */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              جدول مقایسه: پلنر دیجیتال هوشمند وایچ در برابر روش‌های سنتی و اپلیکیشن‌ها
            </h3>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-secondary/50 text-foreground font-bold">
                  <th className="p-3.5 sm:p-4">ویژگی و امکانات</th>
                  <th className="p-3.5 sm:p-4 text-emerald-400 font-black">پلنر هوشمند وایچ</th>
                  <th className="p-3.5 sm:p-4 text-muted-foreground font-medium">دفاتر برنامه‌ریزی کاغذی</th>
                  <th className="p-3.5 sm:p-4 text-muted-foreground font-medium">اپلیکیشن‌های خارجی (Notion/Todoist)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted-foreground">
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">هزینه و نوع پرداخت</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">یک‌بار پرداخت برای دسترسی همیشگی</td>
                  <td className="p-3.5 sm:p-4">خرید مکرر سالانه و فصلی (گران)</td>
                  <td className="p-3.5 sm:p-4">اشتراک دلاری ماهانه و گران</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">محاسبه خودکار درصد پیشرفت</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">
                    <span className="inline-flex items-center gap-1"><Check className="h-4 w-4 text-emerald-400" /> صددرصد خودکار با فرمول</span>
                  </td>
                  <td className="p-3.5 sm:p-4">
                    <span className="inline-flex items-center gap-1"><X className="h-4 w-4 text-rose-500" /> غیرممکن (نیاز به محاسبه دستی)</span>
                  </td>
                  <td className="p-3.5 sm:p-4">پیچیده و نیازمند فرمول‌نویسی</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">دسترسی و همگام‌سازی ابری</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">
                    <span className="inline-flex items-center gap-1"><Check className="h-4 w-4 text-emerald-400" /> همزمان روی گوشی، تبلت و کامپیوتر</span>
                  </td>
                  <td className="p-3.5 sm:p-4">
                    <span className="inline-flex items-center gap-1"><X className="h-4 w-4 text-rose-500" /> فقط نسخه فیزیکی (سنگین و حجیم)</span>
                  </td>
                  <td className="p-3.5 sm:p-4">نیاز به قندشکن و اتصال دائمی</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">نمودارهای تحلیلی و بصری</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">
                    <span className="inline-flex items-center gap-1"><Check className="h-4 w-4 text-emerald-400" /> چارت‌های زنده ۲بعدی و ۳بعدی متالیک</span>
                  </td>
                  <td className="p-3.5 sm:p-4">
                    <span className="inline-flex items-center gap-1"><X className="h-4 w-4 text-rose-500" /> ندارد</span>
                  </td>
                  <td className="p-3.5 sm:p-4">محدود در نسخه‌های رایگان</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">امنیت داده‌ها و حفظ اطلاعات</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">
                    <span className="inline-flex items-center gap-1"><Check className="h-4 w-4 text-emerald-400" /> ذخیره مستقیم در گوگل درایو اختصاصی شما</span>
                  </td>
                  <td className="p-3.5 sm:p-4">خطر گم‌شدن یا خیس‌شدن دفتر</td>
                  <td className="p-3.5 sm:p-4">ذخیره در سرورهای خارجی با خطر تحریم</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">راهنمای فارسی و پشتیبانی</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">
                    <span className="inline-flex items-center gap-1"><Check className="h-4 w-4 text-emerald-400" /> پشتیبانی مستقیم تلگرام و فایل راهنما</span>
                  </td>
                  <td className="p-3.5 sm:p-4">بدون پشتیبانی</td>
                  <td className="p-3.5 sm:p-4">انگلیسی بدون پشتیبانی در ایران</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ۴. مراحل ساده استفاده در ۳ گام */}
        <div className="rounded-3xl border border-primary/30 bg-linear-to-b from-primary/10 via-secondary/20 to-card p-6 sm:p-8 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-lg sm:text-xl font-black text-foreground">
              مسیر ساده شروع برنامه‌ریزی و تحویل آنی فایل
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              تنها ۳ مرحله کوتاه تا راه‌اندازی پلنر شخصی خود فاصله دارید
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-2 text-center">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-black text-sm">
                ۱
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground">تکمیل سفارش</h4>
              <p className="text-[11px] leading-5 text-muted-foreground">
                اطلاعات خود را وارد کرده و پرداخت را تکمیل کنید.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-2 text-center">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-black text-sm">
                ۲
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground">دریافت آنی لینک کپی</h4>
              <p className="text-[11px] leading-5 text-muted-foreground">
                لینک اختصاصی کپی شیت در اکانت گوگل درایو بلافاصله در دسترس شماست.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-2 text-center">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary font-black text-sm">
                ۳
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground">شروع برنامه‌ریزی</h4>
              <p className="text-[11px] leading-5 text-muted-foreground">
                با فایل راهنما اهداف‌تان را وارد کنید و از نظم و پیشرفت‌تان لذت ببرید.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // محتوای عمیق و تخصصی برای اشتراک‌های هوش مصنوعی (ChatGPT, Claude, Gemini)
  return (
    <section className="mt-14 space-y-12 border-t border-border/80 pt-10">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
          <Brain className="h-3.5 w-3.5" />
          <span>بررسی تخصصی و راهنمای خرید اشتراک قانونی</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
          همه چیز درباره اشتراک قانونی {product.name}؛ ویژگی‌ها، مزایا و کاربردهای واقعی
        </h2>

        <p className="text-sm sm:text-base leading-8 text-muted-foreground">
          استفاده از هوش مصنوعی در سال ۲۰۲۶ دیگر یک تفریح نیست، بلکه تبدیل به اصلی‌ترین ابزار افزایش سرعت کار، کدنویسی، مقاله‌نویسی و تحقیقات دانشگاهی شده است. با این حال نسخه‌های رایگان ابزارهای هوش مصنوعی به دلیل محدودیت‌های شدید متنی، قطعی مکرر در زمان ترافیک بالا و عدم دسترسی به مدل‌های عمیق تحلیلی، بازدهی لازم را به کاربران حرفه‌ای نمی‌دهند.
        </p>

        <p className="text-sm sm:text-base leading-8 text-muted-foreground">
          در فروشگاه وایچ، اشتراک <strong>{product.name}</strong> به صورت کاملاً قانونی، با پایداری تضمین‌شده و بدون قطعی ارائه می‌شود تا با خیالی آسوده از به‌روزترین مدل‌ها و ابزارهای صوتی، تحلیلی و تصویری استفاده کنید.
        </p>
      </div>

      {/* ۳ کارت ویژگی متناسب با ابزار */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 transition-all hover:border-primary/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
            <Zap className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-foreground">دسترسی به قدرتمندترین مدل‌های استدلالی</h3>
          <p className="text-xs leading-6 text-muted-foreground">
            {isChatGPT
              ? "دسترسی نامحدود به GPT-4o و مدل‌های حل مسائل پیچیده ریاضی و برنامه‌نویسی o1 و o3-mini."
              : isClaude
              ? "استفاده از قدرتمندترین مدل هوش مصنوعی برای کدنویسی و درک اسناد پیچیده: Claude 3.5 Sonnet."
              : "مدل‌های عمیق تحلیلی Gemini 1.5 Pro با درک همزمان صوت، تصویر، ویدیو و فایل‌های حجیم."}
          </p>
        </div>

        <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 transition-all hover:border-primary/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <TrendingUp className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-foreground">افزایش چشمگیر ظرفیت و سرعت پاسخگویی</h3>
          <p className="text-xs leading-6 text-muted-foreground">
            پاسخ‌دهی بدون مکث در ساعات شلوغی سرورها با حداقل ۵ برابر محدودیت پیام بیشتر نسبت به اکانت رایگان.
          </p>
        </div>

        <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 transition-all hover:border-primary/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-foreground">گارانتی سلامت کامل و تحویل سریع</h3>
          <p className="text-xs leading-6 text-muted-foreground">
            فعال‌سازی بدون نیاز به پسورد ایمیل یا با بهترین پایداری؛ تحت پوشش کامل گارانتی سلامت اکانت در سراسر دوره.
          </p>
        </div>
      </div>

      {/* جدول مقایسه نسخه رایگان با اشتراک حرفه‌ای در وایچ */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            جدول مقایسه: اشتراک اختصاصی {product.name} در وایچ در برابر نسخه رایگان
          </h3>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border/80 bg-secondary/50 text-foreground font-bold">
                <th className="p-3.5 sm:p-4">ویژگی</th>
                <th className="p-3.5 sm:p-4 text-emerald-400 font-black">اشتراک حرفه‌ای در وایچ</th>
                <th className="p-3.5 sm:p-4 text-muted-foreground font-medium">نسخه رایگان</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-muted-foreground">
              <tr className="hover:bg-secondary/20 transition-colors">
                <td className="p-3.5 sm:p-4 font-semibold text-foreground">مدل‌های هوش مصنوعی فعال</td>
                <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">پیشرفته‌ترین مدل‌های تحلیلی و استدلالی</td>
                <td className="p-3.5 sm:p-4">مدل‌های پایه با قدرت تفکر کمتر</td>
              </tr>
              <tr className="hover:bg-secondary/20 transition-colors">
                <td className="p-3.5 sm:p-4 font-semibold text-foreground">سقف ارسال پیام و تحلیل فایل</td>
                <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">حداکثر ظرفیت بدون محدودیت‌های آزاردهنده</td>
                <td className="p-3.5 sm:p-4">بسیار محدود (قفل شدن بعد از چند پیام)</td>
              </tr>
              <tr className="hover:bg-secondary/20 transition-colors">
                <td className="p-3.5 sm:p-4 font-semibold text-foreground">سرعت پاسخ در زمان‌های شلوغی</td>
                <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">اولویت اول سرور و پاسخگویی آنی</td>
                <td className="p-3.5 sm:p-4">کاهش سرعت یا خطای در دسترس نبودن</td>
              </tr>
              <tr className="hover:bg-secondary/20 transition-colors">
                <td className="p-3.5 sm:p-4 font-semibold text-foreground">ابزارهای تکمیلی (صوت، تصویر، کد)</td>
                <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">دسترسی کامل به ادیتور کد، Canvas و مدل‌های صوتی</td>
                <td className="p-3.5 sm:p-4">غیرفعال یا شدیداً محدود</td>
              </tr>
              <tr className="hover:bg-secondary/20 transition-colors">
                <td className="p-3.5 sm:p-4 font-semibold text-foreground">پشتیبانی و گارانتی تعویض</td>
                <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">پشتیبانی تلگرام و ضمانت سلامت اکانت</td>
                <td className="p-3.5 sm:p-4">بدون پشتیبانی</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
