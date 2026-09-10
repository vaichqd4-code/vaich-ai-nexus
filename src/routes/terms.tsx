import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/layout/Section";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "قوانین و مقررات | VAICH" },
      {
        name: "description",
        content: "قوانین و مقررات خرید و استفاده از خدمات VAICH.",
      },
      { property: "og:title", content: "قوانین و مقررات | VAICH" },
      {
        property: "og:description",
        content: "شرایط خرید و استفاده از خدمات VAICH.",
      },
    ],
  }),
  component: () => (
    <Section className="aurora" title="📜 قوانین و مقررات خرید VAICH">
      <div className="glass-panel space-y-6 rounded-4xl p-6 text-sm leading-8 text-muted-foreground sm:p-10">
        <p className="text-xs opacity-70">
          آخرین به‌روزرسانی: ۱۴۰۵/۰۶/۱۹
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
            پرداخت از طریق درگاه سایت انجام می‌شود. پس از تأیید موفق پرداخت،
            سفارش برای پردازش و تحویل آماده خواهد شد.
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
            ۷. بازگشت وجه
          </h2>
          <p>
            شرایط بازگشت وجه، در صورت وجود، در صفحه محصول اعلام می‌شود.
            لطفاً پیش از خرید شرایط مربوط به محصول را مطالعه کنید.
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
            برای ارتباط با پشتیبانی می‌توانید از اطلاعات تماس و لینک‌های
            ارتباطی موجود در سایت استفاده کنید.
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
