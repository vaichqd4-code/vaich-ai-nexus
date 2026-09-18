import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { NeonLink } from "@/components/ui/NeonButton";
import { cn } from "@/lib/utils";
import { Search, X } from "lucide-react";

const navItems = [
  { to: "/", label: "خانه" },
  { to: "/products", label: "اشتراک‌های هوش مصنوعی" },
  { to: "/why", label: "چرا VAICH" },
  { to: "/faq", label: "سوالات متداول" },
  { to: "/support", label: "پشتیبانی" },
] as const;

type Theme = "dark" | "light";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState<Theme>("dark");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const savedTheme = localStorage.getItem("vaich-theme") as Theme | null;

    const initialTheme: Theme =
      savedTheme === "light" || savedTheme === "dark"
        ? savedTheme
        : "dark";

    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
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
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "glass-panel border-x-0 border-t-0"
          : "border-b border-transparent",
      )}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
        <Logo />

        <nav
          aria-label="ناوبری اصلی"
          className="hidden justify-center lg:flex"
        >
          <ul className="flex items-center gap-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === "/" }}
                  className="rounded-full px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {/* دکمه بیضی و جمع‌وجور سرچ کنار دکمه‌های تم و منو */}
          <div className="relative flex items-center">
            {searchOpen ? (
              <div className="flex items-center gap-1.5 rounded-full border border-neon-blue/60 bg-secondary/80 px-2.5 py-1.5 backdrop-blur-md transition-all">
                <Search className="h-4 w-4 text-neon-blue shrink-0" />
                <input
                  type="text"
                  autoFocus
                  placeholder="جستجو..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-20 sm:w-32 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    handleSearch("");
                  }}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                title="جستجو"
                className="flex items-center gap-1 rounded-full border border-border bg-secondary/50 px-2.5 py-2 text-xs text-muted-foreground transition-all duration-300 hover:border-neon-purple/50 hover:bg-secondary hover:text-foreground"
              >
                <Search className="h-4 w-4" />
              </button>
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
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-secondary/50 text-foreground transition-all duration-300 hover:border-neon-purple/50 hover:bg-secondary"
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
            خرید اشتراک
          </NeonLink>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="باز و بسته کردن منو"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-secondary/50 lg:hidden"
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

      {open ? (
        <div className="glass-panel mx-4 mb-3 rounded-3xl p-3 lg:hidden">
          <ul className="flex flex-col">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  onClick={() => setOpen(false)}
                  activeOptions={{ exact: item.to === "/" }}
                  className="block rounded-2xl px-4 py-3 text-sm text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground data-[status=active]:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <NeonLink
            to="/products"
            onClick={() => setOpen(false)}
            className="mt-2 w-full"
          >
            خرید اشتراک
          </NeonLink>
        </div>
      ) : null}
    </header>
  );
}
