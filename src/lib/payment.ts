/**
 * Manual (card-to-card) payment details.
 *
 * There is no online payment gateway. The customer transfers the exact product
 * price to the card below and then sends the receipt image to support on
 * Telegram for manual verification.
 */

export const CARD_NUMBER = "6219861452374472";
export const CARD_NUMBER_GROUPED = "6219 8614 5237 4472";
export const CARD_HOLDER = "یونس حیاتی";

export type CustomerInfo = {
  fullName: string;
  email: string;
  phone: string;
  note?: string;
};
