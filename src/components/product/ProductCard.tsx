import { useState, useEffect, useRef, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { Star, ArrowLeft } from "lucide-react";
import { getProductLogo } from "@/components/brand/ServiceIcon";
import {
  formatPrice,
  formatPriceNumber,
  formatRtlSafeTitle,
  toPersianDigits,
  isProductLifetime,
  getProductPricingSummary,
  type Product,
} from "@/lib/products";
import { cn } from "@/lib/utils";

function getProductCardSubtitle(p: Product, isLifetime: boolean): string {
  if (p.slug === "vaich-study-planner") {
    return "باغچه رشد مطالعه، بودجه‌بندی دروس و تحلیل آزمون • دسترسی دائمی";
  }
  if (p.slug.includes("planner")) {
    return "نرم‌افزار هوشمند در گوگل‌شیت • ردیاب عادات و اهداف بدون اشتراک";
  }
  if (p.slug === "chatgpt-plus") {
    return "دسترسی به GPT-6.1 Sol و GPT-6 Sol، استدلال عمیق، بوم Canvas و دستیار صوتی";
  }
  if (p.slug === "claude") {
    return "دسترسی به Claude Sonnet 5.5 و Opus 5.5، کدنویسی، Artifacts و پنجره میلیونی";
  }
  if (p.slug === "gemini") {
    return "اکانت Google AI Pro (مدل‌های Gemini 4 Hydrogen و Neon) با ۵ ترابایت فضا و کردیت Flow";
  }
  if (p.slug === "gemini-pro") {
    return "دسترسی ۱۸ ماهه Google AI Pro با Gemini 4 Hydrogen و ۵ ترابایت فضای گوگل‌وان";
  }
  if (p.slug === "telegram-premium") {
    return "گیفت رسمی بدون رمز • آپلود ۴ گیگ، حذف تبلیغات و ترجمه آنی";
  }
  if (p.slug === "telegram-stars") {
    return "شارژ مستقیم استارز با آیدی • پرداخت مینی‌اپ و گیفت تلگرام";
  }
  if (p.slug === "canva-pro") {
    return "دعوت تیمی روی ایمیل شخصی • Magic Studio و ۱۰۰ میلیون المان";
  }
  if (p.features && p.features[0]) {
    return p.features[0].replace(/^[\p{Emoji}\s\u200d]+/u, "").trim();
  }
  return isLifetime
    ? "دسترسی دائمی و مادام‌العمر • بدون هزینه ماهانه"
    : "تحویل فوری با ضمانت فعال‌سازی قانونی و پشتیبانی راه‌اندازی";
}

export function ProductCard({
  product,
  className,
}: {
  product: Product;
  className?: string;
}) {
  const cardRef = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, active: false });

  const handleMouseMove = (e: MouseEvent<HTMLElement>) => {
    if (!cardRef.current) return;
    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;
    setTilt({ x: rotateX, y: rotateY, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, active: false });
  };

  const hasBadge = Boolean(product.badge) || Boolean(product.featured);
  const rawBadge = product.badge || (product.featured ? "پیشنهاد ویژه" : "");
  const badgeLabel = rawBadge.replace("🔥", "").trim();

  const badgeColorMap: Record<string, string> = {
    fire: "bg-linear-to-r from-rose-500 to-amber-500 text-white",
    purple: "bg-linear-to-r from-primary to-accent text-white",
    emerald: "bg-emerald-600 text-white",
    blue: "bg-blue-600 text-white",
    amber: "bg-amber-400 text-slate-950 font-black",
  };
  const badgeClass =
    (product.badgeColor && badgeColorMap[product.badgeColor]) || badgeColorMap["purple"];

  const logoUrl = getProductLogo(product.slug, product.iconUrl);
  const initial = product.slug ? product.slug.charAt(0).toUpperCase() : "AI";
  const isLifetime = isProductLifetime(product);
  const pricing = getProductPricingSummary(product);
  const isOutOfStock = pricing.isOutOfStock;
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;

  const [extraReviews, setExtraReviews] = useState(0);

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const local = localStorage.getItem(`vaich_user_reviews_${product.slug}`);
        if (local) {
          const parsed = JSON.parse(local);
          setExtraReviews(Array.isArray(parsed) ? parsed.length : 0);
        }
      } catch {}
    };

    handleUpdate();
    window.addEventListener("vaich_products_updated", handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener("vaich_products_updated", handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, [product.slug]);

  const totalReviewsCount = Math.max(
    (product.reviewCount || 0) + extraReviews,
    (product.reviews?.length || 0) + extraReviews
  );

  const safeTitle = formatRtlSafeTitle(product.name);

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt.active
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)",
        transition: tilt.active
          ? "transform 0.1s ease-out"
          : "transform 0.4s ease-out, box-shadow 0.3s ease",
      }}
      className={cn(
        "group relative flex w-[188px] xs:w-[215px] sm:w-[285px] shrink-0 snap-start flex-col gap-2.5 sm:gap-3 overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-2.5 sm:p-3.5 shadow-xs hover:border-primary/50 hover:shadow-2xl transition-all select-none touch-manipulation",
        className,
      )}
    >
      {/* 3D Glass Light reflection layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 h-40 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40 neon-gradient"
      />

      {/* Clickable Card Header: Image Banner + Title */}
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        preload="intent"
        aria-label={`مشاهده و خرید ${product.name}`}
        className="group/link flex flex-col gap-2.5 focus:outline-none"
      >
        {/* Top Image Banner */}
        <div
          className={cn(
            "relative w-full aspect-16/10 xs:aspect-4/3 sm:aspect-16/10 rounded-xl sm:rounded-2xl overflow-hidden bg-linear-to-b from-secondary/70 via-secondary/35 to-background/60 flex items-center justify-center border border-border/50 group-hover:border-primary/40 transition-colors",
            product.imageFit === "cover" ? "p-0" : "p-1.5 sm:p-2"
          )}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-primary/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
          />

          {product.imageFit === "cover" ? (
            logoUrl ? (
              <img
                src={logoUrl}
                alt={product.name}
                width={280}
                height={175}
                decoding="async"
                className="h-full w-full object-cover object-center rounded-xl sm:rounded-2xl group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <span className="text-2xl sm:text-3xl font-black text-primary">
                {initial}
              </span>
            )
          ) : (
            /* Standard Product Logo Tile: Unified 3D Rounded Square Squircle Frame (identical to Gemini, Claude & ChatGPT) */
            <div
              className="relative flex items-center justify-center p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl bg-secondary/80 border border-border/90 shadow-md group-hover:border-primary/50 group-hover:shadow-primary/10 group-hover:scale-105 transition-all duration-300 h-[82%] sm:h-[86%] aspect-square overflow-hidden"
              style={{
                WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                maskImage: "radial-gradient(white, black)",
                transform: "translateZ(0)",
              }}
            >
              {logoUrl ? (
                <div
                  className="w-full h-full rounded-xl sm:rounded-2xl overflow-hidden flex items-center justify-center"
                  style={{
                    WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                    maskImage: "radial-gradient(white, black)",
                    transform: "translateZ(0)",
                  }}
                >
                  <img
                    src={logoUrl}
                    alt={product.name}
                    width={128}
                    height={128}
                    decoding="async"
                    className="h-full w-full object-contain object-center rounded-xl sm:rounded-2xl drop-shadow-sm"
                    style={{
                      WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                      maskImage: "radial-gradient(white, black)",
                      transform: "translateZ(0)",
                    }}
                    loading="lazy"
                  />
                </div>
              ) : (
                <span className="text-xl sm:text-2xl font-black text-primary">
                  {initial}
                </span>
              )}
            </div>
          )}

          {/* Out of stock capsule badge */}
          {isOutOfStock && (
            <span className="absolute right-2 top-2 z-10 rounded-full bg-neutral-200/95 dark:bg-neutral-200 text-neutral-900 border border-neutral-300/80 px-2.5 py-0.5 text-[9px] sm:text-[11px] font-black tracking-tight shadow-md select-none">
              ناموجود
            </span>
          )}

          {/* Floating Max Discount Badge (only when > 0 and in stock) */}
          {!isOutOfStock && pricing.maxDiscountPercent > 0 && (
            <span
              className="absolute left-2 top-2 z-10 rounded-xl bg-rose-500 font-sans text-[10px] sm:text-xs font-black text-white px-2 py-0.5 shadow-md tracking-tight select-none"
            >
              %{toPersianDigits(pricing.maxDiscountPercent)} تخفیف
            </span>
          )}

          {/* Floating Special / Featured Badge */}
          {hasBadge && badgeLabel && !isOutOfStock && (
            <span
              className={cn(
                "absolute right-2 top-2 z-10 rounded-full px-2 py-0.5 sm:px-2.5 sm:py-0.5 text-[9px] sm:text-[11px] font-bold shadow-md",
                badgeClass,
              )}
            >
              {badgeLabel}
            </span>
          )}
        </div>

        {/* Card Content: RTL-safe Title & Subtitle & Rating */}
        <div className="flex flex-col gap-1 px-0.5">
          <h3
            dir="rtl"
            style={{ unicodeBidi: "isolate" }}
            className="line-clamp-2 min-h-[2.5rem] text-xs sm:text-sm font-black tracking-tight text-foreground group-hover/link:text-primary transition-colors leading-5"
            title={product.name}
          >
            {safeTitle}
          </h3>
          <p className="line-clamp-2 min-h-[2.25rem] text-[11px] sm:text-xs text-muted-foreground/90 leading-4.5">
            {getProductCardSubtitle(product, isLifetime)}
          </p>

          {product.rating ? (
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] sm:text-xs">
              <span className="text-amber-400 font-bold inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                <span>{toPersianDigits(product.rating.toFixed(1))}</span>
              </span>
              {totalReviewsCount > 0 ? (
                <span className="text-muted-foreground text-[10px]">
                  ({toPersianDigits(totalReviewsCount)} نظر ثبت‌شده)
                </span>
              ) : null}
            </div>
          ) : (
            <div className="min-h-[1.25rem]" />
          )}
        </div>
      </Link>

      {/* Pricing Block: Dynamic Range vs Single Price vs Out of Stock */}
      <div className="rounded-xl sm:rounded-2xl border border-border/70 bg-secondary/35 p-2.5 sm:p-3 mt-auto flex flex-col justify-between gap-1">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[11px] sm:text-xs font-medium text-muted-foreground">
            {pricing.isRange ? "بازه قیمت:" : "قیمت:"}
          </span>
          <div className="flex items-center gap-1">
            {!isOutOfStock && !pricing.isRange && pricing.singleOriginalPrice ? (
              <span className="text-[11px] sm:text-xs text-muted-foreground/80 line-through">
                {formatPrice(pricing.singleOriginalPrice)}
              </span>
            ) : null}
            {!isOutOfStock && pricing.maxDiscountPercent > 0 ? (
              <span
                className="inline-flex items-center gap-0.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-500 dark:text-rose-400 font-sans text-[10px] sm:text-xs font-black px-1.5 py-0.5 shadow-xs"
              >
                <span>{pricing.isRange ? "تا" : ""}</span>
                <span dir="ltr">%{toPersianDigits(pricing.maxDiscountPercent)}</span>
              </span>
            ) : null}
            {isLifetime ? (
              <span className="rounded-md bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold truncate">
                دسترسی دائمی
              </span>
            ) : product.duration ? (
              <span className="rounded-md bg-secondary border border-border/80 px-1.5 py-0.5 text-[10px] text-muted-foreground font-semibold truncate">
                {product.duration}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-0.5 flex items-baseline justify-between gap-1">
          {isOutOfStock ? (
            <p className="text-xs sm:text-sm font-black text-rose-500 dark:text-rose-400">
              ناموجود
            </p>
          ) : pricing.isRange ? (
            <p
              dir="rtl"
              className="gradient-text text-xs xs:text-[13px] sm:text-[15px] font-black tracking-tight leading-snug"
            >
              از {formatPriceNumber(pricing.minPrice)} تا {formatPrice(pricing.maxPrice)}
            </p>
          ) : (
            <p className="gradient-text text-sm sm:text-base font-black tracking-tight">
              {formatPrice(pricing.minPrice)}
            </p>
          )}
        </div>
      </div>

      {/* Unified Modern CTA Button (min-h-[44px] for standard mobile touch target) */}
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        preload="intent"
        aria-label={
          isOutOfStock
            ? `مشاهده جزئیات ${product.name}`
            : hasVariants
              ? `انتخاب پلن و خرید ${product.name}`
              : `مشاهده و خرید ${product.name}`
        }
        className={cn(
          "group/cta w-full min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-xl sm:rounded-2xl py-2.5 px-3.5 text-xs sm:text-sm font-black transition-all duration-200 touch-manipulation cursor-pointer active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-primary",
          isOutOfStock
            ? "bg-secondary/90 text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground"
            : "bg-linear-to-r from-primary via-purple-600 to-indigo-600 text-white shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/40 hover:brightness-110"
        )}
      >
        <span>
          {isOutOfStock
            ? "مشاهده جزئیات"
            : hasVariants
              ? "انتخاب پلن و خرید"
              : "مشاهده و خرید"}
        </span>
        <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover/cta:-translate-x-1" />
      </Link>
    </article>
  );
}
