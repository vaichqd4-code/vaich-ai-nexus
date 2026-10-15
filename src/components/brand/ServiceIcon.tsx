import { cn } from "@/lib/utils";

export const PRESET_LOGOS: Record<string, string> = {
  gemini: "/gemini-logo.webp",
  "gemini-pro": "/gemini-pro-logo.webp",
  chatgpt: "/chatgpt-logo.webp",
  "chatgpt-plus": "/chatgpt-logo.webp",
  "اشتراک chatgpt plus شخصی": "/chatgpt-logo.webp",
  claude: "/Claude-.webp",
  "claude-pro": "/Claude-.webp",
};

export function getProductLogo(slug: string, iconUrl?: string): string | undefined {
  if (iconUrl) return iconUrl;
  if (!slug) return undefined;
  if (PRESET_LOGOS[slug]) return PRESET_LOGOS[slug];

  const sLower = slug.toLowerCase();
  if (sLower.includes("gemini")) return PRESET_LOGOS["gemini-pro"];
  if (sLower.includes("chatgpt") || sLower.includes("gpt")) return PRESET_LOGOS["chatgpt"];
  if (sLower.includes("claude")) return PRESET_LOGOS["claude"];
  return undefined;
}

export function ServiceIcon({
  slug,
  iconUrl,
  className,
  imgClassName,
}: {
  slug: string;
  iconUrl?: string;
  className?: string;
  imgClassName?: string;
}) {
  const logo = getProductLogo(slug, iconUrl);
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
          width={40}
          height={40}
          decoding="async"
          className={cn("h-10 w-10 rounded-xl object-contain", imgClassName)}
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
