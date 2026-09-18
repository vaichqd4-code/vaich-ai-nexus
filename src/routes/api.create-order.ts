import { createFileRoute } from "@tanstack/react-router";

const BOT_USERNAME = "vaich_new_receipt_bot";

function generateSecureToken(): string {
  const array = new Uint8Array(16);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("");
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

          const orderToken = generateSecureToken();
          const orderNumber = `VA-${Date.now().toString().slice(-8)}`;
          const fullNotes = notes
            ? `${orderMessage}\n\nتوضیحات مشتری: ${notes}`
            : orderMessage;

          // ذخیره محلی سفارش در دیتابیس
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            await supabaseAdmin.from("orders").insert({
              order_token: orderToken,
              order_number: orderNumber,
              order_message: fullNotes,
              product_slug: product.slug ?? null,
              product_name: product.name,
              amount: Math.round(Number(product.price ?? 0)),
              customer_name: customerName,
              customer_phone: customerPhone,
              customer_email: customerEmail || null,
              notes: notes || null,
              status: "pending_receipt",
            });
          } catch (dbErr) {
            console.error("Local order insert warning:", dbErr);
          }

          // انتقال مستقیم به صفحه گفتگوی ربات به همراه توکن سفارش
          const telegramUrl = `https://t.me/${BOT_USERNAME}?start=new_order_${orderToken}`;

          return Response.json({
            success: true,
            orderToken,
            orderNumber,
            telegramUrl,
          });
        } catch (error) {
          console.error("Error creating order:", error);
          return Response.json(
            { success: false, message: "خطای سرور در ثبت سفارش." },
            { status: 500 },
          );
        }
      },
    },
  },
});
