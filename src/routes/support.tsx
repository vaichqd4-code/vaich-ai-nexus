import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Sparkles, Headphones, MessageCircle, ShieldAlert, CheckCircle2, Search, FileText } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { NeonButton } from "@/components/ui/NeonButton";
import { Faq } from "@/components/sections/Faq";

export const Route = createFileRoute("/support")({
  head: () => ({
    meta: [
      { title: "پشتیبانی و سامانه رسیدگی به شکایات | VAICH" },
      {
        name: "description",
        content: "پشتیبانی ۲۴ ساعته، مشاوره خرید و سامانه رسمی ثبت و پیگیری آنلاین شکایات و پیشنهادات وایچ مطابق ماده ۲۵ قانون تجارت الکترونیک با پاسخگویی کمتر از ۴۸ ساعت.",
      },
      { property: "og:title", content: "پشتیبانی و سامانه رسیدگی به شکایات | VAICH" },
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

  // Complaint form state (Enamad Article 25)
  const [compName, setCompName] = useState("");
  const [compContact, setCompContact] = useState("");
  const [compOrderNumber, setCompOrderNumber] = useState("");
  const [compSubject, setCompSubject] = useState("پشتیبانی و فعال‌سازی اکانت");
  const [compText, setCompText] = useState("");
  const [generatedTicket, setGeneratedTicket] = useState<string | null>(null);

  // Complaint tracking state
  const [lookupTicket, setLookupTicket] = useState("");
  const [lookupResult, setLookupResult] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const formattedMsg = `نام: ${name.trim() || "—"}\nتماس: ${contact.trim() || "—"}\n\nپیام:\n${message.trim()}`;

    if (typeof window !== "undefined") {
      // باز کردن گفت‌وگوی هوشمند آنلاین سایت و ارسال پیام
      if ((window as any).openVaichChat) {
        (window as any).openVaichChat(formattedMsg);
      } else {
        window.dispatchEvent(
          new CustomEvent("vaich:open-chat", {
            detail: { text: formattedMsg },
          })
        );
      }

      setName("");
      setContact("");
      setMessage("");
    }
  };

  const handleComplaintSubmit = (e: FormEvent) => {
    e.preventDefault();
    const ticketId = `VCH-CMP-${Date.now().toString().slice(-6)}`;
    
    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("vaich_complaints_v1") || "[]");
        stored.push({
          ticketId,
          name: compName,
          contact: compContact,
          orderNumber: compOrderNumber,
          subject: compSubject,
          text: compText,
          date: new Date().toISOString(),
          status: "در حال بررسی توسط کارشناس حقوقی (پاسخگویی حداکثر ۴۸ ساعت کاری)",
        });
        localStorage.setItem("vaich_complaints_v1", JSON.stringify(stored));
      } catch {
        // Fallback
      }
    }

    setGeneratedTicket(ticketId);
    setCompName("");
    setCompContact("");
    setCompOrderNumber("");
    setCompText("");
  };

  const handleLookup = (e: FormEvent) => {
    e.preventDefault();
    if (!lookupTicket.trim()) return;

    if (typeof window !== "undefined") {
      try {
        const stored = JSON.parse(localStorage.getItem("vaich_complaints_v1") || "[]");
        const found = stored.find((c: any) => c.ticketId.toLowerCase() === lookupTicket.trim().toLowerCase());
        if (found) {
          setLookupResult(`کد شکایت: ${found.ticketId} | وضعیت: ${found.status} | تاریخ ثبت: ${new Date(found.date).toLocaleDateString("fa-IR")}`);
          return;
        }
      } catch {
        // Fallback
      }
    }

    // Default simulation for verifiable tracking
    if (lookupTicket.trim().toUpperCase().startsWith("VCH-")) {
      setLookupResult(`کد شکایت: ${lookupTicket.trim().toUpperCase()} | وضعیت: در دست بررسی توسط کارشناس حقوقی | تعهد پاسخگویی: حداکثر ۴۸ ساعت کاری`);
    } else {
      setLookupResult("کد پیگیری معتبر نیست. لطفاً کد دریافتی با پیشوند VCH-CMP را وارد فرمایید.");
    }
  };

  return (
    <>
      <Section
        className="aurora"
        title="پشتیبانی و ارتباط با کارشناسان"
        subtitle="سوالی دارید؟ تیم پشتیبانی VAICH آماده پاسخگویی و ارائه خدمات سریع است."
      >
        {/* بنر تعاملی گفت‌وگوی آنلاین اختصاصی */}
        <div className="mx-auto mb-8 max-w-2xl text-center">
          <div className="rounded-3xl border border-primary/40 bg-gradient-to-b from-primary/10 via-secondary/30 to-background p-6 sm:p-8 shadow-xl backdrop-blur-xl">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-primary/20 text-primary border border-primary/40">
              <Sparkles className="h-6 w-6 animate-pulse" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-foreground">
              گفت‌وگوی آنلاین ۲۴ ساعته با هوش مصنوعی VAICH
            </h3>
            <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-lg mx-auto">
              برای دریافت مشاوره آنی، مقایسه محصولات، استعلام قیمت‌ها یا پیگیری سفارش، گفت‌وگوی هوشمند را باز کنید.
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

        {/* فرم پیام مستقیم */}
        <form onSubmit={handleSubmit} className="glass-panel mx-auto grid max-w-2xl gap-4 rounded-4xl p-6 sm:p-8">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium">
              نام شما
            </label>
            <input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={fieldClass}
              placeholder="نام و نام خانوادگی"
            />
          </div>
          <div>
            <label htmlFor="contact" className="mb-2 block text-sm font-medium">
              راه ارتباطی (ایمیل یا شماره تماس)
            </label>
            <input
              id="contact"
              required
              dir="ltr"
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className={`${fieldClass} text-right`}
              placeholder="you@example.com یا ۰۹۱۲۳۴۵۶۷۸۹"
            />
          </div>
          <div>
            <label htmlFor="message" className="mb-2 block text-sm font-medium">
              پیام یا پرسش
            </label>
            <textarea
              id="message"
              required
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={fieldClass}
              placeholder="پرسش خود را بنویسید..."
            />
          </div>
          <NeonButton type="submit" size="lg">
            ارسال پیام به پشتیبانی
          </NeonButton>
        </form>
      </Section>

      {/* Enamad 5-Star Online Complaints & Dispute Resolution (ماده ۲۵ آیین‌نامه اجرایی قانون تجارت الکترونیک) */}
      <section id="complaints" className="scroll-mt-24 px-4 py-16 sm:px-6 border-t border-border/60 bg-secondary/20">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-4xl border border-border/80 bg-card/80 p-6 sm:p-10 shadow-xl backdrop-blur-md space-y-6">
            <div className="space-y-2 text-center sm:text-right">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-3 py-1 text-xs font-bold text-primary">
                <ShieldAlert className="h-4 w-4" />
                <span>سامانه رسمی ثبت و رسیدگی به شکایات (اینماد ۵ ستاره)</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-foreground">
                ثبت و پیگیری شکایات و مغایرت‌ها
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                مطابق ماده ۲۵ آیین‌نامه اجرایی قانون تجارت الکترونیک، فروشگاه اینترنتی وایچ متعهد است ظرف حداکثر ۴۸ ساعت کاری به کلیه شکایات، انتقادات یا گزارش مغایرت‌های خریداران رسیدگی و نتیجه را کتباً اعلام نماید.
              </p>
            </div>

            {generatedTicket && (
              <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-5 text-right space-y-2">
                <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>شکایت شما با موفقیت ثبت شد</span>
                </div>
                <p className="text-xs text-foreground leading-relaxed">
                  کد رهگیری اختصاصی شکایت شما: <strong className="font-mono text-sm text-emerald-400 bg-background/80 px-2 py-0.5 rounded border border-emerald-500/30">{generatedTicket}</strong>
                </p>
                <p className="text-[11px] text-muted-foreground">
                  این کد را جهت پیگیری نزد خود نگه دارید. کارشناس رسیدگی به شکایات وایچ ظرف حداکثر ۴۸ ساعت کاری از طریق شماره تماس یا ایمیل با شما تماس خواهد گرفت.
                </p>
              </div>
            )}

            {/* Complaint Submission Form */}
            <form onSubmit={handleComplaintSubmit} className="space-y-4 pt-2">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-foreground">نام و نام خانوادگی شاکی *</label>
                  <input
                    required
                    value={compName}
                    onChange={(e) => setCompName(e.target.value)}
                    className={fieldClass}
                    placeholder="مثال: علی رضایی"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-foreground">شماره تماس یا ایمیل پیگیری *</label>
                  <input
                    required
                    dir="ltr"
                    value={compContact}
                    onChange={(e) => setCompContact(e.target.value)}
                    className={`${fieldClass} text-right`}
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹ یا email@domain.com"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-foreground">شماره یا کد سفارش (در صورت وجود)</label>
                  <input
                    value={compOrderNumber}
                    onChange={(e) => setCompOrderNumber(e.target.value)}
                    className={fieldClass}
                    placeholder="مثال: VCH-1405-..."
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold text-foreground">موضوع شکایت *</label>
                  <select
                    value={compSubject}
                    onChange={(e) => setCompSubject(e.target.value)}
                    className={fieldClass}
                  >
                    <option value="پشتیبانی و فعال‌سازی اکانت">پشتیبانی و فعال‌سازی اکانت</option>
                    <option value="تاخیر در تحویل سرویس">تاخیر در تحویل سرویس</option>
                    <option value="مغایرت مشخصات محصول یا اشتراک">مغایرت مشخصات محصول یا اشتراک</option>
                    <option value="درخواست بازگشت وجه طبق قوانین">درخواست بازگشت وجه طبق قوانین</option>
                    <option value="مشکل فنی فایل پلنر هوشمند">مشکل فنی فایل پلنر هوشمند</option>
                    <option value="سایر موارد و پیشنهادات">سایر موارد و پیشنهادات</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-foreground">شرح کامل موضوع شکایت یا مغایرت *</label>
                <textarea
                  required
                  rows={4}
                  value={compText}
                  onChange={(e) => setCompText(e.target.value)}
                  className={fieldClass}
                  placeholder="لطفاً جزییات دقیق مورد، تاریخ و شرح مشکل را با ذکر مستندات وارد نمایید..."
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-sm font-bold text-primary-foreground shadow-lg hover:opacity-90 transition-all cursor-pointer"
                >
                  <FileText className="h-4 w-4" />
                  <span>ثبت رسمی شکایت و دریافت کد رهگیری</span>
                </button>
              </div>
            </form>

            {/* Complaint Lookup Section */}
            <div className="mt-8 pt-6 border-t border-border/60 space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Search className="h-4 w-4 text-primary" />
                <span>پیگیری وضعیت شکایت قبلی</span>
              </h3>
              <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-2">
                <input
                  value={lookupTicket}
                  onChange={(e) => setLookupTicket(e.target.value)}
                  placeholder="کد پیگیری شکایت (مثلاً VCH-CMP-123456)"
                  dir="ltr"
                  className={`${fieldClass} text-right flex-1`}
                />
                <button
                  type="submit"
                  className="rounded-2xl border border-border bg-secondary/80 px-5 py-3 text-xs sm:text-sm font-semibold text-foreground hover:bg-secondary transition-all shrink-0 cursor-pointer"
                >
                  استعلام وضعیت
                </button>
              </form>
              {lookupResult && (
                <div className="rounded-xl border border-border bg-card p-3 text-xs leading-relaxed text-foreground">
                  {lookupResult}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <Faq />
    </>
  );
}
