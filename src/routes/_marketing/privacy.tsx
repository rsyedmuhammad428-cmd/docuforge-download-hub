import { createFileRoute, Link } from "@tanstack/react-router";
import { Database, FileLock2, Server } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { GITHUB_REPO_URL } from "@/lib/release-info";

export const Route = createFileRoute("/_marketing/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy · DocuForge" },
      {
        name: "description",
        content:
          "DocuForge privacy policy: your documents are processed locally, the website stores only anonymous download-button counts, and the app contains no telemetry.",
      },
      { property: "og:title", content: "Privacy Policy · DocuForge" },
      {
        property: "og:description",
        content:
          "Your documents are processed locally. The website stores only anonymous download-button counts. No hidden desktop telemetry.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const sections = [
  {
    icon: FileLock2,
    title: "Your documents stay yours",
    body: [
      "DocuForge is offline-first. The documents you open — and the files it produces — are processed and stored locally on your Windows machine.",
      "DocuForge does not upload your documents to a DocuForge server, because there is no DocuForge document server. No copies of your files are made anywhere else.",
    ],
  },
  {
    icon: Server,
    title: "No hidden desktop telemetry",
    body: [
      "The DocuForge application contains no hidden analytics, tracking SDKs, or background reporting. It does not phone home with usage data about how you work with your documents.",
      "If the app checks for a newer release through GitHub's public releases feed, that check is a plain request to GitHub — GitHub handles that data under its own privacy policy.",
    ],
  },
  {
    icon: Database,
    title: "What this website stores",
    body: [
      "This website records one anonymous counter when a visitor presses a download button: which button placement was pressed, which installer version it pointed to, and the page it happened on. Nothing else — no IP addresses, no cookies for tracking, no visitor profiles, and no data that can identify you.",
      "These counts exist for one reason: to show the developer which download links people actually use. They are never sold or shared.",
      "Downloads themselves are hosted on GitHub Releases. When you download the installer, GitHub processes the request under GitHub's privacy policy.",
    ],
  },
];

function PrivacyPage() {
  return (
    <div className="container-page py-16 md:py-24">
      <Reveal>
        <p className="text-sm font-semibold uppercase tracking-widest text-gold">Privacy</p>
        <h1 className="mt-3 max-w-2xl font-display text-4xl font-semibold tracking-tight text-balance md:text-5xl">
          Privacy, in plain language
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          DocuForge was built around a simple promise: your documents are yours.
          This page explains exactly what the app does — and doesn't — do with
          your data.
        </p>
      </Reveal>

      <div className="mt-12 max-w-3xl space-y-5">
        {sections.map((s, i) => (
          <Reveal key={s.title} delay={0.05 * i}>
            <section className="rounded-xl border border-border bg-card p-7 shadow-paper">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                  <s.icon className="size-5" aria-hidden="true" />
                </span>
                <h2 className="font-display text-xl font-semibold">{s.title}</h2>
              </div>
              {s.body.map((paragraph) => (
                <p key={paragraph} className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </section>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.2}>
        <p className="mt-10 max-w-3xl text-sm text-muted-foreground">
          Questions about this policy? Reach the maintainer through the{" "}
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring"
          >
            DocuForge repository on GitHub
          </a>
          . This page describes the DocuForge website and desktop app; see also the{" "}
          <Link to="/about" className="font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-ring">
            About page
          </Link>
          .
        </p>
      </Reveal>
    </div>
  );
}
