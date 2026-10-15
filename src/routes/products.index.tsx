import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/layout/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SupportCta } from "@/components/sections/SupportCta";
import { useDynamicProducts } from "@/lib/products";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "خرید انواع اشتراک‌های هوش مصنوعی (ChatGPT, Gemini, Claude) | VAICH" },
      {
        name: "description",
        content:
          "فروشگاه اشتراک‌های رسمی هوش مصنوعی؛ خرید اشتراک ChatGPT Plus، اکانت رسمی Gemini Pro و سرویس Claude Pro با تحویل فوری، بهترین قیمت و ضمانت ۱۰۰٪ سلامت اکانت در VAICH.",
      },
      { property: "og:title", content: "خرید اشتراک‌های رسمی هوش مصنوعی | VAICH" },
      {
        property: "og:description",
        content: "خرید ارزان و مطمئن اکانت‌های ChatGPT Plus، Gemini Pro و Claude Pro با پشتیبانی ۲۴ ساعته.",
      },
      { property: "og:url", content: "https://vaich.ir/products" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://vaich.ir/products" },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { products } = useDynamicProducts();

  const categories = [
    { id: "all", label: "همه اشتراک‌ها" },
    { id: "chatgpt", label: "ChatGPT Plus" },
    { id: "gemini", label: "Gemini Pro" },
    { id: "claude", label: "Claude Pro" },
  ];

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by selected category pill
    if (selectedCategory !== "all") {
      result = result.filter((p) => {
        const text = (p.name + " " + p.slug).toLowerCase();
        return text.includes(selectedCategory);
      });
    }

    const query = search.trim().toLowerCase();
    if (!query) return result;

    return result.filter((product) => {
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
  }, [search, selectedCategory, products]);

  return (
    <>
      <Section
        className="aurora"
        title="اشتراک‌های هوش مصنوعی"
        subtitle="سرویس مورد نظر خود را انتخاب کنید، تفاوت پلن‌ها را بررسی کنید و با تحویل فوری سفارش دهید."
      >
        {/* Search & Category Filter Pills */}
        <div className="mb-8 space-y-4">
          <label htmlFor="product-search" className="sr-only">
            جستجوی محصول
          </label>

          <div className="relative mx-auto max-w-2xl">
            <input
              id="product-search"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="جستجوی اشتراک (مثال: Gemini, ChatGPT, Claude)..."
              className="w-full rounded-2xl border border-border bg-card/70 px-5 py-3.5 pr-5 pl-12 text-right text-sm sm:text-base outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-neon-purple/60 focus:ring-2 focus:ring-neon-purple/20 shadow-xs"
              dir="rtl"
              autoComplete="off"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-muted-foreground"
            >
              🔍
            </span>
          </div>

          {/* Quick Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/25 ring-2 ring-primary/30"
                      : "border border-border/80 bg-card/70 text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Products */}
        {filteredProducts.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
            {filteredProducts.map((product) => (
              <ProductCard key={product.slug} product={product} className="w-full max-w-[340px]" />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-card/70 px-6 py-12 text-center">
            <p className="text-lg font-bold">محصولی با این مشخصات پیدا نشد</p>
            <p className="mt-2 text-sm text-muted-foreground">
              فیلتر را به حالت «همه اشتراک‌ها» برگردانید یا عبارت دیگری را جستجو کنید.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
              className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/90 transition-all"
            >
              نمایش همه اشتراک‌ها
            </button>
          </div>
        )}
      </Section>

      <HowItWorks />
      <SupportCta />
    </>
  );
}
