import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { getBlogPostBySlug, getRelatedBlogPosts, type BlogPost } from "@/lib/blog-data";
import { BlogCoverGraphic } from "@/components/blog/BlogCoverGraphic";
import { ServiceIcon } from "@/components/brand/ServiceIcon";
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
  Bot,
  Phone,
  Send,
  MessageCircle,
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

    const scripts: Array<{ type: string; children: string }> = [
      {
        type: "application/ld+json",
        children: JSON.stringify(jsonLd),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbLd),
      },
    ];

    if (Array.isArray((post as any).faqs) && (post as any).faqs.length > 0) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: (post as any).faqs.map((f: { question: string; answer: string }) => ({
            "@type": "Question",
            name: f.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: f.answer,
            },
          })),
        }),
      });
    }

    return {
      meta: [
        { title: `${post.title} | مجله وایچ` },
        { name: "description", content: metaDesc },
        ...(post.keywords && post.keywords.length > 0
          ? [{ name: "keywords", content: post.keywords.join(", ") }]
          : []),
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
      scripts,
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
          {post.sections.length > 2 && (
            <nav
              aria-label="فهرست مطالب"
              className="rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-5 space-y-2.5"
            >
              <div className="text-xs sm:text-sm font-bold text-foreground">فهرست مطالب این راهنما</div>
              <ol className="grid gap-1.5 sm:grid-cols-2 text-xs text-muted-foreground list-inside">
                {post.sections.map((s, idx) => (
                  <li key={idx}>
                    <a href={`#sec-${idx}`} className="hover:text-primary transition-colors">
                      {s.heading}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {post.sections.map((section, idx) => (
            <section key={idx} id={`sec-${idx}`} className="space-y-4 scroll-mt-24">
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

          {/* FAQ Section (matched with FAQPage Schema) */}
          {Array.isArray((post as any).faqs) && (post as any).faqs.length > 0 && (
            <section className="rounded-3xl border border-border/80 bg-card/50 p-5 sm:p-7 space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                سوالات متداول
              </h2>
              <div className="space-y-3">
                {(post as any).faqs.map((faq: { question: string; answer: string }, fIdx: number) => (
                  <div key={fIdx} className="rounded-2xl border border-border/60 bg-background/60 p-4 space-y-1.5">
                    <h3 className="text-xs sm:text-sm font-bold text-foreground">
                      {faq.question}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-7">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Telegram Bot Development & Collaboration Promo Block */}
          {(post.includeBotCollabBanner || post.targetProductType === "telegram-bot") && (
            <TelegramBotServiceBanner />
          )}

          {/* Minimal, Discreet Author Signature as Requested */}
          <div className="mt-8 pt-4 border-t border-border/50 text-[12px] text-slate-500 dark:text-slate-400 font-medium text-center sm:text-right">
            نویسنده: یونس حیاتی
          </div>
        </article>

        {/* Bottom CTA Banner (Shown only when Bot Banner isn't already displayed at the end) */}
        {!(post.includeBotCollabBanner || post.targetProductType === "telegram-bot") && (
          <div className="my-10 space-y-4">
            <ProductRecommendationBanner post={post} isFullWidth />
            {post.targetProductType === "study-planner" && (
              <div className="not-prose">
                <Link to="/products/vaich-life-planner" className="block group no-underline">
                  <div className="relative overflow-hidden rounded-2xl border border-border/80 border-r-4 border-r-purple-500 bg-card/85 p-4 sm:p-5 shadow-xs transition-all duration-200 hover:border-purple-500/50 hover:shadow-md">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                      <div className="relative w-full sm:w-32 aspect-[4/3] shrink-0 overflow-hidden rounded-xl border border-border/60 bg-secondary/40">
                        <img
                          src="/images/lifestyle-planner-thumb.webp"
                          alt="پلنر لایفاستایل سه‌بعدی وایچ"
                          loading="lazy"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                      </div>
                      <div className="flex-1 min-w-0 space-y-1 text-right">
                        <span className="inline-block rounded-md bg-purple-500/10 px-2.5 py-0.5 text-[11px] font-bold text-purple-600 dark:text-purple-400">
                          پیشنهاد مکمل برای نظم جامع زندگی
                        </span>
                        <h4 className="text-sm sm:text-base font-extrabold text-foreground group-hover:text-purple-500 transition-colors">
                          پلنر لایفاستایل سه‌بعدی وایچ (مدیریت عادت، مالی و اهداف)
                        </h4>
                        <p className="text-xs text-muted-foreground leading-6 line-clamp-2">
                          اگر در کنار برنامه‌ریزی مطالعاتی می‌خواهید امور مالی، روتین‌های روزانه و اهداف زندگی خود را هم در قالب سه‌بعدی و دو‌بعدی مدیریت کنید، این نسخه مکمل ایده‌آل شماست.
                        </p>
                      </div>
                      <div className="shrink-0">
                        <span className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl border border-purple-500/35 bg-purple-500/10 px-4 py-2 text-xs font-bold text-purple-600 dark:text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          <span>مشاهده پلنر لایفاستایل</span>
                          <ArrowLeft className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            )}
          </div>
        )}

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

  // -1. Study Planner (پلنر تحصیلی وایچ)
  if (post.targetProductType === "study-planner" || post.targetProductSlug === "vaich-study-planner" || slug.includes("study-planning") || slug.includes("habit-building-science") || slug.includes("mock-exam-analysis")) {
    return {
      productSlug: "vaich-study-planner",
      iconUrl: "/images/study-planner-thumb.webp",
      imageFit: "cover" as const,
      badge: "نسخه جامع با باغچه رشد مطالعه",
      priceHint: "۳۹۹,۰۰۰ تومان (به‌جای ۹۰۰,۰۰۰)",
      title: "پلنر تحصیلی وایچ (دسترسی دائمی + فایل صوتی راهنما)",
      description: "باغچه رشد مطالعه، جدول ۲۰ عادت ۳۱ روزه، بودجه‌بندی دروس و کارنامه تحلیل آزمون؛ اجرا به‌صورت آنلاین و آفلاین در موبایل و لپ‌تاپ.",
      linkUrl: "/products/vaich-study-planner",
      buttonText: "مشاهده و دریافت پلنر تحصیلی",
      borderAccent: "border-r-emerald-500",
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  }

  // 0. Telegram Stars
  if (post.targetProductType === "telegram-stars" || post.targetProductSlug === "telegram-stars" || slug.includes("telegram-stars")) {
    return {
      productSlug: "telegram-stars",
      iconUrl: "/telegram-stars-icon.webp",
      imageFit: "contain" as const,
      badge: "شارژ فوری با آیدی",
      priceHint: "از ۵۹۰,۰۰۰ تومان",
      title: "خرید استارز تلگرام (۱۰۰ تا ۱۰,۰۰۰ استارز)",
      description: "واریز قانونی و مستقیم روی آیدی تلگرام شما (@Username) بدون رمز عبور؛ مناسب خرید گیفت و پرداخت مینی‌اپ‌ها.",
      linkUrl: "/products/telegram-stars",
      buttonText: "مشاهده و خرید استارز",
      borderAccent: "border-r-amber-500",
      badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }

  // 0.5. Telegram Bot Development -> clean Telegram Stars / Premium companion offer
  if (post.targetProductType === "telegram-bot") {
    return {
      productSlug: "telegram-stars",
      iconUrl: "/telegram-stars-icon.webp",
      imageFit: "contain" as const,
      badge: "خدمات تلگرام وایچ",
      priceHint: "تحویل فوری",
      title: "شارژ استارز تلگرام و فعال‌سازی تلگرام پرمیوم",
      description: "تکمیل امکانات تلگرام کسب‌وکار شما با شارژ فوری Telegram Stars و تلگرام پرمیوم گیفتی بدون نیاز به رمز عبور.",
      linkUrl: "/products/telegram-stars",
      buttonText: "خرید استارز تلگرام",
      borderAccent: "border-r-sky-500",
      badgeClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    };
  }

  // 0.7. Telegram Premium
  if (post.targetProductType === "telegram-premium" || post.targetProductSlug === "telegram-premium" || slug.includes("telegram-premium")) {
    return {
      productSlug: "telegram-premium",
      iconUrl: "/telegram-premium-icon.webp",
      imageFit: "contain" as const,
      badge: "گیفت رسمی بدون رمز",
      priceHint: "۱ تا ۱۲ ماهه",
      title: "خرید اشتراک تلگرام پرمیوم (Telegram Premium)",
      description: "فعال‌سازی کاملاً قانونی روی آیدی شخصی بدون نیاز به کد ورود؛ دانلود نامحدود، آپلود ۴ گیگ و ابزارهای بیزینس.",
      linkUrl: "/products/telegram-premium",
      buttonText: "مشاهده پلن‌ها و خرید",
      borderAccent: "border-r-blue-500",
      badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    };
  }

  // 0.8. Canva Pro
  if (post.targetProductType === "canva-pro" || post.targetProductSlug === "canva-pro" || slug.includes("canva")) {
    return {
      productSlug: "canva-pro",
      iconUrl: "/canva-pro-icon.webp",
      imageFit: "contain" as const,
      badge: "روی ایمیل شخصی",
      priceHint: "۱ تا ۶ ماهه",
      title: "خرید اشتراک کانوا پرو (Canva Pro) قابل تمدید",
      description: "ارتقای رسمی اکانت شخصی با دعوت تیمی بدون تعویض حساب؛ دسترسی کامل به Magic Studio و میلیون‌ها قالب پرمیوم.",
      linkUrl: "/products/canva-pro",
      buttonText: "مشاهده و خرید کانوا پرو",
      borderAccent: "border-r-teal-500",
      badgeClass: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
    };
  }

  // 1. Gemini articles
  if (slug.includes("gemini")) {
    return {
      productSlug: "gemini",
      iconUrl: "/gemini-60d-icon.webp",
      imageFit: "contain" as const,
      badge: "پیشنهاد وایچ",
      priceHint: "از ۳۹۰,۰۰۰ تومان",
      title: "خرید اشتراک Google AI Pro (Gemini Pro)",
      description: "دسترسی رسمی به مدل‌های Gemini 4 Hydrogen و Neon، ۵ ترابایت فضای Google One و ۱۰۰۰ کردیت ویدیوسازی Flow.",
      linkUrl: "/products/gemini",
      buttonText: "مشاهده پلن‌های جمنای",
      borderAccent: "border-r-purple-500",
      badgeClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    };
  }

  // 2. Claude articles
  if (slug.includes("claude") && !slug.includes("comparison") && !slug.includes("flagship")) {
    return {
      productSlug: "claude",
      iconUrl: "/claude-icon.webp",
      imageFit: "contain" as const,
      badge: "محبوب برنامه‌نویسان",
      priceHint: "اکانت اختصاصی",
      title: "خرید قانونی اکانت Claude Pro آنتروپیک",
      description: "دسترسی رسمی به Claude Sonnet 5.5، Opus 5.5، ابزار Claude Code و کانتکست ۱ میلیون توکنی روی ایمیل شما.",
      linkUrl: "/products/claude",
      buttonText: "مشاهده اشتراک Claude Pro",
      borderAccent: "border-r-amber-500",
      badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    };
  }

  // 3. ChatGPT Plus / Free vs Plus / Ban Prevention
  if (slug.includes("ai-free-vs-plus") || slug.includes("prevent-chatgpt")) {
    return {
      productSlug: "chatgpt-plus",
      iconUrl: "/chatgpt-logo.svg",
      imageFit: "contain" as const,
      badge: "نسخه رسمی ۲۰ دلاری",
      priceHint: "فعال‌سازی اختصاصی",
      title: "خرید اشتراک قانونی ChatGPT Plus روی ایمیل شخصی",
      description: "دسترسی کامل به GPT-6.1 Sol، محیط Canvas و Prism، حالت صوتی زنده و Deep Research با ضمانت فعال‌سازی سالم.",
      linkUrl: "/products/chatgpt-plus",
      buttonText: "مشاهده و خرید ChatGPT Plus",
      borderAccent: "border-r-emerald-500",
      badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    };
  }

  // 4. Comparison / General AI
  if (post.targetProductType === "ai") {
    return {
      productSlug: "chatgpt-plus",
      iconUrl: "/chatgpt-logo.svg",
      imageFit: "contain" as const,
      badge: "تحویل سریع و قانونی",
      priceHint: "کاتالوگ وایچ",
      title: "مقایسه و خرید اشتراک‌های هوش مصنوعی (ChatGPT, Gemini, Claude)",
      description: "فعال‌سازی اختصاصی روی ایمیل شخصی شما با ضمانت تحویل سالم اولیه و پشتیبانی پاسخگو در راه‌اندازی.",
      linkUrl: "/products",
      buttonText: "مشاهده همه اشتراک‌ها",
      borderAccent: "border-r-primary",
      badgeClass: "bg-primary/10 text-primary",
    };
  }

  // 5. Default: Planner & Productivity
  return {
    productSlug: "vaich-life-planner",
    iconUrl: "/planner-cover.webp",
    imageFit: "cover" as const,
    badge: "دسترسی دائمی بدون اشتراک",
    priceHint: "۲۹۹,۰۰۰ تومان",
    title: "پلنر جامع و هوشمند گوگل‌شیت وایچ (Life Planner)",
    description: "سیستم ردیابی عادات، نمودارهای پیشرفت، ماتریس آیزنهاور و بودجه‌بندی مالی با دسترسی همیشگی در موبایل و لپ‌تاپ.",
    linkUrl: "/products/vaich-life-planner",
    buttonText: "مشاهده و دریافت پلنر",
    borderAccent: "border-r-emerald-500",
    badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
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
  const isCoverThumb = promo.imageFit === "cover";

  return (
    <div className={cn("my-8 not-prose", isFullWidth ? "w-full" : "")}>
      <Link to={promo.linkUrl as any} className="block group no-underline">
        <div
          className={cn(
            "relative overflow-hidden rounded-2xl border border-border/80 border-r-4 bg-card/90 p-4 sm:p-5 shadow-xs transition-all duration-200 hover:border-primary/45 hover:shadow-md",
            promo.borderAccent
          )}
        >
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5">
            {isCoverThumb ? (
              <div className="relative w-full sm:w-36 aspect-[4/3] shrink-0 overflow-hidden rounded-xl border border-border/60 bg-secondary/40">
                <img
                  src={promo.iconUrl}
                  alt={promo.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>
            ) : (
              <div className="flex items-center justify-start sm:justify-center shrink-0">
                <ServiceIcon
                  slug={promo.productSlug}
                  iconUrl={promo.iconUrl}
                  imageFit={promo.imageFit}
                  className="h-16 w-16 sm:h-20 sm:w-20 group-hover:scale-[1.03]"
                />
              </div>
            )}

            <div className="flex-1 min-w-0 space-y-1.5 text-right">
              <div className="flex flex-wrap items-center gap-2">
                <span className={cn("inline-block rounded-md px-2.5 py-0.5 text-[11px] font-bold", promo.badgeClass)}>
                  {promo.badge}
                </span>
                {promo.priceHint && (
                  <span className="text-[11px] font-semibold text-muted-foreground">
                    • {promo.priceHint}
                  </span>
                )}
              </div>
              <h3 className="text-sm sm:text-base font-extrabold text-foreground leading-snug group-hover:text-primary transition-colors">
                {promo.title}
              </h3>
              <p className="text-xs sm:text-[13px] text-muted-foreground leading-6 line-clamp-2">
                {promo.description}
              </p>
            </div>

            <div className="pt-1 sm:pt-0 shrink-0">
              <span className="inline-flex w-full sm:w-auto items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground shadow-xs transition-all group-hover:bg-primary/90">
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>{promo.buttonText}</span>
                <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              </span>
            </div>
          </div>
        </div>
      </Link>
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

function TelegramBotServiceBanner() {
  return (
    <div className="my-8 not-prose rounded-2xl border border-border/80 border-r-4 border-r-sky-500 bg-card/90 p-4 sm:p-5 shadow-xs transition-colors">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-start gap-4 sm:gap-5">
        <div className="flex h-16 w-16 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-2xl border border-sky-500/25 bg-sky-500/10 text-sky-500">
          <Bot className="h-8 w-8" />
        </div>

        <div className="flex-1 space-y-2.5 text-right">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-block rounded-md bg-sky-500/10 px-2.5 py-0.5 text-[11px] font-bold text-sky-600 dark:text-sky-400">
              طراحی ربات تلگرام و همکاری مستقیم
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground">
              • قیمت مناسب و پشتیبانی کامل
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-extrabold text-foreground leading-snug">
            ساخت ربات تلگرام اختصاصی (فروشگاهی، مدیریت کانال و اتوماسیون)
          </h3>

          <p className="text-xs sm:text-[13px] text-muted-foreground leading-6">
            سفارش ساخت ربات فروشگاهی تلگرام، ربات مدیریت کانال و اشتراک VIP، ثبت سفارش و تایید رسید بانکی، ارسال خودکار فایل و پرداخت با استارز با قیمت منصفانه و امکان همکاری.
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <a
              href="https://t.me/youneshayati"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors"
            >
              <Send className="h-3.5 w-3.5" />
              <span>تلگرام (@youneshayati)</span>
            </a>

            <a
              href="tel:09193872172"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/35 bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 transition-colors"
            >
              <Phone className="h-3.5 w-3.5" />
              <span dir="ltr">09193872172</span>
            </a>

            <a
              href="https://wa.me/989193872172"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-border/80 bg-secondary/60 hover:bg-secondary px-3.5 py-2 text-xs font-bold text-foreground transition-colors"
            >
              <MessageCircle className="h-3.5 w-3.5 text-emerald-500" />
              <span>واتساپ</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
