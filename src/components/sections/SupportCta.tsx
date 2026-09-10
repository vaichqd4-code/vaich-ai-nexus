import { Section } from "@/components/layout/Section";
import { NeonLink } from "@/components/ui/NeonButton";

export function SupportCta() {
  return (
    <Section>
      <div className="aurora glass-panel flex flex-col items-center gap-6 rounded-4xl px-6 py-14 text-center">
        <h2 className="max-w-2xl text-xl font-extrabold sm:text-2xl">
          سوالی دارید؟ تیم پشتیبانی VAICH آماده کمک به شماست.
        </h2>
        <NeonLink to="/support" size="lg">
          ارتباط با پشتیبانی
        </NeonLink>
      </div>
    </Section>
  );
}
