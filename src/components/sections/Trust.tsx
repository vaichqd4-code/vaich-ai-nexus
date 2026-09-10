import { Section } from "@/components/layout/Section";

const items = [
  { title: "خرید امن", body: "فرایند خرید مشخص است و اطلاعات سفارش تنها برای انجام سفارش استفاده می‌شود." },
  { title: "پشتیبانی مشتری", body: "پیش و پس از خرید می‌توانید با تیم پشتیبانی در ارتباط باشید." },
  { title: "قیمت شفاف", body: "قیمت هر اشتراک پیش از پرداخت به‌صورت کامل نمایش داده می‌شود." },
  { title: "تحویل سریع", body: "پس از تأیید سفارش، اطلاعات اشتراک در اسرع وقت ارسال می‌شود." },
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
