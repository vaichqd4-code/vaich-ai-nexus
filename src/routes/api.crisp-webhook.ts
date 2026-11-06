import { createFileRoute } from "@tanstack/react-router";
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORY_ROWS } from "@/lib/products";

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

// لیست مدل‌های پرسرعت هوش مصنوعی گوگل با مکانیزم Fallback خودکار
const GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite",
];

/**
 * تولید خودکار و زنده دانش‌پایه و کاتالوگ محصولات بر اساس دیتای روز سایت
 * هر محصول، قیمت، دسته‌بندی یا ویژگی جدیدی که به سایت اضافه شود بلافاصله برای هوش مصنوعی در دسترس است.
 */
function getLiveSiteCatalogContext(): string {
  try {
    const categories = DEFAULT_CATEGORY_ROWS.map(
      (c) => `• دسته‌بندی: ${c.title} (${c.subtitle || ""})`,
    ).join("\n");

    const productsInfo = DEFAULT_PRODUCTS.map((p) => {
      const priceFormatted =
        new Intl.NumberFormat("fa-IR").format(p.price) + " تومان";
      const features = (p.features || []).slice(0, 5).join(" | ");
      return `🔹 نام محصول: ${p.name}
  - اسلاگ صفحه: ${p.slug}
  - لینک خرید در سایت: https://vaich.ir/products/${p.slug}
  - قیمت فعلی: ${priceFormatted} (${p.duration || "دسترسی دائمی"})
  - نوع لایسنس: ${p.isLifetime ? "دائمی و مادام‌العمر (بدون نیاز به شارژ ماهانه)" : "اشتراک قانونی اختصاصی"}
  - خلاصه معرفی: ${p.description}
  - مشخصات کلیدی: ${features}`;
    }).join("\n\n");

    return `اطلاعات و کاتالوگ زنده وب‌سایت VAICH.ir:\n${categories}\n\n${productsInfo}`;
  } catch {
    return "";
  }
}

/**
 * تولید پرامپت سیستمی غنی با در نظر گرفتن زمینه گفتگو و مشخصات کاربر
 */
function buildSystemPrompt(visitorName?: string): string {
  const catalog = getLiveSiteCatalogContext();
  const nameDirective = visitorName
    ? `نام مخاطب در این گفت‌وگو: «${visitorName}» است. می‌توانید در پاسخ‌ها با صمیمیت و احترام ایشان را با نام صدا بزنید (مثلاً: ${visitorName} عزیز/گرامی).`
    : `نام مخاطب مشخص نیست؛ با احترام و صمیمیت عمومی (دوست گرامی، کاربر عزیز) صحبت کنید.`;

  return `شما «دستیار هوشمند و رسمی پشتیبانی فروشگاه اینترنتی VAICH» (به مدیریت جناب آقای یونس حیاتی) هستید.
ماموریت شما: پاسخگویی سریع، کامل، بسیار محترمانه، صمیمانه و حرفه‌ای به مشتریان، رفع هرگونه ابهام درباره سایت و محصولات، و راهنمایی برای خرید بهترین گزینه‌ها.
زبان پاسخ‌دهی: کاملاً فارسی روان، شایسته، جذاب و خوانا با نگارش زیبا و ایموجی‌های مناسب.

${nameDirective}

قوانین حیاتی و اختصاصی مدیریت VAICH (بسیار مهم):
۱. پاسخگویی کامل و بدون قطعی: هرگز پاسخ خود را نصفه یا ناتمام رها نکنید؛ تمام جملات و توضیحات را با نتیجه‌گیری شفاف و ساختاریافته به پایان برسانید.
۲. آگاهی از تاریخچه چت: شما تمام پیام‌های ردوبدل شده قبلی در همین مکالمه را به یاد دارید. همیشه به پیام‌های قبلی کاربر توجه کنید تا گفت‌وگو پیوسته و هوشمندانه باشد.
۳. روال و مراحل پرداخت و ارسال فیش واریزی (رسید خرید):
   اگر مشتری درباره نحوه خرید، پرداخت یا ارسال رسید سوال پرسید، مراحل زیر را با دقت به او توضیح دهید:
   - گام اول: در سایت https://vaich.ir محصول مورد نظر را انتخاب کرده و دکمه خرید/تسویه‌حساب را بزنید.
   - گام دوم: پس از ثبت مشخصات، روی دکمه «ارسال رسید در ربات» کلیک کنید تا سفارش شما شناسایی شود و به ربات تلگرام متصل شوید.
   - گام سوم: در ربات تلگرامی سفارشات، ابتدا اطلاعات کامل سفارش نمایش داده و شناسایی می‌شود.
   - گام چهارم: سپس تصویر رسید پرداخت (فیش واریزی) را داخل همان ربات ارسال کنید.
   - گام پنجم: سفارش بلافاصله توسط مدیریت تایید و اکانت یا فایل محصول تحویل داده می‌شود.
۴. اطلاعات ارتباطی مستقیم با مدیریت و ساعات تماس:
   - مدیریت مجموعه: جناب آقای یونس حیاتی
   - ارتباط مستقیم و ۲۴ ساعته در تلگرام: @youneshayati (لینک مستقیم: https://t.me/youneshayati)
   - شماره تماس مستقیم: 09193872172
   - ساعات مجاز برای تماس تلفنی: دقیقاً از ساعت ۱۴:۰۰ الی ۲۲:۰۰ (ساعت ۲ بعدازظهر تا ۱۰ شب). در خارج از این بازه زمانی، مشتری را با احترام به ارسال پیام در تلگرام @youneshayati هدایت کنید تا سریعاً پاسخ داده شود.
۵. سوالات خارج از کاتالوگ یا نیاز به هماهنگی خاص:
   اگر مشتری سوالی پرسید که نیاز به بررسی دستی داشت یا درخواست سفارشی داشت، با احترام او را به تلگرام مدیریت (@youneshayati) ارجاع دهید.

کاتالوگ زنده و لحظه‌ای وبسایت VAICH.ir:
${catalog}`;
}

