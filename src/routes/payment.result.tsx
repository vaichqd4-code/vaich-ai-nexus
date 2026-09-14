import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";

import { Section } from "@/components/layout/Section";
import { NeonLink, neonButtonClass } from "@/components/ui/NeonButton";
import { CONTACT_PHONE, CONTACT_PHONE_PERSIAN, CONTACT_TELEGRAM_URL } from "@/components/brand/ContactLinks";
import { formatPrice, toPersianDigits } from "@/lib/products";
import { verifyPayment } from "@/lib/payment.functions";

type Search = {
  Authority?: string | undefined;
  Status?: string | undefined;
  slug?: string | undefined;
};

export const Route = createFileRoute("/payment/result")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    Authority: typeof search["Authority"] === "string" ? search["Authority"] : undefined,
    Status: typeof search["Status"] === "string" ? search["Status"] : undefined,
    slug: typeof search["slug"] === "string" ? search["slug"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "نتیجه پرداخت | VAICH" },
      { name: "description", content: "نتیجه پرداخت سفارش اشتراک هوش مصنوعی در VAICH." },
      { property: "og:title", content: "نتیجه پرداخت | VAICH" },
      { property: "og:description", content: "وضعیت پرداخت سفارش شما در VAICH." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: PaymentResult,
});

function PaymentResult() {
  const { Authority, Status, slug } = Route.useSearch();
  const verify = useServerFn(verifyPayment);

  const enabled = Boolean(Authority && slug);
  const query = useQuery({
    queryKey: ["payment-verify", Authority, slug, Status],
    enabled,
    retry: false,
    refetchOnWindowFocus: false,
    queryFn: () =>
      verify({ data: { authority: Authority!, slug: slug!, status: Status ?? "NOK" } }),
  });

  const support = (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <a
        href={CONTACT_TELEGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={neonButtonClass("primary", "md")}
      >
        ارسال پیام در تلگرام
      </a>
      <a href={`tel:${CONTACT_PHONE}`} className={neonButtonClass("outline", "md")}>
        تماس: {CONTACT_PHONE_PERSIAN}
      </a>
    </div>
  );

  return (
    <Section className="aurora" title="نتیجه پرداخت">
      <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card/70 p-6 sm:p-8">
        {!enabled ? (
          <>
            <h2 className="text-lg font-bold">اطلاعات پرداخت در دسترس نیست</h2>
            <p className="mt-3 text-sm leading-8 text-muted-foreground">
              این صفحه پس از بازگشت از درگاه پرداخت نمایش داده می‌شود. لطفاً سفارش خود را دوباره
              ثبت کنید.
            </p>
            <div className="mt-6">
              <NeonLink to="/products">مشاهده اشتراک‌ها</NeonLink>
            </div>
          </>
        ) : query.isPending ? (
          <p role="status" className="text-sm text-muted-foreground">
            در حال بررسی وضعیت پرداخت...
          </p>
        ) : query.isError ? (
          <>
            <h2 className="text-lg font-bold">بررسی پرداخت ممکن نشد</h2>
            <p className="mt-3 text-sm leading-8 text-muted-foreground">
              اگر مبلغ از حساب شما کسر شده است، با پشتیبانی تماس بگیرید تا بررسی شود.
            </p>
            {support}
          </>
        ) : query.data.ok ? (
          <>
            <h2 className="gradient-text text-xl font-extrabold">پرداخت موفق بود</h2>
            <dl className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">محصول</dt>
                <dd className="font-medium">اشتراک {query.data.productName}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">مبلغ پرداخت‌شده</dt>
                <dd className="font-medium">{formatPrice(query.data.amount)}</dd>
              </div>
              {query.data.refId ? (
                <div className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">کد رهگیری</dt>
                  <dd className="font-bold" dir="ltr">
                    {toPersianDigits(query.data.refId)}
                  </dd>
                </div>
              ) : null}
            </dl>
            <p className="mt-5 rounded-2xl border border-border bg-background/50 p-4 text-xs leading-7 text-muted-foreground">
              کد رهگیری را نگه دارید و آن را برای پشتیبانی VAICH بفرستید تا اشتراک شما فعال و
              تحویل داده شود.
            </p>
            {support}
          </>
        ) : (
          <>
            <h2 className="text-lg font-bold">پرداخت انجام نشد</h2>
            <p className="mt-3 text-sm leading-8 text-muted-foreground">{query.data.message}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {slug ? (
                <NeonLink to="/checkout/$slug" params={{ slug }}>
                  تلاش دوباره
                </NeonLink>
              ) : (
                <NeonLink to="/products">مشاهده اشتراک‌ها</NeonLink>
              )}
              <a
                href={CONTACT_TELEGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={neonButtonClass("outline", "md")}
              >
                پشتیبانی در تلگرام
              </a>
            </div>
          </>
        )}
      </div>
    </Section>
  );
}
