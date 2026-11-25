import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SupportCta } from "@/components/sections/SupportCta";
import { DEFAULT_PRODUCTS, useDynamicProducts } from "@/lib/products";

type ProductsSearch = {
  q?: string;
  category?: string;
};

export const Route = createFileRoute("/products/")({
  validateSearch: (search: Record<string, unknown>): ProductsSearch => {
    const q = typeof search.q === "string" && search.q.trim() ? search.q.trim() : undefined;
    const category =
      typeof search.category === "string" && search.category.trim() && search.category !== "all"
        ? search.category.trim()
        : undefined;
    return {
      ...(q ? { q } : {}),
      ...(category ? { category } : {}),
    };
  },
  head: () => ({
    meta: [
      { title: "خرید اشتراک هوش مصنوعی، تلگرام پرمیوم، استارز، کانوا پرو و پلنر | VAICH" },
      {
        name: "description",
        content:
          "فروشگاه رسمی VAICH؛ خرید اشتراک قانونی ChatGPT Plus، Gemini Pro، Claude Pro، تلگرام پرمیوم، استارز تلگرام، کانوا پرو و پلنر هوشمند گوگل‌شیت با تحویل سریع و ضمانت پایداری.",
      },
      {
        name: "keywords",
        content:
          "خرید استارز تلگرام, خرید تلگرام پرمیوم, خرید کانوا پرو, خرید ChatGPT Plus, خرید Claude Pro, خرید Gemini Pro, پلنر دیجیتال گوگل شیت, فروشگاه وایچ",
      },
      { property: "og:title", content: "محصولات و اشتراک‌های رسمی | VAICH" },
      {
        property: "og:description",
        content: "خرید قانونی و مطمئن اکانت‌های ChatGPT Plus، Gemini Pro، Claude Pro، تلگرام پرمیوم، استارز تلگرام، کانوا پرو و پلنر دیجیتال با پشتیبانی ۲۴ ساعته.",
      },
      { property: "og:url", content: "https://vaich.ir/products" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "canonical", href: "https://vaich.ir/products" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "کاتالوگ محصولات و اشتراک‌های VAICH",
          url: "https://vaich.ir/products",
          mainEntity: {
            "@type": "ItemList",
            itemListElement: DEFAULT_PRODUCTS.map((p, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              name: p.name,
              url: `https://vaich.ir/products/${p.slug}`,
            })),
          },
        }),
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { q, category } = Route.useSearch();
  const [search, setSearch] = useState(q || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(category || "all");
  const { products } = useDynamicProducts();

  useEffect(() => {
    if (q !== undefined) setSearch(q);
  }, [q]);

  useEffect(() => {
    if (category !== undefined) setSelectedCategory(category);
  }, [category]);

  const categories = [
    { id: "all", label: "همه محصولات" },
    { id: "planner", label: "پلنرهای دیجیتال" },
    { id: "premium-apps", label: "اشتراک‌های پرمیوم و کاربردی" },
    { id: "chatgpt", label: "ChatGPT Plus" },
    { id: "gemini", label: "Gemini Pro" },
    { id: "claude", label: "Claude Pro" },
  ];

  const filteredProducts = useMemo(() => {
    let result = products;

    // Filter by selected category pill
    if (selectedCategory !== "all") {
      result = result.filter((p) => {
        const text = (p.name + " " + p.slug + " " + (p.categoryId || "")).toLowerCase();
        if (selectedCategory === "planner") {
          return text.includes("planner") || text.includes("پلنر") || p.categoryId === "row-mvampt3r";
        }
        if (selectedCategory === "premium-apps") {
          return (
            p.categoryId === "premium-apps" ||
            text.includes("telegram") ||
            text.includes("canva") ||
            text.includes("تلگرام") ||
            text.includes("کانوا")
          );
        }
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
        title="محصولات و اشتراک‌های وایچ"
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
              placeholder="جستجوی محصول (مثال: پلنر، تلگرام پرمیوم، استارز، کانوا، Gemini, ChatGPT)..."
              className="w-full rounded-2xl border border-border bg-card/70 px-5 py-3.5 pr-5 pl-12 text-right text-sm sm:text-base outline-none transition-all duration-300 placeholder:text-muted-foreground focus:border-neon-purple/60 focus:ring-2 focus:ring-neon-purple/20 shadow-xs"
              dir="rtl"
              autoComplete="off"
            />

            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
            >
              <Search className="w-5 h-5" />
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
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${isActive
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
              فیلتر را به حالت «همه محصولات» برگردانید یا عبارت دیگری را جستجو کنید.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("all");
              }}
              className="mt-4 rounded-full bg-primary px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/90 transition-all"
            >
              نمایش همه محصولات
            </button>
          </div>
        )}
      </Section>

      <HowItWorks />
      <SupportCta />
    </>
  );
}
