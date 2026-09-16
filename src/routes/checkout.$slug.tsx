import { createFileRoute, notFound } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ServiceIcon } from "@/components/brand/ServiceIcon";
import { Section } from "@/components/layout/Section";
import {
  NeonButton,
  NeonLink,
  neonButtonClass,
} from "@/components/ui/NeonButton";
import {
  CONTACT_TELEGRAM_ID,
  CONTACT_TELEGRAM_URL,
  whatsappUrlWithText,
} from "@/components/brand/ContactLinks";
import { formatPrice, getProduct } from "@/lib/products";
import {
  buildOrderMessage,
  CARD_HOLDER,
  CARD_NUMBER,
  CARD_NUMBER_GROUPED,
  type CustomerInfo,
} from "@/lib/payment";

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

const fieldClass =
  "mt-2 w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-neon-blue/70";

const errorFieldClass =
  "mt-2 w-full rounded-2xl border border-destructive bg-background/60 px-4 py-3 text-sm outline-none";

function Checkout() {
  const { product } = Route.useLoaderData();

  const [copied, setCopied] = useState(false);
  const [msgCopied, setMsgCopied] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [formAttempted, setFormAttempted] = useState(false);

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: "",
    email: "",
    phone: "",
    note: "",
  });

  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  const orderMessage = buildOrderMessage(product, customer);

  const fullNameError =
    formAttempted && customer.fullName.trim().length <= 1;

  const phoneError =
    formAttempted && customer.phone.trim().length <= 6;

  const receiptError =
    formAttempted && !selectedFile;

  const canSend =
    customer.fullName.trim().length > 1 &&
    customer.phone.trim().length > 6 &&
    Boolean(selectedFile);

  const setField = (key: keyof CustomerInfo) => (value: string) =>
    setCustomer((c) => ({ ...c, [key]: value }));

  const copyCard = async () => {
    try {
      await navigator.clipboard.writeText(CARD_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(orderMessage);
      setMsgCopied(true);
      setTimeout(() => setMsgCopied(false), 2500);
    } catch {
      setMsgCopied(false);
    }
  };

  const onPick = (file: File | undefined) => {
    if (!file) return;

    if (!/^image\/(jpeg|jpg|png)$/i.test(file.type)) {
      setFileError("فقط تصویر با فرمت JPG، JPEG یا PNG قابل انتخاب است.");
      setSelectedFile(null);
      setPreview(null);
      setFileName(null);
      return;
    }

    setFileError(null);
    setFileName(file.name);
    setSelectedFile(file);

    setPreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return URL.createObjectURL(file);
    });

    setSubmitted(false);
  };

  const validateForm = () => {
    setFormAttempted(true);

    const valid =
      customer.fullName.trim().length > 1 &&
      customer.phone.trim().length > 6 &&
      Boolean(selectedFile);

    if (!valid) {
      return false;
    }

    return true;
  };

  const shareReceipt = async () => {
    if (!validateForm() || !selectedFile) return;

    try {
      const shareData: ShareData = {
        title: `رسید پرداخت ${product.name}`,
        text: orderMessage,
        files: [selectedFile],
      };

      if (
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [selectedFile] })
      ) {
        await navigator.share(shareData);
        setSubmitted(true);
        return;
      }

      await copyMessage();

      window.open(
        CONTACT_TELEGRAM_URL,
        "_blank",
        "noopener,noreferrer",
      );

      setSubmitted(true);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      try {
        await copyMessage();
      } catch {
        // Ignore clipboard errors.
      }
    }
  };

  const sendWhatsApp = async () => {
    if (!validateForm() || !selectedFile) return;

    try {
      const shareData: ShareData = {
        title: `رسید پرداخت ${product.name}`,
        text: orderMessage,
        files: [selectedFile],
      };

      if (
        typeof navigator.share === "function" &&
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [selectedFile] })
      ) {
        await navigator.share(shareData);
        setSubmitted(true);
        return;
      }

      window.open(
        whatsappUrlWithText(orderMessage),
        "_blank",
        "noopener,noreferrer",
      );

      setSubmitted(true);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      window.open(
        whatsappUrlWithText(orderMessage),
        "_blank",
        "noopener,noreferrer",
      );
    }
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
                size="xl"
                className="mt-5 w-full"
                onClick={() => setShowUpload(true)}
              >
                پرداخت کردم — ارسال رسید
              </NeonButton>
            ) : null}
          </div>

          {/* Customer info + receipt */}
          {showUpload ? (
            <>
              <div className="rounded-3xl border border-border bg-card/70 p-6">
                <h2 className="mb-1 text-base font-bold">
                  ۳. اطلاعات شما
                </h2>

                <p className="mb-4 text-xs leading-7 text-muted-foreground">
                  این اطلاعات همراه رسید برای پشتیبانی ارسال می‌شود تا سفارش شما تأیید و تحویل شود.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">

                  {/* Full name */}
                  <label className="block text-sm">
                    <span className="text-muted-foreground">
                      نام و نام خانوادگی *
                    </span>

                    <input
                      className={
                        fullNameError
                          ? errorFieldClass
                          : fieldClass
                      }
                      value={customer.fullName}
                      onChange={(e) => {
                        setField("fullName")(e.target.value);
                        setFormAttempted(false);
                      }}
                      placeholder="مثلاً علی رضایی"
                    />

                    {fullNameError ? (
                      <p className="mt-2 text-xs text-destructive">
                        نام و نام خانوادگی اجباری است
                      </p>
                    ) : null}
                  </label>

                  {/* Phone */}
                  <label className="block text-sm">
                    <span className="text-muted-foreground">
                      شماره تماس *
                    </span>

                    <input
                      className={
                        phoneError
                          ? errorFieldClass
                          : fieldClass
                      }
                      dir="ltr"
                      inputMode="tel"
                      value={customer.phone}
                      onChange={(e) => {
                        setField("phone")(e.target.value);
                        setFormAttempted(false);
                      }}
                      placeholder="09xxxxxxxxx"
                    />

                    {phoneError ? (
                      <p className="mt-2 text-xs text-destructive">
                        شماره تماس اجباری است
                      </p>
                    ) : null}
                  </label>

                  {/* Email */}
                  <label className="block text-sm sm:col-span-2">
                    <span className="text-muted-foreground">
                      ایمیل (اختیاری)
                    </span>

                    <input
                      className={fieldClass}
                      dir="ltr"
                      inputMode="email"
                      value={customer.email}
                      onChange={(e) =>
                        setField("email")(e.target.value)
                      }
                      placeholder="you@example.com"
                    />
                  </label>

                  {/* Note */}
                  <label className="block text-sm sm:col-span-2">
                    <span className="text-muted-foreground">
                      توضیحات (اختیاری)
                    </span>

                    <textarea
                      className={`${fieldClass} min-h-24 resize-y`}
                      value={customer.note ?? ""}
                      onChange={(e) =>
                        setField("note")(e.target.value)
                      }
                      placeholder="در صورت نیاز توضیح بنویسید"
                    />
                  </label>
                </div>
              </div>

              {/* Receipt */}
              <div className="rounded-3xl border border-border bg-card/70 p-6">
                <h2 className="mb-1 text-base font-bold">
                  ۴. بارگذاری رسید پرداخت
                </h2>

                <p className="mb-4 text-xs leading-7 text-muted-foreground">
                  تصویر رسید را از گالری انتخاب کنید یا همین حالا از رسید عکس بگیرید. فرمت‌های مجاز:
                  JPG، JPEG و PNG.
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
                    className="w-full flex-1"
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
                    className="w-full flex-1"
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

                {receiptError && !fileError ? (
                  <p
                    role="alert"
                    className="mt-4 rounded-2xl border border-destructive/50 bg-background/60 p-4 text-sm text-destructive"
                  >
                    تصویر رسید اجباری است
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
                      className="max-h-96 w-full rounded-2xl border border-border bg-background/60 object-contain"
                    />

                    {fileName ? (
                      <p
                        className="mt-2 truncate text-xs text-muted-foreground"
                        dir="ltr"
                      >
                        {fileName}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {/* Send */}
              <div className="rounded-3xl border border-border bg-card/70 p-6">
                <h2 className="mb-1 text-base font-bold">
                  ۵. ارسال رسید و اطلاعات سفارش
                </h2>

                <p className="mb-4 text-xs leading-7 text-muted-foreground">
                  رسید انتخاب‌شده همراه اطلاعات کامل سفارش ارسال می‌شود.
                  قبل از ارسال، اطلاعات را بررسی کنید.
                </p>

                <pre className="max-h-64 overflow-auto whitespace-pre-wrap rounded-2xl border border-border bg-background/60 p-4 text-xs leading-7">
                  {orderMessage}
                </pre>

                <NeonButton
                  type="button"
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={copyMessage}
                >
                  {msgCopied
                    ? "متن سفارش کپی شد ✓"
                    : "کپی متن کامل سفارش"}
                </NeonButton>

                <div className="mt-4 flex flex-col gap-3 sm:flex-row">

                  {/* Telegram */}
                  <button
                    type="button"
                    onClick={shareReceipt}
                    className={`${neonButtonClass(
                      "outline",
                      "xl",
                      "w-full flex-1 border-transparent bg-neon-blue text-background hover:bg-neon-blue/90 hover:text-background",
                    )}`}
                  >
                    ارسال رسید در تلگرام
                  </button>

                  {/* WhatsApp */}
                  <button
                    type="button"
                    onClick={sendWhatsApp}
                    className={`${neonButtonClass(
                      "outline",
                      "xl",
                      "w-full flex-1 border-transparent bg-neon-green text-background hover:bg-neon-green/90 hover:text-background",
                    )}`}
                  >
                    ارسال رسید در واتساپ
                  </button>
                </div>

                <p className="mt-4 rounded-2xl border border-border bg-background/50 p-4 text-xs leading-7 text-muted-foreground">
                  بعد از انتخاب رسید، با زدن یکی از دکمه‌ها، عکس رسید همراه اطلاعات سفارش برای اشتراک‌گذاری آماده می‌شود.
                </p>

                {submitted ? (
                  <p
                    role="status"
                    className="mt-5 rounded-2xl border border-neon-blue/50 bg-background/60 p-4 text-sm leading-8"
                  >
                    رسید شما برای ارسال آماده شد. پرداخت شما به‌صورت دستی بررسی و تأیید خواهد شد.
                  </p>
                ) : null}
              </div>
            </>
          ) : null}
        </div>

        {/* Order Summary */}
        <aside className="h-fit space-y-4 rounded-3xl border border-border bg-card
