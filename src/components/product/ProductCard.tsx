import { ServiceIcon } from "@/components/brand/ServiceIcon";
import { NeonLink } from "@/components/ui/NeonButton";
import { formatPrice, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-border bg-card/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neon-purple/50 hover:shadow-[0_20px_60px_-30px_var(--neon-purple)]">
      
      {product.slug === "gemini-pro" && (
        <span className="absolute left-4 top-4 z-10 rounded-full bg-neon-purple px-4 py-1.5 text-xs font-extrabold text-white shadow-[0_0_20px_-6px_var(--neon-purple)]">
          ویژه
        </span>
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 h-40 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60 neon-gradient"
      />

      <div className="flex items-center gap-4">
        <ServiceIcon slug={product.slug} />

        <div className="min-w-0">
          <h3 className="truncate text-xl font-bold">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {product.description}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="flex flex-wrap items-center gap-3">
        {product.originalPrice && (
          <span className="text-base text-muted-foreground line-through">
            {formatPrice(product.originalPrice)}
          </span>
        )}

        <p className="w-full gradient-text text-2xl font-extrabold">
          {formatPrice(product.price)}
        </p>
      </div>

      {product.duration && (
        <p className="text-sm font-medium text-muted-foreground">
          مدت اشتراک: {product.duration}
        </p>
      )}

      <div className="mt-auto flex flex-col gap-2 sm:flex-row">
        <NeonLink
          to="/products/$slug"
          params={{ slug: product.slug }}
          variant="outline"
          className="flex-1"
        >
          مشاهده جزئیات
        </NeonLink>

        <NeonLink
          to="/checkout/$slug"
          params={{ slug: product.slug }}
          size="lg"
          className="flex-1"
        >
          خرید
        </NeonLink>
      </div>
    </article>
  );
}
