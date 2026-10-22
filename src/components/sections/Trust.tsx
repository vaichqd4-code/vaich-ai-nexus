import { Section } from "@/components/layout/Section";

const items = [
  { title: "خرید امن و مطمئن", body: "فرایند خرید کاملاً شفاف و مشخص است و اطلاعات سفارش تنها برای انجام مستقیم سفارش شما استفاده می‌شود." },
  { title: "پشتیبانی پاسخگو", body: "پیش و پس از خرید می‌توانید برای راهنمایی راه‌اندازی و استفاده با تیم پشتیبانی در ارتباط باشید." },
  { title: "قیمت شفاف و منصفانه", body: "قیمت هر سفارش پیش از پرداخت به‌صورت کامل و بدون هزینه پنهان نمایش داده می‌شود." },
  { title: "تحویل فوری و قانونی", body: "پس از تأیید سفارش، دسترسی مستقیم به خدمات دیجیتال و اشتراک‌های هوش مصنوعی بلافاصله تحویل داده می‌شود." },
];

export function Trust() {
  return (
    <Section title="چرا می‌توانید به VAICH اعتماد کنید">
      <div className="aurora glass-panel grid gap-6 rounded-4xl p-6 sm:grid-cols-2 sm:p-10">
        {items.map((it) => (
          <div key={it.title} className="rounded-3xl border border-border/60 bg-background/40 p-6">
            <h3 className="text-base font-bold">{it.title}</h3>
            <p className="mt-2 text-sm leading-7 text-muted-foreground">{it.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}
