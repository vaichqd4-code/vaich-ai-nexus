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
        "لطفاً فقط تصویر با فرمت JPG، JPEG یا PNG انتخاب کنید.",
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
    if (!validateBeforeSend() || !receiptFile) {
      return;
    }

    setSubmitted(false);

    try {
      const formData = new FormData();
      formData.append("platform", platform);
      formData.append("message", orderMessage);
      formData.append("receipt", receiptFile);

      const response = await fetch("/api/send-receipt", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("ارسال رسید ناموفق بود");
      }

      setSubmitted(true);
    } catch {
      setSubmitted(false);
      vibrate();
      window.alert("ارسال رسید انجام نشد. دوباره تلاش کنید.");
    }
  };

  return (
    <Section
      className="aurora"
      title="پرداخت و ارسال رسید"
      subtitle={`تکمیل سفارش ${product.name}`}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-5">
          <div className="glass-panel rounded-3xl p-6">
            <div className="flex items-center gap-4">
              <ServiceIcon
                service={product.service}
                size="lg"
              />

              <div className="min-w-0">
                <p className="text-xs text-muted-foreground">
                  سرویس
                </p>

                <h1 className="truncate text-xl font-bold">
                  {product.name}
                </h1>

                <p className="mt-1 text-sm text-muted-foreground">
                  {product.duration}
                </p>
              </div>

              <div className="mr-auto text-left">
                <p className="text-xs text-muted-foreground">
                  مبلغ
                </p>

                <p className="text-lg font-bold text-neon-blue">
                  {formatPrice(product.price)}
                </p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6">
            <h2 className="text-lg font-bold">
              اطلاعات مشتری
            </h2>

            <div className="mt-5 space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="text-sm font-medium"
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
                  className={`${fieldClass} ${
                    nameError
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                  placeholder="نام و نام خانوادگی"
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
                  className="text-sm font-medium"
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
                  className={`${fieldClass} ${
                    phoneError
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                  placeholder="0912..."
                  dir="ltr"
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
                  className="text-sm font-medium"
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
                  className={`${fieldClass} ${
                    emailError
                      ? "border-red-500 focus:border-red-500"
                      : ""
                  }`}
                  placeholder="example@email.com"
                  dir="ltr"
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
                  className="text-sm font-medium"
                >
                  توضیحات
                  <span className="mr-1 text-xs text-muted-foreground">
                    (اختیاری)
                  </span>
                </label>

                <textarea
                  id="note"
                  value={customer.note}
                  onChange={(event) =>
                    setField("note")(event.target.value)
                  }
                  className={`${fieldClass} min-h-24 resize-y`}
                  placeholder="اگر توضیحی دارید بنویسید..."
                />
              </div>
            </div>
          </div>

          <div
            ref={receiptSectionRef}
            className="glass-panel rounded-3xl p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold">
                  تصویر رسید پرداخت
                </h2>

                <p className="mt-1 text-xs text-muted-foreground">
                  JPG، JPEG یا PNG
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowUpload((value) => !value)}
                className="text-sm text-neon-blue"
              >
                {showUpload ? "بستن" : "انتخاب تصویر"}
              </button>
            </div>

            {showUpload ? (
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => galleryRef.current?.click()}
                  className="rounded-2xl border border-border bg-background/50 p-4 text-sm transition-colors hover:border-neon-blue/60"
                >
                  انتخاب از گالری
                </button>

                <button
                  type="button"
                  onClick={() => cameraRef.current?.click()}
                  className="rounded-2xl border border-border bg-background/50 p-4 text-sm transition-colors hover:border-neon-blue/60"
                >
                  گرفتن عکس
                </button>

                <input
                  ref={galleryRef}
                  type="file"
                  accept={ACCEPTED}
                  className="hidden"
                  onChange={(event) => {
                    onPick(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />

                <input
                  ref={cameraRef}
                  type="file"
                  accept={ACCEPTED}
                  capture="environment"
                  className="hidden"
                  onChange={(event) => {
                    onPick(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </div>
            ) : null}

            {receiptError ? (
              <p className="mt-3 text-xs text-red-500">
                {receiptError}
              </p>
            ) : null}

            {fileError ? (
              <p className="mt-3 text-xs text-red-500">
                {fileError}
              </p>
            ) : null}

            {preview ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-border">
                <img
                  src={preview}
                  alt="پیش‌نمایش رسید پرداخت"
                  className="max-h-[420px] w-full object-contain"
                />

                {fileName ? (
                  <p className="border-t border-border p-3 text-xs text-muted-foreground">
                    {fileName}
                  </p>
                ) : null}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setShowUpload(true)}
                className={`mt-5 flex min-h-32 w-full items-center justify-center rounded-2xl border border-dashed p-5 text-sm text-muted-foreground transition-colors hover:border-neon-blue/60 ${
                  receiptError
                    ? "border-red-500"
                    : "border-border"
                }`}
              >
                برای انتخاب تصویر رسید اینجا بزنید
              </button>
            )}
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-3xl border border-border bg-card/70 p-6 lg:sticky lg:top-24">
          <h2 className="text-base font-bold">
            اطلاعات پرداخت
          </h2>

          <div className="rounded-2xl border border-border bg-background/50 p-4">
            <p className="text-xs text-muted-foreground">
              مبلغ قابل پرداخت
            </p>

            <p className="mt-2 text-2xl font-bold text-neon-blue">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background/50 p-4">
            <p className="text-xs text-muted-foreground">
              شماره کارت
            </p>

            <p
              className="mt-2 text-lg font-bold tracking-wider"
              dir="ltr"
            >
              {CARD_NUMBER_GROUPED}
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              به نام {CARD_HOLDER}
            </p>

            <NeonButton
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={copyCard}
            >
              {copied ? "شماره کارت کپی شد ✓" : "کپی شماره کارت"}
            </NeonButton>
          </div>

          <div className="rounded-2xl border border-border bg-background/50 p-4">
            <p className="text-xs text-muted-foreground">
              متن سفارش
            </p>

            <pre className="mt-3 whitespace-pre-wrap text-xs leading-6 text-muted-foreground">
              {orderMessage}
            </pre>

            <NeonButton
              variant="outline"
              size="sm"
              className="mt-4 w-full"
              onClick={copyMessage}
            >
              {msgCopied
                ? "متن سفارش کپی شد ✓"
                : "کپی متن کامل سفارش"}
            </NeonButton>
          </div>
                    {!isReady ? (
            <p className="mt-4 rounded-2xl border border-border bg-background/50 p-4 text-xs leading-7 text-muted-foreground">
              نام، شماره تماس، ایمیل و تصویر رسید را وارد کنید.
            </p>
          ) : null}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
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
                isReady
                  ? ""
                  : "opacity-50"
              }`}
            >
              ارسال رسید در واتساپ
            </button>
          </div>

          <p className="mt-4 rounded-2xl border border-border bg-background/50 p-4 text-xs leading-7 text-muted-foreground">
            با انتخاب دکمه ارسال، اطلاعات سفارش برای پشتیبانی آماده می‌شود.
            <span dir="ltr">
              {" "}@{CONTACT_TELEGRAM_ID}
            </span>
          </p>

          {submitted ? (
            <p
              role="status"
              className="mt-5 rounded-2xl border border-neon-blue/50 bg-background/60 p-4 text-sm leading-8"
            >
              اطلاعات سفارش با موفقیت ارسال شد.
            </p>
          ) : null}
        </aside>
      </div>
    </Section>
  );
}
