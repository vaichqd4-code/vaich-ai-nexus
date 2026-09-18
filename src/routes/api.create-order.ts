import { createFileRoute } from "@tanstack/react-router";

const LOVABLE_ORDER_ENDPOINT = "https://project--41625677-6d09-42e4-bd38-90e55f9ea2d1.lovable.app/api/public/orders";
const BOT_USERNAME = "vaich_receipt_bot";

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
          const fullNotes = notes
            ? `${orderMessage}\n\nتوضیحات مشتری: ${notes}`
            : orderMessage;
          const apiKey = process.env["VAICH_ORDER_API_KEY"] || "vaich_secret_key_987654321_secure_api";

          const orderNumber = `VA-${Date.now().toString().slice(-8)}`;

          // 1) Always persist locally so the VAICH receipt bot can identify the order.
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

          const { error: dbError } = await supabaseAdmin.from("orders").insert({
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

          if (dbError) {
            console.error("Order insert failed:", dbError.message);
            return Response.json(
              { success: false, message: "ثبت سفارش با خطا مواجه شد." },
              { status: 500 },
            );
          }

          // 2) Best-effort mirror to the external bot endpoint; never blocks the user.
          let externalOrderNumber: string | undefined;
          let externalTelegramLink: string | undefined;

          try {
            const response = await fetch(LOVABLE_ORDER_ENDPOINT, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
              },
              body: JSON.stringify({
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_email: customerEmail || "",
                service: product.service || "سرویس هوش مصنوعی",
                product: product.name,
                plan: product.name,
                plan_name: product.name,
                duration: "ماهانه",
                final_amount: Math.round(Number(product.price ?? 0)),
                notes: fullNotes,
                order_notes: fullNotes,
                order_message: orderMessage,
                order_token: orderToken,
              }),
            });

            if (response.ok) {
              const result = (await response.json()) as {
                order_number?: string;
                telegram_link?: string;
              };
              externalOrderNumber = result.order_number;
              externalTelegramLink = result.telegram_link;
            } else {
              console.error(
                "External order endpoint error:",
                response.status,
                await response.text(),
              );
            }
          } catch (mirrorError) {
            console.error("External order endpoint unreachable:", mirrorError);
          }

          return Response.json({
            success: true,
            orderToken,
            orderNumber: externalOrderNumber || orderNumber,
            telegramUrl:
              externalTelegramLink || `https://t.me/${BOT_USERNAME}?start=${orderToken}`,
          });
        } catch (error) {
          console.error("Error connecting to order endpoint:", error);
          return Response.json(
            { success: false, message: "خطای سرور در ثبت سفارش." },
            { status: 500 },
          );
        }
      },
    },
  },
});
            
