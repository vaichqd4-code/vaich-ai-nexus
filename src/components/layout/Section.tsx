import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Section({
  id,
  title,
  subtitle,
  children,
  className,
}: {
  id?: string;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20", className)}>
      {title ? (
        <header className="mb-10 max-w-2xl">
          <h2 className="text-2xl font-extrabold sm:text-3xl">{title}</h2>
          {subtitle ? (
            <p className="mt-3 text-sm leading-8 text-muted-foreground sm:text-base">{subtitle}</p>
          ) : null}
        </header>
      ) : null}
      {children}
    </section>
  );
}
