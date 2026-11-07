import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { Section } from "@/components/layout/Section";
import { useBlogPosts, BLOG_POSTS, type BlogPost } from "@/lib/blog-data";
import { BlogCoverGraphic } from "@/components/blog/BlogCoverGraphic";
import { Clock, ArrowLeft, BookOpen, Search, Sparkles, ChevronRight, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type BlogSearch = {
  page?: number;
  category?: string;
  q?: string;
};

export const Route = createFileRoute("/blog/")({
  validateSearch: (search: Record<string, unknown>): BlogSearch => {
    return {
      page: Number(search.page) || 1,
      category: typeof search.category === "string" ? search.category : undefined,
      q: typeof search.q === "string" ? search.q : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "مجله تخصصی و مقالات آموزشی | وایچ (VAICH)" },
      {
        name: "description",
        content:
          "آرشیو مقالات تخصصی، راهنماهای کاربردی و یادداشت‌های تحلیلی هوش مصنوعی، مدل‌های پیشرفته و روش‌های بهره‌وری فردی در مجله وایچ.",
      },
      { property: "og:title", content: "مجله تخصصی و مقالات آموزشی | وایچ" },
      {
        property: "og:description",
        content:
          "آرشیو مقالات تخصصی، راهنماهای کاربردی و یادداشت‌های تحلیلی هوش مصنوعی، مدل‌های پیشرفته و روش‌های بهره‌وری فردی در مجله وایچ.",
      },
      { property: "og:url", content: "https://vaich.ir/blog" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://vaich.ir/vaich-logo.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "مجله تخصصی و مقالات آموزشی | وایچ (VAICH)" },
      {
        name: "twitter:description",
        content:
          "آرشیو مقالات تخصصی، راهنماهای کاربردی و یادداشت‌های تحلیلی هوش مصنوعی، مدل‌های پیشرفته و روش‌های بهره‌وری فردی در مجله وایچ.",
      },
      { name: "twitter:image", content: "https://vaich.ir/vaich-logo.png" },
    ],
    links: [{ rel: "canonical", href: "https://vaich.ir/blog" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "مجله تخصصی و مقالات آموزشی وایچ",
          description:
            "آرشیو مقالات تخصصی، راهنماهای کاربردی و یادداشت‌های تحلیلی هوش مصنوعی و بهره‌وری فردی در مجله وایچ.",
          url: "https://vaich.ir/blog",
          breadcrumb: {
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
            ],
          },
        }),
      },
    ],
  }),
  component: BlogArchivePage,
});

const PAGE_SIZE = 6;

