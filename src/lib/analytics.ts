/**
 * VAICH Ultra-Lightweight Analytics & Activity Tracker
 * Zero dependencies, non-blocking, zero impact on Lighthouse / Core Web Vitals.
 */

export type AnalyticsEventType =
  | "banner_click"
  | "product_view"
  | "checkout_view"
  | "checkout_submit"
  | "planner_scroll"
  | "session_duration"
  | "page_view";

export interface AnalyticsEvent {
  id: string;
  type: AnalyticsEventType;
  title: string;
  path: string;
  productSlug?: string;
  productName?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  amount?: number;
  duration?: number; // seconds
  device: "mobile" | "desktop" | "tablet";
  referrer: string;
  timestamp: string; // ISO string
  details?: Record<string, any>;
}

const STORAGE_KEY = "vaich_analytics_events";
const MAX_LOCAL_EVENTS = 250;

function getDeviceType(): "mobile" | "desktop" | "tablet" {
  if (typeof window === "undefined") return "desktop";
  const ua = navigator.userAgent.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua,
    ) ||
    window.innerWidth < 768
  ) {
    return "mobile";
  }
  return "desktop";
}

function getReferrerSource(): string {
  if (typeof document === "undefined" || !document.referrer) return "ورودی مستقیم (Direct)";
  const ref = document.referrer.toLowerCase();
  if (ref.includes("instagram.com")) return "اینستاگرام (Instagram)";
  if (ref.includes("t.me") || ref.includes("telegram.org")) return "تلگرام (Telegram)";
  if (ref.includes("google.com") || ref.includes("google.ir")) return "گوگل (Google)";
  if (ref.includes("bing.com")) return "بینگ (Bing)";
  try {
    const url = new URL(ref);
    return url.hostname;
  } catch {
    return "سایر سایت‌ها";
  }
}

/**
 * Persists event locally without blocking the thread
 */
function saveEventLocally(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const list: AnalyticsEvent[] = raw ? JSON.parse(raw) : [];
    list.unshift(event);
    if (list.length > MAX_LOCAL_EVENTS) {
      list.length = MAX_LOCAL_EVENTS;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new CustomEvent("vaich_analytics_new_event", { detail: event }));
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Sends event non-blocking to server
 */
function sendEventToServer(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  const url = "/api/analytics";
  const payload = JSON.stringify(event);

  if (typeof navigator !== "undefined" && typeof navigator.sendBeacon === "function") {
    try {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(url, blob);
      return;
    } catch {}
  }

  // Fallback to non-blocking fetch with keepalive
  try {
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

/**
 * Primary tracking method: fire-and-forget, zero performance footprint.
 */
export function trackEvent(
  type: AnalyticsEventType,
  payload: {
    title?: string;
    productSlug?: string;
    productName?: string;
    customerName?: string;
    customerPhone?: string;
    customerEmail?: string;
    amount?: number;
    duration?: number;
    details?: Record<string, any>;
  } = {},
): void {
  if (typeof window === "undefined") return;

  const titleMap: Record<AnalyticsEventType, string> = {
    banner_click: "کلیک روی بنر تبلیغاتی هیرو",
    product_view: `مشاهده محصول: ${payload.productName || payload.productSlug || ""}`,
    checkout_view: `ورود به صفحه پرداخت: ${payload.productName || ""}`,
    checkout_submit: `ثبت سفارش خریدار: ${payload.customerName || ""} (${payload.customerPhone || ""})`,
    planner_scroll: "اسکرول و مشاهده بخش پلنرها",
    session_duration: `مدت ماندن در سایت: ${payload.duration || 0} ثانیه`,
    page_view: `بازدید صفحه: ${window.location.pathname}`,
  };

  const event: AnalyticsEvent = {
    id: `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    type,
    title: payload.title || titleMap[type] || "فعالیت کاربر",
    path: window.location.pathname,
    productSlug: payload.productSlug,
    productName: payload.productName,
    customerName: payload.customerName,
    customerPhone: payload.customerPhone,
    customerEmail: payload.customerEmail,
    amount: payload.amount,
    duration: payload.duration,
    device: getDeviceType(),
    referrer: getReferrerSource(),
    timestamp: new Date().toISOString(),
    details: payload.details,
  };

  // 1. Save locally for instant rendering in admin
  saveEventLocally(event);

  // 2. Transmit to server in the background
  sendEventToServer(event);
}

/**
 * Retrieve local events for dashboard
 */
export function getStoredAnalytics(): AnalyticsEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearStoredAnalytics(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("vaich_analytics_new_event"));
  } catch {}
}

/**
 * Initializes ultra-lightweight session duration tracker
 */
let isSessionTrackerActive = false;
export function initSessionTracking(): () => void {
  if (typeof window === "undefined" || isSessionTrackerActive) return () => {};
  isSessionTrackerActive = true;

  const sessionStart = Date.now();
  let reported = false;

  const reportDuration = () => {
    if (reported) return;
    const durationSeconds = Math.round((Date.now() - sessionStart) / 1000);
    if (durationSeconds >= 2) {
      reported = true;
      trackEvent("session_duration", {
        duration: durationSeconds,
        title: `حضور ${durationSeconds} ثانیه‌ای در سایت`,
      });
    }
  };

  // Track on tab hide or window unload
  const onVisibilityChange = () => {
    if (document.visibilityState === "hidden") {
      reportDuration();
    }
  };

  window.addEventListener("visibilitychange", onVisibilityChange);
  window.addEventListener("pagehide", reportDuration);
  window.addEventListener("beforeunload", reportDuration);

  return () => {
    reportDuration();
    window.removeEventListener("visibilitychange", onVisibilityChange);
    window.removeEventListener("pagehide", reportDuration);
    window.removeEventListener("beforeunload", reportDuration);
    isSessionTrackerActive = false;
  };
}
