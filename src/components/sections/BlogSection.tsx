import { Link } from "@tanstack/react-router";
import { useRef } from "react";
import { Section } from "@/components/layout/Section";
import { useBlogPosts, BLOG_POSTS } from "@/lib/blog-data";
import { BlogCoverGraphic } from "@/components/blog/BlogCoverGraphic";
import { Clock, ArrowLeft, ChevronRight, ChevronLeft, BookOpen } from "lucide-react";

export function BlogSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const posts = useBlogPosts();
  const postList = posts && posts.length > 0 ? posts : BLOG_POSTS;

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return;
    const scrollAmount = 340;
    scrollContainerRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <Section
      id="blog"
      title="مجله تخصصی و مقالات آموزشی وایچ"
      subtitle="جدیدترین یادداشت‌ها، راهنماهای کاربردی و مقالات عمیق در زمینه بهره‌وری دیجیتال، هوش مصنوعی و رشد فردی"
    >
      {/* Slider Header Controls */}
      <div className="mb-4 flex items-center justify-between px-1">
        <div className="flex md:hidden items-center gap-2 text-xs text-muted-foreground font-medium">
          <BookOpen className="h-4 w-4 text-primary" />
          <span>برای مرور مقالات به چپ و راست بکشید (Swipe)</span>
        </div>

        {/* Carousel Controls & Blog Archive Link */}
        <div className="hidden md:flex items-center gap-3 mr-auto">
          <Link
            to="/blog"
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1 ml-2"
          >
            <span>آرشیو همه مقالات</span>
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={() => scroll("right")}
            aria-label="مقاله قبلی"
            className="grid h-9 w-9 place-items-center rounded-xl border border-border/80 bg-secondary/50 text-foreground transition-all hover:border-primary/50 hover:bg-secondary active:scale-95 cursor-pointer shadow-xs"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => scroll("left")}
            aria-label="مقاله بعدی"
            className="grid h-9 w-9 place-items-center rounded-xl border border-border/80 bg-secondary/50 text-foreground transition-all hover:border-primary/50 hover:bg-secondary active:scale-95 cursor-pointer shadow-xs"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Horizontal Carousel Container */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto pb-4 pt-1 px-1 select-none scroll-smooth"
        style={{
          scrollSnapType: "x mandatory",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {postList.map((post) => (
          <article
            key={post.slug}
            style={{ scrollSnapAlign: "start" }}
            className="group relative flex flex-col justify-between w-[290px] xs:w-[320px] sm:w-[340px] shrink-0 rounded-3xl border border-border/80 bg-card/75 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
          >
            {/* Card Cover (Non-anchor, decorative chips outside link) */}
            <div className="relative aspect-[16/10] w-full overflow-hidden bg-neutral-950">
              <img
                src={post.coverImage}
                alt={post.title}
                width={340}
                height={212}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                  const fallback = e.currentTarget.parentElement?.querySelector(".blog-fallback-cover");
                  if (fallback) (fallback as HTMLElement).style.display = "block";
                }}
              />
              <div className="blog-fallback-cover absolute inset-0 hidden">
                <BlogCoverGraphic slug={post.slug} category={post.category} />
              </div>

              <div className="absolute top-3 right-3 z-20 pointer-events-none" aria-hidden="true">
                <span className="rounded-full bg-background/90 backdrop-blur-md border border-border/70 px-2.5 py-0.5 text-[11px] font-bold text-primary shadow-xs">
                  {post.category}
                </span>
              </div>

              <div
                className="absolute bottom-3 right-3 z-20 flex items-center gap-1.5 text-[11px] text-foreground font-semibold bg-background/90 dark:bg-background/80 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-border/60 shadow-xs pointer-events-none"
                aria-hidden="true"
              >
                <Clock className="h-3.5 w-3.5 text-neutral-400" />
                <span>{post.readTime}</span>
              </div>
            </div>

            {/* Card Content (One primary link on title with stretched-link) */}
            <div className="flex flex-1 flex-col p-5 justify-between gap-4">
              <div className="space-y-2">
                <h3 className="text-sm sm:text-base font-bold leading-snug text-foreground">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: post.slug }}
                    className="focus:outline-none transition-colors group-hover:text-primary line-clamp-2 after:absolute after:inset-0 after:z-10"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed font-normal">
                  {post.excerpt.length > 150 ? post.excerpt.slice(0, 147) + "..." : post.excerpt}
                </p>
              </div>

              {/* Decorative Action indicator */}
              <div className="pt-3 border-t border-border/50 flex items-center justify-end" aria-hidden="true">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group-hover:translate-x-[-3px] transition-transform">
                  <span>مطالعه مقاله</span>
                  <ArrowLeft className="h-3.5 w-3.5" />
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
