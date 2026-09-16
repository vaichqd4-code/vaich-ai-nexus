import { cn } from "@/lib/utils";

export function ServiceIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const common = "h-8 w-8";

  const icon = () => {
    switch (slug) {
      case "gemini":
        return (
          <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
            <path
              d="M12 2C12.8 7.3 16.7 11.2 22 12C16.7 12.8 12.8 16.7 12 22C11.2 16.7 7.3 12.8 2 12C7.3 11.2 11.2 7.3 12 2Z"
              fill="currentColor"
            />
          </svg>
        );

      case "chatgpt":
        return (
          <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
            <path
              d="M12 4.2a4.5 4.5 0 0 1 4.2 2.9 4.5 4.5 0 0 1 2.1 7.9 4.5 4.5 0 0 1-6.5 4.8 4.5 4.5 0 0 1-7.3-5.4 4.5 4.5 0 0 1 2.7-7.7A4.5 4.5 0 0 1 12 4.2Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              d="m8.1 8.2 7.8 4.5m-9.3.7 7.8-4.5m-4.2 8.3V8.2m4.2 7.4-7.8-4.5m9.3-.7-7.8 4.5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.35"
              strokeLinecap="round"
            />
          </svg>
        );

      case "claude":
        return (
          <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
            <path
              d="M6.5 20 12 4l5.5 16M8.7 14.2h6.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );

      default:
        return (
          <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
            <path
              d="M12 3v18M3 12h18"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        );
    }
  };

  return (
    <span
      className={cn(
        "grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-border bg-secondary/60 text-neon-blue shadow-[0_0_28px_-16px_var(--neon-blue)]",
        className
      )}
    >
      {icon()}
    </span>
  );
}
