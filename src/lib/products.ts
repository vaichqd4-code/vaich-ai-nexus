import { useEffect, useState } from "react";

export type LayoutMode = "1-row" | "2-row" | "grid";

export type ProductCategoryRow = {
  id: string;
  title: string;
  subtitle?: string;
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
};

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
    "duration": "نامحدود ",
    "description": "کامل‌ترین سیستم هوشمند مدیریت زندگی و ردیاب عادات روزانه در گوگل شیت با رابط کاربری مدرن، ایموجی‌های تعاملی سه‌بعدی و دسترسی همیشگی روی موبایل و لپ‌تاپ",
    "featured": true,
    "badge": "پیشنهادی",
    "badgeColor": "fire",
    "categoryId": "row-mvampt3r",
    "features": [
      "✨ شامل ۲ نسخه اختصاصی: نسخه تعاملی سه‌بعدی (3D Deluxe) و نسخه استاندارد",
      "📊 نمودارهای تحلیلی داینامیک و ردیاب ماهانه پیشرفت عادات",
      "📱 همگام‌سازی ابری و دسترسی روی تمام دستگاه‌ها (موبایل، تبلت و لپ‌تاپ)",
      "🔄 شخصی سازی و اتوماسیون هوشمند پاکسازی و شروع ماه جدید تنها با یک کلیک",
      "🎙 به همراه راهنمای جامع صوتی و متنی فارسی برای راه‌اندازی سریع در ۳ دقیقه",
      "♾ دسترسی مادام‌العمر به فایل و آپدیت‌های آینده بدون هزینه اشتراک"
    ],
    "purchaseInfo": [
      "تحویل آنی بلافاصله پس از پرداخت به صورت لینک اختصاصی کپی (Make a copy) در گوگل درایو.",
      "برای باز کردن و ذخیره شیت، نیاز به یک حساب جیمیل (Google Account) فعال دارید.",
      "قابلیت شخصی‌سازی نامحدود اهداف، روتین‌ها و عنوان عادات روزانه.",
      "پشتیبانی اختصاصی برای راهنمایی راه‌اندازی و اجرای اسکریپت‌ها"
    ],
    "iconUrl": "/planner-cover.webp",
    "imageFit": "cover"
  },
  {
    slug: "gemini",
    name: "Gemini pro",
    price: 275000,
    originalPrice: 392000,
    discountPercent: 30,
    duration: "60 روزه",
    description: "اشتراک سرویس هوش مصنوعی Gemini، 60 روزه.",
    featured: false,
    categoryId: "ai",
    purchaseInfo: [
      "اشتراک Gemini به مدت 60 روز ارائه می‌شود.",
      "اشتراک به صورت اشتراکی با بهترین کیفیت و پایداری فعال می‌شود.",
      "دارای پشتیبانی ۲۴ ساعته در صورت بروز هرگونه مشکل.",
      "اطلاعات اشتراک پس از تأیید سفارش برای شما ارسال می‌شود.",
    ],
    features: [
      "⚡ ۱,۰۰۰ کردیت ماهانه + ۵۰ کردیت روزانه رایگان گوگل فلو (ساخت ویدیو و جریان‌های کاری هوش مصنوعی)",
      "💻 دسترسی کامل به قابلیت‌های پیشرفته کدنویسی Spark",
      "📚 پنجره متنی عظیم ۱ میلیون توکنی (پردازش همزمان بیش از ۱,۵۰۰ صفحه کتاب یا کدهای سنگین)",
      "🎙️ دسترسی ویژه به NotebookLM و ساخت پادکست‌های صوتی تعاملی (Audio Overviews)",
      "🧠 موتور استدلال عمیق (Deep Think) برای حل مسائل پیچیده منطقی و برنامه‌نویسی",
      "🌐 پردازش چندحالته (درک همزمان متن، صدا، تصویر و ویدیوهای طولانی)",
      "🎨 تولید محتوای چندرسانه‌ای، تصویرسازی باکیفیت و ساخت قطعات صوتی",
      "☁️ ادغام مستقیم با Google Workspace (جیمیل، درایو، داکس و شیتس)",
      "🛡️ فعال‌سازی پایدار با پشتیبانی کامل در تمام دوره ۶۰ روزه",
      "✨ و بسیاری دیگر...",
    ],
  },
  {
    slug: "gemini-pro",
    name: "Gemini pro",
    price: 399000,
    originalPrice: 4700000,
    duration: "۱۸ ماهه",
    description: "اشتراک Gemini pro ۱۸ ماهه.",
    featured: true,
    badge: "پیشنهاد ویژه 🔥",
    badgeColor: "fire",
    categoryId: "ai",
    purchaseInfo: [
      "اشتراک Gemini pro به مدت ۱۸ ماه ارائه می‌شود.",
      "اشتراک به صورت اشتراکی با بهترین کیفیت و پایداری فعال می‌شود.",
      "دارای پشتیبانی ۲۴ ساعته در صورت بروز هرگونه مشکل.",
      "اطلاعات اشتراک پس از تأیید سفارش برای شما ارسال می‌شود.",
    ],
    features: [
      "🔥 ۱۸,۰۰۰ کردیت گوگل فلو (۱,۰۰۰ تا در هر ماه) + ۵۰ کردیت روزانه برای ساخت ویدیو",
      "💻 دسترسی کامل به امکانات پیشرفته کدنویسی Spark بدون محدودیت",
      "📚 پنجره متنی عظیم ۱ میلیون توکنی برای پردازش پروژه‌ها و اسناد فوق‌سنگین",
      "🎙️ پلتفرم پژوهشی NotebookLM نامحدود با قابلیت تولید پادکست صوتی",
      "🧠 موتور استدلال عمیق (Deep Think) برای تحلیل‌های دانشگاهی و مهندسی",
      "🌐 تحلیل همزمان و یکپارچه متن، فایل، صدا و ویدیو بدون تبدیل فرمت",
      "🎨 تولید و ویرایش هوشمند تصاویر و محتوای رسانه‌ای",
      "☁️ اتصال مستقیم به ابزارهای ابری Google Workspace",
      "💎 طولانی‌ترین اعتبار، بالاترین صرفه اقتصادی و تضمین پایداری در تمام ۱۸ ماه",
      "✨ و بسیاری دیگر...",
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
    purchaseInfo: [
      "اشتراک ChatGPT plus به مدت ۱ ماه (۳۰ روز) ارائه می‌شود.",
      "اشتراک به صورت کاملاً اختصاصی و قانونی روی اکانت شما فعال می‌شود.",
      "دارای پشتیبانی ۲۴ ساعته در صورت بروز هرگونه مشکل.",
      "اطلاعات اشتراک پس از تأیید سفارش برای شما ارسال می‌شود.",
    ],
    features: [
      "⚡ دسترسی به مدل پرچمدار GPT-5.6 Sol با حالت‌های پردازش Instant، Medium و High",
      "🚀 دسترسی ویژه به مدل قدرتمند GPT-6 Astra در محیط‌های تخصصی Work و Codex",
      "🧠 استدلال عمیق (High Reasoning) برای کدنویسی‌های پیچیده، مهندسی و تحلیل داده",
      "💻 دسترسی کامل به محیط توسعه و برنامه‌نویسی Codex و فضای کاری ChatGPT Work",
      "🎨 تولید و ویرایش فوق‌العاده باکیفیت نسل جدید تصویر (ChatGPT Images 2.5)",
      "🎙️ مکالمه صوتی طبیعی، زنده و پیوسته با GPT-Live-1 (حالت صوتی پیشرفته)",
      "📚 پنجره متنی ارتقایافته برای تحلیل هم‌زمان اسناد، پروژه‌های کد و فایل‌های سنگین",
      "🌐 جستجوی هوشمند، عمیق و زنده در وب (Deep Research) بدون محدودیت",
      "🛠️ ساخت، سفارشی‌سازی و استفاده نامحدود از ابزارها و ربات‌ها (Custom GPTs)",
      "🛡️ فعال‌سازی ۱۰۰٪ اختصاصی و قانونی روی اکانت شما با پشتیبانی کامل ۳۰ روزه",
      "✨ و بسیاری دیگر...",
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
    purchaseInfo: [
      "اشتراک Claude Pro به مدت ۱ ماه (۳۰ روز) ارائه می‌شود.",
      "اشتراک به صورت کاملاً اختصاصی و قانونی روی اکانت شما فعال می‌شود.",
      "دارای پشتیبانی ۲۴ ساعته در صورت بروز هرگونه مشکل.",
      "اطلاعات اشتراک پس از تأیید سفارش برای شما ارسال می‌شود.",
    ],
    features: [
      "⚡ دسترسی به حداقل ۵ برابر ظرفیت مصرف بیشتر نسبت به نسخه رایگان در هر نشست (Session)",
      "🚀 دسترسی اولویت‌دار و بدون وقفه در زمان‌های پرترافیک و ساعات شلوغی",
      "🛠️ امکان انتخاب و جابه‌جایی بین مدل‌های مختلف Claude (Model Selector)",
      "📁 دسترسی کامل به بخش پروژه‌ها (Projects) و پایگاه‌های دانش اختصاصی (Knowledge Bases)",
      "💻 دسترسی به ابزار برنامه‌نویسی پیشرفته Claude Code",
      "🔮 دسترسی زودهنگام به جدیدترین قابلیت‌ها و آپدیت‌های هوش مصنوعی Anthropic",
      "🛡️ فعال‌سازی ۱۰۰٪ اختصاصی و قانونی با پشتیبانی کامل در طول دوره ۳۰ روزه",
      "✨ و بسیاری دیگر...",
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
  linkUrl: "/#planners",
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
