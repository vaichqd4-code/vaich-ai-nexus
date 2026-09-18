import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/Logo";
import { CONTACT_TELEGRAM_ID } from "@/components/brand/ContactLinks";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        <nav className="flex items-center gap-4 text-xs font-medium">
          <Link
            to="/why"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            چرا ما؟
          </Link>
          <Link
            to="/faq"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            سوالات متداول
          </Link>
          <a
            href={`https://t.me/${CONTACT_TELEGRAM_ID}`}
            target="_blank"
            rel="noreferrer"
            className="rounded-full bg-neon-blue/10 px-3 py-1.5 text-neon-blue transition-colors hover:bg-neon-blue/20"
          >
            پشتیبانی
          </a>
        </nav>
      </div>
    </header>
  );
    }
