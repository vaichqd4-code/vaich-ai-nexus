import { useEffect, useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import {
  getStoredMasterPin,
  DEFAULT_ADMIN_PIN,
  MASTER_ADMIN_EMAIL,
  formatPrice,
  toPersianDigits,
  normalizePin,
} from "@/lib/products";
import {
  getStoredAnalytics,
  clearStoredAnalytics,
  type AnalyticsEvent,
} from "@/lib/analytics";
import {
  Activity,
  MousePointerClick,
  ShoppingBag,
  Users,
  Clock,
  Smartphone,
  Monitor,
  RefreshCw,
  LogOut,
  Shield,
  Phone,
  Copy,
  Check,
  Download,
  Search,
  ArrowRight,
  TrendingUp,
  Layers,
  Sparkles,
  Compass,
} from "lucide-react";

interface CustomerOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  productName: string;
  amount: number;
  status: string;
  createdAt: string;
  notes?: string;
  telegramUsername?: string;
}

interface ServerAnalyticsResponse {
  success: boolean;
  stats?: {
    totalEvents: number;
    bannerClicks: number;
    productViews: number;
    checkoutViews: number;
    totalOrders: number;
    avgDuration: number;
    deviceCount: Record<string, number>;
    referrerCount: Record<string, number>;
    topProducts: Array<{ name: string; views: number }>;
  };
  orders?: CustomerOrder[];
  recentEvents?: AnalyticsEvent[];
}

