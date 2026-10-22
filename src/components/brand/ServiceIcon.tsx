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
  if (iconUrl && iconUrl.trim().length > 0) return iconUrl.trim();
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
  imageFit = "contain",
}: {
  slug: string;
  iconUrl?: string;
  className?: string;
  imgClassName?: string;
  imageFit?: "contain" | "cover";
}) {
  const logo = getProductLogo(slug, iconUrl);
  const cleanSlug = slug ? slug.replace(/^vaich[-_]?/i, "") : "";
  const initial = cleanSlug ? cleanSlug.charAt(0).toUpperCase() : "AI";

  return (
    <span
      className={cn(
        "grid h-14 w-14 shrink-0 place-items-center rounded-2xl border border-border/80 bg-linear-to-b from-secondary/70 to-secondary/40 shadow-[0_0_28px_-16px_var(--neon-blue)] transition-all overflow-hidden",
        imageFit === "cover" ? "p-0" : "p-2",
        className,
      )}
    >
      {logo ? (
        <img
          src={logo}
          alt={slug}
          width={96}
          height={96}
          decoding="async"
          className={cn(
            imageFit === "cover"
              ? "h-full w-full object-cover"
              : "max-h-full max-w-full rounded-xl object-contain drop-shadow-sm",
            imgClassName,
          )}
          loading="lazy"
        />
      ) : (
        <span className="text-neon-blue text-lg font-black">
          {initial}
        </span>
      )}
    </span>
  );
}
