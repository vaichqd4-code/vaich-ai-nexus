import { createFileRoute } from "@tanstack/react-router";
import heroImage from "@/assets/hero-ai.jpg";
import { Section } from "@/components/layout/Section";
import { ProductCard } from "@/components/product/ProductCard";
import { Features } from "@/components/sections/Features";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Trust } from "@/components/sections/Trust";
import { Faq } from "@/components/sections/Faq";
import { SupportCta } from "@/components/sections/SupportCta";
import { NeonLink } from "@/components/ui/NeonButton";
import { products } from "@/lib/products";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "VAICH | خرید اشتراک هوش مصنوعی" },
      {
        name: "description",
        content:
          "VAICH ارائه‌دهنده اشتراک سرویس‌های هوش مصنوعی Gemini، ChatGPT و Claude با پشتیبانی و قیمت شفاف.",
      },
      { property: "og:title", content: "VAICH | خرید اشتراک هوش مصنوعی" },
      {
        property: "og:description",
        content: "اشتراک سرویس‌های قدرتمند هوش مصنوعی را با VAICH تجربه کنید.",
      },
    ],
  }),
  component: Home,
});

function Hero() {
  return (
    <section className="aurora relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 pt-14 pb-8 sm:px-6 sm:pt-20 lg:grid-cols-2 lg:pt-24">
        <div className="rise-in">
          <span className="glass-panel inline-flex items-center rounded-full px-4 py-1.5 text-xs text-muted-foreground">
            فروشگاه اشتراک‌های هوش مصنوعی
          </span>
          <h1 className="mt-6 text-3xl leading-[1.5] font-extrabold sm:text-5xl sm:leading-[1.35]">
            دنیای هوش مصنوعی، <span className="gradient-text">یک قدم نزدیک‌تر</span>
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-8 text-muted-foreground sm:text-base">
            اشتراک سرویس‌های قدرتمند هوش مصنوعی را با VAICH تجربه کنید.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <NeonLink to="/products" size="lg">
              مشاهده محصولات
            </NeonLink>
            <NeonLink to="/support" variant="outline" size="lg">
              پشتیبانی
            </NeonLink>
          </div>
        </div>

        <div className="relative">
          <div className="float-slow glow-strong overflow-hidden rounded-4xl border border-border">
            <img
              src={heroImage}
              alt="تصویر انتزاعی از جریان انرژی هوش مصنوعی با نور نئون آبی و بنفش"
              width={1536}
              height={1152}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Home() {
  return (
    <>
      <Hero />

      <Section
        id="products"
        title="اشتراک‌های هوش مصنوعی"
        subtitle="سرویس مورد نظر خود را انتخاب کنید."
      >
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </Section>

      <Features />
      <HowItWorks />
      <Trust />
      <Faq />
      <SupportCta />
    </>
  );
}
