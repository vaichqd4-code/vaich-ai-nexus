import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: number;
  withWordmark?: boolean;
  onClick?: () => void;
};

export function Logo({
  className,
  size = 34,
  withWordmark = true,
  onClick,
}: LogoProps) {
  return (
    <Link
      to="/"
      onClick={onClick}
      aria-label="VAICH — صفحه اصلی"
      className={cn("group flex items-center gap-2 shrink-0 select-none", className)}
    >
      <img
        src="/vaich-logo-sm.png"
        alt="لوگوی VAICH"
        width={size}
        height={size}
        decoding="async"
        className="h-7 w-7 sm:h-9 sm:w-9 rounded-xl object-contain transition-transform duration-300 group-hover:scale-105"
      />

      {withWordmark && (
        <span className="gradient-text text-sm sm:text-lg font-black tracking-wider sm:tracking-widest">
          VAICH
        </span>
      )}
    </Link>
  );
}
