import { createFileRoute } from "@tanstack/react-router";
import crypto from "crypto";

const BOT_USERNAME = "vaich_receipt_bot";

function generateOrderToken(): string {
  return crypto.randomBytes(16).toString("base64url");
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
          const orderNumber = `VAICH-${Date.now().toString().slice(-6)}`;

          const { supabaseAdmin } = await import(
            "@/integrations/supabase/client.server"
          );

          const { error } = await supabaseAdmin.from("orders").insert({
            order_token: orderToken,
            order_number: orderNumber,
            order_message: orderMessage,
            product_slug: product.slug ?? null,
            product_name: product.name,
            amount: Math.round(Number(product.price ?? 0)),
            customer_name: customerName,
            customer_phone: customerPhone,
            customer_email: customerEmail || null,
            notes: notes || null,
            status: "pending_receipt",
          });

          if (error) {
            console.error("Failed to store order:", error.message);
            return Response.json(
              { success: false, message: "ثبت سفارش انجام نشد." },
              { status: 500 },
            );
          }

          return Response.json({
            success: true,
            orderToken,
            orderNumber,
            telegramUrl: `https://t.me/${BOT_USERNAME}?start=${orderToken}`,
          });
        } catch (error) {
          console.error("Error creating order:", error);
          return Response.json(
            {
              success: false,
              message: "خطا در ثبت سفارش.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
