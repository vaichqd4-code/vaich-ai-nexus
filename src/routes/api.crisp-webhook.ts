import { createFileRoute } from "@tanstack/react-router";

function decodeSecret(b64: string): string {
  try {
    return Buffer.from(b64, "base64").toString("utf-8");
  } catch {
    return "";
  }
}

// کلیدهای پیش‌فرض کریسپ و گوگل استودیو ارائه شده توسط مالک وبسایت VAICH
const DEFAULT_GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  decodeSecret("QVEuQWI4Uk42S0Zyb1lOZVFLQ3Z2RmhDQTd2ZmR5eWxjYmNaM1RuY09ZUG1VSGNXdElpVGc=");

const DEFAULT_CRISP_IDENTIFIER =
  process.env.CRISP_IDENTIFIER ||
  process.env.CRISP_PLUGIN_IDENTIFIER ||
  decodeSecret("ZjYyMjAzZDktNTVmMy00Yzc2LWEzYTktNGViZmVlNDcyMWIy");

const DEFAULT_CRISP_KEY =
  process.env.CRISP_KEY ||
  process.env.CRISP_PLUGIN_KEY ||
  decodeSecret("OTI4Y2Q2NDVlN2M5MDMzYWZlOTRlYTQ3YTJkMDU4NDk1NWUyZTIzMzc3NjkyNzZjNjgwYTExNTg3MTNjODAxYQ==");

// لیست مدل‌های پرسرعت و پایدار هوش مصنوعی گوگل به همراه مکانیسم Fallback
const GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
];

// دستورالعمل و دانش‌پایه رسمی ربات پشتیبان VAICH
const SYSTEM_INSTRUCTION = `شما «دستیار هوشمند و رسمی پشتیبانی فروشگاه اینترنتی VAICH» (به مدیریت جناب آقای یونس حیاتی) هستید.
ماموریت شما: پاسخگویی سریع، بسیار مودبانه، صمیمانه، معتبر و حرفه‌ای به مشتریان، رفع ابهام‌ها و راهنمایی برای خرید بهترین محصولات دیجیتال و اشتراک‌های قانونی سایت VAICH.ir.
زبان پاسخ‌دهی: کاملاً فارسی روان، شایسته، جذاب و خوانا همراه با ایموجی‌های متناسب.

محصولات کلیدی فروشگاه اینترنتی VAICH (https://vaich.ir):
۱. پلنر دیجیتال جامع و هوشمند زندگی و مالی VAICH (اکسل و گوگل شیتس):
   - طراحی مدرن و چشم‌نواز سه‌بعدی (3D Visuals) با تم‌های تاریک نئونی و پاستلی.
   - برنامه‌نویسی و اتوماسیون پیشرفته با Google Apps Script.
   - سازگاری ۱۰۰٪ هم‌زمان با گوشی‌های آیفون (iOS)، اندروید، تبلت و کامپیوتر بدون نیاز به ابزار جانبی؛ تنها با اپلیکیشن رایگان Google Sheets یا نرم‌افزار Excel.
   - امکانات: داشبورد اهداف، مدیریت مالی و هزینه‌ها، چک‌لیست عادات روزانه، تقویم هوشمند، تحلیل آماری.
   - مزایا: دسترسی مادام‌العمر، آپدیت‌های دائمی رایگان، به همراه فایل‌های راهنما و ویدئوی آموزشی صفر تا صد فارسی.

۲. اشتراک‌های رسمی و قانونی هوش مصنوعی (۱۰۰٪ قانونی، پایدار، بدون قطعی و با ضمانت تعویض):
   - Google Gemini Pro: پلن‌های اختصاصی ۱۸ ماهه طلایی و ۶۰ روزه با پشتیبانی از مدل‌های جدید هوش مصنوعی و Project Astra.
   - OpenAI ChatGPT Plus: اکانت قانونی بدون قطعی و بدون لیمیت آزاردهنده، دسترسی به GPT-4o، مدل‌های استدلالی o1 و o3، پیش‌نمایش GPT-6 Astra، بوم کاری Canvas، ابزار تحلیلی Prism و قابلیت تولید ویدیوی Sora.
   - Anthropic Claude Pro: اکانت اختصاصی و پایدار با دسترسی کامل به Claude 3.5 Sonnet، مدل پرچمدار Sonnet 3.7، آینده‌نگر Sonnet 5.5، حالت تفکر انطباقی Adaptive Thinking، محیط Artifacts 2.0 و ابزار Claude Code CLI.

راه‌های ارتباط با مدیریت و پشتیبانی مستقیم انسانی:
در صورتی که مشتری سوالی خارج از دامنه فوق داشت، درخواست سفارش اختصاصی داشت، مشکلی در پرداخت داشت، یا خواستار صحبت مستقیم با پشتیبانی انسانی بود:
- مدیریت: یونس حیاتی
- شماره تماس / پیام‌رسان: 09193872172
- ارتباط مستقیم در تلگرام: @youneshayati (لینک: https://t.me/youneshayati)
- وبسایت رسمی: https://vaich.ir

قوانین حیاتی در پاسخگویی:
۱. پاسخ‌ها را خلاصه، مفید، ساختاریافته و با لحن محترمانه بنویسید (حداکثر ۲ تا ۳ بند کوتاه).
۲. در انتهای پاسخ، مشتری را با یک جمله ترغیب‌کننده برای مشاهده جزئیات در سایت https://vaich.ir یا ارتباط در تلگرام راهنمایی کنید.
۳. در صورت سوال درباره خرید یا قیمت، بفرمایید تمامی قیمت‌های به‌روز و تخفیف‌ها مستقیماً در سایت https://vaich.ir قابل مشاهده و خرید آنلاین و تحویل فوری هستند.`;

