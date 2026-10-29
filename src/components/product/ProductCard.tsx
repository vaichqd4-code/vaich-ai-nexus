import { useState, useRef, type MouseEvent } from "react";
import { Link } from "@tanstack/react-router";
import { getProductLogo } from "@/components/brand/ServiceIcon";
import { NeonLink } from "@/components/ui/NeonButton";
import { formatPrice, toPersianDigits, type Product } from "@/lib/products";
import { cn } from "@/lib/utils";

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
    const rotateX = ((y - centerY) / centerY) * -7;
    const rotateY = ((x - centerX) / centerX) * 7;
    setTilt({ x: rotateX, y: rotateY, active: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, active: false });
  };

  const hasBadge = Boolean(product.badge) || Boolean(product.featured);
  const badgeLabel = product.badge || (product.featured ? "پیشنهاد ویژه 🔥" : "");

  const badgeColorMap: Record<string, string> = {
    fire: "bg-linear-to-r from-rose-500 to-amber-500 text-white",
    purple: "bg-linear-to-r from-primary to-accent text-white",
    emerald: "bg-emerald-600 text-white",
    blue: "bg-blue-600 text-white",
    amber: "bg-amber-400 text-slate-950 font-black",
  };
  const badgeClass = (product.badgeColor && badgeColorMap[product.badgeColor]) || badgeColorMap.purple;

  const logoUrl = getProductLogo(product.slug, product.iconUrl);
  const initial = product.slug ? product.slug.charAt(0).toUpperCase() : "AI";
  const isOutOfStock = product.inStock === false;
  const isPlanner = product.slug.includes("planner") || product.categoryId === "row-mvampt3r";

  return (
    <article
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: tilt.active
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(-4px)`
          : "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)",
        transition: tilt.active ? "transform 0.1s ease-out" : "transform 0.4s ease-out, box-shadow 0.3s ease",
      }}
      className={cn(
        "group relative flex w-[185px] xs:w-[210px] sm:w-[285px] shrink-0 snap-start flex-col gap-2.5 sm:gap-3 overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-2.5 sm:p-3.5 shadow-xs hover:border-primary/50 hover:shadow-2xl transition-all select-none touch-manipulation",
        isOutOfStock && "opacity-90 grayscale-[0.85] contrast-95",
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
        aria-label={`مشاهده جزئیات ${product.name}`}
        className="group/link flex flex-col gap-2.5 focus:outline-none"
      >
        {/* Top Image Banner: BodoCP-Style Rounded Frame */}
        <div
          className={cn(
            "relative w-full aspect-16/10 xs:aspect-4/3 sm:aspect-16/10 rounded-xl sm:rounded-2xl overflow-hidden bg-linear-to-b from-secondary/70 via-secondary/35 to-background/60 flex items-center justify-center border border-border/50 group-hover:border-primary/40 transition-colors",
            product.imageFit === "cover" ? "p-0" : "p-1.5 sm:p-2"
          )}
        >
          {/* Subtle Ambient Glow */}
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
                className="h-full w-full object-cover rounded-xl sm:rounded-2xl group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <span className="text-2xl sm:text-3xl font-black text-primary">
                {initial}
              </span>
            )
          ) : (
            /* Standard Product Logo Tile: App-Icon Squircle Frame with border & margin - enlarged */
            <div className="relative flex items-center justify-center p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-secondary/90 border border-border/90 shadow-md group-hover:border-primary/50 group-hover:shadow-primary/10 group-hover:scale-105 transition-all duration-300 w-[88%] h-[88%] max-w-[130px] aspect-square">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={product.name}
                  width={96}
                  height={96}
                  decoding="async"
                  className="h-full w-full object-contain rounded-xl sm:rounded-2xl drop-shadow-sm"
                  loading="lazy"
                />
              ) : (
                <span className="text-xl sm:text-2xl font-black text-primary">
                  {initial}
                </span>
              )}
            </div>
          )}

          {/* Out of stock circular badge (BodoCP-style) */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/50 backdrop-blur-[2px] rounded-xl sm:rounded-2xl">
              <div className="flex flex-col items-center justify-center h-13 w-13 sm:h-16 sm:w-16 rounded-full bg-rose-600/95 text-white shadow-xl border-2 border-white/20 select-none">
                <span className="text-[10px] sm:text-xs font-black tracking-tight">ناموجود</span>
              </div>
            </div>
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

        {/* Card Content: Title & Subtitle & Rating */}
        <div className="flex flex-col gap-0.5 px-0.5">
          <h3
            className="truncate text-xs sm:text-sm font-bold tracking-tight text-foreground group-hover/link:text-primary transition-colors"
            title={product.name}
          >
            {product.name}
          </h3>
          <p className="line-clamp-1 text-[10px] sm:text-xs text-muted-foreground">
            {product.description || (isPlanner ? "خرید دائمی و مادام‌العمر • بدون اشتراک" : (product.duration ? `اشتراک معتبر • ${product.duration}` : "تحویل فوری و قانونی"))}
          </p>

          {/* Star Rating & Review count */}
          {product.rating ? (
            <div className="mt-0.5 flex items-center gap-1 text-[10px] sm:text-xs">
              <span className="text-amber-400 font-bold">★ {toPersianDigits(product.rating.toFixed(1))}</span>
              {product.reviewCount ? (
                <span className="text-muted-foreground text-[9px] sm:text-[10px]">
                  ({toPersianDigits(product.reviewCount)} نظر)
                </span>
              ) : null}
            </div>
          ) : null}
        </div>
      </Link>

      {/* Pricing Block */}
      <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-secondary/30 p-2 sm:p-2.5 mt-auto">
        <div className="flex items-center justify-between gap-1">
          <span className="text-[10px] sm:text-xs text-muted-foreground">قیمت:</span>
          <div className="flex items-center gap-1">
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discountPercent ? (
              <span
                dir="ltr"
                className="inline-flex items-center justify-center rounded-lg bg-rose-500 font-sans text-[11px] sm:text-xs font-black text-white px-1.5 py-0.5 shadow-xs tracking-tight"
              >
                -{product.discountPercent}%
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-1 flex items-baseline justify-between gap-1">
          <p className="gradient-text text-sm sm:text-base font-extrabold tracking-tight">
            {formatPrice(product.price)}
          </p>
          {isPlanner ? (
            <span className="text-[9px] sm:text-[11px] text-emerald-400 font-bold truncate">
              دسترسی دائمی
            </span>
          ) : product.duration ? (
            <span className="text-[9px] sm:text-[11px] text-muted-foreground font-medium truncate">
              {product.duration}
            </span>
          ) : null}
        </div>
      </div>

      {/* Action Buttons: 2-column Side-by-Side */}
      {isOutOfStock ? (
        <div className="grid grid-cols-2 gap-1.5">
          <span className="text-center text-[10px] sm:text-xs py-1.5 px-1 rounded-xl bg-secondary/50 text-muted-foreground/60 border border-border/50 cursor-not-allowed select-none">
            جزئیات
          </span>
          <span className="text-center text-[10px] sm:text-xs font-bold py-1.5 px-1 rounded-xl bg-rose-500/15 text-rose-400 border border-rose-500/30 cursor-not-allowed select-none">
            ناموجود
          </span>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-1.5">
          <NeonLink
            to="/products/$slug"
            params={{ slug: product.slug }}
            preload="intent"
            variant="outline"
            size="sm"
            aria-label={`مشاهده جزئیات ${product.name}`}
            className="text-center text-[10px] sm:text-xs py-1.5 px-1 rounded-xl touch-manipulation cursor-pointer"
          >
            جزئیات
          </NeonLink>

          <NeonLink
            to="/checkout/$slug"
            params={{ slug: product.slug }}
            preload="intent"
            size="sm"
            aria-label={isPlanner ? `خرید ${product.name}` : `خرید اشتراک ${product.name}`}
            className="text-center text-[10px] sm:text-xs font-bold py-1.5 px-1 rounded-xl touch-manipulation cursor-pointer"
          >
            {isPlanner ? "خرید مستقیم" : "خرید آنی"}
          </NeonLink>
        </div>
      )}
    </article>
  );
}
