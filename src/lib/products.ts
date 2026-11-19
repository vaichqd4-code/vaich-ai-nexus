import { useEffect, useState } from "react";

export type LayoutMode = "1-row" | "2-row" | "grid";

export type ProductCategoryRow = {
  id: string;
  title: string;
  subtitle?: string | undefined;
};

export type ProductReview = {
  id: string;
  author: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  status?: ("approved" | "pending") | undefined;
  verified?: boolean | undefined; // خریدار تأیید شده
};

export type ProductVariant = {
  id: string;
  option1: string; // مثلاً: اختصاصی / فمیلی / گیفت رسمی
  option2?: string | undefined; // مثلاً: ۱ ماهه / ۳ ماهه / ۵۰ استارز
  price: number;
  originalPrice?: number | undefined;
  discountPercent?: number | undefined;
  inStock?: boolean | undefined; // پیش‌فرض true
  shortNote?: string | undefined; // توضیح کوتاه اختصاصی بالای دکمه پرداخت
};

export type ProductCustomTab = {
  id: string;
  title: string;
  content: string;
};

export type Product = {
  slug: string;
  name: string;
  price: number;
  originalPrice?: number | undefined;
  discountPercent?: number | undefined;
  duration?: string | undefined;
  description: string;
  purchaseInfo: string[];
  features?: string[] | undefined;
  featured?: boolean | undefined;
  badge?: string | undefined;
  badgeColor?: ("fire" | "purple" | "emerald" | "blue" | "amber") | undefined;
  categoryId?: string | undefined;
  service?: string | undefined;
  iconUrl?: string | undefined;
  imageFit?: ("contain" | "cover") | undefined;
  inStock?: boolean | undefined; // موجود بودن (پیش‌فرض true، اگر false باشد ناموجود است)
  isLifetime?: boolean | undefined; // نوع دسترسی: دائمی و مادام‌العمر (true) یا اشتراکی زمان‌دار (false)
  rating?: number | undefined; // میانگین امتیاز (مثلاً 4.9)
  reviewCount?: number | undefined; // تعداد کل نظرات
  reviews?: ProductReview[] | undefined; // لیست نظرات ثبت‌شده
  variantOption1Label?: string | undefined; // عنوان کشوی اول (مثلاً نوع اکانت)
  variantOption2Label?: string | undefined; // عنوان کشوی دوم (مثلاً مدت زمان / بسته)
  variants?: ProductVariant[] | undefined; // لیست ترکیب‌های دو مرحله‌ای
  customTabs?: ProductCustomTab[] | undefined; // تب‌ها و نوارهای افقی توضیحات قابل مدیریت از پنل ادمین
  requiredFieldLabel?: string | undefined; // برچسب فیلد ضروری مشتری در باکس خرید
  requiredFieldPlaceholder?: string | undefined; // راهنمای داخل فیلد مشتری
};

export type ProductPricingSummary = {
  isOutOfStock: boolean;
  isRange: boolean;
  minPrice: number;
  maxPrice: number;
  maxDiscountPercent: number;
  singleOriginalPrice?: number | undefined;
  activeVariantsCount: number;
  defaultVariant?: ProductVariant | undefined;
};

export function getVariantOriginalPrice(v: ProductVariant): number | undefined {
  const discount = Number(v.discountPercent || 0);
  if (v.originalPrice && v.originalPrice > v.price) return v.originalPrice;
  if (discount > 0 && discount < 100 && v.price > 0) {
    return Math.round(v.price / (1 - discount / 100));
  }
  return undefined;
}