export function OverviewPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [inputEmail, setInputEmail] = useState("");
  const [inputPin, setInputPin] = useState("");
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"customers" | "feed" | "audience">("customers");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Analytics data state
  const [localEvents, setLocalEvents] = useState<AnalyticsEvent[]>([]);
  const [serverData, setServerData] = useState<ServerAnalyticsResponse | null>(null);

  // Check existing session from /admin
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedAuth = localStorage.getItem("vaich_admin_auth");
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed.authenticated) {
          setIsAuthenticated(true);
        }
      }
    } catch {}

    // Load local storage analytics
    setLocalEvents(getStoredAnalytics());

    const handleNewEvent = () => {
      setLocalEvents(getStoredAnalytics());
    };
    window.addEventListener("vaich_analytics_new_event", handleNewEvent);
    return () => {
      window.removeEventListener("vaich_analytics_new_event", handleNewEvent);
    };
  }, []);

  // Fetch server-side analytics & orders
  const fetchServerAnalytics = async (customPin?: string) => {
    setIsRefreshing(true);
    try {
      const pin = customPin || getStoredMasterPin() || DEFAULT_ADMIN_PIN;
      const res = await fetch(`/api/analytics?pin=${encodeURIComponent(pin)}`);
      if (res.ok) {
        const json: ServerAnalyticsResponse = await res.json();
        if (json.success) {
          setServerData(json);
        }
      }
    } catch (err) {
      console.warn("Could not fetch server analytics:", err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchServerAnalytics();
    }
  }, [isAuthenticated]);

  // Handle Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const trimmedEmail = inputEmail.trim().toLowerCase();
    const normInput = normalizePin(inputPin);
    const effectiveMasterPin = normalizePin(getStoredMasterPin() || DEFAULT_ADMIN_PIN);

    if (!trimmedEmail) {
      setAuthError("لطفاً ایمیل اختصاصی مدیریت را وارد کنید.");
      return;
    }

    if (!normInput) {
      setAuthError("لطفاً رمز عبور اختصاصی مدیر را وارد کنید.");
      return;
    }

    if (normInput === effectiveMasterPin) {
      setIsAuthenticated(true);
      localStorage.setItem(
        "vaich_admin_auth",
        JSON.stringify({
          authenticated: true,
          email: trimmedEmail,
          timestamp: Date.now(),
        })
      );
      fetchServerAnalytics(normInput);
    } else {
      setAuthError("رمز عبور مدیر نادرست است.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vaich_admin_auth");
    setIsAuthenticated(false);
  };

  const handleCopyPhone = (phone: string, id: string) => {
    if (!phone || phone === "—") return;
    navigator.clipboard.writeText(phone);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Combine and deduplicate events from server and local
  const allEvents = useMemo(() => {
    const list = [...(serverData?.recentEvents || []), ...localEvents];
    const seen = new Set<string>();
    const unique: AnalyticsEvent[] = [];
    for (const item of list) {
      if (item && item.id && !seen.has(item.id)) {
        seen.add(item.id);
        unique.push(item);
      }
    }
    return unique.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [serverData, localEvents]);

  // Aggregate stats
  const stats = useMemo(() => {
    let bannerClicks = serverData?.stats?.bannerClicks || 0;
    let productViews = serverData?.stats?.productViews || 0;
    let checkoutViews = serverData?.stats?.checkoutViews || 0;
    let totalDurationSeconds = 0;
    let durationPings = 0;

    allEvents.forEach((e) => {
      if (e.type === "banner_click") bannerClicks++;
      if (e.type === "product_view") productViews++;
      if (e.type === "checkout_view") checkoutViews++;
      if (e.duration && e.duration > 0) {
        totalDurationSeconds += e.duration;
        durationPings++;
      }
    });

    const avgDuration = durationPings > 0 ? Math.round(totalDurationSeconds / durationPings) : (serverData?.stats?.avgDuration || 0);

    const mobileCount = allEvents.filter((e) => e.device === "mobile").length;
    const desktopCount = allEvents.filter((e) => e.device === "desktop").length;
    const totalDevices = mobileCount + desktopCount || 1;
    const mobilePercent = Math.round((mobileCount / totalDevices) * 100);

    const ordersCount = serverData?.orders?.length || allEvents.filter((e) => e.type === "checkout_submit").length;

    return {
      bannerClicks,
      productViews,
      checkoutViews,
      avgDuration,
      mobilePercent,
      desktopPercent: 100 - mobilePercent,
      ordersCount,
      totalEvents: allEvents.length,
    };
  }, [allEvents, serverData]);

  // Customer Orders List from Server and Local Checkout Submissions
  const customerList = useMemo(() => {
    const fromServer: CustomerOrder[] = serverData?.orders || [];
    const fromLocal: CustomerOrder[] = allEvents
      .filter((e) => e.type === "checkout_submit" && e.customerPhone)
      .map((e) => ({
        id: e.id,
        orderNumber: `LOC-${e.id.slice(-6)}`,
        customerName: e.customerName || "خریدار سایت",
        customerPhone: e.customerPhone || "—",
        customerEmail: e.customerEmail || "—",
        productName: e.productName || "سفارش ثبت‌شده",
        amount: e.amount || 0,
        status: "ثبت‌شده در سایت",
        createdAt: e.timestamp,
        notes: e.details?.notes,
      }));

    const combined = [...fromServer, ...fromLocal];
    const seenPhones = new Set<string>();
    const unique: CustomerOrder[] = [];
    for (const c of combined) {
      const key = `${c.customerPhone}_${c.productName}_${c.createdAt.slice(0, 16)}`;
      if (!seenPhones.has(key)) {
        seenPhones.add(key);
        unique.push(c);
      }
    }

    if (!searchQuery.trim()) return unique;
    const q = searchQuery.toLowerCase().trim();
    return unique.filter(
      (c) =>
        c.customerName.toLowerCase().includes(q) ||
        c.customerPhone.includes(q) ||
        c.productName.toLowerCase().includes(q) ||
        c.orderNumber.toLowerCase().includes(q)
    );
  }, [serverData, allEvents, searchQuery]);

  // Export Customer List as CSV
  const handleExportCSV = () => {
    if (customerList.length === 0) {
      alert("هیچ سفارشی برای خروجی وجود ندارد.");
      return;
    }

    const headers = ["شماره سفارش", "نام خریدار", "شماره تماس", "ایمیل", "محصول", "مبلغ (تومان)", "وضعیت", "تاریخ"];
    const rows = customerList.map((c) => [
      c.orderNumber,
      `"${c.customerName}"`,
      `"${c.customerPhone}"`,
      `"${c.customerEmail}"`,
      `"${c.productName}"`,
      c.amount,
      `"${c.status}"`,
      `"${new Date(c.createdAt).toLocaleDateString("fa-IR")} ${new Date(c.createdAt).toLocaleTimeString("fa-IR")}"`,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vaich-customers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Helper formatting for durations
  const formatDurationText = (sec: number) => {
    if (!sec || sec <= 0) return "—";
    if (sec < 60) return `${toPersianDigits(sec)} ثانیه`;
    const min = Math.floor(sec / 60);
    const rem = sec % 60;
    return `${toPersianDigits(min)} دقیقه و ${toPersianDigits(rem)} ثانیه`;
  };

  // ---------------- LOGIN SCREEN ----------------
  if (!isAuthenticated) {
    return (
      <div className="aurora min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-border/80 bg-card/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          <div className="text-center">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-linear-to-tr from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-purple-400 shadow-inner">
              <Activity className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">
              داشبورد تحلیلی Overview
            </h1>
            <p className="mt-2 text-xs leading-6 text-muted-foreground sm:text-sm">
              گزارش زنده فعالیت کاربران، کلیک‌های بنر، زمان حضور و اطلاعات خریداران
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
                ایمیل مدیریت:
              </label>
              <input
                type="email"
                dir="ltr"
                required
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                placeholder="vaichqd4@gmail.com"
                className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                رمز عبور مدیر:
              </label>
              <input
                type="password"
                dir="ltr"
                required
                value={inputPin}
                onChange={(e) => setInputPin(e.target.value)}
                placeholder="رمز عبور را وارد کنید"
                className="w-full rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              />
            </div>

            <button
              type="submit"
              className="neon-gradient w-full rounded-2xl py-3.5 text-sm font-bold text-white shadow-lg transition-transform hover:scale-102 active:scale-98 cursor-pointer"
            >
              ورود به داشبورد آمار
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-border/60 text-center">
            <Link to="/admin" className="text-xs text-muted-foreground hover:text-foreground">
              ورود به پنل مدیریت فروشگاه ←
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ---------------- MAIN DASHBOARD SCREEN ----------------
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 border-b border-border/80 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 border border-primary/20 text-primary">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-foreground">
                  داشبورد تحلیلی و آمار زنده
                </h1>
                <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  زنده
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground">
                آدرس اختصاصی: <span className="font-mono text-primary font-bold">vaich.ir/overview</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fetchServerAnalytics()}
              disabled={isRefreshing}
              title="بروزرسانی زنده اطلاعات"
              className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-bold text-foreground hover:bg-secondary/60 transition-all cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? "animate-spin text-primary" : ""}`} />
              <span className="hidden sm:inline">بروزرسانی</span>
            </button>

            <Link
              to="/admin"
              className="flex items-center gap-1.5 rounded-xl border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition-all"
            >
              <span>پنل محصولات</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              title="خروج از حساب"
              className="grid h-8 w-8 place-items-center rounded-xl border border-border/80 bg-card text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 pt-6 sm:px-6">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {/* Banner Clicks */}
          <div className="rounded-3xl border border-border/80 bg-card p-4 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-bold">کلیک بنر هیرو</span>
              <div className="grid h-7 w-7 place-items-center rounded-xl bg-purple-500/10 text-purple-400">
                <MousePointerClick className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-foreground">
              {toPersianDigits(stats.bannerClicks)}
            </p>
            <p className="mt-1 text-[10px] text-purple-400 font-medium">
              بنر بالای صفحه اصلی
            </p>
          </div>

          {/* Product Views */}
          <div className="rounded-3xl border border-border/80 bg-card p-4 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-bold">مشاهده محصولات</span>
              <div className="grid h-7 w-7 place-items-center rounded-xl bg-blue-500/10 text-blue-400">
                <ShoppingBag className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-foreground">
              {toPersianDigits(stats.productViews)}
            </p>
            <p className="mt-1 text-[10px] text-blue-400 font-medium">
              صفحات محصولات و پلنر
            </p>
          </div>

          {/* Checkout Visits */}
          <div className="rounded-3xl border border-border/80 bg-card p-4 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-bold">ورود به پرداخت</span>
              <div className="grid h-7 w-7 place-items-center rounded-xl bg-amber-500/10 text-amber-400">
                <TrendingUp className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-foreground">
              {toPersianDigits(stats.checkoutViews)}
            </p>
            <p className="mt-1 text-[10px] text-amber-400 font-medium">
              مرحله تسویه‌حساب
            </p>
          </div>

          {/* Customer Leads */}
          <div className="rounded-3xl border border-border/80 bg-card p-4 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-bold">خریداران ثبت‌شده</span>
              <div className="grid h-7 w-7 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Users className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-foreground">
              {toPersianDigits(stats.ordersCount)}
            </p>
            <p className="mt-1 text-[10px] text-emerald-400 font-medium">
              با شماره تماس و فاکتور
            </p>
          </div>

          {/* Time on Site */}
          <div className="rounded-3xl border border-border/80 bg-card p-4 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-bold">زمان حضور</span>
              <div className="grid h-7 w-7 place-items-center rounded-xl bg-cyan-500/10 text-cyan-400">
                <Clock className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="text-base sm:text-lg font-black text-foreground">
              {formatDurationText(stats.avgDuration)}
            </p>
            <p className="mt-1 text-[10px] text-cyan-400 font-medium">
              میانگین حضور در سایت
            </p>
          </div>

          {/* Mobile vs Desktop */}
          <div className="rounded-3xl border border-border/80 bg-card p-4 shadow-xs relative overflow-hidden group">
            <div className="flex items-center justify-between text-muted-foreground mb-2">
              <span className="text-[11px] font-bold">دستگاه‌ها</span>
              <div className="grid h-7 w-7 place-items-center rounded-xl bg-pink-500/10 text-pink-400">
                <Smartphone className="h-3.5 w-3.5" />
              </div>
            </div>
            <p className="text-xl sm:text-2xl font-black text-foreground">
              {toPersianDigits(stats.mobilePercent)}٪
            </p>
            <p className="mt-1 text-[10px] text-pink-400 font-medium">
              سهم بازدیدهای موبایل
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("customers")}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "customers"
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="h-4 w-4" />
              <span>شماره تماس و اطلاعات خریداران ({toPersianDigits(customerList.length)})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("feed")}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "feed"
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <Activity className="h-4 w-4" />
              <span>فعالیت‌های زنده کاربران ({toPersianDigits(allEvents.length)})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("audience")}
              className={`flex items-center gap-2 rounded-2xl px-4 py-2 text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === "audience"
                  ? "bg-primary text-white shadow-md shadow-primary/25"
                  : "border border-border/70 bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <Compass className="h-4 w-4" />
              <span>تحلیل دستگاه و منابع ورودی</span>
            </button>
          </div>

          {activeTab === "customers" && customerList.length > 0 && (
            <button
              type="button"
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>دانلود خروجی اکسل (CSV)</span>
            </button>
          )}
        </div>

        {/* ---------------- TAB 1: CUSTOMERS & LEADS ---------------- */}
        {activeTab === "customers" && (
          <div className="mt-6 space-y-4">
            {/* Search Filter Box */}
            <div className="relative">
              <Search className="absolute right-4 top-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="جستجو در بین نام، شماره تماس، نام محصول یا کد سفارش..."
                className="w-full rounded-2xl border border-border bg-card pr-11 pl-4 py-3 text-xs sm:text-sm outline-none focus:border-primary shadow-xs"
              />
            </div>

            {customerList.length === 0 ? (
              <div className="rounded-3xl border border-border/80 bg-card p-12 text-center">
                <Users className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
                <h3 className="text-base font-bold text-foreground">هنوز سفارشی ثبت نشده است</h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                  به محض اینکه کاربری در صفحه تسویه‌حساب (/checkout) فرم مشخصات یا شماره تماس خود را پر کند، بلافاصله در این جدول نمایش داده می‌شود.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-3xl border border-border/80 bg-card shadow-xs">
                <table className="w-full text-right text-xs">
                  <thead className="border-b border-border/70 bg-secondary/40 text-[11px] font-bold text-muted-foreground">
                    <tr>
                      <th className="py-3.5 px-4">خریدار</th>
                      <th className="py-3.5 px-4">شماره تماس (کلیک برای کپی)</th>
                      <th className="py-3.5 px-4">محصول</th>
                      <th className="py-3.5 px-4">مبلغ</th>
                      <th className="py-3.5 px-4">وضعیت</th>
                      <th className="py-3.5 px-4">تاریخ و ساعت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {customerList.map((c) => (
                      <tr key={c.id} className="hover:bg-secondary/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-foreground">{c.customerName}</div>
                          {c.customerEmail && c.customerEmail !== "—" && (
                            <div className="text-[10px] text-muted-foreground dir-ltr text-right">{c.customerEmail}</div>
                          )}
                          {c.telegramUsername && (
                            <a
                              href={`https://t.me/${c.telegramUsername.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[10px] text-sky-500 hover:underline"
                              dir="ltr"
                            >
                              @{c.telegramUsername.replace("@", "")}
                            </a>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          {c.customerPhone && c.customerPhone !== "—" ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleCopyPhone(c.customerPhone, c.id)}
                                title="کپی شماره تماس"
                                className="flex items-center gap-1 rounded-lg border border-border bg-background px-2.5 py-1 text-xs font-mono font-bold text-foreground hover:border-primary transition-all cursor-pointer"
                              >
                                {copiedId === c.id ? (
                                  <>
                                    <Check className="h-3 w-3 text-emerald-500" />
                                    <span className="text-[10px] text-emerald-500">کپی شد</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="h-3 w-3 text-muted-foreground" />
                                    <span dir="ltr">{c.customerPhone}</span>
                                  </>
                                )}
                              </button>

                              <a
                                href={`tel:${c.customerPhone}`}
                                title="تماس تلفنی"
                                className="grid h-7 w-7 place-items-center rounded-lg border border-border bg-background text-muted-foreground hover:text-emerald-500 transition-colors"
                              >
                                <Phone className="h-3 w-3" />
                              </a>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-semibold text-primary">{c.productName}</span>
                          <div className="text-[10px] text-muted-foreground font-mono">{c.orderNumber}</div>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-foreground">
                          {c.amount > 0 ? formatPrice(c.amount) : "—"}
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-500">
                            {c.status || "ثبت‌شده"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap text-[11px]">
                          <div>{new Date(c.createdAt).toLocaleDateString("fa-IR")}</div>
                          <div className="text-[10px]">{new Date(c.createdAt).toLocaleTimeString("fa-IR")}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ---------------- TAB 2: LIVE ACTIVITY FEED ---------------- */}
        {activeTab === "feed" && (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>آخرین فعالیت‌ها و تعاملات کاربران در سایت</span>
              {allEvents.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("آیا لاگ‌های محلی پاک شوند؟")) clearStoredAnalytics();
                  }}
                  className="text-[11px] text-muted-foreground hover:text-rose-500 transition-colors cursor-pointer"
                >
                  پاکسازی تاریخچه رویدادها
                </button>
              )}
            </div>

            {allEvents.length === 0 ? (
              <div className="rounded-3xl border border-border/80 bg-card p-12 text-center">
                <Activity className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
                <h3 className="text-base font-bold text-foreground">هنوز رویدادی ثبت نشده است</h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-sm mx-auto">
                  با کلیک روی بنر، مشاهده محصولات، اسکرول به پلنرها یا ورود به پرداخت، فعالیت‌ها لحظه‌ای در اینجا ثبت می‌شوند.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {allEvents.map((evt) => {
                  const isBanner = evt.type === "banner_click";
                  const isProduct = evt.type === "product_view";
                  const isCheckout = evt.type === "checkout_view" || evt.type === "checkout_submit";
                  const isDuration = evt.type === "session_duration";

                  return (
                    <div
                      key={evt.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-2xl border border-border/70 bg-card p-3.5 hover:border-primary/40 transition-all text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${
                            isBanner
                              ? "bg-purple-500/15 text-purple-400 border border-purple-500/30"
                              : isProduct
                              ? "bg-blue-500/15 text-blue-400 border border-blue-500/30"
                              : isCheckout
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : isDuration
                              ? "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30"
                              : "bg-secondary text-muted-foreground border border-border"
                          }`}
                        >
                          {isBanner ? (
                            <MousePointerClick className="h-4 w-4" />
                          ) : isProduct ? (
                            <ShoppingBag className="h-4 w-4" />
                          ) : isCheckout ? (
                            <TrendingUp className="h-4 w-4" />
                          ) : isDuration ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <Activity className="h-4 w-4" />
                          )}
                        </div>

                        <div>
                          <div className="font-bold text-foreground flex items-center gap-2">
                            <span>{evt.title}</span>
                            {evt.customerPhone && (
                              <span className="font-mono text-emerald-400 text-[11px]" dir="ltr">
                                ({evt.customerPhone})
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-muted-foreground flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[10px] bg-secondary/70 px-1.5 py-0.5 rounded">
                              {evt.path}
                            </span>
                            <span>•</span>
                            <span>{evt.referrer}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-muted-foreground text-[11px] shrink-0 self-end sm:self-center">
                        <span className="inline-flex items-center gap-1 rounded-md bg-secondary/60 px-2 py-0.5">
                          {evt.device === "mobile" ? (
                            <>
                              <Smartphone className="h-3 w-3" />
                              <span>موبایل</span>
                            </>
                          ) : (
                            <>
                              <Monitor className="h-3 w-3" />
                              <span>دسکتاپ</span>
                            </>
                          )}
                        </span>

                        <span className="font-mono text-[10px]">
                          {new Date(evt.timestamp).toLocaleTimeString("fa-IR")}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ---------------- TAB 3: AUDIENCE & TRAFFIC ---------------- */}
        {activeTab === "audience" && (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {/* Devices Card */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-primary" />
                <span>تفکیک نوع دستگاه‌ها</span>
              </h3>

              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5">
                      <Smartphone className="h-3.5 w-3.5 text-primary" />
                      <span>کاربران موبایل</span>
                    </span>
                    <span>{toPersianDigits(stats.mobilePercent)}٪</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-primary to-accent rounded-full transition-all duration-500"
                      style={{ width: `${stats.mobilePercent}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="flex items-center gap-1.5">
                      <Monitor className="h-3.5 w-3.5 text-blue-400" />
                      <span>کاربران کامپیوتر (دسکتاپ)</span>
                    </span>
                    <span>{toPersianDigits(stats.desktopPercent)}٪</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-secondary overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all duration-500"
                      style={{ width: `${stats.desktopPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-muted-foreground pt-2">
                بر اساس رویدادهای زنده ثبت‌شده از سراسر دستگاه‌های ورودی به سایت.
              </p>
            </div>

            {/* Popular Products */}
            <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-primary" />
                <span>محبوب‌ترین محصولات از نگاه کاربران</span>
              </h3>

              {serverData?.stats?.topProducts && serverData.stats.topProducts.length > 0 ? (
                <div className="space-y-2.5 pt-2">
                  {serverData.stats.topProducts.map((p, idx) => (
                    <div
                      key={p.name}
                      className="flex items-center justify-between rounded-xl bg-secondary/40 p-2.5 text-xs font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <span className="grid h-5 w-5 place-items-center rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                          {toPersianDigits(idx + 1)}
                        </span>
                        <span className="font-bold text-foreground">{p.name}</span>
                      </div>
                      <span className="text-primary font-bold">{toPersianDigits(p.views)} بازدید</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground pt-4">
                  با کلیک بازدیدکنندگان روی محصولات، آمار محبوب‌ترین‌ها به طور خودکار در این جدول دسته‌بندی می‌شود.
                </p>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
