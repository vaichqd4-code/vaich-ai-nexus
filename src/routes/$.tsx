import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Home, ShoppingBag, ArrowRight, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/$")({
  head: () => ({
    meta: [
      { title: "صفحه پیدا نشد (۴۰۴) | VAICH" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: NotFoundRoute,
});

function NotFoundRoute() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Ensure document has noindex meta on client-side
    document.title = "صفحه پیدا نشد (۴۰۴) | VAICH";
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, nofollow");

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate({ to: "/" });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-[75vh] items-center justify-center bg-background px-4 py-16">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative inline-flex items-center justify-center">
          <span className="gradient-text text-8xl font-black tracking-tight select-none">۴۰۴</span>
          <span className="absolute -bottom-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold inline-flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            <span>صفحه مورد نظر پیدا نشد</span>
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-xl sm:text-2xl font-black text-foreground">
            این آدرس در وبسایت وایچ وجود ندارد
          </h1>
          <p className="text-xs sm:text-sm leading-6 text-muted-foreground">
            صفحه‌ای که به دنبال آن بودید احتمالاً حذف شده، تغییر نام داده یا آدرس آن به اشتباه وارد شده است.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl border border-border/70 bg-secondary/40 text-xs text-muted-foreground">
          <span>انتقال خودکار به صفحه اصلی تا </span>
          <span className="font-bold text-primary font-mono text-sm px-1">{countdown}</span>
          <span> ثانیه دیگر...</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all cursor-pointer"
          >
            <Home className="h-4 w-4" />
            <span>بازگشت فوری به صفحه اصلی</span>
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-border/80 bg-card px-5 py-3 text-xs sm:text-sm font-bold text-foreground hover:bg-secondary transition-all cursor-pointer"
          >
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
            <span>مشاهده همه محصولات</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