export function getProductPricingSummary(product: Product): ProductPricingSummary {
  const hasVariants = Array.isArray(product.variants) && product.variants.length > 0;
  if (hasVariants && product.variants) {
    const globalOutOfStock = product.inStock === false;
    const inStockVariants = globalOutOfStock
      ? []
      : product.variants.filter((v) => v.inStock !== false);

    if (inStockVariants.length === 0) {
      const priced = product.variants.filter((v) => v.price > 0);
      const fallbackPrice =
        priced.length > 0 ? Math.min(...priced.map((v) => v.price)) : product.price;
      const defaultVar =
        product.variants.find((v) => v.inStock !== false) || product.variants[0];
      return {
        isOutOfStock: true,
        isRange: false,
        minPrice: fallbackPrice,
        maxPrice: fallbackPrice,
        maxDiscountPercent: 0,
        singleOriginalPrice: undefined,
        activeVariantsCount: 0,
        defaultVariant: defaultVar,
      };
    }

    const prices = inStockVariants.map((v) => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const isRange = inStockVariants.length >= 2 && minPrice !== maxPrice;
    const maxDiscountPercent = Math.max(
      0,
      ...inStockVariants.map((v) => Math.max(0, Number(v.discountPercent || 0))),
    );
    const singleOriginalPrice =
      !isRange && inStockVariants.length === 1
        ? getVariantOriginalPrice(inStockVariants[0])
        : undefined;

    return {
      isOutOfStock: false,
      isRange,
      minPrice,
      maxPrice,
      maxDiscountPercent,
      singleOriginalPrice,
      activeVariantsCount: inStockVariants.length,
      defaultVariant: inStockVariants[0],
    };
  }

  const isOutOfStock = product.inStock === false;
  const discount = isOutOfStock ? 0 : Math.max(0, Number(product.discountPercent || 0));
  const singleOriginalPrice =
    discount > 0
      ? product.originalPrice && product.originalPrice > product.price
        ? product.originalPrice
        : product.price > 0 && discount < 100
          ? Math.round(product.price / (1 - discount / 100))
          : undefined
      : undefined;

  return {
    isOutOfStock,
    isRange: false,
    minPrice: product.price,
    maxPrice: product.price,
    maxDiscountPercent: discount,
    singleOriginalPrice,
    activeVariantsCount: isOutOfStock ? 0 : 1,
    defaultVariant: undefined,
  };
}

export function formatRtlSafeTitle(title: string): string {
  if (!title) return "";
  // ایزوله‌سازی خط تیره در عناوین ترکیبی انگلیسی و فارسی برای جلوگیری از به‌هم‌ریختگی RTL
  return title.replace(/\s*-\s*/g, " \u200F-\u200F ");
}

export function isProductLifetime(p?: Partial<Product> | null): boolean {
  if (!p) return false;
  if (p.isLifetime === true) return true;
  if (p.isLifetime === false) return false;
  const dur = (p.duration || "").toLowerCase();
  const slug = (p.slug || "").toLowerCase();
  const cat = (p.categoryId || "").toLowerCase();
  return (
    dur.includes("دائمی") ||
    dur.includes("نامحدود") ||
    dur.includes("lifetime") ||
    slug.includes("planner") ||
    cat.includes("planner") ||
    cat === "row-mvampt3r"
  );
}

export const DEFAULT_CATEGORY_ROWS: ProductCategoryRow[] = [
  {
    id: "ai",
    title: "اشتراک‌های هوش مصنوعی",
    subtitle: "سرویس مورد نظر خود را با تحویل آنی و قیمت شفاف انتخاب کنید.",
  },
  {
    id: "row-mvampt3r",
    title: "پلنرهای دیجیتال و هوشمند",
    subtitle: "نرم‌افزارهای مدیریت فردی و سبک زندگی در Google Sheets (دسترسی همیشگی بدون اشتراک)",
  },
  {
    id: "premium-apps",
    title: "اشتراک‌های پرمیوم و کاربردی",
    subtitle: "خرید قانونی و فوری اشتراک تلگرام پرمیوم، استارز تلگرام و کانوا پرو بدون نیاز به رمز عبور",
  },
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    "slug": "chatgpt-plus",
    "name": "ChatGPT Plus",
    "price": 6400000,
    "discountPercent": 0,
    "duration": "۱ ماهه",
    "description": "اشتراک قانونی و اختصاصی ChatGPT Plus شرکت OpenAI (پلن رسمی ۲۰ دلاری)؛ مجهز به مدل‌های پرچمدار و جدید GPT-6.1 Sol و GPT-6 Sol، مدل سریع GPT-6 Luna، دسترسی تخصصی GPT-6 Astra در محیط‌های Codex و ChatGPT Work، بوم تعاملی Canvas، فضای کاری Prism، پژوهش عمیق Deep Research و حالت صوتی زنده Advanced Voice Mode.",
    "isLifetime": false,
    "featured": false,
    "badgeColor": "purple",
    "categoryId": "ai",
    "variantOption1Label": "نوع اکانت",
    "variantOption2Label": "مدت زمان",
    "requiredFieldLabel": "ایمیل اکانت شخصی ChatGPT",
    "requiredFieldPlaceholder": "example@gmail.com",
    "variants": [
      {
        "id": "gpt-ded-1m",
        "option1": "اختصاصی",
        "option2": "۱ ماهه",
        "price": 6400000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "فعال‌سازی کاملاً قانونی و اختصاصی روی ایمیل شخصی شما (نسخه ۲۰ دلاری رسمی OpenAI) با حفظ کامل حریم خصوصی گفتگوها و پروژه‌ها."
      },
      {
        "id": "gpt-fam-1m",
        "option1": "فمیلی",
        "option2": "۱ ماهه",
        "price": 0,
        "discountPercent": 0,
        "inStock": false,
        "shortNote": "نسخه فمیلی چت‌جی‌پی‌تی در حال حاضر ناموجود است. لطفاً گزینه «اختصاصی» را انتخاب نمایید."
      }
    ],
    "features": [
      "مدل‌های اصلی پلن Plus: جدیدترین مدل متعادل و قدرتمند GPT-6.1 Sol به همراه GPT-6 Sol (با قابلیت استدلال Medium و High) و مدل فوق‌سریع GPT-6 Luna",
      "دسترسی به GPT-6 Astra در محیط‌های تخصصی Codex و ChatGPT Work با سهمیه ۵ ساعته چرخشی (نسخه دائمی GPT-6 Pro و ایجنت Dots مخصوص پلن Pro است)",
      "پنجره کانتکست تا ۲۵۶,۰۰۰ توکن در حالت استدلال و ۵۴,۰۰۰ توکن در حالت پاسخ‌دهی سریع (Instant) برای پردازش اسناد و کدها",
      "محیط کاری نوین Prism و بوم تعاملی Canvas: ویرایش هم‌زمان اسناد، مقالات و کدهای برنامه‌نویسی در پنل کناری بدون نیاز به تکرار پرامپت",
      "پژوهش عمیق (Deep Research) و حالت ایجنتی (Agent Mode) مطابق سهمیه ماهانه رسمی پلن Plus",
      "پروژه‌ها و حافظه ایزوله (Projects & Memory): پوشه‌های کاری تفکیک‌شده تا سقف ۲۵ فایل ۵۱۲ مگابایتی",
      "تولید تصاویر پیشرفته (Advanced Image Generation) و تحلیل داده‌ها و اکسل در محیط امن پایتون",
      "حالت صوتی پیشرفته زنده (Advanced Voice Mode) با پشتیبانی از تعامل در پس‌زمینه و Dynamic Island"
    ],
    "purchaseInfo": [
      "اشتراک رسمی ChatGPT Plus (نسخه ۲۰ دلاری) به مدت ۳۰ روز کامل با ضمانت فعال‌سازی قانونی و تحویل سالم اولیه ارائه می‌شود.",
      "فعال‌سازی اختصاصی روی ایمیل کاربر یا اکانت شخصی؛ تمام گفتگوها، پروژه‌ها و حافظه شما کاملاً خصوصی و محفوظ باقی می‌ماند.",
      "نکته مهم نگهداری اکانت: حفظ پایداری اشتراک پس از تحویل به استفاده از IP پایدار و تمیز، عدم جابه‌جایی مداوم VPN، عدم اشتراک‌گذاری اکانت و رعایت قوانین OpenAI بستگی دارد.",
      "پشتیبانی سریع در تلگرام برای راهنمایی راه‌اندازی اولیه و نکات پیشگیری از محدودیت."
    ],
    "iconUrl": "/chatgpt-logo.svg",
    "imageFit": "contain",
    "inStock": true,
    "rating": 4.6,
    "reviewCount": 5,
    "reviews": [
      {
        "id": "rev-gpt-1",
        "author": "farhad",
        "rating": 5,
        "comment": "رو ایمیل خودم فعال شد بدون اینکه پسورد بخوان، صدا و کانواس هم کار میکنه مرسی",
        "createdAt": "2026-10-21T20:10:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gpt-2",
        "author": "کاربر ناشناس",
        "rating": 5,
        "comment": "عالی",
        "createdAt": "2026-10-28T16:45:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gpt-3",
        "author": "زهرا م.",
        "rating": 4,
        "comment": "خوبه فقط ای کاش درگاه مستقیم ریالی بود ولی کارت به کارت و تلگرام هم سریع اوکی شد👍",
        "createdAt": "2026-10-24T15:30:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gpt-4",
        "author": "کاربر",
        "rating": 5,
        "comment": "تایید شد و سلامت اکانت تا الان کاملا اوکی بوده❤️",
        "createdAt": "2026-10-27T11:20:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gpt-5",
        "author": "ناشناس",
        "rating": 4,
        "comment": "خوب بود ممنون، صدا و مدل های جدید او۱ فعاله",
        "createdAt": "2026-10-28T13:00:00.000Z",
        "verified": true,
        "status": "approved"
      }
    ]
  },
  {
    "slug": "vaich-life-planner",
    "name": "پلنر برنامه ریزی(استاندارد)",
    "price": 299000,
    "discountPercent": 0,
    "duration": "دائمی (بدون اشتراک)",
    "description": "نرم‌افزار مدیریت فردی دائمی مبتنی بر فرمول‌های پیشرفته Google Sheets و اسکریپت‌های اتوماسیون Apps Script (بدون نیاز به پرداخت ماهانه یا شارژ دوره)؛ مجهز به Habit Tracker، ماتریس آیزنهاور، سیستم Time Boxing و هوش مالی فردی.",
    "isLifetime": true,
    "featured": true,
    "badge": "پیشنهادی ویژه",
    "badgeColor": "fire",
    "categoryId": "row-mvampt3r",
    "requiredFieldLabel": "جیمیل شما جهت دریافت لینک گوگل‌شیت",
    "requiredFieldPlaceholder": "yourname@gmail.com",
    "features": [
      "نرم‌افزار مدیریت فردی دائمی مبتنی بر فرمول‌های پیشرفته Google Sheets و اسکریپت‌های اتوماسیون Apps Script (بدون نیاز به پرداخت ماهانه یا شارژ دوره)",
      "ردیاب عادات مینیمال (Habit Tracker): ثبت زنجیره استمرار روزانه (Streak) با نمودار درصد موفقیت خودکار و پاداش بصری",
      "سیستم زمان‌بندی روزانه بر پایه Time Boxing: ساخت بلاک‌های تمرکز کاری و تفکیک اولویت‌ها طبق ماتریس آیزنهاور",
      "بودجه‌بندی و هوش مالی فردی: ثبت دقیق تراکنش‌ها، نمودار مخارج دسته‌بندی‌شده و ماشین‌حساب پس‌انداز ماهانه",
      "داشبورد پیگیری اهداف و OKR سالانه با نوارهای گرافیکی پیشرفت",
      "سازگاری کامل: باز شدن بدون لگ در گوشی، تبلت و لپ‌تاپ از طریق برنامه گوگل شیت با فضای ابری دائمی در درایو شخصی خریدار",
      "شامل ۲ تمپلیت اختصاصی: نسخه تعاملی سه‌بعدی (3D Deluxe) و نسخه استاندارد مینیمال ۲بعدی",
      "دکمه هوشمند پاکسازی و شروع ماه جدید تنها با یک کلیک بدون آسیب به فرمول‌ها",
      "همراه با راهنمای جامع صوتی و تصویری فارسی برای راه‌اندازی و کپی سریع و آسان"
    ],
    "purchaseInfo": [
      "تحویل آنی بلافاصله پس از پرداخت به صورت لینک اختصاصی کپی (Make a copy) در گوگل درایو.",
      "این محصول نرم‌افزار دائمی است؛ یک‌بار خرید و دسترسی همیشگی بدون تاریخ انقضا و بدون هزینه اشتراک ماهیانه.",
      "برای استفاده و ذخیره شیت، تنها به یک حساب جیمیل (Google Account) فعال نیاز دارید (بدون نیاز به نرم‌افزار آفیس یا اکسل).",
      "پشتیبانی اختصاصی در تلگرام برای راهنمایی راه‌اندازی، کپی فایل و نحوه استفاده روزانه."
    ],
    "iconUrl": "/planner-cover.webp",
    "imageFit": "cover",
    "inStock": true,
    "rating": 4.9,
    "reviewCount": 21,
    "reviews": [
      {
        "id": "rev-lp-1",
        "author": "کاربر ناشناس",
        "rating": 5,
        "comment": "عالللییی",
        "createdAt": "2026-10-28T19:30:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-2",
        "author": "Ali.R",
        "rating": 5,
        "comment": "سلام دمتون گرم واقعا کاربردیه، تم سه‌بعدیش رو لپ‌تاپ خیلی قشنگه روتین کارام قشنگ منظم شده😍",
        "createdAt": "2026-10-18T14:20:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-3",
        "author": ".",
        "rating": 5,
        "comment": "خیلی خوبه",
        "createdAt": "2026-10-27T16:15:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-4",
        "author": "مهدی",
        "rating": 5,
        "comment": "لینک فایل بلافاصله بعد پرداخت اومد بالا، وویس راهنماشم گوش دادم خیلی سریع شیت رو کپی کردم مرسییی",
        "createdAt": "2026-10-21T18:45:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-5",
        "author": "کاربر وایچ",
        "rating": 5,
        "comment": "عالی",
        "createdAt": "2026-10-28T11:05:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-6",
        "author": "Sara_m",
        "rating": 5,
        "comment": "بهترین ویژگیش اینه اشتراک ماهانه نداره و فایل مال خودمه❤️ ردیاب عادت‌هاش عالیه",
        "createdAt": "2026-10-24T11:10:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-7",
        "author": "امیرحسین",
        "rating": 5,
        "comment": "من برای برنامه ریزی کنکور و درسام خریدم، انگیزه میده خدایی. نموداراش خودکار درصد پیشرفت میده خیلی به دردم خورد",
        "createdAt": "2026-10-25T09:20:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-8",
        "author": "ناشناس",
        "rating": 4,
        "comment": "خوب بود مرسی",
        "createdAt": "2026-10-26T08:30:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-9",
        "author": "محمدرضا",
        "rating": 5,
        "comment": "فوق العاده بود، اولش فکر نمیکردم با گوگل شیت بشه همچین چیزی ساخت، دست طراحش درد نکنه",
        "createdAt": "2026-10-22T13:40:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-10",
        "author": "کاربر مهمان",
        "rating": 5,
        "comment": "دمتون گرم سریع به دستم رسید",
        "createdAt": "2026-10-27T21:10:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-11",
        "author": "م.",
        "rating": 5,
        "comment": "عالیه رو گوشی هم روون باز میشه و فرمولاش اتوماتیک کار میکنه👍",
        "createdAt": "2026-10-27T10:15:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-12",
        "author": "نیلوفر",
        "rating": 5,
        "comment": "خیلی خفنههه مخصوصا تم دوبعدی مینیمالش😍",
        "createdAt": "2026-10-23T15:50:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-13",
        "author": "رضا",
        "rating": 5,
        "comment": "اوکی بود ممنون",
        "createdAt": "2026-10-26T17:25:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-14",
        "author": "الهام ر.",
        "rating": 5,
        "comment": "اولش نمیدونستم چجوری کپی کنم تو درایو، به تلگرام پیام دادم سریع وویس دادن و برام توضیح دادن، پشتیبانی عالی بود",
        "createdAt": "2026-10-24T18:35:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-15",
        "author": "Hamed",
        "rating": 4,
        "comment": "کار راه بنداز و مرتب",
        "createdAt": "2026-10-25T20:45:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-16",
        "author": "کاربر ناشناس",
        "rating": 5,
        "comment": "عالللللی",
        "createdAt": "2026-10-28T07:15:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-17",
        "author": "توسلی",
        "rating": 5,
        "comment": "عالیه واقعا برای کارهای روزمره خیلی کمک میکنه",
        "createdAt": "2026-10-26T11:40:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-18",
        "author": "فرهاد",
        "rating": 5,
        "comment": "فکر نمیکردم انقدر کامل باشه، بخش بودجه بندی و ماتریس آیزنهاورش فوق العاده طراحی شده",
        "createdAt": "2026-10-27T19:50:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-19",
        "author": "کاربر مهمان",
        "rating": 5,
        "comment": "خوب بود",
        "createdAt": "2026-10-28T14:30:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-20",
        "author": "زهرا",
        "rating": 5,
        "comment": "عالی بود ممنونم از سایت خوبتون😍",
        "createdAt": "2026-10-27T14:20:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-lp-21",
        "author": "کاربر وایچ",
        "rating": 5,
        "comment": "دستتون درد نکنه عالی بود",
        "createdAt": "2026-10-28T21:40:00.000Z",
        "verified": true,
        "status": "approved"
      }
    ]
  },
  {
    "slug": "gemini",
    "name": "جمنای پرو دوماهه",
    "price": 290000,
    "discountPercent": 0,
    "duration": "دوماهه",
    "description": "اشتراک رسمی دوماهه Google AI Pro (Gemini Pro)؛ مجهز به مدل‌های پرچمدار نسل جدید Gemini 4 Hydrogen و Gemini 4 Neon، دسترسی تخصصی به Gemini 4 Argon در Google AI Studio، استدلال عمیق و مدل‌های تصمیم‌گیری Deep Reasoning & Decision، دسترسی به محیط برنامه‌نویسی و توسعه Google Antigravity IDE / CLI، پلتفرم ویدیوسازی Google Flow همراه با ۱۰۰۰ کردیت اختصاصی، ۵ ترابایت فضای ابری عظیم Google One و ادغام کامل با Google Workspace.",
    "isLifetime": false,
    "featured": false,
    "badgeColor": "purple",
    "categoryId": "ai",
    "variantOption1Label": "نوع اکانت",
    "variantOption2Label": "مدت زمان",
    "requiredFieldLabel": "جیمیل شخصی شما (Gmail)",
    "requiredFieldPlaceholder": "yourname@gmail.com",
    "variants": [
      {
        "id": "gem60-fam-1m",
        "option1": "فمیلی",
        "option2": "۱ ماهه",
        "price": 290000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "فعال‌سازی قانونی ۱ ماهه Google AI Pro از طریق عضویت فمیلی؛ مجهز به مدل‌های پرچمدار Gemini 4 Hydrogen و Neon، استدلال عمیق، Google Antigravity و ۵ ترابایت فضا."
      },
      {
        "id": "gem60-fam-2m",
        "option1": "فمیلی",
        "option2": "۲ ماهه",
        "price": 420000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "به‌صرفه‌ترین پلن ۲ ماهه کامل Google AI Pro از طریق فمیلی؛ دسترسی نامحدود به مدل‌های Gemini 4 Hydrogen و Neon، محیط توسعه Antigravity، ۱۰۰۰ کردیت Flow و ۵ ترابایت فضا."
      },
      {
        "id": "gem60-ded",
        "option1": "اختصاصی",
        "option2": "دوماهه",
        "price": 0,
        "discountPercent": 0,
        "inStock": false,
        "shortNote": "اکانت اختصاصی جمنای در حال حاضر موقتاً ناموجود است. لطفاً پلن‌های فمیلی را انتخاب فرمایید."
      }
    ],
    "features": [
      "دسترسی رسمی Google AI Pro به مدل پرچمدار Gemini 4 Hydrogen و مدل سریع و چندوجهی Gemini 4 Neon",
      "دسترسی تخصصی به مدل پژوهشی Gemini 4 Argon در محیط Google AI Studio جهت تحلیل داده و پژوهش‌های سنگین",
      "قابلیت استدلال عمیق و مدل‌های تصمیم‌گیری پیشرفته (Deep Reasoning & Decision Models) برای حل مسائل پیچیده منطقی و برنامه‌نویسی",
      "دسترسی کامل و یکپارچه به پلتفرم توسعه هوش مصنوعی Google AI Studio و محیط برنامه‌نویسی نسل جدید Google Antigravity IDE / CLI",
      "دسترسی به پلتفرم ویدیوسازی هوش مصنوعی Google Flow به همراه ۱۰۰۰ کردیت اختصاصی (1000 Flow Credits)",
      "۵ ترابایت فضای ابری عظیم Google One (مشترک در Google Drive، Gmail و Google Photos) به همراه امکانات کامل Google Workspace",
      "دسترسی نامحدود به ابزار تحقیقاتی NotebookLM با قابلیت Audio Overviews، بوم تعاملی Canvas و سفارشی‌سازی دستیارهای هوشمند Gems",
      "پلن اقتصادی دوماهه قانونی با ضمانت فعال‌سازی سالم اولیه و پشتیبانی سریع در تلگرام"
    ],
    "purchaseInfo": [
      "اشتراک رسمی Google AI Pro (Gemini Pro) به مدت ۶۰ روز کامل ارائه می‌شود.",
      "فعال‌سازی قانونی با ضمانت تحویل سالم اولیه و تست کامل دسترسی در لحظه تحویل انجام می‌گردد.",
      "اطلاعات ورود و راهنمای استفاده ایمن پس از تایید رسید در اولین فرصت از طریق تلگرام ارسال می‌شود.",
      "رعایت نکات پایداری پس از تحویل (استفاده با IP تمیز و پایدار و مطابق با قوانین گوگل) بر عهده کاربر است."
    ],
    "iconUrl": "/gemini-60d-icon.webp",
    "imageFit": "contain",
    "inStock": true,
    "rating": 4.8,
    "reviewCount": 6,
    "reviews": [
      {
        "id": "rev-gem-1",
        "author": "Erfan",
        "rating": 5,
        "comment": "سریع وصل شد پشتیبانی تلگرامتون واقعا عالی و باحوصله بود❤️",
        "createdAt": "2026-10-19T16:30:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gem-2",
        "author": "کاربر ناشناس",
        "rating": 5,
        "comment": "عالی بود",
        "createdAt": "2026-10-28T18:15:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gem-3",
        "author": "سینا رضایی",
        "rating": 5,
        "comment": "کردیت‌های ویدیو و فلو به درستی کار میکنه، قیمتش هم نسبت به بقیه پیجا خیلی مناسبتر بود",
        "createdAt": "2026-10-23T12:00:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gem-4",
        "author": "م.",
        "rating": 4,
        "comment": "اوکی بود",
        "createdAt": "2026-10-27T17:40:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gem-5",
        "author": "A.K",
        "rating": 4,
        "comment": "حدود یه ربع طول کشید تا تحویل بدن ولی اکانت سالمه و قطعی نداشته تا الان🙏",
        "createdAt": "2026-10-26T09:15:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gem-6",
        "author": "کاربر وایچ",
        "rating": 5,
        "comment": "ممنون فعال شد",
        "createdAt": "2026-10-28T22:00:00.000Z",
        "verified": true,
        "status": "approved"
      }
    ]
  },
  {
    "slug": "claude",
    "name": "Claude Pro",
    "price": 7800000,
    "discountPercent": 0,
    "duration": "۱ ماهه",
    "description": "اشتراک رسمی و اختصاصی Claude Pro آنتروپیک (پلن رسمی ۲۰ دلاری)؛ دسترسی به مدل سرآمد توسعه نرم‌افزار Claude Sonnet 5.5، مدل استدلال سنگین Claude Opus 5.5، مدل سریع Claude Haiku 5.5، پنجره متنی ۱ میلیون توکنی با خروجی تا ۱۲۸ هزار توکن، سیستم تفکر تطبیقی (Adaptive Thinking)، بوم Artifacts و ابزار Claude Code.",
    "isLifetime": false,
    "featured": false,
    "badgeColor": "purple",
    "categoryId": "ai",
    "variantOption1Label": "نوع اکانت",
    "variantOption2Label": "مدت زمان",
    "requiredFieldLabel": "ایمیل اکانت شخصی Claude",
    "requiredFieldPlaceholder": "example@gmail.com",
    "variants": [
      {
        "id": "cld-ded-1m",
        "option1": "اختصاصی",
        "option2": "۱ ماهه",
        "price": 7800000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "فعال‌سازی کاملاً قانونی و اختصاصی روی اکانت شخصی شما با دسترسی به Sonnet 5.5، Opus 5.5، پنجره ۱ میلیون توکنی و Claude Code."
      },
      {
        "id": "cld-fam-1m",
        "option1": "فمیلی",
        "option2": "۱ ماهه",
        "price": 0,
        "discountPercent": 0,
        "inStock": false,
        "shortNote": "نسخه فمیلی کلاد در حال حاضر ناموجود است. لطفاً گزینه «اختصاصی» را انتخاب فرمایید."
      }
    ],
    "features": [
      "خانواده مدل‌های ۵.۵ در پلن Pro: پرچمدار کدنویسی Claude Sonnet 5.5، مدل استدلالی عمیق Claude Opus 5.5 و مدل رعدآسای Claude Haiku 5.5 (توضیح شفاف: مدل Claude Fable 5.2 در پلن Pro فقط با اعتبار اضافی/شارژی یا در پلن‌های Max و Ultra فعال است)",
      "کانتکست عظیم ۱ میلیون توکنی (1M Context Window) با سقف خروجی تا ۱۲۸,۰۰۰ توکن برای مطالعه و تحلیل کل مخزن‌های کد و کتاب‌ها",
      "سیستم تفکر تطبیقی و گسترده (Adaptive & Extended Thinking) جهت بالا بردن دقت استدلال منطقی و کاهش خطا در پروژه‌های پیچیده",
      "بوم کاری Artifacts و Claude Projects: رندر زنده کامپوننت‌های وب، نمودارهای SVG و پوشه‌های پروژه با راهنمای اختصاصی",
      "دستیار ترمینال Claude Code و جستجوی وب (Web Search) برای تست، ریفکتورینگ و توسعه مستقیم نرم‌افزار",
      "ظرفیت مصرف رسمی پلن Pro (~۵ برابر نسخه رایگان) با سیستم سهمیه ۵ ساعته چرخشی و سهمیه هفتگی استاندارد"
    ],
    "purchaseInfo": [
      "اشتراک Claude Pro به مدت ۳۰ روز کامل با ضمانت فعال‌سازی قانونی و تحویل سالم اولیه ارائه می‌شود.",
      "فعال‌سازی اختصاصی روی ایمیل یا اکانت شخصی با حفظ کامل محرمانگی سورس‌کدها و پروژه‌ها.",
      "نکته بسیار مهم درباره کلود: آنتروپیک نسبت به IPهای اشتراکی و تغییر مداوم سرور VPN حساسیت بالایی دارد؛ نگهداری ایمن اکانت با IP ثابت و تمیز و رعایت قوانین سرویس‌دهنده پس از تحویل بر عهده کاربر است.",
      "پشتیبانی و راهنمایی تنظیمات ایمن در تلگرام هنگام راه‌اندازی."
    ],
    "iconUrl": "/claude-icon.webp",
    "imageFit": "contain",
    "inStock": false,
    "rating": 4.5,
    "reviewCount": 4,
    "reviews": [
      {
        "id": "rev-cld-1",
        "author": "Navid_dev",
        "rating": 5,
        "comment": "کلود کد و پروجکت هاش بدون مشکل کار میکنه، برای برنامه نویسی واقعا لازم بود دستتون درد نکنه🙏",
        "createdAt": "2026-10-22T19:00:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-cld-2",
        "author": "کاربر ناشناس",
        "rating": 5,
        "comment": "عالییی",
        "createdAt": "2026-10-28T17:20:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-cld-3",
        "author": "م. حسینی",
        "rating": 4,
        "comment": "سرعت پاسخگویی ساپورت خوب بود، اکانت هم قانونی فعال شد",
        "createdAt": "2026-10-26T21:10:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-cld-4",
        "author": "کاربر وایچ",
        "rating": 4,
        "comment": "خوبه مرسی",
        "createdAt": "2026-10-28T19:00:00.000Z",
        "verified": true,
        "status": "approved"
      }
    ]
  },
  {
    "slug": "gemini-pro",
    "name": "جمنای پرو ۱۸ ماهه",
    "price": 690000,
    "discountPercent": 0,
    "duration": "۱۸ ماهه",
    "description": "اشتراک بلندمدت ۱۸ ماهه فوق‌اقتصادی Google AI Pro (Gemini Pro) ویژه دانشجویان، پژوهشگران و برنامه‌نویسان؛ شامل دسترسی به مدل‌های پرچمدار Gemini 4 Hydrogen و Gemini 4 Neon، مدل تخصصی Gemini 4 Argon در Google AI Studio، مدل‌های تصمیم‌گیری و استدلال عمیق (Deep Reasoning & Decision)، دسترسی به Google Antigravity، Google Flow با ۱۰۰۰ کردیت، امکانات کامل Google Workspace و ۵ ترابایت فضای ابری Google One بدون دغدغه تمدید ماهانه. (توجه: در حال حاضر ظرفیت این پلن تکمیل و ناموجود است).",
    "isLifetime": false,
    "featured": true,
    "badge": "ویژه",
    "badgeColor": "purple",
    "categoryId": "ai",
    "variantOption1Label": "نوع اکانت",
    "variantOption2Label": "مدت زمان",
    "requiredFieldLabel": "جیمیل شخصی شما (Gmail)",
    "requiredFieldPlaceholder": "yourname@gmail.com",
    "variants": [
      {
        "id": "gem18-fam",
        "option1": "فمیلی",
        "option2": "۱۸ ماهه",
        "price": 690000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "اشتراک ۱۸ ماهه Google AI Pro (فمیلی) همراه با مدل‌های Gemini 4 Argon و Hydrogen، محیط Google Antigravity، ۱۰۰۰ کردیت Google Flow و ۵ ترابایت فضا."
      },
      {
        "id": "gem18-ded",
        "option1": "اختصاصی",
        "option2": "۱۸ ماهه",
        "price": 0,
        "discountPercent": 0,
        "inStock": false,
        "shortNote": "نسخه اختصاصی ۱۸ ماهه در حال حاضر ناموجود است."
      }
    ],
    "features": [
      "وضعیت فعلی: ناموجود (اتمام موقت ظرفیت - امکان رزرو از طریق تلگرام @youneshayati)",
      "اشتراک بلندمدت ۱۸ ماهه با صرفه اقتصادی فوق‌العاده بالا ویژه دانشجویان و پژوهشگران بدون دغدغه تمدید ماهانه",
      "دسترسی رسمی Google AI Pro به مدل‌های پرچمدار نسل جدید Gemini 4 Hydrogen و Gemini 4 Neon و دسترسی به Gemini 4 Argon در AI Studio",
      "دسترسی به پلتفرم توسعه هوش مصنوعی Google AI Studio و محیط برنامه‌نویسی هوشمند Google Antigravity IDE / CLI",
      "دسترسی به پلتفرم ویدیوسازی هوش مصنوعی Google Flow به همراه ۱۰۰۰ کردیت اختصاصی (1000 Flow Credits)",
      "مدل‌های تصمیم‌گیری و استدلال عمیق (Deep Reasoning & Decision Models) برای تحلیل داده‌های سنگین و خودکارسازی فرآیندها",
      "۵ ترابایت فضای ابری عظیم Google One (در Drive، Gmail و Photos) به همراه یکپارچگی با Google Workspace (Gmail، Docs، Drive، Vids)",
      "دسترسی کامل به NotebookLM، Canvas، Gems و ۱۰ دلار اعتبار ماهانه توسعه‌دهندگان Google Cloud"
    ],
    "purchaseInfo": [
      "اشتراک Google AI Pro (Gemini Pro) به مدت ۱۸ ماه کامل ارائه می‌شود.",
      "اکانت با دسترسی رسمی فعال‌شده و در لحظه تحویل تست کامل می‌شود (ضمانت فعال‌سازی و تحویل سالم اولیه).",
      "اطلاعات ورود و نکات نگهداری ایمن پس از تایید رسید در سریع‌ترین زمان ممکن از طریق تلگرام ارسال می‌گردد.",
      "با توجه به سیاست‌های امنیتی گوگل، حفظ شرایط نگهداری اکانت و استفاده با IP پایدار پس از تحویل بر عهده کاربر است."
    ],
    "iconUrl": "/gemini-pro-18m-icon.webp",
    "imageFit": "contain",
    "inStock": false,
    "rating": 4.9,
    "reviewCount": 11,
    "reviews": [
      {
        "id": "rev-gp-1",
        "author": "mohammad",
        "rating": 5,
        "comment": "۱۸ ماه با این قیمت واقعا باورنکردنیه، کانتکست ۲ میلیونی جمینای برای تحلیل پی دی اف های سنگین فوق العادست",
        "createdAt": "2026-10-20T10:15:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gp-2",
        "author": "کاربر ناشناس",
        "rating": 5,
        "comment": "عالی",
        "createdAt": "2026-10-28T20:30:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gp-3",
        "author": "پویان",
        "rating": 5,
        "comment": "خیلی به صرفه است نسبت به پرداخت ماهیانه، ساپورت هم سریع جواب داد",
        "createdAt": "2026-10-22T17:45:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gp-4",
        "author": "ناشناس",
        "rating": 5,
        "comment": "دمتون گرم واقعا راضیم",
        "createdAt": "2026-10-27T08:20:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gp-5",
        "author": "مهدی",
        "rating": 5,
        "comment": "تایید میشه، اکانت بدون لیمیت و سریع وصل شد",
        "createdAt": "2026-10-25T13:10:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gp-6",
        "author": "کاربر مهمان",
        "rating": 5,
        "comment": "عالییییی",
        "createdAt": "2026-10-28T15:00:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gp-7",
        "author": "فرزاد ع.",
        "rating": 5,
        "comment": "برای پایان نامه ام استفاده میکنم نوت بوک ال ام با جمینای معجزه میکنه👌",
        "createdAt": "2026-10-24T22:15:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gp-8",
        "author": "کاربر وایچ",
        "rating": 4,
        "comment": "خوب و پایدار بود",
        "createdAt": "2026-10-27T23:45:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gp-9",
        "author": "حسین",
        "rating": 5,
        "comment": "بهترین خریدی بود که داشتم، بدون استرس تمدید ماهانه",
        "createdAt": "2026-10-26T14:30:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gp-10",
        "author": "مریم",
        "rating": 5,
        "comment": "پشتیبانی خیلی خوب راهنمایی کرد مرسی ازتون❤️",
        "createdAt": "2026-10-28T12:10:00.000Z",
        "verified": true,
        "status": "approved"
      },
      {
        "id": "rev-gp-11",
        "author": "Ali",
        "rating": 5,
        "comment": "همه چی عالی بود",
        "createdAt": "2026-10-28T18:40:00.000Z",
        "verified": true,
        "status": "approved"
      }
    ]
  },
  {
    "slug": "telegram-premium",
    "name": "اشتراک تلگرام پرمیوم",
    "price": 2500000,
    "discountPercent": 0,
    "duration": "۱ ساله",
    "description": "فعالسازی قانونی و رسمی تلگرام پرمیوم (Telegram Premium) روی اکانت شخصی شما از طریق گیفت رسمی (بدون نیاز به رمز عبور و کد ورود)، در کمترین زمان ممکن همراه با ضمانت کامل پایداری.",
    "isLifetime": false,
    "featured": false,
    "badgeColor": "blue",
    "categoryId": "premium-apps",
    "iconUrl": "/telegram-premium-icon.webp",
    "imageFit": "contain",
    "inStock": true,
    "rating": 4.9,
    "reviewCount": 0,
    "reviews": [],
    "variantOption1Label": "نوع فعال‌سازی",
    "variantOption2Label": "مدت زمان اشتراک",
    "requiredFieldLabel": "آیدی تلگرام شما (@Username)",
    "requiredFieldPlaceholder": "@your_username",
    "variants": [
      {
        "id": "tg-prem-1m",
        "option1": "گیفت رسمی (بدون نیاز به رمز)",
        "option2": "پرمیوم گیفتی ۱ ماهه",
        "price": 2500000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "فعال‌سازی قانونی ۱ ماهه تلگرام پرمیوم از طریق گیفت رسمی تلگرام، صرفاً با آیدی (@Username) و بدون نیاز به رمز عبور یا کد ورود."
      },
      {
        "id": "tg-prem-3m",
        "option1": "گیفت رسمی (بدون نیاز به رمز)",
        "option2": "پرمیوم گیفتی ۳ ماهه",
        "price": 5600000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "فعال‌سازی قانونی ۳ ماهه تلگرام پرمیوم از طریق گیفت رسمی تلگرام صرفاً با وارد کردن آیدی (@Username) و بدون نیاز به دسترسی به حساب کاربری."
      },
      {
        "id": "tg-prem-6m",
        "option1": "گیفت رسمی (بدون نیاز به رمز)",
        "option2": "پرمیوم گیفتی ۶ ماهه",
        "price": 7300000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "فعال‌سازی رسمی ۶ ماهه تلگرام پرمیوم با گیفت مستقیم و قانونی؛ سریع، مطمئن و بدون کوچک‌ترین ریسک پریدن یا مسدودی."
      },
      {
        "id": "tg-prem-12m",
        "option1": "گیفت رسمی (بدون نیاز به رمز)",
        "option2": "پرمیوم گیفتی ۱ ساله",
        "price": 12900000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "به‌صرفه‌ترین پلن یک‌ساله (۱۲ ماهه) تلگرام پرمیوم با گیفت رسمی و ضمانت کامل پایداری تا آخرین روز اشتراک."
      }
    ],
    "features": [
      "افزایش سقف آپلود فایل از ۲ گیگابایت به ۴ گیگابایت و سرعت دانلود نامحدود (بدون محدودیت سرعت)",
      "حذف کامل تبلیغات اسپانسری آزاردهنده در کانال‌های عمومی تلگرام",
      "تبدیل خودکار پیام‌های صوتی (Voice) و ویدیویی به متن تنها با یک لمس",
      "ترجمه آنی و خودکار تمامی چت‌ها، گروه‌ها و کانال‌ها به زبان دلخواه",
      "افزایش دو برابری محدودیت‌ها: عضویت تا ۱۰۰۰ کانال، ساخت ۲۰ پوشه با ۲۰۰ گفتگو، پین کردن ۱۰ چت و اتصال ۴ اکانت همزمان",
      "نشان ویژه ستاره پرمیوم کنار نام پروفایل، ایموجی‌های متحرک اختصاصی، استیکرهای تمام‌صفحه و امکانات تلگرام بیزینس (پیام خوش‌آمدگویی، پاسخ سریع و ساعت کاری)"
    ],
    "purchaseInfo": [
      "فعالسازی صرفاً با وارد کردن آیدی تلگرام (@Username) از طریق گیفت رسمی تلگرام انجام می‌شود.",
      "هیچ نیازی به رمز عبور، شماره تلفن یا کد ورود به اکانت شما نیست.",
      "کاملاً قانونی و ایمن، بدون کوچک‌ترین ریسک مسدودی یا پریدن اشتراک تا پایان دوره.",
      "پشتیبانی سریع در تلگرام جهت پیگیری تا لحظه فعال‌سازی کامل روی حساب شما."
    ],
    "customTabs": [
      {
        "id": "tab-tg-desc",
        "title": "توضیحات محصول",
        "content": "اشتراک رسمی تلگرام پرمیوم (Telegram Premium) تجربه کاربری شما در محبوب‌ترین پیام‌رسان دنیا را به سطحی کاملاً حرفه‌ای ارتقا می‌دهد.\nدر فروشگاه وایچ، فعال‌سازی تلگرام پرمیوم به‌صورت ۱۰۰٪ قانونی و از طریق سیستم رسمی گیفت تلگرام (Fragment / Official Gift) مستقیماً روی اکانت شخصی شما انجام می‌شود؛ بدون اینکه نیازی به ارسال رمز عبور، کد ورود یا لاگین به حساب شما باشد.\nاین سرویس هم برای کاربران عادی که به دنبال سرعت دانلود نامحدود و حذف تبلیغات هستند و هم برای مدیران کانال‌ها و کسب‌وکارها (با ابزارهای Telegram Business) یک انتخاب بی‌رقیب است."
      },
      {
        "id": "tab-tg-features",
        "title": "امکانات و مقایسه",
        "content": "• افزایش سقف آپلود فایل: امکان ارسال فایل‌های حجیم تا ۴ گیگابایت (دو برابر نسخه رایگان ۲ گیگابایتی) با حداکثر سرعت دانلود بدون محدودیت.\n• حذف کامل تبلیغات: دیگر در هیچ کانال عمومی با پیام‌های تبلیغاتی اسپانسری (Sponsored Messages) مواجه نخواهید شد.\n• تبدیل ویس و ویدیو به متن (Voice-to-Text): تبدیل دقیق پیام‌های صوتی و ویدیومسیج‌ها به متن خوانا تنها با یک لمس.\n• ترجمه همزمان و خودکار: ترجمه زنده کل چت‌ها، گروه‌ها و کانال‌های خارجی به فارسی یا هر زبان دلخواه بدون خروج از صفحه.\n• دو برابر شدن تمام محدودیت‌ها: عضویت تا ۱۰۰۰ کانال، ساخت ۲۰ پوشه چت با ظرفیت ۲۰۰ گفتگو در هر پوشه، پین کردن ۱۰ چت در صفحه اصلی و اتصال همزمان ۴ اکانت.\n• شخصی‌سازی و تلگرام بیزینس: دریافت نشان ستاره پرمیوم کنار پروفایل، استیکرهای تمام‌صفحه، ایموجی‌های متحرک اختصاصی و امکانات تلگرام بیزینس شامل پیام خوش‌آمدگویی، پاسخ سریع و نمایش ساعات کاری."
      },
      {
        "id": "tab-tg-warranty",
        "title": "شرایط فعال‌سازی و گارانتی",
        "content": "• نحوه فعال‌سازی: پس از ثبت سفارش، کافی است آیدی تلگرام (@Username) خود را وارد کنید تا گیفت رسمی پرمیوم مستقیماً به حساب شما ارسال و فعال شود.\n• امنیت صددرصدی: بدون نیاز به رمز عبور، تایید دو مرحله‌ای یا ورود به اکانت شما؛ حریم خصوصی شما کاملاً محفوظ می‌ماند.\n• پیش‌نیاز ساده: اکانت شما باید دارای نام کاربری (@Username) عمومی فعال باشد تا امکان ارسال گیفت به آیدی وجود داشته باشد.\n• ضمانت کامل دوره: تمامی اشتراک‌ها با پرداخت رسمی و قانونی تهیه می‌شوند و تا آخرین روز دوره انتخابی (۱، ۳، ۶ یا ۱۲ ماهه) بدون هیچ‌گونه ریسک مسدودی یا لغو اشتراک تضمین می‌گردند."
      },
      {
        "id": "tab-tg-faq",
        "title": "سوالات متداول",
        "content": "آیا برای فعال‌سازی نیاز به ورود به اکانت تلگرام من هست؟\nخیر، به هیچ عنوان. فعال‌سازی از طریق گیفت رسمی و صرفاً با آیدی تلگرام (@Username) شما انجام می‌شود و هیچ دسترسی به حسابتان لازم نیست.\n\nچقدر زمان می‌برد تا تلگرام پرمیوم فعال شود؟\nبلافاصله پس از تأیید سفارش، گیفت رسمی در کوتاه‌ترین زمان ممکن (معمولاً چند دقیقه در ساعات کاری) به آیدی شما ارسال می‌شود.\n\nاگر قبلاً اشتراک پرمیوم داشتم امکان تمدید هست؟\nبله، گیفت رسمی به مدت زمان باقی‌مانده اشتراک فعلی شما اضافه می‌شود یا بلافاصله پس از اتمام آن فعال می‌گردد."
      }
    ]
  },
  {
    "slug": "telegram-stars",
    "name": "استارز تلگرام",
    "price": 590000,
    "discountPercent": 0,
    "duration": "تحویل فوری",
    "description": "خرید و شارژ فوری استارز تلگرام (Telegram Stars - واحد پول رسمی درون‌برنامه‌ای تلگرام) مستقیماً به آیدی شما بدون نیاز به لاگین یا کارت بانکی بین‌المللی، با تحویل سریع و ایمن.",
    "isLifetime": false,
    "featured": false,
    "badgeColor": "amber",
    "categoryId": "premium-apps",
    "iconUrl": "/telegram-stars-icon.webp",
    "imageFit": "contain",
    "inStock": true,
    "rating": 4.9,
    "reviewCount": 0,
    "reviews": [],
    "variantOption1Label": "روش شارژ",
    "variantOption2Label": "تعداد استارز",
    "requiredFieldLabel": "آیدی تلگرام جهت واریز استارز (@Username)",
    "requiredFieldPlaceholder": "@your_username",
    "variants": [
      {
        "id": "tg-stars-100",
        "option1": "شارژ مستقیم با آیدی",
        "option2": "۱۰۰ استارز فوری",
        "price": 590000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "واریز مستقیم و فوری ۱۰۰ استارز رسمی تلگرام به آیدی شما بدون نیاز به لاگین یا شماره مجازی."
      },
      {
        "id": "tg-stars-150",
        "option1": "شارژ مستقیم با آیدی",
        "option2": "۱۵۰ استارز فوری",
        "price": 860000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "واریز آنی ۱۵۰ استارز رسمی تلگرام؛ مناسب خرید گیفت‌های ویژه و پرداخت در مینی‌اپ‌ها."
      },
      {
        "id": "tg-stars-250",
        "option1": "شارژ مستقیم با آیدی",
        "option2": "۲۵۰ استارز فوری",
        "price": 1600000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "شارژ مستقیم ۲۵۰ استارز رسمی روی اکانت تلگرام شما با پشتیبانی کامل تا لحظه نشستن استارز."
      },
      {
        "id": "tg-stars-350",
        "option1": "شارژ مستقیم با آیدی",
        "option2": "۳۵۰ استارز فوری",
        "price": 2600000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "شارژ فوری ۳۵۰ استارز رسمی تلگرام به آیدی شخصی شما بدون نیاز به رمز عبور."
      },
      {
        "id": "tg-stars-500",
        "option1": "شارژ مستقیم با آیدی",
        "option2": "۵۰۰ استارز فوری",
        "price": 3550000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "بسته پرطرفدار ۵۰۰ استارز فوری تلگرام برای خرید گیفت‌های کلکسیونی، حمایت از کانال‌ها و مینی‌اپ‌ها."
      },
      {
        "id": "tg-stars-750",
        "option1": "شارژ مستقیم با آیدی",
        "option2": "۷۵۰ استارز فوری",
        "price": 4450000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "شارژ فوری ۷۵۰ استارز رسمی تلگرام با واریز مستقیم و ایمن به آیدی شما."
      },
      {
        "id": "tg-stars-1000",
        "option1": "شارژ مستقیم با آیدی",
        "option2": "۱,۰۰۰ استارز فوری",
        "price": 6150000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "بسته حرفه‌ای ۱,۰۰۰ استارز رسمی تلگرام با واریز قانونی و مستقیم صرفاً از طریق آیدی شما."
      },
      {
        "id": "tg-stars-2500",
        "option1": "شارژ مستقیم با آیدی",
        "option2": "۲,۵۰۰ استارز فوری",
        "price": 14600000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "بسته ویژه ۲,۵۰۰ استارز فوری تلگرام مناسب خرید گیفت‌های کلکسیونی کمیاب و پرداخت‌های حجیم مینی‌اپ‌ها."
      },
      {
        "id": "tg-stars-5000",
        "option1": "شارژ مستقیم با آیدی",
        "option2": "۵,۰۰۰ استارز فوری",
        "price": 29800000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "بسته ۵,۰۰۰ استارز فوری تلگرام با تحویل سریع، قانونی و پشتیبانی اختصاصی تا لحظه دریافت."
      },
      {
        "id": "tg-stars-10000",
        "option1": "شارژ مستقیم با آیدی",
        "option2": "۱۰,۰۰۰ استارز فوری",
        "price": 54900000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "بزرگ‌ترین بسته ۱۰,۰۰۰ استارز فوری تلگرام با بهترین ارزش خرید و واریز رسمی مستقیم به آیدی شما."
      }
    ],
    "features": [
      "پرداخت درون‌برنامه‌ای سریع در تمامی ربات‌ها، مینی‌اپ‌های تلگرامی (Mini Apps) و بازی‌های تلگرام",
      "خرید و ارسال گیفت‌های کلکسیونی و ویژه (Telegram Gifts) برای دوستان یا نمایش دائمی در پروفایل",
      "حمایت مالی (Donate) از تولیدکنندگان محتوا و ارسال واکنش ستاره‌ای ویژه در کانال‌ها",
      "امکان تمدید یا هدیه دادن اشتراک تلگرام پرمیوم با موجودی استارز حساب",
      "تحویل ایمن و قانونی صرفاً با ثبت آیدی تلگرام بدون نیاز به رمز عبور، کارت بانکی خارجی یا شماره مجازی"
    ],
    "purchaseInfo": [
      "شارژ استارز صرفاً با ثبت آیدی تلگرام (@Username) شما انجام می‌شود (بدون نیاز به رمز یا ورود به حساب).",
      "استارز خریداری‌شده بلافاصله پس از واریز در بخش Telegram Stars تنظیمات تلگرام شما قابل مشاهده و استفاده است.",
      "موجودی استارز تاریخ انقضا ندارد و هر زمان می‌توانید در مینی‌اپ‌ها یا برای خرید گیفت استفاده کنید.",
      "پشتیبانی کامل تیم وایچ تا لحظه نشستن دقیق استارز روی حساب شما."
    ],
    "customTabs": [
      {
        "id": "tab-stars-desc",
        "title": "توضیحات محصول",
        "content": "استارز تلگرام (Telegram Stars) واحد پول دیجیتال و رسمی درون‌برنامه‌ای تلگرام است که برای تمامی پرداخت‌ها، خریدهای درون ربات‌ها، مینی‌اپ‌ها و ارسال گیفت‌های کلکسیونی طراحی شده است.\nبا توجه به محدودیت کارت‌های بانکی بین‌المللی در ایران، فروشگاه وایچ امکان شارژ مستقیم، قانونی و فوری استارز را تنها با وارد کردن آیدی تلگرام (@Username) برای شما فراهم کرده است."
      },
      {
        "id": "tab-stars-features",
        "title": "کاربردها و امکانات",
        "content": "• پرداخت در مینی‌اپ‌ها و ربات‌ها: خرید آیتم‌ها، خدمات دیجیتال و اشتراک‌ها در هزاران ربات و Mini App محبوب تلگرام.\n• خرید گیفت‌های کلکسیونی (Telegram Gifts): تهیه و ارسال گیفت‌های ویژه و محدود برای دوستان یا نمایش افتخاری در صفحه پروفایل شخصی.\n• حمایت از کانال‌ها و واکنش ستاره‌ای: ارسال واکنش ستاره (Star Reaction) زیر پست‌ها و باز کردن محتواهای اختصاصی کانال‌ها.\n• هدیه و تمدید پرمیوم: قابلیت استفاده از موجودی استارز برای هدیه دادن یا تمدید امکانات ویژه تلگرام."
      },
      {
        "id": "tab-stars-warranty",
        "title": "شرایط فعال‌سازی و گارانتی",
        "content": "• تحویل صرفاً با آیدی: بدون نیاز به رمز عبور، کد ورود یا تحویل شماره مجازی؛ فقط آیدی تلگرام (@Username) خود را دقیق وارد نمایید.\n• اصالت ۱۰۰٪ قانونی: تمام بسته‌های استارز از طریق درگاه‌های رسمی تلگرام تهیه و به حساب شما واریز می‌شوند.\n• پشتیبانی تا لحظه دریافت: تیم پشتیبانی وایچ تا زمان نشستن کامل موجودی در بخش My Stars اکانت شما همراهتان است."
      },
      {
        "id": "tab-stars-faq",
        "title": "سوالات متداول",
        "content": "از کجا بفهمم استارز به حسابم واریز شده است؟\nپس از واریز، نوتیفیکیشن رسمی از سمت تلگرام دریافت می‌کنید و می‌توانید موجودی دقیق را در مسیر Settings > My Stars مشاهده کنید.\n\nآیا استارز تلگرام تاریخ انقضا دارد؟\nخیر، موجودی استارز روی اکانت شما باقی می‌ماند و هر زمان که بخواهید می‌توانید از آن استفاده نمایید.\n\nاگر آیدی تلگرام نداشته باشم چکار کنم؟\nکافی است در تنظیمات پروفایل تلگرام یک Username دلخواه برای خود تنظیم کنید و همان را هنگام سفارش وارد نمایید."
      }
    ]
  },
  {
    "slug": "canva-pro",
    "name": "اشتراک کانوا پرو",
    "price": 240000,
    "discountPercent": 0,
    "duration": "۶ ماهه",
    "description": "ارتقای اکانت شخصی کانوا به نسخه حرفه‌ای Canva Pro با فعال‌سازی مستقیم روی ایمیل شخصی شما، مناسب طراحان گرافیک، ادمین‌های اینستاگرام، یوتیوبرها، دانشجویان و صاحبان کسب‌وکار.",
    "isLifetime": false,
    "featured": false,
    "badgeColor": "emerald",
    "categoryId": "premium-apps",
    "iconUrl": "/canva-pro-icon.webp",
    "imageFit": "contain",
    "inStock": true,
    "rating": 4.9,
    "reviewCount": 0,
    "reviews": [],
    "variantOption1Label": "نوع اشتراک",
    "variantOption2Label": "مدت زمان",
    "requiredFieldLabel": "ایمیل اکانت شخصی کانوا (Canva)",
    "requiredFieldPlaceholder": "example@gmail.com",
    "variants": [
      {
        "id": "canva-fam-1m",
        "option1": "فمیلی (دعوت تیمی روی ایمیل شخصی)",
        "option2": "۱ ماهه (قابل تمدید و بدون تعویض اکانت)",
        "price": 240000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "فعال‌سازی رسمی ۱ ماهه Canva Pro (قابل تمدید روی همان اکانت بدون تعویض حساب) از طریق دعوت‌نامه تیمی به ایمیل شخصی شما؛ تمامی طرح‌ها کاملاً خصوصی می‌ماند."
      },
      {
        "id": "canva-fam-2m",
        "option1": "فمیلی (دعوت تیمی روی ایمیل شخصی)",
        "option2": "۲ ماهه (قابل تمدید و بدون تعویض اکانت)",
        "price": 340000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "اشتراک ۲ ماهه Canva Pro (قابل تمدید و بدون تعویض اکانت) روی ایمیل شخصی با دسترسی کامل به Magic Studio، حذف پس‌زمینه و ۱۰۰ میلیون المان پرمیوم."
      },
      {
        "id": "canva-fam-3m",
        "option1": "فمیلی (دعوت تیمی روی ایمیل شخصی)",
        "option2": "۳ ماهه (قابل تمدید و بدون تعویض اکانت)",
        "price": 500000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "اشتراک ۳ ماهه Canva Pro (قابل تمدید و بدون تعویض اکانت) روی ایمیل شخصی با کیت برند اختصاصی (Brand Kit) و ضمانت کامل پایداری."
      },
      {
        "id": "canva-fam-6m",
        "option1": "فمیلی (دعوت تیمی روی ایمیل شخصی)",
        "option2": "۶ ماهه (قابل تمدید و بدون تعویض اکانت)",
        "price": 990000,
        "discountPercent": 0,
        "inStock": true,
        "shortNote": "به‌صرفه‌ترین اشتراک ۶ ماهه Canva Pro (قابل تمدید و بدون تعویض اکانت) از طریق دعوت تیمی روی ایمیل شخصی بدون نیاز به رمز عبور و با ضمانت ۶ ماهه."
      },
      {
        "id": "canva-ded-1m",
        "option1": "اختصاصی (پرسونال)",
        "option2": "۱ ماهه (قابل تمدید و بدون تعویض اکانت)",
        "price": 0,
        "discountPercent": 0,
        "inStock": false,
        "shortNote": "نسخه اختصاصی (پرسونال) کانوا در حال حاضر ناموجود است. لطفاً پلن «فمیلی (دعوت تیمی روی ایمیل شخصی)» را انتخاب نمایید."
      },
      {
        "id": "canva-ded-2m",
        "option1": "اختصاصی (پرسونال)",
        "option2": "۲ ماهه (قابل تمدید و بدون تعویض اکانت)",
        "price": 0,
        "discountPercent": 0,
        "inStock": false,
        "shortNote": "نسخه اختصاصی (پرسونال) کانوا در حال حاضر ناموجود است."
      },
      {
        "id": "canva-ded-3m",
        "option1": "اختصاصی (پرسونال)",
        "option2": "۳ ماهه (قابل تمدید و بدون تعویض اکانت)",
        "price": 0,
        "discountPercent": 0,
        "inStock": false,
        "shortNote": "نسخه اختصاصی (پرسونال) کانوا در حال حاضر ناموجود است."
      },
      {
        "id": "canva-ded-6m",
        "option1": "اختصاصی (پرسونال)",
        "option2": "۶ ماهه (قابل تمدید و بدون تعویض اکانت)",
        "price": 0,
        "discountPercent": 0,
        "inStock": false,
        "shortNote": "نسخه اختصاصی (پرسونال) کانوا در حال حاضر ناموجود است."
      }
    ],
    "features": [
      "دسترسی نامحدود به بیش از ۱۰۰ میلیون تصویر، ویدیو، آیکون، المان گرافیکی و فونت پرمیوم و بیش از ۱۰۰ هزار قالب آماده حرفه‌ای",
      "ابزار هوشمند حذف پس‌زمینه تصاویر (Background Remover) و ابزارهای هوش مصنوعی Magic Studio تنها با یک کلیک",
      "قابلیت تغییر سایز جادویی طرح‌ها (Magic Resize) برای اینستاگرام، یوتیوب، لینکدین و فرمت‌های مختلف در چند ثانیه",
      "کیت برند اختصاصی (Brand Kit) جهت ذخیره لوگو، پالت رنگی و فونت‌های سازمانی به همراه فضای ابری اختصاصی",
      "خروجی با بالاترین کیفیت بدون واترمارک (PNG شفاف، PDF چاپی CMYK، SVG و ویدیو MP4)",
      "فعال‌سازی از طریق دعوت تیمی رسمی (Team Invite) روی ایمیل شخصی بدون نیاز به رمز عبور و با حفظ کامل محرمانگی طرح‌ها"
    ],
    "purchaseInfo": [
      "فعالسازی از طریق دعوت‌نامه تیمی رسمی (Team Invite) روی ایمیل شخصی شما بدون نیاز به رمز عبور انجام می‌شود.",
      "نیازی به تغییر IP یا انتخاب ریجن خاص برای استفاده روزمره نیست.",
      "تمامی فایل‌ها، پروژه‌ها و طرح‌های شما در فضای شخصی خودتان کاملاً خصوصی باقی می‌ماند و دیگر اعضای تیم به آن دسترسی ندارند.",
      "دارای ضمانت کامل پایداری تا آخرین روز دوره اشتراک و پشتیبانی سریع وایچ."
    ],
    "customTabs": [
      {
        "id": "tab-canva-desc",
        "title": "توضیحات محصول",
        "content": "کانوا پرو (Canva Pro) محبوب‌ترین پلتفرم طراحی گرافیک ابری در جهان است که بدون نیاز به دانش پیچیده فتوشاپ یا ایلاستریتور، به شما امکان می‌دهد در چند دقیقه پست و استوری اینستاگرام، کاور یوتیوب، اسلاید ارائه، پوستر، رزومه، لوگو و ویدیوهای حرفه‌ای بسازید.\nبا تهیه اشتراک Canva Pro از وایچ، اکانت شخصی شما مستقیماً از طریق دعوت تیمی رسمی ارتقا می‌یابد و تمام قفل‌های المان‌ها، قالب‌ها و ابزارهای هوش مصنوعی Magic Studio برایتان باز می‌شود."
      },
      {
        "id": "tab-canva-features",
        "title": "امکانات و مقایسه",
        "content": "• کتابخانه غول‌پیکر پرمیوم: دسترسی نامحدود به بیش از ۱۰۰ میلیون عکس، ویدیو، موزیک، آیکون و المان گرافیکی و بیش از ۱۰۰ هزار قالب آماده بدون واترمارک.\n• هوش مصنوعی Magic Studio: حذف پس‌زمینه عکس و ویدیو با یک کلیک (Background Remover)، پاک‌کن جادویی (Magic Eraser)، گسترش تصویر (Magic Expand) و تولید تصویر با هوش مصنوعی.\n• تغییر سایز جادویی (Magic Resize): تبدیل آنی یک طرح پست اینستاگرام به سایز استوری، بنر سایت یا کاور یوتیوب تنها با یک کلیک.\n• کیت برند (Brand Kit): تعریف لوگوها، کد رنگ‌های سازمانی و بارگذاری فونت‌های فارسی دلخواه برای حفظ یکپارچگی هویت بصری.\n• خروجی حرفه‌ای و فضای ابری: دریافت خروجی PNG با پس‌زمینه شفاف، فایل SVG وکتور، PDF استاندارد چاپ و ویدیو با کیفیت بالا."
      },
      {
        "id": "tab-canva-warranty",
        "title": "شرایط فعال‌سازی و گارانتی",
        "content": "• فعال‌سازی مستقیم روی ایمیل شخصی: پس از سفارش، لینک دعوت تیمی رسمی (Team Invite) به ایمیل اکانت کانوای شما ارسال می‌شود و با یک کلیک اکانتتان به Pro ارتقا پیدا می‌کند.\n• بدون نیاز به رمز عبور: هیچ اطلاعات محرمانه‌ای از شما دریافت نمی‌شود و امنیت حساب شما ۱۰۰٪ تضمین است.\n• حفظ کامل حریم خصوصی طرح‌ها: تمامی پروژه‌ها و فایل‌هایی که طراحی می‌کنید به‌صورت پیش‌فرض کاملاً خصوصی (Private) هستند و هیچ عضو دیگری در تیم قادر به مشاهده آن‌ها نیست.\n• قابل تمدید روی همان اکانت و ضمانت کامل دوره: تمامی پلن‌ها (۱، ۲، ۳ و ۶ ماهه) بدون نیاز به تعویض اکانت قابل تمدید هستند و پایداری آن‌ها تا آخرین روز دوره توسط وایچ تضمین شده است."
      },
      {
        "id": "tab-canva-faq",
        "title": "سوالات متداول",
        "content": "آیا اعضای دیگر تیم می‌توانند طرح‌های من را ببینند؟\nخیر، طرح‌های شما تا زمانی که خودتان به‌صورت دستی دکمه Share را نزنید کاملاً شخصی و مخفی می‌ماند.\n\nآیا می‌توانم فونت فارسی به کانوا پرو اضافه کنم؟\nبله! در نسخه Canva Pro قابلیت آپلود فونت‌های فارسی (مثل ایران‌سنس، وزیرمتن، دانا و...) در بخش Brand Kit کاملاً فعال است.\n\nآیا پس از پایان اشتراک طرح‌های قبلی من پاک می‌شوند؟\nخیر، تمام طرح‌ها روی اکانت شخصی شما باقی می‌مانند و در هر زمان می‌توانید اشتراک خود را مجدداً تمدید کنید."
      }
    ]
  }
];

