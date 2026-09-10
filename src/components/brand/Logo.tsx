import { Link } from "@tanstack/react-router";
import logo from "@/assets/vaich-logo.png.asset.json";
import { cn } from "@/lib/utils";

type LogoProps = {
  className?: string;
  size?: number;
  withWordmark?: boolean;
};

export function Logo({ className, size = 40, withWordmark = true }: LogoProps) {
  return (
    <Link
      to="/"
      aria-label="VAICH — صفحه اصلی"
      className={cn("group flex items-center gap-2.5", className)}
    >
      <img
        src={logo.url}
        alt="لوگوی VAICH"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="rounded-xl object-contain transition-transform duration-300 group-hover:scale-105"
      />
      {withWordmark ? (
        <span className="gradient-text text-lg font-extrabold tracking-[0.25em]">VAICH</span>
      ) : null}
    </Link>
  );
}
