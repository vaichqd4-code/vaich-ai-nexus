import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/send-receipt")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const formData = await request.formData();

          const platform = formData.get("platform")?.toString();
          const message = formData.get("message")?.toString();
          const receipt = formData.get("receipt");

          if (
            !message ||
            !(receipt instanceof File) ||
            !receipt.size
          ) {
            return Response.json(
              { success: false, message: "اطلاعات رسید ناقص است." },
              { status: 400 },
            );
          }

          if (platform === "telegram") {
            const token = process.env.TELEGRAM_BOT_TOKEN;
            const chatId = process.env.TELEGRAM_CHAT_ID;

            if (!token || !chatId) {
              return Response.json(
                { success: false, message: "تنظیمات تلگرام کامل نیست." },
                { status: 500 },
              );
            }

            const telegramData = new FormData();
            telegramData.append("chat_id", chatId);
            telegramData.append("caption", message.slice(0, 1024));
            telegramData.append("photo", receipt);

            const response = await fetch(
              `https://api.telegram.org/bot${token}/sendPhoto`,
              {
                method: "POST",
                body: telegramData,
              },
            );

            if (!response.ok) {
              return Response.json(
                { success: false, message: "ارسال به تلگرام ناموفق بود." },
                { status: 502 },
              );
            }

            return Response.json({ success: true });
          }

          if (platform === "whatsapp") {
            const token = process.env.WHATSAPP_ACCESS_TOKEN;
            const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
            const to = process.env.WHATSAPP_TO;

            if (!token || !phoneNumberId || !to) {
              return Response.json(
                { success: false, message: "تنظیمات واتساپ کامل نیست." },
                { status: 500 },
              );
            }

            const mediaData = new FormData();
            mediaData.append("messaging_product", "whatsapp");
            mediaData.append("file", receipt);
            mediaData.append("type", receipt.type);

            const mediaResponse = await fetch(
              `https://graph.facebook.com/v23.0/${phoneNumberId}/media`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
                body: mediaData,
              },
            );

            if (!mediaResponse.ok) {
              return Response.json(
                { success: false, message: "آپلود تصویر واتساپ ناموفق بود." },
                { status: 502 },
              );
            }

            const mediaResult = await mediaResponse.json();

            if (!mediaResult.id) {
              return Response.json(
                { success: false, message: "شناسه تصویر واتساپ دریافت نشد." },
                { status: 502 },
              );
            }

            const sendResponse = await fetch(
              `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  messaging_product: "whatsapp",
                  to,
                  type: "image",
                  image: {
                    id: mediaResult.id,
                    caption: message,
                  },
                }),
              },
            );

            if (!sendResponse.ok) {
              return Response.json(
                { success: false, message: "ارسال به واتساپ ناموفق بود." },
                { status: 502 },
              );
            }

            return Response.json({ success: true });
          }

          return Response.json(
            { success: false, message: "پلتفرم نامعتبر است." },
            { status: 400 },
          );
        } catch {
          return Response.json(
            { success: false, message: "ارسال رسید انجام نشد." },
            { status: 500 },
          );
        }
      },
    },
  },
});