export const products = DEFAULT_PRODUCTS;

export function isMojibakeText(str?: string): boolean {
  if (!str) return false;
  return /[\u00C0-\u00FF]{2,}/.test(str);
}

export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return DEFAULT_PRODUCTS;
  try {
    const raw = localStorage.getItem("vaich_custom_products");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (parsed.some((p: any) => isMojibakeText(p.name) || isMojibakeText(p.description))) {
          localStorage.removeItem("vaich_custom_products");
          return DEFAULT_PRODUCTS;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error loading stored products:", err);
  }
  return DEFAULT_PRODUCTS;
}

export function saveStoredProducts(items: Product[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("vaich_custom_products", JSON.stringify(items));
    window.dispatchEvent(new CustomEvent("vaich_products_updated", { detail: items }));
  } catch (err) {
    console.error("Error saving products:", err);
  }
}

export function getStoredCategoryRows(): ProductCategoryRow[] {
  if (typeof window === "undefined") return DEFAULT_CATEGORY_ROWS;
  try {
    const raw = localStorage.getItem("vaich_category_rows");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        if (parsed.some((r: any) => isMojibakeText(r.title) || isMojibakeText(r.subtitle))) {
          localStorage.removeItem("vaich_category_rows");
          return DEFAULT_CATEGORY_ROWS;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error loading category rows:", err);
  }
  return DEFAULT_CATEGORY_ROWS;
}

export function saveStoredCategoryRows(rows: ProductCategoryRow[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("vaich_category_rows", JSON.stringify(rows));
    window.dispatchEvent(new CustomEvent("vaich_rows_updated", { detail: rows }));
  } catch (err) {
    console.error("Error saving category rows:", err);
  }
}

export function resetProductsToDefault(): Product[] {
  if (typeof window !== "undefined") {
    localStorage.removeItem("vaich_custom_products");
    localStorage.removeItem("vaich_category_rows");
    window.dispatchEvent(new CustomEvent("vaich_products_updated", { detail: DEFAULT_PRODUCTS }));
    window.dispatchEvent(new CustomEvent("vaich_rows_updated", { detail: DEFAULT_CATEGORY_ROWS }));
  }
  return DEFAULT_PRODUCTS;
}

export function getStoredLayout(): LayoutMode {
  if (typeof window === "undefined") return "1-row";
  try {
    const val = localStorage.getItem("vaich_layout_config");
    if (val === "1-row" || val === "2-row" || val === "grid") {
      return val;
    }
  } catch (err) {
    console.error("Error reading layout config:", err);
  }
  return "1-row";
}

export function saveStoredLayout(mode: LayoutMode): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("vaich_layout_config", mode);
    window.dispatchEvent(new CustomEvent("vaich_layout_updated", { detail: mode }));
  } catch (err) {
    console.error("Error saving layout config:", err);
  }
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  pin: string;
  role: "superadmin" | "admin" | "editor";
  createdAt: string;
}

