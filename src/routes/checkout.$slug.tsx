import { createFileRoute, notFound } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ServiceIcon } from "@/components/brand/ServiceIcon";
import { Section } from "@/components/layout/Section";
import { NeonButton, NeonLink, neonButtonClass } from "@/components/ui/NeonButton";
import { CONTACT_TELEGRAM_ID, CONTACT_TELEGRAM_URL } from "@/components/brand/ContactLinks";
import { formatPrice, getProduct } from "@/lib/products";
import { CARD_HOLDER, CARD_NUMBER, CARD_NUMBER_GROUPED } from "@/lib/payment";

export const Route = createFileRoute("/checkout/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "پرداخت کارت به کارت | VAICH" },
          { name: "robots", content: "noindex" },
        ],
      };
    }

    const title = `پرداخت اشتراک ${loaderData.product.name} | VAICH`;

    return {
      meta: [
        { title },
        {
          name: "description",
          content: `پرداخت کارت به کارت اشتراک ${loaderData.product.name} در VAICH.`,
        },
        { property: "og:title", content: title },
        {
          property: "og:description",
          content: `پرداخت کارت به کارت اشتراک ${loaderData.product.name}.`,
        },
        { name: "robots", content: "noindex" },
      ],
    };
  },
  component: Checkout,
});

const ACCEPTED = "image/jpeg,image/jpg,image/png";

