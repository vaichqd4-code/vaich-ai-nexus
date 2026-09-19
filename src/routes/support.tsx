import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Section } from "@/components/layout/Section";
import { NeonButton } from "@/components/ui/NeonButton";
import { ContactLinks } from "@/components/brand/ContactLinks";
import { Faq } from "@/components/sections/Faq";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "پشتیبانی | VAICH" },
      {
        name: "description",
        content: "برای پرسش درباره اشتراک‌های هوش مصنوعی با تیم پشتیبانی VAICH در ارتباط باشید.",
      },
      { property: "og:title", content: "پشتیبانی | VAICH" },
      { property: "og:description", content: "تیم پشتیبانی VAICH آماده کمک به شماست." },
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

    if (typeof window !== "undefined" && (window as any).$crisp) {
      const crisp = (window as any).$crisp;

      if (name.trim()) {
        crisp.push(["set", "user:nickname", [name.trim()]]);
      }

      if (contact.trim()) {
        const isEmail = /\S+@\S+\.\S+/.test(contact.trim());
        if (isEmail) {
          crisp.push(["set", "user:email", [contact.trim()]]);
        } else {
          crisp.push(["set", "session:data", [[["contact", contact.trim()]]]]);
        }
      }

      if (message.trim()) {
        const formattedMsg = `نام: ${name.trim() || "—"}\nتماس: ${contact.trim() || "—"}\n\nپیام:\n${message.trim()}`;
        crisp.push(["do", "message:send", ["text", formattedMsg]]);
      }

      crisp.push(["do", "chat:open"]);

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
        <div className="mx-auto mb-8 max-w-3xl">
          <p className="mb-4 text-center text-sm text-muted-foreground">
            سریع‌ترین راه‌های ارتباط با ما:
          </p>
          <ContactLinks />
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
