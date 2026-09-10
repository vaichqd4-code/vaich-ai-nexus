import { cn } from "@/lib/utils";

/** Simple abstract marks for each AI service — no third-party trademarks used. */
export function ServiceIcon({ slug, className }: { slug: string; className?: string }) {
  const common = "h-7 w-7";
  const icon = () => {
    switch (slug) {
      case "gemini":
        return (
          <path
            d="M12 2c.6 5.2 4.2 8.8 9.4 9.4v1.2C16.2 13.2 12.6 16.8 12 22c-.6-5.2-4.2-8.8-9.4-9.4v-1.2C7.8 10.8 11.4 7.2 12 2Z"
            fill="currentColor"
          />
        );
      case "chatgpt":
        return (
          <>
            <circle cx="12" cy="12" r="8.4" stroke="currentColor" strokeWidth="1.6" fill="none" />
            <path
              d="M12 3.6v16.8M3.6 12h16.8"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.55"
            />
          </>
        );
      default:
        return (
          <>
            <path
              d="M7 19 12 5l5 14"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
            <path d="M9.2 14.4h5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </>
        );
    }
  };

  return (
    <span
      className={cn(
        "grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-border bg-secondary/60 text-neon-blue shadow-[0_0_28px_-16px_var(--neon-blue)]",
        className,
      )}
    >
      <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
        {icon()}
      </svg>
    </span>
  );
}