function Checkout() {
  const { product } = Route.useLoaderData();

  const [copied, setCopied] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const copyCard = async () => {
    try {
      await navigator.clipboard.writeText(CARD_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const onPick = (file: File | undefined) => {
    if (!file) return;

    if (!/^image\/(jpeg|jpg|png)$/i.test(file.type)) {
      setFileError("فقط تصویر با فرمت JPG، JPEG یا PNG قابل انتخاب است.");
      return;
    }

    setFileError(null);
    setFileName(file.name);

    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });

    setSubmitted(false);
  };

  return (
    <Section
      className="aurora"
      title="پرداخت دستی (کارت به کارت)"
      subtitle="مبلغ دقیق زیر را به کارت اعلام‌شده واریز کنید و سپس رسید پرداخت را برای ما بفرستید."
    >
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">

        <div className="space-y-6">

          {/* Product */}
          <div className="rounded-3xl border border-border bg-card/70 p-6">
            <h2 className="mb-4 text-base font-bold">
              ۱. محصول انتخابی
            </h2>

            <div className="flex items-center gap-4">
              <ServiceIcon slug={product.slug} />

              <div className="min-w-0">
                <p className="truncate font-bold">
                  اشتراک {product.name}
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {product.description}
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">
                مبلغ قابل پرداخت
              </span>

              <span className="gradient-text text-xl font-extrabold">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>

          {/* Payment */}
          <div className="glass-panel rounded-3xl border border-border p-6">

            <h2 className="mb-4 text-base font-bold">
              ۲. اطلاعات کارت
            </h2>

            <div className="rounded-2xl border border-neon-blue/40 bg-background/60 p-5">

              <p className="text-xs text-muted-foreground">
                شماره کارت
              </p>

              <p
                dir="ltr"
                className="mt-2 select-all text-center text-xl font-extrabold tracking-[0.2em] sm:text-2xl"
              >
                {CARD_NUMBER_GROUPED}
              </p>

              <div className="mt-4 flex items-center justify-between gap-4 border-t border-border pt-4 text-sm">
                <span className="text-muted-foreground">
                  به نام
                </span>

                <span className="font-bold">
                  {CARD_HOLDER}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4 text-sm">
                <span className="text-muted-foreground">
                  مبلغ
                </span>

                <span className="font-bold">
                  {formatPrice(product.price)}
                </span>
              </div>

              <NeonButton
                type="button"
                variant="outline"
                className="mt-5 w-full"
                onClick={copyCard}
              >
                {copied
                  ? "شماره کارت کپی شد ✓"
                  : "کپی شماره کارت"}
              </NeonButton>
            </div>

            <p className="mt-4 rounded-2xl border border-border bg-background/50 p-4 text-xs leading-7 text-muted-foreground">
              پس از واریز مبلغ دقیق، لطفاً رسید پرداخت خود را برای بررسی و تأیید دستی ارسال کنید.
            </p>

            {!showUpload ? (
              <NeonButton
                type="button"
                size="lg"
                className="mt-5 w-full"
                onClick={() => setShowUpload(true)}
              >
                پرداخت کردم — ارسال رسید
              </NeonButton>
            ) : null}
          </div>

          {/* Receipt */}
          {showUpload ? (
            <div className="rounded-3xl border border-border bg-card/70 p-6">

              <h2 className="mb-1 text-base font-bold">
                ۳. بارگذاری رسید پرداخت
              </h2>

              <p className="mb-4 text-xs leading-7 text-muted-foreground">
                تصویر رسید را از گالری انتخاب کنید یا همین حالا از رسید عکس بگیرید.
                فرمت‌های مجاز: JPG، JPEG و PNG.
              </p>

              <input
                ref={galleryRef}
                type="file"
                accept={ACCEPTED}
                className="sr-only"
                onChange={(e) =>
                  onPick(e.target.files?.[0])
                }
              />

              <input
                ref={cameraRef}
                type="file"
                accept={ACCEPTED}
                capture="environment"
                className="sr-only"
                onChange={(e) =>
                  onPick(e.target.files?.[0])
                }
              />

              <div className="flex flex-col gap-3 sm:flex-row">

                <NeonButton
                  type="button"
                  size="xl"
                  className="flex-1"
                  onClick={() =>
                    galleryRef.current?.click()
                  }
                >
                  انتخاب از گالری
                </NeonButton>

                <NeonButton
                  type="button"
                  variant="outline"
                  size="xl"
                  className="flex-1"
                  onClick={() =>
                    cameraRef.current?.click()
                  }
                >
                  گرفتن عکس با دوربین
                </NeonButton>

              </div>

              {fileError ? (
                <p
                  role="alert"
                  className="mt-4 rounded-2xl border border-destructive/50 bg-background/60 p-4 text-sm"
                >
                  {fileError}
                </p>
              ) : null}

              {preview ? (
                <div className="mt-5">

                  <p className="mb-2 text-sm text-muted-foreground">
                    پیش‌نمایش رسید انتخاب‌شده:
                  </p>

                  <img
                    src={preview}
                    alt={`پیش‌نمایش رسید پرداخت اشتراک ${product.name}`}
                    className="max-h-96 w-full rounded-2xl border border-border object-contain bg-background/60"
                  />

                  {fileName ? (
                    <p
                      className="mt-2 truncate text-xs text-muted-foreground"
                      dir="ltr"
                    >
                      {fileName}
                    </p>
                  ) : null}

                  <div className="mt-5 rounded-2xl border border-border bg-background/50 p-4 text-xs leading-7 text-muted-foreground">
                    سایت به‌صورت خودکار فایل را به تلگرام ارسال نمی‌کند.
                    با زدن دکمهٔ زیر گفت‌وگوی تلگرام با{" "}
                    <span dir="ltr">
                      @{CONTACT_TELEGRAM_ID}
                    </span>{" "}
                    باز می‌شود؛ همان تصویر رسید را در آن گفت‌وگو بفرستید و نام محصول
                    ({product.name}) و مبلغ (
                    {formatPrice(product.price)}
                    ) را بنویسید.
                  </div>

                  <a
                    href={CONTACT_TELEGRAM_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setSubmitted(true)}
                    className={`${neonButtonClass(
                      "primary",
                      "lg",
                    )} mt-4 w-full`}
                  >
                    ارسال رسید در تلگرام
                  </a>

                </div>
              ) : null}

              {submitted ? (
                <p
                  role="status"
                  className="mt-5 rounded-2xl border border-neon-blue/50 bg-background/60 p-4 text-sm leading-8"
                >
                  رسید شما ثبت شد. پرداخت شما به‌صورت دستی بررسی و تأیید خواهد شد.
                </p>
              ) : null}

            </div>
          ) : null}

        </div>

        {/* Order Summary */}
        <aside className="h-fit space-y-4 rounded-3xl border border-border bg-card/70 p-6 lg:sticky lg:top-24">

          <h2 className="text-base font-bold">
            خلاصه سفارش
          </h2>

          <dl className="space-y-3 text-sm">

            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">
                محصول
              </dt>

              <dd className="font-medium">
                اشتراک {product.name}
              </dd>
            </div>

            {product.duration ? (
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">
                  مدت
                </dt>

                <dd className="font-medium">
                  {product.duration}
                </dd>
              </div>
            ) : null}

            {/* شماره کارت دوم حذف شد */}

            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted-foreground">
                به نام
              </dt>

              <dd className="font-medium">
                {CARD_HOLDER}
              </dd>
            </div>

          </dl>

          <div className="flex items-center justify-between gap-4 border-t border-border pt-4">

            <span className="text-sm text-muted-foreground">
              مبلغ نهایی
            </span>

            <span className="gradient-text text-xl font-extrabold">
              {formatPrice(product.price)}
            </span>

          </div>

          <NeonLink
            to="/support"
            variant="outline"
            className="w-full"
          >
            پشتیبانی
          </NeonLink>

        </aside>

      </div>
    </Section>
  );
}
