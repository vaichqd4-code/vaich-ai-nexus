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
  selectedPrice?: number;
  selectedVariantId?: string;
  selectedOutOfStock?: boolean;
}

type TabKey = "features" | "usecases" | "comparison" | "delivery" | "faq";

function getCustomTabIcon(title: string, idx: number) {
  const t = title.toLowerCase();
  if (t.includes("سوال") || t.includes("پرسش") || t.includes("faq")) return HelpCircle;
  if (t.includes("گارانتی") || t.includes("شرایط") || t.includes("ضمانت") || t.includes("فعال")) return ShieldCheck;
  if (t.includes("مقایسه") || t.includes("امکانات") || t.includes("ویژگی") || t.includes("کاربرد")) return Layers;
  if (t.includes("توضیح") || t.includes("معرفی")) return BookOpen;
  const fallback = [BookOpen, Layers, ShieldCheck, HelpCircle];
  return fallback[idx % fallback.length] || FileText;
}

function CustomTabContentRenderer({
  title,
  content,
  openFaqIndex,
  toggleFaq,
}: {
  title: string;
  content: string;
  openFaqIndex: number | null;
  toggleFaq: (i: number) => void;
}) {
  const isFaqTab = title.includes("سوال") || title.includes("پرسش");

  if (isFaqTab) {
    const blocks = content
      .split(/\n\s*\n/)
      .map((b) => b.trim())
      .filter(Boolean);
    const faqPairs = blocks
      .map((block) => {
        const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);
        if (lines.length >= 2) {
          return { q: lines[0], a: lines.slice(1).join(" ") };
        }
        return null;
      })
      .filter((x): x is { q: string; a: string } => Boolean(x));

    if (faqPairs.length > 0) {
      return (
        <div className="space-y-3">
          <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2 mb-4">
            <HelpCircle className="h-5 w-5 text-primary shrink-0" />
            <span>{title}</span>
          </h3>
          {faqPairs.map((item, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border/80 bg-secondary/20 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex items-center justify-between gap-3 p-4 text-right text-xs sm:text-sm font-bold text-foreground hover:bg-secondary/40 transition-colors cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 text-primary transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs sm:text-sm leading-7 text-muted-foreground border-t border-border/50 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }
  }

  const lines = content
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div className="space-y-3.5">
      <h3 className="text-base sm:text-lg font-black text-foreground flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary shrink-0" />
        <span>{title}</span>
      </h3>
      <div className="space-y-2.5">
        {lines.map((line, idx) => {
          const isBullet = /^([•\-*✅⚡🔹🔸])\s*/.test(line);
          if (isBullet) {
            const clean = line.replace(/^([•\-*✅⚡🔹🔸])\s*/, "");
            const colonIdx = clean.indexOf(":");
            return (
              <div
                key={idx}
                className="flex items-start gap-2.5 rounded-2xl border border-border/60 bg-secondary/20 p-3.5 text-xs sm:text-sm leading-7 text-muted-foreground"
              >
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-1.5" />
                <div className="flex-1">
                  {colonIdx > 0 && colonIdx < 60 ? (
                    <>
                      <strong className="text-foreground font-bold">
                        {clean.slice(0, colonIdx + 1)}
                      </strong>{" "}
                      <span>{clean.slice(colonIdx + 1).trim()}</span>
                    </>
                  ) : (
                    <span>{clean}</span>
                  )}
                </div>
              </div>
            );
          }
          return (
            <p
              key={idx}
              className="text-xs sm:text-sm leading-7 text-muted-foreground"
            >
              {line}
            </p>
          );
        })}
      </div>
    </div>
  );
}

export function ProductRichContent({
  product,
  isPlanner,
  isLifetime,
  selectedPrice,
  selectedVariantId,
  selectedOutOfStock,
}: ProductRichContentProps) {
  const hasCustomTabs = Array.isArray(product.customTabs) && product.customTabs.length > 0;
  const [activeCustomTabId, setActiveCustomTabId] = useState<string>(
    hasCustomTabs ? product.customTabs![0].id : ""
  );
  const [activeTab, setActiveTab] = useState<TabKey>("features");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const isChatGPT = product.slug.includes("chatgpt");
  const isClaude = product.slug.includes("claude");
  const isGemini = product.slug.includes("gemini");
  const is18Month = product.slug === "gemini-pro";
  const isStudyPlanner = product.slug === "vaich-study-planner";
  const hasLegacyRich = isChatGPT || isClaude || isGemini || isPlanner;

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex((prev) => (prev === idx ? null : idx));
  };

  const effectivePrice = selectedPrice !== undefined ? selectedPrice : product.price;
  const effectiveOutOfStock = selectedOutOfStock !== undefined ? selectedOutOfStock : product.inStock === false;

  const fallbackTabs = !hasCustomTabs && !hasLegacyRich
    ? [
        {
          id: "auto-desc",
          title: "توضیحات محصول",
          content: product.description || `معرفی کامل ${product.name}`,
        },
        ...(product.features && product.features.length > 0
          ? [
              {
                id: "auto-features",
                title: "امکانات و ویژگی‌ها",
                content: product.features.map((f) => `• ${f}`).join("\n"),
              },
            ]
          : []),
        ...(product.purchaseInfo && product.purchaseInfo.length > 0
          ? [
              {
                id: "auto-warranty",
                title: "شرایط فعال‌سازی و گارانتی",
                content: product.purchaseInfo.map((i) => `• ${i}`).join("\n"),
              },
            ]
          : []),
      ]
    : [];

  const dynamicTabs = hasCustomTabs ? product.customTabs! : fallbackTabs;
  const useDynamicMode = dynamicTabs.length > 0;
  const resolvedDynamicTab =
    dynamicTabs.find((t) => t.id === activeCustomTabId) || dynamicTabs[0];

  const tabs: { key: TabKey; label: string; icon: any }[] = [
    { key: "features", label: "ویژگی‌ها و مشخصات فنی", icon: Cpu },
    { key: "usecases", label: "موارد استفاده تخصصی", icon: Briefcase },
    { key: "comparison", label: "مقایسه پلن‌ها و نسخه رایگان", icon: Layers },
    { key: "delivery", label: "فعال‌سازی، ضمانت و نکات ایمنی", icon: ShieldCheck },
    { key: "faq", label: "پرسش‌های متداول", icon: HelpCircle },
  ];

  return (
    <div className="mt-8 space-y-6">
      {/* Horizontal Tab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none rounded-2xl bg-secondary/40 p-1.5 border border-border/70 backdrop-blur-md">
        {useDynamicMode
          ? dynamicTabs.map((tab, idx) => {
              const Icon = getCustomTabIcon(tab.title, idx);
              const isActive = resolvedDynamicTab?.id === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setActiveCustomTabId(tab.id);
                    setOpenFaqIndex(0);
                  }}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer select-none",
                    isActive
                      ? "bg-linear-to-r from-primary to-purple-600 text-white shadow-md shadow-primary/25 border border-primary/40"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.title}</span>
                </button>
              );
            })
          : tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    "flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap cursor-pointer select-none",
                    isActive
                      ? "bg-linear-to-r from-primary to-purple-600 text-white shadow-md shadow-primary/25 border border-primary/40"
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
      </div>

      {/* Tab Contents */}
      <div className="rounded-3xl border border-border/80 bg-card/60 backdrop-blur-xl p-5 sm:p-7 shadow-xl shadow-black/15">
        {useDynamicMode && resolvedDynamicTab ? (
          <CustomTabContentRenderer
            title={resolvedDynamicTab.title}
            content={resolvedDynamicTab.content}
            openFaqIndex={openFaqIndex}
            toggleFaq={toggleFaq}
          />
        ) : (
          <>
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

            {isStudyPlanner ? (
              <StudyPlannerDetailContent
                activeTab={activeTab}
                openFaqIndex={openFaqIndex}
                toggleFaq={toggleFaq}
              />
            ) : isPlanner ? (
              <PlannerDetailContent
                product={product}
                activeTab={activeTab}
                openFaqIndex={openFaqIndex}
                toggleFaq={toggleFaq}
              />
            ) : null}
          </>
        )}
      </div>

      {/* Persistent Bottom CTA Card */}
      <div className="rounded-3xl border border-primary/40 bg-linear-to-r from-primary/10 via-purple-600/10 to-cyan-500/10 p-5 sm:p-6 backdrop-blur-xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-primary/5">
        <div className="space-y-1 text-center sm:text-right">
          <div className="text-sm font-black text-foreground flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            {isLifetime
              ? "دسترسی دائمی و مادام‌العمر بدون اشتراک ماهانه در وایچ"
              : "فعال‌سازی قانونی با ضمانت تحویل سالم در وایچ"}
          </div>
          <p className="text-xs text-muted-foreground">
            {isLifetime
              ? "تحویل آنی لینک کپی فایل همراه با راهنمای گام‌به‌گام و پشتیبانی اختصاصی."
              : "تحویل سریع پس از ثبت سفارش همراه با پشتیبانی راه‌اندازی و ضمانت پایداری."}
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="text-left hidden xs:block">
            <div className="text-[11px] text-muted-foreground">
              {effectiveOutOfStock ? "وضعیت" : "قیمت پلن انتخابی"}
            </div>
            <div className={cn("text-base font-black", effectiveOutOfStock ? "text-rose-500" : "text-primary")}>
              {effectiveOutOfStock ? "ناموجود" : formatPrice(effectivePrice)}
            </div>
          </div>
          {effectiveOutOfStock ? (
            <button
              type="button"
              disabled
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-black text-muted-foreground bg-secondary/80 border border-border cursor-not-allowed select-none"
            >
              <span>ناموجود</span>
            </button>
          ) : (
            <Link
              to="/checkout/$slug"
              params={{ slug: product.slug }}
              search={selectedVariantId ? ({ variant: selectedVariantId } as any) : undefined}
              className="neon-button-glow flex-1 sm:flex-none inline-flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-black text-white bg-linear-to-r from-primary via-purple-600 to-primary hover:from-primary/90 hover:to-purple-600/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 active:scale-95 cursor-pointer"
            >
              <span>پرداخت و فعال‌سازی فوری</span>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          )}
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

function StudyPlannerDetailContent({
  activeTab,
  openFaqIndex,
  toggleFaq,
}: {
  activeTab: TabKey;
  openFaqIndex: number | null;
  toggleFaq: (idx: number) => void;
}) {
  return (
    <div className="space-y-6">
      {activeTab === "features" && (
        <div className="space-y-6">
          {/* Hero Overview */}
          <div className="rounded-2xl border border-emerald-500/35 bg-emerald-500/5 p-4 sm:p-5 space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[11px] font-bold text-emerald-500">
                نسخه جامع و همه‌کاره
              </span>
              <span className="text-[11px] font-semibold text-muted-foreground">
                • دسترسی دائمی و مادام‌العمر بدون نیاز به تمدید اشتراک
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black text-foreground">
              معرفی جامع و ارزش ماندگار پلنر تحصیلی وایچ
            </h3>
            <p className="text-xs sm:text-sm leading-7 text-muted-foreground">
              پلنر تحصیلی وایچ (مبتنی بر Google Sheets) یک سیستم یکپارچه و هوشمند است که مطالعه روزانه، عادت‌سازی و تحلیل آزمون را به تجربه‌ای بصری، خودکار و انگیزه‌بخش تبدیل می‌کند. با یک‌بار تهیه این نسخه جامع و همه‌کاره، فایل اختصاصی برای همیشه در گوگل‌درایو شما می‌ماند و به‌صورت <strong>آنلاین و آفلاین</strong> در موبایل، تبلت و لپ‌تاپ همراه با <strong>فایل صوتی راهنمای راه‌اندازی</strong> در اختیارتان است.
            </p>
          </div>

          {/* 6-Card Feature Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                <Sparkles className="h-4 w-4 shrink-0" />
                <span>باغچه رشد مطالعه (تکامل زنده)</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                با تیک زدن اهداف روزانه و عادت‌های مطالعاتی، گیاه اختصاصی شما مرحله‌به‌مرحله از بذر تا شکوفایی رشد می‌کند و تداوم شما را به پاداش بصری تبدیل می‌کند.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <CalendarCheck className="h-4 w-4 shrink-0" />
                <span>جدول ۲۰ عادت و برنامه ۳۱ روزه</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                پشتیبانی کامل از هفته ۱ تا ۵ با قابلیت ثبت تا ۲۰ عادت و برنامه مطالعاتی قابل شخصی‌سازی و محاسبه خودکار <strong>آمار زنده پیشرفت و تداوم</strong>.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-cyan-500 font-bold text-sm">
                <Activity className="h-4 w-4 shrink-0" />
                <span>داشبورد آمار لحظه‌ای و روزانه</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                کارت‌های KPI خودکار در بالای صفحه شامل <strong>مجموع مطالعه</strong>، <strong>مجموع تست‌ها</strong>، <strong>میانگین خواب</strong>، <strong>بهترین تداوم</strong> و <strong>حال‌وهوای غالب</strong>.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
                <Target className="h-4 w-4 shrink-0" />
                <span>تفکیک و بودجه‌بندی دروس اصلی</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                تعریف <strong>هدف ساعت</strong> برای هر درس، ثبت ساعت مطالعه‌شده، محاسبه دقیق <strong>باقیمانده</strong> و نمایش نوار پیشرفت بصری برای تعادل مطالعه.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <BarChart3 className="h-4 w-4 shrink-0" />
                <span>کارنامه و تحلیل آزمون‌های آزمایشی</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                ثبت آزمون‌ها و مقایسه خودکار <strong>تراز/نمره هدف</strong> با <strong>تراز/نمره کسب‌شده</strong>، محاسبه <strong>اختلاف با هدف</strong> و نمایش وضعیت عملکرد.
              </p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Smartphone className="h-4 w-4 shrink-0" />
                <span>تب موبایل + دکمه‌های ریست هوشمند</span>
              </div>
              <p className="text-xs leading-6 text-muted-foreground">
                تب اختصاصی نسخه موبایل بدون اسکرول افقی، همگام‌سازی ابری و دکمه‌های یک‌کلیکی <strong>ریست داده‌های نوشتنی و روزانه</strong> و <strong>بازگشت به تنظیمات کارخانه</strong>.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === "usecases" && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              داوطلبان کنکور و آزمون‌های جامع
            </h4>
            <p className="text-xs leading-6 text-muted-foreground">
              مدیریت دقیق بودجه‌بندی دروس، ثبت روزانه تعداد تست‌ها و ساعات مطالعه، و تحلیل تراز هدف در کارنامه آزمون‌های آزمایشی برای اصلاح سریع مسیر مطالعه.
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-500" />
              دانشجویان و پژوهشگران
            </h4>
            <p className="text-xs leading-6 text-muted-foreground">
              برنامه‌ریزی پروژه‌ها، مقالات و امتحانات پایان ترم با پیگیری ساعت باقی‌مانده هر درس و حفظ تعادل خواب و انرژی در طول ترم.
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <Compass className="h-4 w-4 text-amber-400" />
              زبان‌آموزان و یادگیرندگان مهارت جدید
            </h4>
            <p className="text-xs leading-6 text-muted-foreground">
              تبدیل تمرین روزانه زبان یا یادگیری مهارت‌های تخصصی به زنجیره تداوم (Streak) همراه با رشد گیاه باغچه مطالعه بدون نیاز به اشتراک اپ‌های خارجی.
            </p>
          </div>
          <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-2">
            <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-cyan-400" />
              علاقه‌مندان به مطالعه و رشد فردی
            </h4>
            <p className="text-xs leading-6 text-muted-foreground">
              ایجاد نظم پایدار در مطالعه کتاب، مرور روزانه و پایش حال‌وهوا و میانگین خواب با یک سیستم سبک و قابل استفاده در موبایل و لپ‌تاپ.
            </p>
          </div>
        </div>
      )}

      {activeTab === "comparison" && (
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-foreground bg-secondary/40">
                <th className="p-3 font-bold">معیار مقایسه</th>
                <th className="p-3 font-bold text-emerald-500">پلنر تحصیلی هوشمند وایچ</th>
                <th className="p-3 font-bold text-muted-foreground">دفتر برنامه‌ریزی کاغذی</th>
                <th className="p-3 font-bold text-muted-foreground">اپلیکیشن‌های اشتراکی ماهانه</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              <tr>
                <td className="p-3 font-semibold text-foreground">مالکیت و هزینه</td>
                <td className="p-3 text-emerald-500 font-bold">خرید یک‌بار و دسترسی دائمی</td>
                <td className="p-3 text-muted-foreground">نیاز به خرید مجدد هر فصل</td>
                <td className="p-3 text-rose-400">پرداخت اشتراک ماهانه / دلاری</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-foreground">نمودار خودکار و گیمیفیکیشن</td>
                <td className="p-3 text-emerald-500 font-bold">باغچه رشد زنده + آمار لحظه‌ای</td>
                <td className="p-3 text-muted-foreground">فاقد محاسبه و نمودار خودکار</td>
                <td className="p-3 text-muted-foreground">محدود در نسخه رایگان</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-foreground">تحلیل آزمون و بودجه‌بندی دروس</td>
                <td className="p-3 text-emerald-500 font-bold">کارنامه اختلاف هدف + پیشرفت هر درس</td>
                <td className="p-3 text-muted-foreground">محاسبه دستی و زمان‌بر</td>
                <td className="p-3 text-muted-foreground">نبود بخش تخصصی آزمون و درس</td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-foreground">همگام‌سازی آنلاین و آفلاین</td>
                <td className="p-3 text-emerald-500 font-bold">بله (موبایل، تبلت و لپ‌تاپ)</td>
                <td className="p-3 text-muted-foreground">وابسته به حمل فیزیکی دفتر</td>
                <td className="p-3 text-muted-foreground">نیازمند اینترنت یا محدودیت تحریم</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "delivery" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-4 space-y-2">
            <h4 className="font-bold text-sm text-emerald-500 flex items-center gap-2">
              <Zap className="h-4 w-4" />
              مراحل دریافت و راه‌اندازی سریع در کمتر از ۲ دقیقه
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground leading-6">
              <li>۱. بلافاصله پس از پرداخت، لینک اختصاصی فایل Google Sheets و <strong>فایل صوتی راهنمای راه‌اندازی</strong> در اختیارتان قرار می‌گیرد.</li>
              <li>۲. با زدن دکمه <strong>Make a copy</strong>، فایل مستقیماً در گوگل درایو شخصی شما کپی می‌شود و هیچ فرد دیگری به اطلاعات شما دسترسی ندارد.</li>
              <li>۳. در اپلیکیشن Google Sheets گوشی با فعال کردن گزینه «Available offline»، حتی بدون اینترنت هم تیک‌های روزانه را ثبت کنید تا پس از اتصال همگام شوند.</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === "faq" && (
        <div className="space-y-3">
          {[
            {
              q: "آیا برای استفاده از پلنر تحصیلی وایچ نیاز به پرداخت اشتراک ماهانه است؟",
              a: "خیر؛ با یک‌بار خرید، دسترسی شما کاملاً دائمی و مادام‌العمر است و با دکمه‌های ریست هوشمند می‌توانید فایل را برای ماه‌ها و سال‌های متوالی بدون هزینه مجدد استفاده کنید.",
            },
            {
              q: "آیا اطلاعات مطالعه و نمرات من کاملاً خصوصی می‌ماند؟",
              a: "بله، ۱۰۰٪. از طریق قابلیت Make a copy نسخه اختصاصی وارد گوگل درایو شخصی خودتان می‌شود و فقط خودتان به آن دسترسی دارید.",
            },
            {
              q: "آیا روی گوشی بدون نیاز به اکسل یا آفیس و حتی آفلاین کار می‌کند؟",
              a: "بله؛ کافی است اپلیکیشن رایگان Google Sheets را روی گوشی اندروید یا آیفون نصب داشته باشید. همچنین با فعال‌سازی دسترسی آفلاین گوگل‌شیت، بدون اینترنت هم قابل ویرایش است و تب اختصاصی موبایل بدون اسکرول افقی برایتان آماده شده است.",
            },
            {
              q: "اگر کار با فرمول‌ها یا راه‌اندازی اولیه برایم سخت بود چطور راهنمایی بگیرم؟",
              a: "همراه فایل، صوت آموزشی کامل و گام‌به‌گام فارسی دریافت می‌کنید و پشتیبانی اختصاصی وایچ هم در تمام مراحل همراه شماست.",
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-border/80 bg-secondary/20 overflow-hidden transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-4 text-right text-xs sm:text-sm font-bold text-foreground hover:bg-secondary/40 transition-colors cursor-pointer"
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
