import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  ArrowRight,
  Combine,
  Download,
  FileDown,
  Github,
  ListOrdered,
  ScanText,
  Scissors,
  ShieldCheck,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { DownloadButton } from "@/components/DownloadButton";
import { GITHUB_REPO_URL } from "@/lib/release-info";
import heroAppPreview from "@/assets/hero-app-preview.png";
import showcaseOrganize from "@/assets/showcase-organize.png";
import showcaseOcr from "@/assets/showcase-ocr.png";

export const Route = createFileRoute("/_marketing/")({
  component: IndexPage,
  head: () => ({
    meta: [
      { title: "DocuForge — PDF & document tools for Windows" },
      {
        name: "description",
        content:
          "Merge, split, organize, convert, OCR and compress PDFs — offline, private and fast. Download DocuForge for Windows, powered by RazaZaidi.AI.",
      },
      { property: "og:title", content: "DocuForge — PDF & document tools for Windows" },
      {
        property: "og:description",
        content:
          "Merge, split, organize, convert, OCR and compress PDFs — offline, private and fast. Download DocuForge for Windows.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "DocuForge — PDF & document tools for Windows" },
      {
        name: "twitter:description",
        content: "Offline-first PDF utilities for Windows. Powered by RazaZaidi.AI.",
      },
    ],
  }),
});

const features = [
  {
    icon: Combine,
    title: "Merge PDFs",
    body: "Combine multiple documents into one, in the exact order you choose.",
  },
  {
    icon: Scissors,
    title: "Split PDFs",
    body: "Extract the pages you need or break a document into separate files.",
  },
  {
    icon: ListOrdered,
    title: "Organize pages",
    body: "Reorder, rotate, or remove pages with a clear page-by-page view.",
  },
  {
    icon: ArrowLeftRight,
    title: "Document conversions",
    body: "Move your documents between the formats your workflow needs.",
  },
  {
    icon: ScanText,
    title: "OCR text recognition",
    body: "Turn scanned pages into searchable, selectable, copyable text.",
  },
  {
    icon: FileDown,
    title: "Compression",
    body: "Shrink large files while keeping your documents crisp and readable.",
  },
];

const steps = [
  {
    number: "01",
    title: "Download",
    body: "Get the Windows installer straight from DocuForge's GitHub Releases — no account, no email required.",
  },
  {
    number: "02",
    title: "Install",
    body: "Run the setup like any other Windows application. DocuForge installs locally on your machine.",
  },
  {
    number: "03",
    title: "Start using it",
    body: "Open a PDF, pick a tool, done. Everything runs on your computer — your files never leave it.",
  },
];

function IndexPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-[-10%] size-[480px] rounded-full bg-gold-soft opacity-50 blur-3xl"
        />
        <div className="container-page relative grid items-center gap-12 py-16 md:py-24 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-paper">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-gold" />
                Powered by RazaZaidi.AI
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-balance md:text-6xl">
                Your documents.
                <br />
                Your workflow.
                <br />
                <span className="text-primary">Your control.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                DocuForge brings merge, split, organize, conversion, OCR and compression
                tools together in one offline-first Windows app. Your files stay on your
                machine — always.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <DownloadButton source="hero" size="lg" showMeta />
                <Link
                  to="/"
                  hash="features"
                  className="inline-flex h-12 items-center gap-2 rounded-lg px-4 text-sm font-semibold text-foreground transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-ring"
                >
                  Explore features
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="size-4 text-gold" aria-hidden="true" />
                Free download · Runs fully offline · Windows 10 & 11
              </p>
            </Reveal>
          </div>

          <Reveal delay={0.2} y={32}>
            <figure className="relative mx-auto w-full max-w-xl">
              <div
                aria-hidden="true"
                className="absolute inset-0 translate-x-3 translate-y-3 rounded-2xl border border-border bg-card"
              />
              <img
                src={heroAppPreview}
                alt="Illustrative preview of the DocuForge desktop app merging three PDF documents into one"
                width={1600}
                height={1008}
                className="relative w-full rounded-2xl border border-border shadow-lift"
              />
              <figcaption className="mt-3 text-center text-xs text-muted-foreground">
                Illustrative preview of the DocuForge workspace
              </figcaption>
            </figure>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border bg-secondary/50 py-20 md:py-28">
        <div className="container-page">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Features</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              Every document tool, one quiet workspace
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              The utilities people reach for every day — built into a single Windows
              application that works without an internet connection.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <Reveal key={f.title} delay={0.06 * i}>
                <article className="group h-full rounded-xl border border-border bg-card p-6 shadow-paper transition-all hover:-translate-y-1 hover:shadow-lift">
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <f.icon className="size-5" aria-hidden="true" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 md:py-28">
        <div className="container-page">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">How it works</p>
            <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">
              Ready in three steps
            </h2>
          </Reveal>
          <ol className="mt-12 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.number} delay={0.08 * i}>
                <li className="relative h-full rounded-xl border border-border bg-card p-7 shadow-paper">
                  <span className="font-display text-4xl font-semibold text-gold">{s.number}</span>
                  <h3 className="mt-4 font-display text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Product showcase */}
      <section className="border-y border-border bg-secondary/50 py-20 md:py-28">
        <div className="container-page">
          <Reveal>
            <p className="text-sm font-semibold uppercase tracking-widest text-gold">Product showcase</p>
            <h2 className="mt-3 max-w-xl font-display text-4xl font-semibold tracking-tight text-balance md:text-5xl">
              A calm place to get document work done
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-10 lg:grid-cols-2">
            <Reveal>
              <figure>
                <img
                  src={showcaseOrganize}
                  alt="Illustrative preview of the DocuForge document manager with merge, split, organize and compress tools"
                  width={1600}
                  height={1008}
                  loading="lazy"
                  className="w-full rounded-2xl border border-border shadow-lift"
                />
                <figcaption className="mt-3 text-sm text-muted-foreground">
                  Organize and act on whole libraries of PDFs — illustrative preview.
                </figcaption>
              </figure>
            </Reveal>
            <Reveal delay={0.12}>
              <figure>
                <img
                  src={showcaseOcr}
                  alt="Illustrative preview of DocuForge recognizing text in a scanned letter with OCR and compressing the file"
                  width={1600}
                  height={1008}
                  loading="lazy"
                  className="w-full rounded-2xl border border-border shadow-lift"
                />
                <figcaption className="mt-3 text-sm text-muted-foreground">
                  OCR turns scans into editable text; compression keeps files light — illustrative preview.
                </figcaption>
              </figure>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Download */}
      <section id="download" className="py-20 md:py-28">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-10 text-center shadow-lift md:p-14">
              <span className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <Download className="size-6" aria-hidden="true" />
              </span>
              <h2 className="mt-6 font-display text-4xl font-semibold tracking-tight text-balance">
                Download DocuForge for Windows
              </h2>
              <p className="mx-auto mt-4 max-w-md text-muted-foreground">
                One installer, straight from the official GitHub Releases. No sign-up,
                no telemetry, no upsell — just the app.
              </p>
              <div className="mt-8 flex flex-col items-center">
                <DownloadButton source="download" size="lg" showMeta />
              </div>
              <a
                href={GITHUB_REPO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
              >
                <Github className="size-4" aria-hidden="true" />
                View the project on GitHub
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* About strip */}
      <section className="border-t border-border bg-secondary/50 py-16">
        <div className="container-page flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <Reveal>
            <div>
              <h2 className="font-display text-2xl font-semibold tracking-tight">Built with intent</h2>
              <p className="mt-2 max-w-xl text-muted-foreground">
                DocuForge is developed by RazaZaidi.AI with a simple principle: your
                documents belong to you. Learn more about the project and its
                offline-first approach.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              to="/about"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg border border-input bg-card px-5 text-sm font-semibold text-foreground shadow-paper transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring"
            >
              About DocuForge
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
