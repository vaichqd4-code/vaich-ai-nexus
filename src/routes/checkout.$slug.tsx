import { createFileRoute, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import { ServiceIcon } from "@/components/brand/ServiceIcon";
import { Section } from "@/components/layout/Section";
import { NeonButton, NeonLink } from "@/components/ui/NeonButton";
import { formatPrice, getProduct } from "@/lib/products";
import { type CustomerInfo } from "@/lib/payment";
import { requestPayment } from "@/lib/payment.functions";


export const Route = createFileRoute("/checkout/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "سفارش | VAICH" }, { name: "robots", content: "noindex" }] };
    }
    const title = `ثبت سفارش ${loaderData.product.name} | VAICH`;
    return {
      meta: [
        { title },
        { name: "description", content: `ثبت سفارش اشتراک ${loaderData.product.name} در VAICH.` },
        { property: "og:title", content: title },
        { property: "og:description", content: `ثبت سفارش اشتراک ${loaderData.product.name}.` },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: Checkout,
});

const fieldClass =
  "w-full rounded-2xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-neon-blue/70 focus:ring-2 focus:ring-ring/40";

function Checkout() {
  const { product } = Route.useLoaderData();
  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: "",
    email: "",
    phone: "",
    note: "",
  });
  const [discountCode, setDiscountCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const startPayment = useServerFn(requestPayment);

  const set = (key: keyof CustomerInfo) => (value: string) =>
    setCustomer((c) => ({ ...c, [key]: value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { paymentUrl } = await startPayment({
        data: {
          slug: product.slug,
          fullName: customer.fullName,
          email: customer.email,
          phone: customer.phone,
          ...(customer.note ? { note: customer.note } : {}),
        },
      });
      window.location.href = paymentUrl;
    } catch (err) {
      setSubmitting(false);
      setError(
        err instanceof Error && err.message
          ? err.message
          : "انتقال به درگاه پرداخت انجام نشد. لطفاً دوباره تلاش کنید.",
      );
    }
  };


  return (
    <Section className="aurora" title="ثبت سفارش" subtitle="اطلاعات زیر را تکمیل کنید تا سفارش شما آماده شود.">
      <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-border bg-card/70 p-6">
            <h2 className="mb-4 text-base font-bold">۱. محصول انتخابی</h2>
            <div className="flex items-center gap-4">
              <ServiceIcon slug={product.slug} />
              <div className="min-w-0">
                <p className="truncate font-bold">اشتراک {product.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-card/70 p-6">
            <h2 className="mb-4 text-base font-bold">۲. اطلاعات مشتری</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm">
                  نام و نام خانوادگی
                </label>
                <input
                  id="fullName"
                  required
                  value={customer.fullName}
                  onChange={(e) => set("fullName")(e.target.value)}
                  className={fieldClass}
                  placeholder="نام کامل"
                />
              </div>
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm">
                  شماره تماس
                </label>
                <input
                  id="phone"
                  required
                  inputMode="tel"
                  dir="ltr"
                  value={customer.phone}
                  onChange={(e) => set("phone")(e.target.value)}
                  className={`${fieldClass} text-right`}
                  placeholder="09xxxxxxxxx"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="email" className="mb-2 block text-sm">
                  ایمیل
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  dir="ltr"
                  value={customer.email}
                  onChange={(e) => set("email")(e.target.value)}
                  className={`${fieldClass} text-right`}
                  placeholder="you@example.com"
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="note" className="mb-2 block text-sm">
                  توضیحات (اختیاری)
                </label>
                <textarea
                  id="note"
                  rows={3}
                  value={customer.note}
                  onChange={(e) => set("note")(e.target.value)}
                  className={fieldClass}
                  placeholder="اگر نکته‌ای درباره سفارش دارید بنویسید."
                />
              </div>
            </div>
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-3xl border border-border bg-card/70 p-6 lg:sticky lg:top-24">
          <h2 className="text-base font-bold">۳. خلاصه سفارش</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">محصول</dt>
              <dd className="font-medium">اشتراک {product.name}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">قیمت</dt>
              <dd className="font-medium">{formatPrice(product.price)}</dd>
            </div>
          </dl>

          <div>
            <label htmlFor="discount" className="mb-2 block text-sm text-muted-foreground">
              کد تخفیف (به‌زودی)
            </label>
            <input
              id="discount"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              disabled
              className={`${fieldClass} opacity-60`}
              placeholder="در حال حاضر فعال نیست"
            />
          </div>

          <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">مبلغ نهایی</span>
            <span className="gradient-text text-xl font-extrabold">{formatPrice(product.price)}</span>
          </div>

          <p className="rounded-2xl border border-border bg-background/50 p-4 text-xs leading-6 text-muted-foreground">
            پرداخت از طریق درگاه امن زرین‌پال انجام می‌شود. پس از پرداخت موفق، کد رهگیری نمایش داده
            می‌شود و اشتراک توسط پشتیبانی برای شما ارسال می‌گردد.
          </p>

          <NeonButton type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "در حال انتقال به درگاه..." : "پرداخت و ادامه"}
          </NeonButton>

          {error ? (
            <div
              role="alert"
              className="rounded-2xl border border-destructive/50 bg-background/60 p-4 text-sm leading-7 text-foreground"
            >
              {error}
            </div>
          ) : null}


          <NeonLink to="/support" variant="outline" className="w-full">
            پشتیبانی
          </NeonLink>
        </aside>
      </form>
    </Section>
  );
}
