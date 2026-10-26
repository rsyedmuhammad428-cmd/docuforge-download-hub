import { Link } from "@tanstack/react-router";
import { Github } from "lucide-react";
import { Logo } from "@/components/Logo";
import { DownloadButton } from "@/components/DownloadButton";
import { GITHUB_REPO_URL } from "@/lib/release-info";

export function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <Logo className="text-background" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/70">
            PDF and document utilities for Windows — fast, private, and offline-first.
          </p>
          <p className="mt-3 text-sm font-medium text-gold">Powered by RazaZaidi.AI</p>
        </div>

        <nav aria-label="Footer">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-background/50">Site</h2>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <Link to="/" hash="features" className="text-background/80 transition-colors hover:text-background focus-visible:outline-2 focus-visible:outline-ring">
                Features
              </Link>
            </li>
            <li>
              <Link to="/" hash="how-it-works" className="text-background/80 transition-colors hover:text-background focus-visible:outline-2 focus-visible:outline-ring">
                How It Works
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="text-background/80 transition-colors hover:text-background focus-visible:outline-2 focus-visible:outline-ring">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/about" className="text-background/80 transition-colors hover:text-background focus-visible:outline-2 focus-visible:outline-ring">
                About
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-background/50">Get DocuForge</h2>
          <div className="mt-4">
            <DownloadButton source="footer" className="w-full" />
          </div>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-background/80 transition-colors hover:text-background focus-visible:outline-2 focus-visible:outline-ring"
              >
                <Github className="size-4" aria-hidden="true" />
                GitHub repository
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-background/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-6 text-xs text-background/60 sm:flex-row">
          <p>© {new Date().getFullYear()} DocuForge. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              to="/auth"
              className="text-background/60 underline-offset-4 transition-colors hover:text-background hover:underline focus-visible:outline-2 focus-visible:outline-ring"
            >
              Admin Login
            </Link>
            <p>Downloads are hosted on GitHub Releases.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
