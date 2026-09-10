import { Section } from "@/components/layout/Section";

const features = [
  {
    title: "تحویل سریع",
    body: "سفارش شما در کوتاه‌ترین زمان ممکن بررسی و اطلاعات اشتراک ارسال می‌شود.",
    path: "M13 2 4 14h6l-1 8 9-12h-6l1-8Z",
  },
  {
    title: "پشتیبانی",
    body: "تیم پشتیبانی VAICH برای پاسخ به سؤال‌های شما در دسترس است.",
    path: "M4 12a8 8 0 1 1 16 0v5a3 3 0 0 1-3 3h-3M4 12v3a3 3 0 0 0 3 3h1",
  },
  {
    title: "قیمت مناسب",
    body: "قیمت‌ها شفاف اعلام می‌شوند و هزینه پنهانی وجود ندارد.",
    path: "M12 3v18M8 7.5h6.5a2.5 2.5 0 0 1 0 5h-5a2.5 2.5 0 0 0 0 5H16",
  },
  {
    title: "تجربه‌ای ساده و مطمئن",
    body: "مسیر خرید کوتاه و روشن است؛ از انتخاب اشتراک تا دریافت آن.",
    path: "M12 3 4 6.5v5c0 5 3.4 8.4 8 9.5 4.6-1.1 8-4.5 8-9.5v-5L12 3Zm-3 8.8 2.2 2.2L15.4 10",
  },
];

export function Features() {
  return (
    <Section
      id="why"
      title="چرا VAICH"
      subtitle="چند دلیل ساده که خرید اشتراک هوش مصنوعی را با ما راحت‌تر می‌کند."
    >
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <li
            key={f.title}
            className="glass-panel rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary/70 text-neon-purple">
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                <path
                  d={f.path}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <h3 className="mt-5 text-base font-bold">{f.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{f.body}</p>
          </li>
        ))}
      </ul>
    </Section>
  );
}
