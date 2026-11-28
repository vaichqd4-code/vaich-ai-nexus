import { ProductRichContent } from "@/components/product/ProductRichContent";
import { ProductCard } from "@/components/product/ProductCard";
import { createFileRoute, notFound, Link, redirect } from "@tanstack/react-router";
import { useEffect, useMemo, useState, lazy, Suspense } from "react";

const FullscreenGalleryModal = lazy(() =>
  import("@/components/product/FullscreenGalleryModal").then((m) => ({
    default: m.FullscreenGalleryModal,
  }))
);
import { ServiceIcon } from "@/components/brand/ServiceIcon";
import { Section } from "@/components/layout/Section";
import { NeonLink } from "@/components/ui/NeonButton";
import {
  formatPrice,
  formatPriceNumber,
  formatRtlSafeTitle,
  toPersianDigits,
  getProduct,
  isProductLifetime,
  getProductPricingSummary,
  getVariantOriginalPrice,
  useDynamicProducts,
  type Product,
  type ProductReview,
  type ProductVariant,
} from "@/lib/products";
import { cn } from "@/lib/utils";
import {
  Star,
  MessageSquarePlus,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ChevronDown,
  Info,
  ArrowLeft,
  ShieldCheck,
  Maximize2,
  Images,
} from "lucide-react";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ params }) => {
    const raw = (params.slug || "").toLowerCase();
    let decoded = "";
    try {
      decoded = decodeURIComponent(params.slug || "").trim().toLowerCase();
    } catch {
      decoded = raw;
    }
    if (
      decoded === "اشتراک chatgpt plus شخصی" ||
      decoded === "اشتراک-chatgpt-plus-شخصی" ||
      raw.includes("chatgpt plus شخصی") ||
      raw.includes("chatgptplus")
    ) {
      throw redirect({ to: "/products/chatgpt-plus", statusCode: 301 });
    }
    if (raw === "planners" || raw === "planner" || raw.includes("پلنر")) {
      throw redirect({ to: "/" });
    }
    let product = getProduct(params.slug);
    if (!product && typeof window !== "undefined") {
      try {
        const res = await fetch("/site-config.json");
        if (res.ok) {
          const config = await res.json();
          product = config.products?.find((p: any) => p.slug === params.slug);
        }
      } catch {
        // network error fallback
      }
    }
    if (!product) throw notFound();

    // 301 redirect if requested slug does not match canonical slug
    if (product.slug !== params.slug) {
      throw redirect({ to: `/products/${product.slug}`, statusCode: 301 });
    }

    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "محصول یافت نشد | VAICH" }, { name: "robots", content: "noindex" }] };
    }
    const { product } = loaderData;
    const isLifetime = isProductLifetime(product);
    const isPlanner = product.slug.includes("planner");

    let title: string;
    let description: string;
    let keywords: string;

    if (product.slug === "telegram-premium") {
      title = "خرید اشتراک تلگرام پرمیوم (۱ تا ۱۲ ماهه) | گیفت رسمی بدون رمز | VAICH";
      description =
        "خرید قانونی و فوری اشتراک تلگرام پرمیوم (Telegram Premium) ۱، ۳، ۶ و ۱۲ ماهه از طریق گیفت رسمی تلگرام صرفاً با آیدی (@Username) بدون نیاز به رمز عبور و با ضمانت کامل در فروشگاه وایچ.";
      keywords =
        "خرید تلگرام پرمیوم, خرید اشتراک تلگرام پرمیوم, تلگرام پرمیوم گیفتی, خرید Telegram Premium بدون رمز, قیمت تلگرام پرمیوم, تلگرام پرمیوم ۱ ماهه, تلگرام پرمیوم ۳ ماهه, تلگرام پرمیوم ۶ ماهه, تلگرام پرمیوم یک ساله, وایچ";
    } else if (product.slug === "telegram-stars") {
      title = "خرید استارز تلگرام (Telegram Stars) | شارژ فوری با آیدی | VAICH";
      description =
        "خرید و شارژ مستقیم و فوری استارز تلگرام (۱۰۰ تا ۱۰,۰۰۰ استارز) بدون نیاز به رمز عبور و کارت بانکی خارجی؛ مناسب خرید گیفت‌های کلکسیونی تلگرام، ربات‌ها و مینی‌اپ‌ها در وایچ.";
      keywords =
        "خرید استارز تلگرام, قیمت استارز تلگرام, خرید Telegram Stars, شارژ فوری استارز تلگرام, خرید گیفت تلگرام, خرید ۱۰۰ استارز, خرید ۵۰۰ استارز, خرید ۱۰۰۰ استارز تلگرام, وایچ";
    } else if (product.slug === "canva-pro") {
      title = "خرید اشتراک کانوا پرو (Canva Pro) روی ایمیل شخصی | تحویل فوری | VAICH";
      description =
        "خرید اشتراک قانونی کانوا پرو (Canva Pro) ۱ تا ۶ ماهه با دعوت تیمی رسمی روی ایمیل شخصی شما، دسترسی کامل به Magic Studio، حذف پس‌زمینه، کیت برند و فونت فارسی در فروشگاه وایچ.";
      keywords =
        "خرید کانوا پرو, خرید اشتراک Canva Pro, اکانت کانوا پرو قانونی, قیمت کانوا پرو, کانوا پرو روی ایمیل شخصی, کانوا پرو فمیلی, ابزار هوش مصنوعی کانوا, وایچ";
    } else if (product.slug === "vaich-study-planner") {
      title = "خرید پلنر تحصیلی وایچ | باغچه رشد مطالعه و برنامه‌ریزی هوشمند | VAICH";
      description =
        "خرید پلنر تحصیلی وایچ (نسخه جامع و همه‌کاره مبتنی بر گوگل‌شیت)؛ مجهز به باغچه رشد مطالعه، جدول ۲۰ عادت ۳۱ روزه، بودجه‌بندی دروس، کارنامه تحلیل آزمون و فایل صوتی راهنما با دسترسی دائمی.";
      keywords =
        "پلنر تحصیلی وایچ, خرید پلنر تحصیلی دیجیتال, پلنر مطالعاتی گوگل شیت, باغچه رشد مطالعه, پلنر کنکور و دانشگاه, جدول برنامه ریزی مطالعه, وایچ";
    } else if (isLifetime) {
      title = isPlanner
        ? `خرید ${product.name} | پلنر برنامه ریزی هوشمند گوگل شیت | VAICH`
        : `خرید ${product.name} | دسترسی دائمی بدون اشتراک | VAICH`;
      description = isPlanner
        ? `خرید آنلاین ${product.name} در گوگل شیت با ردیاب عادات ماهانه، نمودارهای تحلیلی، نسخه‌های دوبعدی و سه‌بعدی و تحویل آنی بدون نیاز به اشتراک ماهانه.`
        : `خرید آنلاین و دسترسی دائمی ${product.name} با تحویل فوری، گارانتی اصالت فایل‌ها و بدون نیاز به تمدید ماهانه در وایچ.`;
      keywords = `خرید ${product.name}, پلنر دیجیتال, پلنر گوگل شیت, ردیاب عادات فارسی, وایچ`;
    } else {
      title = `خرید اشتراک ${product.name} (${product.duration || "قانونی"}) | VAICH`;
      description = `خرید آنلاین و قانونی اشتراک ${product.name} با تحویل سریع، ضمانت فعال‌سازی قانونی و پشتیبانی تخصصی راه‌اندازی در فروشگاه وایچ.`;
      keywords = `خرید ${product.name}, خرید اشتراک ${product.name}, قیمت ${product.name}, اشتراک هوش مصنوعی, وایچ`;
    }

    const canonicalUrl = `https://vaich.ir/products/${product.slug}`;

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "صفحه اصلی",
          item: "https://vaich.ir",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "محصولات و خدمات",
          item: "https://vaich.ir/products",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: product.name,
          item: canonicalUrl,
        },
      ],
    };

    const ogImg = product.iconUrl
      ? (product.iconUrl.startsWith("http") ? product.iconUrl : `https://vaich.ir${product.iconUrl.split("?")[0]}`)
      : "https://vaich.ir/vaich-logo.png";

    const pricing = getProductPricingSummary(product);
    const brandName = product.slug.includes("chatgpt")
      ? "OpenAI"
      : product.slug.includes("claude")
        ? "Anthropic"
        : product.slug.includes("gemini")
          ? "Google"
          : product.slug.includes("telegram")
            ? "Telegram"
            : product.slug.includes("canva")
              ? "Canva"
              : "VAICH";

    const approvedReviews = Array.isArray(product.reviews)
      ? product.reviews.filter((r) => r.status !== "pending")
      : [];
    const schemaReviewCount = Math.max(product.reviewCount || 0, approvedReviews.length);

    const productLd: Record<string, any> = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.name,
      description,
      image: ogImg,
      sku: product.slug,
      brand: { "@type": "Brand", name: brandName },
      offers: pricing.isRange
        ? {
            "@type": "AggregateOffer",
            url: canonicalUrl,
            priceCurrency: "IRR",
            lowPrice: String(Math.round(pricing.minPrice * 10)),
            highPrice: String(Math.round(pricing.maxPrice * 10)),
            offerCount: String(pricing.activeVariantsCount || product.variants?.length || 1),
            validFrom: product.slug === "vaich-study-planner" ? "2026-11-27T00:00:00+03:30" : "2026-01-01T00:00:00+03:30",
            priceValidUntil: "2027-12-31",
            availability: pricing.isOutOfStock
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",
          }
        : {
            "@type": "Offer",
            url: canonicalUrl,
            priceCurrency: "IRR",
            price: String(Math.round(pricing.minPrice * 10)),
            validFrom: product.slug === "vaich-study-planner" ? "2026-11-27T00:00:00+03:30" : "2026-01-01T00:00:00+03:30",
            priceValidUntil: "2027-12-31",
            availability: pricing.isOutOfStock
              ? "https://schema.org/OutOfStock"
              : "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
          },
    };

    if (schemaReviewCount > 0) {
      productLd.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: String(product.rating || 5),
        reviewCount: String(schemaReviewCount),
        ratingCount: String(schemaReviewCount),
        bestRating: "5",
        worstRating: "1",
      };
    }

    if (approvedReviews.length > 0) {
      productLd.review = approvedReviews.slice(0, 5).map((r) => ({
        "@type": "Review",
        author: {
          "@type": "Person",
          name: r.author || "کاربر وایچ",
        },
        datePublished: (r.createdAt || "2026-11-28").split("T")[0],
        reviewBody: r.comment,
        reviewRating: {
          "@type": "Rating",
          ratingValue: String(r.rating || 5),
          bestRating: "5",
          worstRating: "1",
        },
      }));
    }

    const faqTab = product.customTabs?.find(
      (t) => t.title.includes("سوال") || t.title.includes("پرسش"),
    );
    const faqEntities = faqTab
      ? faqTab.content
          .split(/\n\s*\n/)
          .map((b) => b.trim().split("\n").map((l) => l.trim()).filter(Boolean))
          .filter((lines) => lines.length >= 2)
          .map((lines) => ({
            "@type": "Question",
            name: lines[0],
            acceptedAnswer: {
              "@type": "Answer",
              text: lines.slice(1).join(" "),
            },
          }))
      : [];

    const scripts: Array<{ type: string; children: string }> = [
      {
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbLd),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(productLd),
      },
    ];

    if (faqEntities.length > 0) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqEntities,
        }),
      });
    }

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { name: "keywords", content: keywords },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: canonicalUrl },
        { property: "og:type", content: "product" },
        { property: "og:image", content: ogImg },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: ogImg },
      ],
      links: [
        { rel: "canonical", href: canonicalUrl },
      ],
      scripts,
    };
  },
  component: ProductDetail,
});


