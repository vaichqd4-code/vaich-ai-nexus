import { useEffect, useRef, useState } from "react";
import {
  Headphones,
  X,
  Send,
  RotateCcw,
  Sparkles,
  Phone,
  MessageCircle,
  ChevronDown,
  ArrowDownLeft,
} from "lucide-react";

export type ChatMessage = {
  id: string;
  role: "user" | "model";
  text: string;
  timestamp: number;
};

const INITIAL_WELCOME: ChatMessage = {
  id: "welcome-1",
  role: "model",
  text: "سلام و درود! به پشتیبانی هوشمند فروشگاه اینترنتی VAICH خوش آمدید. 😊\nمن دستیار ۲۴ ساعته سایت هستم و این گفت‌وگو به صورت مستقیم و بدون نیاز به هیچ‌گونه فیلترشکن کار می‌کند.\nچطور می‌تونم کمکتون کنم؟",
  timestamp: Date.now(),
};

const QUICK_PROMPTS = [
  "چت جی پی تی بخرم یا کلود؟",
  "فرق پلن‌های جمینای چیه؟",
  "پلنر دیجیتال چطور کار می‌کنه؟",
  "روال پرداخت و ارسال فیش واریزی",
];

export function AiChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("vaich_ai_chat_v1");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed;
          }
        }
      } catch {
        // ignore
      }
    }
    return [INITIAL_WELCOME];
  });
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // هماهنگی با رویدادهای سراسری سایت جهت باز شدن از هر نقطه (هدر، فوتر، صفحات)
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).openVaichChat = () => {
        setIsOpen(true);
        setIsMinimized(false);
      };

      const handleCustomOpen = () => {
        setIsOpen(true);
        setIsMinimized(false);
      };

      window.addEventListener("vaich:open-chat", handleCustomOpen);
      return () => {
        window.removeEventListener("vaich:open-chat", handleCustomOpen);
      };
    }
  }, []);

  // ذخیره در LocalStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vaich_ai_chat_v1", JSON.stringify(messages));
      } catch {
        // ignore
      }
    }
  }, [messages]);

  // اسکرول خودکار به آخرین پیام
  useEffect(() => {
    if (isOpen && !isMinimized) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, isMinimized, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const raw = textToSend || input;
    const trimmed = raw.trim();
    if (!trimmed || loading) return;

    const userMsg: ChatMessage = {
      id: "u-" + Date.now(),
      role: "user",
      text: trimmed,
      timestamp: Date.now(),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput("");
    setLoading(true);

    try {
      const historyPayload = newHistory.slice(-10).map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const res = await fetch("/api/crisp-webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          direct: true,
          message: trimmed,
          history: historyPayload,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const replyText =
          data?.reply ||
          "پوزش می‌طلبم، پاسخی دریافت نشد. لطفاً به آیدی تلگرام @youneshayati پیام دهید.";

        setMessages((prev) => [
          ...prev,
          {
            id: "m-" + Date.now(),
            role: "model",
            text: replyText,
            timestamp: Date.now(),
          },
        ]);
      } else {
        throw new Error("API responded with error");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "m-err-" + Date.now(),
          role: "model",
          text: "متاسفانه اختلالی در ارتباط پیش آمد. برای راهنمایی فوری می‌توانید مستقیماً در تلگرام به آیدی مدیریت پیام دهید:\n👉 @youneshayati (https://t.me/youneshayati)\nیا با شماره 09193872172 (ساعت ۱۴ الی ۲۲) تماس بگیرید.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("آیا مایلید تاریخچه این گفت‌وگو پاک شود؟")) {
      const reset = [INITIAL_WELCOME];
      setMessages(reset);
      try {
        localStorage.setItem("vaich_ai_chat_v1", JSON.stringify(reset));
      } catch {
        // ignore
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  // قالب‌بندی ساده متن و لینک‌های پیام هوش مصنوعی
  const renderMessageContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.includes("https://t.me/") || line.includes("@youneshayati")) {
        return (
          <p key={idx} className="my-1 leading-relaxed">
            {line.split(" ").map((w, wIdx) => {
              if (w.startsWith("https://") || w.startsWith("http://")) {
                return (
                  <a
                    key={wIdx}
                    href={w}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline font-mono inline-block mx-1"
                  >
                    {w}
                  </a>
                );
              }
              if (w.startsWith("@")) {
                return (
                  <a
                    key={wIdx}
                    href={`https://t.me/${w.replace("@", "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline font-bold inline-block mx-1"
                    dir="ltr"
                  >
                    {w}
                  </a>
                );
              }
              return w + " ";
            })}
          </p>
        );
      }

      if (line.startsWith("• ") || line.startsWith("- ")) {
        return (
          <li key={idx} className="mr-3 list-disc my-0.5 leading-relaxed">
            {line.substring(2)}
          </li>
        );
      }

      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }

      return (
        <p key={idx} className="my-1 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div
      dir="rtl"
      className="fixed bottom-3 left-3 sm:bottom-5 sm:left-5 z-[99999] flex flex-col select-none font-sans"
    >
      {isMinimized ? (
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 rounded-full border border-primary/50 bg-card/95 px-4 py-2.5 text-xs font-bold text-foreground shadow-2xl backdrop-blur-xl hover:border-primary transition-all hover:scale-105 cursor-pointer"
        >
          <div className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </div>
          <span>پشتیبانی هوشمند VAICH</span>
          <Headphones className="h-4 w-4 text-primary mr-1" />
        </button>
      ) : (
        <div className="w-[calc(100vw-24px)] xs:w-[370px] sm:w-[410px] h-[550px] max-h-[82vh] rounded-3xl border border-border/80 bg-card/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden text-foreground">
          {/* هدر چت‌بات */}
          <div className="flex items-center justify-between border-b border-border/50 bg-secondary/30 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="relative grid h-9 w-9 place-items-center rounded-xl border border-primary/40 bg-primary/10 text-primary">
                <Sparkles className="h-4 w-4 animate-pulse" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-foreground">
                    پشتیبانی هوشمند VAICH
                  </span>
                  <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-1.5 py-0.2 text-[9px] font-bold text-emerald-400">
                    بدون فیلترشکن
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
                  آنلاین ۲۴ ساعته | دستیار هوش مصنوعی
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearHistory}
                title="پاک کردن پیام‌ها"
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                title="کوچک کردن"
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="بستن"
                className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* نوار دسترسی مستقیم به مدیریت */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-secondary/15 border-b border-border/30 text-[11px] text-muted-foreground">
            <span className="truncate">مدیریت: یونس حیاتی</span>
            <div className="flex items-center gap-2">
              <a
                href="https://t.me/youneshayati"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-primary hover:underline font-medium"
              >
                <MessageCircle className="h-3 w-3" />
                <span>تلگرام</span>
              </a>
              <span className="opacity-40">|</span>
              <a
                href="tel:09193872172"
                className="flex items-center gap-1 hover:text-foreground transition-colors"
                title="تماس تلفنی ۱۴ الی ۲۲"
              >
                <Phone className="h-3 w-3" />
                <span>09193872172</span>
              </a>
            </div>
          </div>

          {/* محتوای پیام‌ها */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs sm:text-[13px]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === "user" ? "items-start" : "items-end"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 transition-all shadow-xs ${
                    m.role === "user"
                      ? "rounded-br-xs bg-primary text-primary-foreground font-medium self-end"
                      : "rounded-bl-xs border border-border/70 bg-secondary/50 text-foreground/90 self-start"
                  }`}
                >
                  {renderMessageContent(m.text)}
                </div>
                <span className="text-[9px] text-muted-foreground/60 mt-1 px-1">
                  {new Date(m.timestamp).toLocaleTimeString("fa-IR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}

            {loading && (
              <div className="flex items-center gap-2 self-start rounded-2xl border border-border/70 bg-secondary/40 px-3.5 py-2.5 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary animate-spin" />
                <span>دستیار در حال پاسخگویی...</span>
                <span className="flex gap-1 mr-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.2s]"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.4s]"></span>
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* دکمه‌های سوالات متداول سریع */}
          <div className="px-3 py-1.5 border-t border-border/30 bg-background/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                type="button"
                disabled={loading}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap rounded-lg border border-border/60 bg-secondary/30 px-2 py-1 text-[10px] text-muted-foreground hover:border-primary/50 hover:bg-secondary hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
              >
                <ArrowDownLeft className="h-2.5 w-2.5 inline ml-1 opacity-70" />
                {prompt}
              </button>
            ))}
          </div>

          {/* فرم ارسال پیام */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 p-2.5 border-t border-border/50 bg-secondary/20"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="پیام یا سوال خود را بنویسید..."
              disabled={loading}
              className="flex-1 rounded-xl border border-border/60 bg-background/80 px-3 py-2 text-xs text-foreground outline-none placeholder:text-muted-foreground focus:border-primary transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              title="ارسال پیام"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition-all hover:opacity-90 active:scale-95 disabled:opacity-40 cursor-pointer"
            >
              <Send className="h-4 w-4 rotate-180" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
