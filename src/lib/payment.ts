/**
 * Manual (card-to-card) payment details.
 *
 * There is no online payment gateway. The customer transfers the exact product
 * price to the card below and then sends the receipt image to support on
 * Telegram for manual verification.
 */

import { formatPrice, type Product } from "@/lib/products";

export const CARD_NUMBER = "6219861452374472";
export const CARD_NUMBER_GROUPED = "6219 8614 5237 4472";
export const CARD_HOLDER = "یونس حیاتی";

export type CustomerInfo = {
  fullName: string;
  email: string;
  phone: string;
  note?: string;
};

/**
 * Builds the full order message sent to support (Telegram / WhatsApp).
 * Everything comes from the product catalogue, so new products/plans work
 * automatically without any code change.
 */
export function buildOrderMessage(product: Product, customer: CustomerInfo): string {
  const lines: string[] = [
    "🧾 رسید پرداخت جدید — VAICH",
    "",
    `سرویس: ${product.name}`,
    `محصول / پلن: اشتراک ${product.name}${product.duration ? ` (${product.duration})` : ""}`,
    `قیمت محصول: ${formatPrice(product.price)}`,
    `مبلغ نهایی پرداخت: ${formatPrice(product.price)}`,
    "",
    "— اطلاعات مشتری —",
    `نام و نام خانوادگی: ${customer.fullName || "—"}`,
    `شماره تماس: ${customer.phone || "—"}`,
    `ایمیل: ${customer.email || "—"}`,
  ];

  if (customer.note?.trim()) {
    lines.push(`توضیحات: ${customer.note.trim()}`);
  }

  lines.push(
    "",
    `کارت مقصد: ${CARD_NUMBER_GROUPED} — ${CARD_HOLDER}`,
    "",
    "📎 تصویر رسید پرداخت را در همین گفت‌وگو ارسال می‌کنم.",
  );

  return lines.join("\n");
}
