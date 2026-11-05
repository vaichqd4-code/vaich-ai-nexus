/**
 * Analytics tracking has been disabled to keep VAICH ultra-lightweight and fast.
 */
export type AnalyticsEventType = string;

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  title: string;
  path: string;
  timestamp: string;
  duration?: number;
  device?: string;
  customerPhone?: string;
  customerName?: string;
  customerEmail?: string;
  productName?: string;
  amount?: number;
  referrer?: string;
  details?: Record<string, any>;
}

export function trackEvent(..._args: any[]): void {
  // No-op: tracking disabled for maximum performance
}

export function getStoredAnalytics(): AnalyticsEvent[] {
  return [];
}

export function clearStoredAnalytics(): void {
  // No-op
}

export function initSessionTracking(): () => void {
  return () => {};
}
