/**
 * Product catalogue.
 * Currently a static source of truth. When a backend (product & price
 * management) is added later, replace these helpers with data fetching —
 * the UI only depends on the `Product` shape below.
 */

export type Product = {
  slug: string;
  name: string;
  /** Final price in Toman, stored as a number so a gateway can use it directly. */
  price: number;
  /** Original/list price before discount, if applicable. */
  originalPrice?: number;
  /** Discount percentage, if applicable. */
  discountPercent?: number;
  /** Subscription duration shown to customers. */
  duration?: string;
  description: string;
  purchaseInfo: string[];
};

export const products: Product[] = [
  {
    slug: "gemini",
    name: "Gemini",
    price: 275000,
    originalPrice: 392000,
    discountPercent: 30,
    duration: "۴۵ روزه",
    description: "اشتراک سرویس هوش مصنوعی Gemini، ۴۵ روزه.",
    purchaseInfo: [
      "اشتراک Gemini به مدت ۴۵ روز ارائه می‌شود.",
      "اطلاعات اشتراک پس از تأیید سفارش برای شما ارسال می‌شود.",
      "در صورت داشتن سؤال پیش از خرید، با پشتیبانی VAICH در ارتباط باشید.",
    ],
  },
  {
    slug: "chatgpt",
    name: "ChatGPT",
    price: 4750000,
    description: "اشتراک سرویس هوش مصنوعی ChatGPT.",
    purchaseInfo: [
      "اطلاعات اشتراک پس از تأیید سفارش برای شما ارسال می‌شود.",
      "در صورت داشتن سؤال پیش از خرید، با پشتیبانی VAICH در ارتباط باشید.",
    ],
  },
  {
    slug: "claude",
    name: "Claude",
    price: 5000000,
    description: "اشتراک سرویس هوش مصنوعی Claude.",
    purchaseInfo: [
      "اطلاعات اشتراک پس از تأیید سفارش برای شما ارسال می‌شود.",
      "در صورت داشتن سؤال پیش از خرید، با پشتیبانی VAICH در ارتباط باشید.",
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
