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
import { products } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "خرید اشتراک هوش مصنوعی | اکانت چت جی پی تی، جمینای، کلود | VAICH" },
      {
        name: "description",
        content:
          "خرید آنلاین و ارزان اشتراک‌های هوش مصنوعی با تحویل زیر ۱۵ دقیقه؛ خرید قانونی اکانت ChatGPT Plus، اشتراک Gemini Pro و Claude Pro با ضمانت ۱۰۰٪ سلامت اکانت در VAICH.",
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
          "خرید قانونی و تحویل آنی اکانت‌های هوش مصنوعی (ChatGPT Plus, Gemini Pro, Claude Pro) با قیمت شفاف و گارانتی کامل در VAICH.",
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

          {/* نوار اعتمادسازی انسانی و فنی */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 border-t border-border/60 pt-6">
            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>تحویل زیر ۱۵ دقیقه</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>تضمین ۱۰۰٪ سلامت اکانت</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-foreground col-span-2 sm:col-span-1">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
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
            {/* Carousel Navigation Header */}
            <div className="mb-4 flex items-center justify-between gap-4">
              <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>برای مشاهده تمام محصولات، به چپ و راست بکشید (اسلایدر لمسی)</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollCarousel("right")}
                  aria-label="محصول قبلی"
                  title="قبلی"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-border/80 bg-card text-foreground shadow-xs transition-all hover:border-primary hover:text-primary active:scale-95"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => scrollCarousel("left")}
                  aria-label="محصول بعدی"
                  title="بعدی"
                  className="grid h-10 w-10 place-items-center rounded-xl border border-border/80 bg-card text-foreground shadow-xs transition-all hover:border-primary hover:text-primary active:scale-95"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Horizontal Swipeable Track */}
            <div
              ref={carouselRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-1 scrollbar-none"
            >
              {filteredProducts.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
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
