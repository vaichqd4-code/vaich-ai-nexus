/**
 * VAICH.ir - 24/7 Serverless Crisp Chatbot Worker (Cloudflare Worker)
 * 
 * این اسکریپت به‌صورت کاملاً مستقل و رایگان روی Cloudflare Workers مستقر می‌شود
 * و پیام‌های چت Crisp را از طریق Webhook دریافت کرده و با هوش مصنوعی Google AI Studio (Gemini 3.5/3.8 Flash)
 * با پرامپت اختصاصی و فارسی به مشتریان پاسخ می‌دهد.
 */

const decodeSecret = (b64) => {
  try {
    return atob(b64);
  } catch {
    return "";
  }
};

// کلیدهای پیش‌فرض گوگل استودیو و کریسپ VAICH
const DEFAULT_GEMINI_KEY = decodeSecret("QVEuQWI4Uk42S0Zyb1lOZVFLQ3Z2RmhDQTd2ZmR5eWxjYmNaM1RuY09ZUG1VSGNXdElpVGc=");
const DEFAULT_CRISP_IDENTIFIER = decodeSecret("ZjYyMjAzZDktNTVmMy00Yzc2LWEzYTktNGViZmVlNDcyMWIy");
const DEFAULT_CRISP_KEY = decodeSecret("OTI4Y2Q2NDVlN2M5MDMzYWZlOTRlYTQ3YTJkMDU4NDk1NWUyZTIzMzc3NjkyNzZjNjgwYTExNTg3MTNjODAxYQ==");

// مدل‌های پرسرعت گوگل با پشتیبان چندلایه
const GEMINI_MODELS = [
  "gemini-3.5-flash",
  "gemini-3.8-flash",
  "gemini-flash-latest",
  "gemini-3.1-flash-lite",
  "gemini-2.5-flash-lite"
];

// دستورالعمل و دانش‌پایه رسمی پشتیبانی VAICH
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

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // پاسخ تست سلامت برای متد GET
    if (request.method === "GET") {
      return new Response(JSON.stringify({
        status: "active",
        service: "VAICH Crisp AI Support Bot (Cloudflare Worker)",
        engine: "Google AI Studio (Gemini 3.5/3.8 Flash)",
        author: "Younes Hayati - VAICH.ir"
      }, null, 2), {
        headers: { "Content-Type": "application/json; charset=utf-8" }
      });
    }

    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    try {
      // دریافت کلیدها از محیط (Worker Secrets) یا پارامترهای آدرس
      const crispIdentifier =
        url.searchParams.get("id") ||
        url.searchParams.get("crisp_id") ||
        env?.CRISP_IDENTIFIER ||
        env?.CRISP_PLUGIN_IDENTIFIER ||
        DEFAULT_CRISP_IDENTIFIER;

      const crispKey =
        url.searchParams.get("key") ||
        url.searchParams.get("crisp_key") ||
        env?.CRISP_KEY ||
        env?.CRISP_PLUGIN_KEY ||
        DEFAULT_CRISP_KEY;

      const geminiApiKey =
        url.searchParams.get("gemini_key") ||
        env.GEMINI_API_KEY ||
        DEFAULT_GEMINI_KEY;

      const body = await request.json();
      const websiteId = body.website_id;
      const data = body.data || {};

      // فیلتر ۱: جلوگیری قطعی از لوپ بی‌نهایت
      if (data.from !== "user") {
        return new Response(JSON.stringify({ ok: true, ignored: true, reason: "sender_not_user" }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      // فیلتر ۲: فقط پیام‌های متنی
      if (data.type !== "text" || !data.content || typeof data.content !== "string") {
        return new Response(JSON.stringify({ ok: true, ignored: true, reason: "non_text" }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      const userText = data.content.trim();
      const sessionId = data.session_id;

      if (!userText || !sessionId || !websiteId) {
        return new Response(JSON.stringify({ ok: true, ignored: true }), {
          headers: { "Content-Type": "application/json" }
        });
      }

      if (!crispIdentifier || !crispKey) {
        return new Response(JSON.stringify({
          ok: false,
          error: "Crisp credentials missing. Add ?id=YOUR_ID&key=YOUR_KEY to webhook URL or set in Worker variables."
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      // تولید پاسخ با Google Gemini
      let aiText = null;
      for (const model of GEMINI_MODELS) {
        try {
          const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiApiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
              contents: [{ role: "user", parts: [{ text: userText }] }],
              generationConfig: { temperature: 0.7, maxOutputTokens: 600 }
            })
          });

          if (geminiRes.ok) {
            const resJson = await geminiRes.json();
            aiText = resJson.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
            if (aiText) break;
          }
        } catch (e) {
          console.warn(`Model ${model} error:`, e);
        }
      }

      if (!aiText) {
        return new Response(JSON.stringify({ ok: false, error: "AI generation failed" }), {
          status: 502,
          headers: { "Content-Type": "application/json" }
        });
      }

      // ارسال پاسخ به Crisp
      const basicAuth = btoa(`${crispIdentifier}:${crispKey}`);
      const crispRes = await fetch(`https://api.crisp.chat/v1/website/${websiteId}/conversation/${sessionId}/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Crisp-Tier": "plugin",
          "Authorization": `Basic ${basicAuth}`
        },
        body: JSON.stringify({
          type: "text",
          from: "operator",
          origin: "chat",
          content: aiText
        })
      });

      return new Response(JSON.stringify({
        ok: true,
        sent: crispRes.ok,
        status: crispRes.status
      }), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (err) {
      return new Response(JSON.stringify({ ok: false, error: err.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
