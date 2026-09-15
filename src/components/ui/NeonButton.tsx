import { createLink } from "@tanstack/react-router";
import { forwardRef, type ComponentProps, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg" | "xl";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "neon-gradient text-primary-foreground shadow-[0_0_30px_-12px_var(--neon-purple)] hover:shadow-[0_0_38px_-8px_var(--neon-blue)] hover:brightness-110 active:scale-[0.98]",
  outline:
    "border border-border bg-secondary/40 text-foreground backdrop-blur-sm hover:border-neon-blue/60 hover:bg-secondary/70 active:scale-[0.98]",
  ghost: "text-muted-foreground hover:text-foreground",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-5 text-sm",
  md: "h-13 px-8 text-sm",
  lg: "h-14 px-10 text-base",
  xl: "h-16 px-10 text-lg",
};

export function neonButtonClass(
  variant: Variant = "primary",
  size: Size = "md",
  className?: string,
) {
  return cn(base, variants[variant], sizes[size], className);
}

type ButtonProps = ComponentProps<"button"> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function NeonButton({ variant, size, className, children, ...props }: ButtonProps) {
  return (
    <button className={neonButtonClass(variant, size, className)} {...props}>
      {children}
    </button>
  );
}

type AnchorProps = ComponentProps<"a"> & { variant?: Variant; size?: Size };

const NeonAnchor = forwardRef<HTMLAnchorElement, AnchorProps>(
  ({ variant, size, className, ...props }, ref) => (
    <a ref={ref} className={neonButtonClass(variant, size, className)} {...props} />
  ),
);
NeonAnchor.displayName = "NeonAnchor";

export const NeonLink = createLink(NeonAnchor);
