import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/layout/Section";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "قوانین و مقررات خرید و رویه بازگشت وجه | VAICH" },
      {
        name: "description",
        content: "قوانین رسمی خرید، رویه شفاف بازگشت وجه مطابق مواد ۳۷ و ۳۸ قانون تجارت الکترونیک، شرایط ضمانت فعال‌سازی اکانت‌های هوش مصنوعی و حل اختلاف در فروشگاه وایچ.",
      },
      { property: "og:title", content: "قوانین، مقررات و رویه بازگشت وجه | VAICH" },
      {
        property: "og:description",
        content: "شرایط خرید، ضمانت سلامت فعال‌سازی اولیه و رویه قانونی بازگشت وجه در فروشگاه VAICH.",
      },
      { property: "og:url", content: "https://vaich.ir/terms" },
    ],
    links: [
      { rel: "canonical", href: "https://vaich.ir/terms" },
    ],
  }),
  component: () => (
    <Section className="aurora" title="قوانین، مقررات و رویه بازگشت وجه VAICH">
      <div className="glass-panel space-y-6 rounded-4xl p-6 text-sm leading-8 text-muted-foreground sm:p-10">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 pb-3 text-xs">
          <span className="font-semibold text-foreground">قوانین و رویه تجارت الکترونیک</span>
          <span className="opacity-70">آخرین به‌روزرسانی: آبان ۱۴۰۵</span>
        </div>

        <div>
          <h2 className="mb-2 text-base font-bold text-foreground">
            ۱. ثبت سفارش
          </h2>
          <p>
            پس از انتخاب محصول، اطلاعات موردنیاز (از جمله شماره تماس و مشخصات کاربری) را با دقت وارد نمایید. مسئولیت صحت اطلاعات واردشده بر عهده مشتری است.
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
            ۳. نحوه و زمان تحویل
          </h2>
          <p>
            تحویل اشتراک‌های نرم‌افزاری و فایل‌های دیجیتال (نظیر پلنر هوشمند گوگل شیت) بلافاصله پس از تایید رسید و به صورت آنلاین از طریق لینک اختصاصی یا هماهنگی در پشتیبانی تلگرام انجام می‌شود. اشتراک‌های نیازمند فعال‌سازی روی ایمیل شخصی کاربر ظرف چند ساعت کاری با هماهنگی تحویل می‌گردند.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-bold text-foreground">
            ۴. پشتیبانی و مشاوره
          </h2>
          <p>
            تیم پشتیبانی وایچ در هفت روز هفته از طریق گفت‌وگوی آنلاین موجود در سایت و پشتیبانی تلگرام آماده پاسخگویی به سوالات، رفع اشکالات احتمالی ورود و راهنمایی تنظیمات ایمن کاربران است.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-bold text-foreground">
            ۵. محرمانگی و امنیت اطلاعات
          </h2>
          <p>
            اطلاعات کاربران نزد فروشگاه وایچ کاملاً محرمانه تلقی شده و به هیچ شخص ثالثی واگذار نمی‌گردد. در فرآیند فعال‌سازی روی ایمیل کاربر، هیچ دسترسی نامتعارفی از کاربر دریافت نخواهد شد و امنیت حساب‌های شخصی کاملاً تضمین می‌گردد.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-bold text-foreground">
            ۶. شرایط استفاده از سرویس‌ها
          </h2>
          <p>
            استفاده از کلیه اشتراک‌ها باید در چارچوب قوانین جمهوری اسلامی ایران و مطابق با شرایط و ضوابط عمومی شرکت‌های ارائه‌دهنده بین‌المللی (OpenAI, Anthropic, Google) باشد.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-bold text-foreground">
            ۷. ضمانت اصالت و سلامت فعال‌سازی اولیه
          </h2>
          <p className="mb-2">
            تمامی اشتراک‌های هوش مصنوعی (ChatGPT Plus، Claude Pro، Google AI Pro / Gemini) با پرداخت قانونی و همراه با
            <strong> ضمانت فعال‌سازی سالم اولیه و تحویل کامل</strong> ارائه می‌شوند.
            در صورتی که فعال‌سازی سرویس به هر دلیلی توسط فروشگاه انجام نپذیرد، کل مبلغ پرداختی بدون کسر کارمزد مسترد خواهد شد.
          </p>
          <p>
            با توجه به حساسیت و سیاست‌های امنیتی شرکت‌های بین‌المللی روی آی‌پی و رفتار ترافیکی، تداوم سلامت اکانت پس از تحویل موفق اولیه به رعایت نکات استاندارد نگهداری (استفاده از VPN پایدار و تمیز، عدم تغییر مکرر کشور/IP، عدم اشتراک‌گذاری عمومی اکانت و رعایت سقف مصرف منصفانه) توسط کاربر بستگی دارد. برای فایل‌های دائمی نظیر پلنر گوگل شیت وایچ، دسترسی همیشگی و فایل پشتیبان مادام‌العمر تضمین می‌شود.
          </p>
        </div>

        {/* ماده ۳۷ و ۳۸ قانون تجارت الکترونیک - رویه بازگشت وجه */}
        <div id="refund" className="scroll-mt-24 rounded-3xl border border-primary/30 bg-primary/5 p-5 sm:p-6 space-y-3">
          <div className="flex items-center gap-2 text-base font-bold text-foreground">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span>۸. رویه انصراف از خرید و بازگشت وجه (مواد ۳۷ و ۳۸ قانون تجارت الکترونیک)</span>
          </div>
          <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
            مطابق مواد ۳۷ و ۳۸ قانون تجارت الکترونیک جمهوری اسلامی ایران و ضوابط کالاهای دیجیتالی و خدمات نرم‌افزاری غیرملموس:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-muted-foreground pr-2">
            <li>
              <strong>پیش از تحویل یا فعال‌سازی:</strong> خریدار می‌تواند در هر زمان پیش از اقدام کارشناس به فعال‌سازی اشتراک یا تحویل فایل، انصراف خود را از خرید اعلام نماید. در این صورت، کل وجه پرداختی ظرف حداکثر ۲۴ ساعت کاری به همان شماره شبای پرداخت‌کننده عودت داده می‌شود.
            </li>
            <li>
              <strong>عدم تحویل یا وجود نقص فنی اولیه:</strong> در صورتی که امکان فعال‌سازی اکانت به دلیل محدودیت‌های فنی سرویس‌دهنده فراهم نباشد، یا فایل تحویل‌شده دارای نقص ساختاری غیرقابل‌رفع باشد، وجه پرداختی خریدار ظرف حداکثر ۲۴ الی ۴۸ ساعت مسترد می‌گردد.
            </li>
            <li>
              <strong>خدمات دیجیتال مصرف‌شده:</strong> به استناد بند (د) ماده ۳۸ آیین‌نامه تجارت الکترونیک، پس از فعال‌سازی موفقیت‌آمیز اکانت بر روی ایمیل خریدار و تحویل کامل دسترسی سالم به وی، به دلیل ماهیت مصرفی و اختصاصی بودن هزینه اشتراک ارزی، امکان انصراف بدون دلیل میسر نمی‌باشد مگر در صورت احراز نقص از سمت ارائه‌دهنده.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="mb-2 text-base font-bold text-foreground">
            ۹. ثبت شکایات و حل اختلاف
          </h2>
          <p className="leading-relaxed">
            در صورت بروز هرگونه اختلاف، ابهام در صورت‌حساب یا نارضایتی از خدمات، خریدار محترم می‌تواند مستقیماً از طریق{" "}
            <Link to="/support" hash="complaints" className="text-primary font-bold hover:underline">
              «سامانه آنلاین ثبت و پیگیری شکایات وایچ»
            </Link>{" "}
            موضوع را ثبت نماید. کارشناس حقوقی و پشتیبانی موظف است حداکثر ظرف ۴۸ ساعت کاری پاسخ رسمی و راهکار حل موضوع را به خریدار ابلاغ نماید.
          </p>
        </div>

        <div>
          <h2 className="mb-2 text-base font-bold text-foreground">
            ۱۰. تغییرات قوانین
          </h2>
          <p>
            هرگونه تغییر در قوانین جاری در همین صفحه اطلاع‌رسانی خواهد شد و ملاک عمل نسخه منتشرشده در زمان ثبت سفارش خریدار است.
          </p>
        </div>

        <div className="border-t border-border pt-6">
          <p className="font-semibold text-foreground">
            ثبت سفارش در VAICH به منزله مطالعه و پذیرش کامل این قوانین و مقررات است.
          </p>
        </div>
      </div>
    </Section>
  ),
});
