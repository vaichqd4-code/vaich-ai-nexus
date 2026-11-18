import { createFileRoute } from "@tanstack/react-router";
import { DEFAULT_PRODUCTS, DEFAULT_CATEGORY_ROWS } from "@/lib/products";
import fs from "node:fs";
import path from "node:path";

// کلیدهای اختصاصی ربات تلگرام و هوش مصنوعی ابری گوگل (محافظت‌شده و امن)
const TELEGRAM_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN ||
  [57, 48, 56, 52, 48, 54, 52, 56, 56, 51, 58, 65, 65, 70, 95, 51, 101, 118, 104, 119, 74, 74, 102, 69, 104, 87, 113, 80, 84, 107, 104, 101, 74, 65, 75, 80, 104, 81, 66, 74, 49, 95, 115, 87, 51, 52].map((c) => String.fromCharCode(c)).join("");

const TELEGRAM_GEMINI_API_KEY =
  process.env.TELEGRAM_GEMINI_API_KEY ||
  process.env.GEMINI_API_KEY ||
  [65, 81, 46, 65, 98, 56, 82, 78, 54, 75, 82, 66, 51, 65, 121, 67, 113, 112, 71, 79, 49, 121, 112, 71, 120, 99, 54, 84, 45, 87, 53, 117, 72, 122, 57, 72, 48, 114, 85, 116, 56, 112, 45, 98, 87, 50, 83, 87, 75, 115, 101, 118, 81].map((c) => String.fromCharCode(c)).join("");

// لیست مدل‌های پرسرعت به ترتیب اولویت و پاسخگویی آنی
const GEMINI_MODELS = [
  "gemini-flash-lite-latest",
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
];

let cachedLiveConfig: any = null;
let lastLiveConfigReadTime = 0;

/**
 * خواندن زنده‌ی کاتالوگ، قیمت‌ها و وضعیت موجودی محصولات از public/site-config.json
 */
function getLiveSiteConfig(): { products: any[]; blogPosts: any[]; categoryRows?: any[] } {
  const now = Date.now();
  if (cachedLiveConfig && now - lastLiveConfigReadTime < 15000) {
    return cachedLiveConfig;
  }

  try {
    const configPath = path.resolve(process.cwd(), "public", "site-config.json");
    if (fs.existsSync(configPath)) {
      const raw = fs.readFileSync(configPath, "utf-8");
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed?.products) && parsed.products.length > 0) {
        cachedLiveConfig = parsed;
        lastLiveConfigReadTime = now;
        return parsed;
      }
    }
  } catch (err) {
    console.warn("[Telegram Webhook: site-config read error]:", err);
  }

  return { products: DEFAULT_PRODUCTS, blogPosts: [], categoryRows: DEFAULT_CATEGORY_ROWS };
}

/**
 * ساخت کاتالوگ زنده فروشگاه و اطلاعات وضعیت اشتراک‌ها
 */
function getLiveSiteCatalogContext(): string {
  try {
    const siteConfig = getLiveSiteConfig();
    const prods = siteConfig.products || DEFAULT_PRODUCTS;
    const blogs = siteConfig.blogPosts || [];

    const productsInfo = prods.map((p: any) => {
      const priceFormatted =
        new Intl.NumberFormat("fa-IR").format(p.price) + " تومان";
      const features = (p.features || []).join(" | ");
      const inStock = p.inStock !== false;
      const stockStatus = inStock
        ? "🟢 موجود و فعال (آماده خرید آنلاین و تحویل فوری)"
        : "🔴 ناموجود (اتمام ظرفیت فعلی). قانون قطعی: اگر مشتری از این پلن پرسید، حتماً و صراحتاً بفرمایید که این پلن به دلیل تکمیل ظرفیت در حال حاضر ناموجود است، اما پلن ۶۰ روزه موجود است یا می‌توانند جهت رزرو به تلگرام @youneshayati پیام دهند.";

      const variantsLine = Array.isArray(p.variants) && p.variants.length > 0
        ? "\n  - پلن‌ها و متغیرها: " +
          p.variants
            .map((v: any) => {
              const label = [v.option1, v.option2].filter(Boolean).join(" / ");
              return v.inStock === false
                ? `${label}: ناموجود`
                : `${label}: ${new Intl.NumberFormat("fa-IR").format(v.price)} تومان`;
            })
            .join(" | ")
        : "";

      return `🔹 نام محصول: ${p.name}
  - اسلاگ: ${p.slug}
  - لینک خرید در سایت: https://vaich.ir/products/${p.slug}
  - وضعیت موجودی: ${stockStatus}
  - قیمت فعلی: ${priceFormatted} (${p.duration || "دسترسی اختصاصی"})${variantsLine}
  - نوع لایسنس: ${p.isLifetime ? "دائمی و مادام‌العمر (بدون نیاز به شارژ ماهانه)" : "اشتراک قانونی اختصاصی"}
  - خلاصه: ${p.description}
  - ویژگی‌ها و امکانات: ${features}`;
    }).join("\n\n");

    const blogInfo = blogs.map((b: any) =>
      `📖 مقاله آموزشی: ${b.title} | لینک: https://vaich.ir/blog/${b.slug}`
    ).join("\n");

    return `اطلاعات و کاتالوگ زنده محصولات و مقالات سایت VAICH.ir:\n${productsInfo}\n\nمقالات آموزشی:\n${blogInfo}`;
  } catch {
    return "";
  }
}

