import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/layout/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SupportCta } from "@/components/sections/SupportCta";
import { products } from "@/lib/products";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "اشتراک‌های هوش مصنوعی | VAICH" },
      {
        name: "description",
        content:
          "لیست اشتراک‌های هوش مصنوعی VAICH شامل Gemini، ChatGPT و Claude همراه با قیمت.",
      },
      { property: "og:title", content: "اشتراک‌های هوش مصنوعی | VAICH" },
      {
        property: "og:description",
        content: "اشتراک Gemini، ChatGPT و Claude را از VAICH تهیه کنید.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [search, setSearch] = useState("");

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return products;
    }

    return products.filter((product) => {
      const searchableText = [
        product.name,
        product.slug,
        product.description,
        product.duration ?? "",
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [search]);

  return (
    <>
      <Section
        className="aurora"
        title="اشتراک‌های هوش مصنوعی"
        subtitle="سرویس مورد نظر خود را انتخاب کنید و جزئیات آن را ببینید."
      >
        {/* Search */}
        <div className="mb-8">
          <label htmlFor="product-search" className="sr-only">
            جستجوی محصول
          </label>

          <div className="relative mx-auto max-w-2xl">
            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="محصول مورد نظر را جستجو کنید..."
              className="w-full rounded-2xl border border-border bg-card/70 px-5 py-4 text-right text-base outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-neon-purple/60 focus:ring-2 focus:ring-neon-purple/20"
              dir="rtl"
              autoComplete="off"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-xl text-muted-foreground"
            >
              🔍
            </span>
          </div>
        </div>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-card/70 px-6 py-12 text-center">
            <p className="text-lg font-bold">محصولی پیدا نشد</p>
            <p className="mt-2 text-sm text-muted-foreground">
              نام محصول را بررسی کنید و دوباره جستجو کنید.
            </p>
          </div>
        )}
      </Section>

      <HowItWorks />
      <SupportCta />
    </>
  );
    }
