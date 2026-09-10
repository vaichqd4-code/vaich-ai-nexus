import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/layout/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { SupportCta } from "@/components/sections/SupportCta";
import { products } from "@/lib/products";

export const Route = createFileRoute("/products/")({
  head: () => ({
    meta: [
      { title: "اشتراک‌های هوش مصنوعی | VAICH" },
      {
        name: "description",
        content: "لیست اشتراک‌های هوش مصنوعی VAICH شامل Gemini، ChatGPT و Claude همراه با قیمت.",
      },
      { property: "og:title", content: "اشتراک‌های هوش مصنوعی | VAICH" },
      {
        property: "og:description",
        content: "اشتراک Gemini، ChatGPT و Claude را از VAICH تهیه کنید.",
      },
    ],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  return (
    <>
      <Section
        className="aurora"
        title="اشتراک‌های هوش مصنوعی"
        subtitle="سرویس مورد نظر خود را انتخاب کنید و جزئیات آن را ببینید."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Section>
      <HowItWorks />
      <SupportCta />
    </>
  );
}
