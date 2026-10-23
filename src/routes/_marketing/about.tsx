import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Github, Lock, ShieldCheck, WifiOff } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { DownloadButton } from "@/components/DownloadButton";
import { GITHUB_REPO_URL } from "@/lib/release-info";

export const Route = createFileRoute("/_marketing/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About · DocuForge" },
      {
        name: "description",
        content: "Meet DocuForge, the offline-first PDF utility app for Windows from RazaZaidi.AI — and the principles behind it.",
      },
      { property: "og:title", content: "About · DocuForge" },
      {
        property: "og:description",
        content: "Meet DocuForge, the offline-first PDF utility app for Windows from RazaZaidi.AI.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const principles = [
  {
    icon: WifiOff,
    title: "Offline-first",
    body: "DocuForge is designed to work without an internet connection. Your documents are processed locally, on your machine.",
  },
  {
    icon: Lock,
    title: "Private by default",
    body: "No accounts to create, no files to upload, no hidden desktop telemetry. What happens in DocuForge stays in DocuForge.",
  },
  {
    icon: ShieldCheck,
    title: "Honest downloads",
    body: "Installers are distributed through official GitHub Releases, so every download is verifiable and version-pinned.",
  },
];

function AboutPage() {
  return (
    <div className="container-page py-16 md:py-24">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">About</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          Document tools that respect the person using them
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          DocuForge is a Windows desktop application that gathers the everyday PDF
          utilities — merging, splitting, organizing pages, converting between
          formats, OCR text recognition, and compression — into one calm,
          well-crafted workspace.
        </p>
        <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          It exists because document work shouldn't require uploading your private
          files to a stranger's web server. DocuForge runs entirely on your
          computer, works offline, and keeps the experience simple: open a file,
          choose a tool, get on with your day.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-12 rounded-2xl border border-border bg-card p-8 shadow-lift md:p-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">Built by</p>
          <p className="mt-2 font-display text-3xl font-semibold tracking-tight">
            RazaZaidi<span className="text-gold">.AI</span>
          </p>
          <p className="mt-3 max-w-xl text-muted-foreground">
            DocuForge is designed, built, and maintained by RazaZaidi.AI — an
            independent software project with a focus on useful, honest desktop
            tools.
          </p>
        </div>
      </Reveal>

      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {principles.map((p, i) => (
          <Reveal key={p.title} delay={0.06 * i}>
            <article className="h-full rounded-xl border border-border bg-card p-6 shadow-paper">
              <span className="inline-flex size-11 items-center justify-center rounded-lg bg-secondary text-primary">
                <p.icon className="size-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-display text-lg font-semibold">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
            </article>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.15}>
        <div className="mt-14 flex flex-wrap items-center gap-4">
          <DownloadButton source="hero" size="lg" showMeta />
          <Link
            to="/privacy"
            className="inline-flex h-12 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
          >
            Read the privacy policy
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Github className="size-4" aria-hidden="true" />
            GitHub
          </a>
        </div>
      </Reveal>
    </div>
  );
}
