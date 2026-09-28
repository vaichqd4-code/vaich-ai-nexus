import { createFileRoute, notFound } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ServiceIcon } from "@/components/brand/ServiceIcon";
import { Section } from "@/components/layout/Section";
import {
  NeonButton,
  neonButtonClass,
} from "@/components/ui/NeonButton";
import { CONTACT_TELEGRAM_ID } from "@/components/brand/ContactLinks";
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

const fieldClass =
  "mt-2 w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-neon-blue/70";

function Checkout() {
  const { product } = Route.useLoaderData();

  const [copied, setCopied] = useState(false);
  const [msgCopied, setMsgCopied] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [shouldShakeFactor, setShouldShakeFactor] = useState(false);

  // پیام‌های اعلان بالای صفحه (Top Banner Notification)
  const [topNotification, setTopNotification] = useState<{
    visible: boolean;
    title: string;
    text: string;
    pulse?: boolean;
  }>({
    visible: false,
    title: "",
    text: "",
    pulse: false,
  });

  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: "",
    email: "",
    phone: "",
    note: "",
  });

  const paymentCardRef = useRef<HTMLDivElement>(null);
  const factorBoxRef = useRef<HTMLDivElement>(null);
  const bottomSectionRef = useRef<HTMLDivElement>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  // دو فلگ مجزا برای اینکه هر هشدار در زمان و اسکرول دقیق خودش فقط ۱ بار اجرا شود
  const hasTriggeredPaymentNotice = useRef(false);
  const hasTriggeredBottomNotice = useRef(false);

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

  const isReady =
    customer.fullName.trim().length > 0 &&
    customer.phone.trim().length > 0 &&
    customer.email.trim().length > 0;

  const setField =
    (key: keyof CustomerInfo) =>
    (value: string) => {
      setCustomer((current) => ({
        ...current,
        [key]: value,
      }));
    };

  const vibrate = (pattern: number | number[] = 200) => {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {}
    }
  };

  const showTopNotice = (title: string, text: string, duration = 6500, pulse = false) => {
    setTopNotification({
      visible: true,
      title,
      text,
      pulse,
    });

    if (duration > 0) {
      setTimeout(() => {
        setTopNotification((prev) => ({ ...prev, visible: false }));
      }, duration);
    }
  };

  const triggerFactorShake = () => {
    setShouldShakeFactor(true);
    vibrate([150, 100, 150]);
    setTimeout(() => {
      setShouldShakeFactor(false);
    }, 900);
  };

  // مدیریت هوشمند اسکرول‌ها برای هر دو رویداد
  useEffect(() => {
    const handleScroll = () => {
      // ۱. هشدار رسید پرداختی وقتی کاربر به کارت بانکی می‌رسد (همان هشدار پیش‌فرض قبلی)
      if (!hasTriggeredPaymentNotice.current && paymentCardRef.current) {
        const rectPayment = paymentCardRef.current.getBoundingClientRect();
        if (rectPayment.top <= window.innerHeight * 0.75) {
          hasTriggeredPaymentNotice.current = true;
          vibrate([150, 80, 150]);
          showTopNotice(
            "⚠️ توجه بسیار مهم پیش از پرداخت:",
            "حتماً تصویر رسید و فیش واریزی خود را تا پایان تحویل سفارش نزد خود نگه دارید.",
            7000
          );
        }
      }

      // ۲. وقتی کاربر اسکرول کرد و رسید به پایین صفحه (بخش ارسال به ربات)
      if (!hasTriggeredBottomNotice.current && bottomSectionRef.current) {
        const rectBottom = bottomSectionRef.current.getBoundingClientRect();
        if (rectBottom.top <= window.innerHeight * 0.85) {
          hasTriggeredBottomNotice.current = true;
          triggerFactorShake();
          showTopNotice(
            "📋 متن سفارش را کپی کنید!",
            "متن فاکتور سفارش را کپی کنید و در ربات ارسال کنید تا ربات سفارش شما را پردازش کند.",
            8000,
            true
          );
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const goToField = (element: HTMLElement | null) => {
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
      vibrate(200);
      goToField(nameRef.current);
      return false;
    }

    if (customer.phone.trim().length === 0) {
      vibrate(200);
      goToField(phoneRef.current);
      return false;
    }

    if (customer.email.trim().length === 0) {
      vibrate(200);
      goToField(emailRef.current);
      return false;
    }

    return true;
  };

  const copyCard = async () => {
    try {
      await navigator.clipboard.writeText(CARD_NUMBER);
      setCopied(true);
      vibrate(100);
      showTopNotice(
        "💳 شماره کارت کپی شد",
        "مبلغ دقیق را واریز فرمایید و حتماً از تصویر رسید پرداختی اسکرین‌شات یا عکس بگیرید.",
        6000
      );
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  const copyMessage = async () => {
    try {
      await navigator.clipboard.writeText(orderMessage);
      setMsgCopied(true);
      vibrate(100);
      showTopNotice(
        "📋 متن فاکتور کپی شد!",
        "پس از باز شدن ربات، دکمه Start را بزنید و سپس این متن را در چت Paste و ارسال کنید.",
        8000,
        true
      );
      setTimeout(() => setMsgCopied(false), 2500);
    } catch {
      setMsgCopied(false);
    }
  };

  return (
    <>
      <style>{`
        @keyframes customShake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px) rotate(-1deg); }
          30% { transform: translateX(8px) rotate(1deg); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
        .factor-shake-active {
          animation: customShake 0.75s ease-in-out !important;
          border-color: #a855f7 !important;
          box-shadow: 0 0 25px rgba(168, 85, 247, 0.45) !important;
        }
      `}</style>

      {/* پیام اعلان شناور بالای صفحه */}
      <div
        className={`fixed left-0 right-0 top-0 z-[9999] transition-all duration-500 ease-out px-4 py-3 ${
          topNotification.visible
            ? "translate-y-0 opacity-100"
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`mx-auto max-w-2xl rounded-2xl border-2 border-red-500 bg-red-600/95 text-white shadow-2xl backdrop-blur-md px-5 py-4 flex items-center justify-between gap-4 ${
            topNotification.pulse ? "animate-pulse ring-4 ring-red-400/40" : ""
          }`}
          dir="rtl"
        >
          <div className="flex items-start gap-3 min-w-0">
            <span className="text-2xl mt-0.5">📢</span>
            <div>
              <p className="text-sm font-black text-white">{topNotification.title}</p>
              <p className="mt-1 text-xs md:text-sm font-medium leading-6 text-red-50">
                {topNotification.text}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setTopNotification((p) => ({ ...p, visible: false }))}
            className="rounded-xl bg-black/20 hover:bg-black/40 px-3 py-1.5 text-xs font-bold text-white transition-colors"
          >
            متوجه شدم
          </button>
        </div>
      </div>

      <Section
        className="aurora"
        title="پرداخت و ارسال رسید"
        subtitle={`تکمیل سفارش ${product.name}`}
      >
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-5">
            <div className="glass-panel rounded-3xl p-6">
              <div className="flex items-center gap-4">
                <ServiceIcon slug={product.slug} />

                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">سرویس</p>
                  <h1 className="truncate text-xl font-bold">{product.name}</h1>
                  <p className="mt-1 text-sm text-muted-foreground">{product.duration}</p>
                </div>

                <div className="mr-auto text-left">
                  <p className="text-xs text-muted-foreground">مبلغ</p>
                  <p className="text-lg font-bold text-neon-blue">{formatPrice(product.price)}</p>
                </div>
              </div>
            </div>

            {/* اطلاعات مشتری */}
            <div className="glass-panel rounded-3xl p-6">
              <h2 className="text-lg font-bold">اطلاعات مشتری</h2>

              <div className="mt-5 space-y-4">
                <div>
                  <label htmlFor="fullName" className="text-sm font-medium">
                    نام و نام خانوادگی
                  </label>
                  <input
                    ref={nameRef}
                    id="fullName"
                    type="text"
                    value={customer.fullName}
                    onChange={(e) => setField("fullName")(e.target.value)}
                    className={`${fieldClass} ${nameError ? "border-red-500 focus:border-red-500" : ""}`}
                    placeholder="نام و نام خانوادگی"
                  />
                  {nameError ? <p className="mt-2 text-xs text-red-500">{nameError}</p> : null}
                </div>

                <div>
                  <label htmlFor="phone" className="text-sm font-medium">
                    شماره تماس
                  </label>
                  <input
                    ref={phoneRef}
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    value={customer.phone}
                    onChange={(e) => setField("phone")(e.target.value)}
                    className={`${fieldClass} ${phoneError ? "border-red-500 focus:border-red-500" : ""}`}
                    placeholder="0912..."
                    dir="ltr"
                  />
                  {phoneError ? <p className="mt-2 text-xs text-red-500">{phoneError}</p> : null}
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-medium">
                    ایمیل
                  </label>
                  <input
                    ref={emailRef}
                    id="email"
                    type="email"
                    value={customer.email}
                    onChange={(e) => setField("email")(e.target.value)}
                    className={`${fieldClass} ${emailError ? "border-red-500 focus:border-red-500" : ""}`}
                    placeholder="example@email.com"
                    dir="ltr"
                  />
                  {emailError ? <p className="mt-2 text-xs text-red-500">{emailError}</p> : null}
                </div>

                <div>
                  <label htmlFor="note" className="text-sm font-medium">
                    توضیحات <span className="mr-1 text-xs text-muted-foreground">(اختیاری)</span>
                  </label>
                  <textarea
                    id="note"
                    value={customer.note}
                    onChange={(e) => setField("note")(e.target.value)}
                    className={`${fieldClass} min-h-24 resize-y`}
                    placeholder="اگر توضیحی دارید بنویسید..."
                  />
                </div>
              </div>
            </div>

            {/* اطلاعات پرداخت و شماره کارت */}
            <aside ref={paymentCardRef} className="h-fit space-y-4 rounded-3xl border border-border bg-card/70 p-6">
              <h2 className="text-base font-bold">اطلاعات پرداخت</h2>

              <div className="rounded-2xl border border-border bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">مبلغ قابل پرداخت</p>
                <p className="mt-2 text-2xl font-bold text-neon-blue">{formatPrice(product.price)}</p>
              </div>

              <div className="rounded-2xl border border-border bg-background/50 p-4">
                <p className="text-xs text-muted-foreground">شماره کارت</p>
                <p className="mt-2 text-lg font-bold tracking-wider" dir="ltr">
                  {CARD_NUMBER_GROUPED}
                </p>
                <p className="mt-2 text-sm text-muted-foreground">به نام {CARD_HOLDER}</p>
                <NeonButton variant="outline" size="sm" className="mt-4 w-full" onClick={copyCard}>
                  {copied ? "شماره کارت کپی شد ✓" : "کپی شماره کارت"}
                </NeonButton>
              </div>

              {/* کادر فاکتور با قابلیت لرزش انیمیشنی هوشمند هنگام رسیدن کاربر به پایین */}
              <div
                ref={factorBoxRef}
                className={`rounded-2xl border border-border bg-background/50 p-4 transition-all duration-300 ${
                  shouldShakeFactor ? "factor-shake-active" : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-foreground">متن فاکتور سفارش</p>
                  {shouldShakeFactor && (
                    <span className="text-[11px] font-bold text-purple-400 animate-bounce">
                      👇 لطفاً ابتدا کپی کنید
                    </span>
                  )}
                </div>

                <pre className="mt-3 whitespace-pre-wrap text-xs leading-6 text-muted-foreground">
                  {orderMessage}
                </pre>

                <NeonButton
                  variant="outline"
                  size="sm"
                  className={`mt-4 w-full transition-all duration-300 ${
                    shouldShakeFactor ? "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)]" : ""
                  }`}
                  onClick={copyMessage}
                >
                  {msgCopied ? "متن سفارش کپی شد ✓" : "کپی متن کامل سفارش"}
                </NeonButton>
              </div>
            </aside>

            {/* بخش ارسال در ربات تلگرام */}
            <div ref={bottomSectionRef} className="glass-panel rounded-3xl p-6">
              <h2 className="text-lg font-bold">اتمام سفارش و ارسال به ربات</h2>

              <p className="mt-2 text-sm text-muted-foreground">
                پس از واریز مبلغ، دکمه زیر را بزنید تا متن سفارش کپی شود و مستقیم به ربات متصل شوید.
              </p>

              {!isReady ? (
                <p className="mt-4 rounded-2xl border border-border bg-background/50 p-4 text-xs leading-7 text-muted-foreground">
                  ابتدا نام، شماره تماس و ایمیل خود را در فرم بالا تکمیل کنید.
                </p>
              ) : null}

              <div className="mt-4">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={async () => {
                    if (!validateBeforeSend()) return;
                    if (isSubmitting) return;

                    // اگر هنوز دکمه کپی فاکتور را نزده، اول کادر فاکتور می‌لرزد
                    if (!msgCopied) {
                      triggerFactorShake();
                    }

                    setIsSubmitting(true);
                    try {
                      vibrate([120, 60, 220]);

                      // ۱. تضمین کپی متن فاکتور در کلیپ‌بورد گوشی کاربر
                      try {
                        await navigator.clipboard.writeText(orderMessage);
                      } catch {}

                      // ۲. پیام راهنمای تلگرام
                      showTopNotice(
                        "📋 متن فاکتور کپی شد!",
                        "در ربات تلگرام ابتدا دکمه Start را بزنید، سپس متن فاکتور را Paste کرده و بفرستید. در پایان عکس فیش را ارسال کنید.",
                        10000,
                        true
                      );

                      // ۳. ثبت سفارش در دیتابیس
                      await fetch("/api/create-order", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          customerName: customer.fullName,
                          customerPhone: customer.phone,
                          customerEmail: customer.email,
                          notes: customer.note,
                          orderMessage,
                          product: {
                            slug: product.slug,
                            name: product.name,
                            price: product.price,
                          },
                        }),
                      });

                      setSubmitted(true);

                      // ۴. باز شدن ربات تلگرام
                      setTimeout(() => {
                        window.location.href = "https://t.me/vaich_new_receipt_bot";
                      }, 1800);
                    } catch (err) {
                      console.error("Order redirect error:", err);
                      window.location.href = "https://t.me/vaich_new_receipt_bot";
                    } finally {
                      setIsSubmitting(false);
                    }
                  }}
                  className={`${neonButtonClass(
                    "outline",
                    "xl",
                    "w-full border-transparent bg-purple-600 text-white hover:bg-purple-700 hover:text-white font-black",
                  )} ${isReady && !isSubmitting ? "" : "opacity-50"}`}
                >
                  {isSubmitting ? "در حال آماده‌سازی و انتقال..." : "🤖 ارسال رسید در ربات"}
                </button>
              </div>

              <p className="mt-4 rounded-2xl border border-border bg-background/50 p-4 text-xs leading-7 text-muted-foreground">
                با انتخاب این دکمه، متن سفارش کپی شده و ربات تلگرام VAICH برای شما باز خواهد شد.
                <span dir="ltr"> @{CONTACT_TELEGRAM_ID}</span>
              </p>

              {submitted ? (
                <p
                  role="status"
                  className="mt-5 rounded-2xl border border-neon-blue/50 bg-background/60 p-4 text-sm leading-8
