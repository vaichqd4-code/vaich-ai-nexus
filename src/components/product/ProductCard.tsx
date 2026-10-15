import { useState, useRef, type MouseEvent } from "react";
import { ServiceIcon } from "@/components/brand/ServiceIcon";
import { NeonLink } from "@/components/ui/NeonButton";
import { formatPrice, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
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
      className="group relative flex w-[280px] sm:w-[315px] shrink-0 snap-start flex-col gap-4 overflow-hidden rounded-3xl border border-border/80 bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-2xl"
    >
      {/* 3D Glass Light reflection layer */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 h-40 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-40 neon-gradient"
      />

      {/* Special Badge */}
      {product.slug === "gemini-pro" && (
        <span className="absolute left-3.5 top-3.5 z-10 rounded-full bg-primary/90 px-3 py-1 text-xs font-bold text-white shadow-md">
          پیشنهاد ویژه 🔥
        </span>
      )}

      {/* Top Header: Icon + Name */}
      <div className="flex items-center gap-3.5 pt-1">
        <ServiceIcon slug={product.slug} className="h-12 w-12" />

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-bold tracking-tight text-foreground">
            {product.name}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
            {product.description}
          </p>
        </div>
      </div>

      {/* Pricing Block */}
      <div className="rounded-2xl border border-border/60 bg-secondary/30 p-3.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs text-muted-foreground">قیمت با تخفیف:</span>
          {product.originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>

        <p className="mt-1 gradient-text text-xl font-extrabold tracking-tight">
          {formatPrice(product.price)}
        </p>

        {product.duration && (
          <div className="mt-2.5 flex items-center gap-1.5 border-t border-border/40 pt-2 text-xs font-medium text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>مدت اعتبار: {product.duration}</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-auto flex flex-col gap-2 pt-1 sm:flex-row">
        <NeonLink
          to="/products/$slug"
          params={{ slug: product.slug }}
          variant="outline"
          size="sm"
          className="flex-1 text-xs"
        >
          جزئیات
        </NeonLink>

        <NeonLink
          to="/checkout/$slug"
          params={{ slug: product.slug }}
          size="sm"
          className="flex-1 text-xs font-bold"
        >
          خرید آنی
        </NeonLink>
      </div>
    </article>
  );
}
