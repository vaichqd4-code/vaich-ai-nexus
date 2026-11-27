import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  "خرید استارز و تلگرام پرمیوم",
  "ساخت ربات تلگرام اختصاصی",
  "چت جی پی تی یا کلود؟",
  "تفاوت پلن‌های جمینای",
  "روال ثبت سفارش و رسید",
];

export function AiChatDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
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
  const [sessionId, setSessionId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      try {
        return localStorage.getItem("vaich_crisp_session_id") || null;
      } catch {
        return null;
      }
    }
    return null;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const handleSendMessageRef = useRef<(textToSend?: string) => Promise<void>>();

  // هماهنگی با رویداد سراسری باز شدن چت از هدر، فوتر یا صفحه پشتیبانی
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).openVaichChat = (initialText?: string) => {
        setIsClosing(false);
        setIsOpen(true);
        setIsMinimized(false);
        if (initialText && typeof initialText === "string") {
          setTimeout(() => {
            handleSendMessageRef.current?.(initialText);
          }, 120);
        }
      };

      const handleCustomOpen = (e: any) => {
        setIsClosing(false);
        setIsOpen(true);
        setIsMinimized(false);
        if (e.detail?.text && typeof e.detail.text === "string") {
          setTimeout(() => {
            handleSendMessageRef.current?.(e.detail.text);
          }, 120);
        }
      };

      // اگر کاربر پیش از بارگذاری کامل چت روی دکمه پشتیبانی کلیک کرده باشد، بلافاصله باز شود
      const pending = (window as any).__vaichPendingChatOpen;
      if (pending?.active) {
        (window as any).__vaichPendingChatOpen = null;
        setIsClosing(false);
        setIsOpen(true);
        setIsMinimized(false);
        if (pending.text) {
          setTimeout(() => {
            handleSendMessageRef.current?.(pending.text);
          }, 120);
        }
      }

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
          sessionId: sessionId || undefined,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data?.sessionId && data.sessionId !== sessionId) {
          setSessionId(data.sessionId);
          try {
            localStorage.setItem("vaich_crisp_session_id", data.sessionId);
          } catch {
            // ignore
          }
        }

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

  handleSendMessageRef.current = handleSendMessage;

  // همگام‌سازی و دریافت زنده پاسخ‌های دستی ادمین (یونس حیاتی) از اپلیکیشن موبایل کریسپ
  useEffect(() => {
    if (!isOpen || isMinimized || !sessionId || loading) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/crisp-webhook?session_id=${encodeURIComponent(sessionId)}`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data?.messages) && data.messages.length > 0) {
            setMessages((prev) => {
              const existingTexts = new Set(prev.map((m) => m.text.trim()));
              const newOperatorMsgs = data.messages.filter(
                (m: any) => m.role === "model" && !existingTexts.has(m.text.trim()),
              );
              if (newOperatorMsgs.length > 0) {
                return [
                  ...prev,
                  ...newOperatorMsgs.map((m: any) => ({
                    id: "crisp-op-" + (m.id || Date.now()),
                    role: "model" as const,
                    text: m.text,
                    timestamp: m.timestamp || Date.now(),
                  })),
                ];
              }
              return prev;
            });
          }
        }
      } catch {
        // ignore background poll errors
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [isOpen, isMinimized, sessionId, loading]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 220);
  };

  const handleClearHistory = () => {
    const reset = [INITIAL_WELCOME];
    setMessages(reset);
    setSessionId(null);
    try {
      localStorage.setItem("vaich_ai_chat_v2", JSON.stringify(reset));
      localStorage.removeItem("vaich_crisp_session_id");
    } catch {
      // ignore
    }
  };

  if (!isOpen || !isMounted) {
    return null;
  }

  // قالب‌بندی مینیمال و تمیز متن پاسخ‌ها با لینک‌های هوشمند
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

  return createPortal(
    <div
      dir="rtl"
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-[99999] flex flex-col font-sans select-none"
    >
      {isMinimized ? (
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          className="animate-vaich-pill flex items-center gap-2.5 rounded-full border border-white/20 dark:border-white/10 bg-background/90 dark:bg-[#0b0f19]/90 pl-2.5 pr-3.5 py-2 text-xs font-semibold text-foreground shadow-2xl backdrop-blur-3xl hover:border-primary/50 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group ring-1 ring-black/5 dark:ring-white/5"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-medium">پشتیبانی آنلاین VAICH</span>
          <div className="h-6 w-6 shrink-0 rounded-full overflow-hidden ring-1 ring-cyan-400/60 dark:ring-purple-500/60 bg-slate-950 shadow-xs">
            <picture>
              <source srcSet="/images/ai-support-avatar.webp" type="image/webp" />
              <img
                src="/images/ai-support-avatar.png"
                alt="پشتیبان VAICH"
                width={24}
                height={24}
                decoding="async"
                className="h-full w-full object-cover"
              />
            </picture>
          </div>
        </button>
      ) : (
        <div
          className={`w-[calc(100vw-24px)] xs:w-[380px] sm:w-[415px] h-[min(520px,calc(100dvh-5.5rem))] max-h-[calc(100dvh-5.5rem)] rounded-3xl border border-white/20 dark:border-white/10 bg-background/85 dark:bg-[#0b0f19]/90 backdrop-blur-3xl shadow-[0_25px_70px_rgba(0,0,0,0.25)] dark:shadow-[0_25px_80px_rgba(0,0,0,0.8)] ring-1 ring-black/5 dark:ring-white/5 flex flex-col overflow-hidden text-foreground ${
            isClosing
              ? "animate-vaich-chat-out pointer-events-none"
              : "animate-vaich-chat-in"
          }`}
        >
          {/* هدر مینیمال، لوکس، شیشه‌ای و هماهنگ با تم */}
          <div className="flex items-center justify-between border-b border-border/40 dark:border-white/10 bg-secondary/35 dark:bg-white/[0.03] backdrop-blur-md px-4 py-3.5">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 shrink-0 rounded-full ring-2 ring-cyan-400/60 dark:ring-purple-500/60 shadow-[0_0_16px_-4px_rgba(34,211,238,0.5)] bg-slate-950">
                <picture>
                  <source srcSet="/images/ai-support-avatar.webp" type="image/webp" />
                  <img
                    src="/images/ai-support-avatar.png"
                    alt="پشتیبانی هوشمند VAICH"
                    width={40}
                    height={40}
                    decoding="async"
                    className="h-full w-full rounded-full object-cover"
                  />
                </picture>
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 ring-2 ring-background dark:ring-[#0b0f19]"></span>
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs sm:text-sm font-bold text-foreground">
                    پشتیبانی هوشمند VAICH
                  </span>
                </div>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  آنلاین • پاسخگویی آنی ۲۴ ساعته
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleClearHistory}
                title="شروع مجدد گفت‌وگو"
                className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-secondary/70 hover:text-foreground transition-all duration-150 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                title="کوچک کردن"
                className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-secondary/70 hover:text-foreground transition-all duration-150 cursor-pointer"
              >
                <ChevronDown className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={handleClose}
                title="بستن"
                className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground hover:bg-secondary/70 hover:text-foreground transition-all duration-150 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* محتوای پیام‌ها با انیمیشن فنری و آواتار تلگرامی کنار پیام‌های دستیار */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs sm:text-[13px] scroll-smooth">
            {messages.map((m, mIdx) => {
              const isUser = m.role === "user";
              const nextMsg = messages[mIdx + 1];
              const isLastInBotGroup = !isUser && (!nextMsg || nextMsg.role !== "model");

              return (
                <div
                  key={m.id}
                  className={`animate-vaich-msg flex flex-col ${
                    isUser ? "items-end" : "items-start"
                  }`}
                >
                  {isUser ? (
                    <div className="max-w-[85%] rounded-2xl rounded-br-xs bg-primary px-4 py-2.5 text-primary-foreground font-medium self-end shadow-sm shadow-primary/20 transition-all leading-relaxed">
                      {renderMessageContent(m.text)}
                    </div>
                  ) : (
                    <div className="flex items-end gap-2 max-w-[92%] self-start">
                      <div className="w-7 shrink-0">
                        {isLastInBotGroup && (
                          <div className="h-7 w-7 rounded-full overflow-hidden ring-1 ring-cyan-400/50 dark:ring-purple-400/50 shadow-xs bg-slate-950">
                            <picture>
                              <source srcSet="/images/ai-support-avatar.webp" type="image/webp" />
                              <img
                                src="/images/ai-support-avatar.png"
                                alt="آواتار دستیار VAICH"
                                width={28}
                                height={28}
                                loading="lazy"
                                decoding="async"
                                className="h-full w-full object-cover"
                              />
                            </picture>
                          </div>
                        )}
                      </div>
                      <div className="rounded-2xl rounded-bl-xs bg-secondary/70 dark:bg-white/[0.06] text-foreground border border-border/50 dark:border-white/10 backdrop-blur-md px-4 py-2.5 shadow-2xs transition-all leading-relaxed">
                        {renderMessageContent(m.text)}
                      </div>
                    </div>
                  )}
                  <span className={`text-[9px] text-muted-foreground/60 mt-1 ${isUser ? "px-1" : "pr-9 pl-1"}`}>
                    {new Date(m.timestamp).toLocaleTimeString("fa-IR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              );
            })}

            {loading && (
              <div className="animate-vaich-msg flex items-end gap-2 self-start max-w-[92%]">
                <div className="h-7 w-7 shrink-0 rounded-full overflow-hidden ring-1 ring-cyan-400/50 dark:ring-purple-400/50 shadow-xs bg-slate-950">
                  <picture>
                    <source srcSet="/images/ai-support-avatar.webp" type="image/webp" />
                    <img
                      src="/images/ai-support-avatar.png"
                      alt="آواتار دستیار VAICH"
                      width={28}
                      height={28}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover"
                    />
                  </picture>
                </div>
                <div className="flex items-center gap-2 rounded-2xl rounded-bl-xs border border-border/50 dark:border-white/10 bg-secondary/60 dark:bg-white/[0.05] backdrop-blur-md px-4 py-2 text-xs text-muted-foreground shadow-2xs">
                  <Sparkles className="h-3.5 w-3.5 text-primary animate-spin" />
                  <span className="font-medium">دستیار در حال تنظیم پاسخ...</span>
                  <span className="flex gap-1 mr-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.15s]"></span>
                    <span className="h-1.5 w-1.5 rounded-full bg-primary animate-bounce [animation-delay:0.3s]"></span>
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* پیشنهادات سریع برای پاسخ آنی با فیلتر شیشه‌ای */}
          <div className="px-3 py-2 border-t border-border/30 dark:border-white/5 bg-background/50 dark:bg-white/[0.02] backdrop-blur-md flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {QUICK_PROMPTS.map((prompt, pIdx) => (
              <button
                key={pIdx}
                type="button"
                disabled={loading}
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap rounded-full border border-border/70 dark:border-white/10 bg-secondary/40 dark:bg-white/[0.04] hover:bg-primary/10 hover:border-primary/50 hover:text-primary px-3 py-1.5 text-[11px] font-medium text-muted-foreground transition-all duration-200 cursor-pointer disabled:opacity-50 hover:-translate-y-0.5 active:scale-95 shrink-0 shadow-2xs backdrop-blur-xs"
              >
                <ArrowDownLeft className="h-2.5 w-2.5 inline ml-1 opacity-70 text-primary" />
                {prompt}
              </button>
            ))}
          </div>

          {/* فرم ارسال پیام تمیز، سریع، شیشه‌ای و مینیمال */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 p-3 border-t border-border/40 dark:border-white/10 bg-secondary/20 dark:bg-black/20 backdrop-blur-md"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="پیام یا سوال خود را بنویسید..."
              disabled={loading}
              className="flex-1 rounded-2xl border border-border/70 dark:border-white/10 bg-background/80 dark:bg-black/40 backdrop-blur-md text-foreground px-4 py-2.5 text-xs outline-none placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              title="ارسال پیام"
              className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-primary text-primary-foreground transition-all duration-200 hover:opacity-95 hover:scale-105 active:scale-95 disabled:opacity-30 disabled:pointer-events-none cursor-pointer shadow-md shadow-primary/25"
            >
              <Send className="h-4 w-4 rotate-180" />
            </button>
          </form>
        </div>
      )}
    </div>,
    document.body
  );
}
