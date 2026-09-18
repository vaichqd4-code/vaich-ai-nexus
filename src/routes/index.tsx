import { createFileRoute, Link } from "@tanstack/react-router";
import { products } from "@/lib/products";
import { ProductCard } from "@/components/product/ProductCard";
import { Section } from "@/components/layout/Section";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Trust } from "@/components/sections/Trust";
import { Faq } from "@/components/sections/Faq";
import { SupportCta } from "@/components/sections/SupportCta";
import { NeonButton } from "@/components/ui/NeonButton";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  return (
    <div className="flex flex-col gap-12 pb-16">
      <section className="relative overflow-hidden py-16 text-center">
        <div className="container mx-auto max-w-4xl px-4">
          <h1 className="text-3xl font-black tracking-tight sm:text-5xl">
            دسترسی سریع و امن به <span className="text-neon-blue">سرویس‌های هوش مصنوعی</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
            خرید اشتراک معتبر و اختصاصی ChatGPT، Gemini، Claude و برترین ابزارهای هوش مصنوعی با پشتیبانی دائمی VAICH.
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link to="/products">
              <NeonButton size="lg">مشاهده محصولات</NeonButton>
            </Link>
          </div>
        </div>
      </section>

      <Section
        id="products"
        title="محصولات و اشتراک‌ها"
        subtitle="پلن مورد نظر خود را انتخاب کرده و سفارش را ثبت نمایید"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </Section>

      <Features />
      <HowItWorks />
      <Trust />
      <Faq />
      <SupportCta />
    </div>
  );
}
