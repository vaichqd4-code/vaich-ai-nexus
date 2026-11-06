# راهنمای اتصال چت‌بات Crisp به هوش مصنوعی Google AI Studio (Gemini) - VAICH.ir

این راهنما نحوه اتصال سیستم گفتگوی آنلاین **Crisp** به **Google AI Studio API** را توضیح می‌دهد تا بات پشتیبانی وبسایت شما به‌صورت ۲۴ ساعته و بدون نیاز به روشن بودن رایانه شما، به مشتریان پاسخ دهد.

---

## 🚀 روش اول: استفاده مستقیم از آدرس سایت (توصیه‌شده و آسان)

از آنجایی که اندپوینت `/api/crisp-webhook` در وب‌سایت شما پیاده‌سازی شده، فقط کافی است مراحل زیر را انجام دهید:

### گام ۱: دریافت شناسه و کلید پلاگین Crisp
1. وارد پنل مدیریت چت کریسپ شوید: [https://app.crisp.chat](https://app.crisp.chat)
2. از منوی سمت چپ، روی آیکون **Settings (چرخ‌دنده)** کلیک کنید.
3. وارد بخش **Workspace Settings** و سپس **Marketplace** شوید (یا از آدرس مستقیم [https://app.crisp.chat/settings/marketplace/tokens/](https://app.crisp.chat/settings/marketplace/tokens/) استفاده کنید).
4. روی دکمه **Create Token** یا **New Plugin** کلیک کنید:
   - نام آن را مثلاً `VAICH AI Bot` بگذارید.
   - در بخش مجوزها (Scopes)، دسترسی زیر را اضافه کنید:
     - `website:conversation:messages` (دسترسی Read & Write)
5. پس از ذخیره، دو مقدار به شما داده می‌شود:
   - **Identifier (شناسه پلاگین)**
   - **Key (کلید مخفی پلاگین)**

### گام ۲: تنظیم Webhook در Crisp
1. در پنل کریسپ، به بخش **Settings > Website Settings > Integrations > Webhooks** بروید.
2. روی دکمه **Add a Webhook** کلیک کنید.
3. در فیلد **Webhook URL**، آدرس زیر را وارد کنید (شناسه و کلید مرحله قبل را جایگزین کنید):
   ```
   https://vaich.ir/api/crisp-webhook?id=YOUR_CRISP_IDENTIFIER&key=YOUR_CRISP_KEY
   ```
4. در بخش رویدادها (**Events**)، تیک رویداد زیر را فعال کنید:
   - `message:send`
5. ذخیره کنید! از این لحظه ربات فعال است و به هر پیامی که کاربران ارسال کنند پاسخ هوشمند می‌دهد.

---

## ⚡ روش دوم: استقرار به‌عنوان Cloudflare Worker مستقل

اگر تمایل دارید ربات به‌عنوان یک سرویس مجزا روی دیتاسنترهای جهانی Cloudflare اجرا شود:

1. وارد داشبورد کلودفلر شوید: [https://dash.cloudflare.com](https://dash.cloudflare.com)
2. از منوی سمت چپ به **Compute (Workers & Pages)** بروید و روی **Create Application > Create Worker** کلیک کنید.
3. نام ورکر را مثلاً `vaich-crisp-bot` بگذارید و **Deploy** را بزنید.
4. روی **Edit code** کلیک کرده و تمام محتوای فایل `crisp-gemini-bot.js` را در آنجا جای‌گذاری (Paste) کنید و **Deploy** را بزنید.
5. به بخش **Settings > Variables and Secrets** ورکر رفته و متغیرهای زیر را اضافه کنید:
   - `CRISP_IDENTIFIER`: شناسه پلاگین کریسپ
   - `CRISP_KEY`: کلید پلاگین کریسپ
   - `GEMINI_API_KEY`: کلید گوگل استودیو (به‌طور پیش‌فرض در کد نیز قرار دارد)
6. آدرس ورکر به شما داده می‌شود (مثلاً `https://vaich-crisp-bot.yourname.workers.dev`).
7. همین آدرس را به عنوان Webhook URL در کریسپ با رویداد `message:send` ثبت نمایید.

---

## 🛡️ ویژگی‌های فنی و ایمنی
- **جلوگیری از لوپ بی‌نهایت (Loop Prevention):** وب‌هوک به طور خودکار پیام‌هایی که فرستنده آنها اپراتور است را نادیده می‌گیرد تا ربات با خودش گفتگو نکند.
- **تلاش مجدد و سوییچ مدل:** در صورت ترافیک در Google Gemini، به صورت خودکار مدل‌های 3.5، 3.8 و flash-latest تست و استفاده می‌شوند.
- **دانش‌پایه غنی:** ربات مشخصات دقیق پلنر گوگل شیتس ۳ بعدی، اشتراک‌های هوش مصنوعی، و اطلاعات تماس با آقای یونس حیاتی را در ذهن دارد.
