import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { NeonLink } from "@/components/ui/NeonButton";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "خانه" },
  { to: "/products", label: "اشتراک‌های هوش مصنوعی" },
  { to: "/why", label: "چرا VAICH" },
  { to: "/faq", label: "سوالات متداول" },
  { to: "/support", label: "پشتیبانی" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "glass-panel border-x-0 border-t-0" : "border-b border-transparent",
      )}
    >
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:grid-cols-[auto_minmax(0,1fr)_auto]">
        <Logo />

        <nav aria-label="ناوبری اصلی" className="hidden justify-center lg:flex">
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
          <NeonLink to="/products" size="sm" className="hidden sm:inline-flex">
            خرید اشتراک
          </NeonLink>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label="باز و بسته کردن منو"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-border bg-secondary/50 lg:hidden"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              <path
                d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
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
          <NeonLink to="/products" onClick={() => setOpen(false)} className="mt-2 w-full">
            خرید اشتراک
          </NeonLink>
        </div>
      ) : null}
    </header>
  );
}
