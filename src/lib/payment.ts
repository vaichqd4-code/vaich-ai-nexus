/**
 * Payment / order layer — placeholder.
 *
 * No payment gateway is connected yet. `createOrder` currently only builds an
 * order object locally. When an Iranian gateway (زرین‌پال، آیدی‌پی، ...) is
 * added, implement `startPayment` to create a transaction on the server and
 * redirect the customer, keeping this same interface.
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

export const paymentGatewayConnected = false;

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

export async function startPayment(_order: Order): Promise<never> {
  throw new Error("درگاه پرداخت هنوز متصل نشده است.");
}
