import { useEffect, useRef, useState } from "react";
import {
  Headphones,
  X,
  Send,
  RotateCcw,
  Sparkles,
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
  text: "سلام! وقتتون بخیر. 🌟 چطور می‌تونم کمکتون کنم؟\nهر سوالی درباره اشتراک‌ها، مقایسه ابزارها یا نحوه ثبت سفارش دارید بفرمایید.",
  timestamp: Date.now(),
};

const QUICK_PROMPTS = [
  "چت جی پی تی یا کلود؟",
  "تفاوت پلن‌های جمینای",
  "پلنر دیجیتال چیست؟",
  "روال ثبت سفارش و رسید",
];

export function AiChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("vaich_ai_chat_v2");
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

  // هماهنگی با رویداد سراسری باز شدن چت از هدر یا صفحات
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

  // ذخیره سابقه در حافظه لوکال
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("vaich_ai_chat_v2", JSON.stringify(messages));
      } catch {
        // ignore
      }
    }
  }, [messages]);

  // اسکرول نرم و سریع به پیام جدید
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
      const historyPayload = newHistory.slice(-8).map((m) => ({
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
          "پوزش می‌طلبم، پاسخی دریافت نشد. لطفاً در تلگرام به @youneshayati پیام دهید.";

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
        throw new Error("API error");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: "m-err-" + Date.now(),
          role: "model",
          text: "متاسفانه اختلالی در ارتباط پیش آمد. برای راهنمایی فوری می‌توانید در تلگرام با ما در ارتباط باشید:\n👉 @youneshayati (https://t.me/youneshayati)",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    const reset = [INITIAL_WELCOME];
    setMessages(reset);
    try {
      localStorage.setItem("vaich_ai_chat_v2", JSON.stringify(reset));
    } catch {
      // ignore
    }
  };

  if (!isOpen) {
    return null;
  }

  // قالب‌بندی مینیمال و تمیز متن پاسخ‌ها
  const renderMessageContent = (text: string) => {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.includes("https://") || line.includes("http://") || line.includes("@youneshayati")) {
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
                    className="text-primary hover:underline font-mono inline-block mx-0.5"
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
                    className="text-primary hover:underline font-bold inline-block mx-0.5"
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

      if (line.startsWith("• ") || line.startsWith("- ") || line.startsWith("* ")) {
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
      className="fixed bottom-3 left-3 sm:bottom-6 sm:left-6 z-[99999] flex flex-col font-sans select-none"
    >
      {isMinimized ? (
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-2.5 rounded-full border border-border/80 bg-background/95 dark:bg-card/95 px-4 py-2.5 text-xs font-semibold text-foreground shadow-2xl backdrop-blur-xl hover:border-primary/50 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span>پشتیبانی آنلاین VAICH</span>
          <Headphones className="h-3.5 w-3.5 text-primary mr-0.5" />
        </button>
      ) : (
        <div className="w-[calc(100vw-24px)] xs:w-[370px] sm:w-[400px] h-[520px] max-h-[82vh] rounded-3xl border border-border/80 bg-background/95 dark:bg-card/95 backdrop-blur-2xl shadow-2xl flex flex-col overflow-hidden text-foreground animate-in fade-in zoom-in-95 duration-200 ease-out">
          {/* هدر مینیمال و استاندارد */}
          <div className="flex items-center justify-between border-b border-border/40 bg-secondary/20 dark:bg-secondary/30 px-4 py-3">
            <div className="flex items-center gap-2.5">
              <div className="relative grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-foreground">
                    پشتیبانی آنلاین VAICH
                  </span>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground mt-0.5">
                  پاسخگویی آنی هوشمند
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearHistory}
                title="شروع مجدد گفت‌وگو"
                className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                title="کوچک کردن"
                className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150 cursor-pointer"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="بستن"
                className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-all duration-150 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* محتوای پیام‌ها با هماهنگی کامل حالت روز و شب */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 text-xs sm:text-[13px] scroll-smooth">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${
                  m.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 transition-all shadow-xs leading-relaxed ${
                    m.role === "user"
                      ? "rounded-br-xs bg-primary text-primary-foreground font-medium self-end"
                      : "rounded-bl-xs bg-secondary/60 dark:bg-secondary/40 text-foreground border border-border/40 self-start"
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
              <div className="flex items-center gap-2 self-start rounded-2xl rounded-bl-xs border border-border/40 bg-secondary/50 px-3.5 py-2 text-xs text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary animate-spin" />
                <span>دستیار در حال نوشتن پاسخ...</span>
                <span className="flex gap-1 mr-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.15s]"></span>
                  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.3s]"></span>
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* دکمه‌های گزینش سریع مینیمال */}
          <div className="px-3 py-1.5 border-t border-border/30 bg-background/50 dark:bg-card/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                type="button"
                disabled={loading}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap rounded-full border border-border/60 bg-secondary/40 hover:bg-primary/10 hover:border-primary/40 hover:text-primary px-3 py-1 text-[11px] text-muted-foreground transition-all duration-150 cursor-pointer disabled:opacity-50 active:scale-95"
              >
                <ArrowDownLeft className="h-2.5 w-2.5 inline ml-1 opacity-70" />
                {prompt}
              </button>
            ))}
          </div>

          {/* فرم ارسال پیام تمیز و هماهنگ */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 p-2.5 border-t border-border/40 bg-secondary/20 dark:bg-secondary/30"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="پیام یا سوال خود را بنویسید..."
              disabled={loading}
              className="flex-1 rounded-xl border border-border/60 bg-background text-foreground px-3.5 py-2 text-xs outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              title="ارسال پیام"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground transition-all duration-150 hover:opacity-90 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-xs"
            >
              <Send className="h-4 w-4 rotate-180" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
