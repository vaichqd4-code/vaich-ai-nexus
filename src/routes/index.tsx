import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef, useMemo, lazy, Suspense } from "react";
import { Section } from "@/components/layout/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { NeonLink } from "@/components/ui/NeonButton";
import { useDynamicProducts, type LayoutMode, type ProductCategoryRow, type Product, type PromoBannerConfig } from "@/lib/products";

// Code splitting below-the-fold landing page sections for 90+ Lighthouse Performance
const Features = lazy(() => import("@/components/sections/Features").then((m) => ({ default: m.Features })));
const HowItWorks = lazy(() => import("@/components/sections/HowItWorks").then((m) => ({ default: m.HowItWorks })));
const Trust = lazy(() => import("@/components/sections/Trust").then((m) => ({ default: m.Trust })));
const Faq = lazy(() => import("@/components/sections/Faq").then((m) => ({ default: m.Faq })));
const SupportCta = lazy(() => import("@/components/sections/SupportCta").then((m) => ({ default: m.SupportCta })));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "خرید اشتراک هوش مصنوعی | اکانت چت جی پی تی، جمینای، کلود | VAICH" },
      {
        name: "description",
        content:
          "مرجع تخصصی خدمات دیجیتال و خرید مستقیم اشتراک‌های هوش مصنوعی با تحویل فوری؛ خرید قانونی اکانت ChatGPT Plus، اشتراک Gemini Pro، Claude Pro و پلنرهای تخصصی با تضمین ۱۰۰٪ در VAICH.",
      },
      {
        name: "keywords",
        content:
          "خرید اکانت chatgpt plus, خرید اشتراک چت جی پی تی, خرید اکانت gemini pro, خرید اشتراک جمینای, خرید اکانت claude pro, خرید اشتراک هوش مصنوعی, پلنر برنامه ریزی, خدمات دیجیتال, vaich",
      },
      { property: "og:title", content: "VAICH | مرجع خدمات دیجیتال و خرید اشتراک‌های هوش مصنوعی" },
      {
        property: "og:description",
        content:
          "خرید مستقیم، تحویل فوری و ضمانت پایداری اشتراک‌های هوش مصنوعی (ChatGPT Plus, Gemini Pro, Claude Pro) و ابزارهای دیجیتال در VAICH.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://vaich.ir" },
      { property: "og:image", content: "https://vaich.ir/vaich-logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://vaich.ir/vaich-logo.png" },
    ],
    links: [
      { rel: "canonical", href: "https://vaich.ir" },
    ],
  }),
  component: Home,
});