function BlogArchivePage() {
  const { page = 1, category, q } = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const posts = useBlogPosts();
  const postList = posts && posts.length > 0 ? posts : BLOG_POSTS;

  const [searchInput, setSearchInput] = useState(q || "");

  // Categories extracted dynamically from posts
  const categories = useMemo(() => {
    const set = new Set<string>();
    postList.forEach((p) => {
      if (p.category) set.add(p.category.trim());
    });
    return ["همه", ...Array.from(set)];
  }, [postList]);

  // Filter posts by category and search query
  const filteredPosts = useMemo(() => {
    return postList.filter((post) => {
      if (category && category !== "همه" && post.category !== category) {
        return false;
      }
      if (q && q.trim()) {
        const query = q.trim().toLowerCase();
        const inTitle = post.title.toLowerCase().includes(query);
        const inExcerpt = post.excerpt.toLowerCase().includes(query);
        const inCategory = post.category.toLowerCase().includes(query);
        if (!inTitle && !inExcerpt && !inCategory) return false;
      }
      return true;
    });
  }, [postList, category, q]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredPosts.slice(start, start + PAGE_SIZE);
  }, [filteredPosts, currentPage]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      search: (prev) => ({
        ...prev,
        page: 1,
        q: searchInput.trim() || undefined,
      }),
    });
  };

  const handleCategorySelect = (cat: string) => {
    navigate({
      search: (prev) => ({
        ...prev,
        page: 1,
        category: cat === "همه" ? undefined : cat,
      }),
    });
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav
          aria-label="مسیر راهنما"
          className="mb-8 flex items-center gap-2 text-xs sm:text-sm text-muted-foreground"
        >
          <Link to="/" className="hover:text-primary transition-colors">
            صفحه اصلی
          </Link>
          <span>/</span>
          <span className="font-semibold text-foreground">مجله و مقالات آموزشی</span>
        </nav>

        {/* Hero Section */}
        <div className="relative mb-10 overflow-hidden rounded-3xl border border-border/70 bg-card/60 p-6 sm:p-10 backdrop-blur-xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>پایگاه دانش، راهنماهای کاربردی و یادداشت‌های تخصصی</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              مجله تخصصی هوش مصنوعی و بهره‌وری دیجیتال
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              تحلیل‌های عمیق درباره تازه‌ترین مدل‌های زبان بزرگ، راهنماهای گام‌به‌گام برنامه‌ریزی دیجیتال و ترفندهای عملی برای ارتقای راندمان کاری و تحصیلی
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative z-10 mt-6 max-w-xl">
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="جستجو در عنوان یا متن مقالات..."
                className="w-full rounded-2xl border border-border/80 bg-background/80 py-3 pr-11 pl-24 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none shadow-inner"
              />
              <Search className="pointer-events-none absolute right-3.5 h-4 w-4 text-muted-foreground" />
              <button
                type="submit"
                className="absolute left-2 rounded-xl bg-primary px-3.5 py-1.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
              >
                جستجو
              </button>
            </div>
          </form>
        </div>

        {/* Category Filter Pills */}
        <div className="mb-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = (!category && cat === "همه") || category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => handleCategorySelect(cat)}
                className={cn(
                  "rounded-full px-4 py-2 text-xs font-bold transition-all whitespace-nowrap cursor-pointer shadow-xs",
                  isSelected
                    ? "bg-primary text-primary-foreground border border-primary/40 shadow-primary/20"
                    : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border/60"
                )}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results Counter */}
        <div className="mb-6 flex items-center justify-between text-xs text-muted-foreground px-1">
          <span>
            نمایش {paginatedPosts.length} مقاله از مجموع {filteredPosts.length} مقاله
            {category && category !== "همه" ? ` در دسته «${category}»` : ""}
            {q ? ` برای عبارت «${q}»` : ""}
          </span>
          {(category || q) && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                navigate({ search: {} });
              }}
              className="text-primary hover:underline font-semibold cursor-pointer"
            >
              پاک‌سازی فیلترها
            </button>
          )}
        </div>

        {/* Articles Grid */}
        {paginatedPosts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-3">
            <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/60" />
            <h3 className="text-base font-bold text-foreground">مقاله‌ای با این مشخصات یافت نشد</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              می‌توانید کلمه کلیدی دیگری را جستجو کنید یا فیلتر دسته‌بندی را به «همه» تغییر دهید.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                navigate({ search: {} });
              }}
              className="mt-2 rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground"
            >
              مشاهده همه مقالات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPosts.map((post) => (
              <article
                key={post.slug}
                className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-card/75 backdrop-blur-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
              >
                {/* Cover Image Container */}
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
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col p-4 sm:p-5 justify-between gap-3">
                  <div className="space-y-2">
                    <h2 className="text-sm sm:text-[15px] font-bold leading-snug text-foreground">
                      <Link
                        to="/blog/$slug"
                        params={{ slug: post.slug }}
                        className="focus:outline-none transition-colors group-hover:text-primary line-clamp-2 after:absolute after:inset-0 after:z-10"
                      >
                        {post.title}
                      </Link>
                    </h2>
                    <p className="text-xs text-muted-foreground/90 line-clamp-2 leading-relaxed font-normal">
                      {post.excerpt}
                    </p>
                  </div>

                  {/* Card Meta & Action Footer */}
                  <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs" aria-hidden="true">
                    <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <Clock className="h-3.5 w-3.5 text-primary/70" />
                      <span>{post.readTime}</span>
                    </div>

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-[-3px] transition-transform">
                      <span>مطالعه مقاله</span>
                      <ArrowLeft className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Crawlable Pagination Controls */}
        {totalPages > 1 && (
          <nav aria-label="صفحه‌بندی مقالات" className="mt-12 flex items-center justify-center gap-2">
            {currentPage > 1 ? (
              <Link
                to="/blog"
                search={{ page: currentPage - 1, category, q }}
                className="flex items-center gap-1 rounded-xl border border-border/80 bg-secondary/50 px-3 py-2 text-xs font-bold text-foreground hover:bg-secondary transition-colors"
                aria-label="صفحه قبلی"
              >
                <ChevronRight className="h-4 w-4" />
                <span>قبلی</span>
              </Link>
            ) : null}

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pNum = idx + 1;
              const isCurrent = pNum === currentPage;
              return (
                <Link
                  key={pNum}
                  to="/blog"
                  search={{ page: pNum, category, q }}
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-xl text-xs font-bold transition-all",
                    isCurrent
                      ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 pointer-events-none"
                      : "border border-border/80 bg-secondary/50 text-foreground hover:bg-secondary"
                  )}
                  aria-current={isCurrent ? "page" : undefined}
                >
                  {pNum}
                </Link>
              );
            })}

            {currentPage < totalPages ? (
              <Link
                to="/blog"
                search={{ page: currentPage + 1, category, q }}
                className="flex items-center gap-1 rounded-xl border border-border/80 bg-secondary/50 px-3 py-2 text-xs font-bold text-foreground hover:bg-secondary transition-colors"
                aria-label="صفحه بعدی"
              >
                <span>بعدی</span>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : null}
          </nav>
        )}
      </div>
    </div>
  );
}
