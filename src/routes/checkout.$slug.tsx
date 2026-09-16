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

    if (!product) {
      throw notFound();
    }

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

    return {
      meta: [
        {
          title: `پرداخت ${loaderData.product.name} | VAICH`,
        },
        {
          name: "description",
          content: `پرداخت اشتراک ${loaderData.product.name} در VAICH`,
        },
      ],
    };
  },

  component: CheckoutPage,
});

function CheckoutPage() {
  const { product } = Route.useLoaderData();

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: "",
    phone: "",
    email: "",
    note: "",
  });

  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileError, setFileError] = useState<string | null>(null);
  const [attempted, setAttempted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [msgCopied, setMsgCopied] = useState(false);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const receiptSectionRef = useRef<HTMLDivElement>(null);

  const orderMessage = buildOrderMessage(product, customer);

  const nameError =
    attempted && customer.fullName.trim().length === 0
      ? "نام و نام خانوادگی خود را وارد کنید"
      : null;

  const phoneError =
    attempted && customer.phone.trim().length === 0
      ? "شماره تماس خود را وارد کنید"
      : null;

  const emailError =
    attempted && customer.email.trim().length === 0
      ? "ایمیل خود را وارد کنید"
      : null;

  const receiptError =
    attempted && !receiptFile
      ? "تصویر رسید را انتخاب کنید"
      : null;

  const isReady =
    customer.fullName.trim().length > 0 &&
    customer.phone.trim().length > 0 &&
    customer.email.trim().length > 0 &&
    Boolean(receiptFile);

  const setField =
    (key: keyof CustomerInfo) =>
    (value: string) => {
      setCustomer((current) => ({
        ...current,
        [key]: value,
      }));
    };

  const vibrate = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate(200);
    }
  };

  const goToField = (
    element: HTMLElement | null,
  ) => {
    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setTimeout(() => {
      element.focus();
    }, 350);
  };

  const validateBeforeSend = () => {
    setAttempted(true);
    setSubmitted(false);

    if (customer.fullName.trim().length === 0) {
      vibrate();
      goToField(nameRef.current);
      return false;
    }

    if (customer.phone.trim().length === 0) {
      vibrate();
      goToField(phoneRef.current);
      return false;
    }

    if (customer.email.trim().length === 0) {
      vibrate();
      goToField(emailRef.current);
      return false;
    }

    if (!receiptFile) {
      vibrate();

      receiptSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });

      return false;
    }

    return true;
  };

  const copyCard = async () => {
    try {
      await navigator.clipboard.writeText(CARD_NUMBER);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch {
      setCopied(false);
    }
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(orderMessage);
      setMsgCopied(true);

      setTimeout(() => {
        setMsgCopied(false);
      }, 2500);
    } catch {
      setMsgCopied(false);
    }
  };

  const onPick = (file: File | undefined) => {
    if (!file) return;

    if (!/^image\/(jpeg|jpg|png)$/i.test(file.type)) {
      setFileError(
        "فقط تصویر با فرمت JPG، JPEG یا PNG قابل انتخاب است.",
      );
      setReceiptFile(null);
      return;
    }

    setFileError(null);
    setFileName(file.name);
    setReceiptFile(file);
    setSubmitted(false);

    setPreview((old) => {
      if (old) {
        URL.revokeObjectURL(old);
      }

      return URL.createObjectURL(file);
    });
  };

  const shareReceipt = async (
    platform: "telegram" | "whatsapp",
  ) => {
    if (!validateBeforeSend()) {
      return;
    }

    setSubmitted(true);

    const message = encodeURIComponent(orderMessage);

    if (platform === "telegram") {
      window.open(
        `${CONTACT_TELEGRAM_URL}?text=${message}`,
        "_blank",
        "noopener,noreferrer",
      );
    } else {
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

              <button
                type="button"
                onClick={copyCard}
                className={`${neonButtonClass(
                  "outline",
                  "md",
                  "mt-4 w-full",
                )}`}
              >
                {copied
                  ? "شماره کارت کپی شد ✓"
                  : "کپی شماره کارت"}
              </button>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">
                    به نام
                  </p>
                  <p className="mt-1 font-bold">
                    {CARD_HOLDER}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">
                    مبلغ
                  </p>
                  <p className="mt-1 font-bold">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Customer */}
          <div className="rounded-3xl border border-border bg-card/70 p-6">
            <h2 className="mb-4 text-base font-bold">
              ۳. اطلاعات خریدار
            </h2>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="mb-2 block text-sm font-medium"
                >
                  نام و نام خانوادگی
                </label>

                <input
                  ref={nameRef}
                  id="fullName"
                  type="text"
                  value={customer.fullName}
                  onChange={(event) =>
                    setField("fullName")(event.target.value)
                  }
                  placeholder="نام و نام خانوادگی"
                  className={`w-full rounded-2xl border bg-background/60 px-4 py-3 outline-none transition ${
                    nameError
                      ? "border-red-500 focus:border-red-500"
                      : "border-border focus:border-neon-blue"
                  }`}
                />

                {nameError ? (
                  <p className="mt-2 text-xs text-red-500">
                    {nameError}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium"
                >
                  شماره تماس
                </label>

                <input
                  ref={phoneRef}
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  value={customer.phone}
                  onChange={(event) =>
                    setField("phone")(event.target.value)
                  }
                  placeholder="مثلاً ۰۹۱۲۱۲۳۴۵۶۷"
                  dir="ltr"
                  className={`w-full rounded-2xl border bg-background/60 px-4 py-3 text-right outline-none transition ${
                    phoneError
                      ? "border-red-500 focus:border-red-500"
                      : "border-border focus:border-neon-blue"
                  }`}
                />

                {phoneError ? (
                  <p className="mt-2 text-xs text-red-500">
                    {phoneError}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  ایمیل
                </label>

                <input
                  ref={emailRef}
                  id="email"
                  type="email"
                  value={customer.email}
                  onChange={(event) =>
                    setField("email")(event.target.value)
                  }
                  placeholder="example@email.com"
                  dir="ltr"
                  className={`w-full rounded-2xl border bg-background/60 px-4 py-3 outline-none transition ${
                    emailError
                      ? "border-red-500 focus:border-red-500"
                      : "border-border focus:border-neon-blue"
                  }`}
                />

                {emailError ? (
                  <p className="mt-2 text-xs text-red-500">
                    {emailError}
                  </p>
                ) : null}
              </div>

              <div>
                <label
                  htmlFor="note"
                  className="mb-2 block text-sm font-medium"
                >
                  توضیحات (اختیاری)
                </label>

                <textarea
                  id="note"
                  value={customer.note}
                  onChange={(event) =>
                    setField("note")(event.target.value)
                  }
                  placeholder="اگر توضیحی دارید اینجا بنویسید..."
                  rows={4}
                  className="w-full resize-none rounded-2xl border border-border bg-background/60 px-4 py-3 outline-none transition focus:border-neon-blue"
                />
              </div>
            </div>
          </div>

          {/* Receipt */}
          <div
            ref={receiptSectionRef}
            className="rounded-3xl border border-border bg-card/70 p-6"
          >
            <h2 className="mb-2 text-base font-bold">
              ۴. بارگذاری رسید پرداخت
            </h2>

            <p className="mb-4 text-xs leading-7 text-muted-foreground">
              تصویر رسید کارت‌به‌کارت خود را انتخاب کنید.
            </p>

            <label
              htmlFor="receipt"
              className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
                receiptError || fileError
                  ? "border-red-500"
                  : "border-border hover:border-neon-blue"
              }`}
            >
              <span className="text-sm font-bold">
                انتخاب تصویر رسید
              </span>

              <span className="mt-2 text-xs text-muted-foreground">
                JPG، JPEG یا PNG
              </span>

              <input
                id="receipt"
                type="file"
                accept="image/jpeg,image/jpg,image/png"
                className="hidden"
                onChange={(event) =>
                  onPick(event.target.files?.[0])
                }
              />
            </label>

            {fileError ? (
              <p className="mt-2 text-xs text-red-500">
                {fileError}
              </p>
            ) : null}

            {receiptError ? (
              <p className="mt-2 text-xs text-red-500">
                {receiptError}
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
              اطلاعات سفارش به‌صورت خودکار از روی محصول انتخابی ساخته می‌شود.
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

            {!isReady ? (
              <p className="mt-4 rounded-2xl border border-border bg-background/50 p-4 text-xs leading-7 text-muted-foreground">
                نام، شماره تماس، ایمیل و تصویر رسید را وارد کنید.
              </p>
            ) : null}

            {submitted ? (
              <p className="mt-4 rounded-2xl border border-neon-green/30 bg-neon-green/10 p-4 text-xs leading-7 text-neon-green">
                اطلاعات سفارش آماده ارسال شد.
              </p>
            ) : null}

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              {/* Telegram */}
              <button
                type="button"
                onClick={() =>
                  void shareReceipt("telegram")
                }
                className={`${neonButtonClass(
                  "outline",
                  "xl",
                  "w-full flex-1 border-transparent bg-neon-blue text-background hover:bg-neon-blue/90 hover:text-background",
                )} ${
                  isReady ? "" : "opacity-50"
                }`}
              >
                ارسال رسید در تلگرام
              </button>

              {/* WhatsApp */}
              <button
                type="button"
                onClick={() =>
                  void shareReceipt("whatsapp")
                }
                className={`${neonButtonClass(
                  "outline",
                  "xl",
                  "w-full flex-1 border-transparent bg-neon-green text-background hover:bg-neon-green/90 hover:text-background",
                )} ${
                  isReady ? "" : "opacity-50"
                }`}
              >
                ارسال رسید در واتساپ
              </button>
            </div>

            <p className="mt-4 text-center text-xs leading-7 text-muted-foreground">
              با انتخاب هر گزینه، چت مستقیم پشتیبانی باز می‌شود و متن سفارش آماده ارسال خواهد بود.
            </p>
          </div>
        </div>

        {/* Summary */}
        <aside className="h-fit space-y-6 lg:sticky lg:top-24">
          <div className="rounded-3xl border border-border bg-card/70 p-6">
            <h2 className="mb-5 text-base font-bold">
              خلاصه سفارش
            </h2>

            <dl className="space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">
                  محصول
                </dt>

                <dd className="font-medium">
                  {product.name}
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

              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted-foreground">
                  به نام
                </dt>

                <dd className="font-medium">
                  {CARD_HOLDER}
                </dd>
              </div>
            </dl>

            <div className="mt-5 flex items-center justify-between gap-4 border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">
                مبلغ نهایی
              </span>

              <span className="gradient-text text-xl font-extrabold">
                {formatPrice(product.price)}
              </span>
            </div>
          </div>

          <NeonLink
            to="/support"
            variant="outline"
            className="w-full"
          >
            پشتیبانی
          </NeonLink>
        </aside>
    
