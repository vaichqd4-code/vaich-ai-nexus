import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Section } from "@/components/layout/Section";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Trust } from "@/components/sections/Trust";
import { Faq } from "@/components/sections/Faq";
import { SupportCta } from "@/components/sections/SupportCta";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // دریافت همگام جستجو از کادر هدر بالای سایت
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

  // فیلتر کاملاً داینامیک روی آرایه محصولات (پشتیبانی خودکار از محصولات جدید)
  const filteredProducts = products.filter((product) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;

    return (
      product.name.toLowerCase().includes(query) ||
      (product.service && product.service.toLowerCase().includes(query)) ||
      (product.description && product.description.toLowerCase().includes(query)) ||
      (product.duration && product.duration.toLowerCase().includes(query))
    );
  });

  return (
    <div className="flex flex-col gap-12 pb-16">
      {/* بخش اصلی معرفی سایت */}
      <section className="relative overflow-hidden py-16 text-center">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            دسترسی سریع و امن به <span className="text-neon-blue">سرویس‌های هوش مصنوعی</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            خرید اشتراک معتبر و اختصاصی ChatGPT، Gemini، Claude و برترین ابزارهای هوش مصنوعی با پشتیبانی دائمی VAICH.
          </p>
        </div>
      </section>

      {/* بخش محصولات با کادر سرچ دائمی و شیک */}
      <Section
        id="products"
        title="محصولات و اشتراک‌ها"
        subtitle="پلن مورد نظر خود را انتخاب کرده و سفارش را ثبت نمایید"
      >
        <div className="mx-auto mb-8 max-w-md">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="جستجو در تمام محصولات و سرویس‌ها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-border bg-background/60 py-3 pl-10 pr-4 text-sm outline-none transition-colors focus:border-neon-blue/70"
            />
            <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-border/60 bg-card/40 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              هیچ محصولی مطابق با عبارت «{searchQuery}» پیدا نشد.
            </p>
          </div>
        )}
      </Section>

      <Features />
      <HowItWorks />
      <Trust />
      <Faq />
      <SupportCta />
    </div>
  );
}
