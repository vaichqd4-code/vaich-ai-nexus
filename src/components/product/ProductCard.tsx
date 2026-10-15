import { useState, useRef, type MouseEvent } from "react";
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
        "group relative flex w-[185px] xs:w-[210px] sm:w-[285px] shrink-0 snap-start flex-col gap-2.5 sm:gap-3 overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-2.5 sm:p-3.5 shadow-xs hover:border-primary/50 hover:shadow-2xl transition-all select-none",
        className,
      )}
    >
      {/* 3D Glass Light reflection layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 h-40 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40 neon-gradient"
      />

      {/* Top Image Banner: BodoCP-Style Rounded Square Frame */}
      <div className="relative w-full aspect-16/10 xs:aspect-4/3 sm:aspect-16/10 rounded-xl sm:rounded-2xl overflow-hidden bg-linear-to-b from-secondary/70 via-secondary/35 to-background/60 p-2.5 sm:p-3 flex items-center justify-center border border-border/50 group-hover:border-primary/40 transition-colors">
        {/* Subtle Ambient Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-primary/10 opacity-0 blur-xl transition-opacity duration-300 group-hover:opacity-100"
        />

        {logoUrl ? (
          <img
            src={logoUrl}
            alt={product.name}
            className="max-h-full max-w-full object-contain rounded-lg sm:rounded-xl drop-shadow-md group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        ) : (
          <span className="text-2xl sm:text-3xl font-black text-primary">
            {initial}
          </span>
        )}

        {/* Floating Special / Featured Badge */}
        {hasBadge && badgeLabel && (
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

      {/* Card Content: Title & Subtitle */}
      <div className="flex flex-col gap-0.5 px-0.5">
        <h3
          className="truncate text-xs sm:text-sm font-bold tracking-tight text-foreground"
          title={product.name}
        >
          {product.name}
        </h3>
        <p className="line-clamp-1 text-[10px] sm:text-xs text-muted-foreground">
          {product.description || (product.duration ? `اشتراک معتبر • ${product.duration}` : "تحویل فوری و قانونی")}
        </p>
      </div>

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
              <span className="rounded-md bg-rose-500/10 px-1 py-0.2 sm:px-1.5 sm:py-0.5 text-[9px] sm:text-[10px] font-bold text-rose-500 border border-rose-500/20">
                %{toPersianDigits(product.discountPercent)}
              </span>
            ) : null}
          </div>
        </div>

        <div className="mt-1 flex items-baseline justify-between gap-1">
          <p className="gradient-text text-sm sm:text-base font-extrabold tracking-tight">
            {formatPrice(product.price)}
          </p>
          {product.duration && (
            <span className="text-[9px] sm:text-[11px] text-muted-foreground font-medium truncate">
              {product.duration}
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons: 2-column Side-by-Side */}
      <div className="grid grid-cols-2 gap-1.5">
        <NeonLink
          to="/products/$slug"
          params={{ slug: product.slug }}
          variant="outline"
          size="sm"
          className="text-center text-[10px] sm:text-xs py-1.5 px-1 rounded-xl"
        >
          جزئیات
        </NeonLink>

        <NeonLink
          to="/checkout/$slug"
          params={{ slug: product.slug }}
          size="sm"
          className="text-center text-[10px] sm:text-xs font-bold py-1.5 px-1 rounded-xl"
        >
          خرید آنی
        </NeonLink>
      </div>
    </article>
  );
}
