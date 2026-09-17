import { createFileRoute } from "@tanstack/react-router";
import { createHash, timingSafeEqual } from "crypto";

const IDENTIFIED_MESSAGE =
  "✅ سفارش شما دریافت و شناسایی شد.\n\n📎 لطفاً تصویر رسید پرداخت را همینجا ارسال کنید.";

const NO_ORDER_MESSAGE =
  "سلام 👋\nبرای ثبت سفارش، لطفاً از سایت VAICH خرید خود را انجام دهید و سپس روی دکمهٔ «ارسال رسید در ربات» بزنید.";

const RECEIPT_RECEIVED_MESSAGE =
  "📥 رسید شما دریافت شد.\nسفارش به‌صورت دستی بررسی و تأیید می‌شود و نتیجه به شما اطلاع داده خواهد شد.";

const RECEIPT_NEEDS_ORDER_MESSAGE =
  "ابتدا از سایت VAICH روی دکمهٔ «ارسال رسید در ربات» بزنید تا سفارش شما شناسایی شود، سپس تصویر رسید را بفرستید.";

function deriveWebhookSecret(botToken: string): string {
  return createHash("sha256")
    .update(`telegram-webhook:${botToken}`)
    .digest("base64url");
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a);
  const right = Buffer.from(b);
  return left.length === right.length && timingSafeEqual(left, right);
}

async function telegram(
  botToken: string,
  method: string,
  payload: Record<string, unknown>,
) {
  const response = await fetch(
    `https://api.telegram.org/bot${botToken}/${method}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    console.error(
      `Telegram ${method} failed [${response.status}]: ${await response.text()}`,
    );
  }

  return response;
}

export const Route = createFileRoute("/api/public/telegram/webhook")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const botToken = process.env["TELEGRAM_BOT_TOKEN"];

        if (!botToken) {
          return new Response("Not configured", { status: 500 });
        }

        const expected = deriveWebhookSecret(botToken);
        const actual =
          request.headers.get("X-Telegram-Bot-Api-Secret-Token") ?? "";

        if (!safeEqual(actual, expected)) {
          return new Response("Unauthorized", { status: 401 });
        }

        const update = (await request.json()) as any;
        const message = update?.message ?? update?.edited_message;
        const chatId = message?.chat?.id;

        if (!chatId) {
          return Response.json({ ok: true, ignored: true });
        }

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        const text: string = message.text ?? "";
        const startMatch = /^\/start(?:\s+(\S+))?/.exec(text.trim());

        if (startMatch) {
          const token = startMatch[1];

          if (!token) {
            await telegram(botToken, "sendMessage", {
              chat_id: chatId,
              text: NO_ORDER_MESSAGE,
            });
            return Response.json({ ok: true });
          }

          const { data: order } = await supabaseAdmin
            .from("orders")
            .select("id, order_message, order_number")
            .eq("order_token", token)
            .maybeSingle();

          if (!order) {
            await telegram(botToken, "sendMessage", {
              chat_id: chatId,
              text: NO_ORDER_MESSAGE,
            });
            return Response.json({ ok: true });
          }

          await supabaseAdmin
            .from("orders")
            .update({
              telegram_chat_id: chatId,
              telegram_username: message?.from?.username ?? null,
              linked_at: new Date().toISOString(),
              status: "identified",
            })
            .eq("id", order.id);

          // متن کامل سفارش، همان‌طور که در سایت ساخته شده است
          await telegram(botToken, "sendMessage", {
            chat_id: chatId,
            text: order.order_message,
          });

          await telegram(botToken, "sendMessage", {
            chat_id: chatId,
            text: IDENTIFIED_MESSAGE,
          });

          return Response.json({ ok: true });
        }

        const photos = message?.photo as Array<{ file_id: string }> | undefined;
        const documentFileId = message?.document?.file_id as string | undefined;
        const fileId =
          (photos && photos.length ? photos[photos.length - 1]?.file_id : null) ??
          documentFileId ??
          null;

        if (fileId) {
          const { data: order } = await supabaseAdmin
            .from("orders")
            .select("id")
            .eq("telegram_chat_id", chatId)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!order) {
            await telegram(botToken, "sendMessage", {
              chat_id: chatId,
              text: RECEIPT_NEEDS_ORDER_MESSAGE,
            });
            return Response.json({ ok: true });
          }

          await supabaseAdmin
            .from("orders")
            .update({
              receipt_file_id: fileId,
              receipt_received_at: new Date().toISOString(),
              status: "receipt_received",
            })
            .eq("id", order.id);

          await telegram(botToken, "sendMessage", {
            chat_id: chatId,
            text: RECEIPT_RECEIVED_MESSAGE,
          });

          return Response.json({ ok: true });
        }

        return Response.json({ ok: true, ignored: true });
      },
    },
  },
});