function formatReviewDate(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr.split("T")[0];
    return new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(d);
  } catch {
    return dateStr.split("T")[0];
  }
}

function ProductDetail() {
  const { product: loaderProduct } = Route.useLoaderData();
  const { products: liveProducts } = useDynamicProducts();

  // همگام‌سازی زنده با آخرین نسخه کاتالوگ (پنل ادمین / کلاد)
  const product: Product = useMemo(() => {
    const matched = liveProducts.find((p) => p.slug === loaderProduct.slug);
    return matched || loaderProduct;
  }, [liveProducts, loaderProduct]);

  const variants: ProductVariant[] = product.variants || [];
  const hasVariants = variants.length > 0;

  const option1List = useMemo(() => {
    const set: string[] = [];
    for (const v of variants) {
      if (v.option1 && !set.includes(v.option1)) set.push(v.option1);
    }
    return set;
  }, [variants]);

  const initialVariant = useMemo(() => {
    if (!hasVariants) return undefined;
    return variants.find((v) => v.inStock !== false) || variants[0];
  }, [hasVariants, variants]);

  const [selectedOption1, setSelectedOption1] = useState<string>(initialVariant?.option1 || "");
  const [selectedOption2, setSelectedOption2] = useState<string>(initialVariant?.option2 || "");
  const [customerAccount, setCustomerAccount] = useState<string>("");
  const [activeGalleryIdx, setActiveGalleryIdx] = useState(0);
  const [isFullscreenOpen, setIsFullscreenOpen] = useState(false);

  const hasFullscreenGallery =
    Boolean(product.enableFullscreenGallery) ||
    product.slug === "vaich-life-planner" ||
    product.slug === "vaich-study-planner";

  const galleryImages = useMemo(() => {
    const raw = Array.isArray(product.gallery) ? product.gallery.filter((x) => Boolean(x && x.trim())) : [];
    if (raw.length > 0) return raw;
    return product.iconUrl ? [product.iconUrl] : [];
  }, [product.gallery, product.iconUrl]);

  // بازنشانی انتخابگر هنگام جابه‌جایی بین محصولات
  useEffect(() => {
    const def = variants.find((v) => v.inStock !== false) || variants[0];
    setSelectedOption1(def?.option1 || "");
    setSelectedOption2(def?.option2 || "");
    setCustomerAccount("");
    setActiveGalleryIdx(0);
    setIsFullscreenOpen(false);
  }, [product.slug, variants.length]);

  const option2List = useMemo(() => {
    const set: string[] = [];
    const matching = selectedOption1
      ? variants.filter((v) => v.option1 === selectedOption1)
      : variants;
    for (const v of matching) {
      if (v.option2 && !set.includes(v.option2)) set.push(v.option2);
    }
    return set;
  }, [variants, selectedOption1]);

  const handleOption1Change = (nextOpt1: string) => {
    setSelectedOption1(nextOpt1);
    const matching = variants.filter((v) => v.option1 === nextOpt1);
    const sameOpt2 = matching.find((v) => v.option2 === selectedOption2);
    if (sameOpt2) {
      setSelectedOption2(sameOpt2.option2 || "");
    } else {
      const firstAvail = matching.find((v) => v.inStock !== false) || matching[0];
      setSelectedOption2(firstAvail?.option2 || "");
    }
  };

  const activeVariant: ProductVariant | undefined = useMemo(() => {
    if (!hasVariants) return undefined;
    return (
      variants.find(
        (v) =>
          v.option1 === selectedOption1 &&
          (!option2List.length || v.option2 === selectedOption2)
      ) ||
      variants.find((v) => v.option1 === selectedOption1) ||
      variants[0]
    );
  }, [hasVariants, variants, selectedOption1, selectedOption2, option2List.length]);

  const pricingSummary = useMemo(() => getProductPricingSummary(product), [product]);
  const isGlobalOutOfStock = product.inStock === false;
  const isVariantOutOfStock = activeVariant ? activeVariant.inStock === false : isGlobalOutOfStock;
  const isPurchaseDisabled = isGlobalOutOfStock || isVariantOutOfStock;
  const displayPrice = activeVariant ? activeVariant.price : product.price;
  const displayDiscount = activeVariant
    ? Number(activeVariant.discountPercent || 0)
    : Number(product.discountPercent || 0);
  const displayOriginalPrice = activeVariant
    ? getVariantOriginalPrice(activeVariant)
    : displayDiscount > 0
      ? product.originalPrice
      : undefined;
  const showOption1Dropdown = option1List.length >= 2;
  const showOption2Dropdown = option2List.length >= 2;
  const safeTitle = formatRtlSafeTitle(product.name);

  // Reviews state with persistence to localStorage and real-time cloud sync
  const [reviews, setReviews] = useState<ProductReview[]>(() => {
    const defaultRevs = product.reviews || [];
    if (typeof window !== "undefined") {
      try {
        const local = localStorage.getItem(`vaich_user_reviews_${product.slug}`);
        if (local) {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed)) {
            return [...parsed, ...defaultRevs];
          }
        }
      } catch {}
    }
    return defaultRevs;
  });

  const [showAllReviews, setShowAllReviews] = useState(false);

  // Sync reviews immediately when product changes or cloud updates
  useEffect(() => {
    if (product?.reviews) {
      let userRevs: ProductReview[] = [];
      if (typeof window !== "undefined") {
        try {
          const local = localStorage.getItem(`vaich_user_reviews_${product.slug}`);
          if (local) userRevs = JSON.parse(local);
        } catch {}
      }
      setReviews([...userRevs, ...product.reviews]);
    }
  }, [product?.slug, product?.reviews]);

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 5);

  const [newAuthor, setNewAuthor] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewSubmittedMsg, setReviewSubmittedMsg] = useState("");

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot.trim()) {
      setReviewSubmittedMsg("دیدگاه شما با موفقیت ثبت شد و پس از بررسی منتشر خواهد شد.");
      return;
    }

    const LAST_REVIEW_KEY = "vaich_last_review_ts";
    const lastTs = typeof window !== "undefined" ? Number(localStorage.getItem(LAST_REVIEW_KEY) || 0) : 0;
    if (Date.now() - lastTs < 60000) {
      setReviewSubmittedMsg("جهت جلوگیری از ارسال مکرر، لطفاً ۱ دقیقه پس از ثبت دیدگاه قبلی صبر فرمایید.");
      return;
    }

    const cleanComment = newComment.replace(/<[^>]*>?/gm, "").trim().slice(0, 600);
    if (!cleanComment) return;
    const cleanAuthor = newAuthor.replace(/<[^>]*>?/gm, "").trim().slice(0, 50) || "کاربر خریدار";

    const rev: ProductReview = {
      id: "usr-" + Date.now(),
      author: cleanAuthor,
      rating: newRating,
      comment: cleanComment,
      createdAt: new Date().toISOString(),
      verified: false,
      status: "pending",
    };

    const updated = [rev, ...reviews];
    setReviews(updated);

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(LAST_REVIEW_KEY, String(Date.now()));
        const userSaved = localStorage.getItem(`vaich_user_reviews_${product.slug}`);
        const parsed = userSaved ? JSON.parse(userSaved) : [];
        localStorage.setItem(`vaich_user_reviews_${product.slug}`, JSON.stringify([rev, ...parsed]));
      } catch {}
    }

    setNewAuthor("");
    setNewComment("");
    setHoneypot("");
    setNewRating(5);
    setReviewSubmittedMsg("دیدگاه شما با موفقیت ثبت شد و پس از بررسی منتشر خواهد شد. سپاس از همراهی شما! ⭐");
    setTimeout(() => setReviewSubmittedMsg(""), 6000);
  };

  

  const badgeColorMap: Record<string, string> = {
    fire: "bg-linear-to-r from-rose-500 to-amber-500 text-white shadow-rose-500/20",
    purple: "bg-linear-to-r from-primary to-accent text-white shadow-primary/20",
    emerald: "bg-emerald-600 text-white shadow-emerald-600/20",
    blue: "bg-blue-600 text-white shadow-blue-600/20",
    amber: "bg-amber-400 text-slate-950 font-black shadow-amber-400/20",
  };
  const badgeClass = (product.badgeColor && badgeColorMap[product.badgeColor]) || badgeColorMap["purple"];

  const isOutOfStock = product.inStock === false;
  const isLifetime = isProductLifetime(product);
  const isPlanner = product.slug.includes("planner") || product.categoryId === "row-mvampt3r";
  const avgRating = product.rating || (isLifetime ? 4.9 : 4.8);
  const countReviews = (product.reviewCount || 0) + (reviews.length - (product.reviews?.length || 0));

  return (
    <>
      <Section className="aurora overflow-x-hidden">
        {/* Breadcrumb Navigation */}
        <nav aria-label="مسیر راهنما" className="mb-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            خانه
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-foreground transition-colors">
            محصولات و خدمات
          </Link>
          <span>/</span>
          <span className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        <div className="glass-panel rounded-3xl sm:rounded-4xl p-4 sm:p-8 overflow-hidden">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.35fr_1fr] items-start">
            <div className="min-w-0">
              <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-right gap-4 sm:gap-5">
                {hasFullscreenGallery && galleryImages.length > 0 ? (
                  <div className="flex flex-col items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => setIsFullscreenOpen(true)}
                      title="مشاهده تصویر تمام‌صفحه"
                      className="group/img relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-2xl sm:rounded-3xl border border-border/90 shadow-md bg-secondary/60 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    >
                      <img
                        src={galleryImages[activeGalleryIdx] || galleryImages[0]}
                        alt={product.name}
                        width={112}
                        height={112}
                        decoding="async"
                        className="h-full w-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                      />
                      <span className="absolute bottom-1.5 left-1.5 inline-flex items-center justify-center rounded-lg bg-black/65 backdrop-blur-xs p-1 text-white/90 border border-white/20 shadow-xs transition-transform group-hover/img:scale-110">
                        <Maximize2 className="h-3 w-3" />
                      </span>
                    </button>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setIsFullscreenOpen(true)}
                        className="inline-flex items-center gap-1 rounded-lg border border-border/70 bg-secondary/50 hover:bg-secondary hover:border-primary/40 px-2 py-1 text-[10px] font-bold text-foreground transition-colors cursor-pointer"
                      >
                        <Maximize2 className="h-2.5 w-2.5 text-primary" />
                        <span>مشاهده تمام‌صفحه</span>
                      </button>
                      {galleryImages.length > 1 && (
                        <div className="flex items-center gap-1">
                          {galleryImages.map((imgSrc, idx) => (
                            <button
                              key={imgSrc + idx}
                              type="button"
                              onClick={() => setActiveGalleryIdx(idx)}
                              aria-label={`تصویر ${idx + 1}`}
                              className={cn(
                                "h-6 w-6 rounded-md overflow-hidden border transition-all cursor-pointer",
                                idx === activeGalleryIdx
                                  ? "border-primary ring-1 ring-primary/40"
                                  : "border-border/70 opacity-60 hover:opacity-100"
                              )}
                            >
                              <img src={imgSrc} alt={`${product.name} ${idx + 1}`} className="h-full w-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  /* Unified 3D Rounded Square Product Icon */
                  <ServiceIcon
                    slug={product.slug}
                    {...(product.iconUrl ? { iconUrl: product.iconUrl } : {})}
                    {...(product.imageFit ? { imageFit: product.imageFit } : {})}
                    className="h-20 w-20 sm:h-24 sm:w-24 shrink-0 aspect-square rounded-2xl sm:rounded-3xl border border-border/90 shadow-md bg-secondary/60"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h1
                      dir="rtl"
                      style={{ unicodeBidi: "isolate" }}
                      className="text-xl sm:text-3xl font-extrabold text-foreground break-words"
                    >
                      {safeTitle}
                    </h1>
                    {product.badge && (
                      <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-bold text-white shadow-xs", badgeClass)}>
                        {product.badge}
                      </span>
                    )}
                    {isGlobalOutOfStock && (
                      <span className="rounded-full bg-neutral-200 text-neutral-900 border border-neutral-300 px-3 py-0.5 text-xs font-black shadow-xs select-none">
                        ناموجود
                      </span>
                    )}
                  </div>

                  {isLifetime && (
                    <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-500">
                      <Sparkles className="h-4 w-4 shrink-0 text-emerald-500" />
                      <span>خرید دائمی و مادام‌العمر • بدون نیاز به تمدید یا هزینه اشتراک ماهانه</span>
                    </div>
                  )}

                  {/* Rating & Price Range overview */}
                  <div className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-foreground">{toPersianDigits(avgRating.toFixed(1))}</span>
                    </div>
                    {countReviews > 0 && (
                      <>
                        <span>•</span>
                        <span>{toPersianDigits(countReviews)} نظر ثبت‌شده خریداران</span>
                      </>
                    )}
                    {pricingSummary.isRange && !isGlobalOutOfStock && (
                      <>
                        <span>•</span>
                        <span className="font-bold text-primary">
                          بازه قیمت: از {formatPriceNumber(pricingSummary.minPrice)} تا {formatPrice(pricingSummary.maxPrice)}
                        </span>
                      </>
                    )}
                  </div>

                  <p className="mt-2.5 text-sm leading-7 text-muted-foreground break-words">{product.description}</p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-center sm:justify-start gap-2 text-xs">
                <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/50 px-3 py-1.5 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{isLifetime ? "دسترسی دائمی بدون اشتراک ماهانه" : "فعال‌سازی قانونی و رسمی"}</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/50 px-3 py-1.5 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{isPlanner ? "تحویل آنی فایل در گوگل درایو" : "تحویل سریع و ضمانت پایداری"}</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/50 px-3 py-1.5 text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{isLifetime ? "پشتیبانی اختصاصی و راهنمای کامل" : "پشتیبانی سریع در تلگرام"}</span>
                </div>
              </div>
            </div>

            {/* Unified Purchase & Plan Selector Box (BodoCP / License-Market Style) */}
            <aside className="h-fit rounded-3xl border border-border bg-card/85 p-4 sm:p-6 shadow-xl min-w-0 space-y-4">
              {hasFullscreenGallery && galleryImages.length > 0 && (
                <div className="flex items-center justify-between gap-2 rounded-2xl border border-border/70 bg-secondary/25 px-3 py-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Images className="h-4 w-4 text-primary shrink-0" />
                    <span className="text-[11px] font-bold text-foreground truncate">
                      پیش‌نمایش واقعی فایل پلنر
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsFullscreenOpen(true)}
                    className="inline-flex items-center gap-1 rounded-xl border border-primary/30 bg-primary/10 hover:bg-primary/20 px-2.5 py-1 text-[11px] font-bold text-primary transition-colors shrink-0 cursor-pointer"
                  >
                    <Maximize2 className="h-3 w-3" />
                    <span>مشاهده تصویر تمام‌صفحه</span>
                  </button>
                </div>
              )}

              {/* Overall Out of Stock Notice Banner */}
              {isGlobalOutOfStock && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3 text-center">
                  <span className="text-xs sm:text-sm font-bold text-rose-500 flex items-center justify-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-500" />
                    این محصول در حال حاضر ناموجود است
                  </span>
                  <p className="mt-1 text-[11px] sm:text-xs text-muted-foreground">
                    برای اطلاع از شارژ مجدد یا رزرو می‌توانید با پشتیبانی در ارتباط باشید.
                  </p>
                </div>
              )}

              {/* Live Price Header */}
              <div className="rounded-2xl border border-border/70 bg-secondary/35 p-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-muted-foreground">
                    {isLifetime ? "مبلغ خرید دائمی:" : "قیمت پلن انتخابی:"}
                  </span>
                  {activeVariant?.option2 && !showOption2Dropdown ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-2.5 py-0.5 text-[11px] font-bold text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {activeVariant.option2}
                    </span>
                  ) : product.duration && !showOption2Dropdown ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-2.5 py-0.5 text-[11px] font-bold text-foreground">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                      {isLifetime ? "دسترسی مادام‌العمر" : product.duration}
                    </span>
                  ) : null}
                </div>

                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                  {isVariantOutOfStock ? (
                    <p className="text-2xl font-black text-rose-500">ناموجود</p>
                  ) : (
                    <>
                      <p className="gradient-text text-2xl sm:text-3xl font-extrabold tracking-tight">
                        {formatPrice(displayPrice)}
                      </p>
                      {displayOriginalPrice && displayDiscount > 0 ? (
                        <span className="text-xs text-muted-foreground line-through">
                          {formatPrice(displayOriginalPrice)}
                        </span>
                      ) : null}
                      {displayDiscount > 0 ? (
                        <span
                          dir="ltr"
                          className="rounded-lg bg-rose-500 font-sans text-xs font-black text-white px-2 py-0.5 shadow-xs tracking-tight"
                        >
                          -{displayDiscount}%
                        </span>
                      ) : null}
                    </>
                  )}
                </div>
              </div>

              {/* Two-Stage Dynamic Dropdown Selectors */}
              {hasVariants && (
                <div className="space-y-3">
                  {/* Single Option1 Pill when Option1 has 1 value and Option2 has multiple */}
                  {!showOption1Dropdown && option1List.length === 1 && (
                    <div className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/60 px-3.5 py-2.5 text-xs">
                      <span className="text-muted-foreground font-medium">
                        {product.variantOption1Label || "نوع فعال‌سازی"}:
                      </span>
                      <span className="font-bold text-foreground inline-flex items-center gap-1.5">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                        {option1List[0]}
                      </span>
                    </div>
                  )}

                  {/* Dropdown 1: نوع اشتراک / نوع اکانت */}
                  {showOption1Dropdown && (
                    <div>
                      <label
                        htmlFor="variant-option-1"
                        className="block text-xs font-bold text-foreground mb-1.5"
                      >
                        {product.variantOption1Label || "نوع اشتراک / اکانت"}:
                      </label>
                      <div className="relative">
                        <select
                          id="variant-option-1"
                          value={selectedOption1}
                          onChange={(e) => handleOption1Change(e.target.value)}
                          className="w-full appearance-none rounded-2xl border border-border bg-background/90 pr-4 pl-10 py-3 text-xs sm:text-sm font-bold text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        >
                          {option1List.map((opt1) => {
                            const hasAnyStock = variants.some(
                              (v) => v.option1 === opt1 && v.inStock !== false
                            );
                            return (
                              <option key={opt1} value={opt1}>
                                {opt1}
                                {!hasAnyStock ? " (ناموجود)" : ""}
                              </option>
                            );
                          })}
                        </select>
                        <ChevronDown className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}

                  {/* Dropdown 2: مدت زمان / تعداد بسته */}
                  {showOption2Dropdown && (
                    <div>
                      <label
                        htmlFor="variant-option-2"
                        className="block text-xs font-bold text-foreground mb-1.5"
                      >
                        {product.variantOption2Label || "مدت زمان / بسته"}:
                      </label>
                      <div className="relative">
                        <select
                          id="variant-option-2"
                          value={selectedOption2}
                          onChange={(e) => setSelectedOption2(e.target.value)}
                          className="w-full appearance-none rounded-2xl border border-border bg-background/90 pr-4 pl-10 py-3 text-xs sm:text-sm font-bold text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 cursor-pointer"
                        >
                          {option2List.map((opt2) => {
                            const match = variants.find(
                              (v) => v.option1 === selectedOption1 && v.option2 === opt2
                            );
                            const isOut = match?.inStock === false;
                            return (
                              <option key={opt2} value={opt2}>
                                {opt2}
                                {isOut
                                  ? " — ناموجود"
                                  : match && match.price > 0
                                    ? ` — ${formatPrice(match.price)}`
                                    : ""}
                              </option>
                            );
                          })}
                        </select>
                        <ChevronDown className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  )}

                  {/* Dynamic Short Description for the Selected Variant */}
                  {activeVariant?.shortNote && (
                    <div
                      className={cn(
                        "rounded-2xl border p-3 text-[11px] sm:text-xs leading-6 flex items-start gap-2",
                        isVariantOutOfStock
                          ? "border-rose-500/30 bg-rose-500/10 text-rose-500"
                          : "border-primary/25 bg-primary/5 text-muted-foreground"
                      )}
                    >
                      <Info className={cn("h-4 w-4 shrink-0 mt-0.5", isVariantOutOfStock ? "text-rose-500" : "text-primary")} />
                      <span>{activeVariant.shortNote}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Required Customer Identifier Input (Email or Telegram ID) */}
              {!isPurchaseDisabled && (
                <div>
                  <label
                    htmlFor="product-customer-account"
                    className="block text-xs font-bold text-foreground mb-1.5"
                  >
                    {product.requiredFieldLabel || "ایمیل یا آیدی تلگرام جهت تحویل"}:
                    <span className="mr-1 text-[10px] font-normal text-muted-foreground">(انتقال خودکار به مرحله پرداخت)</span>
                  </label>
                  <input
                    id="product-customer-account"
                    type="text"
                    dir="ltr"
                    value={customerAccount}
                    onChange={(e) => setCustomerAccount(e.target.value)}
                    placeholder={product.requiredFieldPlaceholder || "example@gmail.com / @username"}
                    className="w-full rounded-2xl border border-border bg-background/80 px-4 py-2.5 text-left text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              )}

              {/* Prominent Purple Payment CTA Button */}
              <div className="flex flex-col gap-2.5 pt-1">
                {isPurchaseDisabled ? (
                  <button
                    disabled
                    type="button"
                    className="w-full rounded-2xl bg-secondary/80 py-3.5 text-center text-sm font-black text-muted-foreground border border-border cursor-not-allowed select-none"
                  >
                    ناموجود (امکان خرید غیرفعال است)
                  </button>
                ) : (
                  <Link
                    to="/checkout/$slug"
                    params={{ slug: product.slug }}
                    search={
                      {
                        ...(activeVariant?.id ? { variant: activeVariant.id } : {}),
                        ...(customerAccount.trim() ? { account: customerAccount.trim() } : {}),
                      } as any
                    }
                    className="group/pay w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-purple-600 via-primary to-indigo-600 py-3.5 px-5 text-sm font-black text-white shadow-lg shadow-purple-600/25 hover:shadow-xl hover:shadow-purple-600/40 hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
                  >
                    <span>{isLifetime ? "پرداخت و دریافت مستقیم فایل" : "ادامه جهت پرداخت و فعال‌سازی"}</span>
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover/pay:-translate-x-0.5" />
                  </Link>
                )}
                <NeonLink to="/support" variant="outline" size="lg" className="w-full text-center">
                  مشاوره و پشتیبانی
                </NeonLink>
              </div>

              {/* Conversion Trust Checklist */}
              <div className="space-y-2 border-t border-border/60 pt-3.5 text-xs text-muted-foreground">
                {isLifetime ? (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span className="text-foreground font-semibold">دسترسی دائمی و مادام‌العمر (بدون هزینه اشتراک ماهانه)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{isPlanner ? "تحویل آنی لینک کپی اختصاصی در گوگل درایو بلافاصله پس از پرداخت" : "تحویل فوری لینک دسترسی به فایل‌ها بلافاصله پس از پرداخت"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>{isPlanner ? "پشتیبانی اختصاصی و راهنمای جامع راه‌اندازی گام‌به‌گام فارسی" : "پشتیبانی اختصاصی و تضمین مادام‌العمر فایل‌ها"}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>فعال‌سازی قانونی با ضمانت تحویل سالم</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>تحویل و فعال‌سازی در اولین فرصت پس از تأیید رسید</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span>پشتیبانی و راهنمای استفاده ایمن در طول دوره</span>
                    </div>
                  </>
                )}
              </div>
            </aside>
          </div>

          {/* Horizontal Tabs: Product Details, Comparison, Warranty & FAQ */}
          <ProductRichContent
            product={product}
            isPlanner={isPlanner}
            isLifetime={isLifetime}
            selectedPrice={displayPrice}
            selectedVariantId={activeVariant?.id}
            selectedOutOfStock={isPurchaseDisabled}
          />

          {/* Customer Reviews & Google Rating Section */}
          <section className="mt-12 border-t border-border/80 pt-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold flex items-center gap-2 text-foreground">
                  <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  نظرات و رضایت خریداران
                </h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  تجربه واقعی کاربران از خرید و استفاده از {product.name}
                </p>
              </div>

              {/* Quick Overall Rating Badge */}
              <div className="flex items-center gap-3 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-amber-300">
                <div className="flex text-amber-400">
                  {"★".repeat(5)}
                </div>
                <span className="text-sm font-black text-foreground">
                  {toPersianDigits(avgRating.toFixed(1))} از ۵
                </span>
                <span className="text-xs text-muted-foreground">
                  ({toPersianDigits(countReviews)} نظر ثبت‌شده)
                </span>
              </div>
            </div>

            {/* Grid of Reviews + Add Review Form */}
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground text-xs">
                    هنوز نظری برای این سرویس ثبت نشده است. اولین نفری باشید که تجربه خود را می‌نویسد!
                  </div>
                ) : (
                  <>
                    {displayedReviews.map((rev) => (
                      <article
                        key={rev.id}
                        className="rounded-2xl border border-border/80 bg-background/60 p-3.5 sm:p-4 transition-all hover:border-primary/40 shadow-xs"
                      >
                        <div className="flex items-start sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 min-w-0">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/80 font-bold text-xs text-foreground">
                              {rev.author.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                                <h4 className="text-xs font-bold text-foreground truncate">{rev.author}</h4>
                                {rev.verified && (
                                  <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/20 shrink-0">
                                    <CheckCircle2 className="h-3 w-3" />
                                    خریدار تأیید شده
                                  </span>
                                )}
                                {rev.status === "pending" && (
                                  <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 border border-amber-500/20 shrink-0">
                                    در انتظار بررسی
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-muted-foreground block mt-0.5">
                                {formatReviewDate(rev.createdAt)}
                              </span>
                            </div>
                          </div>

                          {/* Stars */}
                          <div className="flex items-center gap-0.5 text-amber-400 shrink-0">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < rev.rating
                                    ? "fill-amber-400 text-amber-400"
                                    : "fill-muted/20 text-muted/40"
                                }`}
                              />
                            ))}
                          </div>
                        </div>

                        <p className="mt-2.5 sm:mt-3 text-xs leading-6 text-muted-foreground break-words">
                          {rev.comment}
                        </p>
                      </article>
                    ))}

                    {reviews.length > 5 && (
                      <button
                        type="button"
                        onClick={() => setShowAllReviews(!showAllReviews)}
                        className="w-full rounded-2xl border border-border/80 bg-secondary/50 hover:bg-secondary py-3 px-4 text-xs font-bold text-foreground transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer active:scale-[0.99]"
                      >
                        <span>
                          {showAllReviews
                            ? "نمایش کمتر (فقط ۵ نظر اول)"
                            : `مشاهده همه ${toPersianDigits(reviews.length)} نظر خریداران (${toPersianDigits(reviews.length - 5)} نظر دیگر)`}
                        </span>
                        <span className="text-primary text-[10px]">{showAllReviews ? "▲" : "▼"}</span>
                      </button>
                    )}
                  </>
                )}
              </div>

              {/* Submit Review Form */}
              <div className="rounded-3xl border border-border bg-card/60 p-5 shadow-md h-fit">
                <h3 className="text-sm font-bold flex items-center gap-2 text-foreground">
                  <MessageSquarePlus className="h-4 w-4 text-primary" />
                  ثبت دیدگاه و امتیاز شما
                </h3>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  بدون نیاز به ثبت‌نام یا شماره تلفن، نظر خود را برای این محصول بنویسید.
                </p>

                {reviewSubmittedMsg ? (
                  <div className="mt-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-400 leading-6">
                    {reviewSubmittedMsg}
                  </div>
                ) : (
                  <form onSubmit={handleAddReview} className="mt-4 space-y-3.5">
                    <input
                      type="text"
                      name="website_hp"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                      className="hidden"
                      style={{ display: "none" }}
                      aria-hidden="true"
                    />
                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        امتیاز شما به این محصول:
                      </label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 text-lg transition-transform hover:scale-125 focus:outline-none"
                            aria-label={`امتیاز ${star} ستاره`}
                          >
                            <span
                              className={
                                (hoverRating || newRating) >= star
                                  ? "text-amber-400 font-bold"
                                  : "text-muted/60"
                              }
                            >
                              ★
                            </span>
                          </button>
                        ))}
                        <span className="mr-2 text-xs text-muted-foreground">
                          ({toPersianDigits(newRating)} از ۵)
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        نام شما (اختیاری):
                      </label>
                      <input
                        type="text"
                        value={newAuthor}
                        onChange={(e) => setNewAuthor(e.target.value)}
                        placeholder="مثال: علی رضایی یا کاربر ناشناس"
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
                        maxLength={50}
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-medium text-muted-foreground block mb-1">
                        متن دیدگاه یا نظر شما: <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="تجربه شما در مورد کیفیت فعال‌سازی، سرعت تحویل و ارزش خرید..."
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none resize-none"
                        maxLength={600}
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-xl bg-primary px-4 py-2.5 text-xs font-bold text-primary-foreground hover:bg-primary/90 transition-colors shadow-md"
                    >
                      ثبت و انتشار دیدگاه
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>

          {/* Related & Popular VAICH Products for Stronger Internal SEO & Discovery */}
          {(() => {
            const relatedProducts = [...liveProducts]
              .filter((p) => p.slug !== product.slug)
              .sort((a, b) => {
                const aStock = a.inStock !== false ? 1 : 0;
                const bStock = b.inStock !== false ? 1 : 0;
                if (aStock !== bStock) return bStock - aStock;
                const priority: Record<string, number> = {
                  "telegram-stars": 1,
                  "telegram-premium": 2,
                  "canva-pro": 3,
                  "gemini": 4,
                  "chatgpt-plus": 5,
                  "vaich-life-planner": 6,
                };
                return (priority[a.slug] ?? 99) - (priority[b.slug] ?? 99);
              })
              .slice(0, 4);

            if (relatedProducts.length === 0) return null;

            return (
              <section className="mt-14 border-t border-border/80 pt-8" aria-label="سایر محصولات و اشتراک‌های پرطرفدار">
                <div className="flex items-center justify-between gap-3 mb-5">
                  <div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-foreground">
                      سایر اشتراک‌ها و سرویس‌های پرطرفدار وایچ
                    </h2>
                    <p className="mt-1 text-xs text-muted-foreground">
                      خرید مستقیم با تحویل سریع و ضمانت فعال‌سازی قانونی
                    </p>
                  </div>
                  <Link
                    to="/products"
                    preload="intent"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline shrink-0"
                  >
                    <span>مشاهده همه محصولات</span>
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </Link>
                </div>
                <div className="flex gap-4 overflow-x-auto pb-3 snap-x snap-proximity md:grid md:grid-cols-2 lg:grid-cols-4 md:overflow-visible">
                  {relatedProducts.map((rp) => (
                    <ProductCard key={rp.slug} product={rp} className="md:w-full" />
                  ))}
                </div>
              </section>
            );
          })()}
        </div>
      </Section>

      {hasFullscreenGallery && galleryImages.length > 0 && isFullscreenOpen && (
        <Suspense fallback={null}>
          <FullscreenGalleryModal
            images={galleryImages}
            initialIndex={activeGalleryIdx}
            title={product.name}
            isOpen={isFullscreenOpen}
            onClose={() => setIsFullscreenOpen(false)}
          />
        </Suspense>
      )}
    </>
  );
}
