import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { DownloadButton } from "@/components/DownloadButton";
import { cn } from "@/lib/utils";

const sectionLinks = [
  { label: "Features", hash: "features" },
  { label: "How It Works", hash: "how-it-works" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinkClass =
    "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring";

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-md">
      <nav className="container-page flex h-16 items-center justify-between gap-4" aria-label="Main">
        <Link to="/" className="rounded-md focus-visible:outline-2 focus-visible:outline-ring" aria-label="DocuForge home">
          <Logo />
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {sectionLinks.map((l) => (
            <Link key={l.hash} to="/" hash={l.hash} className={navLinkClass}>
              {l.label}
            </Link>
          ))}
          <Link to="/privacy" className={navLinkClass}>
            Privacy
          </Link>
          <Link to="/about" className={navLinkClass}>
            About
          </Link>
        </div>

        <div className="hidden md:block">
          <DownloadButton source="navbar" size="sm" />
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg text-foreground hover:bg-accent md:hidden focus-visible:outline-2 focus-visible:outline-ring"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile panel */}
      {open && (
        <div id="mobile-nav" className="border-t border-border/70 bg-background md:hidden">
          <div className="container-page flex flex-col gap-1 py-3">
            {sectionLinks.map((l) => (
              <Link key={l.hash} to="/" hash={l.hash} className={cn(navLinkClass, "px-3 py-2.5")} onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <Link to="/privacy" className={cn(navLinkClass, "px-3 py-2.5")} onClick={() => setOpen(false)}>
              Privacy
            </Link>
            <Link to="/about" className={cn(navLinkClass, "px-3 py-2.5")} onClick={() => setOpen(false)}>
              About
            </Link>
            <div className="mt-2 pb-2">
              <DownloadButton source="navbar" className="w-full" />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
