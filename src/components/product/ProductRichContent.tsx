import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { toPersianDigits, formatPrice, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";
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
  ChevronDown,
  Award,
  CheckCircle2,
  ArrowLeft,
  Smartphone,
  DollarSign,
  Target,
  Compass,
  BookOpen,
  Briefcase,
  GraduationCap,
  Users,
} from "lucide-react";

interface ProductRichContentProps {
  product: Product;
  isPlanner: boolean;
  isLifetime: boolean;
}

type TabKey = "features" | "usecases" | "comparison" | "delivery" | "faq";

export function ProductRichContent({ product, isPlanner, isLifetime }: ProductRichContentProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("features");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const isChatGPT = product.slug.includes("chatgpt");
  const isClaude = product.slug.includes("claude");
  const isGemini = product.slug.includes("gemini");
  const is18Month = product.slug === "gemini-pro";

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: "features", label: "ویژگی‌ها و مشخصات فنی", icon: Cpu },
    { key: "usecases", label: "موارد استفاده تخصصی", icon: Briefcase },
    { key: "comparison", label: "مزایای نسخه اختصاصی", icon: Layers },
    { key: "delivery", label: "تحویل، فعال‌سازی و گارانتی", icon: ShieldCheck },
    { key: "faq", label: "مشخصات سریع و FAQ", icon: HelpCircle },
  ];

  return (
    <section className="mt-14 space-y-10 border-t border-border/80 pt-10">
      {/* هدر بخش جزئیات محصول با استایل دارک متالیک و هایلایت نئونی */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>راهنمای جامع، مشخصات فنی و شرایط خرید قانونی</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
            بررسی تخصصی {product.name}
          </h2>
        </div>

        {/* بج‌های اعتبارسنجی اعتماد */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-bold text-emerald-400">
            <CheckCircle2 className="h-3.5 w-3.5" />
            تحویل قانونی و فوری
          </span>
          <span className="inline-flex items-center gap-1 rounded-xl border border-purple-500/30 bg-purple-500/10 px-2.5 py-1 font-bold text-purple-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            گارانتی سلامت ۱۰۰٪
          </span>
          <span className="inline-flex items-center gap-1 rounded-xl border border-neon-blue/30 bg-neon-blue/10 px-2.5 py-1 font-bold text-neon-blue">
            <Clock className="h-3.5 w-3.5" />
            پشتیبانی ۲۴ ساعته
          </span>
        </div>
      </div>

      {/* تب‌های تعاملی با افکت متالیک نئونی */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none border-b border-border/70">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer touch-manipulation",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20 scale-[1.02]"
                  : "bg-secondary/40 text-muted-foreground hover:bg-secondary hover:text-foreground border border-border/60"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* محتوای اختصاصی هر محصول بر اساس تب انتخابی */}
      <div className="transition-all duration-200">
        {isChatGPT && (
          <ChatGPTDetailContent
            product={product}
            activeTab={activeTab}
            openFaqIndex={openFaqIndex}
            toggleFaq={toggleFaq}
          />
        )}

        {isClaude && (
          <ClaudeDetailContent
            product={product}
            activeTab={activeTab}
            openFaqIndex={openFaqIndex}
            toggleFaq={toggleFaq}
          />
        )}

        {isGemini && (
          <GeminiDetailContent
            product={product}
            activeTab={activeTab}
            openFaqIndex={openFaqIndex}
            toggleFaq={toggleFaq}
            is18Month={is18Month}
          />
        )}

        {isPlanner && (
          <PlannerDetailContent
            product={product}
            activeTab={activeTab}
            openFaqIndex={openFaqIndex}
            toggleFaq={toggleFaq}
          />
        )}
      </div>

      {/* بنر CTA خرید سریع در انتهای جزئیات */}
      <div className="rounded-3xl border border-primary/30 bg-linear-to-r from-primary/10 via-secondary/20 to-card p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1 text-center sm:text-right">
          <p className="text-xs text-muted-foreground font-medium">سفارش قانونی با تحویل سریع و ضمانت تعویض</p>
          <h3 className="text-base sm:text-lg font-black text-foreground">
            آماده شروع استفاده از {product.name} هستید؟
          </h3>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="text-left hidden xs:block">
            <span className="text-[11px] text-muted-foreground block">مبلغ نهایی:</span>
            <span className="gradient-text font-black text-lg">{formatPrice(product.price)}</span>
          </div>

          <Link
            to="/checkout/$slug"
            params={{ slug: product.slug }}
            className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-black text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all cursor-pointer"
          >
            <span>{isLifetime ? "خرید مستقیم و مادام‌العمر" : "خرید اشتراک قانونی"}</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// =========================================================================
// ۱. جزئیات محصول ChatGPT Plus (OpenAI)
// =========================================================================
function ChatGPTDetailContent({
  product,
  activeTab,
  openFaqIndex,
  toggleFaq,
}: {
  product: Product;
  activeTab: TabKey;
  openFaqIndex: number | null;
  toggleFaq: (idx: number) => void;
}) {
  return (
    <div className="space-y-8">
      {/* تب ۱: ویژگی‌ها و مشخصات فنی رسمی */}
      {(activeTab === "features" || activeTab === "features") && (
        <div className={activeTab !== "features" ? "hidden" : "space-y-6"}>
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              مشخصات فنی و هسته پردازشی ChatGPT Plus (OpenAI)
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              اشتراک قانونی ChatGPT Plus مجهز به آخرین معماری‌های هوش مصنوعی شرکت OpenAI است؛ از جمله مدل چندرسانه‌ای
              پرچم‌دار <strong>GPT-4o</strong> و مدل‌های استدلال عمیق <strong>o1</strong> و <strong>o1-mini</strong> که
              با شبیه‌سازی زنجیره تفکر انسانی، پیچیده‌ترین مسائل علمی، المپیادی و معماری سیستم‌های نرم‌افزاری را پردازش می‌کنند.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-primary/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Brain className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">مدل‌های استدلال عمیق o1 و o1-mini</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                تفکر گام‌به‌گام برای حل مسائل پیچیده ریاضی، المپیادی، ساختارهای سنگین کدنویسی و تحلیل منطقی الگوریتم‌ها قبل از ارائه خروجی نهایی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-emerald-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Mic className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">حالت پیشرفته صوتی (Advanced Voice Mode)</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                پردازش بلادرنگ تن صدا، درک لحن عاطفی، قابلیت قطع کردن صحبت (Interruption) و شبیه‌سازی دقیق لهجه‌های بین‌المللی بدون کوچک‌ترین مکث.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-purple-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Code className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">بوم تعاملی Canvas</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                ویرایش دوطرفه و ساید‌بای‌ساید متون و کدها، بازنویسی پاراگراف‌ها، تغییر سطح لحن و ریفکتور خط‌به‌خط برنامه‌های نرم‌افزاری با هوش مصنوعی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-blue-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <FolderGit2 className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">فروشگاه ربات‌های سفارشی (GPT Store)</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                امکان ساخت نامحدود کاستوم جی‌پی‌تی‌ها (Custom GPTs) با اسناد و دستورالعمل‌های محرمانه و استفاده از صدها هزار ربات کاربردی جهان.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-amber-400/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">تحلیل پیشرفته داده‌ها (Advanced Data Analysis)</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                اجرای مستقیم کدهای پایتون در محیط ایزوله روی فایل‌های اکسل، CSV و داده‌های بزرگ، پاک‌سازی اطلاعات و رسم چارت‌های تحلیلی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-rose-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Palette className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">تصویرسازی DALL-E 3 و وب‌گردی هوشمند</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                تولید و روتوش اختصاصی تصاویر با وضوح بالا، حافظه پویای مکالمات (Memory) و جستجوی آنلاین وب در لحظه همراه با لینک منابع موثق.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* تب ۲: موارد استفاده تخصصی */}
      {activeTab === "usecases" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-emerald-400" />
              سناریوهای کاری و موارد استفاده تخصصی ChatGPT Plus
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              چت‌جی‌پی‌تی پلاس ابزاری جامع برای ارتقای بازدهی تیم‌های کاری، فریلنسرها و متخصصان در صنایع گوناگون است:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Code className="h-4 w-4 text-primary" />
                <span>برنامه‌نویسان و مهندسان نرم‌افزار</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                حل الگوریتم‌های پیچیده با مدل o1، دیباگ اسکریپت‌های پایتون و جاوااسکریپت، و ریفکتور پروژه‌های نرم‌افزاری در بوم Canvas.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <BarChart3 className="h-4 w-4 text-emerald-400" />
                <span>تحلیلگران داده، حسابداران و مدیران مالی</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                آپلود مستقیم فایل‌های اکسل و پایگاه‌های داده، اجرای تحلیل رگرسیون، پیش‌بینی‌های فروش و مصورسازی آماری در عرض چند ثانیه.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <FileText className="h-4 w-4 text-purple-400" />
                <span>تولیدکنندگان محتوا، کپی‌رایترها و کارشناسان سئو</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                نگارش پیش‌نویس مقالات بلند در Canvas، بازنویسی با لحن‌های متناسب با مخاطب، و ساخت بنرهای تبلیغاتی مفهومی با موتور DALL-E 3.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <GraduationCap className="h-4 w-4 text-amber-300" />
                <span>دانشجویان، پژوهشگران و زبان‌آموزان</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                مکالمه صوتی زنده با هوش مصنوعی برای یادگیری زبان انگلیسی یا آلمانی بدون اضطراب، خلاصه‌سازی مقالات و تمرین مصاحبه‌های استخدامی.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* تب ۳: مزایای نسخه اختصاصی و قانونی نسبت به نسخه رایگان */}
      {activeTab === "comparison" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              جدول مقایسه سرشاخ‌به‌سرشاخ: اکانت ChatGPT Plus قانونی در وایچ در برابر نسخه رایگان
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              مقایسه دقیق امکانات و دسترسی‌های این دو نسخه طبق آخرین آپدیت سال ۲۰۲۶:
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-secondary/50 text-foreground font-bold">
                  <th className="p-3.5 sm:p-4">قابلیت و امکانات</th>
                  <th className="p-3.5 sm:p-4 text-emerald-400 font-black">ChatGPT Plus (وایچ)</th>
                  <th className="p-3.5 sm:p-4 text-muted-foreground font-medium">اکانت رایگان (Free)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted-foreground">
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">مدل‌های استدلال عمیق (o1 و o1-mini)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">فعال با اولویت دسترسی استاندارد</td>
                  <td className="p-3.5 sm:p-4">غیرفعال یا شدیداً محدود به چند پیام</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">سقف ارسال پیام با مدل GPT-4o</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">حداکثر سقف استاندارد جهانی (۸۰ پیام در ۳ ساعت)</td>
                  <td className="p-3.5 sm:p-4">حدود ۱۰ تا ۱۶ پیام و سوییچ به مدل ضعیف‌تر</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">حالت مکالمه صوتی پیشرفته (Advanced Voice)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">دسترسی نامحدود روزانه با تن صدای زنده</td>
                  <td className="p-3.5 sm:p-4">محدود به تست چند دقیقه‌ای در ماه</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">بوم تعاملی و ادیتور کد و متن (Canvas)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">فعال با امکان بازنویسی، تغییر لحن و کدنویسی جفتی</td>
                  <td className="p-3.5 sm:p-4">بسیار محدود یا غیرفعال</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">تحلیل پایتون داده‌ها (Data Analysis)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">آپلود دیتاست‌های بزرگ اکسل، CSV و رسم نمودار</td>
                  <td className="p-3.5 sm:p-4">محدودیت شدید حجم فایل</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">تصویرسازی DALL-E 3</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">تولید مداوم تصاویر با بالاترین کیفیت</td>
                  <td className="p-3.5 sm:p-4">محدود به ۲ تا ۳ تصویر در روز</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">حفظ حریم خصوصی و امنیت تاریخچه</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">۱۰۰٪ اختصاصی روی ایمیل شما (بدون دسترسی دیگران)</td>
                  <td className="p-3.5 sm:p-4">اکانت‌های اشتراکی دارای خطر افشای چت هستند</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* تب ۴: نحوه تحویل، فعال‌سازی و گارانتی سلامت اکانت */}
      {activeTab === "delivery" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              مراحل تحویل، فعال‌سازی قانونی و ضمانت سلامت وایچ
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              وایچ اشتراک ChatGPT Plus را از طریق کارت‌های اعتباری بین‌المللی معتبر فعال می‌کند؛ بنابراین خطرات بن شدن
              یا سوختن اکانت ناشی از ویزاکارت‌های فیک و مجازی به صفر می‌رسد.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۱
              </div>
              <h4 className="text-sm font-bold text-foreground">ثبت سفارش و ارسال ایمیل</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                پس از پرداخت، فقط آدرس ایمیل اکانت اوپن‌ای‌آی خود را ارسال می‌کنید. هیچ پسوردی از شما دریافت نمی‌شود.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۲
              </div>
              <h4 className="text-sm font-bold text-foreground">فعال‌سازی قانونی مستقیم</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                اشتراک ظرف مدت ۱۵ تا ۶۰ دقیقه مستقیماً روی ایمیل شخصی شما شارژ و ارتقا می‌یابد.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۳
              </div>
              <h4 className="text-sm font-bold text-foreground">پوشش گارانتی ۳۰ روزه</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                اکانت در تمام ۳۰ روز تحت پوشش گارانتی سلامت است و در صورت بروز هر مشکلی تعویض یا رفع اشکال فوری انجام می‌شود.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* تب ۵: جدول مشخصات سریع و پرسش‌های متداول (FAQ با Accordion) */}
      {activeTab === "faq" && (
        <div className="space-y-8">
          {/* جدول مشخصات سریع */}
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-300" />
              جدول مشخصات سریع ChatGPT Plus در یک نگاه
            </h3>
            <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
              <table className="w-full text-right text-xs sm:text-sm">
                <tbody className="divide-y divide-border/60">
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground w-1/3">شرکت توسعه‌دهنده</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">OpenAI (ایالات متحده آمریکا)</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">مدل‌های فعال</td>
                    <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">GPT-4o + استدلال عمیق o1 و o1-mini</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">نوع مالکیت و اکانت</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">۱۰۰٪ اختصاصی و قانونی بر روی ایمیل شخصی خریدار</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">امکانات چندرسانه‌ای</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">Advanced Voice Mode، بوم Canvas، DALL-E 3، سندباکس پایتون</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">مدت اعتبار و پشتیبانی</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">۱ ماهه (۳۰ روز کامل) همراه با گارانتی تعویض و پشتیبانی تلگرام</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* پرسش‌های متداول (Accordion) */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              پرسش‌های متداول خریداران ChatGPT Plus
            </h3>

            <div className="space-y-3">
              {[
                {
                  q: "آیا برای فعال‌سازی چت‌جی‌پی‌تی پلاس به ارسال رمز عبور ایمیل نیاز است؟",
                  a: "خیر؛ به هیچ عنوان نیازی به رمز عبور شما نیست. فعال‌سازی از طریق پرداخت ارزی رسمی بین‌المللی بر روی آدرس جیمیل شما انجام می‌شود و تمام اطلاعات شخصی شما محفوظ می‌ماند.",
                },
                {
                  q: "آیا خطر مسدود شدن (Ban) اکانت من وجود دارد؟",
                  a: "خیر؛ روش پرداخت فروشگاه وایچ کاملاً قانونی و بدون دور زدن سیستم بانکی است. با این حال تمام اکانت‌ها در طول ۳۰ روز تحت گارانتی سلامت ۱۰۰٪ وایچ قرار دارند و در صورت بروز هرگونه مشکل، پشتیبانی تلگرام در کوتاه‌ترین زمان اقدام به رفع آن می‌نماید.",
                },
                {
                  q: "سقف ارسال پیام در نسخه پلاس چگونه است؟",
                  a: "شرکت OpenAI بالاترین سقف مجاز پیام را برای کاربران پلاس در نظر می‌گیرد (معمولاً ۸۰ پیام در هر ۳ ساعت برای GPT-4o و سقف هفتگی اختصاصی برای مدل o1). این سقف استاندارد جهانی است و بالاترین اولویت پردازش سرورها به آن تعلق می‌گیرد.",
                },
                {
                  q: "آیا در ایران برای استفاده از حالت صوتی یا سایت نیازمند تغییر آی‌پی هستیم؟",
                  a: "بله؛ به دلیل تحریم‌های شرکت اوپن‌ای‌آی علیه کاربران مستقر در ایران، استفاده از یک ابزار تغییر آی‌پی استاندارد برای باز کردن داشبورد چت‌جی‌پی‌تی ضروری است. همراه با سفارش راهنمای اتصال امن نیز تقدیم شما خواهد شد.",
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/80 bg-secondary/30 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 text-right font-bold text-xs sm:text-sm text-foreground hover:text-primary transition-colors cursor-pointer select-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground",
                        openFaqIndex === idx && "rotate-180 text-primary"
                      )}
                    />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-4 pb-4 pt-1 text-xs leading-6 text-muted-foreground border-t border-border/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// ۲. جزئیات محصول Claude Pro (Anthropic)
// =========================================================================
function ClaudeDetailContent({
  product,
  activeTab,
  openFaqIndex,
  toggleFaq,
}: {
  product: Product;
  activeTab: TabKey;
  openFaqIndex: number | null;
  toggleFaq: (idx: number) => void;
}) {
  return (
    <div className="space-y-8">
      {/* تب ۱: ویژگی‌ها و مشخصات فنی رسمی */}
      {(activeTab === "features" || activeTab === "features") && (
        <div className={activeTab !== "features" ? "hidden" : "space-y-6"}>
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              مشخصات پردازشی و معماری Claude Pro (Anthropic)
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              سرویس Claude Pro متعلق به شرکت آمریکایی Anthropic، انتخاب شماره یک مهندسان ارشد نرم‌افزار، توسعه‌دهندگان
              فرانت‌اند و نویسندگان فاخر فارسی است. این سرویس مجهز به مدل پرچم‌دار <strong>Claude 3.5 Sonnet</strong> (برترین
              مدل تاریخ در بنچمارک SWE-bench) و مدل پرسرعت <strong>Claude 3.5 Haiku</strong> است.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-primary/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Code className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">صدرنشین بنچمارک مهندسی کد (SWE-bench)</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                بالاترین دقت جهان در درک سورس‌کدهای بزرگ، حل باگ‌های گیت‌هاب، بازنویسی توابع و نگارش معماری نرم‌افزاری ماژولار.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-emerald-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Laptop className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">فضای کاری زنده Artifacts</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                رندر و اجرای آنی کدهای فرانت‌اند (React، HTML، JS، Tailwind)، رسم فلوچارت‌های Mermaid و دیاگرام‌های SVG در پنجره اختصاصی تعاملی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-purple-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <FolderGit2 className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">پایگاه‌های دانش پروژه‌ای (Claude Projects)</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                آپلود اسناد تخصصی، مخازن کد، راهنماهای برند و تنظیم System Promptهای اختصاصی برای هر پروژه به منظور حفظ پایدار کانتکست کاری.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-blue-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Brain className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">پنجره متنی ۲۰۰ هزار توکنی (200K Context)</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                پردازش همزمان بیش از ۱۵۰ هزار کلمه، کتاب‌های قطور و ده‌ها سند دانشگاهی در یک مکالمه بدون افت دقت حافظه.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-amber-400/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300">
                <TrendingUp className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">سقف مصرف ۵ برابری نسبت به نسخه رایگان</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                امکان ارسال پیام‌های سنگین و طولانی برای توسعه محصول و تحقیقات عمیق، با ریست شدن ظرفیت در هر بازه ۵ ساعته.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-rose-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">طبیعی‌ترین نثر ادبی زبان فارسی</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                برخلاف نثر ماشینی دیگر مدل‌ها، کلود متون فارسی را با روانی، شیوایی دستوری و ساختاری کاملاً انسانی و اصیل خلق می‌کند.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* تب ۲: موارد استفاده تخصصی */}
      {activeTab === "usecases" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-emerald-400" />
              سناریوهای تخصصی برای کاربران حرفه‌ای Claude Pro
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              کلود پرو در حوزه‌هایی که نیازمند دقت منطقی بالا، خوانایی کد و نگارش ادبی فاخر هستند، برترین عملکرد را داراست:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Code className="h-4 w-4 text-primary" />
                <span>توسعه‌دهندگان وب و طراحان فرانت‌اند</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                ساخت و تست آنی کامپوننت‌های React و استایل‌های Tailwind در محیط Artifacts و مشاهده پیش‌نمایش مستقیم رابط کاربری.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Cpu className="h-4 w-4 text-purple-400" />
                <span>مهندسان ارشد نرم‌افزار و معماران سیستم</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                ریفکتور پایگاه‌های کد قدیمی، طراحی الگوهای مهندسی نرم‌افزار و تحلیل آسیب‌پذیری‌های امنیتی در کلاس‌های بزرگ کدی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <FileText className="h-4 w-4 text-emerald-400" />
                <span>نویسندگان، مترجمان و پژوهشگران زبان فارسی</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                نگارش مقالات عمیق، ترجمه مقالات تخصصی بدون لحن ماشینی و بازنویسی متون دانشگاهی با شیواترین کلمات اصیل زبان فارسی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <FolderGit2 className="h-4 w-4 text-amber-300" />
                <span>مدیران محصول و تیم‌های حقوقی</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                بارگذاری اسناد نیازمندی‌های محصول (PRD) و قراردادهای صد صفحه‌ای در پروژه‌های کلود و بررسی همپوشانی‌ها و تناقضات قانونی.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* تب ۳: مزایای نسخه اختصاصی و قانونی نسبت به نسخه رایگان */}
      {activeTab === "comparison" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              جدول مقایسه: اشتراک Claude Pro اختصاصی در وایچ در برابر نسخه رایگان
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              تفاوت‌های بنیادین این دو نسخه که کاربری حرفه‌ای را متحول می‌کنند:
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-secondary/50 text-foreground font-bold">
                  <th className="p-3.5 sm:p-4">ویژگی</th>
                  <th className="p-3.5 sm:p-4 text-emerald-400 font-black">Claude Pro (وایچ)</th>
                  <th className="p-3.5 sm:p-4 text-muted-foreground font-medium">اکانت رایگان کلود</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted-foreground">
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">مدل‌های هوش مصنوعی فعال</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">دسترسی دائمی به Claude 3.5 Sonnet و Haiku</td>
                  <td className="p-3.5 sm:p-4">سهمیه بسیار کوتاه و سوییچ مکرر به مدل‌های پایه</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">سقف ارسال پیام در هر بازه زمانی</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">حداقل ۵ برابر سقف اکانت رایگان</td>
                  <td className="p-3.5 sm:p-4">قفل شدن سریع حساب بعد از چند پیام تحلیلی</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">پایگاه‌های دانش پروژه‌ای (Claude Projects)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">فعال با پنجره حافظه ۲۰۰ هزار توکنی برای اسناد</td>
                  <td className="p-3.5 sm:p-4">غیرفعال</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">محیط تعاملی و زنده Artifacts</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">نامحدود جهت رندر کدهای React و فرانت‌اند</td>
                  <td className="p-3.5 sm:p-4">محدود به ترافیک سرور</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">اولویت ترافیک در ساعات شلوغی سرور</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">پاسخگویی سریع بدون خطای شلوغی سرور</td>
                  <td className="p-3.5 sm:p-4">توقف موقت پردازش با پیام سرور پر است</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* تب ۴: نحوه تحویل، فعال‌سازی و گارانتی سلامت اکانت */}
      {activeTab === "delivery" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              تحویل مستقیم، اتصال بدون تداخل و گارانتی سلامت کلود پرو
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              سرویس کلود پرو بر روی ایمیل شخصی خودتان فعال‌سازی می‌شود تا اسناد کاری و پروژه‌های شما محفوظ بماند:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۱
              </div>
              <h4 className="text-sm font-bold text-foreground">تحویل مستقیم و بی‌واسطه</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                اکانت بدون واسطه با مسترکارت رسمی بین‌المللی بر روی آدرس جیمیل شما شارژ می‌گردد.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۲
              </div>
              <h4 className="text-sm font-bold text-foreground">راهنمای اتصال امن بدون تداخل</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                همراه با سفارش، راهنمای دقیق ورود امن با آی‌پی پایدار برای جلوگیری از حساسیت سرورهای آنتروپیک تقدیم می‌شود.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۳
              </div>
              <h4 className="text-sm font-bold text-foreground">گارانتی تعویض ۳۰ روزه</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                پوشش کامل گارانتی تعویض و رفع مشکل در تمام طول دوره ۱ ماهه با پشتیبانی اختصاصی در تلگرام.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* تب ۵: جدول مشخصات سریع و پرسش‌های متداول (FAQ با Accordion) */}
      {activeTab === "faq" && (
        <div className="space-y-8">
          {/* جدول مشخصات سریع */}
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-300" />
              جدول مشخصات سریع Claude Pro
            </h3>
            <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
              <table className="w-full text-right text-xs sm:text-sm">
                <tbody className="divide-y divide-border/60">
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground w-1/3">شرکت توسعه‌دهنده</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">Anthropic (ایالات متحده آمریکا)</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">مدل‌های پردازشی</td>
                    <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">Claude 3.5 Sonnet + Claude 3.5 Haiku</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">پنجره متنی (Context Window)</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">۲۰۰,۰۰۰ توکن کامل (حدود ۱۵۰ هزار کلمه در هر جلسه)</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">ابزارهای اختصاصی</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">پنل زنده Artifacts، سیستم Projects و اتصال به Claude Code</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">مدت اعتبار و پشتیبانی</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">۳۰ روز کامل همراه با گارانتی سلامت و پشتیبانی مستقیم تلگرام</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* پرسش‌های متداول (Accordion) */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              پرسش‌های متداول خریداران Claude Pro
            </h3>

            <div className="space-y-3">
              {[
                {
                  q: "آیا کلود پرو قابلیت تولید تصویر (مانند Midjourney یا DALL-E) دارد؟",
                  a: "خیر؛ شرکت آنتروپیک تمرکز تخصصی خود را به صورت ۱۰۰٪ روی منطق کدنویسی، تحلیل اسناد و متون گذاشته است. با این حال کلود کدهای وکتور SVG، دیاگرام‌های Mermaid و کامپوننت‌های بصری فرانت‌اند را با کیفیت خارق‌العاده‌ای در پنل Artifacts طراحی می‌کند.",
                },
                {
                  q: "پنل Artifacts چه کاربردی برای برنامه‌نویسان دارد؟",
                  a: "آرتیفکت به شما اجازه می‌دهد کدهای نوشته‌شده توسط کلود (React، Tailwind، کدهای وب و چارت‌ها) را بدون نیاز به سرور لوکال، به صورت زنده در یک پنجره مستقل در مرورگر اجرا کرده و ظاهر خروجی را بررسی کنید.",
                },
                {
                  q: "پنجره متنی ۲۰۰ هزار توکنی چه حجمی از اسناد را پوشش می‌دهد؟",
                  a: "۲۰۰ هزار توکن معادل حدود ۵۰۰ تا ۶۰۰ صفحه کتاب متنی یا کل سورس‌کدهای یک نرم‌افزار متوسط است؛ بنابراین می‌توانید ده‌ها سند را در بخش Projects آپلود کنید تا کلود بر اساس محتوای آن‌ها پاسخ دهد.",
                },
                {
                  q: "نحوه تحویل و فعال‌سازی روی ایمیل من چگونه است؟",
                  a: "اشتراک به صورت قانونی روی ایمیل شخصی خودتان شارژ می‌گردد. تمام تاریخچه گفتگوها و پروژه‌های شما در اکانت شخصی ذخیره شده و هیچ شخص ثالثی به آن دسترسی نخواهد داشت.",
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/80 bg-secondary/30 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 text-right font-bold text-xs sm:text-sm text-foreground hover:text-primary transition-colors cursor-pointer select-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground",
                        openFaqIndex === idx && "rotate-180 text-primary"
                      )}
                    />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-4 pb-4 pt-1 text-xs leading-6 text-muted-foreground border-t border-border/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// ۳. جزئیات محصولات Gemini Pro / Advanced (Google)
// =========================================================================
function GeminiDetailContent({
  product,
  activeTab,
  openFaqIndex,
  toggleFaq,
  is18Month,
}: {
  product: Product;
  activeTab: TabKey;
  openFaqIndex: number | null;
  toggleFaq: (idx: number) => void;
  is18Month: boolean;
}) {
  return (
    <div className="space-y-8">
      {/* تب ۱: ویژگی‌ها و مشخصات فنی رسمی */}
      {(activeTab === "features" || activeTab === "features") && (
        <div className={activeTab !== "features" ? "hidden" : "space-y-6"}>
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              مشخصات فنی و توان پردازشی Google Gemini Pro
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              سرویس Gemini Pro مجهز به موتور قدرتمند <strong>Gemini 1.5 Pro</strong> با رکورد جهانی پنجره زمینه تا ۲ میلیون
              توکن است. این سیستم چندوجهی بومی (Native Multimodal) می‌تواند ساعت‌ها ویدیوی باکیفیت، فایل‌های صوتی طولانی،
              کتاب‌های رفرنس و کدهای پیچیده را به صورت همزمان تحلیل کند.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-primary/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Brain className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">کانتکست عظیم ۲ میلیون توکنی</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                رکورددار پردازش اطلاعات در جهان: توانایی تحلیل ۱ ساعت ویدیوی خام، ساعت‌ها فایل صوتی، کتب ۱۰۰۰ صفحه‌ای و پایگاه‌های داده کدی در یک مکالمه.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-emerald-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Compass className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">یکپارچگی با Google Workspace</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                اتصال مستقیم با جیمیل، گوگل درایو، داکس و شیتس (Extensions) جهت جستجوی آنی در اسناد ابری و ساختاردهی اطلاعات کاری.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-purple-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Mic className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">تولید پادکست خودکار در NotebookLM</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                تبدیل یادداشت‌ها، جزوات درسی و مقالات تخصصی به یک گفتگوی پادکستی دونفره با صدای طبیعی (Audio Overviews) بدون توهم هوش مصنوعی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-blue-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Palette className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">تولید تصویر با Imagen 3</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                جدیدترین موتور تصویرسازی گوگل با تفکیک دقیق متون داخل عکس، رندر بافت‌های نوری و فتورئالیسم بی‌نقص.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-amber-400/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300">
                <Code className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">سندباکس اجرای پایتون</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                حل مسائل ریاضی و تحلیل داده‌ها با اجرای کدهای پایتون در پشت صحنه و ارائه پاسخ‌های بدون خطای محاسباتی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-rose-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Award className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">
                {is18Month ? "پلن ۱۸ ماهه اقتصادی ویژه (۹۱٪ تخفیف)" : "پلن ۶۰ روزه پرسرعت و پایدار"}
              </h4>
              <p className="text-xs leading-6 text-muted-foreground">
                {is18Month
                  ? "طولانی‌ترین اعتبار در میان تمام سرویس‌های هوش مصنوعی ایران؛ بدون نگرانی از افزایش نرخ ارز یا تمدید ماهانه."
                  : "دسترسی پایدار و اقتصادی برای دو ماه کامل به تمام امکانات پیشرفته هوش مصنوعی گوگل."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* تب ۲: موارد استفاده تخصصی */}
      {activeTab === "usecases" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-emerald-400" />
              موارد استفاده تخصصی Gemini Pro
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              پنجره حافظه ۲ میلیون توکنی جمینای، سناریوهایی را ممکن کرده که با هیچ هوش مصنوعی دیگری در جهان قابل اجرا نیست:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span>دانشجویان، اساتید و محققان آکادمیک</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                بارگذاری کتب رفرنس زبان اصلی و تولید خلاصه یا پادکست صوتی با NotebookLM، استخراج نکات کلیدی مقالات ساینس‌دایرکت بدون تکه‌تکه کردن متن.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Search className="h-4 w-4 text-emerald-400" />
                <span>تحلیلگران حقوقی و بایگانی‌های اسناد سازمانی</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                جستجوی بلادرنگ در هزاران صفحه قرارداد، بخشنامه‌های دولتی و اسناد Google Drive بدون از دست رفتن بندهای مهم قانونی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Mic className="h-4 w-4 text-purple-400" />
                <span>تولیدکنندگان ویدیو و محتوا</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                بارگذاری ویدیوهای ۱ ساعته از یوتیوب، استخراج تایم‌کدهای موضوعی، بازنویسی دیالوگ‌ها و سناریونویسی برای ویدیوهای ریلز و شورتس.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Briefcase className="h-4 w-4 text-amber-300" />
                <span>استارتاپ‌ها و شرکت‌های نوپا (پلن ۱۸ ماهه)</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                تأمین دسترسی پایدار هوش مصنوعی برای کل اعضای تیم با هزینه بسیار اقتصادی ۳۹۹ هزار تومان برای کل ۱۸ ماه بدون دغدغه تمدید مکرر.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* تب ۳: مزایای نسخه اختصاصی نسبت به نسخه رایگان */}
      {activeTab === "comparison" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              جدول مقایسه: Google Gemini Pro در برابر نسخه رایگان گوگل
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              تفاوت دسترسی‌های فنی و سقف کانتکست بین نسخه حرفه‌ای و رایگان:
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-secondary/50 text-foreground font-bold">
                  <th className="p-3.5 sm:p-4">ویژگی</th>
                  <th className="p-3.5 sm:p-4 text-emerald-400 font-black">Gemini Pro (وایچ)</th>
                  <th className="p-3.5 sm:p-4 text-muted-foreground font-medium">نسخه رایگان جمینای</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted-foreground">
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">مدل پردازشی هسته</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">Gemini 1.5 Pro با استدلال عمیق</td>
                  <td className="p-3.5 sm:p-4">مدل سبک پایه (Flash)</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">سقف پنجره بافت (Context Window)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">۲,۰۰۰,۰۰۰ توکن کامل (معادل هزاران صفحه)</td>
                  <td className="p-3.5 sm:p-4">۳۲,۰۰۰ توکن با خطای پر شدن سریع حافظه</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">پلتفرم NotebookLM و پادکست‌ساز صوتی</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">تولید نامحدود پادکست‌های Audio Overviews</td>
                  <td className="p-3.5 sm:p-4">سهمیه بسیار محدود</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">اتصال به اکستنشن‌های Google Workspace</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">جستجو و تحلیل در درایو، جیمیل و اسناد</td>
                  <td className="p-3.5 sm:p-4">دسترسی محدود</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">تولید تصویر با Imagen 3</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">فعال با بالاترین وضوح و جزئیات</td>
                  <td className="p-3.5 sm:p-4">مدل‌های قدیمی‌تر با کیفیت پایین</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* تب ۴: نحوه تحویل، فعال‌سازی و گارانتی سلامت اکانت */}
      {activeTab === "delivery" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              تحویل سریع، پایداری بدون قطعی و پوشش کامل گارانتی
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              اکانت‌های جمینای در وایچ با بهینه‌ترین سرورها و تضمین کامل پایداری ارائه می‌شوند:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۱
              </div>
              <h4 className="text-sm font-bold text-foreground">تحویل سریع ظرف کمتر از ۱ ساعت</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                اطلاعات اکانت و راهنمای ورود بهینه بلافاصله پس از ثبت سفارش در تلگرام تقدیم می‌شود.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۲
              </div>
              <h4 className="text-sm font-bold text-foreground">پایداری بدون قطعی</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                اکانت‌ها بر روی سرورهای فوق‌العاده پایدار تنظیم شده‌اند و دچار قطعی‌های آزاردهنده نمی‌شوند.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۳
              </div>
              <h4 className="text-sm font-bold text-foreground">
                {is18Month ? "گارانتی کامل ۱۸ ماهه" : "گارانتی کامل ۶۰ روزه"}
              </h4>
              <p className="text-xs leading-6 text-muted-foreground">
                در صورت بروز هرگونه قطعی زیرساختی در طول دوره، تعویض فوری اکانت تضمین شده است.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* تب ۵: جدول مشخصات سریع و پرسش‌های متداول (FAQ با Accordion) */}
      {activeTab === "faq" && (
        <div className="space-y-8">
          {/* جدول مشخصات سریع */}
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-300" />
              جدول مشخصات سریع Gemini Pro
            </h3>
            <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
              <table className="w-full text-right text-xs sm:text-sm">
                <tbody className="divide-y divide-border/60">
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground w-1/3">شرکت توسعه‌دهنده</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">Google (گوگل)</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">مدل پردازشی هسته</td>
                    <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">Gemini 1.5 Pro با کانتکست ۲ میلیون توکن</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">پشتیبانی چندرسانه‌ای</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">ویدیوهای ۱ ساعته، فایل‌های صوتی، اسناد PDF، تصویر Imagen 3</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">ابزار پژوهشی اختصاصی</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">Google NotebookLM با تولید پادکست‌های صوتی تعاملی</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">مدت دوره و ضمانت</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">
                      {is18Month ? "۱۸ ماه کامل (با تخفیف ۹۱٪)" : "۶۰ روز کامل"} همراه با گارانتی سلامت ۱۰۰٪
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* پرسش‌های متداول (Accordion) */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              پرسش‌های متداول خریداران Gemini Pro
            </h3>

            <div className="space-y-3">
              {[
                {
                  q: "منظور از پنجره زمینه (Context Window) دو میلیون توکنی چیست؟",
                  a: "توکن واحد شمارش کلمات در هوش مصنوعی است. ۲ میلیون توکن معادل حدود ۱.۵ میلیون کلمه است. با این ظرفیت می‌توانید یک فیلم کامل ۱ ساعته، ۲۰ کتاب ۳۰۰ صفحه‌ای یا کل فایل‌های سورس‌کد یک سیستم را به جمینای بدهید و او تمام جزئیات آن‌ها را در حافظه نگه می‌دارد.",
                },
                {
                  q: "تفاوت پلن ۶۰ روزه با پلن ۱۸ ماهه در چیست؟",
                  a: "هر دو پلن دسترسی به مدل پرچم‌دار Gemini 1.5 Pro، نوت‌بوک ال‌ام و ادغام Workspace را دارند؛ اما پلن ۱۸ ماهه به دلیل تخفیف ویژه ۹۱ درصدی، بالاترین صرفه اقتصادی بازار را برای فریلنسرها، دانشجویان و تیم‌ها فراهم می‌کند و نیازی به تمدید ماهانه ندارد.",
                },
                {
                  q: "قابلیت تولید پادکست در NotebookLM چگونه کار می‌کند؟",
                  a: "کافی است فایل‌های PDF جزوه، مقاله یا کتاب‌های خود را در NotebookLM آپلود کنید و گزینه Audio Overview را بزنید. دو مجری هوش مصنوعی با صدای طبیعی و گفتگوی استدلالی، مباحث کتاب شما را به یک پادکست جذاب صوتی تبدیل می‌کنند.",
                },
                {
                  q: "در صورت بروز مشکل در اکانت، شرایط پشتیبانی چگونه است؟",
                  a: "تمام خریدهای جمینای در طول دوره خود (۶۰ روز یا ۱۸ ماه کامل) تحت پوشش گارانتی تعویض وایچ هستند و تیم پشتیبانی تلگرام در کوتاه‌ترین زمان اقدام به رفع مشکل یا جایگزینی اکانت می‌نماید.",
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/80 bg-secondary/30 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 text-right font-bold text-xs sm:text-sm text-foreground hover:text-primary transition-colors cursor-pointer select-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground",
                        openFaqIndex === idx && "rotate-180 text-primary"
                      )}
                    />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-4 pb-4 pt-1 text-xs leading-6 text-muted-foreground border-t border-border/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// ۴. جزئیات محصول پلنر مدیریت و سبک زندگی VAICH (Google Sheets)
// =========================================================================
function PlannerDetailContent({
  product,
  activeTab,
  openFaqIndex,
  toggleFaq,
}: {
  product: Product;
  activeTab: TabKey;
  openFaqIndex: number | null;
  toggleFaq: (idx: number) => void;
}) {
  return (
    <div className="space-y-8">
      {/* تب ۱: ویژگی‌ها و مشخصات فنی رسمی */}
      {(activeTab === "features" || activeTab === "features") && (
        <div className={activeTab !== "features" ? "hidden" : "space-y-6"}>
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              داشبورد هوشمند دیجیتال بر بستر گوگل شیت (Google Sheets)
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              پلنر هوشمند زندگی VAICH کامل‌ترین سیستم مدیریت زمان، عادات و انضباط فردی است که با طراحی مدرن Dark Metallic /
              Liquid Glass و اسکریپت‌های اتوماسیون (Google Apps Script) مهندسی شده است. این پلنر شامل ۲ نسخه و تمپلیت مجزا
              است: نسخه تعاملی و سه‌بعدی <strong>3D Deluxe</strong> و نسخه مینیمال استاندارد <strong>2D Minimal</strong>.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-emerald-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">Habit Tracker پویا و Streak Tracker</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                فرمول‌نویسی خودکار برای محاسبه لحظه‌ای درصد پایبندی روزانه و هفتگی، با ردیابی زنجیره استمرار و پیشگیری از قطع روند عادات.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-primary/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">سیستم مسدودسازی زمانی (Time Blocking)</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                برنامه‌ریزی بلوک‌های تمرکز عمیق (Deep Work) و شکستن وظایف سنگین روزانه به واحدهای اجرایی بدون پرش ذهن.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-purple-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Target className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">داشبورد هدف‌گذاری SMART و OKR</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                تعریف اهداف فصلی و سالانه با درصد پیشرفت گرافیکی، میله‌های وضعیت بصری و تفکیک وظایف بر اساس ماتریس اولویت آیزنهاور.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-amber-400/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300">
                <DollarSign className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">مدیریت مالی و بودجه‌بندی ماهانه</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                ثبت درآمدها، دسته‌بندی هزینه‌های ضروری و پس‌انداز ماهانه همراه با چارت‌های گرافیکی خودکار جهت مهار جریان مالی شخصی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-neon-blue/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neon-blue/10 border border-neon-blue/20 text-neon-blue">
                <Smartphone className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">بهینه‌سازی کامل وب دسکتاپ و اپ موبایل</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                اجرای روان روی نرم‌افزار رایگان گوگل شیتس بدون نیاز به اکسل یا نصب ابزارهای سنگین؛ همیشه در دسترس و همگام.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-rose-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">دسترسی مادام‌العمر (Lifetime Access)</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                خرید دائمی بدون نیاز به تمدید ماهانه یا اشتراک دلاری، همراه با دکمه پاکسازی خودکار برای استفاده نامحدود در تمام سال‌ها.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* تب ۲: موارد استفاده تخصصی */}
      {activeTab === "usecases" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-emerald-400" />
              موارد استفاده تخصصی پلنر زندگی وایچ
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              طراحی این پلنر به گونه‌ای است که نیازهای گروه‌های مختلف کاری و تحصیلی را به بهترین شکل پوشش می‌دهد:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span>داوطلبان کنکور و امتحانات دانشگاهی</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                ثبت ساعت مطالعه روزانه، فواصل مرور مباحث درسی، ردیابی پارت‌های تست‌زنی و محاسبه خودکار جمع ساعات مطالعه هفتگی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Briefcase className="h-4 w-4 text-emerald-400" />
                <span>فریلنسرها، طراحان و مدیران پروژه</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                سازماندهی پروژه‌های چندگانه با متد Time Boxing، اولویت‌بندی وظایف با ماتریس آیزنهاور و جلوگیری از عقب‌افتادن ددلاین‌ها.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Flame className="h-4 w-4 text-rose-400" />
                <span>علاقه‌مندان به ورزش، سلامت و رشد فردی</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                ردیابی پیوسته عادات ورزش، رژیم غذایی، آب خوردن و خواب، با ثبت ردپای پیروزی‌های روزمره و ایجاد انگیزه پایدار درونی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <DollarSign className="h-4 w-4 text-amber-300" />
                <span>مدیریت بودجه و دخل‌وخرج شخصی</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                کنترل خرج‌های روزمره، هدف‌گذاری برای پس‌انداز ماهانه و دیدن سهم هر گروه هزینه در چارت‌های دایره‌ای خودکار.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* تب ۳: مزایای نسخه اختصاصی و قانونی نسبت به نسخه رایگان */}
      {activeTab === "comparison" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              جدول مقایسه: پلنر هوشمند وایچ در برابر دفاتر کاغذی و اپلیکیشن‌ها
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              چرا فرمول‌های هوشمند گوگل شیت موثرترین روش پایبندی به اهداف هستند؟
            </p>
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
      )}

      {/* تب ۴: نحوه تحویل، فعال‌سازی و گارانتی سلامت اکانت */}
      {activeTab === "delivery" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              تحویل آنی، دسترسی همیشگی و راهنمای راه‌اندازی فارسی
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              تنها با داشتن یک اکانت رایگان جیمیل، در کمتر از ۳ دقیقه سیستم مدیریت فردی شما آماده به کار خواهد بود:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۱
              </div>
              <h4 className="text-sm font-bold text-foreground">تحویل آنی لینک اختصاصی</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                بلافاصله پس از پرداخت، لینک اختصاصی کپی (Make a Copy) در گوگل درایو در صفحه و تلگرام نمایش داده می‌شود.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۲
              </div>
              <h4 className="text-sm font-bold text-foreground">کپی در گوگل درایو شخصی</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                با یک کلیک، نسخه اختصاصی شما با دسترسی ۱۰۰٪ اختصاصی در اکانت گوگل شخصی خودتان ذخیره می‌گردد.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۳
              </div>
              <h4 className="text-sm font-bold text-foreground">راهنمای فارسی و پشتیبانی دائمی</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                همراه با فایل، وویس و ویدیوی آموزشی نحوه کار با شیت ارسال شده و پشتیبانی تلگرام پاسخگوی سوالات شماست.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* تب ۵: جدول مشخصات سریع و پرسش‌های متداول (FAQ با Accordion) */}
      {activeTab === "faq" && (
        <div className="space-y-8">
          {/* جدول مشخصات سریع */}
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-300" />
              جدول مشخصات فنی پلنر زندگی وایچ
            </h3>
            <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
              <table className="w-full text-right text-xs sm:text-sm">
                <tbody className="divide-y divide-border/60">
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground w-1/3">بستر نرم‌افزاری</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">Google Sheets ابری (بدون نیاز به نرم‌افزار مایکروسافت اکسل)</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">تمپلیت‌های موجود در پکیج</td>
                    <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">۲ تمپلیت: نسخه ۳D Deluxe تعاملی + نسخه ۲D Minimal استاندارد</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">دستگاه‌های سازگار</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">گوشی‌های اندروید و آیفون، تبلت‌ها، لپ‌تاپ‌های ویندوز، مک و لینوکس</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">نوع مالکیت و هزینه</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">دسترسی دائمی و مادام‌العمر (یک‌بار خرید بدون هزینه اشتراک ماهانه)</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">اتوماسیون و اسکریپت</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">مجهز به دکمه پاکسازی ماهانه هوشمند (Apps Script) و فرمول‌های داینامیک</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* پرسش‌های متداول (Accordion) */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              پرسش‌های متداول خریداران پلنر وایچ
            </h3>

            <div className="space-y-3">
              {[
                {
                  q: "آیا برای استفاده از پلنر باید نرم‌افزار مایکروسافت اکسل داشته باشم؟",
                  a: "خیر؛ این فایل کاملاً بر بستر رایگان و ابری گوگل شیتس (Google Sheets) توسعه داده شده است. شما تنها با یک جیمیل و باز کردن مرورگر یا اپلیکیشن رایگان گوگل شیت روی موبایل، به پلنر دسترسی خواهید داشت.",
                },
                {
                  q: "چگونه پلنر را روی گوشی موبایل خود به صورت ویجت داشته باشم؟",
                  a: "پس از باز کردن فایل در اپلیکیشن گوگل شیت موبایل، گزینه Add to Home Screen را بزنید تا یک آیکون اختصاصی و شبیه به اپلیکیشن روی صفحه اصلی گوشی شما قرار گیرد و با یک ضربه عادات خود را علامت بزنید.",
                },
                {
                  q: "چگونه پلنر را برای ماه‌ها و سال‌های بعد مجدداً استفاده کنم؟",
                  a: "یک دکمه پاکسازی هوشمند در فایل تعبیه شده است که بدون آسیب به فرمول‌ها، شیت را برای ماه جدید بازنشانی می‌کند. همچنین لینک کپی اولیه همواره نزد شماست و می‌توانید هر تعداد نسخه کپی جدید که بخواهید در درایو خود بسازید.",
                },
                {
                  q: "اگر دستم بخورد و یک فرمول یا سطر پاک شود چه کار کنم؟",
                  a: "گوگل شیت دارای تاریخچه تغییرات خودکار (Version History) است و با ۲ کلیک به هر تاریخی در گذشته بازمی‌گردد. علاوه بر این، پشتیبانی تلگرام وایچ در هر مرحله آماده راهنمایی و حل مشکلات فنی شماست.",
                },
              ].map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-border/80 bg-secondary/30 overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 text-right font-bold text-xs sm:text-sm text-foreground hover:text-primary transition-colors cursor-pointer select-none"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground",
                        openFaqIndex === idx && "rotate-180 text-primary"
                      )}
                    />
                  </button>
                  {openFaqIndex === idx && (
                    <div className="px-4 pb-4 pt-1 text-xs leading-6 text-muted-foreground border-t border-border/40">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
