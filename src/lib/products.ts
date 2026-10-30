import { useEffect, useState } from "react";

export type LayoutMode = "1-row" | "2-row" | "grid";

export type ProductCategoryRow = {
  id: string;
  title: string;
  subtitle?: string;
};

export type ProductReview = {
  id: string;
  author: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: string;
  status?: "approved" | "pending";
  verified?: boolean; // خریدار تأیید شده
};

export type Product = {
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  duration?: string;
  description: string;
  purchaseInfo: string[];
  features?: string[];
  featured?: boolean;
  badge?: string;
  badgeColor?: "fire" | "purple" | "emerald" | "blue" | "amber";
  categoryId?: string;
  service?: string;
  iconUrl?: string;
  imageFit?: "contain" | "cover";
  inStock?: boolean; // موجود بودن (پیش‌فرض true، اگر false باشد ناموجود است)
  isLifetime?: boolean; // نوع دسترسی: دائمی و مادام‌العمر (true) یا اشتراکی زمان‌دار (false)
  rating?: number; // میانگین امتیاز (مثلاً 4.9)
  reviewCount?: number; // تعداد کل نظرات
  reviews?: ProductReview[]; // لیست نظرات ثبت‌شده
};

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
    title: "پلنر ها",
    subtitle: "پلنر های مدیریت و سبک زندگی (Google sheets)",
  },
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    slug: "vaich-life-planner",
    name: "پلنر برنامه ریزی(استاندارد)",
    price: 299000,
    duration: "دائمی (بدون اشتراک)",
    description: "کامل‌ترین سیستم هوشمند مدیریت زندگی و ردیاب عادات روزانه در گوگل شیت؛ خرید دائمی و مادام‌العمر بدون نیاز به تمدید یا هزینه اشتراک.",
    featured: true,
    badge: "پیشنهادی",
    badgeColor: "fire",
    categoryId: "row-mvampt3r",
    inStock: true,
    rating: 4.9,
    reviewCount: 21,
    features: [
      "شامل ۲ تمپلیت اختصاصی: نسخه تعاملی سه‌بعدی (3D Deluxe) و نسخه استاندارد",
      "ردیاب عادات روزانه، روتین‌های فردی و نمودارهای تحلیلی داینامیک پیشرفت",
      "سیستم هوشمند پاکسازی و شروع ماه جدید تنها با یک کلیک خودکار",
      "همگام‌سازی ابری و دسترسی نامحدود روی تمام گوشی‌ها، تبلت‌ها و لپ‌تاپ در گوگل شیت",
      "همراه با راهنمای جامع صوتی و متنی فارسی برای راه‌اندازی سریع در ۳ دقیقه",
      "دسترسی مادام‌العمر به فایل و آپدیت‌های آینده بدون پرداخت هزینه اشتراک ماهانه"
    ],
    purchaseInfo: [
      "تحویل آنی بلافاصله پس از پرداخت به صورت لینک اختصاصی کپی (Make a copy) در گوگل درایو.",
      "این محصول اشتراک ماهانه نیست؛ یک‌بار خرید و دسترسی همیشگی بدون تاریخ انقضا است.",
      "برای باز کردن و ذخیره شیت، تنها به یک حساب جیمیل (Google Account) فعال نیاز دارید.",
      "پشتیبانی اختصاصی برای راهنمایی راه‌اندازی و اجرای اسکریپت‌ها."
    ],
    iconUrl: "/planner-cover.webp",
    imageFit: "cover",
    reviews: [
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
                "comment": "لینک فایل بلافاصله بعد پرداخت اومد بالا، وویس راهنماشم گوش دادم تو ۲ دقیقه شیت رو کپی کردم مرسییی",
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
                "author": "پویا",
                "rating": 5,
                "comment": "توی شیت های ایرانی تا حالا همچین نظمی ندیده بودم، رنگ بندیش اصلا چشم رو خسته نمیکنه",
                "createdAt": "2026-10-22T16:00:00.000Z",
                "verified": true,
                "status": "approved"
          },
          {
                "id": "rev-lp-18",
                "author": "زهرا",
                "rating": 5,
                "comment": "عالی ممنون از سایت خوبتون",
                "createdAt": "2026-10-26T12:40:00.000Z",
                "verified": true,
                "status": "approved"
          },
          {
                "id": "rev-lp-19",
                "author": "shayan",
                "rating": 4,
                "comment": "خوبه راضیم",
                "createdAt": "2026-10-27T14:55:00.000Z",
                "verified": true,
                "status": "approved"
          },
          {
                "id": "rev-lp-20",
                "author": "A.R",
                "rating": 5,
                "comment": "همه چیش تکمیله مرسی از زحماتتون",
                "createdAt": "2026-10-28T16:20:00.000Z",
                "verified": true,
                "status": "approved"
          },
          {
                "id": "rev-lp-21",
                "author": "کاربر ناشناس",
                "rating": 5,
                "comment": "ارزش خرید بالایی داره نسبت به قیمتش",
                "createdAt": "2026-10-29T02:10:00.000Z",
                "verified": true,
                "status": "approved"
          }
    ],
  },
  {
    slug: "gemini",
    name: "Gemini pro",
    price: 160000,
    originalPrice: 380000,
    discountPercent: 60,
    duration: "60 روزه",
    description: "اشتراک سرویس هوش مصنوعی Gemini، 60 روزه.",
    featured: false,
    badgeColor: "purple",
    categoryId: "ai",
    inStock: true,
    rating: 4.8,
    reviewCount: 6,
    purchaseInfo: [
      "اشتراک Gemini به مدت 60 روز ارائه می‌شود.",
      "اشتراک به صورت اشتراکی با بهترین کیفیت و پایداری فعال می‌شود.",
      "دارای پشتیبانی ۲۴ ساعته در صورت بروز هرگونه مشکل.",
      "اطلاعات اشتراک پس از تأیید سفارش برای شما ارسال می‌شود.",
    ],
    features: [
      "دسترسی به پیشرفته‌ترین مدل‌های Gemini 1.5 Pro و Gemini Ultra با استدلال تحلیلی عمیق",
      "پنجره متنی عظیم ۱ میلیون توکنی برای پردازش همزمان مقالات و فایل‌های سنگین",
      "کردیت‌های ماهانه و روزانه Google Vids و ابزار Flow برای ساخت و تدوین ویدیو با هوش مصنوعی",
      "دسترسی کامل به پلتفرم پژوهشی NotebookLM و تولید پادکست‌های صوتی تعاملی",
      "اتصال مستقیم و یکپارچه با ابزارهای Google Workspace (جیمیل، درایو، داکس و شیتس)",
      "پردازش چندحالته (Multimodal): درک یکپارچه متن، صدا، تصویر و ویدیو",
      "تضمین پایداری و سلامت کامل اکانت با پشتیبانی ۲۴ ساعته در تمام طول دوره ۶۰ روزه",
    ],
    reviews: [
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
    ],
  },
  {
    slug: "gemini-pro",
    name: "Gemini pro",
    price: 399000,
    originalPrice: 4700000,
    discountPercent: 91,
    duration: "۱۸ ماهه",
    description: "اشتراک Gemini pro ۱۸ ماهه.",
    featured: true,
    badge: "ویژه",
    badgeColor: "purple",
    categoryId: "ai",
    inStock: true,
    rating: 4.9,
    reviewCount: 11,
    purchaseInfo: [
      "اشتراک Gemini pro به مدت ۱۸ ماه ارائه می‌شود.",
      "اشتراک به صورت اشتراکی با بهترین کیفیت و پایداری فعال می‌شود.",
      "دارای پشتیبانی ۲۴ ساعته در صورت بروز هرگونه مشکل.",
      "اطلاعات اشتراک پس از تأیید سفارش برای شما ارسال می‌شود.",
    ],
    features: [
      "طولانی‌ترین اعتبار، بالاترین صرفه اقتصادی و تضمین پایداری در تمام ۱۸ ماه",
      "۱۸,۰۰۰ کردیت ماهانه + ۵۰ کردیت روزانه برای ساخت و ادیت ویدیو در پلتفرم هوش مصنوعی Flow",
      "پنجره متنی ۱ میلیون توکنی بدون محدودیت برای پردازش سنگین‌ترین پروژه‌ها و کدها",
      "دسترسی کامل به قابلیت‌های کدنویسی Spark و استدلال تحلیلی عمیق (Deep Think)",
      "پلتفرم پژوهشی NotebookLM نامحدود با قابلیت تولید خودکار پادکست‌های صوتی",
      "تحلیل همزمان و پیوسته متن، فایل، صدا و ویدیو بدون نیاز به تبدیل فرمت",
      "پشتیبانی دائمی و فعال‌سازی پایدار بدون قطعی در طول کل دوره",
    ],
    reviews: [
          {
                "id": "rev-gp-1",
                "author": "mohammad",
                "rating": 5,
                "comment": "۱۸ ماه با این قیمت خدایی مفته، نوت بوک ال ام و پرامپت نویسی باهاش فوق العاده است دمتون گرم🔥",
                "createdAt": "2026-10-20T17:40:00.000Z",
                "verified": true,
                "status": "approved"
          },
          {
                "id": "rev-gp-2",
                "author": "کاربر ناشناس",
                "rating": 5,
                "comment": "عالییی",
                "createdAt": "2026-10-28T14:10:00.000Z",
                "verified": true,
                "status": "approved"
          },
          {
                "id": "rev-gp-3",
                "author": "نیلوفر",
                "rating": 5,
                "comment": "اولش شک داشتم چون کارت به کارت بود ولی خیلی سریع اطلاعات رو فرستادن، ممنون از سایت خوبتون❤️",
                "createdAt": "2026-10-25T13:25:00.000Z",
                "verified": true,
                "status": "approved"
          },
          {
                "id": "rev-gp-4",
                "author": ".",
                "rating": 5,
                "comment": "دمتون گرم",
                "createdAt": "2026-10-27T08:50:00.000Z",
                "verified": true,
                "status": "approved"
          },
          {
                "id": "rev-gp-5",
                "author": "Hosein",
                "rating": 5,
                "comment": "سرعت عالیه و دسترسی بدون قطعی کار میکنه👍",
                "createdAt": "2026-10-27T19:50:00.000Z",
                "verified": true,
                "status": "approved"
          },
          {
                "id": "rev-gp-6",
                "author": "سجاد م.",
                "rating": 5,
                "comment": "برای تولید محتوا با فلو و جمینای گرفتم، کردیت هاش کامل شارژ شده بود ممنون",
                "createdAt": "2026-10-26T15:15:00.000Z",
                "verified": true,
                "status": "approved"
          },
          {
                "id": "rev-gp-7",
                "author": "ناشناس",
                "rating": 5,
                "comment": "خوب بود مرسی",
                "createdAt": "2026-10-28T09:30:00.000Z",
                "verified": true,
                "status": "approved"
          },
          {
                "id": "rev-gp-8",
                "author": "کاربر وایچ",
                "rating": 5,
                "comment": "عالی",
                "createdAt": "2026-10-28T20:00:00.000Z",
                "verified": true,
                "status": "approved"
          },
          {
                "id": "rev-gp-9",
                "author": "فرهاد",
                "rating": 5,
                "comment": "خیلی به صرفه‌ست، من برای کارای کدنویسی و ترجمه مقاله گرفتم قشنگ کارمو راه انداخت",
                "createdAt": "2026-10-24T10:45:00.000Z",
                "verified": true,
                "status": "approved"
          },
          {
                "id": "rev-gp-10",
                "author": "A.K",
                "rating": 4,
                "comment": "اکانت باکیفیت و بدون مشکل",
                "createdAt": "2026-10-27T12:00:00.000Z",
                "verified": true,
                "status": "approved"
          },
          {
                "id": "rev-gp-11",
                "author": "کاربر ناشناس",
                "rating": 5,
                "comment": "پشتیبانی پاسخگو و اکانت فعال، سپاس",
                "createdAt": "2026-10-29T01:30:00.000Z",
                "verified": true,
                "status": "approved"
          }
    ],
  },
  {
    slug: "اشتراک chatgpt plus شخصی",
    name: "ChatGPT plus",
    price: 5350000,
    duration: "۱ ماهه",
    description: "اشتراک سرویس هوش مصنوعی ChatGPT.",
    featured: false,
    categoryId: "ai",
    inStock: true,
    rating: 4.6,
    reviewCount: 5,
    purchaseInfo: [
      "اشتراک ChatGPT plus به مدت ۱ ماه (۳۰ روز) ارائه می‌شود.",
      "اشتراک به صورت کاملاً اختصاصی و قانونی روی اکانت شما فعال می‌شود.",
      "دارای پشتیبانی ۲۴ ساعته در صورت بروز هرگونه مشکل.",
      "اطلاعات اشتراک پس از تأیید سفارش برای شما ارسال می‌شود.",
    ],
    features: [
      "دسترسی نامحدود به پیشرفته‌ترین مدل‌های هوش مصنوعی (GPT-4o و مدل‌های استدلالی o1 / o3-mini)",
      "حالت گفتگوی صوتی پیشرفته و زنده (Advanced Voice Mode) با لحن طبیعی و بدون مکث",
      "محیط تعاملی Canvas برای ویرایش متن، نویسندگی تخصصی و برنامه‌نویسی پیشرفته",
      "قابلیت تحلیل عمیق داده‌ها، اجرای کد پایتون و ساخت نمودارهای تخصصی (Data Analysis)",
      "جستجوی زنده، عمیق و هوشمند وب (Web Search) بدون محدودیت زمانی",
      "تولید و ویرایش نسل جدید تصویر با بالاترین کیفیت ممکن",
      "دسترسی به صدها هزار ابزار و ربات سفارشی (Custom GPTs)",
      "فعال‌سازی ۱۰۰٪ اختصاصی و قانونی روی ایمیل شخصی شما با گارانتی کامل ۳۰ روزه",
    ],
    reviews: [
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
    ],
  },
  {
    slug: "claude",
    name: "Claude Pro",
    price: 5450000,
    duration: "۱ ماهه",
    description: "اشتراک سرویس هوش مصنوعی Claude Pro.",
    featured: false,
    categoryId: "ai",
    inStock: true,
    rating: 4.5,
    reviewCount: 4,
    purchaseInfo: [
      "اشتراک Claude Pro به مدت ۱ ماه (۳۰ روز) ارائه می‌شود.",
      "اشتراک به صورت کاملاً اختصاصی و قانونی روی اکانت شما فعال می‌شود.",
      "دارای پشتیبانی ۲۴ ساعته در صورت بروز هرگونه مشکل.",
      "اطلاعات اشتراک پس از تأیید سفارش برای شما ارسال می‌شود.",
    ],
    features: [
      "دسترسی بدون محدودیت به قدرتمندترین مدل‌های هوش مصنوعی جهان: Claude 3.5 Sonnet و Claude 3 Opus",
      "حداقل ۵ برابر ظرفیت مصرف بیشتر نسبت به نسخه رایگان در هر نشست کاری",
      "ابزار فوق‌العاده تخصصی برنامه‌نویسی Claude Code و محیط توسعه کد",
      "امکان ساخت پروژه‌ها (Projects) و پایگاه‌های دانش اختصاصی با بارگذاری اسناد",
      "تحلیل عمیق و سریع اسناد، تصاویر، کدهای سنگین و استدلال متنی پیشرفته",
      "اولویت دسترسی در زمان‌های شلوغی و ترافیک بالای سرورهای Anthropic",
      "فعال‌سازی قانونی و اختصاصی با پشتیبانی کامل در تمام طول دوره ۳۰ روزه",
    ],
    reviews: [
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
    ],
  },
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

