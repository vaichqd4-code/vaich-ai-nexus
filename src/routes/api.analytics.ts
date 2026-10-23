import { createFileRoute } from "@tanstack/react-router";
import { normalizePin, DEFAULT_ADMIN_PIN } from "@/lib/products";

// Server-side in-memory buffer of recent live events across all visitors (last 300 events)
interface StoredEvent {
  id: string;
  type: string;
  title: string;
  path: string;
  productSlug?: string;
  productName?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  amount?: number;
  duration?: number;
  device?: string;
  referrer?: string;
  timestamp: string;
  details?: Record<string, any>;
}

const serverEventsBuffer: StoredEvent[] = [];
const MAX_BUFFER = 300;

export const Route = createFileRoute("/api/analytics")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const event = (await request.json()) as StoredEvent;
          if (!event || !event.type) {
            return Response.json({ success: false, message: "داده‌های رویداد نامعتبر است." }, { status: 400 });
          }

          const record: StoredEvent = {
            id: event.id || `srv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            type: event.type,
            title: event.title || event.type,
            path: event.path || "/",
            productSlug: event.productSlug,
            productName: event.productName,
            customerName: event.customerName,
            customerPhone: event.customerPhone,
            customerEmail: event.customerEmail,
            amount: event.amount ? Number(event.amount) : undefined,
            duration: event.duration ? Number(event.duration) : undefined,
            device: event.device || "mobile",
            referrer: event.referrer || "مستقیم",
            timestamp: event.timestamp || new Date().toISOString(),
            details: event.details,
          };

          serverEventsBuffer.unshift(record);
          if (serverEventsBuffer.length > MAX_BUFFER) {
            serverEventsBuffer.length = MAX_BUFFER;
          }

          return Response.json({ success: true });
        } catch (err: any) {
          return Response.json({ success: false, error: err.message }, { status: 200 });
        }
      },

      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const reqPin = url.searchParams.get("pin") || request.headers.get("x-admin-pin") || "";
          const effectivePin = normalizePin(process.env["ADMIN_MASTER_PIN"] || DEFAULT_ADMIN_PIN);

          // Verify authorization
          if (normalizePin(reqPin) !== effectivePin) {
            return Response.json({ success: false, message: "دسترسی غیرمجاز. رمز عبور نامعتبر است." }, { status: 401 });
          }

          // 1. Fetch real customer orders with customer phone numbers from Supabase orders table
          let orders: any[] = [];
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const { data, error } = await supabaseAdmin
              .from("orders")
              .select("*")
              .order("created_at", { ascending: false })
              .limit(100);

            if (!error && Array.isArray(data)) {
              orders = data;
            }
          } catch (dbErr) {
            console.warn("Supabase orders query in analytics:", dbErr);
          }

          // 2. Aggregate metrics from serverEventsBuffer and orders
          let totalBannerClicks = 0;
          let totalProductViews = 0;
          let totalCheckoutViews = 0;
          let totalDuration = 0;
          let durationCount = 0;
          const deviceCount: Record<string, number> = { mobile: 0, desktop: 0, tablet: 0 };
          const referrerCount: Record<string, number> = {};
          const productPopularity: Record<string, { name: string; views: number }> = {};

          serverEventsBuffer.forEach((e) => {
            if (e.type === "banner_click") totalBannerClicks++;
            if (e.type === "product_view") {
              totalProductViews++;
              const name = e.productName || e.productSlug || "محصول نامشخص";
              if (!productPopularity[name]) productPopularity[name] = { name, views: 0 };
              productPopularity[name].views++;
            }
            if (e.type === "checkout_view") totalCheckoutViews++;
            if (e.duration && e.duration > 0) {
              totalDuration += e.duration;
              durationCount++;
            }
            if (e.device) {
              deviceCount[e.device] = (deviceCount[e.device] || 0) + 1;
            }
            if (e.referrer) {
              referrerCount[e.referrer] = (referrerCount[e.referrer] || 0) + 1;
            }
          });

          const avgDuration = durationCount > 0 ? Math.round(totalDuration / durationCount) : 0;

          return Response.json({
            success: true,
            stats: {
              totalEvents: serverEventsBuffer.length,
              bannerClicks: totalBannerClicks,
              productViews: totalProductViews,
              checkoutViews: totalCheckoutViews,
              totalOrders: orders.length,
              avgDuration,
              deviceCount,
              referrerCount,
              topProducts: Object.values(productPopularity).sort((a, b) => b.views - a.views).slice(0, 8),
            },
            orders: orders.map((o) => ({
              id: o.id,
              orderNumber: o.order_number,
              customerName: o.customer_name || "کاربر سایت",
              customerPhone: o.customer_phone || "—",
              customerEmail: o.customer_email || "—",
              productName: o.product_name,
              amount: o.amount,
              status: o.status,
              createdAt: o.created_at,
              notes: o.notes,
              telegramUsername: o.telegram_username || undefined,
            })),
            recentEvents: serverEventsBuffer.slice(0, 100),
          });
        } catch (err: any) {
          return Response.json({ success: false, error: err.message }, { status: 500 });
        }
      },
    },
  },
});
