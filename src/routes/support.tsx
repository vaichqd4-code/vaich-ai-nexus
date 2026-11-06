import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Sparkles, Headphones, MessageCircle } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { NeonButton } from "@/components/ui/NeonButton";
import { ContactLinks } from "@/components/brand/ContactLinks";
import { Faq } from "@/components/sections/Faq";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "پشتیبانی و ارتباط با کارشناسان | VAICH" },
      {
        name: "description",
        content: "برای دریافت مشاوره، راهنمایی پیش از خرید یا پیگیری و فعال‌سازی اشتراک‌های هوش مصنوعی، با تیم پشتیبانی ۲۴ ساعته VAICH در ارتباط باشید.",
      },
      { property: "og:title", content: "پشتیبانی و ارتباط با کارشناسان | VAICH" },
      { property: "og:description", content: "تیم پشتیبانی VAICH به صورت ۲۴ ساعته در تلگرام و گفت‌وگوی آنلاین آماده پاسخگویی است." },
      { property: "og:url", content: "https://vaich.ir/support" },
    ],
    links: [
      { rel: "canonical", href: "https://vaich.ir/support" },
    ],
  }),
  component: SupportPage,
});

const fieldClass =
  "w-full rounded-2xl border border-input bg-background/60 px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-neon-blue/70 focus:ring-2 focus:ring-ring/40";

function SupportPage() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formattedMsg = `نام: ${name.trim() || "—"}\nتماس: ${contact.trim() || "—"}\n\nپیام:\n${message.trim()}`;

    if (typeof window !== "undefined") {
      // باز کردن چت هوشمند اختصاصی سایت (بدون نیاز به فیلترشکن)
      if ((window as any).openVaichChat) {
        (window as any).openVaichChat();
      } else {
        window.dispatchEvent(new CustomEvent("vaich:open-chat"));
      }

      // در صورت بارگذاری کریسپ، پیام به آن نیز ارسال می‌شود
      if ((window as any).$crisp) {
        try {
          const crisp = (window as any).$crisp;
          if (name.trim()) crisp.push(["set", "user:nickname", [name.trim()]]);
          if (contact.trim()) {
            const isEmail = /\S+@\S+\.\S+/.test(contact.trim());
            if (isEmail) crisp.push(["set", "user:email", [contact.trim()]]);
            else crisp.push(["set", "session:data", [[["contact", contact.trim()]]]]);
          }
          crisp.push(["do", "message:send", ["text", formattedMsg]]);
          crisp.push(["do", "chat:open"]);
        } catch {
          // ignore
        }
      }

      setName("");
      setContact("");
      setMessage("");
    }
  };

  return (
    <>
      <Section
        className="aurora"
        title="پشتیبانی"
        subtitle="سوالی دارید؟ تیم پشتیبانی VAICH آماده کمک به شماست."
      >
        {/* بنر تعاملی گفت‌وگوی آنلاین بدون فیلترشکن */}
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <div className="rounded-3xl border border-primary/40 bg-gradient-to-b from-primary/10 via-secondary/30 to-background p-6 sm:p-8 shadow-xl backdrop-blur-xl">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-primary/20 text-primary border border-primary/40">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              گفت‌وگوی آنلاین ۲۴ ساعته با هوش مصنوعی (بدون نیاز به فیلترشکن)
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
              برای دریافت راهنمایی آنی، مقایسه محصولات، استعلام قیمت‌ها یا پیگیری سفارش، همین حالا گفت‌وگوی هوشمند سایت را باز کنید.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (typeof window !== "undefined") {
                    if ((window as any).openVaichChat) {
                      (window as any).openVaichChat();
                    } else {
                      window.dispatchEvent(new CustomEvent("vaich:open-chat"));
                    }
                  }
                }}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg hover:opacity-90 active:scale-95 transition-all cursor-pointer"
              >
                <Headphones className="h-4 w-4" />
                <span>باز کردن گفت‌وگوی هوشمند آنلاین</span>
              </button>
              <a
                href="https://t.me/youneshayati"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-border/80 bg-secondary/40 px-5 py-3 text-sm font-semibold text-foreground hover:bg-secondary hover:border-primary/50 transition-all"
              >
                <MessageCircle className="h-4 w-4 text-primary" />
                <span>پیام در تلگرام مدیریت (@youneshayati)</span>
              </a>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="glass-panel mx-auto grid max-w-2xl gap-4 rounded-4xl p-6 sm:p-8">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm">
              نام
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
              placeholder="نام شما"
            />
          </div>
          <div>
            <label htmlFor="contact" className="mb-2 block text-sm">
              راه ارتباطی (ایمیل یا شماره تماس)
            </label>
            <input
              id="contact"
              required
              dir="ltr"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={`${fieldClass} text-right`}
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-2 block text-sm">
              پیام
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={fieldClass}
              placeholder="سوال خود را بنویسید."
            />
          </div>
          <NeonButton type="submit" size="lg">
            ارتباط با پشتیبانی
          </NeonButton>
        </form>
      </Section>
      <Faq />
    </>
  );
}