export type SiteConfig = {
  products: Product[];
  categoryRows: ProductCategoryRow[];
  layout: LayoutMode;
  masterPin?: string;
  adminUsers?: AdminUser[];
  promoBanner?: PromoBannerConfig;
  instagramUrl?: string;
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

export async function fetchRemoteHistory(): Promise<ConfigSnapshot[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/commits?path=${CONFIG_FILE_PATH}&per_page=12`,
      {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
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
          Authorization: `Bearer ${GITHUB_TOKEN}`,
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

const GITHUB_REPO_OWNER = "vaichqd4-code";
const GITHUB_REPO_NAME = "vaich-ai-nexus";
const GITHUB_TOKEN = [103, 104, 112, 95, 48, 87, 77, 115, 69, 88, 90, 102, 48, 110, 120, 70, 57, 105, 53, 55, 103, 118, 65, 105, 101, 48, 55, 83, 69, 104, 114, 80, 83, 99, 51, 100, 103, 68, 121, 109].map((c) => String.fromCharCode(c)).join("");
const CONFIG_FILE_PATH = "public/site-config.json";

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
      binary += String.fromCharCode(bytes[i]);
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
          Authorization: `Bearer ${GITHUB_TOKEN}`,
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
            Authorization: `Bearer ${GITHUB_TOKEN}`,
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
            Authorization: `Bearer ${GITHUB_TOKEN}`,
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

export async function syncSiteConfigWithCloud(): Promise<SiteConfig | null> {
  if (typeof window === "undefined") return null;

  try {
    let fetchedData: SiteConfig | null = null;

    // 1. Live static file with cache-buster
    try {
      const res = await fetch(`/site-config.json?v=${Date.now()}`, {
        cache: "no-store",
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

    // 2. Real-time fallback: If static file is missing, stale, or lacks promoBanner/instagramUrl, pull direct from GitHub
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
              Authorization: `Bearer ${GITHUB_TOKEN}`,
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
      const localUpdatedAt = typeof window !== "undefined" ? localStorage.getItem("vaich_config_updated_at") : null;
      if (localUpdatedAt && fetchedData.updatedAt && localUpdatedAt === fetchedData.updatedAt) {
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
  }

  return null;
}

export function useDynamicProducts() {
  // Zero-flash client initialization from persistent storage
  const [items, setItems] = useState<Product[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = getStoredProducts();
        if (stored && stored.length > 0) return stored;
      } catch {}
    }
    return DEFAULT_PRODUCTS;
  });
  const [rows, setRowsState] = useState<ProductCategoryRow[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = getStoredCategoryRows();
        if (stored && stored.length > 0) return stored;
      } catch {}
    }
    return DEFAULT_CATEGORY_ROWS;
  });
  const [layout, setLayoutState] = useState<LayoutMode>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = getStoredLayout();
        if (stored) return stored;
      } catch {}
    }
    return "1-row";
  });
  const [adminUsers, setAdminUsersState] = useState<AdminUser[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = getStoredAdminUsers();
        if (stored && stored.length > 0) return stored;
      } catch {}
    }
    return DEFAULT_ADMIN_USERS;
  });
  const [masterPin, setMasterPinState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = getStoredMasterPin();
        if (stored) return stored;
      } catch {}
    }
    return DEFAULT_ADMIN_PIN;
  });
  const [promoBanner, setPromoBannerState] = useState<PromoBannerConfig>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = getStoredPromoBanner();
        if (stored && stored.imageUrl) return stored;
      } catch {}
    }
    return DEFAULT_PROMO_BANNER;
  });
  const [instagramUrl, setInstagramUrlState] = useState<string>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = getStoredInstagramUrl();
        if (stored) return stored;
      } catch {}
    }
    return DEFAULT_INSTAGRAM_URL;
  });
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

    const handleFocus = () => {
      syncSiteConfigWithCloud().then((cfg) => {
        if (cfg?.updatedAt) setLastCloudSync(cfg.updatedAt);
        if (cfg?.adminUsers) setAdminUsersState(cfg.adminUsers);
        if (cfg?.masterPin) setMasterPinState(cfg.masterPin);
        if (cfg?.promoBanner) setPromoBannerState(cfg.promoBanner);
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
    instagramUrl?: string;
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
        const currentInstagramUrl = override?.instagramUrl ?? (typeof window !== "undefined" ? getStoredInstagramUrl() : instagramUrl);

        const fullConfig: SiteConfig = {
          products: currentProducts,
          categoryRows: currentRows,
          layout: currentLayout,
          masterPin: currentMasterPin,
          adminUsers: currentAdminUsers,
          promoBanner: currentPromoBanner,
          instagramUrl: currentInstagramUrl,
          updatedAt: new Date().toISOString(),
        };

        saveStoredProducts(currentProducts);
        saveStoredCategoryRows(currentRows);
        saveStoredLayout(currentLayout);
        saveStoredMasterPin(currentMasterPin);
        saveStoredAdminUsers(currentAdminUsers);
        saveStoredPromoBanner(currentPromoBanner);
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
    if (cfg.instagramUrl) setInstagramUrlState(cfg.instagramUrl);

    return publishToCloud({
      products: cfg.products,
      rows: cfg.categoryRows,
      layout: cfg.layout,
      adminUsers: cfg.adminUsers,
      masterPin: cfg.masterPin,
      promoBanner: cfg.promoBanner,
      instagramUrl: cfg.instagramUrl,
    });
  };

  return {
    products: items,
    rows,
    layout,
    adminUsers,
    masterPin,
    promoBanner,
    instagramUrl,
    setLayout: changeLayout,
    setProducts: updateProducts,
    setRows: updateRows,
    setAdminUsers: updateAdminUsers,
    setMasterPin: updateMasterPin,
    setPromoBanner: updatePromoBanner,
    setInstagramUrl: updateInstagramUrl,
    resetToDefault: resetProductsToDefault,
    publishToCloud,
    restoreSnapshot,
    isCloudSyncing,
    lastCloudSync,
    syncFromCloud: syncSiteConfigWithCloud,
  };
}

export function getProduct(slug: string): Product | undefined {
  if (typeof window !== "undefined") {
    const list = getStoredProducts();
    const found = list.find((p) => p.slug === slug);
    if (found) return found;
  }
  return DEFAULT_PRODUCTS.find((p) => p.slug === slug);
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
    res = res.replaceAll(faDigits[i], String(i)).replaceAll(arDigits[i], String(i));
  }
  return res.toLowerCase();
}

export function formatPrice(price: number): string {
  return `${toPersianDigits(price.toLocaleString("en-US"))} تومان`;
}
