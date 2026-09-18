import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { CONTACT_TELEGRAM_ID } from "@/components/brand/ContactLinks";
import { Search } from "lucide-react";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    // هدایت خودکار کاربر به بخش محصولات همراه با عبارت جستجو
    const productsSection = document.getElementById("products");
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate({ to: "/", search: { q: searchQuery } });
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
        <Link to="/" className="flex items-center gap-2">
          <Logo />
        </Link>

        {/* کادر سرچ همیشه حاضر و شیک در هدر بالای سایت */}
        <form
          onSubmit={handleSearch}
          className="relative hidden sm:flex flex-1 max-w-sm items-center"
        >
          <input
            type="text"
            placeholder="جستجوی سرویس یا محصول..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              // ارسال همزمان ایونت برای فیلتر خودکار در صفحه
              window.dispatchEvent(
                new CustomEvent("header-search", { detail: e.target.value })
              );
            }}
            className="w-full rounded-full border border-border bg-background/60 py-1.5 pl-9 pr-4 text-xs outline-none transition-colors focus:border-neon-blue/70"
          />
          <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        </form>

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
