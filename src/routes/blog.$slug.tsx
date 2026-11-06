import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getBlogPostBySlug, getRelatedBlogPosts } from "@/lib/blog-data";
import { BlogCoverGraphic } from "@/components/blog/BlogCoverGraphic";
import { useDynamicProducts, type InArticleBannerConfig } from "@/lib/products";
import {
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  Sparkles,
  Share2,
  BookOpen,
  ShoppingBag,
  ExternalLink,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = getBlogPostBySlug(params.slug);
    if (!post) {
      throw notFound();
    }
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return {
        meta: [{ title: "مقاله پیدا نشد | وایچ" }],
      };
    }

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      image: post.coverImage,
      datePublished: post.publishIsoDate,
      dateModified: (post as any).lastUpdatedIsoDate || post.publishIsoDate,
      author: {
        "@type": "Person",
        name: "یونس حیاتی",
        jobTitle: "موسس وایچ و کارشناس بهره‌وری دیجیتال",
        url: "https://vaich.ir",
      },
      publisher: {
        "@type": "Organization",
        name: "VAICH",
        url: "https://vaich.ir",
        logo: {
          "@type": "ImageObject",
          url: "https://vaich.ir/vaich-logo.png",
        },
      },
      mainEntityOfPage: {
        "@type": "WebPage",
        "@id": `https://vaich.ir/blog/${post.slug}`,
      },
    };

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "صفحه اصلی",
          item: "https://vaich.ir",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "مجله و مقالات",
          item: "https://vaich.ir/#blog",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: post.title,
          item: `https://vaich.ir/blog/${post.slug}`,
        },
      ],
    };

    return {
      meta: [
        { title: `${post.title} | مجله وایچ` },
        { name: "description", content: post.excerpt },
        { name: "keywords", content: post.keywords.join(", ") },
        { name: "author", content: "یونس حیاتی" },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://vaich.ir/blog/${post.slug}` },
        { property: "og:image", content: post.coverImage },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: post.excerpt },
        { name: "twitter:image", content: post.coverImage },
      ],
      links: [
        { rel: "canonical", href: `https://vaich.ir/blog/${post.slug}` },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify(breadcrumbLd),
        },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const relatedPosts = getRelatedBlogPosts(post.slug, 3);
  const [copied, setCopied] = useState(false);
  const { inArticleBanner } = useDynamicProducts();

  const handleShare = () => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
        >
          <Link to="/" className="hover:text-primary transition-colors">
            خانه
          </Link>
          <span>/</span>
          <Link to="/" hash="blog" className="hover:text-primary transition-colors">
            مجله و آموزش‌ها
          </Link>
          <span>/</span>
          <span className="text-foreground truncate max-w-[200px] sm:max-w-md">
            {post.title}
          </span>
        </nav>

        {/* Article Header */}
        <header className="mb-8 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-full bg-primary/10 border border-primary/25 px-3 py-0.5 text-xs font-bold text-primary">
                {post.category}
              </span>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>{post.date}</span>
                {(post as any).lastUpdatedDate && (
                  <span className="text-primary font-medium">(به‌روزرسانی: {(post as any).lastUpdatedDate})</span>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>زمان مطالعه: {post.readTime}</span>
              </div>
            </div>

            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-foreground bg-secondary/60 hover:bg-secondary px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>{copied ? "لینک کپی شد" : "اشتراک‌گذاری"}</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight text-foreground tracking-tight">
            {post.title}
          </h1>

          <p className="text-sm sm:text-base text-slate-900 dark:text-slate-100 leading-relaxed pt-1 font-medium">
            {post.excerpt}
          </p>
        </header>

        {/* Cover Artwork — Guaranteed 100% Crisp Metallic Visual (No Broken Images) */}
        <div className="mb-10 overflow-hidden rounded-3xl border border-border/80 bg-neutral-950 shadow-xl aspect-[16/9] w-full relative">
          <img
            src={post.coverImage}
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = "none";
              const fb = e.currentTarget.parentElement?.querySelector(".blog-article-fallback");
              if (fb) (fb as HTMLElement).style.display = "block";
            }}
          />
          <div className="blog-article-fallback absolute inset-0 hidden">
            <BlogCoverGraphic slug={post.slug} category={post.category} className="w-full h-full" />
          </div>
        </div>

        {/* Article Body with High Readability Contrast */}
        <article className="blog-article-body space-y-10 leading-relaxed text-sm sm:text-base">
          {post.sections.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-foreground border-r-4 border-primary pr-3 flex items-center gap-2">
                {section.heading}
              </h2>

              {section.paragraphs.map((p, pIdx) => (
                <p
                  key={pIdx}
                  className="leading-8 text-slate-900 dark:text-slate-100 font-normal"
                >
                  {p}
                </p>
              ))}

              {section.callout && (
                <div className="rounded-2xl border border-primary/30 bg-primary/10 dark:bg-primary/15 p-4 sm:p-5 my-4">
                  <div className="flex items-center gap-2 font-bold text-primary text-sm sm:text-base mb-1.5">
                    <Lightbulb className="h-5 w-5 text-primary shrink-0" />
                    <span>{section.callout.title}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-100 leading-relaxed font-medium">
                    {section.callout.text}
                  </p>
                </div>
              )}

              {section.bulletPoints && section.bulletPoints.length > 0 && (
                <ul className="space-y-2.5 pt-2">
                  {section.bulletPoints.map((bp, bpIdx) => (
                    <li
                      key={bpIdx}
                      className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 font-medium"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0 mt-1" />
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              )}

              {(section as any).table && (
                <div className="my-6 overflow-hidden rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md shadow-xs">
                  {(section as any).table.caption && (
                    <div className="bg-secondary/40 px-4 py-2.5 text-xs font-bold text-primary border-b border-border/60">
                      {(section as any).table.caption}
                    </div>
                  )}
                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs sm:text-sm">
                      <thead className="bg-secondary/70 border-b border-border/80 text-foreground font-bold">
                        <tr>
                          {(section as any).table.headers.map((h: string, hIdx: number) => (
                            <th key={hIdx} className="p-3 sm:p-3.5 whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border/50">
                        {(section as any).table.rows.map((row: string[], rIdx: number) => (
                          <tr key={rIdx} className="hover:bg-primary/5 transition-colors">
                            {row.map((cell: string, cIdx: number) => (
                              <td key={cIdx} className={cn("p-3 sm:p-3.5 leading-relaxed", cIdx === 0 ? "font-bold text-foreground" : "text-muted-foreground")}>
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Mid-article In-Article Promo Banner (Admin Managed) or Fallback */}
              {idx === 1 && (
                inArticleBanner && inArticleBanner.enabled ? (
                  <InArticlePromoWidget config={inArticleBanner} />
                ) : (
                  <ProductRecommendationBanner targetType={post.targetProductType} />
                )
              )}
            </section>
          ))}

          {/* Conclusion */}
          <div className="rounded-3xl border border-border/80 bg-card/70 p-6 sm:p-8 backdrop-blur-md space-y-3">
            <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>{post.conclusion.heading}</span>
            </h3>
            <p className="text-sm text-slate-900 dark:text-slate-100 leading-relaxed">
              {post.conclusion.text}
            </p>
          </div>

          {/* Minimal, Discreet Author Signature as Requested */}
          <div className="mt-8 pt-4 border-t border-border/50 text-[12px] text-slate-500 dark:text-slate-400 font-medium text-center sm:text-right">
            نویسنده: یونس حیاتی
          </div>
        </article>

        {/* Bottom CTA Banner */}
        <div className="my-10">
          <ProductRecommendationBanner targetType={post.targetProductType} isFullWidth />
        </div>

        {/* Related Articles Carousel / Grid */}
        {relatedPosts.length > 0 && (
          <div className="my-12 pt-8 border-t border-border/60">
            <h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <span>سایر مقالات و آموزش‌های پیشنهادی</span>
            </h3>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((rPost) => (
                <Link
                  key={rPost.slug}
                  to="/blog/$slug"
                  params={{ slug: rPost.slug }}
                  className="group block rounded-2xl border border-border/80 bg-card/60 p-4 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg"
                >
                  <div className="aspect-[16/10] w-full overflow-hidden rounded-xl bg-neutral-950 mb-3 relative">
                    <img
                      src={rPost.coverImage}
                      alt={rPost.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                        const fb = e.currentTarget.parentElement?.querySelector(".blog-rpost-fallback");
                        if (fb) (fb as HTMLElement).style.display = "block";
                      }}
                    />
                    <div className="blog-rpost-fallback absolute inset-0 hidden">
                      <BlogCoverGraphic slug={rPost.slug} category={rPost.category} className="w-full h-full" />
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-primary">
                    {rPost.category}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-foreground mt-1 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {rPost.title}
                  </h4>
                  <div className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>{rPost.readTime}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back to Blog */}
        <div className="mt-8 text-center">
          <Link
            to="/"
            hash="blog"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-5 py-2.5 text-xs sm:text-sm font-medium text-foreground hover:bg-secondary transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
            <span>مشاهده همه مقالات مجله</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function ProductRecommendationBanner({
  targetType,
  isFullWidth = false,
}: {
  targetType: "planner" | "ai";
  isFullWidth?: boolean;
}) {
  if (targetType === "planner") {
    return (
      <div
        className={`my-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/20 via-background to-card p-5 sm:p-6 shadow-md ${
          isFullWidth ? "w-full" : ""
        }`}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1.5 text-center sm:text-right">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <span className="rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-0.5 font-bold">
                پیشنهاد ویژه
              </span>
              <span className="text-sm sm:text-base font-bold text-foreground">
                پلنر جامع و هوشمند گوگل‌شیت وایچ
              </span>
            </div>
            <p className="text-xs text-neutral-700 dark:text-slate-300 max-w-xl leading-relaxed">
              سیستم ردیابی روزانه، نمودارهای خودکار پیشرفت، فرمول‌های محاسبه عملکرد و دسترسی مادام‌العمر در موبایل و لپ‌تاپ.
            </p>
          </div>
          <Link
            to="/products/$slug"
            params={{ slug: "vaich-life-planner" }}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/20 transition-all shrink-0 hover:scale-105"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>مشاهده و دریافت پلنر</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`my-6 rounded-3xl border border-primary/30 bg-gradient-to-r from-primary/10 via-background to-card p-5 sm:p-6 shadow-md ${
        isFullWidth ? "w-full" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center sm:text-right">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="rounded-full bg-primary/15 text-primary border border-primary/30 text-xs px-2.5 py-0.5 font-bold">
              تضمین اصالت و پایداری
            </span>
            <span className="text-sm sm:text-base font-bold text-foreground">
              خرید قانونی اشتراک‌های هوش مصنوعی (ChatGPT, Claude, Gemini)
            </span>
          </div>
          <p className="text-xs text-neutral-700 dark:text-slate-300 max-w-xl leading-relaxed">
            تحویل آنی، فعال‌سازی مستقیم روی ایمیل شما، ضمانت ۱۰۰٪ و پشتیبانی ۲۴ ساعته متخصصان وایچ.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-full neon-gradient text-primary-foreground px-5 py-2.5 text-xs sm:text-sm font-bold shadow-lg transition-all shrink-0 hover:scale-105"
        >
          <ShoppingBag className="h-4 w-4" />
          <span>مشاهده پلن‌ها و خرید</span>
        </Link>
      </div>
    </div>
  );
}

function InArticlePromoWidget({ config }: { config: InArticleBannerConfig }) {
  const isExternal =
    config.linkUrl?.startsWith("http://") || config.linkUrl?.startsWith("https://");

  const ContentWrapper = ({ children }: { children: React.ReactNode }) => {
    if (!config.linkUrl) return <>{children}</>;
    if (isExternal) {
      return (
        <a
          href={config.linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block group no-underline"
        >
          {children}
        </a>
      );
    }
    return (
      <a href={config.linkUrl} className="block group no-underline">
        {children}
      </a>
    );
  };

  return (
    <div className="my-8 not-prose">
      <ContentWrapper>
        <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 via-background to-teal-500/10 p-5 sm:p-6 backdrop-blur-xl shadow-lg transition-all duration-300 hover:border-emerald-500/50 hover:shadow-emerald-500/10 hover:shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-6">
            {config.imageUrl && (
              <div className="relative w-full sm:w-48 h-36 shrink-0 overflow-hidden rounded-2xl border border-border/60 bg-secondary/40 shadow-md">
                <img
                  src={config.imageUrl}
                  alt={config.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
            )}
            <div className="flex-1 space-y-2.5 text-center sm:text-right">
              {config.badge && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  <Sparkles className="h-3.5 w-3.5" />
                  {config.badge}
                </span>
              )}
              <h3 className="text-base sm:text-lg font-black text-foreground leading-snug group-hover:text-emerald-500 transition-colors">
                {config.title}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {config.description}
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 px-5 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-md shadow-emerald-500/20 transition-transform group-hover:scale-105">
                  <span>{config.buttonText || "مشاهده و خرید"}</span>
                  <ExternalLink className="h-4 w-4" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}
