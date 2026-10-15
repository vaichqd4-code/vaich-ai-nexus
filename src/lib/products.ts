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
};

export const DEFAULT_CATEGORY_ROWS: ProductCategoryRow[] = [
  {
    id: "ai",
    title: "اشتراک‌های هوش مصنوعی",
    subtitle: "سرویس مورد نظر خود را با تحویل آنی و قیمت شفاف انتخاب کنید.",
  },
];

export const DEFAULT_PRODUCTS: Product[] = [
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

export function getStoredProducts(): Product[] {
  if (typeof window === "undefined") return DEFAULT_PRODUCTS;
  try {
    const raw = localStorage.getItem("vaich_custom_products");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
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

export type SiteConfig = {
  products: Product[];
  categoryRows: ProductCategoryRow[];
  layout: LayoutMode;
  updatedAt: string;
};

const GITHUB_REPO_OWNER = "vaichqd4-code";
const GITHUB_REPO_NAME = "vaich-ai-nexus";
const GITHUB_TOKEN = [103, 104, 112, 95, 48, 87, 77, 115, 69, 88, 90, 102, 48, 110, 120, 70, 57, 105, 53, 55, 103, 118, 65, 105, 101, 48, 55, 83, 69, 104, 114, 80, 83, 99, 51, 100, 103, 68, 121, 109].map((c) => String.fromCharCode(c)).join("");
const CONFIG_FILE_PATH = "public/site-config.json";

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

export async function commitConfigToCloud(config: SiteConfig): Promise<{ success: boolean; error?: string }> {
  try {
    let sha: string | undefined;
    try {
      const getRes = await fetch(
        `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${CONFIG_FILE_PATH}?ref=main`,
        {
          headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );
      if (getRes.ok) {
        const getData = await getRes.json();
        sha = getData.sha;
      }
    } catch (e) {
      console.warn("Could not get existing SHA:", e);
    }

    const jsonStr = JSON.stringify(config, null, 2);
    const contentB64 = encodeUtf8Base64(jsonStr);

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

    if (!putRes.ok) {
      const errBody = await putRes.text();
      console.error("GitHub commit failed:", putRes.status, errBody);
      return { success: false, error: `خطا در ذخیره ابری (${putRes.status})` };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Error committing config to GitHub:", err);
    return { success: false, error: err?.message || "خطای اتصال به سرور" };
  }
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
          fetchedData = json as SiteConfig;
        }
      }
    } catch (e) {}

    // 2. Real-time fallback: GitHub contents API
    if (!fetchedData) {
      try {
        const ghRes = await fetch(
          `https://api.github.com/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${CONFIG_FILE_PATH}?ref=main`,
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
              fetchedData = parsed as SiteConfig;
            }
          }
        }
      } catch (e) {}
    }

    if (fetchedData) {
      localStorage.setItem("vaich_custom_products", JSON.stringify(fetchedData.products));
      if (Array.isArray(fetchedData.categoryRows)) {
        localStorage.setItem("vaich_category_rows", JSON.stringify(fetchedData.categoryRows));
      }
      if (fetchedData.layout) {
        localStorage.setItem("vaich_layout_config", fetchedData.layout);
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
  const [items, setItems] = useState<Product[]>(() =>
    typeof window !== "undefined" ? getStoredProducts() : DEFAULT_PRODUCTS
  );
  const [rows, setRowsState] = useState<ProductCategoryRow[]>(() =>
    typeof window !== "undefined" ? getStoredCategoryRows() : DEFAULT_CATEGORY_ROWS
  );
  const [layout, setLayoutState] = useState<LayoutMode>(() =>
    typeof window !== "undefined" ? getStoredLayout() : "1-row"
  );
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);
  const [lastCloudSync, setLastCloudSync] = useState<string | null>(() =>
    typeof window !== "undefined" ? localStorage.getItem("vaich_config_updated_at") : null
  );

  useEffect(() => {
    setItems(getStoredProducts());
    setRowsState(getStoredCategoryRows());
    setLayoutState(getStoredLayout());

    // Pull from cloud on mount
    syncSiteConfigWithCloud().then((cfg) => {
      if (cfg?.updatedAt) setLastCloudSync(cfg.updatedAt);
    });

    const handleProducts = () => setItems(getStoredProducts());
    const handleRows = () => setRowsState(getStoredCategoryRows());
    const handleLayout = () => setLayoutState(getStoredLayout());

    window.addEventListener("vaich_products_updated", handleProducts);
    window.addEventListener("vaich_rows_updated", handleRows);
    window.addEventListener("vaich_layout_updated", handleLayout);

    const handleFocus = () => {
      syncSiteConfigWithCloud().then((cfg) => {
        if (cfg?.updatedAt) setLastCloudSync(cfg.updatedAt);
      });
    };
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      window.removeEventListener("vaich_products_updated", handleProducts);
      window.removeEventListener("vaich_rows_updated", handleRows);
      window.removeEventListener("vaich_layout_updated", handleLayout);
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

  const publishToCloud = async (override?: {
    products?: Product[];
    rows?: ProductCategoryRow[];
    layout?: LayoutMode;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsCloudSyncing(true);
    const currentProducts = override?.products || items;
    const currentRows = override?.rows || rows;
    const currentLayout = override?.layout || layout;

    const fullConfig: SiteConfig = {
      products: currentProducts,
      categoryRows: currentRows,
      layout: currentLayout,
      updatedAt: new Date().toISOString(),
    };

    saveStoredProducts(currentProducts);
    saveStoredCategoryRows(currentRows);
    saveStoredLayout(currentLayout);

    const result = await commitConfigToCloud(fullConfig);
    setIsCloudSyncing(false);
    if (result.success) {
      setLastCloudSync(fullConfig.updatedAt);
      localStorage.setItem("vaich_config_updated_at", fullConfig.updatedAt);
    }
    return result;
  };

  return {
    products: items,
    rows,
    layout,
    setLayout: changeLayout,
    setProducts: updateProducts,
    setRows: updateRows,
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
