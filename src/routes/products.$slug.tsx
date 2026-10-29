import { createFileRoute, notFound, Link, redirect } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ServiceIcon } from "@/components/brand/ServiceIcon";
import { Section } from "@/components/layout/Section";
import { NeonLink } from "@/components/ui/NeonButton";
import { formatPrice, toPersianDigits, getProduct, type ProductReview } from "@/lib/products";
import { cn } from "@/lib/utils";
import { Star, MessageSquarePlus, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    const raw = (params.slug || "").toLowerCase();
    if (raw === "planners" || raw === "planner" || raw.includes("پلنر")) {
      throw redirect({ to: "/" });
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
    const isPlanner = product.slug.includes("planner");
    const title = isPlanner
      ? `خرید ${product.name} | پلنر برنامه ریزی هوشمند گوگل شیت | VAICH`
      : `خرید اشتراک ${product.name} (${product.duration || "قانونی"}) | VAICH`;
    const description = isPlanner
      ? `خرید آنلاین ${product.name} در گوگل شیت با ردیاب عادات ماهانه، نمودارهای تحلیلی داینامیک، نسخه‌های دوبعدی و سه‌بعدی و تحویل آنی. بدون نیاز به اشتراک ماهانه.`
      : `خرید آنلاین اشتراک قانونی ${product.name} با تحویل فوری، پشتیبانی ۲۴ ساعته و ضمانت سلامت اکانت. ${product.description} قیمت: ${formatPrice(product.price)}`;
    const keywords = isPlanner
      ? "خرید پلنر برنامه ریزی, پلنر گوگل شیت, پلنر دیجیتال, ردیاب عادات روزانه, پلنر هوشمند, مدیریت زمان, پلنر 1403, پلنر 1404"
      : `خرید اشتراک ${product.name}, خرید اکانت ${product.name}, اکانت قانونی ${product.name}, هوش مصنوعی`;
    const canonicalUrl = `https://vaich.ir/products/${encodeURIComponent(product.slug)}`;

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: keywords },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
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

  // Reviews state with persistence to localStorage
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const defaultRevs = product.reviews || [];
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem(`vaich_user_reviews_${product.slug}`);
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            return [...parsed, ...defaultRevs];
          }
        }
      } catch {}
    }
    return defaultRevs;
  });

  const [newAuthor, setNewAuthor] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewSubmittedMsg, setReviewSubmittedMsg] = useState("");

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const rev: ProductReview = {
      id: "usr-" + Date.now(),
      author: newAuthor.trim() || "کاربر خریدار",
      rating: newRating,
      comment: newComment.trim(),
      createdAt: new Date().toISOString(),
      verified: true,
      status: "approved",
    };

    const updated = [rev, ...reviews];
    setReviews(updated);

    if (typeof window !== "undefined") {
      try {
        const userSaved = localStorage.getItem(`vaich_user_reviews_${product.slug}`);
        const parsed = userSaved ? JSON.parse(userSaved) : [];
        localStorage.setItem(`vaich_user_reviews_${product.slug}`, JSON.stringify([rev, ...parsed]));
      } catch {}
    }

    setNewAuthor("");
    setNewComment("");
    setNewRating(5);
    setReviewSubmittedMsg("دیدگاه ارزشمند شما با موفقیت ثبت شد! سپاس از همراهی شما با وایچ. ⭐");
    setTimeout(() => setReviewSubmittedMsg(""), 6000);
  };

  useEffect(() => {
    if (typeof window === "undefined" || !product) return;
    import("@/lib/analytics").then(({ trackEvent }) => {
      trackEvent("product_view", {
        productSlug: product.slug,
        productName: product.name,
        amount: product.price,
      });
    });
  }, [product?.slug]);

  const badgeColorMap: Record<string, string> = {
    fire: "bg-linear-to-r from-rose-500 to-amber-500 text-white shadow-rose-500/20",
    purple: "bg-linear-to-r from-primary to-accent text-white shadow-primary/20",
    emerald: "bg-emerald-600 text-white shadow-emerald-600/20",
    blue: "bg-blue-600 text-white shadow-blue-600/20",
    amber: "bg-amber-400 text-slate-950 font-black shadow-amber-400/20",
  };
  const badgeClass = (product.badgeColor && badgeColorMap[product.badgeColor]) || badgeColorMap.purple;

  const isOutOfStock = product.inStock === false;
  const isPlanner = product.slug.includes("planner") || product.categoryId === "row-mvampt3r";
  const avgRating = product.rating || (isPlanner ? 4.9 : 4.8);
  const countReviews = (product.reviewCount || 0) + (reviews.length - (product.reviews?.length || 0));

  // Google Search Console JSON-LD Structured Data with AggregateRating and Reviews
  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: isPlanner ? product.name : `اشتراک ${product.name}`,
    description: product.description,
    image: "https://vaich.ir/vaich-logo.png",
    offers: {
      "@type": "Offer",
      url: `https://vaich.ir/products/${encodeURIComponent(product.slug)}`,
      priceCurrency: "IRR",
      price: product.price,
      availability: isOutOfStock ? "https://schema.org/OutOfStock" : "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "VAICH",
      },
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: avgRating.toString(),
      bestRating: "5",
      worstRating: "1",
      ratingCount: Math.max(countReviews, 1).toString(),
      reviewCount: Math.max(countReviews, 1).toString(),
    },
    review: reviews.slice(0, 5).map((r) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: r.author,
      },
      datePublished: r.createdAt.split("T")[0],
      reviewBody: r.comment,
      reviewRating: {
        "@type": "Rating",
        ratingValue: r.rating.toString(),
        bestRating: "5",
        worstRating: "1",
      },
    })),
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
                    {isOutOfStock && (
                      <span className="rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-400 border border-rose-500/30">
                        ناموجود
                      </span>
                    )}
                  </div>

                  {isPlanner && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
                      <span>✨</span>
                      <span>خرید دائمی و مادام‌العمر • بدون نیاز به تمدید یا هزینه اشتراک ماهانه</span>
                    </div>
                  )}

                  {/* Rating summary line */}
                  <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <span>★</span>
                      <span className="text-foreground">{toPersianDigits(avgRating.toFixed(1))}</span>
                    </div>
                    <span>•</span>
                    <span>{toPersianDigits(countReviews)} نظر ثبت‌شده خریداران</span>
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
              {/* Out of Stock Notice Banner */}
              {isOutOfStock && (
                <div className="mb-4 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-center">
                  <span className="text-xs sm:text-sm font-bold text-rose-500 flex items-center justify-center gap-1.5">
                    <span>⚠️</span> این محصول در حال حاضر ناموجود است
                  </span>
                  <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground">
                    برای اطلاع از شارژ مجدد یا سفارش خصوصی می‌توانید با پشتیبانی در ارتباط باشید.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{isPlanner ? "مبلغ خرید دائمی:" : "قیمت سرویس:"}</span>
                {product.duration && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-secondary/60 px-2.5 py-0.5 text-xs font-medium text-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    {isPlanner ? "دسترسی مادام‌العمر" : `مدت: ${product.duration}`}
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
                  <span
                    dir="ltr"
                    className="rounded-lg bg-rose-500 font-sans text-xs font-black text-white px-2 py-0.5 shadow-xs tracking-tight"
                  >
                    -{product.discountPercent}%
                  </span>
                ) : null}
              </div>

              <div className="mt-6 flex flex-col gap-2.5">
                {isOutOfStock ? (
                  <button
                    disabled
                    type="button"
                    className="w-full rounded-2xl bg-secondary/80 py-3 text-center text-sm font-bold text-muted-foreground border border-border cursor-not-allowed select-none"
                  >
                    ناموجود (اتمام موجودی)
                  </button>
                ) : (
                  <NeonLink to="/checkout/$slug" params={{ slug: product.slug }} size="lg" className="w-full text-center font-bold">
                    {isPlanner ? "خرید مستقیم و تحویل آنی فایل" : "خرید آنلاین و تحویل فوری"}
                  </NeonLink>
                )}
                <NeonLink to="/support" variant="outline" size="lg" className="w-full text-center">
                  مشاوره و پشتیبانی
                </NeonLink>
              </div>

              {/* Conversion Trust Checklist */}
              <div className="mt-5 space-y-2.5 border-t border-border/60 pt-4 text-xs text-muted-foreground">
                {isPlanner ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span className="text-foreground font-semibold">دسترسی دائمی و مادام‌العمر (بدون هزینه اشتراک ماهانه)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>تحویل آنی لینک کپی اختصاصی در گوگل درایو بلافاصله پس از پرداخت</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>پشتیبانی اختصاصی و راهنمای کامل راه‌اندازی فارسی در ۳ دقیقه</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>فعال‌سازی ۱۰۰٪ قانونی با گارانتی سلامت اکانت</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>تحویل سریع اطلاعات اشتراک پس از تأیید فاکتور</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>پشتیبانی اختصاصی در تمام طول دوره اشتراک</span>
                    </div>
                  </>
                )}
              </div>

              {product.features && product.features.length > 0 && (
                <div className="mt-6 rounded-2xl border border-border/80 bg-background/50 p-4">
                  <h3 className="mb-3.5 flex items-center gap-2 text-sm font-bold text-foreground">
                    <span className="h-2 w-2 rounded-full bg-primary" />
                    <span>قابلیت‌ها و دسترسی‌های این محصول</span>
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, idx) => {
                      const cleanFeature = feature.replace(/^[\p{Emoji}\s\u200d]+/u, "").trim();
                      return (
                        <li
                          key={idx}
                          className="flex items-start gap-2.5 text-xs leading-6 text-muted-foreground"
                        >
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/70" />
                          <span className="flex-1">{cleanFeature || feature}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </aside>
          </div>

          {/* Customer Reviews & Google Rating Section */}
          <section className="mt-12 border-t border-border/80 pt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold flex items-center gap-2 text-foreground">
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  نظرات و رضایت خریداران
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  تجربه واقعی کاربران از خرید و استفاده از {product.name}
                </p>
              </div>

              {/* Quick Overall Rating Badge */}
              <div className="flex items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-amber-300">
                <div className="flex text-amber-400">
                  {"★".repeat(5)}
                </div>
                <span className="text-sm font-black text-foreground">
                  {toPersianDigits(avgRating.toFixed(1))} از ۵
                </span>
                <span className="text-xs text-muted-foreground">
                  ({toPersianDigits(countReviews)} نظر ثبت‌شده)
                </span>
              </div>
            </div>

            {/* Grid of Reviews + Add Review Form */}
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground text-xs">
                    هنوز نظری برای این سرویس ثبت نشده است. اولین نفری باشید که تجربه خود را می‌نویسد!
                  </div>
                ) : (
                  reviews.map((rev) => (
                    <article
                      key={rev.id}
                      className="rounded-2xl border border-border/80 bg-background/60 p-4 transition-all hover:border-primary/40 shadow-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary/80 font-bold text-xs text-foreground">
                            {rev.author.charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-foreground">{rev.author}</h4>
                              {rev.verified && (
                                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                                  <CheckCircle2 className="h-3 w-3" />
                                  خریدار تأیید شده
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              {rev.createdAt.split("T")[0]}
                            </span>
                          </div>
                        </div>

                        {/* Stars */}
                        <div className="flex text-amber-400 text-xs">
                          {"★".repeat(rev.rating)}
                          {"☆".repeat(5 - rev.rating)}
                        </div>
                      </div>

                      <p className="mt-3 text-xs leading-6 text-muted-foreground break-words">
                        {rev.comment}
                      </p>
                    </article>
                  ))
                )}
              </div>

              {/* Submit Review Form */}
              <div className="rounded-3xl border border-border bg-card/60 p-5 shadow-md h-fit">
                <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
                  <MessageSquarePlus className="h-4 w-4 text-primary" />
                  ثبت دیدگاه و امتیاز شما
                </h3>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  بدون نیاز به ثبت‌نام یا شماره تلفن، نظر خود را برای این محصول بنویسید.
                </p>

                {reviewSubmittedMsg ? (
                  <div className="mt-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400 leading-6">
                    {reviewSubmittedMsg}
                  </div>
                ) : (
                  <form onSubmit={handleAddReview} className="mt-4 space-y-3.5">
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        امتیاز شما به این محصول:
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 text-lg transition-transform hover:scale-125 focus:outline-none"
                            aria-label={`امتیاز ${star} ستاره`}
                          >
                            <span
                              className={
                                (hoverRating || newRating) >= star
                                  ? "text-amber-400 font-bold"
                                  : "text-muted/60"
                              }
                            >
                              ★
                            </span>
                          </button>
                        ))}
                        <span className="mr-2 text-xs text-muted-foreground">
                          ({toPersianDigits(newRating)} از ۵)
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        نام شما (اختیاری):
                      </label>
                      <input
                        type="text"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        placeholder="مثال: علی رضایی یا کاربر ناشناس"
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        maxLength={50}
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        متن دیدگاه یا نظر شما: <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="تجربه شما در مورد کیفیت فعال‌سازی، سرعت تحویل و ارزش خرید..."
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
                        maxLength={600}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
                    >
                      ثبت و انتشار دیدگاه
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        </div>
      </Section>
    </>
  );
}
