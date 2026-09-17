import { createFileRoute } from "@tanstack/react-router";
import crypto from "crypto";

function generateOrderToken(): string {
  return crypto.randomBytes(20).toString("base64url");
}

export const Route = createFileRoute("/api/create-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = await request.json();
          const { customerName, customerPhone, customerEmail, notes, product } = body || {};

          if (!customerName || !customerPhone || !customerEmail || !product) {
            return Response.json(
              { success: false, message: "اطلاعات سفارش ناقص است." },
              { status: 400 },
            );
          }

          const orderToken = generateOrderToken();
          const orderNumber = `VAICH-${Date.now().toString().slice(-6)}`;

          const supabaseUrl = process.env.SUPABASE_URL || "https://wrbfczahtddhnlesorld.supabase.co";
          const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

          if (serviceRoleKey) {
            const res = await fetch(`${supabaseUrl}/rest/v1/orders`, {
              method: "POST",
              headers: {
                "apikey": serviceRoleKey,
                "Authorization": `Bearer ${serviceRoleKey}`,
                "Content-Type": "application/json",
                "Prefer": "return=representation",
              },
              body: JSON.stringify({
                order_number: orderNumber,
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_email: customerEmail || null,
                service: product.service || "سرویس",
                product: product.name,
                plan: product.name,
                duration: product.duration || "یک ماهه",
                final_amount: product.price || 0,
                notes: notes || null,
                order_token: orderToken,
                status: "pending_receipt",
              }),
            });

            if (!res.ok) {
              const err = await res.text();
              console.error("Supabase insert order error:", err);
            }
          } else {
            console.warn("SUPABASE_SERVICE_ROLE_KEY is not defined. Order token generated without direct DB persistence.");
          }

          return Response.json({
            success: true,
            orderToken,
            telegramUrl: `https://t.me/vaich_receipt_bot?start=${orderToken}`,
          });
        } catch (error) {
          console.error("Error creating order:", error);
          return Response.json(
            {
              success: false,
              message: error instanceof Error ? error.message : "خطا در ثبت سفارش.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
