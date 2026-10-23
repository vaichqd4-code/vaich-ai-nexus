import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const LazyOverviewPage = lazy(() =>
  import("@/components/admin/OverviewPage").then((m) => ({ default: m.OverviewPage }))
);

export const Route = createFileRoute("/overview")({
  head: () => ({
    meta: [
      { title: "گزارش تحلیلی و آمار زنده فروشگاه | VAICH Overview" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: OverviewWrapper,
});

function OverviewWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background grid place-items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground font-medium">در حال بارگذاری گزارش و آمار زنده...</p>
          </div>
        </div>
      }
    >
      <LazyOverviewPage />
    </Suspense>
  );
}
