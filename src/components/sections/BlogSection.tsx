import { Link } from "@tanstack/react-router";
import { Section } from "@/components/layout/Section";
import { BLOG_POSTS } from "@/lib/blog-data";
import { BookOpen, Clock, ArrowLeft, User, Sparkles } from "lucide-react";

export function BlogSection() {
  return (
    <Section
      id="blog"
      title="مجله تخصصی و مقالات آموزشی وایچ"
      subtitle="جدیدترین یادداشت‌ها، راهنماهای کاربردی و مقالات عمیق به قلم یونس حیاتی در حوزه بهره‌وری دیجیتال، هوش مصنوعی و رشد فردی"
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.map((post) => (
          <article
            key={post.slug}
            className="group glass-panel flex flex-col overflow-hidden rounded-3xl border border-border/80 bg-card/60 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
          >
            {/* Image Header */}
            <Link
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="relative aspect-video w-full overflow-hidden bg-neutral-900/60 block"
            >
              <img
                src={post.coverImage}
                alt={post.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-80" />
              
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <span className="rounded-full bg-background/85 backdrop-blur-md border border-border/60 px-2.5 py-1 text-xs font-semibold text-primary">
                  {post.category}
                </span>
              </div>

              <div className="absolute bottom-3 right-3 flex items-center gap-1.5 text-xs text-neutral-300 bg-background/60 backdrop-blur-sm px-2 py-0.5 rounded-full">
                <Clock className="h-3.5 w-3.5 text-neutral-400" />
                <span>{post.readTime}</span>
              </div>
            </Link>

            {/* Content Body */}
            <div className="flex flex-1 flex-col p-5 sm:p-6 justify-between gap-4">
              <div className="space-y-2.5">
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="block font-bold text-base sm:text-lg leading-snug text-foreground transition-colors group-hover:text-primary line-clamp-2"
                >
                  {post.title}
                </Link>
                <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              {/* Card Footer: Author & Link */}
              <div className="pt-3 border-t border-border/50 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="h-7 w-7 shrink-0 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <User className="h-3.5 w-3.5" />
                  </div>
                  <div className="truncate text-xs">
                    <span className="text-muted-foreground">نویسنده: </span>
                    <span className="font-medium text-foreground">{post.author.name}</span>
                  </div>
                </div>

                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors shrink-0 group-hover:translate-x-[-2px]"
                >
                  <span>مطالعه</span>
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </Section>
  );
}
