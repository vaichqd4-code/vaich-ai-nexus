import { Link, useRouter } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Logo } from "@/components/brand/Logo";
import { NeonLink } from "@/components/ui/NeonButton";
import { cn } from "@/lib/utils";
import { Search, X, ChevronDown, Layers, Sparkles } from "lucide-react";
import { useDynamicProducts, formatPrice, toPersianDigits } from "@/lib/products";
import { ServiceIcon } from "@/components/brand/ServiceIcon";

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
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

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
                    بستن ✕
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
                          <span className="text-xs font-black text-primary block">{formatPrice(p.price)}</span>
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
            onClick={() => setOpen((v) => !v)}
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
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-200"
          />

          {/* Solid Theme-Matched Full-Height Drawer */}
          <aside
            style={{
              backgroundColor: "var(--background)",
              color: "var(--foreground)",
            }}
            className="mobile-drawer-panel fixed top-0 bottom-0 right-0 h-full w-[310px] max-w-[85vw] border-l border-border shadow-2xl flex flex-col p-6 z-10 transition-transform duration-300 ease-out"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border/80">
              <Logo onClick={() => setOpen(false)} />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="بستن منو"
                className="grid h-10 w-10 place-items-center rounded-xl border border-border/70 bg-secondary/50 text-foreground transition-all hover:bg-secondary active:scale-95"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Links — Full Height Scrollable List */}
            <nav className="flex-1 overflow-y-auto py-4">
              <ul className="flex flex-col gap-1.5">
                <li>
                  <Link
                    to="/"
                    onClick={() => setOpen(false)}
                    activeOptions={{ exact: true }}
                    className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-secondary/70 hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary data-[status=active]:font-extrabold border border-transparent data-[status=active]:border-primary/20"
                  >
                    <span>خانه</span>
                    <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </li>

                {/* دسته بندی ها و سایر محصولات در منوی موبایل */}
                <li className="rounded-2xl border border-border/70 bg-secondary/30 p-2 my-1">
                  <div className="flex items-center justify-between px-2 py-1 text-xs font-bold text-foreground">
                    <span className="flex items-center gap-1.5">
                      <Layers className="h-3.5 w-3.5 text-primary" />
                      <span>سایر محصولات و دسته‌ها:</span>
                    </span>
                    <span className="text-[10px] text-muted-foreground font-normal">{rows.length} دسته</span>
                  </div>
                  <div className="mt-1 flex flex-col gap-1">
                    {rows.map((row) => (
                      <a
                        key={row.id}
                        href={`/#${row.id}`}
                        onClick={(e) => {
                          setOpen(false);
                          const el = document.getElementById(row.id);
                          if (el) {
                            e.preventDefault();
                            el.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary/80 hover:text-foreground transition-all"
                      >
                        <span className="truncate">{row.title}</span>
                        <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      </a>
                    ))}
                  </div>
                </li>

                <li>
                  <Link
                    to="/why"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-secondary/70 hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary data-[status=active]:font-extrabold border border-transparent data-[status=active]:border-primary/20"
                  >
                    <span>چرا VAICH</span>
                    <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/faq"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-secondary/70 hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary data-[status=active]:font-extrabold border border-transparent data-[status=active]:border-primary/20"
                  >
                    <span>سوالات متداول</span>
                    <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </li>

                <li>
                  <Link
                    to="/support"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold text-muted-foreground transition-all hover:bg-secondary/70 hover:text-foreground data-[status=active]:bg-primary/10 data-[status=active]:text-primary data-[status=active]:font-extrabold border border-transparent data-[status=active]:border-primary/20"
                  >
                    <span>پشتیبانی</span>
                    <svg viewBox="0 0 24 24" className="h-4 w-4 opacity-50" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="m15 18-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Drawer Footer */}
            <div className="pt-4 border-t border-border/80 flex flex-col gap-3">
              {/* Theme Switcher inside Drawer */}
              <div className="flex items-center justify-between rounded-xl border border-border/80 bg-secondary/40 px-3.5 py-2.5">
                <span className="text-xs font-semibold text-foreground">حالت نمایش:</span>
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex items-center gap-1.5 rounded-lg bg-card px-3 py-1.5 text-xs font-bold text-foreground shadow-xs border border-border/70 active:scale-95 transition-all"
                >
                  {theme === "dark" ? "حالت تاریک 🌙" : "حالت روشن ☀️"}
                </button>
              </div>

              <NeonLink
                to="/products"
                onClick={() => setOpen(false)}
                size="md"
                className="w-full text-center py-2.5 font-bold"
              >
                مشاهده و خرید محصولات
              </NeonLink>
            </div>
          </aside>
        </div>,
        document.body
      )}
    </header>
  );
}