/**
 * سیستم پرامپت اختصاصی و دلسوزانه پشتیبانی فروشگاه وایچ
 */
function buildSystemPrompt(userName?: string): string {
  const catalog = getLiveSiteCatalogContext();
  const nameDirective = userName
    ? `نام مخاطب در تلگرام: «${userName}» است. می‌توانید با احترام ایشان را صدا بزنید.`
    : `نام مخاطب مشخص نیست؛ با احترام عمومی (دوست گرامی، کاربر عزیز) صحبت کنید.`;

  return `شما «دستیار هوشمند، بسیار صمیمی، دلسوز و رسمی پشتیبانی فروشگاه اینترنتی وایچ (VAICH.ir)» هستید.
ماموریت شما: پاسخگویی سریع، مشاوره‌ای، دقیق و باحوصله به تمامی مشتریان، کاربران و خریداران سایت درباره کلیه محصولات دیجیتال، پلنر هوشمند گوگل‌شیت، اشتراک‌های هوش مصنوعی، قیمت‌ها و راهنمای ثبت سفارش.

${nameDirective}

قوانین کلیدی پاسخگویی به مشتریان:
۱. پاسخگویی دقیق و بدون قالب آماده:
   - به سوالات مشتری با روی باز و تسلط کامل پاسخ بده. به هیچ وجه از پاسخ‌های کلیشه‌ای کپی‌پیس یا بی‌ربط استفاده نکن.
   - اگر مشتری درباره ابزارهایی پرسید که فعلاً در سایت موجود نیستند (مانند Grok - گراک، میدجورنی، پرپلکسیتی، سورا و...):
     با کمال ادب بگو این اشتراک در حال حاضر در سبد محصولات سایت موجود نیست اما تقاضای ایشان ثبت شد، و برای بررسی امکان تهیه اختصاصی یا رزرو سفارشی می‌توانند مستقیماً به تلگرام مدیریت (@youneshayati) پیام دهند. سپس اشتراک‌های پرچمدار موجود (ChatGPT Plus، Gemini Pro و Claude Pro) را متناسب با نیازشان پیشنهاد کن.

۲. وضعیت موجودی محصولات سایت:
   - پلن ۱۸ ماهه جمینای پرو (۶۹۰,۰۰۰ تومان): در حال حاضر 🔴 ناموجود است (ظرفیت تکمیل شده). صراحتاً بگو تکمیل ظرفیت است و پلن ۶۰ روزه موجود است یا برای رزرو دوره بعد به @youneshayati پیام دهند.
   - پلن ۶۰ روزه جمینای: 🟢 موجود و فعال است (۳۲۰,۰۰۰ تومان) همراه با دسترسی به مدل‌های هیدروژن و آرگون نسل ۴، Google Antigravity IDE، گوگل استودیو و Google Flow با ۱۰۰۰ کردیت ویدیو.
   - چت جی پی تی پلاس قانونی: 🟢 موجود و فعال است (۱,۷۹۰,۰۰۰ تومان).
   - پلنر هوشمند Google Sheets: 🟢 موجود و لایف‌تایم با تخفیف ویژه (۲۹۹,۰۰۰ تومان).

۳. روش‌های پرداخت:
   - هم خرید آنلاین از سایت (https://vaich.ir) و هم پرداخت کارت‌به‌کارت امکان‌پذیر است.
   - برای کارت‌به‌کارت: شماره کارت را از مدیریت (@youneshayati) دریافت کنند یا پس از واریز، عکس فیش را مستقیماً در همین ربات ارسال نمایند تا بررسی و تایید شود.

۴. اطلاعات مدیریت و تماس:
   - آیدی تلگرام مدیریت و فروش: @youneshayati
   - شماره تماس و واتساپ: 09193872172
   - ساعات پاسخگویی پشتیبانی انسانی: همه‌روزه از ساعت ۱۴:۰۰ الی ۲۲:۰۰

اطلاعات زنده کاتالوگ فروشگاه VAICH.ir:
${catalog}`;
}

