import { Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Section } from "@/components/layout/Section";
import { useBlogPosts, BLOG_POSTS, type BlogPost } from "@/lib/blog-data";
import { BlogCoverGraphic } from "@/components/blog/BlogCoverGraphic";
import { Clock, ArrowLeft, ChevronRight, ChevronLeft, BookOpen } from "lucide-react";

const FEATURED_BLOG_SLUGS = [
  "flagship-ai-models-comparison",
  "prevent-chatgpt-claude-account-ban",
  "ai-free-vs-plus-comparison",
  "gemini-2-million-context-window-big-data-analysis",
  "how-google-sheets-planner-transforms-habits-goals",
  "defeat-procrastination-google-sheets-planner",
  "habit-tracking-time-management-guide",
];

function selectFeaturedPosts(allPosts: BlogPost[]): BlogPost[] {
  const bySlug = new Map(allPosts.map((p) => [p.slug, p]));
  const picked: BlogPost[] = [];
  for (const slug of FEATURED_BLOG_SLUGS) {
    const found = bySlug.get(slug);
    if (found) picked.push(found);
  }
  for (const post of allPosts) {
    if (picked.length >= 7) break;
    if (!picked.some((p) => p.slug === post.slug)) {
      picked.push(post);
    }
  }
  return picked.length > 0 ? picked : allPosts.slice(0, 7);
}

export function BlogSection() {
  const posts = useBlogPosts();
  const postList = posts && posts.length > 0 ? posts : BLOG_POSTS;
  const featuredPosts = useMemo(() => selectFeaturedPosts(postList), [postList]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  useEffect(() => {
    if (activeIndex >= featuredPosts.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, featuredPosts.length]);

  useEffect(() => {
    if (featuredPosts.length <= 1 || isPaused) return;
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuredPosts.length);
    }, 4800);

    return () => clearInterval(interval);
  }, [featuredPosts.length, isPaused]);

  const goPrev = () => {
    if (featuredPosts.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + featuredPosts.length) % featuredPosts.length);
  };

  const goNext = () => {
    if (featuredPosts.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % featuredPosts.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchStartX(e.touches[0]?.clientX ?? null);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX !== null) {
      const endX = e.changedTouches[0]?.clientX ?? touchStartX;
      const diff = endX - touchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          goNext(); // کشیدن انگشت به چپ -> حرکت به اسلاید بعدی
        } else {
          goPrev(); // کشیدن انگشت به راست -> بازگشت به اسلاید قبلی
        }
      }
    }
    setTouchStartX(null);
    setTimeout(() => setIsPaused(false), 3000);
  };

  return (
    <Section
      id="blog"
      title="مجله و مقالات آموزشی وایچ"
      subtitle="راهنماهای کاربردی، مقایسه هوش مصنوعی و نکات امنیت اکانت برای استفاده بهتر و مطمئن‌تر"
    >
      {/* نوار بالای باکس مقالات */}
      <div className="mb-3.5 flex items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <BookOpen className="h-4 w-4 text-primary shrink-0" />
          <span>مرور خودکار راهنماهای منتخب</span>
        </div>

        <Link
          to="/blog"
          preload="intent"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary/80 transition-colors"
        >
          <span>مشاهده همه مقالات</span>
          <ArrowLeft className="h-3.5 w-3.5" />
        </Link>
      </div>

      {/* باکس محصور و اسلایدر خودکار (بدون بیرون‌زدگی اسکرول) */}
      <div
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative overflow-hidden rounded-3xl border border-border/80 bg-card/85 backdrop-blur-md shadow-sm"
      >
        <div
          dir="ltr"
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] will-change-transform"
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
        >
          {featuredPosts.map((post, idx) => (
            <article
              key={post.slug}
              dir="rtl"
              className="group relative w-full shrink-0 grid grid-cols-1 md:grid-cols-12 items-stretch"
            >
              {/* تصویر کاور داخل باکس */}
              <div className="relative md:col-span-5 aspect-[16/10] md:aspect-auto md:min-h-[270px] overflow-hidden bg-neutral-950">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  width={800}
                  height={500}
                  loading={idx === 0 ? "eager" : "lazy"}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = "none";
                    const fallback = e.currentTarget.parentElement?.querySelector(".blog-fallback-cover");
                    if (fallback) (fallback as HTMLElement).style.display = "block";
                  }}
                />
                <div className="blog-fallback-cover absolute inset-0 hidden">
                  <BlogCoverGraphic slug={post.slug} category={post.category} />
                </div>

                <div className="absolute top-3.5 right-3.5 z-10 pointer-events-none">
                  <span className="rounded-full bg-background/90 backdrop-blur-md border border-border/70 px-3 py-1 text-[11px] font-bold text-primary shadow-xs">
                    {post.category}
                  </span>
                </div>
              </div>

              {/* محتوای مقاله داخل باکس */}
              <div className="md:col-span-7 flex flex-col justify-between gap-4 p-5 sm:p-7 lg:p-8">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5 text-primary/80" />
                      <span>{post.readTime}</span>
                    </span>
                    <span className="opacity-40">•</span>
                    <span>{post.date}</span>
                  </div>

                  <h3 className="text-base sm:text-xl font-black leading-snug text-foreground">
                    <Link
                      to="/blog/$slug"
                      params={{ slug: post.slug }}
                      preload="intent"
                      className="transition-colors group-hover:text-primary line-clamp-2 focus:outline-none"
                    >
                      {post.title}
                    </Link>
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-6 sm:leading-7 line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-3">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    preload="intent"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:opacity-90 active:scale-95"
                  >
                    <span>مطالعه کامل مقاله</span>
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Link>

                  <span className="text-[11px] font-mono text-muted-foreground tabular-nums">
                    {idx + 1} / {featuredPosts.length}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* کنترل‌ها و نشانگر پایین باکس */}
        {featuredPosts.length > 1 && (
          <div className="flex items-center justify-between gap-3 border-t border-border/50 bg-secondary/20 px-4 py-2.5 sm:px-6">
            <div className="flex items-center gap-1.5">
              {featuredPosts.map((post, idx) => (
                <button
                  key={post.slug}
                  type="button"
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`مقاله ${idx + 1}: ${post.title}`}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === activeIndex
                      ? "w-6 bg-primary"
                      : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={goPrev}
                aria-label="مقاله قبلی"
                className="grid h-8 w-8 place-items-center rounded-xl border border-border/80 bg-background/80 text-foreground transition-all hover:border-primary/50 hover:text-primary active:scale-95 cursor-pointer"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="مقاله بعدی"
                className="grid h-8 w-8 place-items-center rounded-xl border border-border/80 bg-background/80 text-foreground transition-all hover:border-primary/50 hover:text-primary active:scale-95 cursor-pointer"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}