/**
 * دریافت تاریخچه پیام‌های اخیر همین جلسه از API کریسپ
 */
async function fetchConversationHistory({
  websiteId,
  sessionId,
  identifier,
  key,
}: {
  websiteId: string;
  sessionId: string;
  identifier: string;
  key: string;
}): Promise<{
  history: Array<{ role: "user" | "model"; text: string }>;
  visitorName?: string;
}> {
  try {
    const url = `https://api.crisp.chat/v1/website/${websiteId}/conversation/${sessionId}/messages`;
    const basicAuth = Buffer.from(`${identifier}:${key}`).toString("base64");

    for (const tier of ["website", "plugin"]) {
      try {
        const res = await fetch(url, {
          headers: {
            Authorization: `Basic ${basicAuth}`,
            "X-Crisp-Tier": tier,
          },
        });

        if (res.ok) {
          const json = (await res.json()) as {
            data?: Array<{
              from?: string;
              type?: string;
              content?: string;
              user?: { nickname?: string };
            }>;
          };

          const msgs = json.data || [];
          let visitorName: string | undefined;

          // استخراج نام کاربر در صورت ثبت در پروفایل یا چت
          for (let i = msgs.length - 1; i >= 0; i--) {
            const nick = msgs[i].user?.nickname?.trim();
            if (
              nick &&
              !nick.toLowerCase().startsWith("visitor") &&
              nick.toLowerCase() !== "vaich" &&
              nick.toLowerCase() !== "operator"
            ) {
              visitorName = nick;
              break;
            }
          }

          // استخراج ۱۰ پیام آخر جهت حفظ زمینه مکالمه (Multi-turn Memory)
          const historySlice = msgs.slice(-10);
          const history: Array<{ role: "user" | "model"; text: string }> = [];

          for (const m of historySlice) {
            if (m.type === "text" && m.content && typeof m.content === "string") {
              const role = m.from === "operator" ? "model" : "user";
              const text = m.content.trim();
              if (text) {
                history.push({ role, text });
              }
            }
          }

          return { history, visitorName };
        }
      } catch (err) {
        console.warn(`[Crisp History] Tier ${tier} error:`, err);
      }
    }
  } catch (e) {
    console.warn("[Crisp History] Fetch exception:", e);
  }

  return { history: [] };
}

/**
 * تبدیل تاریخچه پیام‌ها به ساختار استاندارد Gemini API و حذف نوبت‌های تکراری متوالی
 */
