import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState, useRef, useMemo, lazy, Suspense } from "react";
import { Section } from "@/components/layout/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { NeonLink } from "@/components/ui/NeonButton";
import { useDynamicProducts, type LayoutMode, type ProductCategoryRow, type Product, type PromoBannerConfig } from "@/lib/products";
import { BlogSection } from "@/components/sections/BlogSection";
import { ArrowLeft, Sparkles, CheckCircle2, ShieldCheck, Zap, Headphones, Layers, LayoutGrid, Calendar } from "lucide-react";

// Code splitting below-the-fold landing page sections for high Lighthouse Performance
const Features = lazy(() => import("@/components/sections/Features").then((m) => ({ default: m.Features })));
const HowItWorks = lazy(() => import("@/components/sections/HowItWorks").then((m) => ({ default: m.HowItWorks })));
const Trust = lazy(() => import("@/components/sections/Trust").then((m) => ({ default: m.Trust })));
const Faq = lazy(() => import("@/components/sections/Faq").then((m) => ({ default: m.Faq })));
const SupportCta = lazy(() => import("@/components/sections/SupportCta").then((m) => ({ default: m.SupportCta })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "خرید اشتراک هوش مصنوعی، تلگرام پرمیوم، استارز و کانوا پرو | VAICH" },
      {
        name: "description",
        content:
          "مرجع خرید قانونی اشتراک‌های هوش مصنوعی (ChatGPT Plus، Claude Pro، Gemini Pro)، اشتراک تلگرام پرمیوم، استارز تلگرام، کانوا پرو و پلنر هوشمند گوگل‌شیت با تحویل سریع و ضمانت فعال‌سازی در وایچ.",
      },
      {
        name: "keywords",
        content:
          "خرید تلگرام پرمیوم, خرید استارز تلگرام, خرید کانوا پرو, خرید اکانت ChatGPT Plus قانونی, خرید اکانت Claude Pro, خرید اشتراک Gemini Pro, خرید پلنر دیجیتال, پلنر برنامه ریزی گوگل شیت, خرید هوش مصنوعی, وایچ",
      },
      { property: "og:title", content: "VAICH | مرجع اشتراک‌های هوش مصنوعی، تلگرام پرمیوم، استارز و کانوا پرو" },
      {
        property: "og:description",
        content:
          "مرجع خرید قانونی اشتراک‌های هوش مصنوعی (ChatGPT Plus، Claude Pro، Gemini Pro)، تلگرام پرمیوم، استارز تلگرام، کانوا پرو و پلنر هوشمند با تحویل سریع در وایچ.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://vaich.ir" },
      { property: "og:image", content: "https://vaich.ir/vaich-logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "خرید اشتراک هوش مصنوعی، تلگرام پرمیوم، استارز و کانوا پرو | VAICH" },
      {
        name: "twitter:description",
        content:
          "مرجع خرید قانونی اشتراک‌های هوش مصنوعی (ChatGPT Plus، Claude Pro، Gemini Pro)، تلگرام پرمیوم، استارز تلگرام، کانوا پرو و پلنر هوشمند در وایچ.",
      },
      { name: "twitter:image", content: "https://vaich.ir/vaich-logo.png" },
    ],
    links: [
      { rel: "canonical", href: "https://vaich.ir" },
    ],
  }),
  component: Home,
});

