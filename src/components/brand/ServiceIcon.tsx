import { cn } from "@/lib/utils";

export function ServiceIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const common = "h-8 w-8";

  if (slug === "gemini") {
    return (
      <span
        className={cn(
          "grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-border bg-secondary/60",
          className
        )}
      >
        <img
          src="/gemini-logo.png"
          alt="Gemini"
          className="h-9 w-9 object-contain"
        />
      </span>
    );
  }

  const icon = () => {
    switch (slug) {
      case "chatgpt":
        return (
          <>
            <circle
              cx="12"
              cy="12"
              r="8.4"
              stroke="currentColor"
              strokeWidth="1.6"
              fill="none"
            />
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
            <path
              d="M9.2 14.4h5.6"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </>
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
      <svg viewBox="0 0 24 24" className={common} aria-hidden="true">
        {icon()}
      </svg>
    </span>
  );
              }
