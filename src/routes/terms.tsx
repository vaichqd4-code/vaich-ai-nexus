import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/layout/Section";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "قوانین و مقررات خرید و ضمانت خدمات | VAICH" },
      {
        name: "description",
        content: "قوانین و مقررات رسمی خرید، روش پرداخت، شرایط فعال‌سازی و تضمین سلامت اکانت‌های هوش مصنوعی در فروشگاه VAICH.",
      },
      { property: "og:title", content: "قوانین و مقررات | VAICH" },
      {
        property: "og:description",
        content: "شرایط خرید و استفاده از خدمات VAICH.",
      },
      { property: "og:url", content: "https://vaich.ir/terms" },
    ],
    links: [
      { rel: "canonical", href: "https://vaich.ir/terms" },
    ],
  }),
  component: () => (
    <Section className="aurora" title="قوانین و مقررات خرید VAICH">
      <div className="glass-panel space-y-6 rounded-4xl p-6 text-sm leading-8 text-muted-foreground sm:p-10">
        <p className="text-xs opacity-70">
          آخرین به‌روزرسانی: ۱۴۰۵/۰۶/۲۹
        </p>

        <div>
          <h2 className="mb-2 text-base font-bold text-foreground">
            ۱. ثبت سفارش
          </h2>
          <p>
            پس از انتخاب محصول، اطلاعات موردنیاز را با دقت وارد کنید.
            مسئولیت صحت اطلاعات واردشده بر عهده مشتری است.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-bold text-foreground">
            ۲. پرداخت
          </h2>
          <p>
            پرداخت سفارش‌ها در حال حاضر به‌صورت کارت‌به‌کارت انجام می‌شود. پس از ثبت سفارش در سایت و واریز مبلغ، خریدار تصویر رسید بانکی خود را جهت بررسی و اعتبارسنجی ارسال می‌کند. پس از تأیید نهایی رسید، سفارش در نوبت پردازش، فعال‌سازی و تحویل قرار خواهد گرفت.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-bold text-foreground">
            ۳. تحویل اشتراک
          </h2>
          <p>
            اطلاعات اشتراک پس از تأیید سفارش، طبق روش اعلام‌شده در صفحه محصول
            یا از طریق پشتیبانی ارائه خواهد شد.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-bold text-foreground">
            ۴. پشتیبانی
          </h2>
          <p>
            در صورت وجود مشکل در ورود، فعال‌سازی یا استفاده از اشتراک،
            می‌توانید از راه‌های ارتباطی اعلام‌شده در سایت با پشتیبانی تماس
            بگیرید.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-bold text-foreground">
            ۵. امنیت اطلاعات حساب
          </h2>
          <p>
            اطلاعات اشتراک محرمانه است و مشتری مسئول حفظ امنیت اطلاعات حساب و
            خودداری از انتشار یا در اختیار قرار دادن آن به دیگران است.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-bold text-foreground">
            ۶. شرایط استفاده
          </h2>
          <p>
            استفاده از اشتراک‌ها باید مطابق قوانین سرویس مربوطه و قوانین
            قابل‌اعمال انجام شود.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-bold text-foreground">
            ۷. ضمانت فعال‌سازی، شرایط اکانت‌های هوش مصنوعی و بازگشت وجه
          </h2>
          <p className="mb-2">
            تمامی اشتراک‌های هوش مصنوعی (ChatGPT Plus، Claude Pro، Google AI Pro / Gemini) با پرداخت قانونی و همراه با
            <strong> ضمانت فعال‌سازی سالم اولیه و تحویل کامل</strong> ارائه می‌شوند.
            در صورتی که فعال‌سازی سرویس توسط فروشگاه انجام نشود، کل مبلغ پرداختی عودت داده خواهد شد.
          </p>
          <p>
            با توجه به حساسیت و سیاست‌های امنیتی شرکت‌هایی نظیر OpenAI، Anthropic و Google روی آی‌پی و نحوه مصرف،
            تداوم سلامت اکانت پس از تحویل موفق به رعایت نکات نگهداری (استفاده از VPN با IP ثابت و تمیز، عدم تغییر مکرر IP، عدم اشتراک‌گذاری اکانت و رعایت قوانین پلتفرم) توسط کاربر بستگی دارد و فروشگاه بابت محدودیت‌ها یا مسدودیت‌های پس از فعال‌سازی مسئولیتی ندارد. برای فایل‌های دائمی نظیر پلنر گوگل شیت VAICH دسترسی همیشگی و پشتیبانی راه‌اندازی تضمین می‌شود.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-bold text-foreground">
            ۸. تغییر قوانین
          </h2>
          <p>
            VAICH می‌تواند در صورت نیاز قوانین و مقررات را به‌روزرسانی کند.
            نسخه منتشرشده در این صفحه، نسخه معتبر قوانین خواهد بود.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-bold text-foreground">
            ۹. ارتباط با پشتیبانی
          </h2>
          <p>
            کاربران می‌توانند برای دریافت مشاوره، پیگیری سفارش‌ها و طرح سوالات، از طریق گفت‌وگوی آنلاین و زنده موجود در سایت (ویجت چت) و همچنین سایر راه‌های ارتباطی درج‌شده (تلگرام و شبکه‌های اجتماعی) با تیم پشتیبانی در ارتباط باشند.
          </p>
        </div>

        <div className="border-t border-border pt-6">
          <p className="font-medium text-foreground">
            با خرید از VAICH، مشتری تأیید می‌کند که قوانین و مقررات را مطالعه
            کرده و آن‌ها را پذیرفته است.
          </p>
        </div>
      </div>
    </Section>
  ),
});
            
