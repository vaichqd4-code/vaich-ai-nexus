import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";

import { getProduct } from "./products";

const ZARINPAL_BASE = "https://payment.zarinpal.com/pg/v4/payment";
export const ZARINPAL_STARTPAY = "https://payment.zarinpal.com/pg/StartPay";

const customerSchema = z.object({
  slug: z.string().min(1),
  fullName: z.string().min(2).max(120),
  email: z.string().email().max(160),
  phone: z.string().min(8).max(20),
  note: z.string().max(500).optional(),
});

const verifySchema = z.object({
  slug: z.string().min(1),
  authority: z.string().min(1).max(120),
  status: z.string().max(20),
});

function merchantId(): string {
  const id = process.env["ZARINPAL_MERCHANT_ID"];
  if (!id) throw new Error("درگاه پرداخت هنوز پیکربندی نشده است.");
  return id;
}

export const requestPayment = createServerFn({ method: "POST" })
  .inputValidator((input) => customerSchema.parse(input))
  .handler(async ({ data }) => {
    const product = getProduct(data.slug);
    if (!product) throw new Error("محصول یافت نشد.");

    const origin = new URL(getRequest().url).origin;
    const callbackUrl = `${origin}/payment/result?slug=${encodeURIComponent(product.slug)}`;

    const res = await fetch(`${ZARINPAL_BASE}/request.json`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        merchant_id: merchantId(),
        amount: product.price,
        currency: "IRT",
        description: `خرید اشتراک ${product.name} از VAICH`,
        callback_url: callbackUrl,
        metadata: { email: data.email, mobile: data.phone },
      }),
    });

    const payload = (await res.json()) as {
      data?: { code?: number; authority?: string };
      errors?: { message?: string } | unknown[];
    };

    const authority = payload.data?.authority;
    if (!authority || (payload.data?.code !== 100 && payload.data?.code !== 101)) {
      console.error("Zarinpal request failed", JSON.stringify(payload));
      throw new Error("ایجاد تراکنش در درگاه پرداخت ناموفق بود. لطفاً دوباره تلاش کنید.");
    }

    return { authority, paymentUrl: `${ZARINPAL_STARTPAY}/${authority}` };
  });

export type VerifyResult = {
  ok: boolean;
  refId: string | null;
  productName: string;
  amount: number;
  message: string;
};

export const verifyPayment = createServerFn({ method: "POST" })
  .inputValidator((input) => verifySchema.parse(input))
  .handler(async ({ data }): Promise<VerifyResult> => {
    const product = getProduct(data.slug);
    if (!product) throw new Error("محصول یافت نشد.");

    const base = { productName: product.name, amount: product.price };

    if (data.status !== "OK") {
      return { ...base, ok: false, refId: null, message: "پرداخت توسط شما لغو شد یا ناموفق بود." };
    }

    const res = await fetch(`${ZARINPAL_BASE}/verify.json`, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({
        merchant_id: merchantId(),
        amount: product.price,
        authority: data.authority,
      }),
    });

    const payload = (await res.json()) as {
      data?: { code?: number; ref_id?: number };
    };
    const code = payload.data?.code;

    if (code === 100 || code === 101) {
      return {
        ...base,
        ok: true,
        refId: payload.data?.ref_id != null ? String(payload.data.ref_id) : null,
        message: "پرداخت با موفقیت انجام شد.",
      };
    }

    console.error("Zarinpal verify failed", JSON.stringify(payload));
    return { ...base, ok: false, refId: null, message: "پرداخت تأیید نشد." };
  });
