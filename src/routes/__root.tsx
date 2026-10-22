import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="gradient-text text-7xl font-extrabold">۴۰۴</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">صفحه پیدا نشد</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          صفحه‌ای که دنبال آن هستید وجود ندارد یا جابه‌جا شده است.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="neon-gradient inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            بازگشت به خانه
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          این صفحه بارگذاری نشد
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          مشکلی پیش آمد. می‌توانید دوباره تلاش کنید یا به صفحه اصلی بازگردید.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="neon-gradient inline-flex items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            تلاش دوباره
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border bg-secondary/50 px-5 py-2.5 text-sm font-medium text-foreground"
          >
            صفحه اصلی
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5" },
      { title: "VAICH | مرجع خدمات دیجیتال و اشتراک‌های هوش مصنوعی" },
      {
        name: "description",
        content: "خرید آنلاین، قانونی و با تحویل فوری اشتراک‌های هوش مصنوعی (ChatGPT, Gemini, Claude)، پلنرهای تخصصی دیجیتال و خدمات آنلاین در فروشگاه VAICH.",
      },
      { name: "keywords", content: "خرید اکانت chatgpt, خرید اشتراک gemini pro, خرید اکانت claude pro, خرید هوش مصنوعی, vaich" },
      { name: "author", content: "VAICH" },
      { name: "theme-color", content: "#2563eb" },
      { property: "og:site_name", content: "VAICH" },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://vaich.ir/vaich-logo.png" },
      { property: "og:url", content: "https://vaich.ir" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "https://vaich.ir/vaich-logo.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://vaich.ir" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "preload",
        as: "font",
        type: "font/woff2",
        href: "https://fonts.gstatic.com/s/vazirmatn/v16/Dxxo8j6PP2D_kU2muijlGMWWIGroe7ll.woff2",
        crossOrigin: "anonymous",
      },
      {
        rel: "preload",
        as: "style",
        href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;800&display=swap",
      },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Vazirmatn:wght@400;500;700;800&display=swap",
      },
      {
        rel: "preload",
        as: "image",
        type: "image/webp",
        href: "/promo-banner.webp",
      },
      { rel: "icon", type: "image/png", sizes: "64x64", href: "/favicon.png?v=4" },
      { rel: "icon", type: "image/png", sizes: "32x32", href: "/favicon-32x32.png?v=4" },
      { rel: "icon", href: "/favicon.ico?v=4", sizes: "any" },
      { rel: "shortcut icon", href: "/favicon.ico?v=4" },
      { rel: "apple-touch-icon", sizes: "180x180", href: "/apple-touch-icon.png?v=4" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fa" dir="rtl" data-theme="light">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('vaich-theme')||'light';document.documentElement.setAttribute('data-theme',t);if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`,
          }}
        />
        <HeadContent />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": "https://vaich.ir/#website",
                  "url": "https://vaich.ir",
                  "name": "VAICH",
                  "description": "فروشگاه تخصصی اشتراک‌های هوش مصنوعی",
                  "inLanguage": "fa-IR",
                  "potentialAction": {
                    "@type": "SearchAction",
                    "target": "https://vaich.ir/products?q={search_term_string}",
                    "query-input": "required name=search_term_string"
                  }
                },
                {
                  "@type": "OnlineStore",
                  "@id": "https://vaich.ir/#organization",
                  "name": "VAICH",
                  "alternateName": "فروشگاه اشتراک هوش مصنوعی وایچ",
                  "url": "https://vaich.ir",
                  "logo": "https://vaich.ir/vaich-logo.png",
                  "image": "https://vaich.ir/vaich-logo.png",
                  "description": "فروشگاه تخصصی خرید قانونی و مستقیم اشتراک‌های هوش مصنوعی ChatGPT Plus، Gemini Pro و Claude Pro با تحویل آنی و ضمانت پایداری.",
                  "telephone": "+989193872172",
                  "priceRange": "IRR",
                  "currenciesAccepted": "IRR",
                  "paymentAccepted": "کارت به کارت",
                  "sameAs": [
                    "https://t.me/vaich_ir",
                    "https://instagram.com/vaich_ir"
                  ]
                }
              ]
            }),
          }}
        />
        {/* Crisp live chat deferred loader — loads on first user interaction or idle to prevent TBT / main-thread blocking */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){window.$crisp=[];window.CRISP_WEBSITE_ID="7751150b-b8d0-4953-8745-021b7d8a730c";var loaded=false;function initCrisp(){if(loaded)return;loaded=true;var d=document;var s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=true;d.head.appendChild(s);['scroll','mousemove','touchstart','keydown'].forEach(function(e){window.removeEventListener(e,initCrisp,{passive:true});});}['scroll','mousemove','touchstart','keydown'].forEach(function(e){window.addEventListener(e,initCrisp,{once:true,passive:true});});if('requestIdleCallback' in window){requestIdleCallback(function(){setTimeout(initCrisp,4000);});}else{setTimeout(initCrisp,5000);}})();`,
          }}
        />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
}
