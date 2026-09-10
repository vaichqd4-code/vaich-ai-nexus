import { ServiceIcon } from "@/components/brand/ServiceIcon";
import { NeonLink } from "@/components/ui/NeonButton";
import { formatPrice, type Product } from "@/lib/products";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group relative flex flex-col gap-5 overflow-hidden rounded-3xl border border-border bg-card/70 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-neon-purple/50 hover:shadow-[0_20px_60px_-30px_var(--neon-purple)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-24 h-40 opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-60 neon-gradient"
      />
      <div className="flex items-center gap-4">
        <ServiceIcon slug={product.slug} />
        <div className="min-w-0">
          <h3 className="truncate text-xl font-bold">{product.name}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
        </div>
      </div>

      <p className="gradient-text text-2xl font-extrabold">{formatPrice(product.price)}</p>

      <div className="mt-auto flex flex-col gap-2 sm:flex-row">
        <NeonLink
          to="/products/$slug"
          params={{ slug: product.slug }}
          variant="outline"
          className="flex-1"
        >
          مشاهده جزئیات
        </NeonLink>
        <NeonLink to="/checkout/$slug" params={{ slug: product.slug }} className="flex-1">
          خرید
        </NeonLink>
      </div>
    </article>
  );
}