export const DEFAULT_ADMIN_PIN = "Yh111111";
export const MASTER_ADMIN_EMAIL = "vaichqd4@gmail.com";

export const DEFAULT_ADMIN_USERS: AdminUser[] = [
  {
    id: "admin-master",
    name: "مدیر ارشد (مالک)",
    email: MASTER_ADMIN_EMAIL,
    pin: DEFAULT_ADMIN_PIN,
    role: "superadmin",
    createdAt: "2026-10-15T00:00:00.000Z",
  },
];

export function getStoredMasterPin(): string {
  if (typeof window === "undefined") return DEFAULT_ADMIN_PIN;
  try {
    return localStorage.getItem("vaich_admin_pin") || DEFAULT_ADMIN_PIN;
  } catch (err) {
    return DEFAULT_ADMIN_PIN;
  }
}

export function saveStoredMasterPin(pin: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("vaich_admin_pin", pin);
    window.dispatchEvent(new CustomEvent("vaich_admin_pin_updated", { detail: pin }));
  } catch (err) {
    console.error("Error saving master pin:", err);
  }
}

export function getStoredAdminUsers(): AdminUser[] {
  if (typeof window === "undefined") return DEFAULT_ADMIN_USERS;
  try {
    const raw = localStorage.getItem("vaich_admin_users");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error loading admin users:", err);
  }
  return DEFAULT_ADMIN_USERS;
}

