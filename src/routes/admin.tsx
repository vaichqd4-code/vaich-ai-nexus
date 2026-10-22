import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  useDynamicProducts,
  formatPrice,
  toPersianDigits,
  normalizePin,
  DEFAULT_ADMIN_PIN,
  MASTER_ADMIN_EMAIL,
  DEFAULT_CATEGORY_ROWS,
  DEFAULT_PROMO_BANNER,
  DEFAULT_INSTAGRAM_URL,
  type Product,
  type ProductCategoryRow,
  type LayoutMode,
  type AdminUser,
  type PromoBannerConfig,
} from "@/lib/products";
import { ServiceIcon, getProductLogo, PRESET_LOGOS } from "@/components/brand/ServiceIcon";
import {
  ShieldCheck,
  Lock,
  Package,
  Layers,
  LayoutGrid,
  KeyRound,
  Users,
  UserPlus,
  Trash2,
  Edit3,
  Plus,
  X,
  Sparkles,
  Rows,
  Columns,
  LogOut,
  RefreshCw,
  Check,
  AlertTriangle,
  ExternalLink,
  Star,
  Shield,
  Mail,
  UserCheck,
  Upload,
  ImageIcon,
  Instagram,
} from "lucide-react";

// Client-side image compressor for mobile and desktop uploads
function compressAndResizeImage(
  file: File,
  maxWidth = 480,
  maxHeight = 480,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("خطا در خواندن فایل"));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error("خطا در بارگذاری تصویر"));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width = Math.round(width * ratio);
          height = Math.round(height * ratio);
        }
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        let dataUrl = canvas.toDataURL("image/webp", quality);
        if (!dataUrl.startsWith("data:image/webp")) {
          dataUrl = canvas.toDataURL("image/jpeg", quality);
        }
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "پنل مدیریت فروشگاه | VAICH" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

