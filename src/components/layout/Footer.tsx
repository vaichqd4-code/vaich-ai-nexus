import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { toPersianDigits } from "@/lib/products";

const columns = [
  {
    title: "ناوبری",
    links: [
      { to: "/", label: "خانه" },
      { to: "/products", label: "اشتراک‌های هوش مصنوعی" },
      { to: "/why", label: "چرا VAICH" },
    ],
  },
  {
    title: "راهنما",
    links: [
      { to: "/faq", label: "سوالات متداول" },
      { to: "/support", label: "پشتیبانی" },
    ],
  },
  {
    title: "قوانین",
    links: [
      { to: "/terms", label: "قوانین و مقررات" },
      { to: "/privacy", label: "حریم خصوصی" },
    ],
  },
] as const;

const socials = ["اینستاگرام", "تلگرام", "ایکس"];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-surface/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-7 text-muted-foreground">
            VAICH فروشگاه اشتراک‌های هوش مصنوعی است؛ ساده، شفاف و همراه با پشتیبانی.
          </p>
          <ul className="flex gap-2">
            {socials.map((s) => (
              <li key={s}>
                <span className="inline-flex items-center rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground">
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h2 className="mb-4 text-sm font-bold text-foreground">{col.title}</h2>
            <ul className="space-y-3">
              {col.links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="border-t border-border/70 px-4 py-6 text-center text-xs text-muted-foreground sm:px-6">
        © {toPersianDigits(1404)} VAICH — تمامی حقوق محفوظ است.
      </div>
    </footer>
  );
}
