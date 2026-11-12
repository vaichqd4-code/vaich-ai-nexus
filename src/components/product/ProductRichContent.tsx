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
  Eye,
  Camera,
  Activity,
  Layers3,
  Bot,
  Terminal,
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
    { key: "comparison", label: "مقایسه نسخه اختصاصی و رایگان", icon: Layers },
    { key: "delivery", label: "نحوه فعال‌سازی و تضمین سلامت", icon: ShieldCheck },
    { key: "faq", label: "پرسش‌های متداول", icon: HelpCircle },
  ];

  return (
    <div className="mt-8 space-y-6">
      {/* Tab Navigation with Dark Metallic Glassmorphism */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none rounded-2xl bg-secondary/40 p-1.5 border border-border/70 backdrop-blur-md">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer select-none",
                isActive
                  ? "bg-linear-to-r from-primary to-purple-600 text-white shadow-md shadow-primary/25 border border-primary/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-5 sm:p-7 shadow-xl shadow-black/20">
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
            is18Month={is18Month}
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

      {/* Persistent Bottom CTA Card with Neon Glow */}
      <div className="rounded-3xl border border-primary/40 bg-linear-to-r from-primary/10 via-purple-600/10 to-cyan-500/10 p-5 sm:p-6 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-primary/5">
        <div className="space-y-1 text-center sm:text-right">
          <div className="text-sm font-black text-foreground flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            ضمانت اصالت ۱۰۰٪ قانونی و سلامت پایدار در وایچ
          </div>
          <p className="text-xs text-muted-foreground">
            تحویل فوری پس از ثبت سفارش همراه با پشتیبانی تخصصی در تمام طول دوره اشتراک.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="text-left hidden xs:block">
            <div className="text-[11px] text-muted-foreground">قیمت با تخفیف</div>
            <div className="text-base font-black text-primary">{formatPrice(product.price)}</div>
          </div>
          <Link
            to="/checkout/$slug"
            params={{ slug: product.slug }}
            className="neon-button-glow flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-black text-white bg-linear-to-r from-primary via-purple-600 to-primary hover:from-primary/90 hover:to-purple-600/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 cursor-pointer"
          >
            <span>خرید و فعال‌سازی فوری</span>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   ChatGPT Plus (OpenAI) - 2026 Researched Specs & GPT-6 Astra
   ========================================================================= */
function ChatGPTDetailContent({
  product,
  activeTab,
  openFaqIndex,
  toggleFaq,
}: {
  product: Product;
  activeTab: TabKey;
  openFaqIndex: number | null;
  toggleFaq: (i: number) => void;
}) {
  return (
    <div className="space-y-6">
      {/* 1. Features & Tech Specs */}
      {activeTab === "features" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              مدل‌های نسل ۲۰۲۶ و مشخصات فنی رسمی ChatGPT Plus (OpenAI)
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              اشتراک رسمی ChatGPT Plus مجهز به آخرین معماری‌های استدلالی و عامل‌محور شرکت OpenAI است؛ شامل پرچمدار ارشد هوش مرزی <strong>GPT-6 Astra</strong> (با قابلیت خودمختار کنترل رایانه و مرورگر وب)، مدل‌های تعادلی <strong>GPT-6 Sol</strong> و <strong>GPT-6 Luna</strong>، خانواده استدلال عمیق <strong>o1</strong> و <strong>o3-mini</strong>، مدل پرسرعت <strong>GPT-4o</strong>، فضای کاری <strong>Prism</strong>، بوم تعاملی <strong>Canvas</strong> و تولید ویدیوی <strong>Sora</strong>.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* GPT-6 Astra */}
            <div className="rounded-3xl border border-primary/40 bg-primary/5 p-5 space-y-2.5 hover:border-primary transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Bot className="h-5 w-5" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">پرچمدار ارشد: GPT-6 Astra</h4>
                <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">فرانتیر ۲۰۲۶</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                هوشمندترین و توانمندترین مدل OpenAI با هوش خودمختار رایانه‌ای (Autonomous Computer & Browser Use)، رتبه بحرانی امنیت سایبری و بالاترین رکورد حل مسائل مهندسی نرم‌افزار.
              </p>
            </div>

            {/* GPT-6 Sol & Luna */}
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-cyan-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Zap className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">مدل‌های تعادلی GPT-6 Sol و Luna</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                مدل همه‌کاره GPT-6 Sol برای امور روزمره با سرعت بالا و رده GPT-6 Luna با توان تولید رعدآسای توکن برای استخراج و خلاصه مقالات حجیم بدون تاخیر.
              </p>
            </div>

            {/* o1 & o3-mini Reasoning */}
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-purple-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Brain className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">استدلال عمیق o1 و o3-mini</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                حل مسائل ریاضیات المپیادی، فیزیک کوانتوم و دیباگ معماری با قابلیت تنظیم سطح تفکر (Reasoning Effort: Low, Med, High) جهت صرفه‌جویی یا حداکثر دقت.
              </p>
            </div>

            {/* Prism Workspace */}
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-amber-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <FileText className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">محیط کاری Prism و بوم Canvas</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                ورک‌اسپیس اختصاصی Prism برای اسناد ساختاریافته و پژوهش‌های گام‌به‌گام با اتصال مراجع؛ در کنار بوم تعاملی Canvas برای ویرایش ساید‌بای‌ساید کدها و متون.
              </p>
            </div>

            {/* Sora Video & DALL-E 3 Ultra HD */}
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-pink-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                <Palette className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">تولید ویدیو با Sora و DALL-E 3</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                خلق صحنه‌های ویدیویی خیره‌کننده با موتور ویدیوساز Sora و تولید تصاویر با رزولوشن Ultra HD با پایبندی عمیق به جزئیات پرامپت.
              </p>
            </div>

            {/* Dynamic Island Voice Mode */}
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-emerald-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Mic className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">حالت صوتی زنده با Dynamic Island</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                مکالمه صوتی طبیعی با پردازش لحن و احساسات، قطع صحبت (Interruption) و نمایش زنده در Dynamic Island آیفون و پس‌زمینه اندروید.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Specialized Use Cases */}
      {activeTab === "usecases" && (
        <div className="space-y-5">
          <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-purple-400" />
            کاربردهای تخصصی اشتراک ChatGPT Plus
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                توسعه‌دهندگان و مهندسان سیستم
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                استفاده از هوش خودمختار رایانه‌ای GPT-6 Astra برای بررسی ریپازیتوری‌ها، تست خودکار و رفع باگ‌های امنیتی، همراه با اجرای اسکریپت‌های پایتون در محیط ایزوله ابری.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-emerald-400" />
                دانشجویان، پژوهشگران و اساتید
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                پژوهش‌های چندمرحله‌ای با Prism، تحلیل داده‌های حجیم اکسل و CSV، حل مسائل ریاضیات دانشگاهی با استدلال o1 و خلاصه‌سازی مقالات رفرنس.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-400" />
                کپی‌رایترها، مدیران محتوا و بازاریابان
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                تدوین کمپین‌های ۳۶۰ درجه، ویرایش زنده متون در بوم Canvas، تولید استوری‌بورد و تیزرهای ویدیویی با Sora و خروجی‌های بصری چشم‌نواز با DALL-E 3.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" />
                مدیران عامل و استارتاپ‌ها
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                سازماندهی پروژه‌ها با حافظه ایزوله اختصاصی تا ۲۵ فایل ۵۱۲ مگابایتی برای هر بخش، بررسی قراردادهای حقوقی و خودکارسازی فرآیندهای اداری با اتوماسیون وب.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Free vs Plus Comparison Table */}
      {activeTab === "comparison" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
              <Layers className="h-5 w-5 text-cyan-400" />
              جدول مقایسه رسمی نسخه رایگان در برابر ChatGPT Plus وایچ
            </h3>
            <p className="text-xs text-muted-foreground">
              بررسی تفاوت‌های سقف دسترسی، پهنای باند و مدل‌های فعال در سال ۲۰۲۶
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-secondary/20">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="border-b border-border/80 bg-secondary/60 text-muted-foreground">
                <tr>
                  <th className="p-3.5 sm:p-4 font-bold text-foreground">معیار مقایسه</th>
                  <th className="p-3.5 sm:p-4 font-bold text-muted-foreground">نسخه رایگان (Free)</th>
                  <th className="p-3.5 sm:p-4 font-bold text-primary">اشتراک اختصاصی Plus (VAICH)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">دسترسی به پرچمدار GPT-6 Astra</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground flex items-center gap-1.5"><X className="h-4 w-4 text-rose-500" /> غیرفعال</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400 flex items-center gap-1.5"><Check className="h-4 w-4" /> دسترسی کامل با استدلال رایانه‌ای</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">مدل‌های استدلال o1 و o3-mini</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">محدود به چند پیام روزانه</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">دسترسی وسیع با تنظیم Reasoning Effort</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">فضای کاری Prism و بوم Canvas</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">نسخه محدود آزمایشی</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">دسترسی نامحدود و فول آنلاک</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">تولید ویدیو با Sora</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground flex items-center gap-1.5"><X className="h-4 w-4 text-rose-500" /> غیرفعال</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400 flex items-center gap-1.5"><Check className="h-4 w-4" /> فعال با سهمیه تولید اختصاصی</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">پروژه‌ها و حافظه ایزوله (Projects)</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">حداکثر ۵ فایل سبک</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">تا ۲۵ فایل ۵۱۲ مگابایتی در هر پروژه</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">اولویت سرور در ساعات شلوغی</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">انتظار در صف یا تنزل به مدل ضعیف</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">اولویت ترافیک سرور بدون قطعی</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">تحلیل پیشرفته داده‌ها (پایتون ابری)</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">بسیار محدود با قطع نشست</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">اجرای نامحدود کدهای سنگین پایتون</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">حالت صوتی پیشرفته (Advanced Voice)</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">نسخه معمولی با تاخیر</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">مکالمه روان زنده با پشتیبانی از Dynamic Island</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Delivery & Guarantee */}
      {activeTab === "delivery" && (
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            نحوه فعال‌سازی، تحویل و تضمین سلامت اشتراک
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                فعال‌سازی ۱۰۰٪ قانونی و اختصاصی
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                فعال‌سازی بر روی ایمیل شخصی خود کاربر یا ارائه اکانت کاملاً اختصاصی انجام می‌شود. بدون به اشتراک‌گذاری با اشخاص ثالث، تمام تاریخچه چت‌ها و پروژه‌ها خصوصی می‌ماند.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                گارانتی سلامت تا آخرین روز اشتراک
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                تمام ۳۰ روز اشتراک تحت پوشش گارانتی سلامت ۱۰۰٪ وایچ است. در صورت بروز هرگونه مشکل یا قطعی از سوی سرورهای بین‌المللی، تعویض یا رفع عیب فوری صورت می‌گیرد.
              </p>
            </div>
          </div>

          {product.purchaseInfo && product.purchaseInfo.length > 0 && (
            <div className="mt-4 rounded-2xl border border-border/80 bg-secondary/10 p-4">
              <h4 className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                <span>مراحل و قوانین تحویل:</span>
              </h4>
              <ul className="space-y-2">
                {product.purchaseInfo.map((info, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs leading-6 text-muted-foreground">
                    <span className="mt-2 h-1 w-1 rounded-full bg-primary/70 shrink-0" />
                    <span>{info}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* 5. FAQ Accordion */}
      {activeTab === "faq" && (
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-primary" />
            پرسش‌های متداول درباره ChatGPT Plus
          </h3>
          {[
            {
              q: "آیا مدل GPT-6 Astra برای همه خریداران اشتراک پلاس فعال است؟",
              a: "بله، با تهیه اشتراک ChatGPT Plus از وایچ، دسترسی مستقیم به مدل‌های پرچمدار نسل GPT-6 شامل GPT-6 Astra، GPT-6 Sol و مدل‌های استدلال عمیق o1 و o3-mini در پنل شما فعال است.",
            },
            {
              q: "آیا برای فعال‌سازی اشتراک نیاز به ارسال پسورد ایمیل است؟",
              a: "خیر، امنیت کاربران اولویت ماست. فعال‌سازی بدون نیاز به رمز عبور ایمیل شما انجام می‌شود و تمام اطلاعات اکانت و پروژه‌ها کاملاً خصوصی می‌ماند.",
            },
            {
              q: "تفاوت فضای کاری Prism با چت معمولی چیست؟",
              a: "ورک‌اسپیس Prism محیطی ساختاریافته برای تدوین مقالات طولانی، پروژه‌های تحقیقاتی و اسناد چندفایلی است که منابع و پیوست‌ها را به‌صورت یکپارچه در کنار ویرایشگر زنده قرار می‌دهد.",
            },
            {
              q: "آیا امکان استفاده همزمان روی گوشی و لپ‌تاپ وجود دارد؟",
              a: "بله، می‌توانید روی اپلیکیشن‌های رسمی iOS، اندروید، مک و نسخه وب بدون مشکل لاگین کرده و تاریخچه گفتگوی خود را به‌صورت لحظه‌ای همگام داشته باشید.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/80 bg-secondary/20 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-4 text-right text-xs sm:text-sm font-bold text-foreground hover:bg-secondary/40 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300",
                    openFaqIndex === idx && "rotate-180 text-primary"
                  )}
                />
              </button>
              {openFaqIndex === idx && (
                <div className="px-4 pb-4 pt-1 text-xs leading-6 text-muted-foreground border-t border-border/50">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   Claude Pro (Anthropic) - Claude Sonnet 5.5 & Adaptive Thinking
   ========================================================================= */
function ClaudeDetailContent({
  product,
  activeTab,
  openFaqIndex,
  toggleFaq,
}: {
  product: Product;
  activeTab: TabKey;
  openFaqIndex: number | null;
  toggleFaq: (i: number) => void;
}) {
  return (
    <div className="space-y-6">
      {/* 1. Features */}
      {activeTab === "features" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              مدل‌های نسل جدید و مشخصات رسمی Claude Pro (Anthropic)
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              اشتراک رسمی Claude Pro پرچمدار بلامنازع مهندسی نرم‌افزار در جهان است؛ مجهز به مدل سرآمد <strong>Claude Sonnet 5.5</strong>، مدل استدلالی فوق‌سنگین <strong>Claude Opus 5.5</strong>، رده پردازشی <strong>Claude Fable 5.1</strong>، مدل فوق‌سریع <strong>Claude Haiku 5.5</strong>، سیستم تفکر تطبیقی <strong>Adaptive Thinking</strong> و محیط کاری <strong>Artifacts 2.0</strong>.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-primary/40 bg-primary/5 p-5 space-y-2.5 hover:border-primary transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Code className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">پرچمدار مهندسی: Claude Sonnet 5.5</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                رتبه نخست بنچمارک SWE-bench در دنیا، با تسلط حیرت‌انگیز بر ریفکتورینگ پروژه‌های چند ده‌هزار خطی، درک معماری میکروسرویس و طراحی کامپوننت‌های مدرن.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-purple-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Brain className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">سیستم تفکر تطبیقی (Adaptive Thinking)</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                امکان تنظیم هوشمند بودجه تفکر مدل پیش از پاسخ‌دهی؛ مدل با بازبینی مرحله‌به‌مرحله فرضیه‌ها، ضریب خطای کد و منطق را به صفر نزدیک می‌کند.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-cyan-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Layers3 className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">محیط تعاملی Artifacts 2.0</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                رندر بلادرنگ وب‌اپلیکیشن‌های کامل (React, Tailwind)، نمودارهای تعاملی SVG و شبیه‌سازها در پنل کناری بدون نیاز به کامپایل یا لوکال هاست.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-amber-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <FolderGit2 className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">کانتکست ۱ میلیون توکنی (128K Output)</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                توانایی خواندن همزمان کل سورس‌کد یک پروژه عظیم گیت‌هاب یا یک کتاب مرجع دانشگاهی در یک درخواست و ارائه خروجی فوق‌العاده تا ۱۲۸,۰۰۰ توکن.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-emerald-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Terminal className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">دستیار کدهای ترمینال (Claude Code CLI)</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                اجرای مستقیم دستورات در خط فرمان سیستم‌عامل، اجرای تست‌های واحد، رفع خودکار خطاهای کامپایلر و پوش مستقیم روی گیت‌هاب.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-pink-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                <BookOpen className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">پروژه‌های تیمی (Claude Projects)</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                آپلود راهنماهای معماری، استایل‌گایدها و پایگاه‌های دانش سازمانی جهت پایبندی دائمی به استانداردهای نرم‌افزاری و حفظ لحن برند.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Usecases */}
      {activeTab === "usecases" && (
        <div className="space-y-5">
          <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-purple-400" />
            موارد استفاده تخصصی اشتراک Claude Pro
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Code className="h-4 w-4 text-primary" />
                توسعه‌دهندگان فرانت‌اند و فول‌استک
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                ساخت پروتوتایپ‌های زنده با کامپوننت‌های React و Tailwind در محیط Artifacts و مشاهده فوری عملکرد دکمه‌ها و فرم‌ها بدون راه‌اندازی سرور لوکال.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FolderGit2 className="h-4 w-4 text-emerald-400" />
                مهندسان ارشد معماری نرم‌افزار
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                تحلیل سورس‌کدهای قدیمی (Legacy Code)، ریفکتورینگ و مهاجرت معماری به فریم‌ورک‌های مدرن با حفظ کامل منطق برنامه و پوشش تست‌ها.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-400" />
                نویسندگان و ویراستاران تخصصی
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                طبیعی‌ترین، فصیح‌ترین و ادبی‌ترین لحن زبان فارسی میان تمام هوش‌های مصنوعی جهان بدون جمله‌بندی ماشینی و ترجمه‌های تحت‌اللفظی.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Brain className="h-4 w-4 text-cyan-400" />
                محققان داده و هوش مصنوعی
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                تحلیل مقالات چندصدصفحه‌ای arXiv، بررسی فرضیات با حالت Adaptive Thinking و استخراج دقیق اطلاعات از هزاران ردیف دیتا.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Comparison Table */}
      {activeTab === "comparison" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
              <Layers className="h-5 w-5 text-cyan-400" />
              جدول مقایسه نسخه رایگان کلود در برابر Claude Pro وایچ
            </h3>
            <p className="text-xs text-muted-foreground">
              تفاوت‌های بنیادین در سقف مجاز پیام‌ها، مدل‌های فعال و محیط Artifacts
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-secondary/20">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="border-b border-border/80 bg-secondary/60 text-muted-foreground">
                <tr>
                  <th className="p-3.5 sm:p-4 font-bold text-foreground">شاخص</th>
                  <th className="p-3.5 sm:p-4 font-bold text-muted-foreground">نسخه رایگان (Free)</th>
                  <th className="p-3.5 sm:p-4 font-bold text-primary">اشتراک اختصاصی Pro (VAICH)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">سقف پیام در هر نشست کاری</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">اخطار اتمام پیام پس از ۳ الی ۵ سوال</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400 flex items-center gap-1.5"><Check className="h-4 w-4" /> بیش از ۵ برابر ظرفیت مصرف بیشتر</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">دسترسی به Claude Sonnet 5.5 و Opus 5.5</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">سقوط به مدل‌های سبک در ساعات شلوغی</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">دسترسی دائم و بدون وقفه به برترین مدل‌ها</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">تفکر تطبیقی (Adaptive Thinking)</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">غیرفعال یا سقف زمانی بسیار کوتاه</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">تنظیم دستی بودجه تفکر تا بالاترین ضریب دقت</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">محیط تعاملی Artifacts 2.0</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">محدود با خطای حافظه در کدهای حجیم</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">رندر نامحدود پروژه‌ها و شبیه‌سازهای پیچیده</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">دستیار ترمینال Claude Code CLI</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground flex items-center gap-1.5"><X className="h-4 w-4 text-rose-500" /> مسدود</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400 flex items-center gap-1.5"><Check className="h-4 w-4" /> پشتیبانی کامل در ترمینال سیستم‌عامل</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">پنجره متنی و سقف خروجی</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">خروجی محدود به ۴,۰۰۰ توکن</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">۱ میلیون کانتکست با خروجی فوق‌العاده ۱۲۸K</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Delivery */}
      {activeTab === "delivery" && (
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            نحوه فعال‌سازی، تحویل و تضمین سلامت Claude Pro
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                فعال‌سازی قانونی بدون تحریم
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                فعال‌سازی ۱۰۰٪ قانونی و اختصاصی بر روی ایمیل شخصی کاربر با پرداخت کارت‌های بین‌المللی بدون ریسک بن شدن یا لیمیت اکانت.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                گارانتی کامل سلامت در تمام ۳۰ روز
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                اشتراک Claude Pro دارای گارانتی تعویض و پشتیبانی ۲۴ ساعته در تلگرام است تا بدون کوچک‌ترین دغدغه روی کدهایتان تمرکز کنید.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. FAQ */}
      {activeTab === "faq" && (
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-primary" />
            پرسش‌های متداول درباره Claude Pro
          </h3>
          {[
            {
              q: "چرا کلود برای برنامه‌نویسان بهتر از چت‌جی‌پی‌تی است؟",
              a: "مدل Claude Sonnet 5.5 با تسلط بر ساختار پروژه‌های چندفایلی و قابلیت رندر زنده کدهای فرانت‌اند در Artifacts 2.0، امکان تست بلادرنگ رابط کاربری را بدون نیاز به کپی-پیست در ادیتور فراهم می‌کند.",
            },
            {
              q: "آیا ابزار Claude Code روی سیستم‌های ویندوز و مک کار می‌کند؟",
              a: "بله، ابزار خط فرمان Claude Code از طریق ترمینال (Terminal / PowerShell / Bash) مستقیماً به مخزن پروژه شما متصل شده و تست‌ها را اجرا می‌کند.",
            },
            {
              q: "نحوه تحویل اکانت کلود پرو به چه صورت است؟",
              a: "پس از ثبت سفارش و ارسال رسید در ربات تلگرام، اطلاعات ورود به اکانت اختصاصی شما در اولین فرصت و در سریع‌ترین زمان ممکن در تلگرام برای شما ارسال می‌شود.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/80 bg-secondary/20 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-4 text-right text-xs sm:text-sm font-bold text-foreground hover:bg-secondary/40 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300",
                    openFaqIndex === idx && "rotate-180 text-primary"
                  )}
                />
              </button>
              {openFaqIndex === idx && (
                <div className="px-4 pb-4 pt-1 text-xs leading-6 text-muted-foreground border-t border-border/50">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   Google Gemini Advanced - Gemini 4 Argon & Project Astra
   ========================================================================= */
function GeminiDetailContent({
  product,
  is18Month,
  activeTab,
  openFaqIndex,
  toggleFaq,
}: {
  product: Product;
  is18Month: boolean;
  activeTab: TabKey;
  openFaqIndex: number | null;
  toggleFaq: (i: number) => void;
}) {
  return (
    <div className="space-y-6">
      {/* 1. Features */}
      {activeTab === "features" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <Cpu className="h-5 w-5 text-primary" />
              موتورهای نسل ۲۰۲۶ گوگل: Gemini 4 Argon و لایه ادراکی Project Astra
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              اشتراک رسمی Google Gemini Advanced مجهز به انقلابی‌ترین فناوری‌های شرکت گوگل است؛ شامل پرچمدار غول‌آسای <strong>Gemini 4 Argon</strong> با خروجی ۱ میلیون توکن، لایه عامل‌محور بلادرنگ <strong>Project Astra</strong> (درک جریان زنده ویدیوی دوربین با تاخیر زیر ۳۰۰ میلی‌ثانیه و حافظه فضایی)، مدل استدلال عمیق <strong>Gemini 3 Deep Think</strong>، مدل‌های کاری <strong>Gemini 3.8 Flash</strong> و پیوند عمیق با <strong>Google Workspace</strong>.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-primary/40 bg-primary/5 p-5 space-y-2.5 hover:border-primary transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Brain className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">پرچمدار غول‌آسا: Gemini 4 Argon</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                معماری بومی چندوجهی با خروجی طولانی بی‌سابقه تا ۱,۰۰۰,۰۰۰ توکن و بازیابی بی‌نقص اطلاعات از میان صدها هزار خط کد و اسناد سنگین.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-cyan-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Camera className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">لایه چندوجهی زنده Project Astra</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                پیمایش بلادرنگ فریم‌به‌فریم دوربین گوشی یا وب‌کم، مکالمه صوتی انسان‌گونه با تاخیر زیر ۳۰۰ میلی‌ثانیه و حافظه فضایی از اشیای محیط پیرامون.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-purple-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Activity className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">مدل استدلال عمیق Gemini 3 Deep Think</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                تحلیل‌های چندلایه ریاضیاتی، داده‌کاوی، فیزیک و مدل‌سازی مالی با تمرکز بر زنجیره استدلال دقیق و بدون خطا.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-amber-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <FolderGit2 className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">پنجره متنی ۲ میلیون توکنی پایدار</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                بزرگ‌ترین حافظه فعال پردازش سند در جهان؛ پردازش همزمان بیش از ۱,۵۰۰ صفحه متن، فایل‌های صوتی طولانی یا ساعت‌ها ویدیوی خام.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-emerald-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Laptop className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">ادغام بومی با Google Workspace</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                جستجو، تحلیل و پاسخ‌گویی مستقیم میان اسناد گوگل درایو، ایمیل‌های جیمیل و شیت‌های کاربر بدون نیاز به آپلود مجدد فایل‌ها.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-pink-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">پلتفرم NotebookLM و Imagen 3</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                تولید پادکست‌های صوتی گفتگو‌محور (Audio Overviews) از اسناد و مقالات طولانی به همراه تصویرساز نسل جدید Imagen 3.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Usecases */}
      {activeTab === "usecases" && (
        <div className="space-y-5">
          <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-purple-400" />
            کاربردهای پیشرفته Google Gemini Advanced
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                تحقیقات دانشگاهی و پایان‌نامه‌ها
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                بارگذاری ده‌ها کتاب مرجع و پایان‌نامه در کانتکست ۲ میلیونی و ساخت پادکست صوتی با NotebookLM برای مرور سریع فصول درسی.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Camera className="h-4 w-4 text-cyan-400" />
                تعامل در دنیای واقعی با Project Astra
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                بررسی قطعات سخت‌افزاری، خواندن کدهای روی وایت‌برد و پرسش درباره اشیای فیزیکی از طریق دوربین با مکالمه صوتی فوق‌العاده سریع.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-400" />
                تریدرها و تحلیلگران داده
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                مدل‌سازی مالی با موتور Deep Think، تحلیل گزارش‌های سالانه بورس و اجرای اسکریپت‌های تحلیلی پایتون در کلود گوگل.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-400" />
                تیم‌های متکی به اکوسیستم گوگل
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                اتوماسیون سریع اداری با خلاصه خودکار ایمیل‌های جیمیل، استخراج اکشن‌آیتم‌ها از داکس و تهیه گزارش‌های مستمر در گوگل درایو.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Comparison Table */}
      {activeTab === "comparison" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
              <Layers className="h-5 w-5 text-cyan-400" />
              مقایسه نسخه رایگان گوگل با Gemini Advanced وایچ
            </h3>
            <p className="text-xs text-muted-foreground">
              بررسی تفاوت‌های پنجره کانتکست، مدل‌های استدلالی و Project Astra
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-secondary/20">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="border-b border-border/80 bg-secondary/60 text-muted-foreground">
                <tr>
                  <th className="p-3.5 sm:p-4 font-bold text-foreground">شاخص</th>
                  <th className="p-3.5 sm:p-4 font-bold text-muted-foreground">نسخه رایگان (Free)</th>
                  <th className="p-3.5 sm:p-4 font-bold text-primary">Gemini Advanced (VAICH)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">دسترسی به Gemini 4 Argon</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground flex items-center gap-1.5"><X className="h-4 w-4 text-rose-500" /> مسدود</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400 flex items-center gap-1.5"><Check className="h-4 w-4" /> فعال با خروجی ۱ میلیون توکن</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">لایه چندوجهی Project Astra</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">غیرفعال</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">درک زنده دوربین و مکالمه زیر ۳۰۰ms</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">اندازه پنجره متنی (Context Window)</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">۳۲ هزار توکن معمولی</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">۲ میلیون توکن پایدار (بزرگ‌ترین جهان)</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">مدل تحلیل استدلال عمیق Deep Think</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground flex items-center gap-1.5"><X className="h-4 w-4 text-rose-500" /> غیرفعال</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400 flex items-center gap-1.5"><Check className="h-4 w-4" /> فعال برای داده‌کاوی و ریاضیات</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">پلتفرم علمی NotebookLM</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">سهمیه بسیار محدود پادکست</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">دسترسی وسیع برای تولید Audio Overviews</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">مزیت طرح ۱۸ ماهه وایچ</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">عدم امکان خرید بلندمدت</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">تخفیف اقتصادی بیش از ۹۰٪ و مصونیت از تورم ارز</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Delivery */}
      {activeTab === "delivery" && (
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            تحویل فوری، گارانتی و تضمین سلامت اکانت
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                تحویل فوری در اولین فرصت
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                اطلاعات اکانت و راهنمای کامل اتصال پایدار پس از ارسال رسید در ربات، در سریع‌ترین زمان ممکن در تلگرام به شما تحویل داده می‌شود.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                گارانتی کامل سلامت در طول کل دوره
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                پلن ۶۰ روزه و پلن ۱۸ ماهه دارای گارانتی کامل سلامت و تعویض فوری در تمام طول دوره هستند.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. FAQ */}
      {activeTab === "faq" && (
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-primary" />
            پرسش‌های متداول درباره Gemini Advanced
          </h3>
          {[
            {
              q: "چرا پلن ۱۸ ماهه جمینای تا این حد اقتصادی است؟",
              a: "طرح ۱۸ ماهه وایچ به دلیل تخصیص کردیت‌های رسمی و پارتنرشیپ بین‌المللی با بیش از ۹۰٪ تخفیف ارائه می‌شود و شما را تا ۱.۵ سال از نوسانات ارز و تمدید ماهانه بی‌نیاز می‌کند.",
            },
            {
              q: "پنجره متنی ۲ میلیون توکنی چه کاربردی دارد؟",
              a: "این پنجره به شما اجازه می‌دهد کتاب‌های قطور، کل کدهای یک پروژه یا یک فایل ویدیویی ۱ ساعته را در چت بارگذاری کنید تا هوش مصنوعی کل آن را در یک ثانیه تحلیل و پاسخ دهد.",
            },
            {
              q: "آیا برای استفاده از جمینای نیاز به ابزار تغییر آی‌پی است؟",
              a: "بله، به دلیل تحریم‌های شرکت گوگل علیه ایران، نیاز به یک ابزار پایدار است؛ اما اکانت به هیچ وجه مسدود یا بن نمی‌شود.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/80 bg-secondary/20 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-4 text-right text-xs sm:text-sm font-bold text-foreground hover:bg-secondary/40 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300",
                    openFaqIndex === idx && "rotate-180 text-primary"
                  )}
                />
              </button>
              {openFaqIndex === idx && (
                <div className="px-4 pb-4 pt-1 text-xs leading-6 text-muted-foreground border-t border-border/50">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* =========================================================================
   VAICH Life Planner (Google Sheets)
   ========================================================================= */
function PlannerDetailContent({
  product,
  activeTab,
  openFaqIndex,
  toggleFaq,
}: {
  product: Product;
  activeTab: TabKey;
  openFaqIndex: number | null;
  toggleFaq: (i: number) => void;
}) {
  return (
    <div className="space-y-6">
      {/* 1. Features */}
      {activeTab === "features" && (
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-black text-foreground flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-emerald-400" />
              داشبوردها و ویژگی‌های فنی پلنر مدیریت و سبک زندگی VAICH
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              پلنر هوشمند وایچ یک نرم‌افزار مدیریت فردی کامل، سبک و پایدار مبتنی بر فرمول‌های پیشرفته Google Sheets و کدهای اتوماسیون Apps Script است که یک‌بار خریداری می‌شود و برای همیشه بدون هزینه اشتراک ماهانه در اختیار شما قرار می‌گیرد.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-emerald-500/40 bg-emerald-500/5 p-5 space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Flame className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">ردیاب عادات (Habit Tracker)</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                ثبت زنجیره پیوستگی عادات (Streak) همراه با محاسبه خودکار درصد موفقیت ماهانه و پاداش‌های بصری انگیزشی.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Clock className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">زمان‌بندی Time Boxing</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                تفکیک بلوک‌های تمرکز عمیق کاری و اولویت‌بندی وظایف بر اساس ماتریس ۴ گانه آیزنهاور جهت خاموش کردن استرس.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <DollarSign className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">داشبورد هوش مالی فردی</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                ثبت تراکنش‌های درآمد و هزینه، دسته‌بندی خودکار مخارج و محاسبه هوشمند پس‌انداز ماهانه بدون نیاز به نرم‌افزار حسابداری.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Target className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">پیگیری اهداف و OKR سالانه</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                شکستن اهداف کلان به نتایج کلیدی فصلی (Key Results) با نوارهای پیشرفت گرافیکی و پایش مستمر.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Layers3 className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">۲ تمپلیت سه‌بعدی و دوبعدی</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                شامل هر دو نسخه لوکس تعاملی سه‌بعدی (3D Deluxe) و نسخه استاندارد مینیمال ۲بعدی مطابق با هر سلیقه.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                <Smartphone className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">همگام‌سازی ابری روی موبایل و لپ‌تاپ</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                اجرای روان و سریع در اپلیکیشن رایگان Google Sheets روی اندروید، iOS، تبلت و کامپیوتر بدون کوچک‌ترین تاخیر.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Usecases */}
      {activeTab === "usecases" && (
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <Compass className="h-5 w-5 text-primary" />
            این پلنر مناسب چه کسانی است؟
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-1.5">
              <h4 className="text-sm font-bold text-foreground">فریلنسرها و شاغلین دورکار</h4>
              <p className="text-xs text-muted-foreground leading-6">
                مدیریت پروژه‌ها، جلوگیری از فرسودگی شغلی با بلاک‌های تمرکز کاری و تفکیک زندگی شخصی از کار.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-1.5">
              <h4 className="text-sm font-bold text-foreground">دانشجویان و داوطلبان آزمون‌ها</h4>
              <p className="text-xs text-muted-foreground leading-6">
                برنامه‌ریزی ساعات مطالعه، ثبت مداوم تست‌زنی و حفظ انگیزه با زنجیره پیشرفت روزانه.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-1.5">
              <h4 className="text-sm font-bold text-foreground">افرادی که از اپلیکیشن‌های پیچیده خسته شده‌اند</h4>
              <p className="text-xs text-muted-foreground leading-6">
                تجربه مینیمال، بدون منوهای تودرتو و بدون اصطکاک ورود به کار؛ همه‌چیز در یک نگاه روبه‌روی شماست.
              </p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-1.5">
              <h4 className="text-sm font-bold text-foreground">علاقه‌مندان به انضباط مالی</h4>
              <p className="text-xs text-muted-foreground leading-6">
                رهایی از غافلگیری‌های مالی پایان ماه با پایش لحظه‌ای دخل و خرج و پس‌انداز هدفمند.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Comparison Table */}
      {activeTab === "comparison" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
              <Layers className="h-5 w-5 text-cyan-400" />
              مقایسه پلنر هوشمند گوگل شیت با دفاتر کاغذی و اپلیکیشن‌ها
            </h3>
            <p className="text-xs text-muted-foreground">
              چرا گوگل شیت بهترین بستر برای مدیریت طولانی‌مدت عادات است؟
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-secondary/20">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="border-b border-border/80 bg-secondary/60 text-muted-foreground">
                <tr>
                  <th className="p-3.5 sm:p-4 font-bold text-foreground">معیار</th>
                  <th className="p-3.5 sm:p-4 font-bold text-muted-foreground">دفاتر کاغذی</th>
                  <th className="p-3.5 sm:p-4 font-bold text-muted-foreground">اپلیکیشن‌های خارجی</th>
                  <th className="p-3.5 sm:p-4 font-bold text-emerald-400">پلنر هوشمند VAICH</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">هزینه و شارژ</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">خرید مداوم دفتر جدید</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">اشتراک ماهانه ارزی دلاری</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">یک‌بار خرید مادام‌العمر</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">محاسبه خودکار آمار</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground"><X className="h-4 w-4 text-rose-500" /> دستی و زمان‌بر</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground"><Check className="h-4 w-4" /> خودکار</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400"><Check className="h-4 w-4" /> خودکار با فرمول‌های پیشرفته</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">همگام‌سازی بین دستگاه‌ها</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground"><X className="h-4 w-4 text-rose-500" /> غیرممکن</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground"><Check className="h-4 w-4" /> نیازمند اینترنت سریع</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400"><Check className="h-4 w-4" /> کلود امن سرورهای گوگل</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">خستگی تصمیم‌گیری</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">متوسط</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground text-rose-400">بسیار بالا به دلیل منوهای تو در تو</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">صفر (فقط تسک بعدی را انجام دهید)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Delivery */}
      {activeTab === "delivery" && (
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            نحوه دریافت و تحویل فایل
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                تحویل و دسترسی مستقیم پس از پرداخت
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                لینک کپی مستقیم (Make a copy) در گوگل درایو بلافاصله پس از پرداخت به همراه راهنمای ویدیویی و صوتی برای شما نمایش داده می‌شود.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                پشتیبانی اختصاصی راه‌اندازی
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                در صورت هرگونه سوال در کپی فایل یا نحوه استفاده در موبایل، تیم پشتیبانی تلگرام وایچ در اولین فرصت و در سریع‌ترین زمان ممکن شما را راهنمایی خواهد کرد.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. FAQ */}
      {activeTab === "faq" && (
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-primary" />
            پرسش‌های متداول درباره پلنر وایچ
          </h3>
          {[
            {
              q: "آیا برای استفاده نیاز به نصب اکسل یا آفیس دارم؟",
              a: "خیر، این پلنر به‌صورت اختصاصی برای برنامه رایگان Google Sheets طراحی شده و با هر جیمیل فعالی در مرورگر، گوشی اندروید یا آیفون باز می‌شود.",
            },
            {
              q: "آیا نیاز به پرداخت اشتراک ماهانه است؟",
              a: "خیر، با یک‌بار خرید، فایل برای همیشه در گوگل درایو شخصی شما ذخیره شده و هیچ‌گونه هزینه تمدید دوره‌ای ندارد.",
            },
            {
              q: "اگر فرمولی دستکاری شود چه اتفاقی می‌افتد؟",
              a: "لینک فایل اصلی همیشه در دسترس شماست و می‌توانید هر زمان که بخواهید یک نسخه تمیز و جدید از شیت کپی کنید. همچنین کلید هوشمند پاکسازی ماه جدید نیز در فایل تعبیه شده است.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/80 bg-secondary/20 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-4 text-right text-xs sm:text-sm font-bold text-foreground hover:bg-secondary/40 transition-colors"
              >
                <span>{item.q}</span>
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-300",
                    openFaqIndex === idx && "rotate-180 text-primary"
                  )}
                />
              </button>
              {openFaqIndex === idx && (
                <div className="px-4 pb-4 pt-1 text-xs leading-6 text-muted-foreground border-t border-border/50">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
