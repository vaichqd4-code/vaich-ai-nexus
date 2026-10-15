import { cn } from "@/lib/utils";

export function ServiceIcon({
  slug,
  iconUrl,
  className,
}: {
  slug: string;
  iconUrl?: string;
  className?: string;
}) {
  const logos: Record<string, string> = {
    gemini: "/file_000000007ea4822f9eac5c00be6be9eb.png",
    "gemini-pro": "/file_00000000377481f6b667af886cd18fb6.png",
    chatgpt: "/ChatGPT-Logo-500x281.jpg",
    "chatgpt-plus": "/ChatGPT-Logo-500x281.jpg",
    "اشتراک chatgpt plus شخصی": "/ChatGPT-Logo-500x281.jpg",
    claude: "/Claude-.webp",
    "claude-pro": "/Claude-.webp",
  };

  const sLower = slug.toLowerCase();
  let logo = iconUrl || logos[slug];

  if (!logo) {
    if (sLower.includes("gemini")) {
      logo = logos["gemini-pro"];
    } else if (sLower.includes("chatgpt") || sLower.includes("gpt")) {
      logo = logos["chatgpt"];
    } else if (sLower.includes("claude")) {
      logo = logos["claude"];
    }
  }

  const initial = slug ? slug.charAt(0).toUpperCase() : "AI";

  return (
    <span
      className={cn(
        "grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-border/80 bg-secondary/60 shadow-[0_0_28px_-16px_var(--neon-blue)] transition-all",
        className,
      )}
    >
      {logo ? (
        <img
          src={logo}
          alt={slug}
          className="h-10 w-10 rounded-xl object-cover"
          loading="lazy"
        />
      ) : (
        <span className="text-neon-blue text-xl font-black">
          {initial}
        </span>
      )}
    </span>
  );
}
