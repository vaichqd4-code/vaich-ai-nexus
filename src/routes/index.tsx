import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { Section } from "@/components/layout/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Trust } from "@/components/sections/Trust";
import { Faq } from "@/components/sections/Faq";
import { SupportCta } from "@/components/sections/SupportCta";
import { NeonLink } from "@/components/ui/NeonButton";
import { useDynamicProducts, type LayoutMode } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "خرید اشتراک هوش مصنوعی | اکانت چت جی پی تی، جمینای، کلود | VAICH" },
      {
        name: "description",
        content:
          "خرید آنلاین و ارزان اشتراک‌های هوش مصنوعی با تحویل سریع؛ خرید قانونی اکانت ChatGPT Plus، اشتراک Gemini Pro و Claude Pro با ضمانت ۱۰۰٪ سلامت اکانت در VAICH.",
      },
      {
        name: "keywords",
        content:
          "خرید اکانت chatgpt plus, خرید اشتراک چت جی پی تی, خرید اکانت gemini pro, خرید اشتراک جمینای, خرید اکانت claude pro, خرید اشتراک هوش مصنوعی, اکانت chatgpt 4o, خرید هوش مصنوعی ارزان, vaich",
      },
      { property: "og:title", content: "خرید اشتراک هوش مصنوعی | اکانت چت جی پی تی، جمینای، کلود | VAICH" },
      {
        property: "og:description",
        content:
          "خرید قانونی و تحویل سریع اکانت‌های هوش مصنوعی (ChatGPT Plus, Gemini Pro, Claude Pro) با قیمت شفاف و گارانتی کامل در VAICH.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://vaich.ir" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Hero() {
  return (
    <section className="aurora relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-14 pb-8 sm:px-6 sm:pt-20 lg:grid-cols-2 lg:pt-24">
        <div className="rise-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-4 py-1.5 text-xs font-semibold text-foreground shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>فروشگاه معتبر اشتراک‌های تخصصی هوش مصنوعی</span>
          </div>

          <h1 className="mt-6 text-3xl leading-[1.4] font-extrabold sm:text-5xl sm:leading-[1.3]">
            خرید مستقیم و قانونی اشتراک‌های <span className="gradient-text">هوش مصنوعی</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-8 text-muted-foreground sm:text-base font-normal">
            دسترسی سریع و بی‌واسطه به برترین اکانت‌های پرمیوم هوش مصنوعی (ChatGPT Plus، Gemini Pro و Claude Pro). فعال‌سازی قانونی بدون نیاز به کارت‌های ارزی و همراه با ضمانت کامل.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <NeonLink to="/products" size="lg">
              مشاهده و خرید اشتراک‌ها
            </NeonLink>
            <NeonLink to="/support" variant="outline" size="lg">
              پشتیبانی آنلاین
            </NeonLink>
          </div>

          {/* نوار اعتمادسازی نوین و شناور با تحویل سریع */}
          <div className="mt-8 flex flex-wrap items-center gap-2.5 sm:gap-3">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-primary/25 bg-secondary/80 px-3.5 py-2 text-xs font-bold text-foreground backdrop-blur-md shadow-xs transition-all hover:border-primary hover:scale-[1.02]">
              <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-primary/15 text-primary">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span>تحویل سریع</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-emerald-500/25 bg-secondary/80 px-3.5 py-2 text-xs font-bold text-foreground backdrop-blur-md shadow-xs transition-all hover:border-emerald-500 hover:scale-[1.02]">
              <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-500">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span>تضمین ۱۰۰٪ سلامت اکانت</span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-2xl border border-purple-500/25 bg-secondary/80 px-3.5 py-2 text-xs font-bold text-foreground backdrop-blur-md shadow-xs transition-all hover:border-purple-500 hover:scale-[1.02]">
              <span className="flex h-6 w-6 items-center justify-center rounded-xl bg-purple-500/15 text-purple-500">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </span>
              <span>پشتیبانی ۲۴ ساعته</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="float-slow glow-strong overflow-hidden rounded-3xl sm:rounded-4xl border border-border shadow-2xl bg-card">
            <img
              src="/317630163_1789657188376603.jpg"
              alt="خرید اشتراک های هوش مصنوعی VAICH"
              width={1024}
              height={768}
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.02]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const carouselRef = useRef<HTMLDivElement>(null);
  const { products, layout, setLayout } = useDynamicProducts();

  // دریافت پیام جستجو از دکمه سرچ در هدر بالای سایت
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

  const scrollCarousel = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = direction === "right" ? 330 : -330;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
  };

  // فیلتر خودکار محصولات
  const filteredProducts = products.filter((p) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;

    return (
      p.name.toLowerCase().includes(q) ||
      (p.service && p.service.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.duration && p.duration.toLowerCase().includes(q))
    );
  });

  return (
    <>
      <Hero />

      <Section
        id="products"
        title="اشتراک‌های هوش مصنوعی"
        subtitle="سرویس مورد نظر خود را با تحویل آنی و قیمت شفاف انتخاب کنید."
      >
        {filteredProducts.length > 0 ? (
          <div className="relative">
            {/* Header Controls: Layout Mode Switcher + Carousel Arrows */}
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-border/50 pb-3">
              {/* Row/Layout Mode Switcher */}
              <div className="flex items-center gap-1 rounded-2xl border border-border/80 bg-secondary/50 p-1">
                <button
                  type="button"
                  onClick={() => setLayout("1-row")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    layout === "1-row"
                      ? "bg-card text-foreground shadow-xs border border-border/60"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ۱ ردیفه
                </button>
                <button
                  type="button"
                  onClick={() => setLayout("2-row")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    layout === "2-row"
                      ? "bg-card text-foreground shadow-xs border border-border/60"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  ۲ ردیفه
                </button>
                <button
                  type="button"
                  onClick={() => setLayout("grid")}
                  className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    layout === "grid"
                      ? "bg-card text-foreground shadow-xs border border-border/60"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  شبکه‌ای
                </button>
              </div>

              {/* Slider Arrows (Active for 1-row and 2-row) */}
              <div className="flex items-center gap-2">
                {layout !== "grid" && (
                  <span className="hidden sm:inline-block text-xs font-medium text-muted-foreground ml-2">
                    {layout === "2-row" ? "اسلایدر ۲ ردیفه همزمان" : "اسلایدر لمسی ۳بعدی"}
                  </span>
                )}
                {layout !== "grid" && (
                  <>
                    <button
                      type="button"
                      onClick={() => scrollCarousel("right")}
                      aria-label="محصول قبلی"
                      title="قبلی"
                      className="grid h-9 w-9 place-items-center rounded-xl border border-border/80 bg-card text-foreground shadow-xs transition-all hover:border-primary hover:text-primary active:scale-95"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      type="button"
                      onClick={() => scrollCarousel("left")}
                      aria-label="محصول بعدی"
                      title="بعدی"
                      className="grid h-9 w-9 place-items-center rounded-xl border border-border/80 bg-card text-foreground shadow-xs transition-all hover:border-primary hover:text-primary active:scale-95"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Layouts: 1-Row Carousel, 2-Row Carousel, or Grid */}
            {layout === "1-row" && (
              <div
                ref={carouselRef}
                className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-1 scrollbar-none"
              >
                {filteredProducts.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            )}

            {layout === "2-row" && (
              <div
                ref={carouselRef}
                className="grid grid-rows-2 grid-flow-col auto-cols-[280px] sm:auto-cols-[315px] gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-1 scrollbar-none"
              >
                {filteredProducts.map((p) => (
                  <ProductCard key={p.slug} product={p} />
                ))}
              </div>
            )}

            {layout === "grid" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-4 justify-items-center">
                {filteredProducts.map((p) => (
                  <ProductCard key={p.slug} product={p} className="w-full max-w-[320px]" />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-3xl border border-border/60 bg-card/40 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              هیچ اشتراکی مطابق با عبارت «{searchQuery}» پیدا نشد.
            </p>
          </div>
        )}
      </Section>

      <Features />
      <HowItWorks />
      <Trust />
      <Faq />
      <SupportCta />
    </>
  );
}