function Hero({ promoBanner }: { promoBanner?: PromoBannerConfig }) {
  const bannerImage = promoBanner?.imageUrl || "/hero-ai.webp";
  const bannerAlt = promoBanner?.altText || "خرید مستقیم و مطمئن خدمات دیجیتالی و اشتراک‌های هوش مصنوعی VAICH";
  const bannerLink = promoBanner?.linkUrl;

  const imageElement = (
    <div className="float-slow glow-strong overflow-hidden rounded-3xl sm:rounded-4xl border border-border shadow-2xl bg-card aspect-4/3 group">
      <img
        src={bannerImage}
        alt={bannerAlt}
        width={568}
        height={426}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </div>
  );

  return (
    <section className="aurora relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-14 pb-8 sm:px-6 sm:pt-20 lg:grid-cols-2 lg:pt-24">
        <div className="rise-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-4 py-1.5 text-xs font-semibold text-foreground shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>مرجع تخصصی خدمات دیجیتالی و اشتراک‌های هوش مصنوعی</span>
          </div>

          <h1 className="mt-4 text-2xl font-black sm:text-4xl lg:text-[2.75rem] leading-[1.3] text-foreground tracking-tight">
            خرید مستقیم و مطمئن{" "}
            <span className="gradient-text">اشتراک‌های هوش مصنوعی</span>
            <span className="block mt-1 sm:mt-1.5 text-xl sm:text-3xl lg:text-4xl font-extrabold text-foreground/90">
              و ابزارهای دیجیتال
            </span>
          </h1>

          <p className="mt-3.5 max-w-lg text-xs sm:text-sm leading-6 sm:leading-7 text-muted-foreground font-medium">
            دسترسی آنی و قانونی به اشتراک‌های هوش مصنوعی، پلنرهای تخصصی و خدمات آنلاین با تضمین کیفیت و پشتیبانی دائمی.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <NeonLink to="/products" size="lg">
              مشاهده محصولات و خدمات
            </NeonLink>
            <NeonLink to="/support" variant="outline" size="lg">
              پشتیبانی آنلاین
            </NeonLink>
          </div>

          {/* نوار اعتمادسازی مینیمال و خلوت */}
          <div className="mt-7 flex flex-wrap items-center gap-2.5">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-secondary/70 px-3.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-md">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-white text-[10px]">
                ⚡
              </span>
              <span>تحویل سریع</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-secondary/70 px-3.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-md">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-white text-[10px]">
                ✓
              </span>
              <span>تضمین ۱۰۰٪ اصالت و کیفیت</span>
            </div>

            <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/25 bg-secondary/70 px-3.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-md">
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-purple-500 text-white text-[10px]">
                💬
              </span>
              <span>پشتیبانی ۲۴ ساعته</span>
            </div>
          </div>
        </div>

        <div className="relative">
          {bannerLink ? (
            <a
              href={bannerLink}
              target={bannerLink.startsWith("http") ? "_blank" : undefined}
              rel={bannerLink.startsWith("http") ? "noopener noreferrer" : undefined}
              className="block cursor-pointer focus:outline-none"
            >
              {imageElement}
            </a>
          ) : (
            imageElement
          )}
        </div>
      </div>
    </section>
  );
}

function ProductRowSection({
  row,
  products,
  layout,
}: {
  row: ProductCategoryRow;
  products: Product[];
  layout: LayoutMode;
}) {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
    const scrollAmount = (direction === "right" ? 1 : -1) * (isMobile ? 215 : 330);
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  if (products.length === 0) return null;

  return (
    <section id={row.id} className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
      {/* Title & Navigation Arrows Header */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-foreground flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-primary" />
            <span>{row.title}</span>
          </h2>
          {row.subtitle && (
            <p className="mt-0.5 text-[11px] sm:text-xs text-muted-foreground">{row.subtitle}</p>
          )}
        </div>

        {layout !== "grid" && products.length > 1 && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => scrollCarousel("right")}
              aria-label="محصول قبلی"
              title="مشاهده موارد قبلی"
              className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-xl border border-purple-500/40 bg-card/90 text-purple-600 dark:text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all hover:border-purple-500 hover:bg-purple-500/10 active:scale-95"
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
              className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-xl border border-purple-500/40 bg-card/90 text-purple-600 dark:text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.3)] transition-all hover:border-purple-500 hover:bg-purple-500/10 active:scale-95"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        {/* 1-Row Carousel */}
        {layout === "1-row" && (
          <div
            ref={carouselRef}
            className="flex gap-3 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-1 scrollbar-none overscroll-x-contain"
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
            className="grid grid-rows-2 grid-flow-col auto-cols-[185px] xs:auto-cols-[210px] sm:auto-cols-[285px] gap-3 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-1 scrollbar-none overscroll-x-contain"
          >
            {products.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}

        {/* Grid View */}
        {layout === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-2 justify-items-center">
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

  // Effective rows: if searching, show single search results section; otherwise render custom category rows
  const isSearching = Boolean(searchQuery.trim());

  return (
    <>
      <Hero promoBanner={promoBanner} />

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
        rows.map((row, index) => {
          // If product categoryId matches, or for the first row, products without categoryId
          const rowProducts = filteredProducts.filter((p) =>
            p.categoryId ? p.categoryId === row.id : index === 0
          );
          return (
            <ProductRowSection
              key={row.id}
              row={row}
              products={rowProducts}
              layout={layout}
            />
          );
        })
      )}

      {/* Code-split and lazy-loaded landing sections */}
      <Suspense fallback={<div className="h-16 py-4" />}>
        <Features />
        <HowItWorks />
        <Trust />
        <Faq />
        <SupportCta />
      </Suspense>
    </>
  );
}
