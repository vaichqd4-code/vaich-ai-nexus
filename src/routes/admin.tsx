import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";

const LazyAdminPage = lazy(() =>
  import("@/components/admin/AdminPage").then((m) => ({ default: m.AdminPage }))
);

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "پنل مدیریت فروشگاه | VAICH" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPageWrapper,
});

export function AdminPage() {
  return <AdminPageWrapper />;
}

function AdminPageWrapper() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background grid place-items-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground font-medium">در حال بارگذاری پنل مدیریت...</p>
          </div>
        </div>
      }
    >
      <LazyAdminPage />
    </Suspense>
  );
}
