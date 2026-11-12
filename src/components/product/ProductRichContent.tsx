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
    { key: "comparison", label: "مقایسه پلن‌ها و نسخه رایگان", icon: Layers },
    { key: "delivery", label: "فعال‌سازی، ضمانت و نکات ایمنی", icon: ShieldCheck },
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

      {/* Persistent Bottom CTA Card */}
      <div className="rounded-3xl border border-primary/40 bg-linear-to-r from-primary/10 via-purple-600/10 to-cyan-500/10 p-5 sm:p-6 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-primary/5">
        <div className="space-y-1 text-center sm:text-right">
          <div className="text-sm font-black text-foreground flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            {isLifetime
              ? "دسترسی دائمی و مادام‌العمر بدون اشتراک ماهانه در وایچ"
              : "فعال‌سازی قانونی با ضمانت تحویل سالم اولیه در وایچ"}
          </div>
          <p className="text-xs text-muted-foreground">
            {isLifetime
              ? "تحویل آنی لینک کپی فایل همراه با راهنمای گام‌به‌گام و پشتیبانی اختصاصی."
              : "تحویل سریع پس از ثبت سفارش همراه با پشتیبانی راه‌اندازی و راهنمای استفاده ایمن."}
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
              مدل‌ها و مشخصات فنی رسمی پلن ChatGPT Plus (۲۰ دلاری OpenAI)
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              اشتراک رسمی <strong>ChatGPT Plus</strong> شامل دسترسی به جدیدترین مدل پرچمدار روزمره و کدنویسی <strong>GPT-6.1 Sol</strong>، مدل استدلالی <strong>GPT-6 Sol</strong> (سطوح تفکر Medium و High)، مدل سریع <strong>GPT-6 Luna</strong> و دسترسی تخصصی به <strong>GPT-6 Astra</strong> در محیط‌های <strong>Codex</strong> و <strong>ChatGPT Work</strong> (با سهمیه ۵ ساعته چرخشی) است؛ به همراه <strong>Deep Research</strong>، محیط کاری <strong>Prism</strong>، بوم <strong>Canvas</strong> و حالت صوتی زنده.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* GPT-6.1 Sol */}
            <div className="rounded-3xl border border-primary/40 bg-primary/5 p-5 space-y-2.5 hover:border-primary transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Bot className="h-5 w-5" />
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground">نسل جدید GPT-6.1 Sol و GPT-6 Sol</h4>
                <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">پاییز ۲۰۲۶</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                موتور اصلی و پرسرعت پلن Plus با دقت بالاتر در پیروی از دستورات، تحلیل اسناد و کدنویسی، همراه با تنظیم سطح تفکر (Medium و High) و کانتکست تا ۲۵۶ هزار توکن.
              </p>
            </div>

            {/* GPT-6 Astra (Codex & Work) & Luna */}
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-cyan-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Zap className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">Codex با GPT-6 Astra و مدل Luna</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                دسترسی به GPT-6 Astra در ابزارهای تخصصی Codex و ChatGPT Work (سهمیه ۵ ساعته چرخشی) به علاوه مدل فوق‌سریع GPT-6 Luna برای کارهای روزمره و پرتکرار.
              </p>
            </div>

            {/* Deep Research & Agent Mode */}
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-purple-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Brain className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">Deep Research و Agent Mode</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                پژوهش عمیق خودکار در منابع وب، تحلیل جداول و فایل‌های پیچیده و اجرای جریان‌های کاری چندمرحله‌ای مطابق سهمیه رسمی ماهانه پلن Plus.
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

            {/* Advanced Image Creation & Data Analysis */}
            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-pink-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                <Palette className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">تولید تصویر پیشرفته و تحلیل اکسل</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                تولید تصاویر گرافیکی و رندرهای دقیق با Advanced Image Creation به همراه تحلیل داده‌ها، CSV و نمودارهای پایتون در محیط ابری ایزوله.
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
            {/* توسعه‌دهندگان */}
            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Terminal className="h-4 w-4 text-primary" />
                توسعه‌دهندگان و مهندسان سیستم
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                کدنویسی و رفع خطای پروژه‌ها با <strong>GPT-6.1 Sol</strong> و <strong>Codex</strong> (دارای دسترسی GPT-6 Astra با سهمیه ۵ ساعته چرخشی)، ویرایش ساید‌بای‌ساید در Canvas و تحلیل فایل در محیط ایزوله پایتون.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-emerald-400" />
                دانشجویان، پژوهشگران و اساتید
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                پژوهش‌های چندمرحله‌ای با <strong>Deep Research</strong> و فضای کاری <strong>Prism</strong>، تحلیل داده‌های اکسل و CSV، حل مسائل علمی با سطوح استدلال <strong>Medium / High</strong> در GPT-6 Sol و خلاصه‌سازی مقالات تا ۲۵۶ هزار توکن.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-400" />
                کپی‌رایترها، مدیران محتوا و بازاریابان
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                تدوین کمپین‌ها، ویرایش زنده متون در بوم <strong>Canvas</strong>، تولید تصاویر باکیفیت با <strong>Advanced Image Creation</strong> و تعامل سریع صوتی با <strong>Advanced Voice Mode</strong>.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-400" />
                مدیران عامل و تیم‌های کاری
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                سازماندهی پوشه‌های <strong>Projects</strong> با حافظه ایزوله تا ۲۵ فایل ۵۱۲ مگابایتی، بررسی اسناد و استفاده از <strong>ChatGPT Work</strong> و <strong>Agent Mode</strong> طبق سهمیه رسمی پلن Plus.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 3. Free vs Plus vs Pro Comparison Table */}
      {activeTab === "comparison" && (
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
              <Layers className="h-5 w-5 text-cyan-400" />
              جدول مقایسه رسمی Free، ChatGPT Plus (این محصول) و ChatGPT Pro
            </h3>
            <p className="text-xs text-muted-foreground">
              بررسی شفاف مدل‌ها، پنجره کانتکست و تفاوت سقف مصرف پلن Plus با نسخه Pro در نوامبر ۲۰۲۶
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-secondary/20">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="border-b border-border/80 bg-secondary/60 text-muted-foreground">
                <tr>
                  <th className="p-3.5 sm:p-4 font-bold text-foreground">معیار مقایسه</th>
                  <th className="p-3.5 sm:p-4 font-bold text-muted-foreground">نسخه رایگان (Free)</th>
                  <th className="p-3.5 sm:p-4 font-bold text-primary">ChatGPT Plus (همین محصول)</th>
                  <th className="p-3.5 sm:p-4 font-bold text-muted-foreground">ChatGPT Pro (۱۰۰ تا ۵۰۰ دلاری)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">مدل‌های اصلی</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">GPT-6 Luna با محدودیت شدید</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">GPT-6.1 Sol، GPT-6 Sol و GPT-6 Luna</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">همه مدل‌ها + GPT-6 Pro (Astra در چت)</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">دسترسی به GPT-6 Astra</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">غیرفعال</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">فعال در Codex و Work (سهمیه ۵ ساعته)</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">نامحدود با سقف هفتگی و Dots Agent</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">پنجره کانتکست (Context)</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">محدود (حدود ۱۶ تا ۳۲K)</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">۵۴K سریع / تا ۲۵۶K استدلال</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">۱۲۸K سریع / تا ۴۰۰K استدلال</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">پژوهش عمیق و ایجنت</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">بسیار محدود</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">Deep Research و Agent Mode ماهانه</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">ظرفیت بالا + Always-on Agent Dots</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">ابزارهای Prism، Canvas و Projects</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">نسخه محدود آزمایشی</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">کامل (تا ۲۵ فایل ۵۱۲MB در هر پروژه)</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">کامل با بالاترین ظرفیت پردازشی</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">تولید تصویر و حالت صوتی زنده</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">محدود روزانه با تاخیر</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">Advanced Image و Voice بدون تاخیر</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">حداکثر اولویت + حالت Ultrafast</td>
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
            نحوه فعال‌سازی، ضمانت قانونی و نکات ایمنی اکانت
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                فعال‌سازی قانونی روی ایمیل شخصی یا اختصاصی
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                اشتراک با پرداخت معتبر روی ایمیل شما یا اکانت اختصاصی فعال‌سازی و پیش از تحویل تست می‌شود. تاریخچه چت‌ها و پروژه‌ها کاملاً خصوصی باقی می‌ماند.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                ضمانت فعال‌سازی + نکات جلوگیری از بن
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                ما <strong>فعال‌سازی قانونی و تحویل سالم اولیه</strong> را تضمین می‌کنیم. برای پیشگیری از محدودیت یا بن احتمالی پس از تحویل، حتماً از VPN با IP ثابت و تمیز استفاده کنید، IP را پشت‌سرهم تغییر ندهید و اکانت را اشتراکی مصرف نکنید.
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
              q: "کدام مدل‌ها در این اشتراک ChatGPT Plus فعال هستند؟",
              a: "در پلن ۲۰ دلاری Plus به مدل‌های جدید GPT-6.1 Sol، GPT-6 Sol، GPT-6 Luna و در محیط‌های Codex و ChatGPT Work به GPT-6 Astra (دارای سقف مصرف ۵ ساعته چرخشی) دسترسی دارید. نسخه دائمی GPT-6 Pro / Dots مخصوص پلن Pro است.",
            },
            {
              q: "ضمانت اکانت چگونه است و چکار کنیم بن نشویم؟",
              a: "وایچ فعال‌سازی قانونی و تحویل سالم اولیه را تضمین می‌کند. با توجه به سخت‌گیری‌های OpenAI، تداوم سلامت اکانت پس از تحویل وابسته به رفتار کاربری (استفاده از VPN با IP ثابت و غیرآلوده، تغییر ندادن مکرر سرور و عدم استفاده هم‌زمان چند نفر) است.",
            },
            {
              q: "آیا برای فعال‌سازی اشتراک نیاز به ارسال پسورد ایمیل است؟",
              a: "خیر، نیازی به رمز عبور ایمیل شخصی شما نیست یا اکانت کاملاً اختصاصی برایتان فعال می‌شود و تمام گفتگوها خصوصی می‌ماند.",
            },
            {
              q: "آیا امکان استفاده همزمان روی گوشی و لپ‌تاپ وجود دارد؟",
              a: "بله، روی اپلیکیشن‌های iOS، اندروید، دسکتاپ و وب قابل استفاده است؛ فقط توصیه می‌شود روی همه دستگاه‌ها از IP یکسان و پایدار استفاده کنید.",
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
              مدل‌ها و مشخصات رسمی پلن Claude Pro (۲۰ دلاری Anthropic)
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              اشتراک رسمی <strong>Claude Pro</strong> دسترسی مستقیم به خانواده ۵.۵ آنتروپیک شامل پرچمدار کدنویسی <strong>Claude Sonnet 5.5</strong>، مدل استدلالی عمیق <strong>Claude Opus 5.5</strong> و مدل فوق‌سریع <strong>Claude Haiku 5.5</strong> را با پنجره متنی ۱ میلیون توکنی و خروجی تا ۱۲۸ هزار توکن فراهم می‌کند؛ به همراه <strong>Adaptive Thinking</strong>، بوم <strong>Artifacts</strong>، پروژه‌ها و ابزار <strong>Claude Code</strong> (توضیح شفاف: مدل Claude Fable 5.2 در پلن Pro با اعتبار مصرفی جداگانه یا در پلن‌های Max و Ultra ارائه می‌شود).
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
              <h4 className="text-sm font-bold text-foreground">محیط تعاملی Claude Artifacts</h4>
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
              مقایسه نسخه Free، اشتراک Claude Pro (این محصول) و Claude Max / Ultra
            </h3>
            <p className="text-xs text-muted-foreground">
              بررسی دقیق مدل‌ها، سهمیه ۵ ساعته و هفتگی و دسترسی به Fable 5.2 در نوامبر ۲۰۲۶
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-secondary/20">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="border-b border-border/80 bg-secondary/60 text-muted-foreground">
                <tr>
                  <th className="p-3.5 sm:p-4 font-bold text-foreground">شاخص</th>
                  <th className="p-3.5 sm:p-4 font-bold text-muted-foreground">نسخه رایگان (Free)</th>
                  <th className="p-3.5 sm:p-4 font-bold text-primary">Claude Pro (همین محصول)</th>
                  <th className="p-3.5 sm:p-4 font-bold text-muted-foreground">Claude Max / Ultra (۱۰۰ / ۲۰۰ دلار)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">مدل‌های فعال</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">محدود (Haiku / سهمیه کم Sonnet)</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">Sonnet 5.5، Opus 5.5 و Haiku 5.5</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">همان مدل‌ها + سهمیه بومی Fable 5.2</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">ظرفیت مصرف و سهمیه</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">سقف بسیار محدود ۵ ساعته</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">~۵ برابر نسخه رایگان (۵ ساعته + هفتگی)</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">۵ تا ۱۰ برابر ظرفیت Pro + اعتبار API</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">مدل Claude Fable 5.2</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">غیرفعال</td>
                  <td className="p-3.5 sm:p-4 text-amber-400 font-medium">فقط با اعتبار اضافی (Pay-as-you-go)</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">شامل‌شده در اشتراک (تا ۵۰٪ سقف هفتگی)</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">ابزارهای کدنویسی و ترمینال</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">Claude Code مسدود</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">Claude Code، Artifacts و Projects کامل</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">کامل با سقف نشست طولانی‌تر</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">پنجره متنی و سقف خروجی</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">محدود بر اساس حجم سرور</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">۱ میلیون کانتکست با خروجی تا ۱۲۸K</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">۱ میلیون کانتکست + ۱۲۸K خروجی</td>
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
            نحوه فعال‌سازی، ضمانت قانونی و نکات مهم ایمنی Claude Pro
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                فعال‌سازی قانونی و اختصاصی
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                فعال‌سازی قانونی روی ایمیل کاربر یا اکانت اختصاصی با پرداخت رسمی انجام شده و هنگام تحویل از صحت عملکرد اشتراک اطمینان حاصل می‌شود.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                ضمانت فعال‌سازی + پیشگیری از بن شدن
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                ما <strong>فعال‌سازی قانونی و تحویل سالم اولیه</strong> را ضمانت می‌کنیم. با توجه به سخت‌گیری بالای آنتروپیک روی آی‌پی، برای جلوگیری از مسدودیت بعد از تحویل حتماً از VPN با IP ثابت و اختصاصی (پرهیز از پروکسی‌های عمومی و تغییر مکرر IP) و به‌صورت تک‌کاربره استفاده کنید.
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
              q: "کدام مدل‌ها در اکانت Claude Pro باز هستند؟",
              a: "مدل‌های Claude Sonnet 5.5، Claude Opus 5.5 و Claude Haiku 5.5 با کانتکست ۱ میلیونی و ابزارهایی مثل Artifacts و Claude Code در پلن ۲۰ دلاری Pro فعال‌اند. مدل Claude Fable 5.2 نیاز به اعتبار مصرفی جداگانه یا پلن‌های Max/Ultra دارد.",
            },
            {
              q: "ضمانت کلود چگونه است و چطور جلوی بن شدن را بگیریم؟",
              a: "فروشگاه وایچ فعال‌سازی قانونی و سلامت اولیه اکانت را تضمین می‌کند و راهنمای تنظیمات ایمن را در اختیارتان می‌گذارد. حفظ سلامت پس از تحویل (استفاده با IP ثابت غیرآلوده و عدم اشتراک‌گذاری اکانت) بر عهده کاربر است.",
            },
            {
              q: "آیا ابزار Claude Code روی سیستم‌های ویندوز و مک کار می‌کند؟",
              a: "بله، ابزار خط فرمان Claude Code از طریق ترمینال (Terminal / PowerShell / Bash) مستقیماً به مخزن پروژه شما متصل شده و کدها و تست‌ها را اجرا می‌کند.",
            },
            {
              q: "نحوه تحویل اکانت کلود پرو به چه صورت است؟",
              a: "پس از ثبت سفارش و ارسال رسید در ربات تلگرام، اطلاعات ورود یا فعال‌سازی اکانت اختصاصی شما در اولین فرصت و سریع‌ترین زمان ممکن در تلگرام ارسال می‌شود.",
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
   Google AI Pro (Gemini Pro) - Gemini 4 Argon & Google One 5 TB
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
              مدل‌ها و امکانات رسمی Google AI Pro (نسخه Gemini Pro ۱۹.۹۹ دلاری)
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              اشتراک <strong>Google AI Pro</strong> (شناخته‌شده با نام پیشین Gemini Advanced) با مدل پرچمدار <strong>Gemini 4 Argon</strong>، مدل‌های پرسرعت <strong>Flash</strong>، استدلال عمیق <strong>Deep Think</strong>، یکپارچگی بومی با <strong>Google Workspace</strong> (Gmail، Docs، Drive، Vids)، ابزارهای <strong>NotebookLM</strong> و <strong>Canvas</strong> و همراه با <strong>۵ ترابایت فضای ابری Google One</strong> و <strong>۱۰ دلار اعتبار ماهانه Google Cloud</strong> عرضه می‌شود.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-3xl border border-primary/40 bg-primary/5 p-5 space-y-2.5 hover:border-primary transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                <Brain className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">مدل پرچمدار Gemini 4 Argon و Flash</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                دسترسی کامل به مدل‌های رده Pro از جمله Gemini 4 Argon با سطوح تفکر (Low / Medium / High) و مدل‌های پرسرعت Flash با سهمیه محاسباتی ~۴ برابر نسخه رایگان.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-cyan-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Activity className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">استدلال عمیق Deep Think و Deep Research</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                تفکر چندمرحله‌ای برای مسائل پیچیده ریاضی، کدنویسی و تحلیل داده همراه با گزارش‌های تحقیقی ساختاریافته از منابع معتبر وب.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-purple-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                <Layers className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">۵ ترابایت فضای Google One</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                همراه با اشتراک AI، فضای ابری گسترده ۵ ترابایتی برای بکاپ Gmail، فایل‌های Drive و عکس‌های Google Photos در اختیار خواهید داشت.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-amber-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Laptop className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">اتصال بومی با Google Workspace</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                استفاده مستقیم جمینای درون Gmail، Google Docs، Sheets، Drive و Google Vids برای خلاصه‌سازی اسناد، نوشتن نامه و تحلیل شیت‌ها بدون کپی-پیست.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-emerald-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                <Code className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">Colab، Android Studio و ۱۰$ اعتبار Cloud</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                یکپارچگی مستقیم با محیط‌های برنامه‌نویسی Colab و Android Studio به علاوه ۱۰ دلار اعتبار ماهانه توسعه‌دهندگان Google Cloud.
              </p>
            </div>

            <div className="rounded-3xl border border-border/80 bg-secondary/30 p-5 space-y-2.5 hover:border-pink-500/50 transition-all">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-pink-500/10 border border-pink-500/20 text-pink-400">
                <Sparkles className="h-5 w-5" />
              </div>
              <h4 className="text-sm font-bold text-foreground">ابزارهای NotebookLM، Canvas و Gems</h4>
              <p className="text-xs leading-6 text-muted-foreground">
                تبدیل منابع تحقیقاتی به خلاصه‌های صوتی در NotebookLM، ساخت دستیارهای اختصاصی Gems و کار تعاملی با کد و متن در بوم Canvas.
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
            کاربردهای پیشرفته Google AI Pro (Gemini Pro)
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-primary" />
                تحقیقات دانشگاهی و پایان‌نامه‌ها
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                پردازش منابع علمی و کتاب‌های حجیم در Deep Research و ساخت مرور صوتی از مقالات با NotebookLM برای یادگیری عمیق‌تر.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Code className="h-4 w-4 text-cyan-400" />
                برنامه‌نویسان و متخصصان کلود
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                کدنویسی در Colab و Android Studio با کمک مدل‌های Gemini 4 Argon و استفاده از ۱۰ دلار اعتبار ماهانه توسعه‌دهندگان Google Cloud.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-emerald-400" />
                تحلیلگران داده و تریدرها
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                بررسی گزارش‌های مالی چندصفحه‌ای با حالت استدلال Deep Think و تنظیم سطوح تفکر (High Effort) جهت دقت حداکثری.
              </p>
            </div>

            <div className="rounded-2xl border border-border/70 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-400" />
                کاربران حرفه‌ای Gmail و Google Drive
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                دسترسی هم‌زمان به ۵ ترابایت فضای ابری Google One و دستیار هوشمند داخلی در Docs، Gmail و Sheets برای مدیریت کارهای روزمره.
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
              مقایسه پلن‌های Google AI: رایگان / Plus در برابر Google AI Pro (این محصول) و AI Ultra
            </h3>
            <p className="text-xs text-muted-foreground">
              مقایسه شفاف امکانات، مدل‌ها و فضای ذخیره‌سازی رسمی گوگل در نوامبر ۲۰۲۶
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/80 bg-secondary/20">
            <table className="w-full text-right text-xs sm:text-sm">
              <thead className="border-b border-border/80 bg-secondary/60 text-muted-foreground">
                <tr>
                  <th className="p-3.5 sm:p-4 font-bold text-foreground">شاخص</th>
                  <th className="p-3.5 sm:p-4 font-bold text-muted-foreground">رایگان / AI Plus (۴.۹۹ دلار)</th>
                  <th className="p-3.5 sm:p-4 font-bold text-primary">Google AI Pro (همین محصول)</th>
                  <th className="p-3.5 sm:p-4 font-bold text-muted-foreground">Google AI Ultra (۹۹+ دلار)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">مدل‌های پرچمدار</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">مدل‌های سبک Flash</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">Gemini 4 Argon + Flash + Deep Think</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">همه مدل‌ها + دسترسی به Gemini Carbon</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">سقف محاسباتی و سهمیه</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">سهمیه پایه</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">~۴ برابر نسخه رایگان (۵ ساعته / هفتگی)</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">۵ تا ۲۰ برابر ظرفیت پلن Pro</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">فضای ابری Google One</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">۱۵ GB (رایگان) یا ۴۰۰ GB (Plus)</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">۵ ترابایت (Gmail, Drive, Photos)</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">۲۰ ترابایت فضای ابری</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">یکپارچگی Workspace و Cloud</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">محدود</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">Workspace کامل + ۱۰$ اعتبار ماهانه Cloud</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">کامل + ابزارهای Google Antigravity</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">ابزارهای پژوهش و کد</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">محدود</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">NotebookLM، Canvas، Gems و Colab</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">سقف حداکثری در تمام ابزارها</td>
                </tr>
                <tr>
                  <td className="p-3.5 sm:p-4 font-semibold text-foreground">صرفه اقتصادی {is18Month ? "۱۸ ماهه" : "۶۰ روزه"}</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">عدم پوشش کامل Pro</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400">بسیار اقتصادی بدون دغدغه تمدید دلاری</td>
                  <td className="p-3.5 sm:p-4 text-muted-foreground">بسیار پرهزینه (نزدیک به ۲۰۰$/ماه)</td>
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
            تحویل سریع، ضمانت فعال‌سازی و نکات نگهداری
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                تحویل سریع و تست کامل پیش از ارسال
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                اطلاعات اکانت و راهنمای اتصال پایدار پس از تایید رسید در ربات تلگرام، در سریع‌ترین زمان ممکن و با تست سالم بودن اشتراک تحویل شما می‌شود.
              </p>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 space-y-2">
              <h4 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Award className="h-4 w-4 text-amber-400" />
                ضمانت فعال‌سازی قانونی + رعایت نکات ایمنی
              </h4>
              <p className="text-xs text-muted-foreground leading-6">
                وایچ <strong>فعال‌سازی قانونی و تحویل سالم اولیه</strong> سرویس را ضمانت می‌کند. پس از تحویل موفق، حفظ سلامت حساب وابسته به استفاده با IP ثابت و تمیز و رعایت قوانین گوگل توسط کاربر است.
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
            پرسش‌های متداول درباره Google AI Pro (Gemini Pro)
          </h3>
          {[
            {
              q: "تفاوت نسخه ۱۹.۹۹ دلاری Google AI Pro با نسخه AI Ultra چیست؟",
              a: "نسخه ارائه‌شده در وایچ پلن رسمی Google AI Pro (معادل ماهانه ۱۹.۹۹ دلار) با دسترسی به Gemini 4 Argon، استدلال Deep Think، امکانات Google Workspace، ۵ ترابایت فضا و ۱۰ دلار اعتبار Cloud است. امکانات سنگین‌تر مثل ۲۰ ترابایت فضا یا Gemini Carbon مربوط به پلن گران‌قیمت AI Ultra است.",
            },
            {
              q: "چه تفاوتی بین پلن ۶۰ روزه و پلن ۱۸ ماهه وجود دارد؟",
              a: "هر دو پلن امکانات اصلی Google AI Pro را دارند؛ پلن ۶۰ روزه برای تست و استفاده کوتاه‌مدت مناسب است و پلن ۱۸ ماهه برای کسانی که نمی‌خواهند هر ماه تمدید کنند ارزش اقتصادی بسیار بالاتری دارد.",
            },
            {
              q: "آیا برای استفاده از جمینای نیاز به ابزار تغییر آی‌پی است؟",
              a: "بله، به دلیل محدودیت‌های منطقه‌ای سرویس‌های هوش مصنوعی گوگل برای ایران، همیشه از یک VPN پایدار و معتبر استفاده کنید و در طول کار کشور/IP را مدام تغییر ندهید تا حساب بدون اختلال بماند.",
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
