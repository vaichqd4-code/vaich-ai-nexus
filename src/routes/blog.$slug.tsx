import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { getBlogPostBySlug, getRelatedBlogPosts, type BlogPost } from "@/lib/blog-data";
import { BlogCoverGraphic } from "@/components/blog/BlogCoverGraphic";
import { useDynamicProducts, type InArticleBannerConfig } from "@/lib/products";
import {
  Calendar,
  Clock,
  ArrowRight,
  ArrowLeft,
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
    if (params.slug !== post.slug) {
      throw redirect({
        to: "/blog/$slug",
        params: { slug: post.slug },
        statusCode: 301,
      });
    }
    return { post };
  },
  head: ({ loaderData }) => {
    const post = loaderData?.post;
    if (!post) {
      return {
        meta: [
          { title: "مقاله پیدا نشد | وایچ" },
          { name: "robots", content: "noindex, nofollow" },
        ],
      };
    }

    const coverImgUrl = post.coverImage.startsWith("http")
      ? post.coverImage
      : `https://vaich.ir${post.coverImage.startsWith("/") ? "" : "/"}${post.coverImage}`;
    const metaDesc = post.excerpt.length > 155 ? `${post.excerpt.slice(0, 152)}...` : post.excerpt;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: metaDesc,
      image: coverImgUrl,
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
          item: "https://vaich.ir/blog",
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
        { name: "description", content: metaDesc },
        { name: "author", content: "یونس حیاتی" },
        { property: "og:title", content: post.title },
        { property: "og:description", content: metaDesc },
        { property: "og:type", content: "article" },
        { property: "og:url", content: `https://vaich.ir/blog/${post.slug}` },
        { property: "og:image", content: coverImgUrl },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: post.title },
        { name: "twitter:description", content: metaDesc },
        { name: "twitter:image", content: coverImgUrl },
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
          <Link to="/blog" className="hover:text-primary transition-colors">
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
            src={post.coverImage.includes("?") ? post.coverImage : `${post.coverImage}?v=20261113`}
            alt={post.title}
            loading="eager"
            fetchPriority="high"
            decoding="async"
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
                post.targetProductType === "planner" && inArticleBanner && inArticleBanner.enabled ? (
                  <InArticlePromoWidget config={inArticleBanner} />
                ) : (
                  <ProductRecommendationBanner post={post} />
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
          <ProductRecommendationBanner post={post} isFullWidth />
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

function getArticlePromoDetails(post: BlogPost) {
  const slug = post.slug.toLowerCase();

  // 1. Gemini articles
  if (slug.includes("gemini")) {
    return {
      badge: "پیشنهاد ویژه اشتراک هوش مصنوعی",
      title: "خرید قانونی اشتراک Google AI Pro (Gemini Pro)",
      description: "دسترسی رسمی به مدل پرچمدار Gemini 4 Argon با استدلال عمیق Deep Think، یکپارچگی مستقیم با Google Workspace و ۵ ترابایت فضای ابری Google One با فعال‌سازی قانونی و تست تحویل سالم اولیه.",
      linkUrl: "/products/gemini",
      buttonText: "مشاهده پلن‌های Gemini Pro",
      accentBorder: "border-purple-500/35",
      accentBg: "from-purple-950/20 via-background to-card",
      badgeClass: "bg-purple-500/15 text-purple-400 border-purple-500/30",
      btnClass: "bg-purple-600 hover:bg-purple-500 text-white shadow-purple-600/20",
    };
  }

  // 2. Claude articles
  if (slug.includes("claude") && !slug.includes("comparison") && !slug.includes("flagship")) {
    return {
      badge: "پرچمدار کدنویسی و استدلال",
      title: "خرید قانونی اکانت Claude Pro آنتروپیک",
      description: "مجهز به Claude Sonnet 5.5، مدل استدلال عمیق Opus 5.5، بوم تعاملی Artifacts، ابزار پیشرفته Claude Code و کانتکست ۱ میلیون توکنی با ضمانت فعال‌سازی اختصاصی روی ایمیل شما.",
      linkUrl: "/products/claude",
      buttonText: "مشاهده اشتراک Claude Pro",
      accentBorder: "border-amber-500/35",
      accentBg: "from-amber-950/20 via-background to-card",
      badgeClass: "bg-amber-500/15 text-amber-400 border-amber-500/30",
      btnClass: "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20",
    };
  }

  // 3. ChatGPT Plus / Free vs Plus / Ban Prevention
  if (slug.includes("ai-free-vs-plus") || slug.includes("prevent-chatgpt")) {
    return {
      badge: "پلن رسمی ۲۰ دلاری OpenAI",
      title: "خرید اکانت قانونی و اختصاصی ChatGPT Plus",
      description: "دسترسی نامحدود به GPT-6.1 Sol، فضای کاری نوین Prism، بوم تعاملی Canvas، حالت صوتی زنده و Deep Research روی ایمیل شخصی شما با ضمانت فعال‌سازی قانونی.",
      linkUrl: "/products/chatgpt-plus",
      buttonText: "مشاهده اشتراک ChatGPT Plus",
      accentBorder: "border-emerald-500/35",
      accentBg: "from-emerald-950/20 via-background to-card",
      badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
      btnClass: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20",
    };
  }

  // 4. Comparison / General AI
  if (post.targetProductType === "ai") {
    return {
      badge: "ضمانت فعال‌سازی قانونی",
      title: "خرید قانونی اشتراک‌های هوش مصنوعی (ChatGPT, Claude, Gemini)",
      description: "فعال‌سازی اختصاصی روی ایمیل شما با ضمانت تحویل سالم اولیه و راهنمایی تنظیمات ایمن در پشتیبانی ۲۴ ساعته وایچ.",
      linkUrl: "/products",
      buttonText: "مشاهده و مقایسه پلن‌های AI",
      accentBorder: "border-primary/35",
      accentBg: "from-primary/10 via-background to-card",
      badgeClass: "bg-primary/15 text-primary border-primary/30",
      btnClass: "bg-primary text-primary-foreground hover:opacity-90 shadow-primary/20",
    };
  }

  // 5. Default: Planner & Productivity
  return {
    badge: "دسترسی همیشگی بدون اشتراک",
    title: "پلنر جامع و هوشمند گوگل‌شیت وایچ (Life Planner)",
    description: "سیستم ردیابی روزانه، نمودارهای خودکار پیشرفت، فرمول‌های پیشرفته، Habit Tracker، ماتریس آیزنهاور و سازگاری کامل در موبایل و لپ‌تاپ.",
    linkUrl: "/products/vaich-life-planner",
    buttonText: "مشاهده و دریافت پلنر",
    accentBorder: "border-emerald-500/35",
    accentBg: "from-emerald-950/20 via-background to-card",
    badgeClass: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    btnClass: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20",
  };
}

function ProductRecommendationBanner({
  post,
  isFullWidth = false,
}: {
  post: BlogPost;
  isFullWidth?: boolean;
}) {
  const promo = getArticlePromoDetails(post);

  return (
    <div
      className={`my-6 rounded-3xl border ${promo.accentBorder} bg-gradient-to-r ${promo.accentBg} p-5 sm:p-6 shadow-md transition-all ${
        isFullWidth ? "w-full" : ""
      }`}
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1.5 text-center sm:text-right">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className={`rounded-full border text-xs px-2.5 py-0.5 font-bold ${promo.badgeClass}`}>
              {promo.badge}
            </span>
            <span className="text-sm sm:text-base font-bold text-foreground">
              {promo.title}
            </span>
          </div>
          <p className="text-xs text-neutral-700 dark:text-slate-300 max-w-xl leading-relaxed">
            {promo.description}
          </p>
        </div>
        <Link
          to={promo.linkUrl as any}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs sm:text-sm font-bold shadow-lg transition-all shrink-0 hover:scale-105 ${promo.btnClass}`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>{promo.buttonText}</span>
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
      <Link to={config.linkUrl as any} className="block group no-underline">
        {children}
      </Link>
    );
  };

  return (
    <div className="my-8 not-prose">
      <ContentWrapper>
        <div className="relative overflow-hidden rounded-2xl border border-border/80 border-r-4 border-r-emerald-500 bg-card/85 p-4 sm:p-5 shadow-sm transition-colors duration-200 hover:border-emerald-500/45">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5">
            {config.imageUrl && (
              <div className="relative w-full sm:w-40 aspect-[4/3] shrink-0 overflow-hidden rounded-xl border border-border/60 bg-secondary/40">
                <img
                  src={config.imageUrl}
                  alt={config.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
            )}
            <div className="flex-1 space-y-2 text-right">
              {config.badge && (
                <span className="inline-block rounded-md bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                  {config.badge}
                </span>
              )}
              <h3 className="text-sm sm:text-base font-extrabold text-foreground leading-snug group-hover:text-emerald-500 transition-colors">
                {config.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-6 line-clamp-2">
                {config.description}
              </p>
              <div className="pt-1">
                <span className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition-colors group-hover:bg-emerald-500">
                  <span>{config.buttonText || "مشاهده و خرید"}</span>
                  {isExternal ? (
                    <ExternalLink className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowLeft className="h-3.5 w-3.5" />
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ContentWrapper>
    </div>
  );
}
