import { cn } from "@/lib/utils";

export const PRESET_LOGOS: Record<string, string> = {
  gemini: "/gemini-60d-icon.webp",
  "gemini-pro": "/gemini-pro-18m-icon.webp",
  chatgpt: "/chatgpt-logo.svg",
  "chatgpt-plus": "/chatgpt-logo.svg",
  "اشتراک chatgpt plus شخصی": "/chatgpt-logo.svg",
  claude: "/claude-icon.webp",
  "claude-pro": "/claude-icon.webp",
  copilot: "/microsoft-copilot-logo.svg",
  "microsoft-copilot-pro": "/microsoft-copilot-logo.svg",
};

export function getProductLogo(slug: string, iconUrl?: string): string | undefined {
  if (iconUrl && iconUrl.trim().length > 0) {
    const raw = iconUrl.trim();
    if (raw.includes("Claude-") || raw.includes("claude-icon") || raw.toLowerCase().includes("claude")) return "/claude-icon.webp";
    if (raw.toLowerCase().includes("copilot")) return "/microsoft-copilot-logo.svg";
    if (raw.includes("377481f6") || raw.includes("gemini-pro-18m-icon") || raw.includes("gemini-pro")) return "/gemini-pro-18m-icon.webp";
    if (raw.includes("7ea4822f") || raw.includes("gemini-60d-icon") || raw.includes("gemini")) return "/gemini-60d-icon.webp";
    return raw;
  }
  if (!slug) return undefined;
  if (PRESET_LOGOS[slug]) return PRESET_LOGOS[slug];

  const sLower = slug.toLowerCase();
  if (sLower === "gemini-pro" || sLower.includes("gemini-pro") || sLower.includes("18")) return PRESET_LOGOS["gemini-pro"];
  if (sLower === "gemini" || sLower.includes("gemini")) return PRESET_LOGOS["gemini"];
  if (sLower.includes("chatgpt") || sLower.includes("gpt")) return PRESET_LOGOS["chatgpt"];
  if (sLower.includes("claude")) return PRESET_LOGOS["claude"];
  if (sLower.includes("copilot")) return PRESET_LOGOS["copilot"];
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
  iconUrl?: string | undefined;
  className?: string | undefined;
  imgClassName?: string | undefined;
  imageFit?: ("contain" | "cover") | undefined;
}) {
  const logo = getProductLogo(slug, iconUrl);
  const cleanSlug = slug ? slug.replace(/^vaich[-_]?/i, "") : "";
  const initial = cleanSlug ? cleanSlug.charAt(0).toUpperCase() : "AI";

  return (
    <span
      className={cn(
        "grid h-14 w-14 shrink-0 place-items-center rounded-2xl sm:rounded-3xl border border-border/80 bg-linear-to-b from-secondary/70 to-secondary/40 shadow-[0_0_28px_-16px_var(--neon-blue)] transition-all overflow-hidden",
        imageFit === "cover" ? "p-0" : "p-1.5 sm:p-2",
        className,
      )}
      style={{
        WebkitMaskImage: "-webkit-radial-gradient(white, black)",
        maskImage: "radial-gradient(white, black)",
        transform: "translateZ(0)",
      }}
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
              ? "h-full w-full object-cover rounded-2xl sm:rounded-3xl"
              : "h-full w-full rounded-2xl sm:rounded-3xl overflow-hidden object-contain drop-shadow-sm",
            imgClassName,
          )}
          style={{
            WebkitMaskImage: "-webkit-radial-gradient(white, black)",
            maskImage: "radial-gradient(white, black)",
            transform: "translateZ(0)",
          }}
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
