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
  const isCopilot = product.slug.includes("copilot");
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

        {isCopilot && (
          <CopilotDetailContent
            product={product}
            activeTab={activeTab}
            openFaqIndex={openFaqIndex}
            toggleFaq={toggleFaq}
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
      {activeTab === "features" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              مدل‌های فعال و مشخصات رسمی ChatGPT Plus (OpenAI)
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              اشتراک رسمی ChatGPT Plus مجهز به آخرین معماری‌های استدلالی و چندرسانه‌ای شرکت OpenAI است؛ شامل موتور اصلی استدلال و هوش پیشرفته <strong>GPT-6.1 Terra</strong> و مدل همه‌منظوره چندوجهی <strong>GPT-5.6</strong>، مدل‌های تخصصی منطق و ریاضیات <strong>o1</strong> و <strong>o3-mini</strong>، مدل پرسرعت <strong>GPT-4o</strong>، فضای کاری نوین <strong>Prism</strong>، بوم تعاملی <strong>Canvas</strong> و تولید ویدیو با <strong>Sora</strong>.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-primary/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Brain className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">مدل‌های پرچم‌دار GPT-6.1 Terra و GPT-5.6</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                موتور اصلی استدلال و هوش پیشرفته GPT-6.1 Terra به همراه مدل همه‌منظوره چندوجهی GPT-5.6 برای پاسخگویی به پیچیده‌ترین مسائل علمی، تحلیل داده و تولید محتوای چندرسانه‌ای.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-emerald-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Code className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">خانواده استدلال عمیق o1 و o3-mini</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                حل مسائل پیچیده المپیادی، مهندسی پیشرفته، اثبات‌های ریاضی و خطایابی ساختاری عمیق کدها با تفکر گام‌به‌گام و قابلیت تنظیم سطح تفکر.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-purple-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <FileText className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">محیط کاری Prism و بوم Canvas</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                ورک‌اسپیس اختصاصی Prism برای اسناد ساختاریافته و پژوهش‌های چندمرحله‌ای، در کنار بوم تعاملی Canvas برای ویرایش سایدبای‌ساید کدها و مقالات بدون پرامپت تکراری.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-blue-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <FolderGit2 className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">پروژه‌ها و حافظه ایزوله (Projects & Memory)</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                پوشه‌های کاری اختصاصی با حافظه تفکیک‌شده (تا سقف ۲۵ فایل ۵۱۲ مگابایتی در پلن Plus) بدون تداخل اطلاعات، به همراه قابلیت چندحسابی (Account Switching) در اپلیکیشن.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-amber-400/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300">
                <Mic className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">حالت صوتی زنده با نمایش در Dynamic Island</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                حالت صوتی پیشرفته (Advanced Voice Mode) با پردازش بلادرنگ تن صدا، پشتیبانی از تعامل در پس‌زمینه و نمایش زنده وضعیت گفتگو در داینامیک آیلند.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-rose-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Palette className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">تولید ویدیو با Sora و تصاویر Ultra HD با DALL-E 3</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                ساخت ویدیوهای کوتاه واقع‌گرایانه با موتور Sora و خلق تصاویر خیره‌کننده با وضوح Ultra HD توسط DALL-E 3 و مدل چندرسانه‌ای سبک GPT-4o.
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
              چت‌جی‌پی‌تی پلاس ابزاری جامع برای ارتقای بازدهی تیم‌های مهندسی، پژوهشگران و مدیران محصول است:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Code className="h-4 w-4 text-primary" />
                <span>برنامه‌نویسان و مهندسان سیستم</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                استفاده از مدل‌های o1 و o3-mini برای خطایابی ساختار کد و الگوریتم‌های پیچیده، در کنار بوم تعاملی Canvas برای ویرایش سایدبای‌ساید کدهای فرانت‌اند و بک‌اند.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <FileText className="h-4 w-4 text-emerald-400" />
                <span>پژوهشگران، نویسندگان و تولیدکنندگان محتوا</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                بهره‌گیری از محیط کاری Prism برای اسناد ساختاریافته، پژوهش‌های چندمرحله‌ای، ادغام منابع و تولید ویدیو با Sora و تصاویر Ultra HD با DALL-E 3.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <FolderGit2 className="h-4 w-4 text-purple-400" />
                <span>مدیران پروژه و کسب‌وکارها</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                تفکیک پروژه‌ها در پوشه‌های کاری مستقل با حافظه ایزوله (تا سقف ۲۵ فایل ۵۱۲ مگابایتی) و جابه‌جایی سریع میان حساب‌های فعال با Account Switching.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Mic className="h-4 w-4 text-amber-300" />
                <span>دانشجویان و متخصصان در حال حرکت</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                مکالمه صوتی طبیعی بدون تأخیر با Advanced Voice Mode، تعامل در پس‌زمینه و پایش وضعیت گفتگو از طریق Dynamic Island در گوشی‌های هوشمند.
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
              جدول مقایسه سرشاخ‌به‌سرشاخ: ChatGPT Plus (وایچ) در برابر نسخه رایگان
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              تفاوت‌های بنیادین نسخه رسمی Plus با اکانت رایگان:
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-secondary/50 text-foreground font-bold">
                  <th className="p-3.5 sm:p-4">قابلیت و امکانات</th>
                  <th className="p-3.5 sm:p-4 text-emerald-400 font-black">ChatGPT Plus (VAICH)</th>
                  <th className="p-3.5 sm:p-4 text-muted-foreground font-medium">اکانت رایگان (Free)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted-foreground">
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">مدل‌های پرچم‌دار GPT-6.1 Terra و o3</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">دسترسی بالا با اولویت مطلق پهنای باند</td>
                  <td className="p-3.5 sm:p-4">عدم دسترسی دائم و سقف بسیار فشرده</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">محیط‌های کاری Prism و Canvas</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">دسترسی نامحدود جهت نگارش و ویرایش همزمان</td>
                  <td className="p-3.5 sm:p-4">مسدود شدن امکانات در ساعات شلوغی</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">پروژه‌ها و ظرفیت حافظه (Project Memory)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">پشتیبانی کامل از ۲۵ فایل ۵۱۲ مگابایتی</td>
                  <td className="p-3.5 sm:p-4">تنها ۵ فایل در پروژه‌ها با ظرفیت محدود</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">تولید محتوای پیشرفته (Sora و DALL-E 3)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">تولید ویدیو با Sora و تصاویر Ultra HD با DALL-E 3</td>
                  <td className="p-3.5 sm:p-4">محدودیت شدید و کیفیت استاندارد</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">حالت صوتی زنده Advanced Voice</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">فعال با پشتیبانی از Dynamic Island و تعامل پس‌زمینه</td>
                  <td className="p-3.5 sm:p-4">محدود به تست چند دقیقه‌ای</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">تحلیل کدهای پایتون و فایل‌های حجیم</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">اجرای کدهای تحلیلی در محیط امن بدون قطعی</td>
                  <td className="p-3.5 sm:p-4">محدودیت‌های مکرر در پردازش داده‌ها</td>
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
              نحوه فعال‌سازی قانونی و تضمین سلامت ۱۰۰٪ در وایچ
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              سفارش‌های چت‌جی‌پی‌تی پلاس در وایچ به صورت ۱۰۰٪ قانونی روی ایمیل کاربر یا اکانت اختصاصی فعال می‌شوند؛ بدون ریسک لیمیت منطقه‌ای و با تضمین پایداری کامل تا آخرین روز اشتراک.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۱
              </div>
              <h4 className="text-sm font-bold text-foreground">ثبت قانونی روی ایمیل شخصی</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                فعال‌سازی مستقیم با کارت‌های اعتباری معتبر بین‌المللی بدون نیاز به ارسال رمز عبور جیمیل.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۲
              </div>
              <h4 className="text-sm font-bold text-foreground">بدون ریسک لیمیت یا بن</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                به دلیل پرداخت قانونی و تمیز، هیچ خطری حساب کاربری، تاریخچه گفتگوها یا پروژه‌های شما را تهدید نمی‌کند.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۳
              </div>
              <h4 className="text-sm font-bold text-foreground">پوشش کامل گارانتی ۳۰ روزه</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                تضمین پایداری کامل تا آخرین روز اشتراک با پشتیبانی سریع و شبانه‌روزی تیم وایچ در تلگرام.
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
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">موتورهای استدلال و هوش پیشرفته</td>
                    <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">GPT-6.1 Terra + GPT-5.6 + خانواده استدلال o1 و o3-mini + GPT-4o</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">محیط‌های کاری اختصاصی</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">ورک‌اسپیس Prism، بوم تعاملی Canvas، قابلیت چندحسابی Account Switching</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">تولید چندرسانه‌ای و صوت</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">تولید ویدیو با Sora، تصاویر Ultra HD با DALL-E 3، حالت صوتی با نمایش در Dynamic Island</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">ظرفیت پروژه‌ها (Project Memory)</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">تا سقف ۲۵ فایل ۵۱۲ مگابایتی با حافظه کاملاً تفکیک‌شده</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">مدت اعتبار و ضمانت</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">۱ ماهه قانونی با ضمانت سلامت و پایداری کامل تا آخرین روز</td>
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
                  q: "محیط کاری Prism چه تفاوتی با چت معمولی دارد؟",
                  a: "محیط کاری Prism یک فضای سازمان‌یافته برای نگارش اسناد ساختاریافته، مقالات طولانی و پژوهش‌های چندمرحله‌ای است که امکان ضمیمه کردن منابع و ارجاعات متنی را به صورت مستقیم در اختیار کاربر قرار می‌دهد.",
                },
                {
                  q: "آیا مدل‌های استدلالی o3-mini و o1 دارای سهمیه استفاده در پلاس هستند؟",
                  a: "بله؛ کاربران پلن Plus به بالاترین سقف بین‌المللی استفاده از مدل‌های سری استدلال عمیق o1 و o3-mini با اولویت پردازش سرورها دسترسی دارند.",
                },
                {
                  q: "قابلیت Account Switching و حافظه پروژه‌ها چگونه عمل می‌کند؟",
                  a: "این قابلیت به شما اجازه می‌دهد بین ۲ حساب فعال روی اپلیکیشن بدون نیاز به خروج جا‌به‌جا شوید. همچنین بخش Projects با ایزوله‌سازی حافظه هر پروژه، مانع از تداخل اطلاعات کاری شما می‌شود.",
                },
                {
                  q: "نحوه فعال‌سازی روی ایمیل شخصی به چه صورت است؟",
                  a: "اشتراک به صورت ۱۰۰٪ قانونی و رسمی روی ایمیل شخصی خودتان فعال می‌شود و نیازی به ارسال پسورد ایمیل نیست. تمامی چت‌ها و اسناد خصوصی باقی می‌مانند.",
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
      {activeTab === "features" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              مدل‌های نسل جدید و مشخصات پردازشی Claude Pro (Anthropic)
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              سرویس Claude Pro مجهز به برترین مدل‌های توسعه نرم‌افزار و استدلال جهان از شرکت Anthropic است؛ شامل مدل پرچم‌دار <strong>Claude Sonnet 5.5</strong> (صدرنشین جهانی برنامه‌نویسی و ساخت کامپوننت)، مدل فوق‌سنگین استدلالی <strong>Claude Opus 5.5</strong>، رده پردازشی <strong>Claude Fable 5.1</strong> برای اسناد چندصدصفحه‌ای، مدل سریع <strong>Claude Haiku 5.5</strong> با کانتکست ۱ میلیون توکنی، سیستم تفکر تطبیقی <strong>Adaptive Thinking</strong>، محیط زنده <strong>Artifacts 2.0</strong> و دستیار مهندسی ترمینال <strong>Claude Code</strong>.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-primary/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Code className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">پرچم‌دار توسعه نرم‌افزار Claude Sonnet 5.5</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                برترین مدل کدنویسی حال حاضر جهان با تسلط بی‌رقیب بر ریفکتورینگ پروژه‌های بزرگ، حل باگ‌های ریشه‌ای و ساخت کدهای ماژولار.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-emerald-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Brain className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">مدل فوق‌سنگین Claude Opus 5.5 و Fable 5.1</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                طراحی‌شده برای پروژه‌های طولانی، محاسبات آکادمیک و اسناد چندصدصفحه‌ای همراه با سیستم تفکر تطبیقی (Adaptive Thinking) برای افزایش دقت تا ۱۰۰٪.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-purple-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Laptop className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">فضای کاری زنده Artifacts 2.0</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                رندر زنده و تعاملی کامپوننت‌های مدرن، وب‌اپلیکیشن‌های کامل، شبیه‌سازها و نمودارهای SVG در صفحه‌ای مجزا بدون نیاز به لوکال هاست.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-blue-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">کانتکست ۱ میلیون توکنی با خروجی ۱۲۸K</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                مطالعه و خلاصه‌سازی کل مخزن‌های GitHub یا کتاب‌های چندجلدی در یک درخواست با پنجره متنی عظیم ۱M توکنی و خروجی فوق‌العاده ۱۲۸,۰۰۰ توکنی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-amber-400/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300">
                <FolderGit2 className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">دستیار ترمینال Claude Code و Projects</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                تحلیل و اجرای دستورات مستقیم ترمینال و پوش به گیت‌هاب با Claude Code، در کنار ساخت پروژه‌های تیمی و آپلود راهنمای برند و پایگاه‌های دانش محلی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-rose-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">مدل فوق‌سریع Claude Haiku 5.5</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                پردازش فوق‌سریع کارهای روتین و کم‌هزینه با حفظ کانتکست ۱ میلیون توکنی و نثر فارسی بی‌رقیب بدون لحن ماشینی و ترجمه‌ای.
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
              موارد استفاده تخصصی و صنعتی Claude Pro
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              کلود پرو در حوزه‌هایی که نیازمند دقت کدنویسی ۱۰۰٪ و تفکر تحلیلی عمیق هستند استاندارد طلایی صنعت است:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Code className="h-4 w-4 text-primary" />
                <span>مهندسان ارشد نرم‌افزار و تیم‌های DevOps</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                بهره‌گیری از Claude Sonnet 5.5 و ابزار Claude Code CLI برای تحلیل مستقیم ترمینال، اجرای تست‌ها، رفع باگ‌های پیچیده و پوش کدهای تست‌شده روی GitHub.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Laptop className="h-4 w-4 text-emerald-400" />
                <span>طراحان فرانت‌اند و سازندگان وب‌اپلیکیشن</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                رندر بلادرنگ اپلیکیشن‌های کامل و نمودارهای وکتور SVG در پنل مستقل Artifacts 2.0 بدون نیاز به راه‌اندازی سرور محلی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Brain className="h-4 w-4 text-purple-400" />
                <span>محققان آکادمیک و تیم‌های حقوقی</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                استفاده از مدل‌های Claude Opus 5.5 و Claude Fable 5.1 با تفکر تطبیقی (Adaptive Thinking) برای پردازش اسناد چندصدصفحه‌ای با خروجی تا ۱۲۸K توکن.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <FolderGit2 className="h-4 w-4 text-amber-300" />
                <span>تیم‌های سازمانی و شرکت‌های فناوری</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                ایجاد پروژه‌های تیمی در Claude Projects، بارگذاری راهنماهای برند و استانداردهای کدنویسی سازمانی و یکپارچه‌سازی پایگاه‌های دانش محلی.
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
              جدول مقایسه: اشتراک Claude Pro (وایچ) در برابر نسخه رایگان
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              تفاوت‌های بنیادین نسخه حرفه‌ای کلود در مقایسه با محدودیت‌های نسخه رایگان:
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-secondary/50 text-foreground font-bold">
                  <th className="p-3.5 sm:p-4">ویژگی و دسترسی</th>
                  <th className="p-3.5 sm:p-4 text-emerald-400 font-black">Claude Pro (VAICH)</th>
                  <th className="p-3.5 sm:p-4 text-muted-foreground font-medium">اکانت رایگان (Free)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted-foreground">
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">مدل‌های Sonnet 5.5 و Opus 5.5</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">دسترسی دائم در شلوغ‌ترین ساعات کاری بدون صف</td>
                  <td className="p-3.5 sm:p-4">سوییچ سریع به مدل‌های پایه و محدود</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">سقف ارسال پیام و حجم پردازش</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">افزایش سقف استفاده تا بیش از ۵ برابر نسخه عادی</td>
                  <td className="p-3.5 sm:p-4">اخطار سریع اتمام پیام بعد از چند پرسش</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">سیستم تفکر تطبیقی (Adaptive Thinking)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">فعال با تفکر عمیق و تنظیم هوشمند زمان تحلیل</td>
                  <td className="p-3.5 sm:p-4">عدم دسترسی پایدار به تفکر عمیق</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">آپلود اسناد و مخازن کد (Claude Projects)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">پنجره متنی ۱ میلیون توکنی با خروجی ۱۲۸K توکن</td>
                  <td className="p-3.5 sm:p-4">محدودیت جدی در آپلود داکیومنت و حجم فایل</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">محیط زنده Artifacts 2.0 و Claude Code</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">اجرای نامحدود وب‌اپلیکیشن‌ها و دستورات ترمینال</td>
                  <td className="p-3.5 sm:p-4">دسترسی با تأخیر و محدود به ترافیک سرور</td>
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
              تحویل اختصاصی، فعال‌سازی قانونی و گارانتی سلامت کلود پرو
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              سرویس کلود پرو وایچ با پرداخت مستقیم ارزی روی ایمیل شخصی شما فعال می‌شود و کاملاً قانونی و بدون ریسک لیمیت منطقه‌ای است.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۱
              </div>
              <h4 className="text-sm font-bold text-foreground">شارژ قانونی روی ایمیل شما</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                فعال‌سازی اختصاصی بدون واسطه و بدون نیاز به ارسال رمز عبور جیمیل شخصی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۲
              </div>
              <h4 className="text-sm font-bold text-foreground">پایداری دائم بدون مسدودی</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                پرداخت از طریق مسترکارت‌های معتبر شرکتی جهت جلوگیری از هرگونه حساسیت سرورهای آنتروپیک.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۳
              </div>
              <h4 className="text-sm font-bold text-foreground">ضمانت کامل ۳۰ روزه</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                پوشش ۱۰۰٪ گارانتی تعویض و پاسخگویی سریع تلگرام در تمام ۳۰ روز استفاده.
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
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">مدل‌های پرچم‌دار پردازشی</td>
                    <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">Claude Sonnet 5.5 + Claude Opus 5.5 + Claude Fable 5.1 + Claude Haiku 5.5</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">پنجره متنی و خروجی توکن</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">کانتکست عظیم ۱ میلیون توکنی (1M) با خروجی فوق‌العاده ۱۲۸,۰۰۰ توکنی</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">امکانات مهندسی انحصاری</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">سیستم تفکر تطبیقی Adaptive Thinking، محیط زنده Artifacts 2.0، دستیار ترمینال Claude Code</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">مدت اعتبار و پشتیبانی</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">۳۰ روز کامل قانونی با پوشش ۱۰۰٪ گارانتی تعویض و پشتیبانی تلگرام</td>
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
                  q: "سیستم تفکر تطبیقی (Adaptive Thinking) چیست و چه مزیتی دارد؟",
                  a: "این فناوری به کاربر اجازه می‌دهد زمان فکر کردن مدل را پیش از پاسخ‌دهی به صورت هوشمند تنظیم کند؛ این امر ضریب دقت را در حل پروژه‌های پیچیده معماری نرم‌افزار و ریاضیات سنگین تا ۱۰۰٪ افزایش می‌دهد.",
                },
                {
                  q: "خروجی ۱۲۸,۰۰۰ توکنی به چه معناست؟",
                  a: "برخلاف اکثر مدل‌ها که طول پاسخ محدودی دارند، کلود پرو می‌تواند تا ۱۲۸ هزار توکن (معادل کل کدهای چند ماژول یا کتابچه‌ای کامل) را در یک نوبت به عنوان خروجی تحویل دهد.",
                },
                {
                  q: "دستیار ترمینال Claude Code چگونه کار می‌کند؟",
                  a: "ابزار Claude Code به شما اجازه می‌دهد مستقیماً از طریق ترمینال کدهای خود را ادیت کنید، تست‌های خودکار را اجرا کرده و تغییرات را مستقیماً روی مخازن گیت‌هاب پوش نمایید.",
                },
                {
                  q: "آیا تاریخچه پروژه‌ها در اکانت من خصوصی می‌ماند؟",
                  a: "بله؛ فعال‌سازی به صورت اختصاصی بر روی ایمیل شخصی خودتان انجام می‌شود و تمام پروژه‌ها، پرامپت‌ها و اسناد در محیط کاربری شما امن و خصوصی باقی می‌مانند.",
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
// ۳. جزئیات محصول Google Gemini Advanced (پلن‌های ۶۰ روزه و ۱۸ ماهه)
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
      {activeTab === "features" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              مدل‌ها و موتورهای فعال Google Gemini Advanced
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              سرویس Gemini Advanced مجهز به پرچم‌دار غول‌آسای گوگل <strong>Gemini 4 Argon</strong> (با پشتیبانی از طول خروجی بی‌سابقه تا ۱,۰۰۰,۰۰۰ توکن)، مدل استدلال عمیق <strong>Gemini 3 Deep Think</strong> برای داده‌کاوی، فیزیک، مدل‌سازی مالی و معماری سیستم، مدل‌های پرسرعت <strong>Gemini 3.8 Flash</strong> و <strong>Gemini 3.8 Flash Cyber</strong>، درک ویدیوهای زنده سازمانی (<strong>Agentic Video Understanding</strong>)، پیوند کامل با اکوسیستم Workspace و کانتکست ۲ میلیون توکنی پایدار است.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-primary/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Brain className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">پرچم‌دار غول‌آسای Gemini 4 Argon</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                معماری انقلابی چندوجهی با پشتیبانی از طول خروجی بی‌سابقه تا ۱,۰۰۰,۰۰۰ توکن برای تولید جامع‌ترین گزارش‌های تحلیلی و مستندات نرم‌افزاری.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-emerald-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Zap className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">مدل تحلیل استدلال عمیق Gemini 3 Deep Think</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                بهینه‌سازی‌شده برای مسائل داده‌کاوی، محاسبات فیزیک، مدل‌سازی مالی پیشرفته و معماری سیستم‌های پیچیده با دقت استدلالی خارق‌العاده.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-purple-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Compass className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">درک ویدیویی زنده سازمانی (Agentic Video)</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                پیمایش فریم‌به‌فریم ویدیوهای طولانی، استخراج همزمان صوت و تصویر و پاسخ دقیق به جزئیات بصری بدون نیاز به تبدیل به متن.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-blue-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">کانتکست پایدار ۲ میلیون توکنی با بالاترین Recall</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                پردازش اسناد سازمانی غول‌پیکر، کتاب‌های قطور و دیتابیس‌های چند ده‌هزار سطری با بالاترین نرخ بازیابی اطلاعات در میان تمام مدل‌ها.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-amber-400/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300">
                <FolderGit2 className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">پیوند کامل با اکوسیستم Google Workspace</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                اتصال و تحلیل خودکار میان Google Drive، Gmail، Docs و Keep بدون نیاز به دانلود و آپلود مجدد فایل‌ها، همراه با سندباکس پایتون و Imagen 3.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-rose-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Flame className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">مدل‌های سریع کاری Gemini 3.8 Flash & Cyber</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                پاسخ‌دهی برق‌آسا برای وظایف متنی و عملیاتی روزمره، در کنار مزیت ویژه پلن ۱۸ ماهه وایچ با بیش از ۹۰٪ تخفیف اقتصادی بدون دغدغه تمدید ماهانه.
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
              موارد استفاده تخصصی Gemini Advanced
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              قابلیت‌های چندوجهی جمینای ادونسد سناریوهای بی‌نظیری را برای متخصصان و تیم‌های داده‌محور فراهم کرده است:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span>تحلیلگران مالی، تریدرها و داده‌کاوان</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                بهره‌گیری از Gemini 3 Deep Think برای تحلیل مدل‌های رگرسیون، پیش‌بینی ریسک مالی، تحلیل دیتابیس‌های چند ده‌هزار سطری و اجرای محاسبات پایتون در فضای ابری ایزوله.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Laptop className="h-4 w-4 text-emerald-400" />
                <span>تولیدکنندگان ویدیو و محتوای رسانه‌ای</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                پیمایش ویدیویی فریم‌به‌فریم (Agentic Video Understanding) برای استخراج تایم‌کدهای دقیق از جلسات طولانی و تولید تصاویر واقع‌گرایانه با Imagen 3.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <GraduationCap className="h-4 w-4 text-purple-400" />
                <span>دانشجویان، پژوهشگران و اساتید دانشگاهی</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                بارگذاری کتب رفرنس چندهزار صفحه‌ای در کانتکست ۲ میلیون توکنی، تولید خروجی‌های ساختاریافته تا ۱ میلیون توکن در Gemini 4 Argon و پادکست‌های NotebookLM.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <FolderGit2 className="h-4 w-4 text-amber-300" />
                <span>استارتاپ‌ها و مدیران سازمانی (پلن ۱۸ ماهه)</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                دسترسی پایدار ۱۸ ماهه با تخفیف بیش از ۹۰ درصدی بدون نگرانی از نوسانات ارز، همراه با اتصال کامل به Google Drive، جیمیل و اسناد Workspace.
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
              جدول مقایسه: Gemini Advanced (وایچ) در برابر نسخه رایگان گوگل
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              تفاوت چشمگیر توانایی‌های پردازشی و سقف کانتکست:
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-secondary/50 text-foreground font-bold">
                  <th className="p-3.5 sm:p-4">ویژگی</th>
                  <th className="p-3.5 sm:p-4 text-emerald-400 font-black">Gemini Advanced (VAICH)</th>
                  <th className="p-3.5 sm:p-4 text-muted-foreground font-medium">نسخه رایگان جمینای</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted-foreground">
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">مدل‌های پرچم‌دار پردازشی</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">Gemini 4 Argon + استدلال عمیق Gemini 3 Deep Think</td>
                  <td className="p-3.5 sm:p-4">مدل پایه بدون قابلیت‌های تحلیلی عمیق</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">پنجره متنی (Context Window)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">۲,۰۰۰,۰۰۰ توکن با بالاترین نرخ Recall و خروجی ۱M توکن</td>
                  <td className="p-3.5 sm:p-4">۳۲,۰۰۰ توکن با خطای پر شدن سریع حافظه</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">درک ویدیویی سازمانی (Agentic Video)</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">پیمایش فریم‌به‌فریم ویدیوهای طولانی و استخراج صوت و تصویر</td>
                  <td className="p-3.5 sm:p-4">غیرفعال</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">اتصال به اکوسیستم Workspace</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">جستجو و تحلیل خودکار میان Drive, Gmail, Docs و Keep</td>
                  <td className="p-3.5 sm:p-4">بسیار محدود</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">صرفه اقتصادی و پایداری</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">پلن ۱۸ ماهه با ۹۱٪ تخفیف بدون دغدغه تمدید ماهانه</td>
                  <td className="p-3.5 sm:p-4">پایین‌ترین اولویت پردازشی در زمان ترافیک</td>
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
              اکانت‌های Gemini Advanced در وایچ با بهینه‌ترین سرورها و تضمین کامل پایداری ارائه می‌شوند:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۱
              </div>
              <h4 className="text-sm font-bold text-foreground">تحویل سریع ظرف کمتر از ۱ ساعت</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                اطلاعات ورود و راهنمای اتصال سریع پس از ثبت سفارش در تلگرام تقدیم می‌شود.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۲
              </div>
              <h4 className="text-sm font-bold text-foreground">سرورهای فوق‌العاده پایدار</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                بدون قطعی و بدون افت کیفیت حتی در ساعات پرترافیک کاری بین‌المللی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۳
              </div>
              <h4 className="text-sm font-bold text-foreground">تضمین پایداری کامل دوره</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                پوشش گارانتی تعویض و پاسخگویی اختصاصی در تمام طول دوره ۶۰ روزه یا ۱۸ ماهه.
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
              جدول مشخصات سریع Gemini Advanced
            </h3>
            <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
              <table className="w-full text-right text-xs sm:text-sm">
                <tbody className="divide-y divide-border/60">
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground w-1/3">شرکت توسعه‌دهنده</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">Google (ایالات متحده آمریکا)</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">موتورهای فعال</td>
                    <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">Gemini 4 Argon + استدلال عمیق Gemini 3 Deep Think + Gemini 3.8 Flash & Cyber</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">پنجره متنی و طول خروجی</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">کانتکست ۲ میلیون توکن با بالاترین نرخ Recall و پشتیبانی از خروجی تا ۱,۰۰۰,۰۰۰ توکن</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">قابلیت‌های متمایز</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">Agentic Video Understanding، پیوند با Google Workspace (Drive, Gmail, Docs, Keep)، سندباکس پایتون، Imagen 3</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">مدت دوره و ضمانت</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">
                      {is18Month ? "۱۸ ماه کامل اقتصادی (با تخفیف بیش از ۹۰٪)" : "۶۰ روز کامل"} همراه با گارانتی سلامت ۱۰۰٪
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
              پرسش‌های متداول خریداران Gemini Advanced
            </h3>

            <div className="space-y-3">
              {[
                {
                  q: "خروجی ۱,۰۰۰,۰۰۰ توکنی در Gemini 4 Argon چه کاربردی دارد؟",
                  a: "این قابلیت منحصربه‌فرد به مدل اجازه می‌دهد در یک پاسخ، کتاب‌های کامل، مستندات نرم‌افزاری چندین صفحه‌ای و کدهای جامع بدون قطع شدن یا خلاصه کردن اجباری تولید کند.",
                },
                {
                  q: "منظور از Agentic Video Understanding چیست؟",
                  a: "جمینای می‌تواند ویدیوهای سازمانی و دوره‌های آموزشی طولانی را فریم‌به‌فریم بررسی کرده و جزئیات صوتی و بصری را مستقیماً بدون نیاز به تبدیل به متن، تحلیل کند.",
                },
                {
                  q: "تفاوت پلن ۶۰ روزه با پلن ۱۸ ماهه در چیست؟",
                  a: "از نظر دسترسی فنی به مدل‌ها هر دو پلن یکسان هستند؛ اما پلن ۱۸ ماهه با تخفیف بیش از ۹۰ درصدی، بالاترین صرفه اقتصادی را برای دانشجویان، تریدرها و شرکت‌ها به همراه دارد و از جهش‌های ارزی جلوگیری می‌کند.",
                },
                {
                  q: "اتصال به Google Workspace چگونه کار می‌کند؟",
                  a: "شما می‌توانید مستقیماً از داخل جمینای، ایمیل‌های جیمیل، فایل‌های متنی Docs و داکیومنت‌های Google Drive خود را جستجو و تحلیل کنید بدون اینکه نیاز به دانلود و آپلود دستی فایل‌ها باشد.",
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
// ۴. جزئیات محصول Microsoft Copilot Pro / 365
// =========================================================================
function CopilotDetailContent({
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
      {activeTab === "features" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              مدل‌های ادغام‌شده و امکانات Microsoft Copilot Pro / 365
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              سرویس رسمی Microsoft Copilot Pro با بهره‌گیری از ترکیبی از برترین مدل‌های هوش مصنوعی دنیا شامل <strong>OpenAI GPT-5.6</strong> و <strong>Claude Sonnet 5</strong> برای تسک‌های تخصصی کدنویسی و نگارش، دستیار تخصصی <strong>Cowork</strong> با اتوماسیون محلی مرورگر مایکروسافت اج (Local Browser Automation)، اجرای ایجنت‌های تخصصی در Word, Excel, PowerPoint و Outlook با <code>@agent</code>، مهارت‌های شخصی‌سازی‌شده <strong>Personal Skills</strong> و طراحی اتوماسیون در <strong>Copilot Studio</strong>، قوی‌ترین ابزار دفاتر و تیم‌های کاری است.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-primary/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Brain className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">ترکیب پرچم‌داران OpenAI GPT-5.6 و Claude Sonnet 5</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                بهره‌گیری همزمان از هوش چندوجهی GPT-5.6 و قدرت کدنویسی و ریفکتورینگ Claude Sonnet 5 بر اساس ماهیت تسک مورد نظر.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-emerald-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Laptop className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">دستیار Cowork و اتوماسیون محلی مرورگر Edge</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                اجرای خودکار فرآیندهای وب، پر کردن فرم‌ها و گردآوری داده‌ها با اتوماسیون محلی در مرورگر Microsoft Edge.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-purple-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Code className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">فراخوانی ایجنت‌ها با agent@ در آفیس</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                اجرای ایجنت‌های تخصصی داخل Word, Excel, PowerPoint و Outlook تنها با تایپ کردن <code>@agent</code> در چت.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-blue-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <FileText className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">مهارت‌های شخصی‌سازی‌شده (Personal Skills)</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                ساخت اسکیل‌های تکرارپذیر روی OneDrive و SharePoint به صورت فایل‌های استاندارد Markdown جهت بهینه‌سازی جریان کاری.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-amber-400/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300">
                <BarChart3 className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">تحلیل پیشرفته اکسل و استخراج Change History</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                تحلیل فوق‌پیشرفته شیت‌های مالی در اکسل، فرمول‌نویسی خودکار و استخراج تغییرات تاریخی فایل‌های حسابداری.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-rose-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Palette className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">طراحی اسلایدها و استودیوی Copilot Studio</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                طراحی خودکار اسلایدهای پرزنتیشن بر اساس هویت بصری برند در پاورپوینت و ساخت دستیارهای کاری در Copilot Studio بدون نیاز به کدنویسی.
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
              موارد استفاده تخصصی Microsoft Copilot Pro
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              کوپایلوت پرو بهترین ابزار برای محیط‌های کاری مدرن، دفاتر شرکتی و تحلیلگران است:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <BarChart3 className="h-4 w-4 text-primary" />
                <span>تحلیلگران مالی، حسابداران و مدیران اداری</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                فرمول‌نویسی خودکار در اکسل، تحلیل روندهای مالی، بررسی سابقه تغییرات اسناد (Change History) و مدل‌سازی آماری.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <FileText className="h-4 w-4 text-emerald-400" />
                <span>مدیران پروژه و کارکنان سازمانی</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                نگارش خودکار نامه‌ها و گزارش‌ها در Word، مدیریت ایمیل‌ها و پیگیری جلسات در Outlook و Teams با ایجنت‌های تخصصی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Palette className="h-4 w-4 text-purple-400" />
                <span>تیم‌های بازاریابی، فروش و ارائه‌دهندگان</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                تبدیل یادداشت‌های خام به ارائه‌های چنداسلایدی حرفه‌ای در PowerPoint با پالت رنگی و استایل سازمانی برند شما.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Laptop className="h-4 w-4 text-amber-300" />
                <span>توسعه‌دهندگان سازمانی (Copilot Studio)</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                طراحی ربات‌ها و دستیارهای اتوماسیون سازمانی روی داده‌های محلی شرکت بدون نیاز به کدنویسی.
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
              جدول مقایسه: Copilot Pro در برابر نسخه عادی کوپایلوت
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              تفاوت دسترسی‌های اداری و هوش مصنوعی در پلن پرو:
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-secondary/50 text-foreground font-bold">
                  <th className="p-3.5 sm:p-4">ویژگی</th>
                  <th className="p-3.5 sm:p-4 text-emerald-400 font-black">Copilot Pro (VAICH)</th>
                  <th className="p-3.5 sm:p-4 text-muted-foreground font-medium">نسخه عادی وب</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted-foreground">
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">ادغام داخل Word, Excel, PowerPoint, Outlook</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">فعال با دسترسی مستقیم و فراخوانی ایجنت‌ها با agent@</td>
                  <td className="p-3.5 sm:p-4">غیرفعال (فقط در محیط وب کار می‌کند)</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">مدل‌های هوش مصنوعی فعال</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">OpenAI GPT-5.6 + Claude Sonnet 5</td>
                  <td className="p-3.5 sm:p-4">مدل پایه با سقف محدود</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">دستیار Cowork و اتوماسیون محلی Edge</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">اجرای خودکار کارهای مرورگر و فرم‌ها</td>
                  <td className="p-3.5 sm:p-4">غیرفعال</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">مهارت‌های Markdown در OneDrive / SharePoint</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">ساخت Personal Skills تکرارپذیر سازمانی</td>
                  <td className="p-3.5 sm:p-4">غیرفعال</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">استودیوی بدون کد Copilot Studio</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">ساخت ربات‌های اختصاصی بدون کدنویسی</td>
                  <td className="p-3.5 sm:p-4">نیازمند لایسنس مجزای انترپرایز</td>
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
              مراحل تحویل قانونی و ضمانت سلامت اکانت
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              اشتراک مایکروسافت کوپایلوت پرو به صورت رسمی بر روی اکانت شخصی شما شارژ شده و تمام اسناد آفیس شما محفوظ می‌ماند.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۱
              </div>
              <h4 className="text-sm font-bold text-foreground">فعال‌سازی روی حساب مایکروسافت</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                لینک یا فعال‌سازی مستقیم بر روی ایمیل شما با لایسنس رسمی بدون ریسک مسدودی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۲
              </div>
              <h4 className="text-sm font-bold text-foreground">همگام‌سازی فوری در آفیس ۳۶۵</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                آیکون کوپایلوت بلافاصله در نرم‌افزارهای ورد، اکسل و پاورپوینت شما فعال می‌شود.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۳
              </div>
              <h4 className="text-sm font-bold text-foreground">گارانتی سلامت ۳۰ روزه</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                پوشش کامل تعویض و رفع مشکل در تمام طول دوره همراه با پشتیبانی تلگرام.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* تب ۵: جدول مشخصات سریع و پرسش‌های متداول (FAQ با Accordion) */}
      {activeTab === "faq" && (
        <div className="space-y-8">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Zap className="h-5 w-5 text-amber-300" />
              جدول مشخصات سریع Microsoft Copilot Pro
            </h3>
            <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
              <table className="w-full text-right text-xs sm:text-sm">
                <tbody className="divide-y divide-border/60">
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground w-1/3">شرکت توسعه‌دهنده</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">Microsoft (مایکروسافت)</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">مدل‌های پردازشی ادغام‌شده</td>
                    <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">OpenAI GPT-5.6 + Claude Sonnet 5</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">سازگاری نرم‌افزاری</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">Word, Excel, PowerPoint, Outlook, OneNote و مرورگر Microsoft Edge</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">ابزارهای اختصاصی</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">دستیار Cowork، مهارت‌های Personal Skills، فراخوانی agent@ و استودیوی Copilot Studio</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">مدت اعتبار و پشتیبانی</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">۱ ماهه قانونی با گارانتی سلامت ۱۰۰٪ و پشتیبانی تلگرام</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-primary" />
              پرسش‌های متداول خریداران Copilot Pro
            </h3>

            <div className="space-y-3">
              {[
                {
                  q: "چگونه ایجنت‌ها را در ورد یا اکسل فراخوانی کنیم؟",
                  a: "کافی است در کادر چت کوپایلوت داخل سند خود عبارت agent@ را بنویسید تا لیست ایجنت‌های تخصصی برای تحلیل داده یا نگارش باز شود.",
                },
                {
                  q: "قابلیت Personal Skills چیست؟",
                  a: "شما می‌توانید مهارت‌های تکرارپذیر خود را در قالب فایل‌های استاندارد Markdown روی وان‌درایو ذخیره کنید تا کوپایلوت همان فرآیند را روی سایر اسناد به صورت خودکار تکرار کند.",
                },
                {
                  q: "آیا برای استفاده نیاز به لایسنس Microsoft 365 داریم؟",
                  a: "برای فعال‌سازی آیکون‌های داخلی در ورد و اکسل، داشتن یک حساب فعال مایکروسافت ۳۶۵ مورد نیاز است؛ در صورت نیاز تیم پشتیبانی وایچ راهنمای کامل را ارائه می‌دهد.",
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
// ۵. جزئیات محصول پلنر مدیریت و سبک زندگی هوشمند VAICH (گوگل شیت)
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
      {activeTab === "features" && (
        <div className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              داشبورد هوشمند دیجیتال بر بستر گوگل شیت (Google Sheets)
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              پلنر هوشمند مدیریت فردی و عادات وایچ، نرم‌افزار مدیریت فردی دائمی مبتنی بر فرمول‌های پیشرفته Google Sheets و اسکریپت‌های اتوماسیون Apps Script است؛ بدون نیاز به پرداخت ماهانه یا شارژ دوره، با سازگاری کامل روی گوشی، تبلت و لپ‌تاپ.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-primary/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Flame className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">ردیاب عادات مینیمال (Habit Tracker)</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                ثبت زنجیره استمرار روزانه (Streak) با نمودار درصد موفقیت خودکار و پاداش بصری جهت پایبندی پایدار به عادت‌های کلیدی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-emerald-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Clock className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">زمان‌بندی روزانه بر پایه Time Boxing</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                ساخت بلاک‌های تمرکز کاری و تفکیک اولویت‌ها طبق ماتریس آیزنهاور برای غلبه بر خستگی تصمیم‌گیری و تعلل روزانه.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-purple-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <DollarSign className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">بودجه‌بندی و هوش مالی فردی</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                ثبت دقیق تراکنش‌ها، نمودار مخارج دسته‌بندی‌شده، محاسبه نرخ پس‌انداز ماهانه و مدیریت هزینه‌های ضروری و غیرضروری.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-blue-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                <Target className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">پیگیری اهداف و OKR سالانه</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                تبدیل چشم‌اندازهای بزرگ زندگی به نتایج کلیدی سنجش‌پذیر (Key Results) با نوارهای گرافیکی پویای پیشرفت.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-amber-400/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-300">
                <Smartphone className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">سازگاری کامل موبایل و آفلاین</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                باز شدن بدون لگ در گوشی، تبلت و لپ‌تاپ از طریق برنامه گوگل شیت با قابلیت علامت‌گذاری آفلاین و سینک خودکار.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-rose-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <Lock className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">دسترسی دائمی و مادام‌العمر (بدون اشتراک)</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                یک‌بار خرید و دسترسی همیشگی در گوگل درایو شخصی؛ بدون نیاز به تمدید سالانه، بدون هزینه مخفی و کاملاً ایمن و خصوصی.
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
              چه کسانی بیشترین بهره را از پلنر وایچ می‌برند؟
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              طراحی ماژولار پلنر برای پاسخ به نیازهای طیف وسیعی از افراد پرمشغله مهندسی شده است:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <GraduationCap className="h-4 w-4 text-primary" />
                <span>داوطلبان کنکور و دانشجویان دانشگاهی</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                ثبت ساعات مطالعه هفتگی، ردیابی حل تست و مرور فواصل تکرار فاصله‌دار (Spaced Repetition) با نمودارهای خودکار.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Laptop className="h-4 w-4 text-emerald-400" />
                <span>فریلنسرها، برنامه‌نویسان و دورکاران</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                مدیریت پروژه‌های همزمان با Time Boxing، پیگیری ددلاین‌ها و ثبت درآمد و فاکتورهای کاری در داشبورد مالی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <Flame className="h-4 w-4 text-purple-400" />
                <span>علاقه‌مندان به روتین‌سازی و بهبود فردی</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                پایبندی به ورزش، مطالعه روزانه، مصرف آب و سحرخیزی با استفاده از قانون «هرگز دو بار متوالی جا نینداز».
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-foreground text-sm">
                <DollarSign className="h-4 w-4 text-amber-300" />
                <span>افراد متمایل به شفافیت و انضباط مالی</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                شناسایی نشتی‌های مالی، هدف‌گذاری پس‌انداز ماهانه و گزارش‌گیری خودکار از دخل‌وخرج شخصی بدون نیاز به نرم‌افزارهای پیچیده حسابداری.
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
              جدول مقایسه: پلنر دیجیتال وایچ در برابر اپلیکیشن‌های پیچیده و دفاتر کاغذی
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              چرا بیش از ۹۰٪ پلنرهای کاغذی یا نرم‌افزارهای پیچیده پس از ۲ هفته رها می‌شوند؟
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-secondary/50 text-foreground font-bold">
                  <th className="p-3.5 sm:p-4">معیار مقایسه</th>
                  <th className="p-3.5 sm:p-4 text-emerald-400 font-black">پلنر گوگل شیت VAICH</th>
                  <th className="p-3.5 sm:p-4 text-muted-foreground font-medium">اپ‌های خارجی (Notion/Todoist)</th>
                  <th className="p-3.5 sm:p-4 text-muted-foreground font-medium">دفاتر کاغذی سنتی</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60 text-muted-foreground">
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">هزینه و نوع پرداخت</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">یک‌بار پرداخت ۲۹۹ هزار تومان (مادام‌العمر)</td>
                  <td className="p-3.5 sm:p-4">اشتراک ماهانه دلاری سنگین</td>
                  <td className="p-3.5 sm:p-4">خرید مکرر در هر فصل و سال</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">محاسبه خودکار آمار و Streak</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">نمودار پویای درصد و استمرار روزانه خودکار</td>
                  <td className="p-3.5 sm:p-4">نیازمند فرمول‌نویسی دستی</td>
                  <td className="p-3.5 sm:p-4">غیرممکن (محاسبه دستی با ماشین‌حساب)</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">سادگی و عدم حواس‌پرتی</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">رابط کاربری تمیز بر پایه Time Boxing بدون منوهای گیج‌کننده</td>
                  <td className="p-3.5 sm:p-4">منوهای بیش از حد تو در تو و فرسایش ذهن</td>
                  <td className="p-3.5 sm:p-4">ساده اما بدون تحلیل آماری</td>
                </tr>
                <tr className="hover:bg-secondary/20 transition-colors">
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">دسترسی چنددیوایسی و پشتیبان‌گیری</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">فضای ابری دائمی در گوگل درایو شخصی (گوشی و لپ‌تاپ)</td>
                  <td className="p-3.5 sm:p-4">وابسته به سرورهای پلتفرم</td>
                  <td className="p-3.5 sm:p-4">خطر گم شدن، خط‌خوردگی یا خیس شدن</td>
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
              تحویل آنی لینک کپی و راهنمای راه‌اندازی
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              فایل پلنر بلافاصله پس از ثبت سفارش در اختیار شما قرار می‌گیرد:
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۱
              </div>
              <h4 className="text-sm font-bold text-foreground">دریافت آنی لینک اختصاصی</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                بلافاصله پس از پرداخت موفق، لینک کپی مستقیم تمپلیت گوگل شیت نمایش داده شده و به تلگرام ارسال می‌شود.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۲
              </div>
              <h4 className="text-sm font-bold text-foreground">کپی یک‌کلیکی در درایو شخصی</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                با کلیک روی گزینه Make a Copy، نسخه ۱۰۰٪ اختصاصی فایل وارد فضای ابری Google Drive خودتان می‌شود.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-3 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/20 text-primary font-black text-sm">
                ۳
              </div>
              <h4 className="text-sm font-bold text-foreground">پشتیبانی و راهنمای گام‌به‌گام</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                شامل ویس و ویدیو راهنمای سریع راه‌اندازی روی موبایل و دسکتاپ به همراه پشتیبانی تلگرام وایچ.
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
              جدول مشخصات سریع پلنر وایچ
            </h3>
            <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card/50 shadow-sm">
              <table className="w-full text-right text-xs sm:text-sm">
                <tbody className="divide-y divide-border/60">
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground w-1/3">پلتفرم اجرایی</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">Google Sheets (بدون نیاز به نصب اکسل یا آفیس)</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">نسخه‌های موجود در پکیج</td>
                    <td className="p-3.5 sm:p-4 text-emerald-400 font-bold">شامل ۲ قالب: نسخه سه‌بعدی لوکس (3D Deluxe) + نسخه ۲بعدی مینیمال استاندارد</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">ماژول‌های کلیدی</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">ردیاب عادات (Streak)، تایم باکسینگ آیزنهاور، بودجه‌بندی مالی، اهداف سالانه OKR</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">سازگاری دستگاه‌ها</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">اندروید، iOS (آیفون/آیپد)، ویندوز، مک و لینوکس</td>
                  </tr>
                  <tr className="hover:bg-secondary/20 transition-colors">
                    <td className="p-3.5 sm:p-4 font-bold text-foreground">مدت اعتبار و دسترسی</td>
                    <td className="p-3.5 sm:p-4 text-muted-foreground">لایسنس مادام‌العمر و دائمی (یک‌بار خرید بدون هزینه اشتراک)</td>
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
                  q: "آیا برای استفاده از پلنر باید به اکسل یا مهارت کار با شیت مسلط باشم؟",
                  a: "خیر؛ تمام فرمول‌ها و محاسبات به صورت ۱۰۰٪ خودکار از پیش کدنویسی شده‌اند. شما فقط تیک عادات روزانه را می‌زنید یا اعداد مالی را وارد می‌کنید و سیستم بلافاصله نمودارها را رسم می‌کند.",
                },
                {
                  q: "چگونه پلنر را روی گوشی موبایل شبیه به یک اپلیکیشن اجرا کنم؟",
                  a: "کافی است فایل را در اپلیکیشن رایگان Google Sheets باز کرده و گزینه Add to Home Screen را بزنید تا یک آیکون اختصاصی روی صفحه گوشی شما قرار گیرد و با یک لمس باز شود.",
                },
                {
                  q: "آیا اطلاعات شخصی و محرمانه من برای سازنده قابل مشاهده است؟",
                  a: "خیر؛ با کلیک روی لینک، یک کپی مستقل به حساب شخصی گوگل درایو شما منتقل می‌شود و هیچ شخص ثالثی دسترسی به شیت یا داده‌های شما نخواهد داشت.",
                },
                {
                  q: "آیا در سال‌های آینده هم می‌توانم از این فایل استفاده کنم؟",
                  a: "بله؛ این پلنر یک بار برای همیشه خریداری می‌شود و با پاک کردن داده‌های سال قبل یا کپی مجدد از تمپلیت، می‌توانید سال‌های متوالی از آن استفاده کنید.",
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
