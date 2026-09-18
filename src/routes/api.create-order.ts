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
          const apiKey = process.env["VAICH_ORDER_API_KEY"] || "vaich_secret_key_987654321_secure_api";

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
              duration: "ماهانه",
              final_amount: Math.round(Number(product.price ?? 0)),
              notes: notes ? `${orderMessage}\n\nتوضیحات مشتری: ${notes}` : orderMessage,
              order_token: orderToken,
            }),
          });

          if (!response.ok) {
            const errData = await response.text();
            console.error("Lovable API Error:", response.status, errData);
            return Response.json(
              { success: false, message: "ثبت سفارش در سرور ربات با خطا مواجه شد." },
              { status: 500 },
            );
          }

          const result = (await response.json()) as {
            ok: boolean;
            order_number?: string;
            order_token?: string;
            telegram_link?: string;
          };

          return Response.json({
            success: true,
            orderToken: result.order_token || orderToken,
            orderNumber: result.order_number,
            telegramUrl: result.telegram_link || `https://t.me/${BOT_USERNAME}?start=${orderToken}`,
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
            
