import { createFileRoute } from "@tanstack/react-router";
import { Section } from "@/components/layout/Section";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "حریم خصوصی | VAICH" },
      {
        name: "description",
        content:
          "سیاست حریم خصوصی و نحوه استفاده VAICH از اطلاعات مشتریان.",
      },
      { property: "og:title", content: "حریم خصوصی | VAICH" },
      {
        property: "og:description",
        content: "سیاست حریم خصوصی VAICH.",
      },
    ],
  }),

  component: () => (
    <Section className="aurora" title="حریم خصوصی">
      <div
        dir="rtl"
        className="glass-panel space-y-6 rounded-4xl p-6 text-sm leading-8 text-muted-foreground sm:p-10"
      >
        <div className="space-y-2">
          <p className="font-semibold text-foreground">
            حریم خصوصی | VAICH
          </p>

          <p>
            آخرین به‌روزرسانی: ۱۰ شهریور ۱۴۰۵
          </p>

          <p>
            در VAICH، حفظ حریم خصوصی و امنیت اطلاعات کاربران برای ما اهمیت
            زیادی دارد. در این صفحه توضیح می‌دهیم که چه اطلاعاتی ممکن است از
            شما دریافت شود و چگونه از آن‌ها استفاده می‌کنیم.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            ۱. اطلاعاتی که دریافت می‌کنیم
          </h2>

          <p>
            هنگام استفاده از سایت یا ثبت سفارش، ممکن است اطلاعاتی مانند موارد
            زیر دریافت شود:
          </p>

          <ul className="list-disc space-y-1 pr-6">
            <li>نام و نام خانوادگی</li>
            <li>شماره تماس</li>
            <li>آدرس ایمیل</li>
            <li>اطلاعات مربوط به سفارش و خرید</li>
            <li>اطلاعات لازم برای پشتیبانی و ارتباط با مشتری</li>
          </ul>

          <p>
            اطلاعات بانکی و اطلاعات کارت شما مستقیماً در اختیار VAICH قرار
            نمی‌گیرد و پرداخت‌ها از طریق درگاه پرداخت انجام می‌شوند.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            ۲. نحوه استفاده از اطلاعات
          </h2>

          <p>اطلاعات کاربران صرفاً برای مواردی مانند:</p>

          <ul className="list-disc space-y-1 pr-6">
            <li>ثبت و پردازش سفارش</li>
            <li>ارائه و تحویل محصولات و خدمات</li>
            <li>پاسخگویی به درخواست‌های پشتیبانی</li>
            <li>اطلاع‌رسانی درباره وضعیت سفارش</li>
            <li>بهبود خدمات و عملکرد سایت</li>
          </ul>

          <p>استفاده می‌شود.</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            ۳. حفظ امنیت اطلاعات
          </h2>

          <p>
            ما تلاش می‌کنیم اطلاعات کاربران را در برابر دسترسی غیرمجاز،
            سوءاستفاده یا افشای غیرضروری محافظت کنیم.
          </p>

          <p>
            با این حال، هیچ روش انتقال یا ذخیره‌سازی اطلاعات در اینترنت
            نمی‌تواند امنیت ۱۰۰٪ را تضمین کند.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            ۴. اشتراک‌گذاری اطلاعات
          </h2>

          <p>
            VAICH اطلاعات شخصی کاربران را به اشخاص یا مجموعه‌های دیگر
            نمی‌فروشد و در اختیار آن‌ها قرار نمی‌دهد، مگر در مواردی که برای
            انجام سفارش، ارائه خدمات، الزامات قانونی یا جلوگیری از سوءاستفاده
            و تخلف ضروری باشد.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            ۵. کوکی‌ها
          </h2>

          <p>
            ممکن است سایت VAICH برای بهبود عملکرد، حفظ تنظیمات کاربر و ارائه
            تجربه بهتر از کوکی‌ها (Cookies) استفاده کند.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            ۶. حقوق کاربران
          </h2>

          <p>
            کاربران می‌توانند در صورت وجود سؤال یا درخواست مرتبط با اطلاعات
            شخصی خود، از طریق راه‌های ارتباطی اعلام‌شده در سایت با VAICH تماس
            بگیرند.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            ۷. تغییرات این سیاست
          </h2>

          <p>
            ممکن است در آینده برای هماهنگی با تغییرات سایت یا خدمات، این
            سیاست حریم خصوصی به‌روزرسانی شود. نسخه جدید پس از انتشار در همین
            صفحه قابل مشاهده خواهد بود.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            ۸. تماس با ما
          </h2>

          <p>
            در صورت داشتن هرگونه سؤال درباره حریم خصوصی یا اطلاعات شخصی،
            می‌توانید از طریق بخش پشتیبانی با ما در ارتباط باشید.
          </p>
        </section>

        <div className="border-t border-border/50 pt-5 text-center font-medium text-foreground">
          VAICH — هوش مصنوعی، تکنولوژی و خدمات دیجیتال 🚀
        </div>
      </div>
    </Section>
  ),
});
