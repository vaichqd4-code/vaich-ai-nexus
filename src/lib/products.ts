export type Product = {
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  duration?: string;
  description: string;
  purchaseInfo: string[];
};

export const products: Product[] = [
  {
    slug: "gemini",
    name: "Gemini pro",
    price: 275000,
    originalPrice: 392000,
    discountPercent: 30,
    duration: "60 روزه",
    description: "اشتراک سرویس هوش مصنوعی Gemini، ۴۵ روزه.",
    purchaseInfo: [
      "اشتراک Gemini به مدت 60 روز ارائه می‌شود.",
      "اشتراک به صورت اشتراکی با بهترین کیفیت و پایداری فعال می‌شود.",
      "دارای پشتیبانی ۲۴ ساعته در صورت بروز هرگونه مشکل.",
      "اطلاعات اشتراک پس از تأیید سفارش برای شما ارسال می‌شود.",
    ],
  },
  {
    slug: "gemini-pro",
    name: "Gemini pro",
    price: 399000,
    originalPrice: 1200000,
    duration: "۱۸ ماهه",
    description: "اشتراک Gemini pro ۱۸ ماهه.",
    purchaseInfo: [
      "اشتراک Gemini pro به مدت ۱۸ ماه ارائه می‌شود.",
      "اشتراک به صورت اشتراکی با بهترین کیفیت و پایداری فعال می‌شود.",
      "دارای پشتیبانی ۲۴ ساعته در صورت بروز هرگونه مشکل.",
      "اطلاعات اشتراک پس از تأیید سفارش برای شما ارسال می‌شود.",
    ],
  },
  {
    slug: "اشتراک chatgpt plus شخصی",
    name: "ChatGPT plus",
    price: 4750000,
    duration: "۱ ماهه",
    description: "اشتراک سرویس هوش مصنوعی ChatGPT.",
    purchaseInfo: [
      "اشتراک ChatGPT plus به مدت ۱ ماه (۳۰ روز) ارائه می‌شود.",
      "اشتراک به صورت کاملاً اختصاصی و قانونی روی اکانت شما فعال می‌شود.",
      "دارای پشتیبانی ۲۴ ساعته در صورت بروز هرگونه مشکل.",
      "اطلاعات اشتراک پس از تأیید سفارش برای شما ارسال می‌شود.",
    ],
  },
  {
    slug: "claude",
    name: "Claude",
    price: 5000000,
    duration: "۱ ماهه",
    description: "اشتراک سرویس هوش مصنوعی Claude.",
    purchaseInfo: [
      "اشتراک Claude به مدت ۱ ماه (۳۰ روز) ارائه می‌شود.",
      "اشتراک به صورت کاملاً اختصاصی و قانونی روی اکانت شما فعال می‌شود.",
      "دارای پشتیبانی ۲۴ ساعته در صورت بروز هرگونه مشکل.",
      "اطلاعات اشتراک پس از تأیید سفارش برای شما ارسال می‌شود.",
    ],
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => faDigits[Number(d)] ?? d);
}

export function formatPrice(price: number): string {
  return `${toPersianDigits(price.toLocaleString("en-US"))} تومان`;
}
