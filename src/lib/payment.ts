/**
 * Payment / order layer.
 *
 * Payments are processed by Zarinpal. The transaction is created on the server
 * (see `payment.functions.ts`), where the amount is read from the product
 * catalogue — never from client input — and the customer is redirected to the
 * gateway. Orders are not persisted yet; the Zarinpal panel is the record.
 */

export type CustomerInfo = {
  fullName: string;
  email: string;
  phone: string;
  note?: string;
};

export type Order = {
  id: string;
  productSlug: string;
  amount: number;
  discountCode?: string;
  customer: CustomerInfo;
  status: "draft" | "awaiting_payment" | "paid" | "delivered";
  createdAt: string;
};

export const paymentGatewayConnected = true;

export function createOrder(input: {
  productSlug: string;
  amount: number;
  customer: CustomerInfo;
  discountCode?: string;
}): Order {
  return {
    id: `VA-${Date.now().toString(36).toUpperCase()}`,
    status: "draft",
    createdAt: new Date().toISOString(),
    ...input,
  };
}
