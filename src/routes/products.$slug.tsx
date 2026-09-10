import { createFileRoute, notFound } from "@tanstack/react-router";
import { ServiceIcon } from "@/components/brand/ServiceIcon";
import { Section } from "@/components/layout/Section";
import { NeonLink } from "@/components/ui/NeonButton";
import { formatPrice, getProduct } from "@/lib/products";

export const Route = createFileRoute("/products/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "محصول یافت نشد | VAICH" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    const title = `اشتراک ${product.name} | VAICH`;
    return {
      meta: [
        { title },
        { name: "description", content: `${product.description} قیمت: ${formatPrice(product.price)}` },
        { property: "og:title", content: title },
        { property: "og:description", content: product.description },
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { product } = Route.useLoaderData();

  return (
    <Section className="aurora">
      <div className="glass-panel rounded-4xl p-6 sm:p-10">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex items-center gap-4">
              <ServiceIcon slug={product.slug} className="h-16 w-16" />
              <div className="min-w-0">
                <h1 className="truncate text-2xl font-extrabold sm:text-3xl">
                  اشتراک {product.name}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">{product.description}</p>
              </div>
            </div>

            <div className="mt-8">
              <h2 className="text-base font-bold">اطلاعات مهم خرید</h2>
              <ul className="mt-3 space-y-3">
                {product.purchaseInfo.map((info) => (
                  <li
                    key={info}
                    className="rounded-2xl border border-border bg-background/40 px-4 py-3 text-sm leading-7 text-muted-foreground"
                  >
                    {info}
                  </li>
                ))}
                <li className="rounded-2xl border border-border bg-background/40 px-4 py-3 text-sm leading-7 text-muted-foreground">
                  درگاه پرداخت آنلاین هنوز متصل نشده است؛ پس از ثبت سفارش، پرداخت از طریق پشتیبانی
                  هماهنگ می‌شود.
                </li>
              </ul>
            </div>
          </div>

          <aside className="h-fit rounded-3xl border border-border bg-card/70 p-6">
            <p className="text-sm text-muted-foreground">قیمت</p>
            <p className="gradient-text mt-1 text-3xl font-extrabold">{formatPrice(product.price)}</p>
            <div className="mt-6 flex flex-col gap-2">
              <NeonLink to="/checkout/$slug" params={{ slug: product.slug }} size="lg">
                خرید
              </NeonLink>
              <NeonLink to="/support" variant="outline" size="lg">
                پشتیبانی
              </NeonLink>
            </div>
          </aside>
        </div>
      </div>
    </Section>
  );
}