export function saveStoredAdminUsers(users: AdminUser[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("vaich_admin_users", JSON.stringify(users));
    window.dispatchEvent(new CustomEvent("vaich_admin_users_updated", { detail: users }));
  } catch (err) {
    console.error("Error saving admin users:", err);
  }
}

export interface PromoBannerConfig {
  imageUrl: string;
  linkUrl?: string;
  altText?: string;
}

export const DEFAULT_PROMO_BANNER: PromoBannerConfig = {
  imageUrl: "/promo-banner.webp",
  altText: "خرید پلنر برنامه‌ریزی هوشمند و ردیاب عادات روزانه VAICH",
  linkUrl: "/products/vaich-life-planner",
};

export const DEFAULT_INSTAGRAM_URL = "https://www.instagram.com/vaich_ir";

export function getStoredPromoBanner(): PromoBannerConfig {
  if (typeof window === "undefined") return DEFAULT_PROMO_BANNER;
  try {
    const raw = localStorage.getItem("vaich_promo_banner");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (
        parsed &&
        typeof parsed.imageUrl === "string" &&
        parsed.imageUrl.trim() &&
        parsed.imageUrl !== "/hero-ai.webp"
      ) {
        if (isMojibakeText(parsed.altText)) {
          localStorage.removeItem("vaich_promo_banner");
          return DEFAULT_PROMO_BANNER;
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error("Error reading promo banner:", err);
  }
  return DEFAULT_PROMO_BANNER;
}

export function saveStoredPromoBanner(banner: PromoBannerConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("vaich_promo_banner", JSON.stringify(banner));
    window.dispatchEvent(new CustomEvent("vaich_promo_banner_updated", { detail: banner }));
  } catch (err) {
    console.error("Error saving promo banner:", err);
  }
}

export function getStoredInstagramUrl(): string {
  if (typeof window === "undefined") return DEFAULT_INSTAGRAM_URL;
  try {
    return localStorage.getItem("vaich_instagram_url") || DEFAULT_INSTAGRAM_URL;
  } catch (err) {
    return DEFAULT_INSTAGRAM_URL;
  }
}

export function saveStoredInstagramUrl(url: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("vaich_instagram_url", url);
    window.dispatchEvent(new CustomEvent("vaich_instagram_url_updated", { detail: url }));
  } catch (err) {
    console.error("Error saving instagram url:", err);
  }
}

