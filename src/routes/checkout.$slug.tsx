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

function Checkout() {
  const { product } = Route.useLoaderData();

  const [copied, setCopied] = useState(false);
  const [msgCopied, setMsgCopied] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const [preview, setPreview] = useState<string | null>(null);
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [attempted, setAttempted] = useState(false);

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: "",
    email: "",
    phone: "",
    note: "",
  });

  const galleryRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

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

  const shareReceipt = async (platform: "telegram" | "whatsapp") => {
  if (!validateBeforeSend()) {
    return;
  }

  setSubmitted(true);

  const message = encodeURIComponent(orderMessage);

  if (platform === "telegram") {
    window.location.href = `https://t.me/youneshayati?text=${message}`;
  } else {
    window.location.href = `https://wa.me/989193872172?text=${message}`;
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
                  {/* Name */}
                  <label className="block text-sm">
                    <span className="text-muted-foreground">
                      نام و نام خانوادگی *
                    </span>

                    <input
                      ref={nameRef}
                      className={`${fieldClass} ${
                        nameError
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                      value={customer.fullName}
                      onChange={(e) =>
                        setField("fullName")(e.target.value)
                      }
                      placeholder="مثلاً علی رضایی"
                    />

                    {nameError ? (
                      <p
                        role="alert"
                        className="mt-2 text-xs text-red-500"
                      >
                        {nameError}
                      </p>
                    ) : null}
                  </label>

                  {/* Phone */}
                  <label className="block text-sm">
                    <span className="text-muted-foreground">
                      شماره تماس *
                    </span>

                    <input
                      ref={phoneRef}
                      className={`${fieldClass} ${
                        phoneError
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                      dir="ltr"
                      inputMode="tel"
                      value={customer.phone}
                      onChange={(e) =>
                        setField("phone")(e.target.value)
                      }
                      placeholder="09xxxxxxxxx"
                    />

                    {phoneError ? (
                      <p
                        role="alert"
                        className="mt-2 text-xs text-red-500"
                      >
                        {phoneError}
                      </p>
                    ) : null}
                  </label>

                  {/* Email */}
                  <label className="block text-sm sm:col-span-2">
                    <span className="text-muted-foreground">
                      ایمیل *
                    </span>

                    <input
                      ref={emailRef}
                      className={`${fieldClass} ${
                        emailError
                          ? "border-red-500 focus:border-red-500"
                          : ""
                      }`}
                      dir="ltr"
                      inputMode="email"
                      value={customer.email}
                      onChange={(e) =>
                        setField("email")(e.target.value)
                      }
                      placeholder="you@example.com"
                    />

                    {emailError ? (
                      <p
                        role="alert"
                        className="mt-2 text-xs text-red-500"
                      >
                        {emailError}
                      </p>
                    ) : null}
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
              <div
                ref={receiptSectionRef}
                className="rounded-3xl border border-border bg-card/70 p-6"
              >
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
                    className="mt-4 rounded-2xl border border-red-500/50 bg-background/60 p-4 text-sm text-red-500"
                  >
                    {fileError}
                  </p>
                ) : null}

                {receiptError ? (
                  <p
                    role="alert"
                    className="mt-4 rounded-2xl border border-red-500/50 bg-background/60 p-4 text-sm text-red-500"
                  >
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
                      isReady
                        ? ""
                        : "opacity-50"
                    }`}
                  >
                    
                    ارسال رسید در تلگرام
                  </button>

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

                <p className="mt-4 rounded-2xl border border-border bg-background/50 p-4 text-xs leading-7 text-muted-foreground">
                  با انتخاب دکمه ارسال، اطلاعات سفارش و تصویر رسید برای اشتراک‌گذاری آماده می‌شود.
                  <span dir="ltr">
                    {" "}@{CONTACT_TELEGRAM_ID}
                  </span>
                </p>

                {submitted ? (
                  <p
                    role="status"
                    className="mt-5 rounded-2xl border border-neon-blue/50 bg-background/60 p-4 text-sm leading-8"
                  >
                    اطلاعات سفارش آماده ارسال شد.
                  </p>
                ) : null}
              </div>
            </>
          ) : null}
        </div>

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