function buildGeminiContents(
  history: Array<{ role: "user" | "model"; text: string }>,
  currentMessage: string,
): Array<{ role: "user" | "model"; parts: [{ text: string }] }> {
  const turns = [...history];
  const last = turns[turns.length - 1];

  // اضافه کردن پیام جدید در صورتی که در انتهای تاریخچه ثبت نشده باشد
  if (!last || last.role !== "user" || last.text !== currentMessage) {
    turns.push({ role: "user", text: currentMessage });
  }

  const merged: Array<{ role: "user" | "model"; parts: [{ text: string }] }> = [];
  for (const t of turns) {
    if (merged.length > 0 && merged[merged.length - 1].role === t.role) {
      merged[merged.length - 1].parts[0].text += `\n${t.text}`;
    } else {
      merged.push({
        role: t.role,
        parts: [{ text: t.text }],
      });
    }
  }

  // تضمین اینکه نوبت اول حتماً user باشد
  while (merged.length > 0 && merged[0].role !== "user") {
    merged.shift();
  }

  return merged.length > 0
    ? merged
    : [{ role: "user", parts: [{ text: currentMessage }] }];
}

/**
 * ارسال پیام به API مدل‌های Gemini با پشتیبانی از مکالمه چند مرحله‌ای و توکن خروجی بالا
 */
async function generateAiReply({
  contents,
  systemPrompt,
  apiKey,
}: {
  contents: Array<{ role: "user" | "model"; parts: [{ text: string }] }>;
  systemPrompt: string;
  apiKey: string;
}): Promise<string | null> {
  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2500, // سقف توکن بالا برای جلوگیری قطعی از نصفه ماندن پیام‌ها
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
        console.warn(`[Gemini API] ${model} returned ${response.status}: ${errorText.slice(0, 100)}`);
      }
    } catch (err) {
      console.warn(`[Gemini API] Exception with ${model}:`, err);
    }
  }

  return null;
}

/**
 * ارسال پاسخ نهایی به گفتگوی کاربر در Crisp
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

// کش سروری برای جلوگیری از پاسخ‌های تکراری به یک پیام
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
      GET: async () => {
        return Response.json({
          status: "active",
          service: "VAICH Crisp Multi-Turn AI Support Bot",
          engine: "Google AI Studio (Gemini 3.5/3.8 Flash)",
          documentation: "Send Crisp POST Webhook events (message:send)",
        });
      },

      POST: async ({ request }) => {
        try {
          const url = new URL(request.url);

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
              text?: string;
            };
          };

          const data = body?.data || (body as any);
          const websiteId =
            body?.website_id ||
            data?.website_id ||
            "7751150b-b8d0-4953-8745-021b7d8a730c";

          // ۱. فیلتر ضد لوپ: نادیده گرفتن پیام‌های خود اپراتور یا بات
          if (data?.from === "operator" || data?.from === "bot") {
            return Response.json({
              ok: true,
              ignored: true,
              reason: "Sender is operator or bot (loop prevention)",
            });
          }

          // ۲. فیلتر محتوای متنی
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

          // ۳. فیلتر پیام تکراری (Deduplication)
          if (isAlreadyHandled(sessionId, userText)) {
            return Response.json({
              ok: true,
              ignored: true,
              reason: "Message already handled recently",
            });
          }

          if (!crispIdentifier || !crispKey) {
            return Response.json(
              { ok: false, error: "Crisp credentials missing" },
              { status: 400 },
            );
          }

          // ۴. دریافت تاریخچه کامل این چت برای ایجاد حافظه مکالمه (Multi-turn Memory)
          const { history, visitorName } = await fetchConversationHistory({
            websiteId,
            sessionId,
            identifier: crispIdentifier,
            key: crispKey,
          });

          // ۵. ساخت پیام‌های چند نوبته و پرامپت اختصاصی با دانش زنده محصولات
          const contents = buildGeminiContents(history, userText);
          const systemPrompt = buildSystemPrompt(visitorName);

          // ۶. فراخوانی مدل جمینای با حافظه مکالمه و سقف توکن بالا (بدون نصفه ماندن)
          const aiResponse = await generateAiReply({
            contents,
            systemPrompt,
            apiKey: geminiApiKey,
          });

          if (!aiResponse) {
            return Response.json(
              { ok: false, error: "Failed to generate AI response from Gemini" },
              { status: 502 },
            );
          }

          // ۷. ارسال پاسخ هوشمند به چت کریسپ
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
            visitorName: visitorName || null,
            turnsCount: contents.length,
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
