import { cn } from "@/lib/utils";

export function ServiceIcon({
  slug,
  className,
}: {
  slug: string;
  className?: string;
}) {
  const logos: Record<string, string> = {
    gemini: "/file_000000007ea4822f9eac5c00be6be9eb.png",
    "gemini-pro": "/file_00000000377481f6b667af886cd18fb6.png",
    chatgpt: "/ChatGPT-Logo-500x281.jpg",
    "chatgpt-plus": "/ChatGPT-Logo-500x281.jpg",
    claude: "/Claude-.webp",
  };

  const logo = logos[slug];

  return (
    <span
      className={cn(
        "grid h-14 w-14 shrink-0 place-items-center rounded-full border border-border bg-secondary/60 shadow-[0_0_28px_-16px_var(--neon-blue)]",
        className,
      )}
    >
      {logo ? (
        <img
          src={logo}
          alt={slug}
          className="h-10 w-10 rounded-full object-cover"
        />
      ) : (
        <span className="text-neon-blue text-2xl font-bold">
          A
        </span>
      )}
    </span>
  );
}
