import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { toPersianDigits } from "@/lib/products";
import { cn } from "@/lib/utils";

interface FullscreenGalleryModalProps {
  images: string[];
  initialIndex?: number;
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

export function FullscreenGalleryModal({
  images,
  initialIndex = 0,
  title,
  isOpen,
  onClose,
}: FullscreenGalleryModalProps) {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [zoomed, setZoomed] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const isSwiping = useRef(false);

  useEffect(() => {
    if (isOpen) {
      setActiveIndex(Math.min(Math.max(0, initialIndex), Math.max(0, images.length - 1)));
      setZoomed(false);
      setDragOffset(0);
    }
  }, [isOpen, initialIndex, images.length]);

  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        // In RTL, ArrowLeft advances next; ArrowRight goes prev
        setZoomed(false);
        setActiveIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === "ArrowRight") {
        setZoomed(false);
        setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, images.length, onClose]);

  if (!isOpen || typeof document === "undefined" || images.length === 0) {
    return null;
  }

  const goPrev = () => {
    setZoomed(false);
    setActiveIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goNext = () => {
    setZoomed(false);
    setActiveIndex((prev) => (prev + 1) % images.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomed || images.length <= 1) return;
    touchStartX.current = e.touches[0]?.clientX ?? null;
    touchStartY.current = e.touches[0]?.clientY ?? null;
    isSwiping.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (zoomed || touchStartX.current === null || touchStartY.current === null || images.length <= 1) return;
    const dx = (e.touches[0]?.clientX ?? touchStartX.current) - touchStartX.current;
    const dy = (e.touches[0]?.clientY ?? touchStartY.current) - touchStartY.current;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 10) {
      isSwiping.current = true;
      setDragOffset(dx);
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null) return;
    if (isSwiping.current && Math.abs(dragOffset) > 45) {
      if (dragOffset < 0) {
        goNext();
      } else {
        goPrev();
      }
    }
    touchStartX.current = null;
    touchStartY.current = null;
    isSwiping.current = false;
    setDragOffset(0);
  };

  return createPortal(
    <div
      dir="rtl"
      role="dialog"
      aria-modal="true"
      aria-label={`گالری تمام‌صفحه ${title}`}
      className="fixed inset-0 z-[100000] flex flex-col bg-black/92 backdrop-blur-xl text-white select-none animate-in fade-in duration-150"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Top Control Bar */}
      <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-white/10 bg-black/40">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs sm:text-sm font-bold truncate">{title}</span>
          {images.length > 1 && (
            <span className="rounded-full bg-white/10 border border-white/15 px-2.5 py-0.5 text-[11px] font-semibold shrink-0">
              {toPersianDigits(activeIndex + 1)} از {toPersianDigits(images.length)}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setZoomed((z) => !z)}
            title={zoomed ? "کوچک‌نمایی" : "بزرگ‌نمایی"}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/10 hover:bg-white/20 px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer"
          >
            {zoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            <span className="hidden sm:inline">{zoomed ? "حالت عادی" : "زوم"}</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="بستن گالری تمام‌صفحه"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/10 hover:bg-rose-500/80 hover:border-rose-400 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Viewport */}
      <div
        className="relative flex-1 flex items-center justify-center overflow-hidden p-3 sm:p-8"
        onClick={(e) => {
          if (e.target === e.currentTarget) onClose();
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={goPrev}
              aria-label="تصویر قبلی"
              className="hidden sm:grid absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/60 hover:bg-primary hover:border-primary text-white shadow-lg transition-all cursor-pointer"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={goNext}
              aria-label="تصویر بعدی"
              className="hidden sm:grid absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 h-11 w-11 place-items-center rounded-full border border-white/20 bg-black/60 hover:bg-primary hover:border-primary text-white shadow-lg transition-all cursor-pointer"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
          </>
        )}

        <div
          className={cn(
            "relative flex items-center justify-center max-h-full max-w-full transition-transform duration-200 ease-out",
            zoomed ? "overflow-auto cursor-zoom-out" : "cursor-zoom-in"
          )}
          style={{
            transform: zoomed ? "scale(1.65)" : `translateX(${dragOffset}px)`,
          }}
          onClick={() => setZoomed((z) => !z)}
        >
          <img
            src={images[activeIndex]}
            alt={`${title} - تصویر ${activeIndex + 1}`}
            className="max-h-[76dvh] max-w-[94vw] sm:max-w-[85vw] rounded-2xl object-contain shadow-2xl border border-white/10"
            draggable={false}
          />
        </div>
      </div>

      {/* Bottom Thumbnail Strip / Swipe Hint */}
      <div className="px-4 py-3 sm:py-4 border-t border-white/10 bg-black/50 flex flex-col items-center gap-2.5">
        {images.length > 1 ? (
          <div className="flex items-center justify-center gap-2.5 overflow-x-auto max-w-full">
            {images.map((src, idx) => (
              <button
                key={src + idx}
                type="button"
                onClick={() => {
                  setZoomed(false);
                  setActiveIndex(idx);
                }}
                aria-label={`مشاهده تصویر ${idx + 1}`}
                className={cn(
                  "relative h-14 w-14 sm:h-16 sm:w-16 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer",
                  idx === activeIndex
                    ? "border-primary ring-2 ring-primary/40 scale-105"
                    : "border-white/20 opacity-60 hover:opacity-100"
                )}
              >
                <img src={src} alt={`${title} ${idx + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        ) : null}
        <span className="text-[11px] text-white/60">
          {images.length > 1
            ? "برای جابه‌جایی تصویر به چپ/راست بکشید یا از کلیدهای جهت‌نما استفاده کنید • کلیک روی تصویر برای زوم"
            : "برای بزرگ‌نمایی روی تصویر کلیک کنید • برای بستن ESC یا ضربدر را بزنید"}
        </span>
      </div>
    </div>,
    document.body
  );
}