/**
 * ارسال پیام به API مدل‌های مختلف Gemini با مکانیسم تلاش مجدد
 */
async function generateAiReply(
  userText: string,
  apiKey: string,
): Promise<string | null> {
  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_INSTRUCTION }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: userText }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600,
          },
        }),
      });

      if (response.ok) {
        const data = (await response.json()) as {
          candidates?: Array<{
            content?: {
              parts?: Array<{ text?: string }>;
            };
          }>;
        };
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) {
          return text;
        }
      } else {
        const errorText = await response.text();
        console.warn(`[Gemini API] Model ${model} returned ${response.status}: ${errorText.slice(0, 100)}`);
      }
    } catch (err) {
      console.warn(`[Gemini API] Exception with ${model}:`, err);
    }
  }

  return null;
}

/**
 * ارسال پاسخ به وب‌سایت Crisp از طریق Crisp REST API
 */
async function sendCrispMessage({
  websiteId,
  sessionId,
  content,
  identifier,
  key,
}: {
  websiteId: string;
  sessionId: string;
  content: string;
  identifier: string;
  key: string;
}): Promise<boolean> {
  const url = `https://api.crisp.chat/v1/website/${websiteId}/conversation/${sessionId}/message`;
  const basicAuth = Buffer.from(`${identifier}:${key}`).toString("base64");

  // پشتیبانی هم‌زمان از Website Tier (توکن‌های مستقیم سایت) و Plugin Tier
  for (const tier of ["website", "plugin"]) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Crisp-Tier": tier,
          Authorization: `Basic ${basicAuth}`,
        },
        body: JSON.stringify({
          type: "text",
          from: "operator",
          origin: "chat",
          content,
        }),
      });

      if (response.ok) {
        return true;
      }

      const errBody = await response.text();
      console.warn(`[Crisp API] Tier ${tier} failed [${response.status}]: ${errBody.slice(0, 100)}`);
    } catch (err) {
      console.warn(`[Crisp API] Tier ${tier} network error:`, err);
    }
  }

  return false;
}

// کش سروری برای جلوگیری از پاسخ تکراری به پیام‌های هم‌زمان (Deduplication)
const recentProcessed = new Map<string, number>();

function isAlreadyHandled(sessionId: string, text: string): boolean {
  const key = `${sessionId}:${text.trim().toLowerCase()}`;
  const now = Date.now();
  const prev = recentProcessed.get(key);
  if (prev && now - prev < 45000) {
    return true;
  }
  recentProcessed.set(key, now);
  if (recentProcessed.size > 500) {
    for (const [k, t] of recentProcessed.entries()) {
      if (now - t > 60000) recentProcessed.delete(k);
    }
  }
  return false;
}

