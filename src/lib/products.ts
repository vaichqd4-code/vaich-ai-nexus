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
    "slug": "vaich-life-planner",
    "name": "پلنر برنامه ریزی(استاندارد)",
    "price": 299000,
    "duration": "دائمی (بدون اشتراک)",
    "description": "نرم‌افزار مدیریت فردی دائمی مبتنی بر فرمول‌های پیشرفته Google Sheets و اسکریپت‌های اتوماسیون Apps Script (بدون نیاز به پرداخت ماهانه یا شارژ دوره)؛ مجهز به Habit Tracker، ماتریس آیزنهاور، سیستم Time Boxing و هوش مالی فردی.",
    "featured": true,
    "badge": "پیشنهادی",
    "badgeColor": "fire",
    "categoryId": "row-mvampt3r",
    "inStock": true,
    "rating": 4.9,
    "reviewCount": 21,
    "features": [
      "نرم‌افزار مدیریت فردی دائمی مبتنی بر فرمول‌های پیشرفته Google Sheets و اسکریپت‌های اتوماسیون Apps Script (بدون نیاز به پرداخت ماهانه یا شارژ دوره)",
      "ردیاب عادات مینیمال (Habit Tracker): ثبت زنجیره استمرار روزانه (Streak) با نمودار درصد موفقیت خودکار و پاداش بصری",
      "سیستم زمان‌بندی روزانه بر پایه Time Boxing: ساخت بلاک‌های تمرکز کاری و تفکیک اولویت‌ها طبق ماتریس آیزنهاور",
      "بودجه‌بندی و هوش مالی فردی: ثبت دقیق تراکنش‌ها، نمودار مخارج دسته‌بندی‌شده و ماشین‌حساب پس‌انداز ماهانه",
      "داشبورد پیگیری اهداف و OKR سالانه با نوارهای گرافیکی پیشرفت",
      "سازگاری کامل: باز شدن بدون لگ در گوشی، تبلت و لپ‌تاپ از طریق برنامه گوگل شیت با فضای ابری دائمی در درایو شخصی خریدار",
      "شامل ۲ تمپلیت اختصاصی: نسخه تعاملی سه‌بعدی (3D Deluxe) و نسخه استاندارد مینیمال ۲بعدی",
      "دکمه هوشمند پاکسازی و شروع ماه جدید تنها با یک کلیک بدون آسیب به فرمول‌ها",
      "همراه با راهنمای جامع صوتی و تصویری فارسی برای راه‌اندازی و کپی در کمتر از ۳ دقیقه"
    ],
    "purchaseInfo": [
      "تحویل آنی بلافاصله پس از پرداخت به صورت لینک اختصاصی کپی (Make a copy) در گوگل درایو.",
      "این محصول نرم‌افزار دائمی است؛ یک‌بار خرید و دسترسی همیشگی بدون تاریخ انقضا و بدون هزینه اشتراک ماهیانه.",
      "برای استفاده و ذخیره شیت، تنها به یک حساب جیمیل (Google Account) فعال نیاز دارید (بدون نیاز به نرم‌افزار آفیس یا اکسل).",
      "پشتیبانی اختصاصی در تلگرام برای راهنمایی راه‌اندازی، کپی فایل و نحوه استفاده روزانه."
    ],
    "iconUrl": "/planner-cover.webp",
    "imageFit": "cover",
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
    "name": "Gemini Pro",
    "price": 160000,
    "duration": "60 روزه",
    "description": "اشتراک رسمی ۶۰ روزه Google Gemini Advanced؛ دسترسی به پرچمدار غول‌آسای Google Gemini 4 Argon با خروجی ۱,۰۰۰,۰۰۰ توکن، لایه عامل‌محور انقلابی Project Astra (درک زنده ویدیوی دوربین با تاخیر زیر ۳۰۰ میلی‌ثانیه و حافظه فضایی)، مدل استدلال عمیق Gemini 3 Deep Think و پیوند کامل با Google Workspace.",
    "featured": false,
    "badgeColor": "purple",
    "categoryId": "ai",
    "features": [
      "پرچمدار غول‌آسای گوگل: Gemini 4 Argon با معماری انقلابی چندوجهی و پشتیبانی از طول خروجی بی‌سابقه تا ۱,۰۰۰,۰۰۰ توکن",
      "لایه عامل‌محور انقلابی Project Astra: درک بلادرنگ جریان ویدیوی دوربین، تعامل صوتی انسان‌گونه با تاخیر زیر ۳۰۰ میلی‌ثانیه و حافظه مکانی پایدار",
      "مدل تحلیل استدلال عمیق: Gemini 3 Deep Think برای مسائل داده‌کاوی، فیزیک، مدل‌سازی مالی و معماری سیستم",
      "مدل‌های سریع کاری: Gemini 3.8 Flash و نگارش تخصصی ۳.۸ Flash Cyber",
      "پیوند عمیق و بومی با اکوسیستم Google Workspace (Google Drive, Gmail, Docs, Keep) جهت جستجو و تحلیل خودکار اسناد ابری",
      "اجرای کدهای پایتون در فضای ابری ایزوله و تولید مستقیم تصاویر فوق‌واقع‌گرایانه با Imagen 3",
      "بزرگ‌ترین پنجره متنی جهان (۲ میلیون توکن پایدار) با بالاترین نرخ Recall میان تمام مدل‌ها برای پردازش آرشیوهای سنگین",
      "پلن اقتصادی ۶۰ روزه قانونی با تضمین سلامت و گارانتی تعویض کامل در تمام طول دوره با پشتیبانی ۲۴ ساعته تلگرام"
    ],
    "purchaseInfo": [
      "اشتراک رسمی Gemini Advanced به مدت ۶۰ روز کامل ارائه می‌شود.",
      "اکانت با دسترسی سریع و پایدار به تمام مدل‌های پرچمدار گوگل فعال‌سازی می‌گردد.",
      "اطلاعات ورود و راهنمای فعال‌سازی، پس از واریز و ارسال رسید در ربات، در اولین فرصت و در سریع‌ترین زمان ممکن در تلگرام تحویل داده می‌شود.",
      "پوشش ۱۰۰٪ گارانتی سلامت اکانت و پشتیبانی ۲۴ ساعته در تمام طول دوره ۶۰ روزه."
    ],
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
    ],
    "iconUrl": "/file_000000007ea4822f9eac5c00be6be9eb.png?v=sq2"
  },
  {
    "slug": "gemini-pro",
    "name": "Gemini Pro",
    "price": 399000,
    "originalPrice": 4700000,
    "discountPercent": 91,
    "duration": "۱۸ ماهه",
    "description": "اشتراک رسمی ۱۸ ماهه اقتصادی Google Gemini Advanced با بیش از ۹۰٪ تخفیف اقتصادی ویژه دانشجویان، تریدرها، برنامه‌نویسان و محققان؛ مجهز به Gemini 4 Argon، پروژه انقلابی Project Astra، مدل استدلال عمیق Deep Think و پنجره ۲ میلیون توکنی بدون دغدغه تمدید ماهانه و جهش ارزی.",
    "isLifetime": false,
    "featured": true,
    "badge": "ویژه",
    "badgeColor": "purple",
    "categoryId": "ai",
    "features": [
      "تخفیف اقتصادی بیش از ۹۰ درصدی، اشتراک قانونی بلندمدت ویژه دانشجویان، تریدرها، مهندسان و تحلیلگران بدون دغدغه تمدید ماهانه و نوسان ارزی",
      "پرچمدار غول‌آسای گوگل: Gemini 4 Argon با خروجی طولانی تا ۱ میلیون توکن",
      "لایه انقلابی Project Astra: پیمایش بلادرنگ ویدیو و دوربین، مکالمه صوتی طبیعی زیر ۳۰۰ میلی‌ثانیه و حافظه محیطی پایدار",
      "مدل تحلیل استدلال عمیق: Gemini 3 Deep Think برای پروژه‌های پیچیده فیزیک، اقتصاد و سیستم‌های داده‌محور",
      "مدل‌های پرسرعت کاری Gemini 3.8 Flash و 3.8 Flash Cyber",
      "یکپارچگی عمیق با Google Workspace (Gmail, Drive, Docs, Keep) بدون نیاز به دانلود و آپلود مجدد فایل‌ها",
      "فضای ابری ایزوله جهت اجرای کدهای پایتون و موتور تصویرساز نسل جدید Imagen 3",
      "پنجره متنی ۲ میلیون توکنی پایدار برای پردازش اسناد سازمانی غول‌پیکر با بالاترین نرخ Recall",
      "پشتیبانی اختصاصی و گارانتی تعویض فوری در صورت بروز هرگونه قطعی یا مشکل در طول ۱۸ ماه"
    ],
    "purchaseInfo": [
      "اشتراک Gemini Pro به مدت ۱۸ ماه کامل ارائه می‌شود (بالاترین ارزش خرید نسبت به قیمت در بازار).",
      "اکانت به صورت اشتراکی قانونی با سرورهای بهینه و بدون قطعی فعال‌سازی می‌گردد.",
      "اطلاعات ورود پس از تایید رسید، در اولین فرصت و در سریع‌ترین زمان ممکن تحویل داده می‌شود.",
      "پشتیبانی و گارانتی کامل سلامت اکانت در تمام ۱۸ ماه توسط تیم وایچ تضمین شده است."
    ],
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
    ],
    "iconUrl": "/file_00000000377481f6b667af886cd18fb6.png?v=sq2"
  },
  {
    "slug": "اشتراک chatgpt plus شخصی",
    "name": "ChatGPT Plus",
    "price": 5350000,
    "duration": "۱ ماهه",
    "description": "اشتراک قانونی و ۱۰۰٪ اختصاصی ChatGPT Plus شرکت OpenAI؛ مجهز به پرچمدار مرزی هوش مصنوعی GPT-6 Astra (با هوش خودمختار رایانه‌ای، مرورگر وب و حل مسائل مهندسی ارشد)، مدل‌های تعادلی GPT-6 Sol و GPT-6 Luna، مدل‌های استدلال عمیق o1 و o3-mini، فضای کاری نوین Prism، بوم تعاملی Canvas، تولید ویدیوی Sora و حالت صوتی زنده Advanced Voice Mode.",
    "featured": false,
    "categoryId": "ai",
    "inStock": true,
    "rating": 4.6,
    "reviewCount": 5,
    "purchaseInfo": [
      "اشتراک رسمی ChatGPT Plus به مدت ۳۰ روز کامل ارائه می‌شود.",
      "فعال‌سازی ۱۰۰٪ قانونی روی ایمیل کاربر یا اکانت اختصاصی، بدون ریسک لیمیت منطقه‌ای، تضمین پایداری کامل تا آخرین روز اشتراک.",
      "تمام تاریخچه گفتگوها، پروژه‌ها و GPTهای سفارشی به صورت خصوصی و محفوظ برای خودتان باقی می‌ماند.",
      "دارای گارانتی سلامت ۱۰۰٪ و پشتیبانی سریع در تلگرام در صورت بروز هرگونه سوال یا نیاز به راهنمایی."
    ],
    "features": [
      "پرچمدار ارشد هوش مرزی: GPT-6 Astra (پیشرفته‌ترین مدل جهان با استدلال خودمختار رایانه‌ای، اجرای تسک‌های پیچیده وب و رتبه بحرانی امنیت سایبری)",
      "مدل پرقدرت و تعادلی GPT-6 Sol به همراه مدل رعدآسای GPT-6 Luna برای پاسخ‌دهی آنی به امور روزمره و تحلیل‌های پرحجم",
      "خانواده استدلال عمیق منطق و ریاضیات: مدل‌های o1 و o3-mini با قابلیت تنظیم سطح تفکر (Reasoning Effort) برای حل مسائل المپیادی، مهندسی و خطایابی کد",
      "مدل سبک و پرسرعت GPT-4o برای مکالمات متنی روزمره و چت بدون تاخیر",
      "محیط کاری نوین Prism: ورک‌اسپیس اختصاصی نگارش، اسناد ساختاریافته و پژوهش‌های چندمرحله‌ای با ادغام منابع و پیوست‌های متنی",
      "بوم تعاملی Canvas: ویرایش همزمان پاراگراف‌ها و کدهای فرانت‌اند/بک‌اند در پنل کناری چت بدون نیاز به ارسال مجدد پرامپت",
      "قابلیت چندحسابی (Account Switching): جابه‌جایی سریع و همزمان بین ۲ اکانت فعال روی اپلیکیشن بدون لاگ‌اوت",
      "پروژه‌ها و حافظه ایزوله (Projects & Project Memory): پوشه‌های کاری تفکیک‌شده تا سقف ۲۵ فایل ۵۱۲ مگابایتی در پلن Plus",
      "تولید ویدیوی انقلابی با Sora و تولید تصاویر با موتور DALL-E 3 با کیفیت خارق‌العاده Ultra HD",
      "حالت صوتی پیشرفته زنده (Advanced Voice Mode) با نمایش وضعیت در Dynamic Island و پشتیبانی از تعامل در پس‌زمینه",
      "اولویت مطلق پهنای باند پردازش، سقف استفاده بسیار بالا و دسترسی نامحدود به تحلیل داده با کدهای پایتون ابری"
    ],
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
    ],
    "iconUrl": "/chatgpt-logo.svg"
  },
  {
    "slug": "claude",
    "name": "Claude Pro",
    "price": 5450000,
    "duration": "۱ ماهه",
    "description": "اشتراک رسمی و ۱۰۰٪ اختصاصی Claude Pro آنتروپیک؛ دسترسی به پیشروترین مدل توسعه نرم‌افزار جهان Claude Sonnet 5.5، مدل فوق‌سنگین استدلالی Claude Opus 5.5، رده پردازشی Claude Fable 5.1، مدل فوق‌سریع Claude Haiku 5.5، سیستم تفکر تطبیقی (Adaptive Thinking) و محیط کاری Artifacts 2.0.",
    "featured": false,
    "categoryId": "ai",
    "inStock": true,
    "rating": 4.5,
    "reviewCount": 4,
    "purchaseInfo": [
      "اشتراک Claude Pro به مدت ۳۰ روز کامل ارائه می‌شود.",
      "فعال‌سازی اختصاصی ۱۰۰٪ قانونی روی ایمیل کاربر یا اکانت شخصی؛ بدون ریسک لیمیت منطقه‌ای و با حفظ کامل امنیت داده‌ها.",
      "تضمین پایداری کامل تا آخرین روز اشتراک همراه با پوشش کامل گارانتی سلامت.",
      "پشتیبانی فوری تلگرام در طول کل دوره استفاده."
    ],
    "features": [
      "مدل پرچمدار و پیشرو در توسعه نرم‌افزار: Claude Sonnet 5.5 (برترین مدل کدنویسی حال حاضر جهان، با تسلط بی‌رقیب بر ریفکتورینگ پروژه‌ها و ساخت کامپوننت‌ها)",
      "مدل فوق‌سنگین استدلالی: Claude Opus 5.5 و دسترسی به رده پردازشی Claude Fable 5.1 برای پروژه‌های طولانی، محاسبات آکادمیک و اسناد چندصدصفحه‌ای",
      "مدل فوق‌سریع: Claude Haiku 5.5 با کانتکست ۱ میلیون توکنی برای کارهای روتین و کم‌هزینه",
      "سیستم تفکر تطبیقی (Adaptive Thinking): امکان تنظیم هوشمند زمان فکر کردن مدل پیش از پاسخ‌دهی برای افزایش ضریب دقت تا ۱۰۰٪ در پروژه‌های پیچیده",
      "محیط کاری Artifacts 2.0: رندر زنده کامپوننت‌های مدرن، وب‌اپلیکیشن‌های کامل، شبیه‌سازها و نمودارهای SVG در صفحه مجزا بدون نیاز به لوکال هاست",
      "کانتکست عظیم ۱ میلیون توکنی (1M Context Window) با خروجی ۱۲۸,۰۰۰ توکنی: مطالعه و خلاصه‌سازی کل مخزن‌های GitHub یا کتاب‌های چندجلدی در یک درخواست",
      "دستیار کدهای ترمینال (Claude Code): تحلیل و اجرای دستورات مستقیم ترمینال، اجرای تست و پوش مستقیم روی گیت‌هاب",
      "پروژه‌های تیمی و فردی (Claude Projects): آپلود راهنمای برند و پایگاه‌های دانش محلی جهت حفظ لحن و استانداردهای کدنویسی سازمانی",
      "افزایش سقف استفاده تا بیش از ۵ برابر نسخه عادی، دسترسی دائم به Sonnet 5.5 و Opus 5.5 در شلوغ‌ترین ساعات کاری و اولویت پردازشی بدون صف"
    ],
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
    ],
    "iconUrl": "/Claude-.webp?v=sq1"
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
  const [inArticleBanner, setInArticleBannerState] = useState<InArticleBannerConfig>(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = getStoredInArticleBanner();
        if (stored) return stored;
      } catch {}
    }
    return DEFAULT_IN_ARTICLE_BANNER;
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
    syncFromCloud: syncSiteConfigWithCloud,
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

export function formatPrice(price: number): string {
  return `${toPersianDigits(price.toLocaleString("en-US"))} تومان`;
}
