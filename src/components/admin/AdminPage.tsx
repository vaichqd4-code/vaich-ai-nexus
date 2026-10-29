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
  fetchRemoteHistory,
  fetchSnapshotConfig,
  getLocalSnapshots,
  type ConfigSnapshot,
  type SiteConfig,
  isProductLifetime,
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
  BarChart3,
  History,
  RotateCcw,
  Eye,
  CheckCircle2,
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
    restoreSnapshot,
    isCloudSyncing,
    lastCloudSync,
  } = useDynamicProducts();

  // History / Undo / Rollback State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [snapshots, setSnapshots] = useState<ConfigSnapshot[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<ConfigSnapshot | null>(null);
  const [previewConfig, setPreviewConfig] = useState<SiteConfig | null>(null);
  const [isLoadingPreview, setIsLoadingPreview] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string; role: string } | null>(null);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPin, setInputPin] = useState("");
  const [authError, setAuthError] = useState("");
  const [activeTab, setActiveTab] = useState<"products" | "rows" | "layout" | "admins" | "banner" | "reviews" | "settings">("products");

  // Reviews moderation state
  const [selectedReviewFilter, setSelectedReviewFilter] = useState<string>("all");
  const [isAddingReviewModal, setIsAddingReviewModal] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState("");
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState("");
  const [newReviewTargetSlug, setNewReviewTargetSlug] = useState<string>("");
  const [newReviewVerified, setNewReviewVerified] = useState(true);

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
      const compressedDataUrl = await compressAndResizeImage(file, 800, 600, 0.80);
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
    promoBanner?: PromoBannerConfig;
    instagramUrl?: string;
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

  // 1-Click Toggle موجود / ناموجود
  const handleToggleInStock = (slug: string) => {
    const updated = products.map((p) => {
      if (p.slug === slug) {
        return {
          ...p,
          inStock: p.inStock === false ? true : false,
        };
      }
      return p;
    });
    setProducts(updated);
    handlePublishCloud({ products: updated });
  };

  const handleToggleReviewStatus = (productSlug: string, reviewId: string) => {
    const updated = products.map((p) => {
      if (p.slug === productSlug && p.reviews) {
        const nextReviews = p.reviews.map((r) => {
          if (r.id === reviewId) {
            return {
              ...r,
              status: (r.status === "pending" ? "approved" : "pending") as "approved" | "pending",
            };
          }
          return r;
        });
        const approved = nextReviews.filter((r) => r.status !== "pending");
        const nextAvg = approved.length > 0 ? Number((approved.reduce((acc, r) => acc + r.rating, 0) / approved.length).toFixed(1)) : 5.0;
        return {
          ...p,
          reviews: nextReviews,
          rating: nextAvg,
          reviewCount: nextReviews.length,
        };
      }
      return p;
    });
    setProducts(updated);
    handlePublishCloud({ products: updated });
  };

  const handleDeleteReview = (productSlug: string, reviewId: string) => {
    if (!confirm("آیا از حذف این نظر اطمینان دارید؟")) return;
    const updated = products.map((p) => {
      if (p.slug === productSlug && p.reviews) {
        const nextReviews = p.reviews.filter((r) => r.id !== reviewId);
        const approved = nextReviews.filter((r) => r.status !== "pending");
        const nextAvg = approved.length > 0 ? Number((approved.reduce((acc, r) => acc + r.rating, 0) / approved.length).toFixed(1)) : 5.0;
        return {
          ...p,
          reviews: nextReviews,
          rating: nextAvg,
          reviewCount: nextReviews.length,
        };
      }
      return p;
    });
    setProducts(updated);
    handlePublishCloud({ products: updated });
  };

  const handleCreateAdminReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewComment.trim()) return;

    const targetSlug = newReviewTargetSlug || products[0]?.slug || "vaich-life-planner";
    const newRev = {
      id: "rev-adm-" + Date.now().toString(36),
      author: newReviewAuthor.trim() || "خریدار تأیید شده",
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      createdAt: new Date().toISOString(),
      verified: newReviewVerified,
      status: "approved" as const,
    };

    const updated = products.map((p) => {
      if (p.slug === targetSlug) {
        const nextReviews = [newRev, ...(p.reviews || [])];
        const approved = nextReviews.filter((r) => r.status !== "pending");
        const nextAvg = Number((approved.reduce((acc, r) => acc + r.rating, 0) / approved.length).toFixed(1));
        return {
          ...p,
          reviews: nextReviews,
          rating: nextAvg,
          reviewCount: (p.reviewCount || 0) + 1,
        };
      }
      return p;
    });

    setProducts(updated);
    handlePublishCloud({ products: updated });
    setIsAddingReviewModal(false);
    setNewReviewAuthor("");
    setNewReviewComment("");
    setNewReviewRating(5);
  };

  // Open Edit Form for Product
  const handleOpenEditProduct = (product: Product) => {
    setEditProduct({
      ...product,
      imageFit: product.imageFit || "contain",
      inStock: product.inStock !== false,
      isLifetime: isProductLifetime(product),
    });
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
      isLifetime: false,
      featured: false,
      badge: "",
      badgeColor: "purple",
      categoryId: rows[0]?.id || "ai",
      imageFit: "contain",
      inStock: true,
      rating: 5.0,
      reviewCount: 0,
      reviews: [],
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

    const existingProd = products.find((p) => p.slug === cleanSlug);
    const isLifetime = Boolean(editProduct.isLifetime ?? isProductLifetime(editProduct));

    const fullProduct: Product = {
      slug: cleanSlug,
      name: editProduct.name.trim(),
      price: Number(editProduct.price),
      originalPrice: editProduct.originalPrice ? Number(editProduct.originalPrice) : undefined,
      discountPercent: editProduct.discountPercent ? Number(editProduct.discountPercent) : undefined,
      duration: isLifetime ? (editProduct.duration?.trim() || "دائمی (بدون اشتراک)") : (editProduct.duration || "۱ ماهه"),
      description: editProduct.description || (isLifetime ? `خرید و دسترسی دائمی به ${editProduct.name}` : `اشتراک ${editProduct.name}`),
      isLifetime: isLifetime,
      featured: Boolean(editProduct.featured || editProduct.badge),
      badge: editProduct.badge?.trim() || (editProduct.featured ? "پیشنهاد ویژه 🔥" : undefined),
      badgeColor: editProduct.badgeColor || "purple",
      categoryId: editProduct.categoryId || rows[0]?.id || "ai",
      features: parsedFeatures.length > 0 ? parsedFeatures : undefined,
      purchaseInfo: parsedPurchaseInfo.length > 0 ? parsedPurchaseInfo : ["اطلاعات پس از خرید ارسال می‌شود."],
      iconUrl: editProduct.iconUrl?.trim() || undefined,
      imageFit: editProduct.imageFit || "contain",
      inStock: editProduct.inStock !== false,
      rating: editProduct.rating || existingProd?.rating || 5.0,
      reviewCount: editProduct.reviewCount || existingProd?.reviewCount || existingProd?.reviews?.length || 0,
      reviews: editProduct.reviews || existingProd?.reviews || [],
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

  // Open and load version history
  const handleOpenHistory = async () => {
    setIsHistoryOpen(true);
    setIsLoadingHistory(true);
    setSelectedSnapshot(null);
    setPreviewConfig(null);
    try {
      const remote = await fetchRemoteHistory();
      setSnapshots(remote.length > 0 ? remote : getLocalSnapshots());
    } catch {
      setSnapshots(getLocalSnapshots());
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Select a snapshot to inspect differences
  const handleSelectSnapshot = async (snap: ConfigSnapshot) => {
    setSelectedSnapshot(snap);
    if (snap.config) {
      setPreviewConfig(snap.config);
      return;
    }
    if (snap.sha) {
      setIsLoadingPreview(true);
      try {
        const cfg = await fetchSnapshotConfig(snap.sha);
        setPreviewConfig(cfg);
      } catch (e) {
        alert("خطا در بارگذاری پیش‌نمایش نسخه");
      } finally {
        setIsLoadingPreview(false);
      }
    }
  };

  // Confirm rollback to the previewed version
  const handleConfirmRestore = async () => {
    if (!previewConfig) return;
    const timeLabel = selectedSnapshot?.timestamp
      ? new Date(selectedSnapshot.timestamp).toLocaleString("fa-IR")
      : "انتخابی";
    if (!confirm(`آیا مطمئن هستید که می‌خواهید فروشگاه به نسخه تاریخ ${timeLabel} بازگردانی شود؟`)) {
      return;
    }
    setIsRestoring(true);
    try {
      const res = await restoreSnapshot(previewConfig);
      if (res.success) {
        alert("فروشگاه با موفقیت به نسخه انتخابی بازگردانی و منتشر شد! ✓");
        setIsHistoryOpen(false);
      } else {
        alert(`خطا در بازگردانی: ${res.error || "خطای ناشناخته"}`);
      }
    } finally {
      setIsRestoring(false);
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
              to="/overview"
              className="inline-flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary hover:text-white transition-all shadow-sm"
              title="مشاهده آمار کلیک روی بنر، خریدها، بازدیدها و مدت حضور کاربران"
            >
              <BarChart3 className="h-3.5 w-3.5" />
              <span className="hidden xs:inline sm:inline">آمار و تحلیل (Overview)</span>
              <span className="xs:hidden sm:hidden">آمار</span>
            </Link>
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
            onClick={() => setActiveTab("reviews")}
            className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all ${
              activeTab === "reviews"
                ? "bg-primary text-white shadow-md"
                : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
            <span>نظرات و امتیازها ({toPersianDigits(products.reduce((acc, p) => acc + (p.reviews?.length || 0), 0))})</span>
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

          <Link
            to="/overview"
            className="inline-flex items-center gap-2 rounded-2xl border border-primary/40 bg-linear-to-r from-primary/10 via-accent/10 to-primary/10 px-4 py-2 text-xs sm:text-sm font-black text-primary hover:bg-primary hover:text-white transition-all shadow-sm mr-auto"
          >
            <BarChart3 className="h-4 w-4" />
            <span>آمار زنده، مدت حضور و لیدها 🚀</span>
          </Link>
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

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleOpenHistory}
              className="flex items-center gap-1.5 rounded-xl border border-primary/40 bg-card hover:bg-secondary active:scale-95 text-foreground px-3.5 py-2 text-xs font-bold shadow-xs transition-all cursor-pointer"
              title="مشاهده تاریخچه تغییرات، پیش‌نمایش و بازگردانی در صورت اشتباه"
            >
              <History className="h-3.5 w-3.5 text-primary" />
              <span>تاریخچه و بازگردانی ↺</span>
            </button>

            <button
              type="button"
              disabled={isCloudSyncing}
              onClick={() => handlePublishCloud()}
              className="flex items-center gap-2 rounded-xl bg-purple-600 hover:bg-purple-700 active:scale-95 text-white px-4 py-2 text-xs font-bold shadow-md transition-all disabled:opacity-50 cursor-pointer"
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
                            {isProductLifetime(p) ? (
                              <span className="inline-flex items-center gap-1 font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[11px]">
                                <span>♾️</span> دسترسی دائمی
                              </span>
                            ) : (
                              p.duration && <span>مدت: {p.duration}</span>
                            )}
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

                        {/* 1-Click Toggle موجود / ناموجود */}
                        <button
                          type="button"
                          onClick={() => handleToggleInStock(p.slug)}
                          className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all ${
                            p.inStock !== false
                              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                              : "border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                          }`}
                          title="تغییر وضعیت موجودی"
                        >
                          <span className={`h-2 w-2 rounded-full ${p.inStock !== false ? "bg-emerald-400" : "bg-rose-400"}`} />
                          <span>{p.inStock !== false ? "موجود است ✓" : "ناموجود ✕"}</span>
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

        {/* ---------------- TAB: REVIEWS & RATINGS MODERATION ---------------- */}
        {activeTab === "reviews" && (
          <div className="mt-6 space-y-6">
            {/* Stats Overview */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-3xl border border-border/80 bg-card p-4">
                <span className="text-xs text-muted-foreground">کل نظرات ثبت‌شده</span>
                <p className="mt-1 text-2xl font-black text-foreground">
                  {toPersianDigits(
                    products.reduce((acc, p) => acc + (p.reviews?.length || 0), 0)
                  )}
                </p>
              </div>

              <div className="rounded-3xl border border-border/80 bg-card p-4">
                <span className="text-xs text-muted-foreground">میانگین امتیاز فروشگاه</span>
                <p className="mt-1 text-2xl font-black text-amber-400 flex items-center gap-1">
                  <span>★</span>
                  <span>
                    {toPersianDigits(
                      (
                        products.reduce((acc, p) => acc + (p.rating || 5), 0) /
                        (products.length || 1)
                      ).toFixed(1)
                    )}
                  </span>
                </p>
              </div>

              <div className="rounded-3xl border border-border/80 bg-card p-4">
                <span className="text-xs text-muted-foreground">نظرات تأیید شده</span>
                <p className="mt-1 text-2xl font-black text-emerald-400">
                  {toPersianDigits(
                    products.reduce(
                      (acc, p) =>
                        acc +
                        (p.reviews?.filter((r) => r.status !== "pending").length || 0),
                      0
                    )
                  )}
                </p>
              </div>

              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setIsAddingReviewModal(true)}
                  className="neon-gradient flex h-full w-full items-center justify-center gap-2 rounded-3xl p-4 text-sm font-extrabold text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Plus className="h-5 w-5" />
                  <span>افزودن نظر خریدار (تأیید شده)</span>
                </button>
              </div>
            </div>

            {/* Filter by Product & List Container */}
            <div className="rounded-3xl border border-border/80 bg-card overflow-hidden shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 p-4 sm:px-6">
                <div>
                  <h2 className="text-base font-bold text-foreground">
                    نظرات و بازخوردهای خریداران
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    می‌توانید نظرات را تأیید، لغو تأیید، یا حذف نمایید. همچنین می‌توانید نظر رسمی به عنوان خریدار ثبت کنید.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <label htmlFor="filter-prod-rev" className="text-xs text-muted-foreground shrink-0">
                    فیلتر بر اساس محصول:
                  </label>
                  <select
                    id="filter-prod-rev"
                    value={selectedReviewFilter}
                    onChange={(e) => setSelectedReviewFilter(e.target.value)}
                    className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="all">همه محصولات ({toPersianDigits(products.reduce((acc, p) => acc + (p.reviews?.length || 0), 0))})</option>
                    {products.map((p) => (
                      <option key={p.slug} value={p.slug}>
                        {p.name} ({toPersianDigits(p.reviews?.length || 0)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Reviews List */}
              <div className="divide-y divide-border/60">
                {products
                  .flatMap((p) =>
                    (p.reviews || []).map((r) => ({
                      ...r,
                      productSlug: p.slug,
                      productName: p.name,
                    }))
                  )
                  .filter((r) =>
                    selectedReviewFilter === "all" ? true : r.productSlug === selectedReviewFilter
                  )
                  .map((rev) => {
                    const isApproved = rev.status !== "pending";
                    return (
                      <div
                        key={rev.id}
                        className="flex flex-col gap-3 p-4 sm:p-5 hover:bg-secondary/15 transition-colors"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold text-sm text-foreground">
                              {rev.author}
                            </span>
                            <span className="rounded-lg bg-secondary/80 px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border/60">
                              {rev.productName}
                            </span>
                            {rev.verified && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-bold text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="h-3 w-3" />
                                خریدار تأیید شده
                              </span>
                            )}
                            <span
                              className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold border ${
                                isApproved
                                  ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                  : "bg-amber-500/15 text-amber-400 border-amber-500/30"
                              }`}
                            >
                              {isApproved ? "تأیید شده ✓" : "در انتظار بررسی ⏳"}
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="flex text-amber-400 text-xs">
                              {"★".repeat(rev.rating)}
                              {"☆".repeat(5 - rev.rating)}
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              {rev.createdAt.split("T")[0]}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs leading-6 text-muted-foreground break-words bg-background/40 p-3 rounded-2xl border border-border/50">
                          {rev.comment}
                        </p>

                        <div className="flex items-center justify-end gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleToggleReviewStatus(rev.productSlug, rev.id)}
                            className={`rounded-xl px-3 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
                              isApproved
                                ? "border-border bg-card text-muted-foreground hover:bg-secondary"
                                : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
                            }`}
                          >
                            {isApproved ? "لغو تأیید" : "تأیید و انتشار ✓"}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteReview(rev.productSlug, rev.id)}
                            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-colors inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>حذف</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
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

              {/* Product Access Type Selector: Lifetime vs Subscription */}
              <div className="rounded-2xl border border-border/80 bg-secondary/30 p-3.5 space-y-3">
                <div>
                  <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                    <span>نوع فروش و دسترسی محصول:</span>
                  </label>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    مشخص کنید این محصول اشتراک اکانت هوش مصنوعی است یا خرید فایلی / دسترسی مادام‌العمر (مانند پلنر)
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditProduct({
                        ...editProduct,
                        isLifetime: false,
                        duration: editProduct.duration?.includes("دائمی") ? "۱ ماهه" : (editProduct.duration || "۱ ماهه"),
                      });
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all border ${
                      !editProduct.isLifetime
                        ? "border-primary bg-primary/15 text-primary shadow-sm ring-1 ring-primary/40"
                        : "border-border/70 bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground"
                    }`}
                  >
                    <span>⏳</span>
                    <span>اشتراک مدت‌دار (اکانت هوش مصنوعی)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEditProduct({
                        ...editProduct,
                        isLifetime: true,
                        duration: "دائمی (بدون اشتراک)",
                      });
                    }}
                    className={`flex items-center justify-center gap-2 rounded-xl py-2.5 px-3 text-xs font-bold transition-all border ${
                      editProduct.isLifetime
                        ? "border-emerald-500 bg-emerald-500/15 text-emerald-400 shadow-sm ring-1 ring-emerald-500/40"
                        : "border-border/70 bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground"
                    }`}
                  >
                    <span>♾️</span>
                    <span>دسترسی دائمی (مادام‌العمر / فایلی)</span>
                  </button>
                </div>

                {editProduct.isLifetime ? (
                  <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[11px] text-emerald-400 leading-5">
                    ✨ <strong>حالت دسترسی دائمی فعال است:</strong> در صفحه محصول و کارت‌ها عبارت «خرید دائمی»، «دسترسی مادام‌العمر» و تحویل مستقیم فایل درج می‌شود و کلمه «اشتراک» حذف می‌گردد.
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      مدت اشتراک / اعتبار:
                    </label>
                    <input
                      type="text"
                      value={editProduct.duration || ""}
                      onChange={(e) => setEditProduct({ ...editProduct, duration: e.target.value })}
                      placeholder="مثلاً: ۱ ماهه، ۶۰ روزه، ۱۸ ماهه"
                      className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  </div>
                )}
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

              {/* Product Inventory / Stock Toggle */}
              <div className="rounded-2xl border border-border/80 bg-secondary/30 p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-foreground block">
                    وضعیت موجودی در انبار:
                  </span>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    اگر ناموجود انتخاب شود، کارت محصول در سایت سیاه و سفید شده، نشان قرمز ناموجود می‌خورد و دکمه‌های خرید غیرفعال می‌شوند.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setEditProduct((prev) => prev ? ({ ...prev, inStock: prev.inStock === false ? true : false }) : null)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all border cursor-pointer ${
                    editProduct.inStock !== false
                      ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
                      : "bg-rose-500/20 text-rose-400 border-rose-500/40"
                  }`}
                >
                  {editProduct.inStock !== false ? "موجود در انبار ✓" : "ناموجود در انبار ✕"}
                </button>
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

      {/* Modal: Add Verified Review from Admin */}
      {isAddingReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span>افزودن نظر خریدار جدید</span>
              </h2>
              <button
                type="button"
                onClick={() => setIsAddingReviewModal(false)}
                className="grid h-8 w-8 place-items-center rounded-xl bg-secondary text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateAdminReview} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  انتخاب محصول: *
                </label>
                <select
                  value={newReviewTargetSlug || (products[0]?.slug ?? "")}
                  onChange={(e) => setNewReviewTargetSlug(e.target.value)}
                  className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-xs outline-none focus:border-primary"
                >
                  {products.map((p) => (
                    <option key={p.slug} value={p.slug}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  نام خریدار: *
                </label>
                <input
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="مثال: پویا صالحی"
                  className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-xs outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  امتیاز ستاره (از ۱ تا ۵): *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewReviewRating(star)}
                      className="p-1 text-xl transition-transform hover:scale-125 focus:outline-none"
                    >
                      <span className={newReviewRating >= star ? "text-amber-400 font-bold" : "text-muted/40"}>
                        ★
                      </span>
                    </button>
                  ))}
                  <span className="text-xs text-muted-foreground">
                    ({toPersianDigits(newReviewRating)} از ۵)
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  متن دیدگاه خریدار: *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="تجربه کاربر از کیفیت، سرعت تحویل و ارزش خرید..."
                  className="w-full rounded-2xl border border-border bg-background/60 px-4 py-2.5 text-xs outline-none focus:border-primary resize-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="chk-verified"
                  checked={newReviewVerified}
                  onChange={(e) => setNewReviewVerified(e.target.checked)}
                  className="h-4 w-4 rounded accent-primary cursor-pointer"
                />
                <label htmlFor="chk-verified" className="text-xs text-foreground cursor-pointer select-none">
                  نمایش نشان «خریدار تأیید شده ✓» کنار نظر
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <button
                  type="button"
                  onClick={() => setIsAddingReviewModal(false)}
                  className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary cursor-pointer"
                >
                  انصراف
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-5 py-2 text-xs font-bold text-white shadow-sm hover:bg-primary/90 cursor-pointer"
                >
                  ثبت و انتشار نظر
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ---------------- HISTORY & ROLLBACK MODAL ---------------- */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-3xl border border-border/80 bg-card p-5 sm:p-7 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-border/70 pb-4">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 border border-primary/20 text-primary">
                  <History className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black text-foreground">
                    تاریخچه تغییرات و بازگردانی هوشمند (Undo / Rollback)
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    هر نسخه‌ای از قبل را انتخاب کنید، تفاوت‌ها را پیش‌نمایش ببینید و با ۱ کلیک برگردانید.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsHistoryOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="mt-4 flex-1 grid grid-cols-1 md:grid-cols-12 gap-5 overflow-hidden">
              {/* Snapshot List (5 cols) */}
              <div className="md:col-span-5 flex flex-col space-y-2 overflow-y-auto max-h-[55vh] pr-1">
                <div className="flex items-center justify-between pb-1 text-xs font-bold text-muted-foreground">
                  <span>نسخه‌های پیشین فروشگاه</span>
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm("آیا می‌خواهید همه تنظیمات به حالت اولیه کارخانه بازگردد؟")) {
                        handleResetToDefault();
                        setIsHistoryOpen(false);
                      }
                    }}
                    className="text-[11px] text-amber-500 hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>تنظیمات کارخانه</span>
                  </button>
                </div>

                {isLoadingHistory ? (
                  <div className="py-12 text-center text-xs text-muted-foreground">
                    <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary mb-2" />
                    <span>در حال بارگذاری تاریخچه تغییرات...</span>
                  </div>
                ) : snapshots.length === 0 ? (
                  <div className="rounded-2xl border border-border p-6 text-center text-xs text-muted-foreground">
                    تاریخچه‌ای یافت نشد.
                  </div>
                ) : (
                  snapshots.map((snap) => {
                    const isSelected = selectedSnapshot?.id === snap.id;
                    const dateObj = new Date(snap.timestamp);
                    const jalaliDate = dateObj.toLocaleDateString("fa-IR");
                    const jalaliTime = dateObj.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" });

                    return (
                      <button
                        key={snap.id}
                        type="button"
                        onClick={() => handleSelectSnapshot(snap)}
                        className={`w-full text-right p-3 rounded-2xl border transition-all cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/10 shadow-sm"
                            : "border-border/70 bg-card hover:bg-secondary/40"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-foreground">
                            {jalaliDate} — ساعت {jalaliTime}
                          </span>
                          {isSelected && <CheckCircle2 className="h-4 w-4 text-primary" />}
                        </div>
                        <p className="mt-1 text-[11px] text-muted-foreground truncate">
                          {snap.label || "تغییرات ذخیره‌شده ادمین"}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Snapshot Preview & Confirm (7 cols) */}
              <div className="md:col-span-7 rounded-2xl border border-border/80 bg-secondary/20 p-4 flex flex-col justify-between overflow-y-auto max-h-[55vh]">
                {isLoadingPreview ? (
                  <div className="py-20 text-center text-xs text-muted-foreground">
                    <RefreshCw className="h-7 w-7 animate-spin mx-auto text-primary mb-2" />
                    <span>در حال آماده‌سازی پیش‌نمایش نسخه...</span>
                  </div>
                ) : !selectedSnapshot ? (
                  <div className="py-20 text-center text-xs text-muted-foreground">
                    <Eye className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
                    <p className="font-bold text-foreground">یک نسخه را از لیست سمت راست انتخاب کنید</p>
                    <p className="mt-1 text-[11px]">تا جزئیات محصولات و قیمت‌ها در آن تاریخ به شما نمایش داده شود.</p>
                  </div>
                ) : !previewConfig ? (
                  <div className="py-20 text-center text-xs text-rose-500 font-bold">
                    اطلاعات این نسخه در دسترس نیست.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-border/60 pb-2">
                      <div>
                        <span className="text-xs font-bold text-foreground">
                          پیش‌نمایش محصولات در نسخه انتخابی:
                        </span>
                        <span className="text-[11px] text-muted-foreground mr-2">
                          ({toPersianDigits(previewConfig.products?.length || 0)} محصول)
                        </span>
                      </div>
                      <span className="rounded-md bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5">
                        نسخه تاریخ: {new Date(selectedSnapshot.timestamp).toLocaleTimeString("fa-IR")}
                      </span>
                    </div>

                    <div className="space-y-2 overflow-y-auto max-h-[35vh] pr-1">
                      {previewConfig.products?.map((p) => {
                        const currentMatch = products.find((cp) => cp.slug === p.slug);
                        const isPriceDifferent = currentMatch && currentMatch.price !== p.price;
                        const isDurationDifferent = currentMatch && currentMatch.duration !== p.duration;

                        return (
                          <div
                            key={p.slug}
                            className={`rounded-xl border p-2.5 text-xs transition-colors ${
                              isPriceDifferent || isDurationDifferent
                                ? "border-amber-500/50 bg-amber-500/10"
                                : "border-border/60 bg-card"
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold text-foreground">
                              <span>{p.name}</span>
                              <span className="text-primary">{formatPrice(p.price)}</span>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                              <span>مدت: {p.duration || "—"}</span>
                              {p.discountPercent ? (
                                <span className="text-rose-500">تخفیف: {toPersianDigits(p.discountPercent)}٪</span>
                              ) : null}
                            </div>
                            {isPriceDifferent && (
                              <div className="mt-1 text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                                ⚠️ قیمت در سایت فعلی: {formatPrice(currentMatch.price)} (با این بازگردانی به {formatPrice(p.price)} تغییر خواهد کرد)
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Confirm Action Button */}
                {selectedSnapshot && previewConfig && (
                  <div className="pt-4 border-t border-border/60 mt-3 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsHistoryOpen(false)}
                      className="rounded-xl border border-border px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary cursor-pointer"
                    >
                      انصراف
                    </button>
                    <button
                      type="button"
                      disabled={isRestoring}
                      onClick={handleConfirmRestore}
                      className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 text-xs font-bold shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      <RotateCcw className={`h-3.5 w-3.5 ${isRestoring ? "animate-spin" : ""}`} />
                      <span>{isRestoring ? "در حال بازگردانی..." : "تایید و بازگردانی به این نسخه ✓"}</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
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