export function AdminPage() {
  const {
    products,
    rows,
    layout,
    adminUsers,
    masterPin,
    promoBanner,
    instagramUrl,
    setLayout,
    setProducts,
    setRows,
    setAdminUsers,
    setMasterPin,
    setPromoBanner,
    setInstagramUrl,
    resetToDefault,
    publishToCloud,
    isCloudSyncing,
    lastCloudSync,
  } = useDynamicProducts();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: string } | null>(null);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPin, setInputPin] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "rows" | "layout" | "admins" | "banner" | "settings">("products");

  // Promo Banner State
  const [bannerConfig, setBannerConfig] = useState<PromoBannerConfig>(promoBanner || DEFAULT_PROMO_BANNER);
  const [isCompressingBanner, setIsCompressingBanner] = useState(false);
  const [bannerUploadError, setBannerUploadError] = useState("");
  const [bannerSaveMsg, setBannerSaveMsg] = useState("");

  // Instagram Settings State
  const [instagramInput, setInstagramInput] = useState(instagramUrl || DEFAULT_INSTAGRAM_URL);
  const [instagramSaveMsg, setInstagramSaveMsg] = useState("");

  useEffect(() => {
    if (promoBanner) setBannerConfig(promoBanner);
  }, [promoBanner]);

  useEffect(() => {
    if (instagramUrl) setInstagramInput(instagramUrl);
  }, [instagramUrl]);

  // Admin Management Modal State
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [editAdminUser, setEditAdminUser] = useState<Partial<AdminUser> | null>(null);

  // Cloud Sync Status Message
  const [cloudSyncMsg, setCloudSyncMsg] = useState("");

  // Product Add / Edit Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState<Partial<Product> | null>(null);
  const [featuresText, setFeaturesText] = useState("");
  const [purchaseInfoText, setPurchaseInfoText] = useState("");
  const [isCompressingImage, setIsCompressingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState("");

  // Handle client-side promo banner upload
  const handleBannerFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setBannerUploadError("لطفاً یک فایل تصویری (PNG, JPG, WebP) انتخاب کنید.");
      return;
    }

    try {
      setIsCompressingBanner(true);
      setBannerUploadError("");
      const compressedDataUrl = await compressAndResizeImage(file, 800, 533, 0.75);
      setBannerConfig((prev) => ({ ...prev, imageUrl: compressedDataUrl }));
    } catch (err: any) {
      setBannerUploadError(err.message || "خطا در پردازش تصویر بنر");
    } finally {
      setIsCompressingBanner(false);
    }
  };

  const handleSaveBanner = async () => {
    setPromoBanner(bannerConfig);
    setBannerSaveMsg("در حال ذخیره و انتشار بنر...");
    const res = await publishToCloud({ promoBanner: bannerConfig });
    if (res.success) {
      setBannerSaveMsg("بنر تبلیغاتی با موفقیت در سراسر سایت و کلودفلر منتشر شد! ✓");
      setTimeout(() => setBannerSaveMsg(""), 4000);
    } else {
      setBannerSaveMsg(`خطا در ذخیره ابری: ${res.error || "نامشخص"}`);
    }
  };

  const handleResetBanner = async () => {
    const defaultBanner: PromoBannerConfig = DEFAULT_PROMO_BANNER;
    setBannerConfig(defaultBanner);
    setPromoBanner(defaultBanner);
    setBannerSaveMsg("در حال بازنشانی به بنر پیش‌فرض...");
    const res = await publishToCloud({ promoBanner: defaultBanner });
    if (res.success) {
      setBannerSaveMsg("بنر پیش‌فرض سیستم بازگردانی و منتشر شد! ✓");
      setTimeout(() => setBannerSaveMsg(""), 4000);
    } else {
      setBannerSaveMsg(`خطا: ${res.error || "نامشخص"}`);
    }
  };

  const handleSaveInstagram = async () => {
    setInstagramUrl(instagramInput);
    setInstagramSaveMsg("در حال ذخیره...");
    const res = await publishToCloud({ instagramUrl: instagramInput });
    if (res.success) {
      setInstagramSaveMsg("لینک پیج اینستاگرام با موفقیت ثبت و منتشر شد! ✓");
      setTimeout(() => setInstagramSaveMsg(""), 4000);
    } else {
      setInstagramSaveMsg(`خطا: ${res.error || "نامشخص"}`);
    }
  };

  // Handle client-side image file upload & compression
  const handleImageFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageUploadError("لطفاً یک فایل تصویری (PNG, JPG, WebP) انتخاب کنید.");
      return;
    }

    setImageUploadError("");
    setIsCompressingImage(true);

    try {
      const compressedDataUrl = await compressAndResizeImage(file, 360, 360, 0.78);
      setEditProduct((prev) => (prev ? { ...prev, iconUrl: compressedDataUrl } : null));
    } catch (err) {
      console.error("Image processing error:", err);
      setImageUploadError("خطا در بهینه‌سازی تصویر. لطفاً تصویر دیگری را امتحان کنید.");
    } finally {
      setIsCompressingImage(false);
      e.target.value = "";
    }
  };

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
          setCurrentUser({
            email: parsed.email || MASTER_ADMIN_EMAIL,
            name: parsed.name || "مدیر ارشد",
            role: parsed.role || "superadmin",
          });
        }
      } catch (e) {}
    }
  }, []);

  // Publish changes to Cloud to sync across ALL mobile, laptop, and tablet devices
  const handlePublishCloud = async (override?: {
    products?: Product[];
    rows?: ProductCategoryRow[];
    layout?: LayoutMode;
    masterPin?: string;
    adminUsers?: AdminUser[];
  }) => {
    setCloudSyncMsg("⏳ در حال ذخیره و همگام‌سازی ابری با سرور جهانی...");
    const res = await publishToCloud(override);
    if (res.success) {
      setCloudSyncMsg("✅ با موفقیت در فضای ابری منتشر شد! تمام کاربران روی موبایل و لپ‌تاپ فوراً تغییرات را می‌بینند.");
      setTimeout(() => setCloudSyncMsg(""), 6000);
    } else {
      setCloudSyncMsg(`❌ خطا در ذخیره ابری: ${res.error || "خطای اتصال به سرور"}`);
    }
  };

  // Required Email + Password Authentication with Multi-Device Cloud Sync
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const trimmedEmail = inputEmail.trim().toLowerCase();
    const normInput = normalizePin(inputPin);
    const effectiveMasterPin = normalizePin(masterPin || localStorage.getItem("vaich_admin_pin") || DEFAULT_ADMIN_PIN);
    const fallbackPin = normalizePin(DEFAULT_ADMIN_PIN);

    if (!trimmedEmail) {
      setAuthError("لطفاً ایمیل اختصاصی مدیریت را وارد کنید.");
      return;
    }

    if (!normInput) {
      setAuthError("لطفاً رمز عبور اختصاصی مدیر را وارد کنید.");
      return;
    }

    // Check 1: Master Admin Account (email vaichqd4@gmail.com with synced masterPin OR default Yh111111)
    const isMasterEmail = trimmedEmail === MASTER_ADMIN_EMAIL.toLowerCase();
    const isMasterPinMatch = normInput === effectiveMasterPin || normInput === fallbackPin;

    if (isMasterEmail && isMasterPinMatch) {
      const session = {
        authenticated: true,
        email: MASTER_ADMIN_EMAIL,
        name: "مدیر ارشد (مالک)",
        role: "superadmin",
        loggedInAt: new Date().toISOString(),
      };
      localStorage.setItem("vaich_admin_auth", JSON.stringify(session));
      setCurrentUser({
        email: MASTER_ADMIN_EMAIL,
        name: "مدیر ارشد (مالک)",
        role: "superadmin",
      });
      setIsAuthenticated(true);
      return;
    }

    // Check 2: Any added admin user from adminUsers list
    const foundUser = adminUsers.find(
      (u) => u.email.trim().toLowerCase() === trimmedEmail && normalizePin(u.pin) === normInput
    );

    if (foundUser) {
      const session = {
        authenticated: true,
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
        loggedInAt: new Date().toISOString(),
      };
      localStorage.setItem("vaich_admin_auth", JSON.stringify(session));
      setCurrentUser({
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role,
      });
      setIsAuthenticated(true);
      return;
    }

    setAuthError("ایمیل یا رمز عبور مدیر نادرست است.");
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("vaich_admin_auth");
    setIsAuthenticated(false);
    setCurrentUser(null);
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
    setEditProduct({ ...product, imageFit: product.imageFit || "contain" });
    setFeaturesText(product.features ? product.features.join("\n") : "");
    setPurchaseInfoText(product.purchaseInfo ? product.purchaseInfo.join("\n") : "");
    setImageUploadError("");
    setIsCompressingImage(false);
    setIsEditing(true);
  };

  // Open Add Form for Product
  const handleOpenAddProduct = () => {
    setImageUploadError("");
    setIsCompressingImage(false);
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
      imageFit: "contain",
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
      imageFit: editProduct.imageFit || "contain",
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

  // Change Admin Master PIN (Global Cloud Sync across Laptop, Mobile & Tablet)
  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPin || newPin.length < 4) {
      setPinChangeMsg("رمز عبور باید حداقل ۴ کاراکتر باشد.");
      return;
    }
    const cleanPin = newPin.trim();
    setMasterPin(cleanPin);
    const updatedAdmins = adminUsers.map((u) =>
      u.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()
        ? { ...u, pin: cleanPin }
        : u
    );
    setAdminUsers(updatedAdmins);
    handlePublishCloud({ masterPin: cleanPin, adminUsers: updatedAdmins });
    setNewPin("");
    setPinChangeMsg("رمز عبور مدیر با موفقیت تغییر کرد و در تمام دستگاه‌ها (موبایل و لپ‌تاپ) همگام شد!");
    setTimeout(() => setPinChangeMsg(""), 5000);
  };

  // Admin Management Handlers
  const handleOpenAddAdmin = () => {
    setEditAdminUser({
      id: `admin-${Date.now().toString(36)}`,
      name: "",
      email: "",
      pin: "",
      role: "admin",
      createdAt: new Date().toISOString(),
    });
    setIsEditingAdmin(true);
  };

  const handleOpenEditAdmin = (user: AdminUser) => {
    setEditAdminUser({ ...user });
    setIsEditingAdmin(true);
  };

  const handleSaveAdminUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editAdminUser || !editAdminUser.name || !editAdminUser.email || !editAdminUser.pin) {
      alert("لطفاً نام، ایمیل و رمز عبور مدیر را به طور کامل وارد کنید.");
      return;
    }

    const cleanEmail = editAdminUser.email.trim().toLowerCase();
    const cleanPin = editAdminUser.pin.trim();

    const newAdmin: AdminUser = {
      id: editAdminUser.id || `admin-${Date.now().toString(36)}`,
      name: editAdminUser.name.trim(),
      email: cleanEmail,
      pin: cleanPin,
      role: editAdminUser.role || "admin",
      createdAt: editAdminUser.createdAt || new Date().toISOString(),
    };

    const exists = adminUsers.some((u) => u.id === newAdmin.id || u.email.toLowerCase() === cleanEmail);
    let updated: AdminUser[];
    if (exists) {
      updated = adminUsers.map((u) =>
        u.id === newAdmin.id || u.email.toLowerCase() === cleanEmail ? newAdmin : u
      );
    } else {
      updated = [...adminUsers, newAdmin];
    }

    setAdminUsers(updated);
    handlePublishCloud({ adminUsers: updated });
    setIsEditingAdmin(false);
    setEditAdminUser(null);
  };

  const handleDeleteAdmin = (id: string, email: string) => {
    if (email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()) {
      alert("حساب مدیر ارشد اصلی قابل حذف نیست.");
      return;
    }
    if (confirm(`آیا از حذف دسترسی این مدیر اطمینان دارید؟`)) {
      const updated = adminUsers.filter((u) => u.id !== id && u.email.toLowerCase() !== email.toLowerCase());
      setAdminUsers(updated);
      handlePublishCloud({ adminUsers: updated });
    }
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
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-linear-to-tr from-primary/20 to-accent/20 border border-primary/30 shadow-inner text-primary">
              <Lock className="h-8 w-8 text-primary" />
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
              className="neon-gradient w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>ورود به پنل مدیریت</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
              <span>بازگشت به صفحه اصلی فروشگاه</span>
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
              <ShieldCheck className="h-5 w-5 text-primary" />
            </span>
            <div>
              <h1 className="text-base font-extrabold text-foreground sm:text-lg">
                پنل مدیریت فروشگاه VAICH
              </h1>
              <p className="text-[11px] text-muted-foreground">
                سطح دسترسی: <span className="font-semibold text-emerald-500">{currentUser?.name || "مدیر ارشد"} ({currentUser?.role === "superadmin" ? "مدیر کل تایید‌شده ✓" : "مدیر سیستم تایید‌شده ✓"})</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              <span>مشاهده فروشگاه</span>
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3.5 py-1.5 text-xs font-bold text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>خروج</span>
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
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "products"
                ? "bg-primary text-white shadow-md"
                : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package className="h-4 w-4" />
            <span>مدیریت محصولات ({toPersianDigits(products.length)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("rows")}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "rows"
                ? "bg-primary text-white shadow-md"
                : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>مدیریت ردیف‌ها ({toPersianDigits(rows.length)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("layout")}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "layout"
                ? "bg-primary text-white shadow-md"
                : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <LayoutGrid className="h-4 w-4" />
            <span>چیدمان نوار سایت ({layout === "1-row" ? "۱ ردیفه" : layout === "2-row" ? "۲ ردیفه" : "شبکه‌ای"})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("admins")}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "admins"
                ? "bg-primary text-white shadow-md"
                : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="h-4 w-4" />
            <span>مدیریت مدیران ({toPersianDigits(adminUsers.length)})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("banner")}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "banner"
                ? "bg-primary text-white shadow-md"
                : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>عکس تبلیغات (بنر هیرو)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("settings")}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "settings"
                ? "bg-primary text-white shadow-md"
                : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <KeyRound className="h-4 w-4" />
            <span>تنظیمات و اینستاگرام</span>
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
              <RefreshCw className={`h-3.5 w-3.5 ${isCloudSyncing ? "animate-spin" : ""}`} />
              <span>{isCloudSyncing ? "در حال ذخیره در سرور ابری..." : "انتشار سراسری در سرور"}</span>
            </button>
          </div>
        </div>

        {cloudSyncMsg && (
          <div
            className={`mt-3 rounded-2xl border p-3.5 text-xs font-bold transition-all ${
              cloudSyncMsg.startsWith("❌")
                ? "border-red-500/40 bg-red-500/15 text-red-600 dark:text-red-300"
                : cloudSyncMsg.startsWith("✅")
                ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
                : "border-purple-500/40 bg-purple-500/15 text-purple-700 dark:text-purple-300 animate-pulse"
            }`}
          >
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
                  <Plus className="h-5 w-5" />
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
                        <ServiceIcon slug={p.slug} iconUrl={p.iconUrl} imageFit={p.imageFit} className="h-12 w-12" />
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
                          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                            hasBadge
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-secondary/40 text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Star className={`h-3.5 w-3.5 ${hasBadge ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                          <span>{hasBadge ? "برچسب فعال" : "افزودن برچسب"}</span>
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
                          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>ویرایش</span>
                        </button>

                        {/* Delete Button */}
                        <button
                          type="button"
                          onClick={() => handleDeleteProduct(p.slug)}
                          className="inline-flex items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/5 p-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                          title="حذف محصول"
                        >
                          <Trash2 className="h-4 w-4" />
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
                className="neon-gradient shrink-0 rounded-2xl px-5 py-2.5 text-xs font-extrabold text-white shadow-md transition-transform hover:scale-105 inline-flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                <span>افزودن ردیف جدید</span>
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
                        className="inline-flex items-center gap-1 rounded-xl border border-border bg-secondary/50 px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary transition-all"
                      >
                        <Edit3 className="h-3.5 w-3.5" />
                        <span>ویرایش عنوان</span>
                      </button>
                      {rows.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(row.id)}
                          className="inline-flex items-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>حذف ردیف</span>
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
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Rows className="h-5 w-5" />
                    </span>
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
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <Columns className="h-5 w-5" />
                    </span>
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
                    <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                      <LayoutGrid className="h-5 w-5" />
                    </span>
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

        {/* ---------------- TAB 4: ADMIN USERS MANAGEMENT ---------------- */}
        {activeTab === "admins" && (
          <div className="mt-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-border/80 bg-card p-6">
              <div>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" />
                  <span>مدیریت مدیران و دسترسی‌های فروشگاه</span>
                </h2>
                <p className="mt-1 text-xs text-muted-foreground leading-5">
                  مدیران جدید را با ایمیل و رمز اختصاصی تعریف کنید. تمام تغییرات بلافاصله در سرور ابری ثبت شده و در هر دو دستگاه موبایل و لپ‌تاپ فوراً معتبر است.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenAddAdmin}
                className="neon-gradient shrink-0 rounded-2xl px-5 py-2.5 text-xs font-extrabold text-white shadow-md transition-transform hover:scale-105 inline-flex items-center gap-1.5"
              >
                <UserPlus className="h-4 w-4" />
                <span>افزودن مدیر جدید</span>
              </button>
            </div>

            <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs">
              <div className="border-b border-border/60 p-4 sm:px-6">
                <h3 className="text-base font-bold text-foreground">
                  لیست مدیران مجاز فروشگاه
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  مدیران می‌توانند با ایمیل اختصاصی خود وارد پنل شده و محصولات، قیمت‌ها و ردیف‌ها را مدیریت کنند.
                </p>
              </div>

              <div className="divide-y divide-border/60">
                {adminUsers.map((admin) => {
                  const isMaster = admin.email.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase();

                  return (
                    <div
                      key={admin.id}
                      className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 hover:bg-secondary/20 transition-colors"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary font-bold">
                          {isMaster ? <Shield className="h-5 w-5" /> : <UserCheck className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-foreground">{admin.name}</span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                isMaster
                                  ? "bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/30"
                                  : admin.role === "admin"
                                  ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 border border-emerald-500/30"
                                  : "bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30"
                              }`}
                            >
                              {isMaster
                                ? "مدیر ارشد (مالک کل)"
                                : admin.role === "admin"
                                ? "مدیر فروشگاه"
                                : "ویرایشگر محتوا"}
                            </span>
                          </div>
                          <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              <span dir="ltr">{admin.email}</span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <KeyRound className="h-3 w-3" />
                              <span>رمز: <code className="text-foreground">••••••••</code></span>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditAdmin(admin)}
                          className="inline-flex items-center gap-1 rounded-xl border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:border-primary hover:text-primary transition-colors"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>ویرایش / تغییر رمز</span>
                        </button>

                        {!isMaster && (
                          <button
                            type="button"
                            onClick={() => handleDeleteAdmin(admin.id, admin.email)}
                            className="inline-flex items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/10 p-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
                            title="حذف دسترسی مدیر"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB: HERO PROMO BANNER ---------------- */}
        {activeTab === "banner" && (
          <div className="mt-6 space-y-6">
            <div className="rounded-3xl border border-border/80 bg-card p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <ImageIcon className="h-5 w-5 text-primary" />
                    <span>مدیریت عکس تبلیغات و بنر صفحه اصلی (هیرو)</span>
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground leading-5">
                    می‌توانید عکس هیرو بالای صفحه اصلی را تغییر دهید، بنر تبلیغاتی یا معرفی محصول جدید بارگذاری کنید و لینک دلخواه برای کلیک روی بنر تعیین کنید.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={handleResetBanner}
                    className="inline-flex items-center gap-1.5 rounded-2xl border border-border bg-secondary/50 px-4 py-2.5 text-xs font-bold text-muted-foreground hover:text-foreground transition-all cursor-pointer"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    <span>بازنشانی به بنر پیش‌فرض</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveBanner}
                    className="neon-gradient inline-flex items-center gap-1.5 rounded-2xl px-5 py-2.5 text-xs font-extrabold text-white shadow-md transition-transform hover:scale-105 cursor-pointer"
                  >
                    <Check className="h-4 w-4" />
                    <span>ذخیره و انتشار بنر</span>
                  </button>
                </div>
              </div>

              {bannerSaveMsg && (
                <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/10 p-3 text-xs font-bold text-primary">
                  {bannerSaveMsg}
                </div>
              )}

              {/* Banner Live Preview and Controls */}
              <div className="mt-6 grid gap-6 lg:grid-cols-12">
                {/* Preview Frame */}
                <div className="lg:col-span-7 flex flex-col justify-center">
                  <span className="text-xs font-bold text-foreground mb-2 block">
                    پیش‌نمایش زنده در صفحه اصلی:
                  </span>
                  <div className="relative aspect-4/3 w-full overflow-hidden rounded-3xl border border-border/70 bg-secondary/30 shadow-xl group">
                    <img
                      src={bannerConfig.imageUrl || "/promo-banner.webp"}
                      alt={bannerConfig.altText || "پیش‌نمایش بنر تبلیغاتی"}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-102"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-[11px] text-white/90 font-medium">
                      <span className="bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded-xl">
                        {bannerConfig.linkUrl ? `لینک مقصد: ${bannerConfig.linkUrl}` : "بدون لینک مقصد (فقط نمایش)"}
                      </span>
                      <span className="bg-primary/80 backdrop-blur-xs px-2.5 py-1 rounded-xl font-bold">
                        بنر فعال هیرو
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Controls */}
                <div className="lg:col-span-5 space-y-4">
                  {/* Upload file */}
                  <div className="rounded-2xl border border-border/80 bg-secondary/20 p-4 space-y-3">
                    <span className="text-xs font-bold text-foreground block">
                      آپلود تصویر بنر از سیستم یا موبایل:
                    </span>
                    <label className="cursor-pointer flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-primary/50 bg-primary/5 p-5 text-center hover:bg-primary/10 transition-all">
                      <Upload className="h-6 w-6 text-primary" />
                      <span className="text-xs font-bold text-primary">
                        {isCompressingBanner
                          ? "در حال پردازش و بهینه‌سازی بنر..."
                          : "انتخاب فایل تصویر جدید"}
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        فرمت‌های PNG، JPG، WebP (بهینه‌سازی خودکار انجام می‌شود)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isCompressingBanner}
                        onChange={handleBannerFileUpload}
                        className="hidden"
                      />
                    </label>

                    {bannerUploadError && (
                      <p className="text-[11px] text-rose-500 font-medium">
                        {bannerUploadError}
                      </p>
                    )}
                  </div>

                  {/* Direct Image URL */}
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      یا آدرس اینترنتی تصویر مستقیم (URL):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={bannerConfig.imageUrl || ""}
                      onChange={(e) =>
                        setBannerConfig((prev) => ({ ...prev, imageUrl: e.target.value }))
                      }
                      placeholder="/promo-banner.webp یا https://..."
                      className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-xs outline-none focus:border-primary"
                    />
                  </div>

                  {/* Destination Link */}
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      لینک مقصد هنگام کلیک کاربر روی بنر (اختیاری):
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={bannerConfig.linkUrl || ""}
                      onChange={(e) =>
                        setBannerConfig((prev) => ({ ...prev, linkUrl: e.target.value }))
                      }
                      placeholder="مثلاً: /products یا https://t.me/..."
                      className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-xs outline-none focus:border-primary"
                    />
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      اگر خالی باشد، بنر فقط یک تصویر جذاب بدون تغییر صفحه خواهد بود.
                    </p>
                  </div>

                  {/* Alt text */}
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      متن جایگزین (SEO / Alt Text):
                    </label>
                    <input
                      type="text"
                      value={bannerConfig.altText || ""}
                      onChange={(e) =>
                        setBannerConfig((prev) => ({ ...prev, altText: e.target.value }))
                      }
                      placeholder="توضیح عکس برای موتورهای جستجو"
                      className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-xs outline-none focus:border-primary"
                    />
                  </div>

                  {/* دکمه برجسته ذخیره پایین فرم مخصوص کاربران موبایل */}
                  <div className="pt-2">
                    <button
                      type="button"
                      disabled={isCloudSyncing}
                      onClick={handleSaveBanner}
                      className="neon-gradient w-full flex items-center justify-center gap-2 rounded-2xl py-3 text-xs font-black text-white shadow-lg transition-transform hover:scale-102 cursor-pointer disabled:opacity-50"
                    >
                      {isCloudSyncing ? (
                        <>
                          <RefreshCw className="h-4 w-4 animate-spin" />
                          <span>در حال ذخیره و انتشار سراسری در سرور...</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          <span>ذخیره و انتشار نهایی بنر در سایت</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ---------------- TAB 5: SETTINGS ---------------- */}
        {activeTab === "settings" && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Instagram Link Setting */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Instagram className="h-4 w-4 text-primary" />
                <span>پیج اینستاگرام سایت</span>
              </h2>
              <p className="text-xs text-muted-foreground leading-5">
                آدرس رسمی پیج اینستاگرام را وارد کنید. تمام دکمه‌ها و لینک‌های اینستاگرام سایت به این آدرس هدایت می‌شوند.
              </p>

              {instagramSaveMsg && (
                <div className="rounded-xl border border-primary/30 bg-primary/10 p-2.5 text-xs font-semibold text-primary">
                  {instagramSaveMsg}
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  آدرس پیج اینستاگرام:
                </label>
                <input
                  type="text"
                  dir="ltr"
                  value={instagramInput}
                  onChange={(e) => setInstagramInput(e.target.value)}
                  placeholder="https://www.instagram.com/vaich_ir"
                  className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-xs outline-none focus:border-primary"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveInstagram}
                className="rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary/90 transition-all inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="h-3.5 w-3.5" />
                <span>ذخیره و انتشار پیج</span>
              </button>
            </div>

            {/* Change Master PIN */}
            <div className="rounded-3xl border border-border/80 bg-card p-6">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <KeyRound className="h-4 w-4 text-primary" />
                <span>تغییر رمز عبور ورود به پنل</span>
              </h2>
              <p className="mt-1 text-xs text-muted-foreground">
                وضعیت امنیت: <span className="text-emerald-500 font-bold">همگام‌سازی ابری فعال است ✓</span>
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
                  className="rounded-2xl bg-primary px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-primary/90 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>ذخیره و همگام‌سازی ابری رمز جدید</span>
                </button>
              </form>
            </div>

            {/* Reset Defaults */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 space-y-4">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <span>تنظیمات کارخانه</span>
              </h2>
              <p className="text-xs text-muted-foreground leading-5">
                در صورت نیاز می‌توانید محصولات و ردیف‌های سایت را به حالت پیش‌فرض اولیه بازگردانید.
              </p>

              <button
                type="button"
                onClick={handleResetToDefault}
                className="flex items-center justify-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 py-3 text-xs font-bold text-rose-500 hover:bg-rose-500 hover:text-white transition-all w-full cursor-pointer"
              >
                <AlertTriangle className="h-4 w-4" />
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
                <X className="h-4 w-4" />
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

              {/* Product Image & Upload Section (BodoCP-Style Rounded Square Visual) */}
              <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    <span>تصویر یا لوگوی محصول (کارت سبک BodoCP):</span>
                  </span>
                  {editProduct.iconUrl && (
                    <button
                      type="button"
                      onClick={() => setEditProduct({ ...editProduct, iconUrl: undefined })}
                      className="text-[11px] text-rose-500 font-semibold hover:underline"
                    >
                      حذف تصویر و بازگشت به پیش‌فرض
                    </button>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Live Preview of the Image */}
                  <div className={`relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 rounded-2xl overflow-hidden bg-background/80 border border-border/80 flex items-center justify-center shadow-inner ${editProduct.imageFit === "cover" ? "p-0" : "p-2"}`}>
                    {getProductLogo(editProduct.slug || "", editProduct.iconUrl) ? (
                      <img
                        src={getProductLogo(editProduct.slug || "", editProduct.iconUrl)}
                        alt="پیش‌نمایش تصویر"
                        className={editProduct.imageFit === "cover" ? "h-full w-full object-cover rounded-2xl" : "max-h-full max-w-full object-contain rounded-xl drop-shadow-sm"}
                      />
                    ) : (
                      <span className="text-2xl font-black text-muted-foreground/60">
                        {editProduct.slug ? editProduct.slug.charAt(0).toUpperCase() : "AI"}
                      </span>
                    )}
                    {editProduct.badge && (
                      <span className="absolute right-1 top-1 rounded-full bg-primary/90 px-1.5 py-0.2 text-[8px] font-bold text-white">
                        {editProduct.badge}
                      </span>
                    )}
                  </div>

                  {/* Upload and Quick Selection controls */}
                  <div className="flex-1 space-y-2.5 w-full">
                    <div className="flex items-center gap-2">
                      <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl border border-primary/40 bg-primary/10 px-4 py-2.5 text-xs font-bold text-primary hover:bg-primary/20 transition-all shadow-xs">
                        <Upload className="h-4 w-4" />
                        <span>
                          {isCompressingImage
                            ? "در حال فشرده‌سازی و بهینه‌سازی تصویر..."
                            : "آپلود تصویر جدید از دستگاه (گوشی یا سیستم)"}
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          disabled={isCompressingImage}
                          onChange={handleImageFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {imageUploadError && (
                      <p className="text-[11px] text-rose-500 font-medium">
                        {imageUploadError}
                      </p>
                    )}

                    {/* Quick Presets */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="text-[11px] text-muted-foreground">لوگوهای پرکاربرد:</span>
                      <button
                        type="button"
                        onClick={() => setEditProduct({ ...editProduct, iconUrl: PRESET_LOGOS["chatgpt"] })}
                        className="rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium hover:border-primary transition-colors cursor-pointer"
                      >
                        ChatGPT
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditProduct({ ...editProduct, iconUrl: PRESET_LOGOS["gemini-pro"] })}
                        className="rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium hover:border-primary transition-colors cursor-pointer"
                      >
                        Gemini
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditProduct({ ...editProduct, iconUrl: PRESET_LOGOS["claude"] })}
                        className="rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium hover:border-primary transition-colors cursor-pointer"
                      >
                        Claude
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditProduct({ ...editProduct, iconUrl: "/vaich-logo.webp" })}
                        className="rounded-lg border border-border bg-card px-2.5 py-1 text-[11px] font-medium hover:border-primary transition-colors text-primary font-bold cursor-pointer"
                      >
                        لوگوی VAICH (پلنر و سایر)
                      </button>
                    </div>

                    {/* Optional direct URL input */}
                    <div>
                      <input
                        type="text"
                        dir="ltr"
                        value={editProduct.iconUrl || ""}
                        onChange={(e) => setEditProduct({ ...editProduct, iconUrl: e.target.value })}
                        placeholder="آدرس اینترنتی تصویر مستقیم (اختیاری): https://..."
                        className="w-full rounded-xl border border-border bg-background/50 px-3 py-1.5 text-xs text-muted-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary"
                      />
                    </div>

                    {/* Image Display Mode Toggle */}
                    <div className="rounded-xl border border-border/70 bg-background/60 p-2.5 space-y-2">
                      <span className="text-[11px] font-bold text-foreground block">
                        حالت نمایش و اندازه تصویر در کارت محصول:
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setEditProduct({ ...editProduct, imageFit: "contain" })}
                          className={`rounded-xl py-2 px-2.5 text-xs font-bold transition-all border cursor-pointer flex items-center justify-center gap-1.5 ${
                            editProduct.imageFit !== "cover"
                              ? "bg-primary text-white border-primary shadow-xs"
                              : "bg-card border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span>لوگوی متمرکز (Contain)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditProduct({ ...editProduct, imageFit: "cover" })}
                          className={`rounded-xl py-2 px-2.5 text-xs font-bold transition-all border cursor-pointer flex items-center justify-center gap-1.5 ${
                            editProduct.imageFit === "cover"
                              ? "bg-primary text-white border-primary shadow-xs"
                              : "bg-card border-border text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <span>کاور لبه‌به‌لبه و افقی (Cover)</span>
                        </button>
                      </div>
                      <p className="text-[10px] text-muted-foreground leading-4">
                        💡 حالت «کاور لبه‌به‌لبه و افقی» کادر بالای کارت را بدون حاشیه پر می‌کند (پیشنهادی برای پلنرها، اسکرین‌شات‌ها و تصاویر افقی).
                      </p>
                    </div>
                  </div>
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
                <X className="h-4 w-4" />
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

      {/* ---------------- ADD / EDIT ADMIN USER MODAL ---------------- */}
      {isEditingAdmin && editAdminUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" />
                <span>{editAdminUser.name ? `ویرایش مدیر: ${editAdminUser.name}` : "افزودن مدیر جدید"}</span>
              </h2>
              <button
                type="button"
                onClick={() => {
                  setIsEditingAdmin(false);
                  setEditAdminUser(null);
                }}
                className="grid h-8 w-8 place-items-center rounded-xl bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdminUser} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  نام و نام خانوادگی مدیر: *
                </label>
                <input
                  type="text"
                  required
                  value={editAdminUser.name || ""}
                  onChange={(e) => setEditAdminUser({ ...editAdminUser, name: e.target.value })}
                  placeholder="مثلاً: علی رضایی"
                  className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  ایمیل اختصاصی ورود: *
                </label>
                <input
                  type="email"
                  required
                  dir="ltr"
                  disabled={editAdminUser.email?.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()}
                  value={editAdminUser.email || ""}
                  onChange={(e) => setEditAdminUser({ ...editAdminUser, email: e.target.value })}
                  placeholder="name@example.com"
                  className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary disabled:opacity-60"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  رمز عبور اختصاصی مدیر: *
                </label>
                <input
                  type="text"
                  required
                  dir="ltr"
                  value={editAdminUser.pin || ""}
                  onChange={(e) => setEditAdminUser({ ...editAdminUser, pin: e.target.value })}
                  placeholder="حداقل ۴ کاراکتر"
                  className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  نقش و سطح دسترسی:
                </label>
                <select
                  disabled={editAdminUser.email?.toLowerCase() === MASTER_ADMIN_EMAIL.toLowerCase()}
                  value={editAdminUser.role || "admin"}
                  onChange={(e) => setEditAdminUser({ ...editAdminUser, role: e.target.value as any })}
                  className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary disabled:opacity-60"
                >
                  <option value="superadmin">مدیر ارشد (دسترسی کامل)</option>
                  <option value="admin">مدیر فروشگاه (مدیریت سفارش‌ها و محصولات)</option>
                  <option value="editor">ویرایشگر (ویرایش محصولات)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingAdmin(false);
                    setEditAdminUser(null);
                  }}
                  className="rounded-2xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="neon-gradient rounded-2xl px-5 py-2 text-xs font-bold text-white shadow-md transition-transform hover:scale-105"
                >
                  ذخیره اطلاعات مدیر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Status Notification for Mobile / Scrolled View */}
      {cloudSyncMsg && (
        <div className="fixed bottom-5 left-4 right-4 z-50 mx-auto max-w-md pointer-events-none">
          <div
            className={`rounded-2xl border p-3.5 text-xs font-bold shadow-2xl backdrop-blur-xl text-center transition-all ${
              cloudSyncMsg.startsWith("❌")
                ? "border-red-500/50 bg-red-950/90 text-red-200"
                : cloudSyncMsg.startsWith("✅")
                ? "border-emerald-500/50 bg-emerald-950/90 text-emerald-200"
                : "border-purple-500/50 bg-purple-950/90 text-purple-200 animate-pulse"
            }`}
          >
            {cloudSyncMsg}
          </div>
        </div>
      )}
    </div>
  );
}
