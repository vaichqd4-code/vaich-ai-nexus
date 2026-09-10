import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import {
  CONTACT_INSTAGRAM_URL,
  CONTACT_PHONE,
  CONTACT_PHONE_PERSIAN,
  CONTACT_TELEGRAM_URL,
} from "@/components/brand/ContactLinks";
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

const socials = [
  {
    label: "اینستاگرام",
    href: CONTACT_INSTAGRAM_URL,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: "تلگرام",
    href: CONTACT_TELEGRAM_URL,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
] as const;

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border/70 bg-surface/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-7 text-muted-foreground">
            VAICH فروشگاه اشتراک‌های هوش مصنوعی است؛ ساده، شفاف و همراه با پشتیبانی.
          </p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="text-xs">شماره تماس:</span>{" "}
              <a href={`tel:${CONTACT_PHONE}`} className="font-medium text-foreground hover:text-neon-blue" dir="ltr">
                {CONTACT_PHONE_PERSIAN}
              </a>
            </p>
          </div>
          <ul className="flex gap-2">
            {socials.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/40 px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-neon-blue/50 hover:text-foreground"
                >
                  {s.icon}
                  {s.label}
                </a>
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