export const Route = createFileRoute("/api/crisp-webhook")({
  server: {
    handlers: {
      // پشتیبانی از GET برای تست سلامت و صحت روت در مرورگر
      GET: async () => {
        return Response.json({
          status: "active",
          service: "VAICH Crisp AI Support Bot",
          engine: "Google AI Studio (Gemini Flash)",
          documentation: "Send Crisp POST Webhook events (message:send)",
        });
      },

      POST: async ({ request }) => {
        try {
          const url = new URL(request.url);

          // توکن‌های کریسپ می‌توانند از محیط یا پارامترهای URL یا مقادیر پیش‌فرض ذخیره‌شده خوانده شوند
          const crispIdentifier =
            url.searchParams.get("id") ||
            url.searchParams.get("crisp_id") ||
            DEFAULT_CRISP_IDENTIFIER;

          const crispKey =
            url.searchParams.get("key") ||
            url.searchParams.get("crisp_key") ||
            DEFAULT_CRISP_KEY;

          const geminiApiKey =
            url.searchParams.get("gemini_key") ||
            DEFAULT_GEMINI_API_KEY;

          const body = (await request.json()) as {
            event?: string;
            website_id?: string;
            data?: {
              session_id?: string;
              website_id?: string;
              type?: string;
              from?: string;
              content?: string;
            };
          };

          const event = body?.event;
          const data = body?.data || (body as any);
          const websiteId =
            body?.website_id ||
            data?.website_id ||
            "7751150b-b8d0-4953-8745-021b7d8a730c";

          // ۱. فیلتر امنیتی و حیاتی ضد لوپ بی‌نهایت:
          // اگر پیام توسط اپراتور یا ربات ارسال شده باشد، فوراً آن را نادیده می‌گیریم
          if (data?.from === "operator" || data?.from === "bot") {
            return Response.json({
              ok: true,
              ignored: true,
              reason: "Sender is operator or bot (loop prevention)",
            });
          }

          // ۲. فیلتر نوع پیام: تنها پیام‌های متنی پردازش می‌شوند
          const rawContent = data?.content ?? data?.text ?? "";
          if (typeof rawContent !== "string" || !rawContent.trim()) {
            return Response.json({
              ok: true,
              ignored: true,
              reason: "Not a valid text message",
            });
          }

          const userText = rawContent.trim();
          const sessionId = data?.session_id;

          if (!sessionId) {
            return Response.json({
              ok: true,
              ignored: true,
              reason: "Missing session_id",
            });
          }

          // ۳. فیلتر عدم ارسال پاسخ تکراری (Deduplication)
          if (isAlreadyHandled(sessionId, userText)) {
            return Response.json({
              ok: true,
              ignored: true,
              reason: "Message already handled recently",
            });
          }

          // ۳. اگر مشخصات Crisp Plugin در دسترس نباشد، پاسخ به لاگ هدایت می‌شود
          if (!crispIdentifier || !crispKey) {
            console.warn(
              "[Crisp Webhook] Missing Crisp Plugin Identifier or Key. Set CRISP_IDENTIFIER and CRISP_KEY or pass ?id=...&key=...",
            );
            return Response.json(
              {
                ok: false,
                error:
                  "Crisp credentials missing. Please configure CRISP_IDENTIFIER and CRISP_KEY in environment or append ?id=YOUR_ID&key=YOUR_KEY to the Webhook URL.",
              },
              { status: 400 },
            );
          }

          // ۴. فراخوانی مدل جمینای با دانش‌نامه اختصاصی VAICH
          const aiResponse = await generateAiReply(userText, geminiApiKey);

          if (!aiResponse) {
            return Response.json(
              { ok: false, error: "Failed to generate AI response from Gemini" },
              { status: 502 },
            );
          }

          // ۵. ارسال پاسخ تولیدشده به گفتگوی کاربر در Crisp
          const sent = await sendCrispMessage({
            websiteId,
            sessionId,
            content: aiResponse,
            identifier: crispIdentifier,
            key: crispKey,
          });

          return Response.json({
            ok: true,
            sent,
            model: "gemini-flash",
          });
        } catch (error) {
          console.error("[Crisp Webhook Error]:", error);
          return Response.json(
            { ok: false, error: "Internal server error" },
            { status: 500 },
          );
        }
      },
    },
  },
});
