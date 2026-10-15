import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  useDynamicProducts,
  formatPrice,
  toPersianDigits,
  type Product,
  type LayoutMode,
  DEFAULT_PRODUCTS,
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

const DEFAULT_ADMIN_PIN = "vaich2026";

export function AdminPage() {
  const { products, layout, setLayout, setProducts, resetToDefault } = useDynamicProducts();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [googleUser, setGoogleUser] = useState<string | null>(null);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPin, setInputPin] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "layout" | "settings">("products");

  // Modal / Form state for Add/Edit
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [featuresText, setFeaturesText] = useState("");
  const [purchaseInfoText, setPurchaseInfoText] = useState("");

  // Store settings
  const [customPin, setCustomPin] = useState("");
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
          setGoogleUser(parsed.email || "مدیر VAICH");
        }
      } catch (e) {}
    }
    const savedPin = localStorage.getItem("vaich_admin_pin");
    if (savedPin) {
      setCustomPin(savedPin);
    }
  }, []);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const currentMasterPin = localStorage.getItem("vaich_admin_pin") || DEFAULT_ADMIN_PIN;

    if (!inputPin) {
      setAuthError("لطفاً رمز عبور مدیر را وارد کنید.");
      return;
    }

    if (inputPin !== currentMasterPin) {
      setAuthError("رمز عبور اشتباه است. (پیش‌فرض: vaich2026)");
      return;
    }

    const email = inputEmail.trim() || "vaichqd4@gmail.com";
    const session = {
      authenticated: true,
      email: email,
      loggedInAt: new Date().toISOString(),
    };

    localStorage.setItem("vaich_admin_auth", JSON.stringify(session));
    setIsAuthenticated(true);
    setGoogleUser(email);
  };

  // Google One-Click Login Simulation / Trigger
  const handleGoogleQuickLogin = () => {
    const defaultEmail = "vaichqd4@gmail.com";
    setInputEmail(defaultEmail);
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("vaich_admin_auth");
    setIsAuthenticated(false);
    setGoogleUser(null);
    setInputPin("");
  };

  // Toggle "ویژه" (Featured) status
  const handleToggleFeatured = (slug: string) => {
    const updated = products.map((p) => {
      if (p.slug === slug) {
        const nextFeatured = !p.featured;
        return {
          ...p,
          featured: nextFeatured,
          badge: nextFeatured ? (p.badge || "پیشنهاد ویژه 🔥") : undefined,
        };
      }
      return p;
    });
    setProducts(updated);
  };

  // Quick discount applicator (e.g. 10%, 20%, 30%, 50%)
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
  };

  // Open Edit Form
  const handleOpenEdit = (product: Product) => {
    setEditProduct({ ...product });
    setFeaturesText(product.features ? product.features.join("\n") : "");
    setPurchaseInfoText(product.purchaseInfo ? product.purchaseInfo.join("\n") : "");
    setIsEditing(true);
  };

  // Open Add Form
  const handleOpenAdd = () => {
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
      purchaseInfo: [
        "اشتراک با بالاترین پایداری و سلامت فعال می‌شود.",
        "دارای پشتیبانی ۲۴ ساعته.",
        "اطلاعات پس از پرداخت در تلگرام ارسال می‌گردد.",
      ],
      features: [
        "⚡ فعال‌سازی قانونی و تضمینی",
        "🚀 دسترسی بدون محدودیت",
        "🛡️ گارانتی سلامت در طول دوره",
      ],
    });
    setFeaturesText("⚡ فعال‌سازی قانونی و تضمینی\n🚀 دسترسی بدون محدودیت\n🛡️ گارانتی سلامت در طول دوره");
    setPurchaseInfoText("اشتراک با بالاترین پایداری و سلامت فعال می‌شود.\nدارای پشتیبانی ۲۴ ساعته.\nاطلاعات پس از پرداخت در تلگرام ارسال می‌گردد.");
    setIsEditing(true);
  };

  // Save product (Add or Edit)
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
      description: editProduct.description || `اشتراک هوش مصنوعی ${editProduct.name}`,
      featured: Boolean(editProduct.featured),
      badge: editProduct.badge?.trim() || (editProduct.featured ? "پیشنهاد ویژه 🔥" : undefined),
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
    setIsEditing(false);
    setEditProduct(null);
  };

  // Delete product
  const handleDeleteProduct = (slug: string) => {
    if (confirm("آیا از حذف این محصول اطمینان دارید؟")) {
      const updated = products.filter((p) => p.slug !== slug);
      setProducts(updated);
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
    setCustomPin(newPin);
    setNewPin("");
    setPinChangeMsg("رمز عبور مدیر با موفقیت تغییر کرد!");
    setTimeout(() => setPinChangeMsg(""), 4000);
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(products, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vaich-products-${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Reset to default
  const handleResetToDefault = () => {
    if (confirm("آیا می‌خواهید همه محصولات به لیست اولیه سایت بازنشانی شوند؟ تمام تغییرات شما پاک خواهد شد.")) {
      resetToDefault();
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
              دسترسی اختصاصی مدیریت برای مدیریت محصولات، تخفیف‌ها و چیدمان نوار اکانت‌ها
            </p>
          </div>

          {/* Google Account Quick Sign-in Section */}
          <div className="mt-6 border-y border-border/60 py-4">
            <button
              type="button"
              onClick={handleGoogleQuickLogin}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-border/80 bg-secondary/70 px-4 py-3 text-xs sm:text-sm font-semibold text-foreground transition-all hover:border-primary hover:bg-secondary active:scale-[0.98]"
            >
              {/* Google G SVG */}
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>ورود با اکانت گوگل (مدیر سایت)</span>
            </button>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {authError && (
              <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs font-semibold text-rose-500">
                {authError}
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                ایمیل اکانت گوگل شما:
              </label>
              <input
                type="email"
                dir="ltr"
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="vaichqd4@gmail.com"
                className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                رمز عبور اختصاصی پنل:
              </label>
              <input
                type="password"
                dir="ltr"
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value)}
                placeholder="رمز عبور مدیر (پیش‌فرض: vaich2026)"
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
                ورود با: <span className="font-semibold text-foreground">{googleUser}</span>
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
            onClick={() => setActiveTab("layout")}
            className={`rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "layout"
                ? "bg-primary text-white shadow-md"
                : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            📐 تنظیم ردیف نوار اکانت‌ها ({layout === "1-row" ? "۱ ردیفه" : layout === "2-row" ? "۲ ردیفه" : "شبکه‌ای"})
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
            ⚙️ تنظیمات و رمز عبور
          </button>
        </div>

        {/* ---------------- TAB 1: PRODUCTS MANAGEMENT ---------------- */}
        {activeTab === "products" && (
          <div className="mt-6 space-y-6">
            {/* Quick Stats & Add Product Button */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-border/80 bg-card p-4">
                <span className="text-xs text-muted-foreground">کل محصولات</span>
                <p className="mt-1 text-2xl font-black text-foreground">
                  {toPersianDigits(products.length)}
                </p>
              </div>

              <div className="rounded-3xl border border-border/80 bg-card p-4">
                <span className="text-xs text-muted-foreground">محصولات با برچسب ویژه 🔥</span>
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
                  onClick={handleOpenAdd}
                  className="neon-gradient flex h-full w-full items-center justify-center gap-2 rounded-3xl p-4 text-sm font-extrabold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span className="text-xl">+</span>
                  <span>افزودن محصول جدید</span>
                </button>
              </div>
            </div>

            {/* Products Table / Cards */}
            <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs">
              <div className="border-b border-border/60 p-4 sm:px-6">
                <h2 className="text-base font-bold text-foreground">
                  لیست اشتراک‌های موجود در فروشگاه
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  می‌توانید با یک کلیک وضعیت ویژه را تغییر دهید، تخفیف اعمال کنید یا مشخصات محصول را ویرایش کنید.
                </p>
              </div>

              <div className="divide-y divide-border/60">
                {products.map((p) => {
                  const isFeatured = p.featured || p.badge || p.slug === "gemini-pro";

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
                            {isFeatured && (
                              <span className="rounded-full bg-linear-to-r from-primary to-accent px-2 py-0.5 text-[10px] font-bold text-white shadow-xs">
                                {p.badge || "ویژه 🔥"}
                              </span>
                            )}
                            {p.discountPercent && (
                              <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-500 border border-rose-500/20">
                                %{toPersianDigits(p.discountPercent)} تخفیف
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                            <span>شناسه: <code className="text-foreground">{p.slug}</code></span>
                            {p.duration && <span>مدت: {p.duration}</span>}
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
                        {/* Toggle ویژه */}
                        <button
                          type="button"
                          onClick={() => handleToggleFeatured(p.slug)}
                          title="تغییر وضعیت پیشنهاد ویژه"
                          className={`rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                            isFeatured
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {isFeatured ? "★ ویژه (فعال)" : "☆ تنظیم ویژه"}
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
                            title="حذف تخفیف"
                            className="rounded-lg px-2 py-0.5 text-[10px] font-medium text-rose-500 hover:bg-rose-500/10"
                          >
                            حذف تخفیف
                          </button>
                        </div>

                        {/* Edit Button */}
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(p)}
                          className="rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                          ویرایش
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

        {/* ---------------- TAB 2: LAYOUT CONTROLLER ---------------- */}
        {activeTab === "layout" && (
          <div className="mt-6 space-y-6">
            <div className="rounded-3xl border border-border/80 bg-card p-6">
              <h2 className="text-lg font-bold text-foreground">
                تنظیم چیدمان پیش‌فرض نوار اکانت‌ها در صفحه اصلی
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                مشخص کنید هنگامی که کاربران وارد سایت می‌شوند، اشتراک‌ها در چند ردیف نمایش داده شوند.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {/* 1-Row Mode */}
                <div
                  onClick={() => setLayout("1-row")}
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
                  <h3 className="mt-3 font-bold text-foreground">۱ ردیفه (اسلایدر ۳بعدی افقی)</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-5">
                    تمام اشتراک‌ها در یک ردیف منظم و مدرن قرار می‌گیرند و با دکمه یا کشیدن به چپ و راست اسکرول می‌شوند.
                  </p>
                </div>

                {/* 2-Row Mode */}
                <div
                  onClick={() => setLayout("2-row")}
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
                  <h3 className="mt-3 font-bold text-foreground">۲ ردیفه (اسلایدر افقی ۲ طبقه)</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-5">
                    محصولات در ۲ ردیف همزمان و فشرده قرار گرفته و همزمان اسکرول می‌شوند؛ مناسب زمانی که تعداد محصولات بیشتر است.
                  </p>
                </div>

                {/* Grid Mode */}
                <div
                  onClick={() => setLayout("grid")}
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
                  <h3 className="mt-3 font-bold text-foreground">شبکه‌ای کامل (چند ردیفه)</h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-5">
                    محصولات به صورت شبکه‌ای در ردیف‌ها و ستون‌های منظم نمایش داده می‌شوند و کل صفحه را پر می‌کنند.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                ✓ تنظیمات به طور خودکار ذخیره شده و هم‌اکنون در صفحه اصلی فعال است.
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 3: SETTINGS ---------------- */}
        {activeTab === "settings" && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {/* Change Master PIN */}
            <div className="rounded-3xl border border-border/80 bg-card p-6">
              <h2 className="text-base font-bold text-foreground">
                تغییر رمز عبور ورود به پنل
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                رمز عبور فعلی: <code className="text-primary font-bold">{customPin || DEFAULT_ADMIN_PIN}</code>
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

            {/* Backup & Reset */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4">
              <h2 className="text-base font-bold text-foreground">
                پشتیبان‌گیری و بازنشانی
              </h2>
              <p className="text-xs text-muted-foreground">
                می‌توانید از لیست تمام محصولات فایل پشتیبان دانلود کنید، یا در صورت نیاز به تنظیمات اولیه بازگردانید.
              </p>

              <div className="flex flex-col gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-border bg-secondary/50 py-3 text-xs font-bold text-foreground hover:bg-secondary transition-all"
                >
                  <span>📥</span>
                  <span>دانلود فایل پشتیبان محصولات (JSON)</span>
                </button>

                <button
                  type="button"
                  onClick={handleResetToDefault}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 py-3 text-xs font-bold text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                >
                  <span>⚠️</span>
                  <span>بازنشانی به محصولات اولیه VAICH</span>
                </button>
              </div>
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
                  ? `ویرایش محصول: ${editProduct.name}`
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
                    نام محصول (فارسی / انگلیسی): *
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
                    شناسه انگلیسی یکتا (Slug): *
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
                    placeholder="اختیاری - مثلاً 6000000"
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
                    متن برچسب ویژه (دلخواه):
                  </label>
                  <input
                    type="text"
                    value={editProduct.badge || ""}
                    onChange={(e) => setEditProduct({ ...editProduct, badge: e.target.value })}
                    placeholder="مثلاً: پیشنهاد ویژه 🔥"
                    className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer py-1">
                  <input
                    type="checkbox"
                    checked={Boolean(editProduct.featured)}
                    onChange={(e) => setEditProduct({ ...editProduct, featured: e.target.checked })}
                    className="h-4 w-4 rounded accent-primary"
                  />
                  <span className="text-xs font-bold text-foreground">
                    نمایش به عنوان «پیشنهاد ویژه» در کارت محصول
                  </span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  توضیحات کوتاه محصول:
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
    </div>
  );
}
