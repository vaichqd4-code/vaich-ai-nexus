import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  useDynamicProducts,
  formatPrice,
  toPersianDigits,
  normalizePin,
  type Product,
  type ProductCategoryRow,
  type LayoutMode,
} from "@/lib/products";
import { ServiceIcon } from "@/components/brand/ServiceIcon";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "پنل مدیریت فروشگاه | VAICH" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

const DEFAULT_ADMIN_PIN = "Yh111111";

export function AdminPage() {
  const {
    products,
    rows,
    layout,
    setLayout,
    setProducts,
    setRows,
    resetToDefault,
    publishToCloud,
    isCloudSyncing,
    lastCloudSync,
  } = useDynamicProducts();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPin, setInputPin] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "rows" | "layout" | "settings">("products");

  // Cloud Sync Status Message
  const [cloudSyncMsg, setCloudSyncMsg] = useState("");

  // Product Add / Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [featuresText, setFeaturesText] = useState("");
  const [purchaseInfoText, setPurchaseInfoText] = useState("");

  // Category Row Add / Edit Modal State
  const [isEditingRow, setIsEditingRow] = useState(false);
  const [editRow, setEditRow] = useState<Partial<ProductCategoryRow> | null>(null);

  // Settings
  const [newPin, setNewPin] = useState("");
  const [pinChangeMsg, setPinChangeMsg] = useState("");

  // Check existing session
  useEffect(() => {
    const savedAuth = localStorage.getItem("vaich_admin_auth");
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        if (parsed.authenticated) {
          setIsAuthenticated(true);
        }
      } catch (e) {}
    }
  }, []);

  // Publish changes to Cloud to sync across ALL mobile, laptop, and tablet devices
  const handlePublishCloud = async (override?: {
    products?: Product[];
    rows?: ProductCategoryRow[];
    layout?: LayoutMode;
  }) => {
    setCloudSyncMsg("⏳ در حال ذخیره و همگام‌سازی ابری با سرور جهانی...");
    const res = await publishToCloud(override);
    if (res.success) {
      setCloudSyncMsg("✅ با موفقیت در فضای ابری منتشر شد! تمام کاربران روی موبایل و کامپیوتر فوراً تغییرات را می‌بینند.");
      setTimeout(() => setCloudSyncMsg(""), 6000);
    } else {
      setCloudSyncMsg(`❌ خطا در ذخیره ابری: ${res.error || "خطای اتصال به سرور"}`);
    }
  };

  // Required Email + Password Authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const trimmedEmail = inputEmail.trim().toLowerCase();
    const normInput = normalizePin(inputPin);
    const storedPin = localStorage.getItem("vaich_admin_pin");
    const validPin = normalizePin(storedPin || DEFAULT_ADMIN_PIN);

    if (!trimmedEmail) {
      setAuthError("لطفاً ایمیل اختصاصی مدیریت را وارد کنید.");
      return;
    }

    if (!normInput) {
      setAuthError("لطفاً رمز عبور اختصاصی مدیر را وارد کنید.");
      return;
    }

    const isEmailValid = trimmedEmail === "vaichqd4@gmail.com";
    const isPinValid = normInput === validPin;

    if (!isEmailValid || !isPinValid) {
      setAuthError("ایمیل یا رمز عبور مدیر نادرست است.");
      return;
    }

    const session = {
      authenticated: true,
      email: trimmedEmail,
      loggedInAt: new Date().toISOString(),
    };
    localStorage.setItem("vaich_admin_auth", JSON.stringify(session));
    setIsAuthenticated(true);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("vaich_admin_auth");
    setIsAuthenticated(false);
    setInputPin("");
    setInputEmail("");
  };

  // Toggle "ویژه" (Featured) status on a product
  const handleToggleFeatured = (slug: string) => {
    const updated = products.map((p) => {
      if (p.slug === slug) {
        const nextFeatured = !p.featured;
        return {
          ...p,
          featured: nextFeatured,
          badge: nextFeatured ? (p.badge || "پیشنهاد ویژه 🔥") : undefined,
          badgeColor: nextFeatured ? (p.badgeColor || "fire") : undefined,
        };
      }
      return p;
    });
    setProducts(updated);
    handlePublishCloud({ products: updated });
  };

  // Quick discount applicator (e.g. 10%, 20%, 30%, 0%)
  const handleApplyDiscount = (slug: string, percent: number) => {
    const updated = products.map((p) => {
      if (p.slug === slug) {
        const basePrice = p.originalPrice || p.price;
        if (percent === 0) {
          return {
            ...p,
            price: basePrice,
            originalPrice: undefined,
            discountPercent: undefined,
          };
        }
        const discounted = Math.round((basePrice * (100 - percent)) / 100);
        return {
          ...p,
          price: discounted,
          originalPrice: basePrice,
          discountPercent: percent,
        };
      }
      return p;
    });
    setProducts(updated);
    handlePublishCloud({ products: updated });
  };

  // Open Edit Form for Product
  const handleOpenEditProduct = (product: Product) => {
    setEditProduct({ ...product });
    setFeaturesText(product.features ? product.features.join("\n") : "");
    setPurchaseInfoText(product.purchaseInfo ? product.purchaseInfo.join("\n") : "");
    setIsEditing(true);
  };

  // Open Add Form for Product
  const handleOpenAddProduct = () => {
    setEditProduct({
      slug: "",
      name: "",
      price: 0,
      originalPrice: undefined,
      discountPercent: undefined,
      duration: "۱ ماهه",
      description: "",
      featured: false,
      badge: "",
      badgeColor: "purple",
      categoryId: rows[0]?.id || "ai",
      purchaseInfo: [
        "اشتراک با بالاترین پایداری و سلامت فعال می‌شود.",
        "دارای پشتیبانی ۲۴ ساعته در صورت بروز هرگونه مشکل.",
        "اطلاعات پس از تأیید پرداخت ارسال می‌گردد.",
      ],
      features: [
        "⚡ فعال‌سازی قانونی و تضمینی",
        "🚀 دسترسی بدون قطعی و سریع",
        "🛡️ گارانتی کامل در طول دوره",
      ],
    });
    setFeaturesText("⚡ فعال‌سازی قانونی و تضمینی\n🚀 دسترسی بدون قطعی و سریع\n🛡️ گارانتی کامل در طول دوره");
    setPurchaseInfoText("اشتراک با بالاترین پایداری و سلامت فعال می‌شود.\nدارای پشتیبانی ۲۴ ساعته در صورت بروز هرگونه مشکل.\nاطلاعات پس از تأیید پرداخت ارسال می‌گردد.");
    setIsEditing(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct || !editProduct.name || !editProduct.price) {
      alert("لطفاً نام و قیمت محصول را وارد کنید.");
      return;
    }

    const rawSlug = editProduct.slug?.trim() || editProduct.name.toLowerCase().replace(/\s+/g, "-");
    const cleanSlug = rawSlug.replace(/[^a-zA-Z0-9-_\u0600-\u06FF]/g, "");

    const parsedFeatures = featuresText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const parsedPurchaseInfo = purchaseInfoText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const fullProduct: Product = {
      slug: cleanSlug,
      name: editProduct.name.trim(),
      price: Number(editProduct.price),
      originalPrice: editProduct.originalPrice ? Number(editProduct.originalPrice) : undefined,
      discountPercent: editProduct.discountPercent ? Number(editProduct.discountPercent) : undefined,
      duration: editProduct.duration || "۱ ماهه",
      description: editProduct.description || `اشتراک ${editProduct.name}`,
      featured: Boolean(editProduct.featured || editProduct.badge),
      badge: editProduct.badge?.trim() || (editProduct.featured ? "پیشنهاد ویژه 🔥" : undefined),
      badgeColor: editProduct.badgeColor || "purple",
      categoryId: editProduct.categoryId || rows[0]?.id || "ai",
      features: parsedFeatures.length > 0 ? parsedFeatures : undefined,
      purchaseInfo: parsedPurchaseInfo.length > 0 ? parsedPurchaseInfo : ["اطلاعات پس از خرید ارسال می‌شود."],
      iconUrl: editProduct.iconUrl?.trim() || undefined,
    };

    const exists = products.some((p) => p.slug === fullProduct.slug);
    let updated: Product[];

    if (exists) {
      updated = products.map((p) => (p.slug === fullProduct.slug ? fullProduct : p));
    } else {
      updated = [fullProduct, ...products];
    }

    setProducts(updated);
    handlePublishCloud({ products: updated });
    setIsEditing(false);
    setEditProduct(null);
  };

  // Delete Product
  const handleDeleteProduct = (slug: string) => {
    if (confirm("آیا از حذف این محصول اطمینان دارید؟")) {
      const updated = products.filter((p) => p.slug !== slug);
      setProducts(updated);
      handlePublishCloud({ products: updated });
    }
  };

  // Open Add/Edit Row Modal
  const handleOpenAddRow = () => {
    setEditRow({
      id: `row-${Date.now().toString(36)}`,
      title: "",
      subtitle: "",
    });
    setIsEditingRow(true);
  };

  const handleOpenEditRow = (row: ProductCategoryRow) => {
    setEditRow({ ...row });
    setIsEditingRow(true);
  };

  // Save Category Row
  const handleSaveRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRow || !editRow.title) {
      alert("لطفاً عنوان ردیف را وارد کنید.");
      return;
    }

    const cleanId = (editRow.id || `row-${Date.now().toString(36)}`).trim();
    const newRow: ProductCategoryRow = {
      id: cleanId,
      title: editRow.title.trim(),
      subtitle: editRow.subtitle?.trim() || undefined,
    };

    const exists = rows.some((r) => r.id === newRow.id);
    let updatedRows: ProductCategoryRow[];
    if (exists) {
      updatedRows = rows.map((r) => (r.id === newRow.id ? newRow : r));
    } else {
      updatedRows = [...rows, newRow];
    }

    setRows(updatedRows);
    handlePublishCloud({ rows: updatedRows });
    setIsEditingRow(false);
    setEditRow(null);
  };

  // Delete Category Row
  const handleDeleteRow = (id: string) => {
    if (rows.length <= 1) {
      alert("حداقل یک ردیف باید در سایت فعال بماند.");
      return;
    }
    if (confirm("آیا از حذف این ردیف مطمئن هستید؟ محصولات این ردیف به ردیف اصلی منتقل می‌شوند.")) {
      const updatedRows = rows.filter((r) => r.id !== id);
      const fallbackId = updatedRows[0].id;
      const updatedProducts = products.map((p) =>
        p.categoryId === id ? { ...p, categoryId: fallbackId } : p
      );
      setRows(updatedRows);
      setProducts(updatedProducts);
      handlePublishCloud({ rows: updatedRows, products: updatedProducts });
    }
  };

  // Change Admin Master PIN
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || newPin.length < 4) {
      setPinChangeMsg("رمز عبور باید حداقل ۴ کاراکتر باشد.");
      return;
    }
    localStorage.setItem("vaich_admin_pin", newPin);
    setNewPin("");
    setPinChangeMsg("رمز عبور مدیر با موفقیت تغییر کرد!");
    setTimeout(() => setPinChangeMsg(""), 4000);
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (confirm("آیا می‌خواهید همه محصولات و ردیف‌ها به تنظیمات اولیه کارخانه بازگردند؟")) {
      const resetProds = resetToDefault();
      handlePublishCloud({ products: resetProds, rows: DEFAULT_CATEGORY_ROWS, layout: "1-row" });
    }
  };

  // ---------------- LOGIN SCREEN ----------------
  if (!isAuthenticated) {
    return (
      <div className="aurora min-h-[85vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-border/80 bg-card/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-linear-to-tr from-primary/20 to-accent/20 border border-primary/30 text-2xl shadow-inner">
              🔐
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              ورود به پنل مدیریت VAICH
            </h1>
            <p className="mt-2 text-xs leading-6 text-muted-foreground sm:text-sm">
              دسترسی امن مدیر فروشگاه برای مدیریت اشتراک‌ها، ردیف‌ها و چیدمان
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {authError && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-500">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                ایمیل اختصاصی مدیریت (اجباری):
              </label>
              <input
                type="email"
                dir="ltr"
                required
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="ایمیل مدیر را وارد کنید"
                className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                رمز عبور اختصاصی پنل (اجباری):
              </label>
              <input
                type="password"
                dir="ltr"
                required
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value)}
                placeholder="رمز عبور مدیر را وارد کنید"
                className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="neon-gradient w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              ورود به پنل مدیریت
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              ← بازگشت به صفحه اصلی فروشگاه
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- AUTHENTICATED ADMIN DASHBOARD ----------------
  const featuredCount = products.filter((p) => p.featured || p.badge).length;
  const discountedCount = products.filter((p) => p.originalPrice || p.discountPercent).length;

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Top Admin Header Bar */}
      <div className="sticky top-0 z-40 border-b border-border/80 bg-card/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/20 text-primary font-bold">
              ⚡
            </span>
            <div>
              <h1 className="text-base font-extrabold text-foreground sm:text-lg">
                پنل مدیریت فروشگاه VAICH
              </h1>
              <p className="text-[11px] text-muted-foreground">
                سطح دسترسی: <span className="font-semibold text-emerald-500">مدیر کل فروشگاه (تایید‌شده ✓)</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden sm:inline-flex rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              مشاهده فروشگاه
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
            >
              خروج
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("products")}
            className={`rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "products"
                ? "bg-primary text-white shadow-md"
                : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            📦 مدیریت محصولات ({toPersianDigits(products.length)})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("rows")}
            className={`rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "rows"
                ? "bg-primary text-white shadow-md"
                : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            📑 مدیریت ردیف‌ها و دسته‌بندی‌ها ({toPersianDigits(rows.length)})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("layout")}
            className={`rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "layout"
                ? "bg-primary text-white shadow-md"
                : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            📐 چیدمان نوار سایت ({layout === "1-row" ? "۱ ردیفه" : layout === "2-row" ? "۲ ردیفه" : "شبکه‌ای"})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "settings"
                ? "bg-primary text-white shadow-md"
                : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            ⚙️ رمز عبور و تنظیمات
          </button>
        </div>

        {/* Global Cloud Persistence & Multi-Device Sync Bar */}
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-purple-500/30 bg-purple-500/10 p-4">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <div className="text-xs">
              <div className="font-bold text-foreground flex items-center gap-2">
                <span>همگام‌سازی ابری سراسری (فعال و متصل ✓)</span>
                {lastCloudSync && (
                  <span className="text-[10px] text-muted-foreground font-normal">
                    (آخرین همگام‌سازی: {new Date(lastCloudSync).toLocaleTimeString("fa-IR")})
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-muted-foreground text-[11px]">
                هر تغییری در این پنل اعمال کنید، بلافاصله در فضای ابری ذخیره شده و روی تمام دستگاه‌ها (موبایل، کامپیوتر و تبلت) برای همه بازدیدکنندگان زنده اعمال می‌شود.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              disabled={isCloudSyncing}
              onClick={() => handlePublishCloud()}
              className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white px-4 py-2 text-xs font-bold shadow-md transition-all disabled:opacity-50"
            >
              {isCloudSyncing ? (
                <>
                  <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>در حال ذخیره در سرور ابری...</span>
                </>
              ) : (
                <>
                  <span>🚀 انتشار سراسری در سرور</span>
                </>
              )}
            </button>
          </div>
        </div>

        {cloudSyncMsg && (
          <div className="mt-3 rounded-2xl border border-purple-500/40 bg-purple-500/15 p-3.5 text-xs font-bold text-purple-700 dark:text-purple-300">
            {cloudSyncMsg}
          </div>
        )}

        {/* ---------------- TAB 1: PRODUCTS MANAGEMENT ---------------- */}
        {activeTab === "products" && (
          <div className="mt-6 space-y-6">
            {/* Quick Stats & Add Button */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-border/80 bg-card p-4">
                <span className="text-xs text-muted-foreground">کل محصولات</span>
                <p className="mt-1 text-2xl font-black text-foreground">
                  {toPersianDigits(products.length)}
                </p>
              </div>

              <div className="rounded-3xl border border-border/80 bg-card p-4">
                <span className="text-xs text-muted-foreground">محصولات برچسب‌دار</span>
                <p className="mt-1 text-2xl font-black text-primary">
                  {toPersianDigits(featuredCount)}
                </p>
              </div>

              <div className="rounded-3xl border border-border/80 bg-card p-4">
                <span className="text-xs text-muted-foreground">دارای تخفیف فعال</span>
                <p className="mt-1 text-2xl font-black text-emerald-500">
                  {toPersianDigits(discountedCount)}
                </p>
              </div>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={handleOpenAddProduct}
                  className="neon-gradient flex h-full w-full items-center justify-center gap-2 rounded-3xl p-4 text-sm font-extrabold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="text-xl">+</span>
                  <span>افزودن محصول جدید</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs">
              <div className="border-b border-border/60 p-4 sm:px-6">
                <h2 className="text-base font-bold text-foreground">
                  لیست اشتراک‌ها و محصولات فروشگاه
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  می‌توانید برچسب دلخواه با رنگ‌های اختصاصی بنویسید، آن را حذف کنید یا به ردیف‌های مختلف اختصاص دهید.
                </p>
              </div>

              <div className="divide-y divide-border/60">
                {products.map((p) => {
                  const hasBadge = Boolean(p.badge || p.featured);
                  const rowObj = rows.find((r) => r.id === (p.categoryId || "ai"));

                  return (
                    <div
                      key={p.slug}
                      className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 hover:bg-secondary/20 transition-colors"
                    >
                      {/* Product Info */}
                      <div className="flex items-center gap-3.5">
                        <ServiceIcon slug={p.slug} iconUrl={p.iconUrl} className="h-12 w-12" />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-foreground">{p.name}</h3>
                            {hasBadge && (
                              <span
                                className={`rounded-full px-2 py-0.5 text-[10px] font-bold text-white shadow-xs ${
                                  p.badgeColor === "fire"
                                    ? "bg-linear-to-r from-rose-500 to-amber-500"
                                    : p.badgeColor === "emerald"
                                    ? "bg-emerald-600"
                                    : p.badgeColor === "blue"
                                    ? "bg-blue-600"
                                    : p.badgeColor === "amber"
                                    ? "bg-amber-400 text-slate-950"
                                    : "bg-linear-to-r from-primary to-accent"
                                }`}
                              >
                                {p.badge || "پیشنهاد ویژه 🔥"}
                              </span>
                            )}
                            {p.discountPercent && (
                              <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500 border border-rose-500/20">
                                %{toPersianDigits(p.discountPercent)} تخفیف
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span>شناسه: <code className="text-foreground">{p.slug}</code></span>
                            {p.duration && <span>مدت: {p.duration}</span>}
                            <span>ردیف: <span className="font-medium text-foreground">{rowObj?.title || "اصلی"}</span></span>
                          </div>
                        </div>
                      </div>

                      {/* Price Details */}
                      <div className="flex items-baseline gap-2 sm:text-left">
                        <span className="gradient-text text-lg font-black">
                          {formatPrice(p.price)}
                        </span>
                        {p.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            {formatPrice(p.originalPrice)}
                          </span>
                        )}
                      </div>

                      {/* Action Controls */}
                      <div className="flex flex-wrap items-center gap-2">
                        {/* 1-Click Toggle ویژه */}
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p.slug)}
                          className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                            hasBadge
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {hasBadge ? "★ برچسب فعال" : "☆ افزودن برچسب ویژه"}
                        </button>

                        {/* Quick Discount Presets */}
                        <div className="hidden lg:flex items-center gap-1 rounded-xl border border-border/70 bg-secondary/30 p-1">
                          <button
                            type="button"
                            onClick={() => handleApplyDiscount(p.slug, 10)}
                            className="rounded-lg px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-card hover:text-foreground"
                          >
                            ۱۰٪
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplyDiscount(p.slug, 20)}
                            className="rounded-lg px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-card hover:text-foreground"
                          >
                            ۲۰٪
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplyDiscount(p.slug, 30)}
                            className="rounded-lg px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-card hover:text-foreground"
                          >
                            ۳۰٪
                          </button>
                          <button
                            type="button"
                            onClick={() => handleApplyDiscount(p.slug, 0)}
                            className="rounded-lg px-2 py-0.5 text-[10px] font-medium text-rose-500 hover:bg-rose-500/10"
                          >
                            حذف تخفیف
                          </button>
                        </div>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEditProduct(p)}
                          className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                          ویرایش و شخصی‌سازی
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.slug)}
                          className="rounded-xl border border-rose-500/30 bg-rose-500/5 px-2.5 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                          title="حذف محصول"
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 2: ROW & CATEGORY MANAGER ---------------- */}
        {activeTab === "rows" && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-card p-6">
              <div>
                <h2 className="text-lg font-bold text-foreground">
                  مدیریت ردیف‌های اختصاصی صفحه اصلی
                </h2>
                <p className="mt-1 text-xs text-muted-foreground leading-5">
                  می‌توانید هر تعداد ردیف جدید (مثل پلنرها، ابزارها، اکانت‌های اختصاصی یا محصولات دیگر) اضافه کنید و محصولات مورد نظر را در آن قرار دهید.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddRow}
                className="neon-gradient shrink-0 rounded-2xl px-5 py-2.5 text-xs font-extrabold text-white shadow-md transition-transform hover:scale-105"
              >
                + افزودن ردیف جدید
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {rows.map((row) => {
                const count = products.filter((p) => (p.categoryId || "ai") === row.id).length;

                return (
                  <div key={row.id} className="rounded-3xl border border-border/80 bg-card p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="rounded-xl bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                        شناسه ردیف: {row.id}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {toPersianDigits(count)} محصول
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-foreground">{row.title}</h3>
                    {row.subtitle && (
                      <p className="text-xs text-muted-foreground leading-5">{row.subtitle}</p>
                    )}

                    <div className="flex items-center gap-2 pt-2 border-t border-border/60">
                      <button
                        type="button"
                        onClick={() => handleOpenEditRow(row)}
                        className="rounded-xl border border-border bg-secondary/50 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary transition-all"
                      >
                        ویرایش عنوان
                      </button>
                      {rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(row.id)}
                          className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                        >
                          حذف ردیف
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: LAYOUT CONTROLLER ---------------- */}
        {activeTab === "layout" && (
          <div className="mt-6 space-y-6">
            <div className="rounded-3xl border border-border/80 bg-card p-6">
              <h2 className="text-lg font-bold text-foreground">
                تعیین چیدمان پیش‌فرض نوار اکانت‌ها برای کاربران
              </h2>
              <p className="mt-1 text-xs text-muted-foreground leading-5">
                شما تعیین می‌کنید کاربران محصولات را در ۱ ردیف، ۲ ردیف یا شبکه‌ای ببینند. کاربران عادی دسترسی به تغییر این ظاهر را در سایت ندارند.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {/* 1-Row Mode */}
                <div
                  onClick={() => {
                    setLayout("1-row");
                    handlePublishCloud({ layout: "1-row" });
                  }}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                    layout === "1-row"
                      ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/40"
                      : "border-border bg-secondary/30 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">↔️</span>
                    {layout === "1-row" && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                        فعال
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-bold text-foreground">۱ ردیفه (اسلایدر ۳بعدی تک ردیفه)</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-5">
                    محصولات در یک ردیف تمیز قرار گرفته و با دکمه‌ها و لمس به چپ و راست حرکت می‌کنند.
                  </p>
                </div>

                {/* 2-Row Mode */}
                <div
                  onClick={() => {
                    setLayout("2-row");
                    handlePublishCloud({ layout: "2-row" });
                  }}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                    layout === "2-row"
                      ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/40"
                      : "border-border bg-secondary/30 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">⚌</span>
                    {layout === "2-row" && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                        فعال
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-bold text-foreground">۲ ردیفه (اسلایدر ۲ طبقه همزمان)</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-5">
                    کارت‌ها در دو ردیف همزمان و فشرده قرار گرفته و همزمان اسکرول می‌شوند.
                  </p>
                </div>

                {/* Grid Mode */}
                <div
                  onClick={() => {
                    setLayout("grid");
                    handlePublishCloud({ layout: "grid" });
                  }}
                  className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                    layout === "grid"
                      ? "border-primary bg-primary/10 shadow-md ring-2 ring-primary/40"
                      : "border-border bg-secondary/30 hover:border-border/80"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">▦</span>
                    {layout === "grid" && (
                      <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                        فعال
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-bold text-foreground">شبکه‌ای چندستونه</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-5">
                    محصولات در ستون‌ها و ردیف‌های منظم باز شده و کل صفحه را پر می‌کنند.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                ✓ تنظیمات به طور خودکار ذخیره شده و هم‌اکنون برای تمام بازدیدکنندگان اعمال است.
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 4: SETTINGS ---------------- */}
        {activeTab === "settings" && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {/* Change Master PIN */}
            <div className="rounded-3xl border border-border/80 bg-card p-6">
              <h2 className="text-base font-bold text-foreground">
                تغییر رمز عبور ورود به پنل
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                وضعیت امنیت: <span className="text-emerald-500 font-bold">رمز عبور اختصاصی فعال است</span>
              </p>

              <form onSubmit={handleChangePin} className="mt-4 space-y-3">
                {pinChangeMsg && (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs font-semibold text-emerald-500">
                    {pinChangeMsg}
                  </div>
                )}
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    رمز عبور جدید:
                  </label>
                  <input
                    type="password"
                    dir="ltr"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    placeholder="رمز عبور جدید را وارد کنید"
                    className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary/90 transition-all"
                >
                  ذخیره رمز جدید
                </button>
              </form>
            </div>

            {/* Reset Defaults */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4">
              <h2 className="text-base font-bold text-foreground">
                تنظیمات کارخانه
              </h2>
              <p className="text-xs text-muted-foreground leading-5">
                در صورت نیاز می‌توانید محصولات و ردیف‌های سایت را به حالت پیش‌فرض اولیه بازگردانید.
              </p>

              <button
                type="button"
                onClick={handleResetToDefault}
                className="flex items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 py-3 text-xs font-bold text-rose-500 hover:bg-rose-500 hover:text-white transition-all w-full"
              >
                <span>⚠️</span>
                <span>بازنشانی به محصولات و ردیف‌های پیش‌فرض VAICH</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ---------------- ADD / EDIT PRODUCT MODAL ---------------- */}
      {isEditing && editProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="text-lg font-bold text-foreground">
                {editProduct.slug && products.some((p) => p.slug === editProduct.slug)
                  ? `ویرایش و شخصی‌سازی: ${editProduct.name}`
                  : "افزودن محصول جدید"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditProduct(null);
                }}
                className="grid h-8 w-8 place-items-center rounded-xl bg-secondary text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="mt-4 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    نام محصول: *
                  </label>
                  <input
                    type="text"
                    required
                    value={editProduct.name || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, name: e.target.value })}
                    placeholder="مثلاً: ChatGPT Plus شخصی"
                    className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    شناسه انگلیسی (Slug یکتا): *
                  </label>
                  <input
                    type="text"
                    required
                    dir="ltr"
                    value={editProduct.slug || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, slug: e.target.value })}
                    placeholder="مثلاً: chatgpt-plus"
                    className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Category Assignment */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  ردیف / دسته‌بندی نمایش در سایت:
                </label>
                <select
                  value={editProduct.categoryId || rows[0]?.id || "ai"}
                  onChange={(e) => setEditProduct({ ...editProduct, categoryId: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
                >
                  {rows.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Pricing */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    قیمت فروش (تومان): *
                  </label>
                  <input
                    type="number"
                    required
                    value={editProduct.price || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, price: Number(e.target.value) })}
                    placeholder="5350000"
                    className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    قیمت خط خورده (قبل تخفیف):
                  </label>
                  <input
                    type="number"
                    value={editProduct.originalPrice || ""}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        originalPrice: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="اختیاری"
                    className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    درصد تخفیف (%):
                  </label>
                  <input
                    type="number"
                    value={editProduct.discountPercent || ""}
                    onChange={(e) =>
                      setEditProduct({
                        ...editProduct,
                        discountPercent: e.target.value ? Number(e.target.value) : undefined,
                      })
                    }
                    placeholder="مثلاً: 25"
                    className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    مدت اعتبار:
                  </label>
                  <input
                    type="text"
                    value={editProduct.duration || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, duration: e.target.value })}
                    placeholder="مثلاً: ۱ ماهه، ۶۰ روزه، ۱۸ ماهه"
                    className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    متن برچسب (دلخواه):
                  </label>
                  <input
                    type="text"
                    value={editProduct.badge || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, badge: e.target.value })}
                    placeholder="مثلاً: پیشنهاد ویژه 🔥 (یا خالی)"
                    className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Badge Customizer & Color Picker */}
              <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">رنگ و استایل برچسب:</span>
                  <button
                    type="button"
                    onClick={() => setEditProduct({ ...editProduct, badge: "", featured: false })}
                    className="text-[11px] text-rose-500 font-semibold hover:underline"
                  >
                    حذف برچسب (بدون برچسب)
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditProduct({ ...editProduct, badgeColor: "fire" })}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      editProduct.badgeColor === "fire"
                        ? "bg-linear-to-r from-rose-500 to-amber-500 text-white ring-2 ring-rose-400"
                        : "bg-card border border-border text-foreground hover:bg-secondary"
                    }`}
                  >
                    🔥 قرمز آتشین
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditProduct({ ...editProduct, badgeColor: "purple" })}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      editProduct.badgeColor === "purple"
                        ? "bg-linear-to-r from-primary to-accent text-white ring-2 ring-primary"
                        : "bg-card border border-border text-foreground hover:bg-secondary"
                    }`}
                  >
                    🟣 بنفش نئونی
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditProduct({ ...editProduct, badgeColor: "emerald" })}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      editProduct.badgeColor === "emerald"
                        ? "bg-emerald-600 text-white ring-2 ring-emerald-400"
                        : "bg-card border border-border text-foreground hover:bg-secondary"
                    }`}
                  >
                    🟢 سبز زمردی
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditProduct({ ...editProduct, badgeColor: "blue" })}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      editProduct.badgeColor === "blue"
                        ? "bg-blue-600 text-white ring-2 ring-blue-400"
                        : "bg-card border border-border text-foreground hover:bg-secondary"
                    }`}
                  >
                    🔵 آبی الکتریک
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditProduct({ ...editProduct, badgeColor: "amber" })}
                    className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                      editProduct.badgeColor === "amber"
                        ? "bg-amber-400 text-slate-950 font-black ring-2 ring-amber-300"
                        : "bg-card border border-border text-foreground hover:bg-secondary"
                    }`}
                  >
                    🟡 طلایی
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  توضیح کوتاه محصول:
                </label>
                <input
                  type="text"
                  value={editProduct.description || ""}
                  onChange={(e) => setEditProduct({ ...editProduct, description: e.target.value })}
                  placeholder="توضیح کوتاه ۱ یا ۲ جمله‌ای"
                  className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  ویژگی‌ها و امکانات (هر سطر یک مورد):
                </label>
                <textarea
                  rows={4}
                  value={featuresText}
                  onChange={(e) => setFeaturesText(e.target.value)}
                  placeholder="⚡ ویژگی اول&#10;💻 ویژگی دوم&#10;🚀 ویژگی سوم"
                  className="w-full rounded-2xl border border-border bg-background/60 p-3 text-xs leading-6 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  نکات مهم خرید (هر سطر یک مورد):
                </label>
                <textarea
                  rows={3}
                  value={purchaseInfoText}
                  onChange={(e) => setPurchaseInfoText(e.target.value)}
                  placeholder="نکته اول خرید&#10;نکته دوم خرید"
                  className="w-full rounded-2xl border border-border bg-background/60 p-3 text-xs leading-6 outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditProduct(null);
                  }}
                  className="rounded-2xl border border-border px-5 py-2.5 text-xs font-semibold text-muted-foreground hover:bg-secondary"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="neon-gradient rounded-2xl px-6 py-2.5 text-xs font-bold text-white shadow-md transition-transform hover:scale-[1.02]"
                >
                  ذخیره محصول
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- ADD / EDIT ROW MODAL ---------------- */}
      {isEditingRow && editRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="text-base font-bold text-foreground">
                {rows.some((r) => r.id === editRow.id) ? "ویرایش ردیف" : "افزودن ردیف جدید"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsEditingRow(false);
                  setEditRow(null);
                }}
                className="grid h-8 w-8 place-items-center rounded-xl bg-secondary text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveRow} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  عنوان ردیف: *
                </label>
                <input
                  type="text"
                  required
                  value={editRow.title || ""}
                  onChange={(e) => setEditRow({ ...editRow, title: e.target.value })}
                  placeholder="مثلاً: پلنرها و فایل‌های کاربردی یا محصولات دیگر"
                  className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  زیرعنوان توضیحی (دلخواه):
                </label>
                <input
                  type="text"
                  value={editRow.subtitle || ""}
                  onChange={(e) => setEditRow({ ...editRow, subtitle: e.target.value })}
                  placeholder="توضیح کوتاه زیر عنوان ردیف"
                  className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingRow(false);
                    setEditRow(null);
                  }}
                  className="rounded-2xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="neon-gradient rounded-2xl px-5 py-2 text-xs font-bold text-white shadow-md transition-transform hover:scale-105"
                >
                  ذخیره ردیف
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
