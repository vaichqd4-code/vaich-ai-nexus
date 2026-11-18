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
    return "اکانت Google AI Pro (مدل Gemini 4 Argon) با ۵ ترابایت فضا و ۱۰۰۰ کردیت Flow";
  }
  if (p.slug === "gemini-pro") {
    return "دسترسی بلندمدت Google AI Pro با Gemini 4 Argon و ۵ ترابایت فضای گوگل‌وان";
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
  const isSquareFullBleedIcon = Boolean(
    logoUrl &&
      (logoUrl.includes("telegram-premium") ||
        logoUrl.includes("telegram-stars") ||
        logoUrl.includes("canva-pro"))
  );

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
            /* Standard Product Logo Tile: Centered Square App-Icon Frame */
            <div
              className={cn(
                "relative flex items-center justify-center rounded-2xl sm:rounded-3xl bg-secondary/80 border border-border/90 shadow-md group-hover:border-primary/50 group-hover:shadow-primary/10 group-hover:scale-105 transition-all duration-300 h-[82%] sm:h-[86%] aspect-square overflow-hidden",
                isSquareFullBleedIcon ? "p-0" : "p-1.5 sm:p-2"
              )}
              style={{
                WebkitMaskImage: "-webkit-radial-gradient(white, black)",
                maskImage: "radial-gradient(white, black)",
                transform: "translateZ(0)",
              }}
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={product.name}
                  width={128}
                  height={128}
                  decoding="async"
                  className={cn(
                    "h-full w-full object-center",
                    isSquareFullBleedIcon
                      ? "object-cover"
                      : "object-contain rounded-xl sm:rounded-2xl drop-shadow-sm"
                  )}
                  loading="lazy"
                />
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
              dir="ltr"
              className="absolute left-2 top-2 z-10 rounded-xl bg-rose-500 font-sans text-[10px] sm:text-xs font-black text-white px-2 py-0.5 shadow-md tracking-tight"
            >
              -{pricing.maxDiscountPercent}%
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
        <div className="flex flex-col gap-0.5 px-0.5">
          <h3
            dir="rtl"
            style={{ unicodeBidi: "isolate" }}
            className="truncate text-xs sm:text-sm font-bold tracking-tight text-foreground group-hover/link:text-primary transition-colors"
            title={product.name}
          >
            {safeTitle}
          </h3>
          <p className="line-clamp-1 text-[10px] sm:text-xs text-muted-foreground">
            {getProductCardSubtitle(product, isLifetime)}
          </p>

          {product.rating ? (
            <div className="mt-0.5 flex items-center gap-1 text-[10px] sm:text-xs">
              <span className="text-amber-400 font-bold inline-flex items-center gap-1">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>{toPersianDigits(product.rating.toFixed(1))}</span>
              </span>
              {totalReviewsCount > 0 ? (
                <span className="text-muted-foreground text-[9px] sm:text-[10px]">
                  ({toPersianDigits(totalReviewsCount)} نظر)
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </Link>

      {/* Pricing Block: Dynamic Range vs Single Price vs Out of Stock */}
      <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-secondary/30 p-2 sm:p-2.5 mt-auto">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] sm:text-xs text-muted-foreground">
            {pricing.isRange ? "بازه قیمت:" : "قیمت:"}
          </span>
          <div className="flex items-center gap-1">
            {!isOutOfStock && !pricing.isRange && pricing.singleOriginalPrice ? (
              <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                {formatPrice(pricing.singleOriginalPrice)}
              </span>
            ) : null}
            {!isOutOfStock && pricing.maxDiscountPercent > 0 ? (
              <span
                dir="ltr"
                className="inline-flex items-center justify-center rounded-lg bg-rose-500 font-sans text-[10px] sm:text-xs font-black text-white px-1.5 py-0.5 shadow-xs tracking-tight"
              >
                {pricing.isRange ? `تا -${pricing.maxDiscountPercent}%` : `-${pricing.maxDiscountPercent}%`}
              </span>
            ) : null}
            {isLifetime && !isOutOfStock ? (
              <span className="text-[9px] sm:text-[10px] text-emerald-500 font-bold truncate">
                دسترسی دائمی
              </span>
            ) : !pricing.isRange && product.duration && !isOutOfStock ? (
              <span className="text-[9px] sm:text-[10px] text-muted-foreground font-medium truncate">
                {product.duration}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-1 flex items-baseline justify-between gap-1">
          {isOutOfStock ? (
            <p className="text-xs sm:text-sm font-black text-rose-500">
              ناموجود
            </p>
          ) : pricing.isRange ? (
            <p
              dir="rtl"
              className="gradient-text text-[11px] xs:text-xs sm:text-sm font-extrabold tracking-tight leading-snug"
            >
              از {formatPriceNumber(pricing.minPrice)} تا {formatPrice(pricing.maxPrice)}
            </p>
          ) : (
            <p className="gradient-text text-sm sm:text-base font-extrabold tracking-tight">
              {formatPrice(pricing.minPrice)}
            </p>
          )}
        </div>
      </div>

      {/* Unified Modern CTA Button (BodoCP / License-Market Inspired) */}
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
          "group/cta w-full inline-flex items-center justify-center gap-1.5 rounded-xl sm:rounded-2xl py-2 sm:py-2.5 px-3 text-[11px] sm:text-xs font-extrabold transition-all duration-200 touch-manipulation cursor-pointer active:scale-[0.98]",
          isOutOfStock
            ? "bg-secondary/90 text-muted-foreground border border-border hover:border-primary/40 hover:text-foreground"
            : "bg-linear-to-r from-primary via-purple-600 to-indigo-600 text-white shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/35 hover:brightness-110"
        )}
      >
        <span>
          {isOutOfStock
            ? "مشاهده جزئیات (ناموجود)"
            : hasVariants
              ? "انتخاب پلن و خرید"
              : "مشاهده و خرید"}
        </span>
        <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-200 group-hover/cta:-translate-x-0.5" />
      </Link>
    </article>
  );
}