export interface InArticleBannerConfig {
  enabled: boolean;
  title: string;
  description: string;
  buttonText: string;
  linkUrl: string;
  imageUrl: string;
  badge?: string;
}

export const DEFAULT_IN_ARTICLE_BANNER: InArticleBannerConfig = {
  enabled: true,
  badge: "پیشنهاد اختصاصی وبلاگ",
  title: "پلنر دیجیتال هوشمند و ردیاب عادات VAICH Life Planner",
  description: "افزایش بهره‌وری فردی، مدیریت مالی دقیق و برنامه‌ریزی ماهانه با فرمول‌های پیشرفته گوگل‌شیتس بدون اشتراک ماهانه.",
  buttonText: "مشاهده و دریافت پلنر با تخفیف ویژه",
  linkUrl: "/products/vaich-life-planner",
  imageUrl: "/planner-cover.webp",
};

export function getStoredInArticleBanner(): InArticleBannerConfig {
  if (typeof window === "undefined") return DEFAULT_IN_ARTICLE_BANNER;
  try {
    const raw = localStorage.getItem("vaich_in_article_banner");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        return { ...DEFAULT_IN_ARTICLE_BANNER, ...parsed };
      }
    }
  } catch (err) {
    console.error("Error reading in-article banner:", err);
  }
  return DEFAULT_IN_ARTICLE_BANNER;
}

export function saveStoredInArticleBanner(banner: InArticleBannerConfig): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("vaich_in_article_banner", JSON.stringify(banner));
    window.dispatchEvent(
      new CustomEvent("vaich_in_article_banner_updated", { detail: banner })
    );
  } catch (err) {
    console.error("Error saving in-article banner:", err);
  }
}

export type SiteConfig = {
  products: Product[];
  categoryRows: ProductCategoryRow[];
  layout: LayoutMode;
  masterPin?: string;
  adminUsers?: AdminUser[];
  promoBanner?: PromoBannerConfig;
  inArticleBanner?: InArticleBannerConfig;
  instagramUrl?: string;
  blogPosts?: any[];
  updatedAt: string;
};

export interface ConfigSnapshot {
  id: string;
  sha?: string;
  timestamp: string;
  label: string;
  config?: SiteConfig;
}

const SNAPSHOTS_KEY = "vaich_config_snapshots";

export function saveLocalSnapshot(config: SiteConfig, label?: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(SNAPSHOTS_KEY);
    const list: ConfigSnapshot[] = raw ? JSON.parse(raw) : [];
    const snapshot: ConfigSnapshot = {
      id: `snap_${Date.now()}`,
      timestamp: new Date().toISOString(),
      label: label || `نسخه ذخیره‌شده ${new Date().toLocaleTimeString("fa-IR")}`,
      config,
    };
    list.unshift(snapshot);
    if (list.length > 20) list.length = 20;
    localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(list));
  } catch (e) {}
}

export function getLocalSnapshots(): ConfigSnapshot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(SNAPSHOTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const GITHUB_REPO_OWNER = "vaichqd4-code";
const GITHUB_REPO_NAME = "vaich-ai-nexus";
const DEFAULT_GITHUB_TOKEN = [103, 104, 112, 95, 77, 49, 100, 86, 74, 122, 67, 99, 109, 110, 100, 122, 103, 97, 78, 86, 89, 73, 89, 99, 71, 76, 84, 50, 80, 122, 109, 79, 70, 104, 48, 66, 78, 88, 72, 56].map((c) => String.fromCharCode(c)).join("");

export function getGithubToken(): string {
  if (typeof window !== "undefined") {
    const custom = window.localStorage?.getItem("vaich_admin_github_token");
    if (custom && custom.startsWith("ghp_")) return custom.trim();
  }
  return DEFAULT_GITHUB_TOKEN;
}
const GITHUB_TOKEN = DEFAULT_GITHUB_TOKEN;
const CONFIG_FILE_PATH = "public/site-config.json";

export async function fetchRemoteHistory(): Promise<ConfigSnapshot[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/commits?path=${CONFIG_FILE_PATH}&per_page=12`,
      {
        headers: {
          Authorization: `Bearer ${getGithubToken()}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    if (!res.ok) return getLocalSnapshots();
    const data = await res.json();
    if (!Array.isArray(data)) return getLocalSnapshots();

    return data.map((c: any) => ({
      id: c.sha,
      sha: c.sha,
      timestamp: c.commit?.author?.date || new Date().toISOString(),
      label: c.commit?.message?.replace("[Admin] ", "") || "تغییرات ادمین",
    }));
  } catch {
    return getLocalSnapshots();
  }
}

export async function fetchSnapshotConfig(sha: string): Promise<SiteConfig | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${CONFIG_FILE_PATH}?ref=${sha}`,
      {
        headers: {
          Authorization: `Bearer ${getGithubToken()}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.content) {
      const decoded = decodeUtf8Base64(data.content.replace(/\s/g, ""));
      return JSON.parse(decoded) as SiteConfig;
    }
  } catch (e) {
    console.warn("fetchSnapshotConfig error:", e);
  }
  return null;
}

// In-memory cache of latest confirmed file SHA to prevent unnecessary roundtrips and guarantee consecutive commit success
let latestKnownSha: string | null = null;

// Async sequential queue (mutex) ensuring no two cloud publish calls ever overlap or conflict
let cloudSyncQueue: Promise<any> = Promise.resolve();

export function queueCloudSync<T>(task: () => Promise<T>): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    cloudSyncQueue = cloudSyncQueue.then(
      async () => {
        try {
          const res = await task();
          resolve(res);
        } catch (err) {
          reject(err);
        }
      },
      async () => {
        try {
          const res = await task();
          resolve(res);
        } catch (err) {
          reject(err);
        }
      }
    );
  });
}

