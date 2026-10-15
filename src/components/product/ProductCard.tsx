import { useState, useRef, type MouseEvent } from "react";
import { ServiceIcon } from "@/components/brand/ServiceIcon";
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
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
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
        "group relative flex w-[185px] xs:w-[210px] sm:w-[315px] shrink-0 snap-start flex-col justify-between gap-3 sm:gap-4 overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-card p-3 sm:p-5 shadow-xs hover:border-primary/50 hover:shadow-2xl transition-all min-h-[345px] sm:min-h-auto",
        className,
      )}
    >
      {/* 3D Glass Light reflection layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 h-40 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40 neon-gradient"
      />

      {/* Special / Featured Badge */}
      {hasBadge && badgeLabel && (
        <span className={cn("absolute left-2.5 top-2.5 sm:left-3.5 sm:top-3.5 z-10 rounded-full px-2 py-0.5 sm:px-3 sm:py-1 text-[10px] sm:text-xs font-bold shadow-md", badgeClass)}>
          {badgeLabel}
        </span>
      )}

      {/* Top Header: Icon + Name */}
      <div className="flex items-center gap-2.5 sm:gap-3.5 pt-1">
        <ServiceIcon slug={product.slug} iconUrl={product.iconUrl} className="h-9 w-9 sm:h-12 sm:w-12 shrink-0" />

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm sm:text-lg font-bold tracking-tight text-foreground">
            {product.name}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-[10px] sm:text-xs text-muted-foreground">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing Block */}
      <div className="rounded-xl sm:rounded-2xl border border-border/60 bg-secondary/30 p-2.5 sm:p-3.5">
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          <span className="text-[10px] sm:text-xs text-muted-foreground">قیمت:</span>
          <div className="flex items-center gap-1 sm:gap-1.5">
            {product.originalPrice && (
              <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.discountPercent ? (
              <span className="rounded-md bg-rose-500/10 px-1 py-0.2 sm:px-1.5 sm:py-0.5 text-[9px] sm:text-[11px] font-bold text-rose-500 border border-rose-500/20">
                %{toPersianDigits(product.discountPercent)}
              </span>
            ) : null}
          </div>
        </div>

        <p className="mt-1 gradient-text text-base sm:text-xl font-extrabold tracking-tight">
          {formatPrice(product.price)}
        </p>

        {product.duration && (
          <div className="mt-2 flex items-center gap-1.5 border-t border-border/40 pt-1.5 text-[10px] sm:text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>مدت: {product.duration}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-auto flex flex-col gap-1.5 pt-1 sm:flex-row sm:gap-2">
        <NeonLink
          to="/products/$slug"
          params={{ slug: product.slug }}
          variant="outline"
          size="sm"
          className="flex-1 text-[11px] sm:text-xs py-1.5 sm:py-2"
        >
          جزئیات
        </NeonLink>

        <NeonLink
          to="/checkout/$slug"
          params={{ slug: product.slug }}
          size="sm"
          className="flex-1 text-[11px] sm:text-xs font-bold py-1.5 sm:py-2"
        >
          خرید آنی
        </NeonLink>
      </div>
    </article>
  );
}
