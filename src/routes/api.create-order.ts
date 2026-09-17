import { createFileRoute } from "@tanstack/react-router";

const BOT_USERNAME = "vaich_receipt_bot";

// استفاده از Web Crypto API که با Cloudflare Workers کاملاً سازگار است
function generateOrderToken(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export const Route = createFileRoute("/api/create-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as {
            customerName?: string;
            customerPhone?: string;
            customerEmail?: string;
            notes?: string;
            orderMessage?: string;
            product?: {
              slug?: string;
              name?: string;
              price?: number;
              service?: string;
            };
          };

          const {
            customerName,
            customerPhone,
            customerEmail,
            notes,
            orderMessage,
            product,
          } = body || {};

          if (!customerName || !customerPhone || !product?.name || !orderMessage) {
            return Response.json(
              { success: false, message: "اطلاعات سفارش ناقص است." },
              { status: 400 },
            );
          }

          const orderToken = generateOrderToken();

          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );

          // ترکیب پیام سفارش و یادداشت‌های مشتری برای ذخیره در یک ستون
          const combinedNotes = notes 
            ? `${orderMessage}\n\nتوضیحات مشتری: ${notes}` 
            : orderMessage;

          // درج اطلاعات با نام‌های دقیق ستون‌ها در دیتابیس ربات
          const { error } = await supabaseAdmin.from("orders").insert({
            order_token: orderToken,
            customer_name: customerName,
            customer_phone: customerPhone,
            customer_email: customerEmail || null,
            service_name: product.service || "سرویس VAICH", 
            plan_name: product.name,
            price: product.price || 0,
            final_price: product.price || 0,
            order_notes: combinedNotes,
            status: "pending_receipt",
          });

          if (error) {
            console.error("Failed to store order in Supabase:", error.message, error.details);
            return Response.json(
              { success: false, message: "ثبت سفارش در دیتابیس انجام نشد." },
              { status: 500 },
            );
          }

          return Response.json({
            success: true,
            orderToken,
            telegramUrl: `https://t.me/${BOT_USERNAME}?start=${orderToken}`,
          });
        } catch (error) {
          console.error("Error creating order:", error);
          return Response.json(
            { success: false, message: "خطای داخلی سرور در ثبت سفارش." },
            { status: 500 },
          );
        }
      },
    },
  },
});