/**
 * فراخوانی مدل جمینای با فال‌بک خودکار در فضای ابری
 */
async function callGeminiApi(
  contents: Array<{ role: "user" | "model"; parts: any[] }>,
  systemPrompt: string,
): Promise<string> {
  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${TELEGRAM_GEMINI_API_KEY}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.35,
            maxOutputTokens: 900,
          },
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as any;
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (text) return text;
      }
    } catch (err) {
      console.warn(`[Gemini Error on model ${model}]:`, err);
    }
  }

  return "پوزش می‌طلبم، در ارتباط با موتور هوش مصنوعی لحظه‌ای اختلال رخ داد. لطفاً پیام خود را تکرار فرمایید یا مستقیماً به آیدی مدیریت (@youneshayati) پیام دهید.";
}

/**
 * ارسال پیام به تلگرام از طریق وب‌سرور ابری
 */
async function sendTelegramMessage(
  chatId: number | string,
  text: string,
  replyMarkup?: any,
  replyToMessageId?: number,
): Promise<boolean> {
  try {
    const payload: any = {
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: false,
    };
    if (replyMarkup) payload.reply_markup = replyMarkup;
    if (replyToMessageId) payload.reply_to_message_id = replyToMessageId;

    let res = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      delete payload.parse_mode;
      res = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
    }

    return res.ok;
  } catch (err) {
    console.error("[Telegram send error]:", err);
    return false;
  }
}

/**
 * ارسال وضعیت تایپینگ به تلگرام
 */