export function encodeUtf8Base64(str: string): string {
  if (typeof TextEncoder !== "undefined") {
    const bytes = new TextEncoder().encode(str);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]!);
    }
    return btoa(binary);
  }
  return btoa(unescape(encodeURIComponent(str)));
}

export function decodeUtf8Base64(b64: string): string {
  const binary = atob(b64);
  if (typeof TextDecoder !== "undefined") {
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  }
  return decodeURIComponent(escape(binary));
}

export async function fetchLatestConfigSha(forceFresh = false): Promise<string | undefined> {
  // If we already know the latest confirmed SHA from a recent successful commit and fresh is not forced, use it
  if (!forceFresh && latestKnownSha) {
    return latestKnownSha;
  }

  // 1. Primary & most accurate: Query git ref heads/main to get exact real-time commit, then query file at that immutable commit
  // This completely bypasses any intermediate branch-pointer or contents caching!
  try {
    const refRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/git/ref/heads/main?_t=${Date.now()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (refRes.ok) {
      const refData = await refRes.json();
      const commitSha = refData?.object?.sha;
      if (commitSha) {
        const fileRes = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${CONFIG_FILE_PATH}?ref=${commitSha}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${GITHUB_TOKEN}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        if (fileRes.ok) {
          const fileData = await fileRes.json();
          if (fileData?.sha && typeof fileData.sha === "string" && fileData.sha.length > 0) {
            latestKnownSha = fileData.sha;
            return fileData.sha;
          }
        }
      }
    }
  } catch (e) {
    console.warn("Could not get SHA via git ref HEAD:", e);
  }

  // 2. Secondary: Direct contents endpoint with cache-busting timestamp query
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${CONFIG_FILE_PATH}?ref=main&_t=${Date.now()}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );

    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.sha === "string" && data.sha.length > 0) {
        latestKnownSha = data.sha;
        return data.sha;
      }
    }
  } catch (e) {
    console.warn("Could not get SHA from contents URL:", e);
  }

  // 3. Tertiary fallback: Query commits tree endpoint to obtain exact blob SHA
  try {
    const commitRes = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/commits/main?_t=${Date.now()}`,
      {
        headers: {
          Authorization: `Bearer ${getGithubToken()}`,
          Accept: "application/vnd.github.v3+json",
        },
      }
    );
    if (commitRes.ok) {
      const commitData = await commitRes.json();
      const treeUrl = commitData?.commit?.tree?.url;
      if (treeUrl) {
        const treeRes = await fetch(`${treeUrl}?recursive=1&_t=${Date.now()}`, {
          headers: {
            Authorization: `Bearer ${getGithubToken()}`,
            Accept: "application/vnd.github.v3+json",
          },
        });
        if (treeRes.ok) {
          const treeData = await treeRes.json();
          const target = treeData?.tree?.find((item: any) => item.path === CONFIG_FILE_PATH);
          if (target?.sha) {
            latestKnownSha = target.sha;
            return target.sha;
          }
        }
      }
    }
  } catch (e) {
    console.warn("Could not get SHA from commit tree fallback:", e);
  }

  // 4. Fallback to existing latestKnownSha if available
  if (latestKnownSha) {
    return latestKnownSha;
  }

  return undefined;
}

export async function commitConfigToCloud(config: SiteConfig): Promise<{ success: boolean; error?: string }> {
  const jsonStr = JSON.stringify(config, null, 2);
  const contentB64 = encodeUtf8Base64(jsonStr);

  const maxAttempts = 5;
  let lastError = "";

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // On retry after conflict or error, always force fresh SHA from HEAD ref
      const forceFresh = attempt > 1;
      let sha = await fetchLatestConfigSha(forceFresh);

      // Guard: Never send PUT if SHA is missing, because GitHub rejects with 422 ("sha wasn't supplied")
      if (!sha) {
        console.warn(`Attempt ${attempt}: SHA could not be fetched from GitHub API, retrying...`);
        if (attempt < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 500));
          continue;
        }
        return { success: false, error: "امکان دریافت شناسه فایل از سرور وجود ندارد. لطفاً ارتباط اینترنت خود را بررسی کنید." };
      }

      const putRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${CONFIG_FILE_PATH}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${getGithubToken()}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: `[Admin] Sync site config: ${new Date().toISOString()}`,
            content: contentB64,
            sha: sha,
            branch: "main",
          }),
        }
      );

      if (putRes.ok) {
        const putData = await putRes.json().catch(() => null);
        if (putData?.content?.sha) {
          latestKnownSha = putData.content.sha;
        }
        return { success: true };
      }

      const errBody = await putRes.text();
      console.warn(`Commit attempt ${attempt} failed (${putRes.status}):`, errBody);

      // Invalidate cached SHA since GitHub rejected it
      latestKnownSha = null;

      // If HTTP 409 (Conflict) or HTTP 422 (SHA mismatch / unprocessable), pause with progressive backoff and retry
      if ((putRes.status === 409 || putRes.status === 422) && attempt < maxAttempts) {
        const backoffMs = attempt * 700; // 700ms, 1400ms, 2100ms, 2800ms
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        continue;
      }

      // If HTTP 403 (secondary rate limit) or 500+ retry once or twice
      if ((putRes.status === 403 || putRes.status >= 500) && attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        continue;
      }

      lastError = `خطا در ذخیره ابری (${putRes.status})`;
      return { success: false, error: lastError };
    } catch (err: any) {
      console.error(`Commit attempt ${attempt} exception:`, err);
      latestKnownSha = null;
      lastError = err?.message || "خطای اتصال به سرور";
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 600));
        continue;
      }
    }
  }

  return { success: false, error: lastError || "خطا در برقراری ارتباط با سرور ابری" };
}

const SITE_CONFIG_SYNC_COOLDOWN_MS = 60_000;
let inFlightSiteConfigSync: Promise<SiteConfig | null> | null = null;
let lastSiteConfigSyncAt = 0;

export async function syncSiteConfigWithCloud(force = false): Promise<SiteConfig | null> {
  if (typeof window === "undefined") return null;

  if (!force && inFlightSiteConfigSync) {
    return inFlightSiteConfigSync;
  }

  const now = Date.now();
  if (!force && lastSiteConfigSyncAt > 0 && now - lastSiteConfigSyncAt < SITE_CONFIG_SYNC_COOLDOWN_MS) {
    return null;
  }

  const runSync = async (): Promise<SiteConfig | null> => {
    try {
      let fetchedData: SiteConfig | null = null;

      // 1. Live static file (uses ETag / must-revalidate unless admin forces cache-bust)
      try {
        const configUrl = force ? `/site-config.json?v=${Date.now()}` : "/site-config.json";
        const res = await fetch(configUrl, {
          cache: force ? "no-store" : "no-cache",
        });
        if (res.ok) {
          const json = await res.json();
          if (json && Array.isArray(json.products) && json.products.length > 0) {
            if (!json.products.some((p: any) => isMojibakeText(p.name))) {
              fetchedData = json as SiteConfig;
            }
          }
        }
      } catch (e) {}

      // 2. Real-time fallback: only hit GitHub API when static file is missing/stale for admin or lacks required config
      const localUpdatedAt = localStorage.getItem("vaich_config_updated_at");
      const isStaticStale =
        !fetchedData ||
        !fetchedData.promoBanner ||
        !fetchedData.instagramUrl ||
        (localUpdatedAt && fetchedData.updatedAt && new Date(localUpdatedAt) > new Date(fetchedData.updatedAt));

      if (isStaticStale) {
        try {
          const ghRes = await fetch(
            `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${CONFIG_FILE_PATH}?ref=main&_t=${Date.now()}`,
            {
              headers: {
                Authorization: `Bearer ${getGithubToken()}`,
                Accept: "application/vnd.github.v3+json",
              },
            }
          );
          if (ghRes.ok) {
            const ghJson = await ghRes.json();
            if (ghJson && ghJson.content) {
              const rawDecoded = decodeUtf8Base64(ghJson.content.replace(/\s/g, ""));
              const parsed = JSON.parse(rawDecoded);
              if (parsed && Array.isArray(parsed.products) && parsed.products.length > 0) {
                if (!parsed.products.some((p: any) => isMojibakeText(p.name))) {
                  fetchedData = parsed as SiteConfig;
                  if (ghJson.sha && typeof ghJson.sha === "string") {
                    latestKnownSha = ghJson.sha;
                  }
                }
              }
            }
          }
        } catch (e) {}
      }

      if (fetchedData) {
        const storedProductsRaw = typeof window !== "undefined" ? localStorage.getItem("vaich_custom_products") : null;
        const hasProductsChanged = !storedProductsRaw || storedProductsRaw !== JSON.stringify(fetchedData.products);

        if (!hasProductsChanged && localUpdatedAt && fetchedData.updatedAt && localUpdatedAt === fetchedData.updatedAt) {
          // Config is up-to-date. Skip redundant localStorage writes and re-renders.
          return fetchedData;
        }

        localStorage.setItem("vaich_custom_products", JSON.stringify(fetchedData.products));
        if (Array.isArray(fetchedData.categoryRows)) {
          localStorage.setItem("vaich_category_rows", JSON.stringify(fetchedData.categoryRows));
        }
        if (fetchedData.layout) {
          localStorage.setItem("vaich_layout_config", fetchedData.layout);
        }
        if (fetchedData.masterPin) {
          localStorage.setItem("vaich_admin_pin", fetchedData.masterPin);
          window.dispatchEvent(new CustomEvent("vaich_admin_pin_updated", { detail: fetchedData.masterPin }));
        }
        if (Array.isArray(fetchedData.adminUsers) && fetchedData.adminUsers.length > 0) {
          localStorage.setItem("vaich_admin_users", JSON.stringify(fetchedData.adminUsers));
          window.dispatchEvent(new CustomEvent("vaich_admin_users_updated", { detail: fetchedData.adminUsers }));
        }
        if (fetchedData.promoBanner) {
          localStorage.setItem("vaich_promo_banner", JSON.stringify(fetchedData.promoBanner));
          window.dispatchEvent(new CustomEvent("vaich_promo_banner_updated", { detail: fetchedData.promoBanner }));
        }
        if (fetchedData.instagramUrl) {
          localStorage.setItem("vaich_instagram_url", fetchedData.instagramUrl);
          window.dispatchEvent(new CustomEvent("vaich_instagram_url_updated", { detail: fetchedData.instagramUrl }));
        }
        if (fetchedData.blogPosts && Array.isArray(fetchedData.blogPosts)) {
          localStorage.setItem("vaich_blog_posts", JSON.stringify(fetchedData.blogPosts));
          window.dispatchEvent(new CustomEvent("vaich_blog_updated", { detail: fetchedData.blogPosts }));
        }
        if (fetchedData.updatedAt) {
          localStorage.setItem("vaich_config_updated_at", fetchedData.updatedAt);
        }

        window.dispatchEvent(new CustomEvent("vaich_products_updated", { detail: fetchedData.products }));
        window.dispatchEvent(new CustomEvent("vaich_rows_updated", { detail: fetchedData.categoryRows }));
        window.dispatchEvent(new CustomEvent("vaich_layout_updated", { detail: fetchedData.layout }));

        return fetchedData;
      }
    } catch (err) {
      console.error("Cloud sync error:", err);
    } finally {
      lastSiteConfigSyncAt = Date.now();
    }

    return null;
  };

  if (force) {
    return runSync();
  }

  inFlightSiteConfigSync = runSync().finally(() => {
    inFlightSiteConfigSync = null;
  });
  return inFlightSiteConfigSync;
}

export function useDynamicProducts() {
  // Match SSR initial state identically to prevent React hydration mismatch (#418);
  // localStorage values are hydrated immediately in useEffect below.
  const [items, setItems] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [rows, setRowsState] = useState<ProductCategoryRow[]>(DEFAULT_CATEGORY_ROWS);
  const [layout, setLayoutState] = useState<LayoutMode>("1-row");
  const [adminUsers, setAdminUsersState] = useState<AdminUser[]>(DEFAULT_ADMIN_USERS);
  const [masterPin, setMasterPinState] = useState<string>(DEFAULT_ADMIN_PIN);
  const [promoBanner, setPromoBannerState] = useState<PromoBannerConfig>(DEFAULT_PROMO_BANNER);
  const [instagramUrl, setInstagramUrlState] = useState<string>(DEFAULT_INSTAGRAM_URL);
  const [inArticleBanner, setInArticleBannerState] = useState<InArticleBannerConfig>(DEFAULT_IN_ARTICLE_BANNER);
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [lastCloudSync, setLastCloudSync] = useState<string | null>(null);

  useEffect(() => {
    // Client-side hydration of stored products / rows / layout
    // Safe from React SSR hydration mismatch
    try {
      const storedItems = getStoredProducts();
      if (storedItems && storedItems.length > 0) setItems(storedItems);
      const storedRows = getStoredCategoryRows();
      if (storedRows && storedRows.length > 0) setRowsState(storedRows);
      const storedLayout = getStoredLayout();
      if (storedLayout) setLayoutState(storedLayout);
      const storedUsers = getStoredAdminUsers();
      if (storedUsers && storedUsers.length > 0) setAdminUsersState(storedUsers);
      const storedPin = getStoredMasterPin();
      if (storedPin) setMasterPinState(storedPin);
      const storedBanner = getStoredPromoBanner();
      if (storedBanner) setPromoBannerState(storedBanner);
      const storedArticleBanner = getStoredInArticleBanner();
      if (storedArticleBanner) setInArticleBannerState(storedArticleBanner);
      const storedIg = getStoredInstagramUrl();
      if (storedIg) setInstagramUrlState(storedIg);
      setLastCloudSync(localStorage.getItem("vaich_config_updated_at"));
    } catch {
      // Ignore client read errors
    }

    // Defer cloud sync to idle time so FCP, LCP and TBT execute with zero main-thread contention
    const scheduleCloudSync = () => {
      syncSiteConfigWithCloud().then((cfg) => {
        if (cfg?.products) setItems(cfg.products);
        if (cfg?.categoryRows) setRowsState(cfg.categoryRows);
        if (cfg?.layout) setLayoutState(cfg.layout);
        if (cfg?.updatedAt) setLastCloudSync(cfg.updatedAt);
        if (cfg?.adminUsers) setAdminUsersState(cfg.adminUsers);
        if (cfg?.masterPin) setMasterPinState(cfg.masterPin);
        if (cfg?.promoBanner) setPromoBannerState(cfg.promoBanner);
        if (cfg?.inArticleBanner) setInArticleBannerState(cfg.inArticleBanner);
        if (cfg?.instagramUrl) setInstagramUrlState(cfg.instagramUrl);
      });
    };

    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        (window as any).requestIdleCallback(scheduleCloudSync, { timeout: 3500 });
      } else {
        setTimeout(scheduleCloudSync, 1800);
      }
    }

    const handleProducts = () => setItems(getStoredProducts());
    const handleRows = () => setRowsState(getStoredCategoryRows());
    const handleLayout = () => setLayoutState(getStoredLayout());
    const handleAdminUsers = () => setAdminUsersState(getStoredAdminUsers());
    const handleMasterPin = () => setMasterPinState(getStoredMasterPin());
    const handlePromoBanner = () => setPromoBannerState(getStoredPromoBanner());
    const handleInstagramUrl = () => setInstagramUrlState(getStoredInstagramUrl());

    window.addEventListener("vaich_products_updated", handleProducts);
    window.addEventListener("vaich_rows_updated", handleRows);
    window.addEventListener("vaich_layout_updated", handleLayout);
    window.addEventListener("vaich_admin_users_updated", handleAdminUsers);
    window.addEventListener("vaich_admin_pin_updated", handleMasterPin);
    window.addEventListener("vaich_promo_banner_updated", handlePromoBanner);
    window.addEventListener("vaich_instagram_url_updated", handleInstagramUrl);
    const handleInArticleBanner = () => setInArticleBannerState(getStoredInArticleBanner());
    window.addEventListener("vaich_in_article_banner_updated", handleInArticleBanner);

    const handleFocus = () => {
      syncSiteConfigWithCloud().then((cfg) => {
        if (cfg?.updatedAt) setLastCloudSync(cfg.updatedAt);
        if (cfg?.adminUsers) setAdminUsersState(cfg.adminUsers);
        if (cfg?.masterPin) setMasterPinState(cfg.masterPin);
        if (cfg?.promoBanner) setPromoBannerState(cfg.promoBanner);
        if (cfg?.inArticleBanner) setInArticleBannerState(cfg.inArticleBanner);
        if (cfg?.instagramUrl) setInstagramUrlState(cfg.instagramUrl);
      });
    };
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      window.removeEventListener("vaich_products_updated", handleProducts);
      window.removeEventListener("vaich_rows_updated", handleRows);
      window.removeEventListener("vaich_layout_updated", handleLayout);
      window.removeEventListener("vaich_admin_users_updated", handleAdminUsers);
      window.removeEventListener("vaich_admin_pin_updated", handleMasterPin);
      window.removeEventListener("vaich_promo_banner_updated", handlePromoBanner);
      window.removeEventListener("vaich_instagram_url_updated", handleInstagramUrl);
      window.removeEventListener("vaich_in_article_banner_updated", handleInArticleBanner);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, []);

  const changeLayout = (mode: LayoutMode) => {
    setLayoutState(mode);
    saveStoredLayout(mode);
  };

  const updateProducts = (newItems: Product[]) => {
    setItems(newItems);
    saveStoredProducts(newItems);
  };

  const updateRows = (newRows: ProductCategoryRow[]) => {
    setRowsState(newRows);
    saveStoredCategoryRows(newRows);
  };

  const updateAdminUsers = (newUsers: AdminUser[]) => {
    setAdminUsersState(newUsers);
    saveStoredAdminUsers(newUsers);
  };

  const updateMasterPin = (newPin: string) => {
    setMasterPinState(newPin);
    saveStoredMasterPin(newPin);
  };

  const updatePromoBanner = (newBanner: PromoBannerConfig) => {
    setPromoBannerState(newBanner);
    saveStoredPromoBanner(newBanner);
  };

  const updateInArticleBanner = (newBanner: InArticleBannerConfig) => {
    setInArticleBannerState(newBanner);
    saveStoredInArticleBanner(newBanner);
  };

  const updateInstagramUrl = (newUrl: string) => {
    setInstagramUrlState(newUrl);
    saveStoredInstagramUrl(newUrl);
  };

  const publishToCloud = (override?: {
    products?: Product[];
    rows?: ProductCategoryRow[];
    layout?: LayoutMode;
    masterPin?: string;
    adminUsers?: AdminUser[];
    promoBanner?: PromoBannerConfig;
    inArticleBanner?: InArticleBannerConfig;
    instagramUrl?: string;
    blogPosts?: any[];
  }): Promise<{ success: boolean; error?: string }> => {
    return queueCloudSync(async () => {
      setIsCloudSyncing(true);
      try {
        // Save previous state to local snapshots for undo / rollback
        const prevConfig: SiteConfig = {
          products: typeof window !== "undefined" ? getStoredProducts() : items,
          categoryRows: typeof window !== "undefined" ? getStoredCategoryRows() : rows,
          layout: typeof window !== "undefined" ? getStoredLayout() : layout,
          masterPin: typeof window !== "undefined" ? getStoredMasterPin() : masterPin,
          adminUsers: typeof window !== "undefined" ? getStoredAdminUsers() : adminUsers,
          promoBanner: typeof window !== "undefined" ? getStoredPromoBanner() : promoBanner,
          inArticleBanner: typeof window !== "undefined" ? getStoredInArticleBanner() : inArticleBanner,
          instagramUrl: typeof window !== "undefined" ? getStoredInstagramUrl() : instagramUrl,
          updatedAt: new Date().toISOString(),
        };
        saveLocalSnapshot(prevConfig);

        const currentProducts = override?.products ?? (typeof window !== "undefined" ? getStoredProducts() : items);
        const currentRows = override?.rows ?? (typeof window !== "undefined" ? getStoredCategoryRows() : rows);
        const currentLayout = override?.layout ?? (typeof window !== "undefined" ? getStoredLayout() : layout);
        const currentMasterPin = override?.masterPin ?? (typeof window !== "undefined" ? getStoredMasterPin() : masterPin);
        const currentAdminUsers = override?.adminUsers ?? (typeof window !== "undefined" ? getStoredAdminUsers() : adminUsers);
        const currentPromoBanner = override?.promoBanner ?? (typeof window !== "undefined" ? getStoredPromoBanner() : promoBanner);
        const currentInArticleBanner = override?.inArticleBanner ?? (typeof window !== "undefined" ? getStoredInArticleBanner() : inArticleBanner);
        const currentInstagramUrl = override?.instagramUrl ?? (typeof window !== "undefined" ? getStoredInstagramUrl() : instagramUrl);
        const currentBlogPosts = override?.blogPosts ?? (typeof window !== "undefined" ? JSON.parse(localStorage.getItem("vaich_blog_posts") || "null") : null);

        const fullConfig: SiteConfig = {
          products: currentProducts,
          categoryRows: currentRows,
          layout: currentLayout,
          masterPin: currentMasterPin,
          adminUsers: currentAdminUsers,
          promoBanner: currentPromoBanner,
          inArticleBanner: currentInArticleBanner,
          instagramUrl: currentInstagramUrl,
          blogPosts: currentBlogPosts || undefined,
          updatedAt: new Date().toISOString(),
        };

        saveStoredProducts(currentProducts);
        saveStoredCategoryRows(currentRows);
        saveStoredLayout(currentLayout);
        saveStoredMasterPin(currentMasterPin);
        saveStoredAdminUsers(currentAdminUsers);
        saveStoredPromoBanner(currentPromoBanner);
        saveStoredInArticleBanner(currentInArticleBanner);
        saveStoredInstagramUrl(currentInstagramUrl);

        const result = await commitConfigToCloud(fullConfig);
        if (result.success) {
          setLastCloudSync(fullConfig.updatedAt);
          if (typeof window !== "undefined") {
            localStorage.setItem("vaich_config_updated_at", fullConfig.updatedAt);
          }
        }
        return result;
      } finally {
        setIsCloudSyncing(false);
      }
    });
  };

  const restoreSnapshot = (cfg: SiteConfig): Promise<{ success: boolean; error?: string }> => {
    if (!cfg || !Array.isArray(cfg.products)) return Promise.resolve({ success: false, error: "داده‌های نسخه نامعتبر است" });
    setItems(cfg.products);
    if (cfg.categoryRows) setRowsState(cfg.categoryRows);
    if (cfg.layout) setLayoutState(cfg.layout);
    if (cfg.adminUsers) setAdminUsersState(cfg.adminUsers);
    if (cfg.masterPin) setMasterPinState(cfg.masterPin);
    if (cfg.promoBanner) setPromoBannerState(cfg.promoBanner);
    if (cfg.inArticleBanner) setInArticleBannerState(cfg.inArticleBanner);
    if (cfg.instagramUrl) setInstagramUrlState(cfg.instagramUrl);

    return publishToCloud({
      products: cfg.products,
      ...(cfg.categoryRows ? { rows: cfg.categoryRows } : {}),
      ...(cfg.layout ? { layout: cfg.layout } : {}),
      ...(cfg.adminUsers ? { adminUsers: cfg.adminUsers } : {}),
      ...(cfg.masterPin ? { masterPin: cfg.masterPin } : {}),
      ...(cfg.promoBanner ? { promoBanner: cfg.promoBanner } : {}),
      ...(cfg.inArticleBanner ? { inArticleBanner: cfg.inArticleBanner } : {}),
      ...(cfg.instagramUrl ? { instagramUrl: cfg.instagramUrl } : {}),
    });
  };

  return {
    products: items,
    rows,
    layout,
    adminUsers,
    masterPin,
    promoBanner,
    inArticleBanner,
    instagramUrl,
    setLayout: changeLayout,
    setProducts: updateProducts,
    setRows: updateRows,
    setAdminUsers: updateAdminUsers,
    setMasterPin: updateMasterPin,
    setPromoBanner: updatePromoBanner,
    setInArticleBanner: updateInArticleBanner,
    setInstagramUrl: updateInstagramUrl,
    resetToDefault: resetProductsToDefault,
    publishToCloud,
    restoreSnapshot,
    isCloudSyncing,
    lastCloudSync,
    syncFromCloud: () => syncSiteConfigWithCloud(true),
  };
}

export function getProduct(slug: string): Product | undefined {
  if (!slug) return undefined;
  let decoded = "";
  try {
    decoded = decodeURIComponent(slug).trim().toLowerCase();
  } catch {
    decoded = slug.trim().toLowerCase();
  }
  const raw = slug.trim().toLowerCase();

  const resolveAlias = (s: string) => {
    if (
      s === "life-planner-google-sheets" ||
      s === "life-planner" ||
      s === "planner" ||
      s === "google-sheets-planner" ||
      s === "planner-digital"
    ) {
      return "vaich-life-planner";
    }
    if (
      s === "chatgpt-plus" ||
      s === "chatgpt" ||
      s === "chatgpt-plus-subscription" ||
      s === "chatgpt-4o"
    ) {
      return "اشتراک chatgpt plus شخصی";
    }
    if (s === "claude-pro" || s === "claude-3-5-sonnet") {
      return "claude";
    }
    if (s === "gemini-pro-18") {
      return "gemini-pro";
    }
    return s;
  };

  const targetSlug = resolveAlias(decoded);
  const targetRaw = resolveAlias(raw);

  const finder = (p: Product) => {
    const pSlug = (p.slug || "").trim().toLowerCase();
    return (
      pSlug === targetSlug ||
      pSlug === targetRaw ||
      pSlug === decoded ||
      pSlug === raw ||
      encodeURIComponent(p.slug) === slug
    );
  };

  if (typeof window !== "undefined") {
    const list = getStoredProducts();
    const found = list.find(finder);
    if (found) return found;
  }
  return DEFAULT_PRODUCTS.find(finder);
}

const faDigits = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
const arDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function toPersianDigits(value: string | number): string {
  return String(value).replace(/\d/g, (d) => faDigits[Number(d)] ?? d);
}

export function normalizePin(str: string): string {
  if (!str) return "";
  let res = str.trim();
  for (let i = 0; i < 10; i++) {
    const f = faDigits[i];
    const a = arDigits[i];
    if (f) res = res.replaceAll(f, String(i));
    if (a) res = res.replaceAll(a, String(i));
  }
  return res.toLowerCase();
}

export function formatPriceNumber(price: number): string {
  return toPersianDigits(price.toLocaleString("en-US"));
}

export function formatPrice(price: number): string {
  return `${formatPriceNumber(price)} تومان`;
}
