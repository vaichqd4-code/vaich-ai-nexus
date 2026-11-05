import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Logo } from "@/components/brand/Logo";
import { NeonLink } from "@/components/ui/NeonButton";
import { cn } from "@/lib/utils";
import {
  Search,
  X,
  ChevronDown,
  Layers,
  Sparkles,
  ShoppingBag,
  BookOpen,
  HelpCircle,
  Headphones,
  FileSpreadsheet,
  Cpu,
  Bot,
  Zap,
  ChevronLeft,
  Sun,
  Moon,
  MessageCircleQuestion,
  Compass,
  Phone,
  Send,
} from "lucide-react";
import { useDynamicProducts, formatPrice, toPersianDigits } from "@/lib/products";
import { ServiceIcon } from "@/components/brand/ServiceIcon";
import { BLOG_POSTS } from "@/lib/blog-data";
import { isProductLifetime } from "@/lib/products";

type Theme = "dark" | "light";

export function Header() {
  const router = useRouter();
  const { rows, products } = useDynamicProducts();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [drawerCategoriesOpen, setDrawerCategoriesOpen] = useState(true);
  const [drawerTab, setDrawerTab] = useState<"categories" | "menu">("categories");
  const [accordionState, setAccordionState] = useState<{ [key: string]: boolean }>({
    planners: true,
    ai: true,
    blog: false,
    support: false,
  });

  const toggleAccordion = (key: string) => {
    setAccordionState((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const handleOpenCrisp = () => {
    setOpen(false);
    if (typeof window !== "undefined") {
      if ((window as any).loadCrispNow) {
        (window as any).loadCrispNow();
      }
      if ((window as any).$crisp) {
        (window as any).$crisp.push(["do", "chat:open"]);
      } else {
        setTimeout(() => {
          if ((window as any).$crisp) {
            (window as any).$crisp.push(["do", "chat:open"]);
          } else {
            router.navigate({ to: "/support" });
          }
        }, 300);
      }
    }
  };


  const filteredProducts = searchQuery.trim()
    ? products.filter((p) => {
        const q = searchQuery.trim().toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q) ||
          (p.badge && p.badge.toLowerCase().includes(q))
        );
      })
    : [];

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close search and categories dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoriesOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    if (categoriesOpen || searchOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [categoriesOpen, searchOpen]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const savedTheme = localStorage.getItem("vaich-theme") as Theme | null;

    const initialTheme: Theme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : "light";

    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";

    setTheme(nextTheme);
    localStorage.setItem("vaich-theme", nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);

    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    }

    window.dispatchEvent(
      new CustomEvent("header-search", { detail: value })
    );
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border/50 shadow-xs"
          : "bg-background/40 backdrop-blur-xs border-b border-border/20",
      )}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2.5 px-3 py-1.5 sm:px-6 sm:py-2.5">
        <Logo />

        <nav
          aria-label="ناوبری اصلی"
          className="hidden justify-center lg:flex"
        >
          <ul className="flex items-center gap-1">
            <li>
              <Link
                to="/"
                activeOptions={{ exact: true }}
                onClick={() => {
                  if (typeof window !== "undefined") {
                    window.scrollTo({ top: 0, behavior: "instant" });
                  }
                }}
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground font-medium"
              >
                خانه
              </Link>
            </li>

            {/* دراپ‌داون دسته‌بندی‌ها و سایر محصولات */}
            <li className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setCategoriesOpen((prev) => !prev)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm transition-colors font-medium",
                  categoriesOpen
                    ? "bg-secondary text-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <span>سایر محصولات</span>
                <ChevronDown
                  className={cn("h-3.5 w-3.5 transition-transform duration-200", categoriesOpen && "rotate-180")}
                />
              </button>

              {categoriesOpen && (
                <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl border border-border/80 bg-background/95 p-2 shadow-2xl backdrop-blur-xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <p className="px-3 py-1.5 text-[11px] font-bold text-muted-foreground">دسته‌بندی‌های موجود:</p>
                  <div className="flex flex-col gap-1">
                    {rows.map((row) => (
                      <a
                        key={row.id}
                        href={`/#${row.id}`}
                        onClick={(e) => {
                          setCategoriesOpen(false);
                          const el = document.getElementById(row.id);
                          if (el) {
                            e.preventDefault();
                            el.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary/70 transition-colors"
                      >
                        <span className="truncate">{row.title}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      </a>
                    ))}
                    <div className="my-1 border-t border-border/60" />
                    <Link
                      to="/products"
                      onClick={() => setCategoriesOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
                    >
                      <span>مشاهده همه محصولات</span>
                      <span>←</span>
                    </Link>
                  </div>
                </div>
              )}
            </li>

            <li>
              <a
                href="/#blog"
                onClick={(e) => {
                  const el = document.getElementById("blog");
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: "smooth" });
                  }
                }}
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground font-medium"
              >
                مجله و وبلاگ
              </a>
            </li>

            <li>
              <Link
                to="/why"
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground font-medium"
              >
                چرا VAICH
              </Link>
            </li>

            <li>
              <Link
                to="/faq"
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground font-medium"
              >
                سوالات متداول
              </Link>
            </li>

            <li>
              <Link
                to="/support"
                className="rounded-full px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground font-medium"
              >
                پشتیبانی
              </Link>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* دکمه و باکس جستجوی هوشمند با نتایج زنده */}
          <div className="relative flex items-center" ref={searchContainerRef}>
            {searchOpen ? (
              <div className="flex items-center gap-1.5 rounded-xl border border-primary/60 bg-secondary/95 px-2.5 py-1.5 shadow-sm transition-all">
                <Search className="h-4 w-4 text-primary shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="نام محصول، پلنر یا اشتراک..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-28 xs:w-36 sm:w-48 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    handleSearch("");
                  }}
                  className="text-muted-foreground hover:text-foreground p-0.5 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                title="جستجو"
                className="grid h-10 w-10 sm:h-11 sm:w-11 place-items-center rounded-xl border border-border/60 bg-secondary/40 text-muted-foreground transition-all duration-200 hover:border-primary/50 hover:bg-secondary hover:text-foreground active:scale-95 cursor-pointer"
              >
                <Search className="h-4 w-4" />
              </button>
            )}

            {/* نتایج زنده جستجو بلافاصله زیر اینپوت */}
            {searchOpen && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 sm:left-auto sm:right-0 top-full mt-2 w-[calc(100vw-28px)] max-w-[360px] sm:w-[380px] rounded-3xl border border-border/80 bg-card/95 p-3 shadow-2xl backdrop-blur-xl z-50">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-border/50 text-[11px] font-bold text-muted-foreground">
                  <span>نتایج جستجو ({toPersianDigits(filteredProducts.length)})</span>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setSearchOpen(false);
                    }}
                    className="text-muted-foreground hover:text-foreground text-[10px] cursor-pointer"
                  >
                    <span>بستن</span><X className="h-3 w-3 inline mr-1" />
                  </button>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="mt-2 divide-y divide-border/40 max-h-[300px] overflow-y-auto">
                    {filteredProducts.map((p) => (
                      <Link
                        key={p.slug}
                        to="/products/$slug"
                        params={{ slug: p.slug }}
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-secondary/60 rounded-2xl transition-colors group cursor-pointer"
                      >
                        <ServiceIcon slug={p.slug} iconUrl={p.iconUrl} className="h-10 w-10 shrink-0 rounded-xl" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-foreground group-hover:text-primary transition-colors truncate">
                              {p.name}
                            </span>
                            {p.badge && (
                              <span className="rounded-full bg-primary/10 px-1.5 py-0.2 text-[9px] font-bold text-primary shrink-0">
                                {p.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground truncate">{p.description}</p>
                        </div>
                        <div className="text-left shrink-0">
                          <span className="text-xs font-black text-primary block">{formatPrice(p?.price || 0)}</span>
                          {p.duration && <span className="text-[10px] text-muted-foreground block">{p.duration}</span>}
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-muted-foreground">
                    محصولی با عنوان «{searchQuery}» یافت نشد.
                  </div>
                )}

                <div className="mt-2 pt-2 border-t border-border/50">
                  <Link
                    to="/products"
                    onClick={() => {
                      setSearchOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center justify-between rounded-xl px-2 py-1.5 text-xs font-bold text-primary hover:bg-primary/10 transition-colors"
                  >
                    <span>مشاهده همه محصولات در صفحه فروشگاه</span>
                    <span>←</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={
              theme === "dark"
                ? "فعال کردن حالت روشن"
                : "فعال کردن حالت تاریک"
            }
            title={
              theme === "dark"
                ? "حالت روشن"
                : "حالت تاریک"
            }
            className="grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-xl border border-border/60 bg-secondary/40 text-foreground transition-all duration-200 hover:border-primary/50 hover:bg-secondary active:scale-95"
          >
            {theme === "dark" ? (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
                <path
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  d="M20.5 14.5A8.5 8.5 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <NeonLink
            to="/products"
            size="sm"
            className="hidden sm:inline-flex"
          >
            خرید محصول
          </NeonLink>

          <button
            type="button"
            onClick={(e) => { e.preventDefault(); setOpen((v) => !v); }}
            aria-expanded={open}
            aria-label="باز و بسته کردن منو"
            className="grid h-10 w-10 sm:h-11 sm:w-11 shrink-0 place-items-center rounded-xl border border-border/60 bg-secondary/40 text-foreground transition-all duration-200 hover:border-primary/50 hover:bg-secondary active:scale-95 lg:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                d={
                  open
                    ? "M6 6l12 12M18 6L6 18"
                    : "M4 7h16M4 12h16M4 17h16"
                }
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer via Portal — Escapes header stacking context and covers full viewport with 100% solid background */}
      {mounted && open && typeof document !== "undefined" && createPortal(
        <div className="fixed inset-0 z-[9999] lg:hidden" dir="rtl">
          {/* Subtle Dim Backdrop */}
          <div
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
          />

          {/* Solid Theme-Matched Full-Height Drawer (BodoCP Architecture with VAICH Neon Purple Style) */}
          <aside
            style={{
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
            }}
            className="mobile-drawer-panel fixed top-0 bottom-0 right-0 h-full w-[320px] max-w-[88vw] border-l border-border shadow-2xl flex flex-col z-10 transition-transform duration-300 ease-out select-none"
          >
            {/* Drawer Top Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/70">
              <Logo onClick={() => setOpen(false)} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="بستن منو"
                className="grid h-9 w-9 place-items-center rounded-xl border border-border/80 bg-secondary/50 text-foreground transition-all hover:bg-secondary active:scale-95 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* BodoCP Segmented Tabs: دسته‌بندی‌ها vs منوی اصلی */}
            <div className="p-3 pb-1 border-b border-border/60">
              <div className="grid grid-cols-2 gap-1 rounded-2xl bg-secondary/60 p-1 border border-border/60">
                <button
                  type="button"
                  onClick={() => setDrawerTab("categories")}
                  className={`rounded-xl py-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    drawerTab === "categories"
                      ? "bg-primary text-white shadow-sm shadow-primary/30"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>دسته‌بندی‌ها</span>
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerTab("menu")}
                  className={`rounded-xl py-2 text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    drawerTab === "menu"
                      ? "bg-primary text-white shadow-sm shadow-primary/30"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Compass className="h-3.5 w-3.5" />
                  <span>منوی اصلی</span>
                </button>
              </div>
            </div>

            {/* Scrollable Navigation Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {drawerTab === "categories" ? (
                <>
                  {/* Category Accordion 1: اشتراک‌های هوش مصنوعی */}
                  <div className="rounded-2xl border border-border/70 bg-card/60 overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleAccordion("ai");
                      }}
                      className={`w-full flex items-center justify-between p-3.5 text-xs font-bold transition-colors cursor-pointer text-right ${
                        accordionState.ai
                          ? "bg-primary/10 text-primary border-b border-primary/20"
                          : "text-foreground hover:bg-secondary/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                          accordionState.ai
                            ? "bg-primary border-primary text-white shadow-xs"
                            : "bg-primary/10 border-primary/20 text-primary"
                        }`}>
                          <Sparkles className="h-4 w-4" />
                        </span>
                        <div>
                          <span className="block font-black text-xs leading-tight">
                            اشتراک‌های هوش مصنوعی
                          </span>
                          <span className="block text-[10px] text-muted-foreground font-normal">
                            ChatGPT • Claude • Gemini
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          accordionState.ai ? "rotate-180 text-primary" : "text-muted-foreground/70"
                        }`}
                      />
                    </button>

                    {accordionState.ai && (
                      <div className="p-2 space-y-1 bg-secondary/20">
                        {(products || [])
                          .filter((p) => p && !isProductLifetime(p))
                          .map((p) => (
                            <Link
                              key={p.slug}
                              to="/products/$slug"
                              params={{ slug: p.slug }}
                              onClick={() => setOpen(false)}
                              className="flex items-center justify-between rounded-xl p-2 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors group"
                            >
                              <div className="min-w-0 pr-1">
                                <span className="block truncate font-bold text-xs group-hover:text-primary transition-colors">
                                  {p.name}
                                </span>
                                <span className="block text-[10px] text-muted-foreground truncate">
                                  {p.duration || "تحویل فوری"}
                                </span>
                              </div>
                              <span className="text-[11px] font-black text-primary shrink-0">
                                {formatPrice(p?.price || 0)}
                              </span>
                            </Link>
                          ))}

                        <Link
                          to="/products"
                          onClick={() => setOpen(false)}
                          className="mt-1 flex items-center justify-center gap-1 rounded-xl border border-dashed border-border/80 py-2 text-[11px] font-bold text-primary hover:bg-primary/5 transition-colors"
                        >
                          <span>مشاهده همه اشتراک‌های هوش مصنوعی</span>
                          <ChevronLeft className="h-3 w-3" />
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* Category Accordion 2: پلنرهای هوشمند دیجیتال */}
                  <div className="rounded-2xl border border-border/70 bg-card/60 overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleAccordion("planners");
                      }}
                      className={`w-full flex items-center justify-between p-3.5 text-xs font-bold transition-colors cursor-pointer text-right ${
                        accordionState.planners
                          ? "bg-primary/10 text-primary border-b border-primary/20"
                          : "text-foreground hover:bg-secondary/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                          accordionState.planners
                            ? "bg-primary border-primary text-white shadow-xs"
                            : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                        }`}>
                          <FileSpreadsheet className="h-4 w-4" />
                        </span>
                        <div>
                          <span className="block font-black text-xs leading-tight">
                            پلنرهای هوشمند دیجیتال
                          </span>
                          <span className="block text-[10px] text-muted-foreground font-normal">
                            گوگل‌شیت و ردیاب عادات
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          accordionState.planners ? "rotate-180 text-primary" : "text-muted-foreground/70"
                        }`}
                      />
                    </button>

                    {accordionState.planners && (
                      <div className="p-2 space-y-1 bg-secondary/20">
                        {(products || [])
                          .filter((p) => p && isProductLifetime(p))
                          .map((p) => (
                            <Link
                              key={p.slug}
                              to="/products/$slug"
                              params={{ slug: p.slug }}
                              onClick={() => setOpen(false)}
                              className="flex items-center justify-between rounded-xl p-2 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors group"
                            >
                              <div className="min-w-0 pr-1">
                                <span className="block truncate font-bold text-xs group-hover:text-primary transition-colors">
                                  {p.name}
                                </span>
                                <span className="block text-[10px] text-muted-foreground truncate">
                                  {p.duration || "دسترسی مادام‌العمر"}
                                </span>
                              </div>
                              <span className="text-[11px] font-black text-emerald-400 shrink-0">
                                {formatPrice(p?.price || 0)}
                              </span>
                            </Link>
                          ))}

                        <a
                          href="/#planners"
                          onClick={(e) => {
                            setOpen(false);
                            if (typeof window !== "undefined" && window.location.pathname === "/") {
                              e.preventDefault();
                              const el =
                                document.getElementById("planners") ||
                                document.getElementById("row-mvampt3r") ||
                                document.querySelector('[id*="planner"]');
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                          className="mt-1 flex items-center justify-center gap-1 rounded-xl border border-dashed border-border/80 py-2 text-[11px] font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                        >
                          <span>مشاهده کامل بخش پلنرها در صفحه اصلی</span>
                          <ChevronLeft className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Direct Catalog Link */}
                  <Link
                    to="/products"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-2xl border border-border/70 bg-secondary/30 p-3 text-xs font-bold text-foreground hover:bg-secondary/60 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="h-4 w-4 text-primary" />
                      <span>مشاهده کاتالوگ تمام محصولات</span>
                    </div>
                    <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                  </Link>
                </>
              ) : (
                <>
                  {/* Main Menu Links */}
                  <div className="rounded-2xl border border-border/70 bg-card/60 p-2 space-y-1">
                    <Link
                      to="/"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-foreground hover:bg-secondary/70 hover:text-primary transition-colors"
                    >
                      <span>صفحه اصلی سایت</span>
                      <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/60" />
                    </Link>

                    <Link
                      to="/products"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-foreground hover:bg-secondary/70 hover:text-primary transition-colors"
                    >
                      <span>فروشگاه و محصولات</span>
                      <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/60" />
                    </Link>

                    <Link
                      to="/why"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-foreground hover:bg-secondary/70 hover:text-primary transition-colors"
                    >
                      <span>راهنمای خرید و چرا VAICH</span>
                      <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/60" />
                    </Link>

                    <Link
                      to="/faq"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-foreground hover:bg-secondary/70 hover:text-primary transition-colors"
                    >
                      <span>سوالات متداول خریداران</span>
                      <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/60" />
                    </Link>

                    <Link
                      to="/support"
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-bold text-foreground hover:bg-secondary/70 hover:text-primary transition-colors"
                    >
                      <span>مرکز رسمی پشتیبانی</span>
                      <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground/60" />
                    </Link>
                  </div>

                  {/* Blog & Articles Accordion */}
                  <div className="rounded-2xl border border-border/70 bg-card/60 overflow-hidden shadow-2xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleAccordion("blog");
                      }}
                      className={`w-full flex items-center justify-between p-3.5 text-xs font-bold transition-colors cursor-pointer text-right ${
                        accordionState.blog
                          ? "bg-primary/10 text-primary border-b border-primary/20"
                          : "text-foreground hover:bg-secondary/40"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                          accordionState.blog
                            ? "bg-primary border-primary text-white shadow-xs"
                            : "bg-purple-500/10 border-purple-500/20 text-purple-400"
                        }`}>
                          <BookOpen className="h-4 w-4" />
                        </span>
                        <div>
                          <span className="block font-black text-xs leading-tight">
                            مجله تخصصی و مقالات
                          </span>
                          <span className="block text-[10px] text-muted-foreground font-normal">
                            آموزش‌های کاربردی بهره‌وری و AI
                          </span>
                        </div>
                      </div>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          accordionState.blog ? "rotate-180 text-primary" : "text-muted-foreground/70"
                        }`}
                      />
                    </button>

                    {accordionState.blog && (
                      <div className="p-2 space-y-1 bg-secondary/20">
                        {(BLOG_POSTS || []).slice(0, 4).map((post) => (
                          <Link
                            key={post.slug}
                            to="/blog/$slug"
                            params={{ slug: post.slug }}
                            onClick={() => setOpen(false)}
                            className="flex items-center justify-between rounded-xl p-2 text-xs font-medium text-foreground hover:bg-secondary/80 transition-colors group"
                          >
                            <span className="truncate text-xs group-hover:text-primary transition-colors">
                              {post.title}
                            </span>
                            <ChevronLeft className="h-3 w-3 text-muted-foreground/60 shrink-0" />
                          </Link>
                        ))}

                        <a
                          href="/#blog"
                          onClick={(e) => {
                            setOpen(false);
                            if (typeof window !== "undefined" && window.location.pathname === "/") {
                              e.preventDefault();
                              const el = document.getElementById("blog");
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }
                          }}
                          className="mt-1 flex items-center justify-center gap-1 rounded-xl border border-dashed border-border/80 py-2 text-[11px] font-bold text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors"
                        >
                          <span>مشاهده همه مقالات در صفحه اصلی</span>
                          <ChevronLeft className="h-3 w-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Direct Accurate Support Channels (WhatsApp, Telegram, Channel, Phone) */}
              <div className="pt-2">
                <div className="rounded-2xl border border-border/80 bg-secondary/35 p-3 space-y-2 select-none shadow-2xs">
                  <div className="flex items-center justify-between text-[11px] font-bold text-muted-foreground px-0.5">
                    <span>پشتیبانی و ارتباط مستقیم</span>
                    <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      پاسخگویی سریع
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1 border-t border-border/40">
                    {/* گفت‌وگوی آنلاین ۲۴ ساعته */}
                    <button
                      type="button"
                      onClick={() => {
                        setOpen(false);
                        handleOpenCrisp();
                      }}
                      className="w-full flex items-center justify-between rounded-xl border border-primary/30 bg-primary/10 px-2.5 py-2 text-xs font-bold text-foreground hover:bg-primary/20 transition-all cursor-pointer text-right"
                    >
                      <div className="flex items-center gap-2">
                        <Headphones className="h-4 w-4 text-primary" />
                        <span>گفت‌وگوی آنلاین ۲۴ ساعته</span>
                      </div>
                      <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 text-[9px] px-2 py-0.5 text-emerald-400 font-bold">
                        پاسخ فوری
                      </span>
                    </button>

                    {/* پشتیبانی واتساپ */}
                    <a
                      href="https://wa.me/989193872172"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs text-foreground hover:bg-secondary/70 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <svg viewBox="0 0 24 24" fill="currentColor" className="h-3 w-3">
                            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.969.588 1.961.948 3.197.948 3.181 0 5.767-2.586 5.768-5.766 0-3.18-2.587-5.765-5.769-5.765zm3.435 8.197c-.145.409-.834.772-1.157.799-.323.028-.707.039-1.16-.098-.453-.137-1.047-.344-1.802-1.012-.977-.864-1.603-1.954-1.748-2.158-.145-.205-.38-.507-.38-.968 0-.462.242-.688.328-.784.086-.097.188-.121.251-.121.063 0 .126 0 .181.003.058.003.136-.022.213.161.079.187.525 1.282.571 1.376.046.094.077.204.015.328-.061.124-.092.202-.183.308-.091.106-.192.237-.274.318-.091.091-.186.19-.08.372.106.182.471.777 1.01 1.258.694.619 1.28.81 1.463.901.182.091.289.076.395-.046.106-.121.455-.53.576-.712.122-.182.243-.152.409-.091.167.061 1.061.5 1.243.591.182.091.303.137.348.213.045.076.045.439-.1.848z" />
                          </svg>
                        </span>
                        <span className="font-bold">واتساپ پشتیبانی</span>
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground group-hover:text-emerald-400 transition-colors dir-ltr">
                        09193872172
                      </span>
                    </a>

                    {/* پشتیبانی تلگرام */}
                    <a
                      href="https://t.me/youneshayati"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs text-foreground hover:bg-secondary/70 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-sky-500/15 text-sky-400 border border-sky-500/30">
                          <Send className="h-3 w-3" />
                        </span>
                        <span className="font-bold">تلگرام پشتیبانی</span>
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground group-hover:text-sky-400 transition-colors dir-ltr">
                        @youneshayati
                      </span>
                    </a>

                    {/* کانال تلگرام */}
                    <a
                      href="https://t.me/vaich_ir"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs text-foreground hover:bg-secondary/70 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-purple-500/15 text-purple-400 border border-purple-500/30">
                          <Send className="h-3 w-3" />
                        </span>
                        <span className="font-bold">کانال رسمی تلگرام</span>
                      </div>
                      <span className="font-mono text-[11px] text-muted-foreground group-hover:text-purple-400 transition-colors dir-ltr">
                        @vaich_ir
                      </span>
                    </a>

                    {/* تماس تلفنی مستقیم */}
                    <a
                      href="tel:09193872172"
                      className="flex items-center justify-between rounded-xl px-2.5 py-2 text-xs text-foreground hover:bg-secondary/70 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                          <Phone className="h-3 w-3" />
                        </span>
                        <span className="font-bold">تماس تلفنی</span>
                      </div>
                      <span className="font-bold text-[11px] text-muted-foreground group-hover:text-foreground transition-colors">
                        ۰۹۱۹۳۸۷۲۱۷۲
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Bar: Theme Switcher */}
            <div className="p-3 border-t border-border/70 flex items-center justify-between bg-card/40">
              <span className="text-xs text-muted-foreground font-medium">حالت شب و روز:</span>
              <button
                type="button"
                onClick={toggleTheme}
                className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-card px-3 py-1.5 text-xs font-bold text-foreground shadow-xs active:scale-95 transition-all cursor-pointer"
              >
                {theme === "dark" ? (
                  <span className="flex items-center gap-1.5 text-amber-300">
                    <Sun className="h-3.5 w-3.5 text-amber-400" />
                    <span>حالت روشن</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-primary">
                    <Moon className="h-3.5 w-3.5 text-primary" />
                    <span>حالت تاریک</span>
                  </span>
                )}
              </button>
            </div>
          </aside>
        </div>,
        document.body
      )}
    </header>
  );
}
