import { toPersianDigits } from "@/lib/products";

export const CONTACT_PHONE = "09193872172";
export const CONTACT_PHONE_PERSIAN = toPersianDigits(CONTACT_PHONE);
export const CONTACT_TELEGRAM_ID = "youneshayati";
export const CONTACT_TELEGRAM_URL = `https://t.me/${CONTACT_TELEGRAM_ID}`;
export const CONTACT_INSTAGRAM_URL = "https://www.instagram.com/youneshayati.ai?stkn=Y2x4bnQ1Z2JneTMz";
/** شمارهٔ واتساپ پشتیبانی به فرمت بین‌المللی (بدون + و بدون صفر ابتدایی). */
export const CONTACT_WHATSAPP_NUMBER = "989193872172";
export const CONTACT_WHATSAPP_URL = `https://wa.me/${CONTACT_WHATSAPP_NUMBER}`;
export function whatsappUrlWithText(text: string) {
  return `${CONTACT_WHATSAPP_URL}?text=${encodeURIComponent(text)}`;
}

const contactMethods = [
  {
    label: "شماره تماس",
    value: CONTACT_PHONE_PERSIAN,
    href: `tel:${CONTACT_PHONE}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.87 12.87 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.87 12.87 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: "تلگرام",
    value: `@${CONTACT_TELEGRAM_ID}`,
    href: CONTACT_TELEGRAM_URL,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  {
    label: "اینستاگرام",
    value: "youneshayati.ai",
    href: CONTACT_INSTAGRAM_URL,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
];

export function ContactLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`grid gap-3 sm:grid-cols-3 ${className}`}>
      {contactMethods.map((m) => (
        <li key={m.label}>
          <a
            href={m.href}
            target={m.href.startsWith("http") ? "_blank" : undefined}
            rel={m.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="glass-panel group flex items-center gap-4 rounded-2xl p-4 transition-all hover:border-neon-blue/50 hover:bg-secondary/40"
          >
            <span className="text-neon-blue transition-transform group-hover:scale-110" aria-hidden="true">
              {m.icon}
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="truncate text-sm font-medium" dir="ltr">{m.value}</p>
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}
