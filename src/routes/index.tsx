import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
      { title: "VAICH | خرید اشتراک هوش مصنوعی" },
      {
        name: "description",
        content:
          "VAICH ارائه‌دهنده اشتراک سرویس‌های هوش مصنوعی Gemini، ChatGPT و Claude با پشتیبانی و قیمت شفاف.",
      },
      { property: "og:title", content: "VAICH | خرید اشتراک هوش مصنوعی" },
      {
        property: "og:description",
        content: "اشتراک سرویس‌های قدرتمند هوش مصنوعی را با VAICH تجربه کنید.",
      },
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

          <h1 className="mt-6 text-3xl leading-[1.5] font-extrabold sm:text-5xl sm:leading-[1.35]">
            دنیای هوش مصنوعی، <span className="gradient-text">یک قدم نزدیک‌تر</span>
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-8 text-muted-foreground sm:text-base font-normal">
            دسترسی قانونی و مستقیم به برترین سرویس‌های هوش مصنوعی (Gemini، ChatGPT و Claude) بدون دردسر ویزاکارت و تحریم، با پشتیبانی واقعی و قیمت شفاف.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <NeonLink to="/products" size="lg">
              مشاهده محصولات
            </NeonLink>
            <NeonLink to="/support" variant="outline" size="lg">
              پشتیبانی مستقیم
            </NeonLink>
          </div>

          {/* نوار اعتمادسازی انسانی (Human Trust Badges) */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 border-t border-border/60 pt-6">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-primary" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>تحویل زیر ۱۵ دقیقه</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>تضمین سلامت اکانت</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground col-span-2 sm:col-span-1">
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-accent" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
              <span>پشتیبانی توسط یونس حیاتی</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="float-slow glow-strong overflow-hidden rounded-3xl sm:rounded-4xl border border-border shadow-2xl bg-card">
            <img
              src="/317630163_1789657188376603.jpg"
              alt="پلتفرم اشتراک هوش مصنوعی VAICH"
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

  // فیلتر کاملاً خودکار و پویا روی تمام محصولات (فعلی و آینده)
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
        subtitle="سرویس مورد نظر خود را انتخاب کنید."
      >
        {filteredProducts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((p) => (
              <ProductCard key={p.slug} product={p} />
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

      <Features />
      <HowItWorks />
      <Trust />
      <Faq />
      <SupportCta />
    </>
  );
}
