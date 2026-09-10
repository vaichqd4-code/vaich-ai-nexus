import { Section } from "@/components/layout/Section";
import { toPersianDigits } from "@/lib/products";

const steps = ["انتخاب اشتراک", "ثبت سفارش و پرداخت", "دریافت اطلاعات اشتراک"];

export function HowItWorks() {
  return (
    <Section title="چطور کار می‌کند" subtitle="فقط سه قدم تا استفاده از سرویس‌های هوش مصنوعی.">
      <ol className="grid gap-4 md:grid-cols-3">
        {steps.map((step, i) => (
          <li
            key={step}
            className="relative rounded-3xl border border-border bg-card/60 p-6 transition-colors duration-300 hover:border-neon-blue/50"
          >
            <span className="gradient-text text-4xl font-extrabold">{toPersianDigits(i + 1)}</span>
            <h3 className="mt-3 text-base font-bold">{step}</h3>
          </li>
        ))}
      </ol>
    </Section>
  );
}
