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
  Clock,
  Layers,
  HelpCircle,
  Lock,
  Code,
  FolderGit2,
  Cpu,
  FileText,
  MessageSquare,
  Search,
  Mic,
  Palette,
  ExternalLink,
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

  // ==========================================
  // ۱. پلنر دیجیتال زندگی و ردیاب عادات (گوگل شیت)
  // ==========================================
  if (isPlanner) {
    return (
      <section className="mt-14 space-y-12 border-t border-border/80 pt-10">
        {/* معرفی جامع و عمیق محصول با ساختار سئو شده */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5" />
            <span>معرفی علمی سیستم مدیریت زمان و ردیاب عادات وایچ</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            چرا پلنر دیجیتال گوگل‌شیت، موثرترین ابزار برای غلبه بر اهمال‌کاری و مدیریت زمان است؟
          </h2>

          <p className="text-sm sm:text-base leading-8 text-muted-foreground">
            اکثر افراد سال جدید یا شروع هر ماه را با انگیزه بالا و خرید دفاتر کاغذی پر زرق‌وبرق آغاز می‌کنند؛ اما به دلیل اصطکاک بالای یادداشت دستی، خط‌خوردگی‌های مکرر و عدم محاسبه خودکار بازدهی، خیلی زود دلسرد می‌شوند. مشکل از تنبلی یا ضعف اراده نیست؛ بلکه ذهن مدرن نیازمند ابزاری پویا، با تعامل بصری فوری و ساختاریافته است.
          </p>

          <p className="text-sm sm:text-base leading-8 text-muted-foreground">
            <strong>پلنر هوشمند زندگی VAICH</strong> بر بستر امن و ابری گوگل‌شیت (Google Sheets) طراحی شده است تا به عنوان یک سیستم خودکار مدیریت زندگی، بدون نیاز به نصب نرم‌افزارهای سنگین یا پرداخت اشتراک ماهانه، روی گوشی (اندروید و آیفون)، تبلت و لپ‌تاپ همراه شما باشد. این پلنر با ردیاب عادات مبتنی بر روانشناسی رفتار، فرمول‌های داینامیک محاسبه درصد موفقیت و نمودارهای پیشرفت، انضباط شخصی را از یک تکلیف سخت به یک تجربه تعاملی و لذت‌بخش تبدیل می‌کند.
          </p>
        </div>

        {/* ۶ کارت ویژگی مرحله‌به‌مرحله و کاربردهای عملی */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 transition-all hover:border-primary/50 hover:bg-secondary/40 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <CalendarCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">ردیاب عادات ماهانه با فرمول‌های داینامیک</h3>
            <p className="text-xs leading-6 text-muted-foreground">
              با ثبت تیک روزانه برای هر عادت (ورزش، مطالعه، آب خوردن، یادگیری زبان)، فرمول‌های ریاضی درصد پایبندی هر روز و هر هفته را به صورت لحظه‌ای محاسبه و با رنگ‌های پویا نشان می‌دهند.
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 transition-all hover:border-primary/50 hover:bg-secondary/40 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <BarChart3 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">نمودارهای تحلیلی و انگیزشی ۲بعدی و ۳بعدی</h3>
            <p className="text-xs leading-6 text-muted-foreground">
              مشاهده روند رشد شخصی در قالب ۲ تمپلیت مجزا: تم تعاملی و مدرن ۳بعدی (3D Deluxe) و تم خلوت مینیمال ۲بعدی برای تمرکز بدون حواس‌پرتی روی اهداف.
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 transition-all hover:border-primary/50 hover:bg-secondary/40 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neon-blue/10 border border-neon-blue/20 text-neon-blue">
              <Laptop className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">همگام‌سازی ابری و دسترسی روی تمام دستگاه‌ها</h3>
            <p className="text-xs leading-6 text-muted-foreground">
              فایل در اکانت شخصی گوگل درایو خودتان ذخیره می‌شود. صبح‌ها کارها را روی کامپیوتر مرور کنید و در طول روز با گوشی کارها را علامت بزنید؛ همیشه به‌روز و ایمن.
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 transition-all hover:border-primary/50 hover:bg-secondary/40 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300">
              <Flame className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">ماتریس آیزنهاور و هدف‌گذاری هوشمند SMART</h3>
            <p className="text-xs leading-6 text-muted-foreground">
              تفکیک وظایف بر اساس فوریت و اهمیت واقعی برای جلوگیری از اتلاف انرژی روی امور حاشیه‌ای و تضمین پیشرفت روزانه در پروژه‌های تحصیلی، کنکور و رشد شغلی.
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 transition-all hover:border-primary/50 hover:bg-secondary/40 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">مالکیت مادام‌العمر و بدون اشتراک ماهانه</h3>
            <p className="text-xs leading-6 text-muted-foreground">
              برخلاف اشتراک‌های نرم‌افزارهای خارجی، این پلنر با یک‌بار خرید برای همیشه متعلق به شماست و هیچ هزینه تمدید، شارژ مجدد یا اشتراک سالانه‌ای ندارد.
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 transition-all hover:border-primary/50 hover:bg-secondary/40 shadow-xs">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Clock className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">راه‌اندازی فوری در ۳ دقیقه با راهنمای فارسی</h3>
            <p className="text-xs leading-6 text-muted-foreground">
              بلافاصله پس از پرداخت، لینک اختصاصی کپی (Make a Copy) در گوگل درایو در دسترس شماست و همراه با وویس و ویدیوی راهنما در کمتر از ۳ دقیقه شیت آماده استفاده است.
            </p>
          </div>
        </div>

        {/* جدول مقایسه حرفه‌ای: پلنر دیجیتال وایچ در برابر دفاتر کاغذی و اپلیکیشن‌ها */}
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
                  <th className="p-3.5 sm:p-4">معیار مقایسه</th>
                  <th className="p-3.5 sm:p-4 text-emerald-400 font-black">پلنر هوشمند وایچ</th>
                  <th className="p-3.5 sm:p-4 text-muted-foreground font-medium">دفاتر برنامه‌ریزی کاغذی</th>
                  <th className="p-3.5 sm:p-4 text-muted-foreground font-medium">اپلیکیشن‌های خارجی (Notion/Todoist)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted-foreground">
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">هزینه و نوع پرداخت</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">یک‌بار پرداخت برای دسترسی دائمی</td>
                  <td className="p-3.5 sm:p-4">خرید مداوم فصلی و سالانه</td>
                  <td className="p-3.5 sm:p-4">اشتراک دلاری ماهانه و گران</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">محاسبه خودکار درصد پیشرفت</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">
                    <span className="inline-flex items-center gap-1"><Check className="h-4 w-4 text-emerald-400" /> صددرصد خودکار با فرمول‌های شیت</span>
                  </td>
                  <td className="p-3.5 sm:p-4">
                    <span className="inline-flex items-center gap-1"><X className="h-4 w-4 text-rose-500" /> غیرممکن (نیاز به محاسبه دستی)</span>
                  </td>
                  <td className="p-3.5 sm:p-4">نیازمند فرمول‌نویسی پیچیده شخصی</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">همگام‌سازی ابری روی تمام دستگاه‌ها</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">
                    <span className="inline-flex items-center gap-1"><Check className="h-4 w-4 text-emerald-400" /> همگام لحظه‌ای در اکانت گوگل</span>
                  </td>
                  <td className="p-3.5 sm:p-4">
                    <span className="inline-flex items-center gap-1"><X className="h-4 w-4 text-rose-500" /> فقط نسخه فیزیکی همراه‌تان</span>
                  </td>
                  <td className="p-3.5 sm:p-4">نیاز به دسترسی پایدار و حساب خارجی</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">نمودارهای بصری و ردیاب عادات</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">
                    <span className="inline-flex items-center gap-1"><Check className="h-4 w-4 text-emerald-400" /> چارت‌های خودکار ۲بعدی و ۳بعدی</span>
                  </td>
                  <td className="p-3.5 sm:p-4">
                    <span className="inline-flex items-center gap-1"><X className="h-4 w-4 text-rose-500" /> ندارد</span>
                  </td>
                  <td className="p-3.5 sm:p-4">امکانات بصری محدود در طرح رایگان</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">امنیت داده‌ها و حریم خصوصی</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">
                    <span className="inline-flex items-center gap-1"><Check className="h-4 w-4 text-emerald-400" /> ذخیره مستقیم در گوگل درایو شخصی</span>
                  </td>
                  <td className="p-3.5 sm:p-4">خطر مفقودی یا آسیب فیزیکی</td>
                  <td className="p-3.5 sm:p-4">ذخیره روی سرورهای ابری ناشناس</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ۴ سوال متداول خریداران پلنر */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              پاسخ به سوالات پرتکرار خریداران پلنر وایچ
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-foreground">آیا برای استفاده به نرم‌افزار مایکروسافت اکسل نیاز دارم؟</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                خیر؛ این فایل کاملاً تحت بستر رایگان گوگل شیتس (Google Sheets) توسعه داده شده و تنها با یک مرورگر وب یا اپلیکیشن رایگان گوگل شیت روی موبایل باز می‌شود.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-foreground">چگونه پلنر را برای ماه یا سال بعد مجدداً استفاده کنم؟</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                یک دکمه پاکسازی هوشمند در فایل تعبیه شده است. همچنین لینک کپی اولیه همواره در اختیارتان است و می‌توانید هر تعداد نسخه کپی جدید که بخواهید در درایو خود بسازید.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-foreground">اگر دستم بخورد و فرمولی پاک شود چه کار کنم؟</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                گوگل شیت دارای تاریخچه تغییرات (Version History) است و با ۲ کلیک به لحظه قبل بازمی‌گردد. علاوه بر این، پشتیبانی تلگرام وایچ آماده راهنمایی و حل هرگونه مشکل است.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-foreground">آیا بدون اینترنت هم می‌توانم کارها را علامت بزنم؟</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                بله؛ با فعال کردن گزینه دسترسی آفلاین (Available offline) در اپلیکیشن گوگل شیت موبایل یا کامپیوتر، بدون اتصال به اینترنت تغییرات ذخیره شده و پس از آنلاین شدن همگام می‌شوند.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // ۲. اشتراک قانونی ChatGPT Plus اختصاصی
  // ==========================================
  if (isChatGPT) {
    return (
      <section className="mt-14 space-y-12 border-t border-border/80 pt-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <Brain className="h-3.5 w-3.5" />
            <span>راهنمای خرید اشتراک قانونی ChatGPT Plus اختصاصی</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            بررسی جامع قابلیت‌های ChatGPT Plus؛ چرا نسخه پلاس برای متخصصان ضروری است؟
          </h2>

          <p className="text-sm sm:text-base leading-8 text-muted-foreground">
            در سال ۲۰۲۶، چت‌جی‌پی‌تی از یک چت‌بات ساده به یک دستیار جامع چندمنظوره تبدیل شده است. در حالی که نسخه رایگان با مدل‌های سبک‌تر و محدودیت‌های شدید متنی کار می‌کند، نسخه <strong>ChatGPT Plus</strong> دسترسی به قدرتمندترین مدل‌های استدلالی دنیا یعنی <strong>GPT-4o</strong>، <strong>o1</strong> و <strong>o3-mini</strong> را فراهم می‌آورد.
          </p>

          <p className="text-sm sm:text-base leading-8 text-muted-foreground">
            در وایچ، این اشتراک به صورت کاملاً اختصاصی و قانونی روی جیمیل یا ایمیل شخصی خودتان فعال می‌شود. این به معنای حفظ ۱۰۰٪ حریم خصوصی، عدم دسترسی افراد دیگر به چت‌ها و پروژه‌ها، و گارانتی کامل سلامت اکانت در طول دوره ۳۰ روزه است.
          </p>
        </div>

        {/* ۳ کارت ویژگی تخصصی */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 transition-all hover:border-primary/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">مدل‌های استدلالی عمیق o1 و o3-mini</h3>
            <p className="text-xs leading-6 text-muted-foreground">
              حل پیچیده‌ترین مسائل ریاضی، طراحی الگوریتم‌های نرم‌افزاری و بررسی ساختاری کدهای سنگین با توانایی تفکر گام‌به‌گام و بازبینی منطقی قبل از پاسخ.
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 transition-all hover:border-primary/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Mic className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">مکالمه صوتی طبیعی (Advanced Voice)</h3>
            <p className="text-xs leading-6 text-muted-foreground">
              گفتگوی صوتی آنی و بدون تأخیر با قابلیت تقلید لحن انسانی، یادگیری لهجه‌ها و قطع کردن صحبت هوش مصنوعی برای انتقال حس یک مشاور زنده و حاضر.
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 transition-all hover:border-primary/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Code className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">محیط تعاملی Canvas و اجرای پایتون</h3>
            <p className="text-xs leading-6 text-muted-foreground">
              ویرایش مشارکتی متون و برنامه‌ها در یک بوم دوطرفه، اجرای خودکار اسکریپت‌های پایتون برای تحلیل فایل‌های اکسل و رسم نمودارهای گرافیکی دقیق.
            </p>
          </div>
        </div>

        {/* جدول مقایسه نسخه رایگان با پلاس */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              جدول مقایسه: ChatGPT Plus اختصاصی در برابر اکانت رایگان
            </h3>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-secondary/50 text-foreground font-bold">
                  <th className="p-3.5 sm:p-4">ویژگی</th>
                  <th className="p-3.5 sm:p-4 text-emerald-400 font-black">ChatGPT Plus (وایچ)</th>
                  <th className="p-3.5 sm:p-4 text-muted-foreground font-medium">اکانت رایگان (Free)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted-foreground">
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">مدل‌های استدلالی (o1, o3-mini)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">فعال با اولویت دسترسی</td>
                  <td className="p-3.5 sm:p-4">غیرفعال یا محدود به چند پیام ساده</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">سقف پیام مدل GPT-4o</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">حداکثر سقف استاندارد جهانی (۸۰ پیام در ۳ ساعت)</td>
                  <td className="p-3.5 sm:p-4">بسیار محدود (حدود ۱۰ تا ۱۶ پیام)</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">حالت صوتی پیشرفته (Advanced Voice)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">دسترسی نامحدود روزانه بدون افت سرعت</td>
                  <td className="p-3.5 sm:p-4">محدود به تست چند دقیقه‌ای در ماه</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">محیط بوم کاری تعاملی (Canvas)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">فعال با امکان ادیت پاراگراف و ریفکتور کد</td>
                  <td className="p-3.5 sm:p-4">دسترسی بسیار محدود</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">تحلیل پیشرفته داده‌ها و کدهای پایتون</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">آپلود نامحدود فایل‌های حجیم و رسم چارت</td>
                  <td className="p-3.5 sm:p-4">حجم کم و محدودیت مکرر</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">حفظ حریم خصوصی و مالکیت اطلاعات</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">۱۰۰٪ شخصی روی ایمیل شما (بدون دسترسی شخص ثالث)</td>
                  <td className="p-3.5 sm:p-4">شخصی</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ۴ سوال متداول خریداران ChatGPT Plus */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              سوالات پرتکرار خریداران اکانت ChatGPT Plus
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-foreground">اکانت چگونه فعال‌سازی می‌شود؟ آیا رمز ایمیل نیاز است؟</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                خیر؛ به هیچ وجه نیازی به پسورد ایمیل شما نیست. پرداخت از طریق کارت‌های اعتباری بین‌المللی معتبر انجام شده و اشتراک مستقیماً بر روی آدرس جیمیل شما فعال می‌گردد.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-foreground">آیا خطر بن شدن یا مسدود شدن اکانت وجود دارد؟</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                به دلیل استفاده از پرداخت قانونی و بانکی معتبر، ریسک مسدودی تقریباً صفر است. با این حال تمام اکانت‌های وایچ تحت پوشش گارانتی سلامت کامل ۳۰ روزه هستند.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-foreground">آیا پیام‌های مدل‌های استدلالی o1 نامحدود است؟</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                شرکت OpenAI برای تمام کاربران پلاس در سراسر جهان سقف مصرف دوره‌ای اعمال می‌کند (به عنوان مثال سقف هفتگی برای o1). وایچ بالاترین سقف رسمی رسمی را بدون واسطه در اختیار شما می‌گذارد.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-foreground">برای اتصال به چت‌جی‌پی‌تی چه شرایطی نیاز است؟</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                به دلیل محدودیت‌های معمول دسترسی در ایران، استفاده از یک ابزار تغییر آی‌پی استاندارد و تمیز برای باز کردن سایت OpenAI پیشنهاد می‌شود.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // ۳. اشتراک قانونی Claude Pro اختصاصی
  // ==========================================
  if (isClaude) {
    return (
      <section className="mt-14 space-y-12 border-t border-border/80 pt-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <Brain className="h-3.5 w-3.5" />
            <span>راهنمای خرید اشتراک اختصاصی و قانونی Claude Pro</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            بررسی تخصصی Claude Pro؛ پادشاه برنامه‌نویسی و شیواترین لحن نگارش فارسی
          </h2>

          <p className="text-sm sm:text-base leading-8 text-muted-foreground">
            شرکت Anthropic با معرفی سری مدل‌های <strong>Claude 3.5 Sonnet</strong> و نسل جدید هیبریدی <strong>Claude 3.7 Sonnet</strong> استانداردهای دنیای هوش مصنوعی را بازتعریف کرده است. کلود پرو به انتخاب اول جامعه برنامه‌نویسان، طراحان فرانت‌اند و نویسندگان حرفه‌ای زبان فارسی در سال ۲۰۲۶ تبدیل شده است.
          </p>

          <p className="text-sm sm:text-base leading-8 text-muted-foreground">
            وایچ اشتراک Claude Pro را به صورت کاملاً قانونی و روی ایمیل شخصی شما فعال می‌کند تا از فضای ابری <strong>Projects</strong> با کانتکست ۲۰۰ هزار توکن و محیط زنده <strong>Artifacts</strong> نهایت استفاده را ببرید.
          </p>
        </div>

        {/* ۳ کارت ویژگی کلود پرو */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 transition-all hover:border-primary/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <Code className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">رتبه اول بنچمارک‌های مهندسی نرم‌افزار</h3>
            <p className="text-xs leading-6 text-muted-foreground">
              کلود ۳.۵ و ۳.۷ برترین نمرات را در بنچمارک SWE-bench کسب کرده‌اند؛ بازنویسی کدهای پیچیده، باگ‌یابی دقیق و درک ساختار پایگاه‌های داده در سطحی بی‌همتا.
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 transition-all hover:border-primary/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">طبیعی‌ترین و فاخرترین نثر زبان فارسی</h3>
            <p className="text-xs leading-6 text-muted-foreground">
              برخلاف لحن ماشینی و ترجمه‌ای دیگر مدل‌ها، کلود متون فارسی را با روانی، دایره واژگان غنی و ادراک دقیق ظرافت‌های دستوری تولید می‌کند.
            </p>
          </div>

          <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 transition-all hover:border-primary/50">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <FolderGit2 className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-bold text-foreground">پایگاه‌های دانش پروژه‌ای (Projects) و Artifacts</h3>
            <p className="text-xs leading-6 text-muted-foreground">
              بارگذاری ده‌ها فایل، کتاب و مستندات کد در یک پروژه مجزا با حافظه ۲۰۰ هزار توکنی و مشاهده مستقیم کدهای فرانت‌اند و نمودارها در پنل زنده آرتیفکت.
            </p>
          </div>
        </div>

        {/* جدول مقایسه کلود پرو با رایگان */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              جدول مقایسه: اشتراک اختصاصی Claude Pro در برابر نسخه رایگان
            </h3>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-secondary/50 text-foreground font-bold">
                  <th className="p-3.5 sm:p-4">ویژگی</th>
                  <th className="p-3.5 sm:p-4 text-emerald-400 font-black">Claude Pro (وایچ)</th>
                  <th className="p-3.5 sm:p-4 text-muted-foreground font-medium">نسخه رایگان کلود</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted-foreground">
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">مدل‌های فعال</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">Claude 3.5 Sonnet و Claude 3.7 Sonnet</td>
                  <td className="p-3.5 sm:p-4">دسترسی موقت به 3.5 Sonnet با سقف بسیار کوتاه</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">سقف ارسال پیام در هر نوبت کاری</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">حداقل ۵ برابر بیشتر از نسخه رایگان</td>
                  <td className="p-3.5 sm:p-4">قفل شدن سریع بعد از چند پیام تحلیلی</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">قابلیت Projects (پایگاه دانش اختصاصی)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">فعال با پنجره حافظه ۲۰۰ هزار توکنی</td>
                  <td className="p-3.5 sm:p-4">غیرفعال</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">رندر زنده محیط Artifacts</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">نامحدود برای React، Tailwind و SVG</td>
                  <td className="p-3.5 sm:p-4">محدود به ترافیک سرور</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">اولویت ترافیک در ساعات شلوغی سرور</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">پاسخگویی سریع بدون پیام خطای ظرفیت</td>
                  <td className="p-3.5 sm:p-4">توقف موقت یا نمایش خطای سرور پر است</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ۴ سوال متداول کلود پرو */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-primary" />
            <h3 className="text-base sm:text-lg font-bold text-foreground">
              پاسخ به سوالات پرتکرار خریداران Claude Pro
            </h3>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-foreground">آیا کلود پرو قابلیت ساخت تصویر (مثل DALL-E) دارد؟</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                خیر؛ شرکت آنتروپیک تمرکز خود را به طور کامل بر روی استدلال منطقی، تحلیل کد و نگارش متون گذاشته است. با این حال کلود کدهای وکتور SVG و کامپوننت‌های بصری فرانت‌اند را با دقت خارق‌العاده‌ای طراحی می‌کند.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-foreground">اکانت چگونه بر روی ایمیل فعال می‌شود؟</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                اشتراک به صورت قانونی بر روی ایمیل اختصاصی شما شارژ می‌شود. تاریخچه مکالمات و اسناد شما در اکانت شخصی‌تان ذخیره خواهد شد.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-foreground">آیا امکان استفاده از ابزار Claude Code وجود دارد؟</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                بله؛ با فعال بودن اکانت پرو می‌توانید از دستیار تخصصی کدنویسی تحت ترمینال و رابط‌های توسعه کلود استفاده کنید.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-2">
              <h4 className="text-xs sm:text-sm font-bold text-foreground">قوانین گارانتی و پشتیبانی چگونه است؟</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                اشتراک تا پایان ۳۰ روز دارای پشتیبانی کامل در تلگرام است و در صورت بروز هرگونه اختلال زیرساختی پیگیری و رفع خواهد شد.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ==========================================
  // ۴. اشتراک‌های پرچم‌دار Google Gemini Pro
  // ==========================================
  const is18Month = product.slug === "gemini-pro";

  return (
    <section className="mt-14 space-y-12 border-t border-border/80 pt-10">
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
          <Brain className="h-3.5 w-3.5" />
          <span>بررسی تخصصی سرویس پرچم‌دار Google Gemini Pro</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
          همه چیز درباره اکانت Google Gemini Pro؛ کانتکست ۲ میلیون توکنی و انقلاب پادکست‌های صوتی
        </h2>

        <p className="text-sm sm:text-base leading-8 text-muted-foreground">
          گوگل جمینای پرو نماینده اوج مهندسی گوگل در پردازش چندرسانه‌ای (Multimodal) است. برگ برنده اصلی جمینای نسبت به تمام رقبای حاضر، پنجره متنی عظیم <strong>۲ میلیون توکنی</strong> در مدل <strong>Gemini 1.5 Pro</strong> است؛ قابلیتی که به شما امکان می‌دهد کتاب‌های ۱۰۰۰ صفحه‌ای، ساعت‌ها فایل ویدیویی یا کل سورس‌کد یک سیستم نرم‌افزاری را بدون تکه‌تکه‌کردن در حافظه هوش مصنوعی بارگذاری کنید.
        </p>

        <p className="text-sm sm:text-base leading-8 text-muted-foreground">
          {is18Month
            ? "این اشتراک اقتصادی ۱۸ ماهه با ۹۱٪ تخفیف ویژه، طولانی‌ترین اعتبار را در میان تمام سرویس‌های هوش مصنوعی بازار ایران ارائه می‌دهد و بالاترین صرفه اقتصادی را برای دانشجویان، پژوهشگران و فریلنسرها به ارمغان می‌آورد."
            : "این اشتراک ۶۰ روزه راهکاری سریع و به‌صرفه برای دسترسی به کامل‌ترین قابلیت‌های هوش مصنوعی گوگل همراه با گارانتی سلامت و پایداری کامل است."}
        </p>
      </div>

      {/* ۳ کارت ویژگی جمینای */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 transition-all hover:border-primary/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
            <Cpu className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-foreground">کانتکست ۲,۰۰۰,۰۰۰ توکنی</h3>
          <p className="text-xs leading-6 text-muted-foreground">
            هیچ ابزار دیگری در جهان توان پردازش این حجم از داده در یک مکالمه را ندارد؛ تحلیل همزمان ده‌ها فایل PDF، کتاب کامل و ویدیوهای بلند بدون از دست رفتن جزئیات.
          </p>
        </div>

        <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 transition-all hover:border-primary/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Mic className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-foreground">تولید خودکار پادکست در NotebookLM</h3>
          <p className="text-xs leading-6 text-muted-foreground">
            تبدیل جزوات درسی و مقالات تخصصی به یک میزگرد پادکست صوتی دو نفره با مکالمات فوق‌العاده طبیعی و تحلیل‌های استدلالی موشکافانه.
          </p>
        </div>

        <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 transition-all hover:border-primary/50">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <h3 className="text-sm font-bold text-foreground">مدل فوق سریع Gemini 2.0 Flash</h3>
          <p className="text-xs leading-6 text-muted-foreground">
            سرعت سرسام‌آور در پاسخگویی به سوالات روزمره، ادغام عمیق با جیمیل، گوگل داکس و شیتس، و پردازش بلادرنگ تصویر و فایل‌های چندحالته.
          </p>
        </div>
      </div>

      {/* جدول مقایسه اشتراک با نسخه عادی */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            جدول مقایسه: Google Gemini Pro در برابر نسخه رایگان گوگل
          </h3>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
          <table className="w-full text-right text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border/80 bg-secondary/50 text-foreground font-bold">
                <th className="p-3.5 sm:p-4">ویژگی</th>
                <th className="p-3.5 sm:p-4 text-emerald-400 font-black">اشتراک Gemini Pro در وایچ</th>
                <th className="p-3.5 sm:p-4 text-muted-foreground font-medium">نسخه رایگان جمینای</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 text-muted-foreground">
              <tr className="hover:bg-secondary/20 transition-colors">
                <td className="p-3.5 sm:p-4 font-semibold text-foreground">مدل‌های تحلیلی پرچم‌دار</td>
                <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">Gemini 1.5 Pro و Gemini 2.0 Flash</td>
                <td className="p-3.5 sm:p-4">مدل سبک پایه</td>
              </tr>
              <tr className="hover:bg-secondary/20 transition-colors">
                <td className="p-3.5 sm:p-4 font-semibold text-foreground">حداکثر سقف کانتکست (حافظه سند)</td>
                <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">۲,۰۰۰,۰۰۰ توکن کامل (معادل هزاران صفحه متن)</td>
                <td className="p-3.5 sm:p-4">۳۲,۰۰۰ توکن با خطای پر شدن حافظه</td>
              </tr>
              <tr className="hover:bg-secondary/20 transition-colors">
                <td className="p-3.5 sm:p-4 font-semibold text-foreground">قابلیت‌های پیشرفته در NotebookLM</td>
                <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">تولید نامحدود پادکست‌های صوتی تعاملی (Audio Overviews)</td>
                <td className="p-3.5 sm:p-4">سهمیه بسیار محدود</td>
              </tr>
              <tr className="hover:bg-secondary/20 transition-colors">
                <td className="p-3.5 sm:p-4 font-semibold text-foreground">ادغام با ابزارهای Google Workspace</td>
                <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">خلاصه‌سازی ایمیل‌ها و کار در Docs و Sheets</td>
                <td className="p-3.5 sm:p-4">دسترسی محدود</td>
              </tr>
              <tr className="hover:bg-secondary/20 transition-colors">
                <td className="p-3.5 sm:p-4 font-semibold text-foreground">کردیت‌های رسمی ابزارهای خلاقانه گوگل</td>
                <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">تخصیص سهمیه رسمی تولید ویدیوی و محتوا طبق پلن</td>
                <td className="p-3.5 sm:p-4">غیرفعال</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ۴ سوال متداول جمینای */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <h3 className="text-base sm:text-lg font-bold text-foreground">
            پاسخ به سوالات متداول کاربران Gemini Pro
          </h3>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-foreground">تفاوت طرح ۶۰ روزه با طرح ۱۸ ماهه در چیست؟</h4>
            <p className="text-xs leading-6 text-muted-foreground">
              از نظر قابلیت‌های فنی هر دو پلن به مدل‌های 1.5 Pro، 2.0 Flash و نوت‌بوک ال‌ام دسترسی دارند؛ اما پلن ۱۸ ماهه به دلیل مدت زمان بسیار طولانی و تخفیف ۹۱ درصدی، بالاترین صرفه اقتصادی را برای کارهای مداوم ارائه می‌دهد.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-foreground">منظور از ساخت پادکست در NotebookLM چیست؟</h4>
            <p className="text-xs leading-6 text-muted-foreground">
              شما می‌توانید فایل PDF کتاب، جزوه یا گزارش‌های کاری خود را آپلود کنید و با یک کلیک یک فایل صوتی با دو مجری هوش مصنوعی تحویل بگیرید که مانند یک پادکست حرفه‌ای به بررسی و مباحثه درباره متن شما می‌پردازند.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-foreground">اکانت اشتراکی چگونه تحویل داده می‌شود؟</h4>
            <p className="text-xs leading-6 text-muted-foreground">
              اطلاعات ورود امن و بهینه ظرف کمتر از ۱ ساعت پس از ثبت سفارش در تلگرام برای شما ارسال می‌شود و اکانت تحت نظارت دائمی برای حفظ پایداری کامل قرار دارد.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-2">
            <h4 className="text-xs sm:text-sm font-bold text-foreground">آیا در صورت بروز قطعی گارانتی وجود دارد؟</h4>
            <p className="text-xs leading-6 text-muted-foreground">
              بله؛ تمام اکانت‌های جمینای در وایچ در کل بازه (۶۰ روز یا ۱۸ ماه کامل) تحت پوشش گارانتی سلامت هستند و در صورت بروز هرگونه قطعی، اکانت جایگزین فوری تقدیم می‌گردد.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