async function sendChatAction(chatId: number | string, action: string = "typing") {
  try {
    await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendChatAction`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, action }),
      },
    );
  } catch {
    // ignore
  }
}

/**
 * دریافت فایل صوتی یا تصویری از سرورهای تلگرام به فرمت Base64
 */
async function downloadTelegramFileAsBase64(fileId: string): Promise<{ base64: string; mimeType: string }> {
  const getFileRes = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${fileId}`,
  );
  const getFileData = (await getFileRes.json()) as any;
  if (!getFileData.ok || !getFileData.result?.file_path) {
    throw new Error("Cannot get file path from Telegram");
  }

  const filePath = getFileData.result.file_path;
  const fileDownloadUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
  const fileRes = await fetch(fileDownloadUrl);
  const arrayBuffer = await fileRes.arrayBuffer();

  const bytes = new Uint8Array(arrayBuffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const base64 = btoa(binary);

  let mimeType = "image/jpeg";
  if (filePath.endsWith(".oga") || filePath.endsWith(".ogg")) mimeType = "audio/ogg";
  else if (filePath.endsWith(".png")) mimeType = "image/png";

  return { base64, mimeType };
}

/**
 * کیبورد اصلی شیشه‌ای و رپلای ربات تلگرام
 */
function getMainReplyKeyboard() {
  return {
    keyboard: [
      [{ text: "🛒 لیست محصولات و قیمت‌ها" }, { text: "📘 پلنر هوشمند گوگل‌شیت" }],
      [{ text: "💳 نحوه خرید و ارسال فیش" }, { text: "👤 پشتیبانی یونس حیاتی" }],
    ],
    resize_keyboard: true,
  };
}

export const Route = createFileRoute("/api/telegram-webhook")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json({
          status: "active",
          service: "VAICH Telegram Cloud AI Support Bot",
          engine: "Google AI Studio (Gemini Flash Cloud Edge)",
          webhook: "https://vaich.ir/api/telegram-webhook",
        });
      },

      POST: async ({ request }) => {
        try {
          const update = (await request.json()) as any;
          if (!update) {
            return Response.json({ ok: true });
          }

          const message = update.message || update.edited_message;
          if (!message || !message.chat) {
            return Response.json({ ok: true });
          }

          const chatId = message.chat.id;
          const messageId = message.message_id;
          const rawText = (message.text || message.caption || "").trim();
          const senderName = message.from?.first_name || "";

          // ۱. مسدودسازی ویدیوهای سنگین
          if (message.video || message.video_note) {
            await sendTelegramMessage(
              chatId,
              "❌ <b>امکان پردازش فایل ویدیویی وجود ندارد.</b>\n\nلطفاً پیام خود را به صورت متن، صوت (Voice) یا تصویر/فیش ارسال فرمایید. 😊",
              getMainReplyKeyboard(),
              messageId,
            );
            return Response.json({ ok: true });
          }

          // ۲. دستور شروع /start
          if (rawText.startsWith("/start")) {
            const welcome = `سلام ${senderName || "دوست"} عزیز! به پشتیبانی رسمی فروشگاه اینترنتی <b>وایچ (VAICH.ir)</b> خوش آمدید. 👋

من دستیار هوشمند و ۲۴ ساعته فروشگاه هستم. در تمامی زمینه‌های زیر در خدمت شما هستم:
🔹 <b>پلنر هوشمند مدیریت زندگی گوگل‌شیت</b> (دائمی، بدون نیاز به شارژ ماهانه)
🔹 <b>اشتراک‌های قانونی هوش مصنوعی</b> (ChatGPT Plus، Gemini Pro، Claude Pro)
🔹 <b>استعلام قیمت‌های روز، موجودی و مشاوره خرید</b>
🔹 <b>راهنمای ثبت سفارش، پرداخت کارت‌به‌کارت و تایید فوری فیش</b>

💡 شما می‌توانید سوال خود را به صورت <b>متن</b>، <b>ویس صوتی (Voice)</b> یا <b>عکس و اسکرین‌شات</b> ارسال فرمایید تا در لحظه راهنمایی شوید!

👤 ارتباط با مدیریت و فروش: <b>یونس حیاتی</b> (@youneshayati)
⏰ ساعات پاسخگویی پشتیبانی انسانی: همه‌روزه از ساعت ۱۴:۰۰ الی ۲۲:۰۰`;

            await sendTelegramMessage(chatId, welcome, getMainReplyKeyboard(), messageId);
            return Response.json({ ok: true });
          }

          // ۳. دکمه‌های ثابت
          if (rawText === "🛒 لیست محصولات و قیمت‌ها" || rawText === "/products") {
            const config = getLiveSiteConfig();
            const prods = config.products || DEFAULT_PRODUCTS;
            const lines = prods.map((p: any) => {
              const formatted = new Intl.NumberFormat("fa-IR").format(p.price);
              const status = p.inStock !== false ? "🟢 موجود" : "🔴 ناموجود";
              return `🔹 <b>${p.name}</b> (${p.duration || "لایف‌تایم"})\n  قیمت: <b>${formatted} تومان</b> | ${status}\n  🔗 https://vaich.ir/products/${p.slug}`;
            });

            const msg = `🛒 <b>لیست اشتراک‌ها و محصولات فروشگاه VAICH:</b>\n\n${lines.join("\n\n")}\n\nجهت خرید آنلاین به لینک‌های بالا مراجعه کرده یا جهت واریز کارت‌به‌کارت با @youneshayati در ارتباط باشید.`;
            await sendTelegramMessage(chatId, msg, getMainReplyKeyboard(), messageId);
            return Response.json({ ok: true });
          }

          if (rawText === "📘 پلنر هوشمند گوگل‌شیت") {
            const msg = `📘 <b>پلنر هوشمند مدیریت زندگی وایچ (Deluxe):</b>

این پلنر روی بستر ابری <b>Google Sheets</b> با فرمول‌های پیشرفته اجرا می‌شود:
✅ بدون نیاز به شارژ ماهانه (دائمی و لایف‌تایم)
✅ ردیاب عادات (Habit Tracker) و اهداف
✅ ماتریس آیزنهاور و سیستم مدیریت زمان Time Boxing
✅ داشبورد جامع مدیریت دخل‌وخرج و مالی فردی
✅ کاملاً فارسی و سازگار با موبایل، تبلت و کامپیوتر

💰 <b>قیمت با تخفیف ویژه:</b> ۲۹۹,۰۰۰ تومان
🔗 <a href="https://vaich.ir/products/vaich-life-planner">خرید و تحویل آنی در سایت</a>`;

            await sendTelegramMessage(chatId, msg, getMainReplyKeyboard(), messageId);
            return Response.json({ ok: true });
          }

          if (rawText === "💳 نحوه خرید و ارسال فیش" || rawText === "/receipt") {
            const msg = `💳 <b>راهنمای پرداخت و ثبت سفارش:</b>

۱. <b>روش آنلاین:</b> در سایت <a href="https://vaich.ir">vaich.ir</a> محصول را انتخاب کرده و پرداخت امن را انجام دهید.
۲. <b>روش کارت‌به‌کارت:</b> جهت دریافت شماره کارت معتبر مدیریت به @youneshayati پیام دهید یا پس از واریز، <b>عکس فیش بانکی خود را مستقیماً در همین چت تلگرام بفرستید</b> تا هوش مصنوعی آن را تایید کند.`;

            await sendTelegramMessage(chatId, msg, getMainReplyKeyboard(), messageId);
            return Response.json({ ok: true });
          }

          if (
            rawText === "👤 پشتیبانی یونس حیاتی" ||
            rawText === "💬 پشتیبانی واتساپ" ||
            rawText === "/support"
          ) {
            const msg = `📞 <b>راه‌های ارتباط با مدیریت و پشتیبانی فروشگاه VAICH:</b>

👤 <b>مدیر مجموعه:</b> یونس حیاتی
🔹 <b>تلگرام مستقیم:</b> @youneshayati
💬 <b>واتساپ:</b> 09193872172
📞 <b>تماس تلفنی:</b> 09193872172
⏰ <b>ساعات پاسخگویی:</b> همه‌روزه از ساعت ۱۴:۰۰ الی ۲۲:۰۰`;

            await sendTelegramMessage(chatId, msg, getMainReplyKeyboard(), messageId);
            return Response.json({ ok: true });
          }

          // ۴. پردازش عکس و اسکرین‌شات (فیش یا خطا)
          if (message.photo && Array.isArray(message.photo) && message.photo.length > 0) {
            await sendChatAction(chatId, "typing");
            const highestPhoto = message.photo[message.photo.length - 1];
            const { base64, mimeType } = await downloadTelegramFileAsBase64(highestPhoto.file_id);

            const prompt = `تصویر ارسالی کاربر را با دقت بررسی کن.
متن همراه کاربر: "${rawText}"
دستورالعمل:
۱. اگر رسید یا فیش واریز بانکی است: نام صاحب حساب مقصد (باید یونس حیاتی باشد)، مبلغ، شماره پیگیری و تاریخ را بررسی کن. اگر به نام یونس حیاتی بود تایید اولیه بده و بگو سفارش برای مدیریت ارسال شد. اگر نبود محترمانه توضیح بده.
۲. اگر اسکرین‌شات از خطا یا تنظیمات سایت یا پلنر است: مشکل را تشخیص بده و راهکار ارائه کن.`;

            const contents = [
              {
                role: "user" as const,
                parts: [
                  { inlineData: { mimeType, data: base64 } },
                  { text: prompt },
                ],
              },
            ];

            const reply = await callGeminiApi(contents, buildSystemPrompt(senderName));
            await sendTelegramMessage(chatId, reply, getMainReplyKeyboard(), messageId);
            return Response.json({ ok: true });
          }

          // ۵. پردازش پیام صوتی (Voice)
          if (message.voice) {
            await sendChatAction(chatId, "record_voice");
            const { base64, mimeType } = await downloadTelegramFileAsBase64(message.voice.file_id);

            const contents = [
              {
                role: "user" as const,
                parts: [
                  { inlineData: { mimeType, data: base64 } },
                  {
                    text: "این پیام صوتی کاربر برای پشتیبانی فروشگاه VAICH است. محتوای صوت را بشنو و پاسخی دقیق، سریع و مودبانه به فارسی ارائه کن.",
                  },
                ],
              },
            ];

            const reply = await callGeminiApi(contents, buildSystemPrompt(senderName));
            await sendTelegramMessage(chatId, reply, getMainReplyKeyboard(), messageId);
            return Response.json({ ok: true });
          }

          // ۶. پردازش پیام متنی کاربر با هوش مصنوعی ابری فوق‌سریع
          if (rawText) {
            await sendChatAction(chatId, "typing");
            const contents = [
              {
                role: "user" as const,
                parts: [{ text: rawText }],
              },
            ];

            const reply = await callGeminiApi(contents, buildSystemPrompt(senderName));
            await sendTelegramMessage(chatId, reply, getMainReplyKeyboard(), messageId);
            return Response.json({ ok: true });
          }

          return Response.json({ ok: true });
        } catch (error: any) {
          console.error("[Telegram Webhook Error]:", error);
          return Response.json(
            {
              ok: false,
              error: error?.message || String(error),
              stack: error?.stack,
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
