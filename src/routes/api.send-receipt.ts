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
              {
                success: false,
                message: "اطلاعات رسید ناقص است.",
              },
              { status: 400 },
            );
          }

          // فقط تست تلگرام
          if (platform === "telegram") {
            const token = process.env["TELEGRAM_BOT_TOKEN"];
            const chatId = process.env["TELEGRAM_CHAT_ID"];


            if (!token || !chatId) {
              return Response.json(
                {
                  success: false,
                  message: "تنظیمات تلگرام کامل نیست.",
                },
                { status: 500 },
              );
            }

            const telegramData = new FormData();

            telegramData.append("chat_id", chatId);
            telegramData.append(
              "caption",
              message.slice(0, 1024),
            );
            telegramData.append(
              "photo",
              receipt,
              receipt.name || "receipt.jpg",
            );

            const response = await fetch(
              `https://api.telegram.org/bot${token}/sendPhoto`,
              {
                method: "POST",
                body: telegramData,
              },
            );

            if (!response.ok) {
              const errorText = await response.text();

              return Response.json(
                {
                  success: false,
                  message: `تلگرام خطا داد: ${errorText.slice(0, 500)}`,
                },
                { status: 502 },
              );
            }

            return Response.json({
              success: true,
            });
          }

          return Response.json(
            {
              success: false,
              message: "برای تست، فقط تلگرام فعال است.",
            },
            { status: 400 },
          );
        } catch (error) {
          return Response.json(
            {
              success: false,
              message:
                error instanceof Error
                  ? error.message
                  : "ارسال رسید انجام نشد.",
            },
            { status: 500 },
          );
        }
      },
    },
  },
});