function Hero({ promoBanner }: { promoBanner?: PromoBannerConfig }) {
  // Use hero-ai showcase image to prevent duplicating the planner banner 3 times
  const bannerImage = promoBanner?.imageUrl || "/hero-ai.webp";
  const bannerAlt = promoBanner?.altText || "خرید مستقیم و مطمئن اشتراک‌های هوش مصنوعی و خدمات دیجیتال VAICH";
  const bannerLink = promoBanner?.linkUrl?.trim() || "";

  const isExternal = /^https?:\/\//i.test(bannerLink);
  const isSpecificProduct = bannerLink.startsWith("/products/") || bannerLink.startsWith("products/");
  const isPlannerTarget =
    !isExternal &&
    !isSpecificProduct &&
    (bannerLink.startsWith("#") ||
      bannerLink.startsWith("/#") ||
      bannerLink === "planners" ||
      bannerLink === "/planners" ||
      bannerLink.toLowerCase().includes("planner") ||
      bannerLink.includes("پلنر"));

  let internalPath = bannerLink;
  if (!isExternal && !isPlannerTarget && bannerLink) {
    if (!internalPath.startsWith("/")) {
      if (internalPath.startsWith("products/")) {
        internalPath = `/${internalPath}`;
      } else {
        internalPath = `/products/${internalPath}`;
      }
    }
  }

  const handlePlannerScroll = (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    const target =
      document.getElementById("row-mvampt3r") ||
      document.getElementById("planners") ||
      document.querySelector('[id*="planner"]');
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const imageElement = (
    <div
      className="glow-strong overflow-hidden rounded-3xl sm:rounded-4xl border border-border shadow-2xl bg-card aspect-4/3 group"
      style={{ aspectRatio: "4/3" }}
    >
      <img
        src={bannerImage}
        alt={bannerAlt}
        width={568}
        height={426}
        loading="eager"
        fetchPriority="high"
        decoding="sync"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </div>
  );

  return (
    <section className="aurora relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pt-8 pb-6 sm:px-6 sm:pt-14 sm:pb-8 lg:grid-cols-2 lg:pt-16 lg:pb-10">
        <div>
          {/* Subtle status capsule */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/70 px-3.5 py-1 text-xs font-semibold text-foreground shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>مرجع تخصصی خدمات دیجیتالی و اشتراک‌های هوش مصنوعی</span>
          </div>

          {/* Shorter, balanced H1 title */}
          <h1 className="mt-3.5 text-2xl font-black sm:text-4xl lg:text-[2.65rem] leading-[1.35] sm:leading-[1.3] text-foreground tracking-tight">
            <span>خرید مستقیم و مطمئن اشتراک‌های </span>
            <span className="text-primary font-black">
              هوش مصنوعی
            </span>
            <span className="text-foreground"> و </span>
            <span className="text-primary font-black">
              ابزارهای دیجیتال
            </span>
          </h1>

          {/* Max 2-line subtitle for quick reading */}
          <p className="mt-3 max-w-lg text-xs sm:text-sm leading-6 sm:leading-7 text-muted-foreground/90 font-medium line-clamp-2">
            دسترسی سریع و قانونی به اشتراک‌های هوش مصنوعی (ChatGPT، Claude، Gemini)، تلگرام پرمیوم، استارز و ابزارهای پربازده با ضمانت فعال‌سازی سالم و پشتیبانی اختصاصی.
          </p>

          {/* Primary CTA and clearly secondary Ghost CTA */}
          <div className="mt-5 sm:mt-6 flex flex-col gap-2.5 sm:flex-row">
            <NeonLink to="/products" size="lg" className="justify-center">
              <span>مشاهده محصولات و خدمات</span>
              <ArrowLeft className="h-4 w-4" />
            </NeonLink>
            <NeonLink to="/support" variant="outline" size="lg" className="justify-center border-border/80 text-foreground hover:bg-secondary/60">
              <span>پشتیبانی و مشاوره آنلاین</span>
            </NeonLink>
          </div>

          {/* 3 Trust Badges in ONE unified row (3 equal columns on mobile & desktop) */}
          <div className="mt-5 sm:mt-6 grid grid-cols-3 gap-2 sm:gap-3">
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-2 rounded-2xl border border-sky-500/25 bg-secondary/60 p-2 sm:px-3 sm:py-2 text-center sm:text-right backdrop-blur-md">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xl bg-linear-to-r from-blue-600 to-cyan-500 text-white shadow-xs">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
                </svg>
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-foreground">تحویل سریع</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-2 rounded-2xl border border-emerald-500/25 bg-secondary/60 p-2 sm:px-3 sm:py-2 text-center sm:text-right backdrop-blur-md">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-xs">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-foreground">ضمانت قانونی</span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1.5 sm:gap-2 rounded-2xl border border-purple-500/25 bg-secondary/60 p-2 sm:px-3 sm:py-2 text-center sm:text-right backdrop-blur-md">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-xl bg-linear-to-r from-purple-600 to-indigo-500 text-white shadow-xs">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 11h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-5a9 9 0 0 1 18 0v5a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
                  <path d="M21 16v2a3 3 0 0 1-3 3h-5" />
                </svg>
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-foreground">پشتیبانی ۲۴ساعته</span>
            </div>
          </div>
        </div>

        {/* Visual Showcase (Desktop) */}
        <div className="relative">
          {bannerLink ? (
            isExternal ? (
              <a
                href={bannerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="block cursor-pointer focus:outline-none"
              >
                {imageElement}
              </a>
            ) : isPlannerTarget ? (
              <button
                type="button"
                onClick={handlePlannerScroll}
                className="block w-full text-right cursor-pointer focus:outline-none"
                aria-label="مشاهده پلنرها"
              >
                {imageElement}
              </button>
            ) : (
              <Link
                to={internalPath as any}
                preload="intent"
                className="block cursor-pointer focus:outline-none"
              >
                {imageElement}
              </Link>
            )
          ) : (
            <div className="cursor-pointer">
              {imageElement}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Quick Access Bar (نوار دسترسی سریع - جدید)
const QUICK_SERVICES = [
  { slug: "chatgpt-plus", name: "ChatGPT Plus", icon: "/chatgpt-logo.svg", isSvg: true, target: "/products/chatgpt-plus" },
  { slug: "claude", name: "Claude Pro", icon: "/claude-icon.webp", target: "/products/claude" },
  { slug: "gemini-pro", name: "Gemini Pro", icon: "/gemini-pro-18m-icon.webp", target: "/products/gemini-pro" },
  { slug: "telegram-premium", name: "تلگرام پرمیوم", icon: "/telegram-premium-icon.webp", target: "/products/telegram-premium" },
  { slug: "telegram-stars", name: "استارز تلگرام", icon: "/telegram-stars-icon.webp", target: "/products/telegram-stars" },
  { slug: "canva-pro", name: "کانوا پرو", icon: "/canva-pro-icon.webp", target: "/products/canva-pro" },
  { slug: "vaich-life-planner", name: "پلنر گوگل‌شیت", icon: "/planner-cover.webp", target: "/products/vaich-life-planner" },
];

function QuickAccessBar() {
  return (
    <section aria-label="دسترسی سریع به سرویس‌ها" className="mx-auto max-w-6xl px-4 pt-3 pb-5 sm:px-6 sm:pt-4 sm:pb-7">
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none snap-x snap-proximity justify-start sm:justify-center">
        {QUICK_SERVICES.map((s) => (
          <Link
            key={s.slug}
            to={s.target as any}
            preload="intent"
            className="group flex flex-col items-center gap-1.5 shrink-0 snap-start p-2 sm:px-3 sm:py-2.5 rounded-2xl border border-border/70 bg-card/60 hover:bg-card hover:border-primary/50 hover:shadow-md transition-all active:scale-95 focus:outline-none min-w-[78px] sm:min-w-[96px] text-center"
          >
            <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-secondary/80 border border-border/80 p-1.5 group-hover:scale-105 group-hover:border-primary/40 transition-transform">
              <img
                src={s.icon}
                alt={s.name}
                width={36}
                height={36}
                loading="lazy"
                className="h-full w-full object-contain"
              />
            </div>
            <span className="text-[11px] sm:text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate max-w-[84px] sm:max-w-[94px]">
              {s.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ProductRowSection({
  row,
  products,
  layout,
  deferPaint = false,
}: {
  row: ProductCategoryRow;
  products: Product[];
  layout: LayoutMode;
  deferPaint?: boolean;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const userInteractedRef = useRef(false);
  const productOrderKey = products.map((p) => p.slug).join(",");

  useEffect(() => {
    userInteractedRef.current = false;
    const resetToRightmostStart = () => {
      if (carouselRef.current && !userInteractedRef.current) {
        carouselRef.current.scrollLeft = 0;
      }
    };
    resetToRightmostStart();
    const raf = requestAnimationFrame(resetToRightmostStart);
    const timer = setTimeout(resetToRightmostStart, 80);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [productOrderKey, layout]);

  const markInteracted = () => {
    userInteractedRef.current = true;
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    userInteractedRef.current = true;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const scrollAmount = (direction === "right" ? 1 : -1) * (isMobile ? 215 : 330);
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section
      id={row.id}
      style={deferPaint ? { contentVisibility: "auto", containIntrinsicSize: "380px" } : undefined}
      className="relative scroll-mt-20 sm:scroll-mt-24 mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10"
    >
      {/* Title & Navigation Arrows Header */}
      <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>{row.title}</span>
          </h2>
          {row.subtitle && (
            <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground font-medium">{row.subtitle}</p>
          )}
        </div>

        {layout !== "grid" && products.length >= 3 && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              aria-label="محصول قبلی"
              title="مشاهده موارد قبلی"
              className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl border border-purple-500/40 bg-card/90 text-purple-600 dark:text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)] transition-all hover:border-purple-500 hover:bg-purple-500/10 active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={() => scrollCarousel("left")}
              aria-label="محصول بعدی"
              title="مشاهده موارد بعدی"
              className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-xl border border-purple-500/40 bg-card/90 text-purple-600 dark:text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.2)] transition-all hover:border-purple-500 hover:bg-purple-500/10 active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        {/* 1-Row Carousel with mobile peek */}
        {layout === "1-row" && (
          <div
            ref={carouselRef}
            dir="rtl"
            onPointerDown={markInteracted}
            onTouchStart={markInteracted}
            onWheel={markInteracted}
            style={{ overflowAnchor: "none", WebkitOverflowScrolling: "touch" }}
            className="flex gap-3 sm:gap-5 overflow-x-auto snap-x snap-proximity py-2 scrollbar-none overscroll-x-contain"
          >
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}

        {/* 2-Row Carousel */}
        {layout === "2-row" && (
          <div
            ref={carouselRef}
            dir="rtl"
            onPointerDown={markInteracted}
            onTouchStart={markInteracted}
            onWheel={markInteracted}
            style={{ overflowAnchor: "none", WebkitOverflowScrolling: "touch" }}
            className="grid grid-rows-2 grid-flow-col auto-cols-[185px] xs:auto-cols-[210px] sm:auto-cols-[285px] gap-3 sm:gap-5 overflow-x-auto snap-x snap-proximity py-2 scrollbar-none overscroll-x-contain"
          >
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}

        {/* Grid View */}
        {layout === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-6 py-2 justify-items-center">
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} className="w-full max-w-[320px]" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { products, rows, layout, promoBanner } = useDynamicProducts();

  // Search listener from header
  useEffect(() => {
    const handleHeaderSearch = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setSearchQuery(customEvent.detail || "");
    };

    window.addEventListener("header-search", handleHeaderSearch);
    return () => {
      window.removeEventListener("header-search", handleHeaderSearch);
    };
  }, []);

  // Ensure homepage always opens cleanly at the top
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.hash && window.location.hash.includes("planner")) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
        window.scrollTo(0, 0);
      }
    }
  }, []);

  // Filter products by search query with memoization
  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return products;

    return products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      (p.service && p.service.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.duration && p.duration.toLowerCase().includes(q))
    );
  }, [products, searchQuery]);

  // Sort rows strictly according to user-requested order:
  // 1. AI Subscriptions ('ai')
  // 2. Premium Apps ('premium-apps')
  // 3. Digital Planners ('row-mvampt3r')
  const sortedRows = useMemo(() => {
    const orderPriority: Record<string, number> = {
      ai: 1,
      "premium-apps": 2,
      "row-mvampt3r": 3,
    };
    return [...rows].sort((a, b) => {
      const prioA = orderPriority[a.id] ?? 99;
      const prioB = orderPriority[b.id] ?? 99;
      return prioA - prioB;
    });
  }, [rows]);

  const isSearching = Boolean(searchQuery.trim());

  return (
    <>
      {/* 1. Header (Sticky in layout) */}
      {/* 2. Hero Section (Compact & High Impact) */}
      <Hero promoBanner={promoBanner} />

      {/* 3. Quick Access Bar (نوار دسترسی سریع - جدید) */}
      {!isSearching && <QuickAccessBar />}

      {/* Product Rows / Search Results */}
      {isSearching ? (
        <Section
          id="search-results"
          title="نتایج جستجو"
          subtitle={`نمایش اشتراک‌های مربوط به «${searchQuery}»`}
        >
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4 justify-items-center">
              {filteredProducts.map((p) => (
                <ProductCard key={p.slug} product={p} className="w-full max-w-[320px]" />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-border/60 bg-card/40 p-8 text-center">
              <p className="text-sm text-muted-foreground">
                هیچ اشتراکی مطابق با عبارت «{searchQuery}» پیدا نشد.
              </p>
            </div>
          )}
        </Section>
      ) : (
        /* 4. AI Subscriptions, 5. Premium Apps, 6. Digital Planners */
        sortedRows.map((row, index) => {
          const rowProducts = filteredProducts.filter((p) =>
            p.categoryId ? p.categoryId === row.id : index === 0
          );
          return (
            <ProductRowSection
              key={row.id}
              row={row}
              products={rowProducts}
              layout={layout}
              deferPaint={index >= 1}
            />
          );
        })
      )}

      {/* 4. Magazine & Articles (مجله و مقالات تخصصی - بلافاصله زیر ردیف‌های محصولات) */}
      <BlogSection />

      {/* 5. How to Buy in 3 Steps (نحوه خرید در ۳ مرحله ساده) */}
      <Suspense fallback={<div className="h-16 py-4" />}>
        <HowItWorks />
      </Suspense>

      {/* 6. Why VAICH (چرا وایچ) */}
      <Suspense fallback={<div className="h-16 py-4" />}>
        <Features />
      </Suspense>

      {/* 7. Customer Reviews & Trust Stats (نظرات مشتریان و آمار اعتماد) */}
      <Suspense fallback={<div className="h-16 py-4" />}>
        <Trust />
      </Suspense>

      {/* 8. FAQ (سوالات متداول) */}
      <Suspense fallback={<div className="h-16 py-4" />}>
        <Faq />
      </Suspense>

      {/* 9. Support CTA */}
      <Suspense fallback={<div className="h-16 py-4" />}>
        <SupportCta />
      </Suspense>
    </>
  );
}
