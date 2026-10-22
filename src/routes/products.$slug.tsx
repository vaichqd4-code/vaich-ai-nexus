import { createFileRoute, notFound, Link, redirect } from "@tanstack/react-router";
import { ServiceIcon } from "@/components/brand/ServiceIcon";
import { Section } from "@/components/layout/Section";
import { NeonLink } from "@/components/ui/NeonButton";
import { formatPrice, toPersianDigits, getProduct } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    const raw = (params.slug || "").toLowerCase();
    if (raw === "planners" || raw === "planner" || raw.includes("پلنر")) {
      throw redirect({ to: "/", hash: "planners" });
    }
    let product = getProduct(params.slug);
    if (!product && typeof window !== "undefined") {
      try {
        const res = await fetch("/site-config.json");
        if (res.ok) {
          const config = await res.json();
          product = config.products?.find((p: any) => p.slug === params.slug);
        }
      } catch {
        // network error fallback
      }
    }
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "محصول یافت نشد | VAICH" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    const title = `خرید اشتراک ${product.name} (${product.duration || "قانونی"}) | VAICH`;
    const canonicalUrl = `https://vaich.ir/products/${encodeURIComponent(product.slug)}`;
    return {
      meta: [
        { title },
        { name: "description", content: `خرید آنلاین اشتراک قانونی ${product.name} با تحویل فوری، پشتیبانی ۲۴ ساعته و ضمانت سلامت اکانت. ${product.description} قیمت: ${formatPrice(product.price)}` },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: [
        { rel: "canonical", href: canonicalUrl },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();

  const badgeColorMap: Record<string, string> = {
    fire: "bg-linear-to-r from-rose-500 to-amber-500 text-white shadow-rose-500/20",
    purple: "bg-linear-to-r from-primary to-accent text-white shadow-primary/20",
    emerald: "bg-emerald-600 text-white shadow-emerald-600/20",
    blue: "bg-blue-600 text-white shadow-blue-600/20",
    amber: "bg-amber-400 text-slate-950 font-black shadow-amber-400/20",
  };
  const badgeClass = (product.badgeColor && badgeColorMap[product.badgeColor]) || badgeColorMap.purple;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `اشتراک ${product.name}`,
    description: product.description,
    image: "https://vaich.ir/vaich-logo.png",
    offers: {
      "@type": "Offer",
      url: `https://vaich.ir/products/${encodeURIComponent(product.slug)}`,
      priceCurrency: "IRR",
      price: product.price,
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "VAICH",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <Section className="aurora overflow-x-hidden">
        {/* Breadcrumb Navigation */}
        <nav aria-label="مسیر راهنما" className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            خانه
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground transition-colors">
            محصولات و خدمات
          </Link>
          <span>/</span>
          <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        <div className="glass-panel rounded-3xl sm:rounded-4xl p-4 sm:p-8 overflow-hidden">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.4fr_1fr]">
            <div className="min-w-0">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <ServiceIcon
                  slug={product.slug}
                  iconUrl={product.iconUrl}
                  imageFit={product.imageFit}
                  className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 aspect-square rounded-2xl sm:rounded-3xl border border-border/90 shadow-md bg-secondary/60"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl sm:text-3xl font-extrabold text-foreground break-words">
                      {product.name}
                    </h1>
                    {product.badge && (
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold text-white shadow-xs", badgeClass)}>
                        {product.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground break-words">{product.description}</p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-base font-bold flex items-center gap-2 text-foreground">
                  <span className="h-2 w-2 rounded-full bg-primary" />
                  اطلاعات مهم خرید و تحویل
                </h2>
                <ul className="mt-3 space-y-3">
                  {product.purchaseInfo.map((info) => (
                    <li
                      key={info}
                      className="rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm leading-7 text-muted-foreground break-words"
                    >
                      {info}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <aside className="h-fit rounded-3xl border border-border bg-card/70 p-4 sm:p-6 shadow-lg min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">قیمت سرویس:</span>
                {product.duration && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/60 px-2.5 py-0.5 text-xs font-medium text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    مدت: {product.duration}
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-baseline gap-2">
                <p className="gradient-text text-3xl font-extrabold tracking-tight">
                  {formatPrice(product.price)}
                </p>
                {product.originalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
                {product.discountPercent ? (
                  <span className="rounded-md bg-rose-500/10 px-1.5 py-0.5 text-xs font-bold text-rose-500 border border-rose-500/20">
                    %{toPersianDigits(product.discountPercent)}
                  </span>
                ) : null}
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                <NeonLink to="/checkout/$slug" params={{ slug: product.slug }} size="lg" className="w-full text-center">
                  خرید آنلاین و تحویل فوری
                </NeonLink>
                <NeonLink to="/support" variant="outline" size="lg" className="w-full text-center">
                  مشاوره و پشتیبانی
                </NeonLink>
              </div>

              {/* Conversion Trust Checklist */}
              <div className="mt-5 space-y-2 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>فعال‌سازی قانونی با گارانتی سلامت اکانت</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>تحویل سریع پس از واریز و تأیید فاکتور</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-500 font-bold">✓</span>
                  <span>پشتیبانی اختصاصی در صورت بروز هرگونه مشکل</span>
                </div>
              </div>

              {product.features && product.features.length > 0 && (
                <div className="mt-6 rounded-2xl border border-border/80 bg-background/50 p-4">
                  <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                    <span>✨</span> قابلیت‌ها و دسترسی‌های این پلن
                  </h3>
                  <ul className="space-y-2.5">
                    {product.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="text-xs leading-6 text-muted-foreground"
                      >
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </div>
      </Section>
    </>
  );
}
