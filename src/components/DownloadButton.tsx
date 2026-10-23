import { useQuery } from "@tanstack/react-query";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { releaseInfoQueryOptions, GITHUB_RELEASES_URL } from "@/lib/release-info";
import { trackDownloadClick, type DownloadSource } from "@/lib/download-tracking";
import { formatBytes } from "@/lib/installer";
import { cn } from "@/lib/utils";

interface DownloadButtonProps {
  /** Button placement, recorded with the anonymous click event. */
  source: DownloadSource;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** Show the resolved installer name + size underneath the button. */
  showMeta?: boolean;
}

/**
 * The one true download action. Resolves the latest Windows installer from
 * GitHub Releases at render time; while nothing is published (or GitHub is
 * unreachable) it links to the Releases page instead — never to a guessed
 * asset URL, and never labeling a ZIP as an EXE.
 */
export function DownloadButton({ source, size = "md", className, showMeta = false }: DownloadButtonProps) {
  const { data, isLoading } = useQuery(releaseInfoQueryOptions);

  const href = data?.downloadUrl ?? data?.releasesUrl ?? GITHUB_RELEASES_URL;
  const meta = isLoading
    ? "Checking the latest release…"
    : data?.available
      ? `${data.fileName} · v${data.version} · ${formatBytes(data.sizeBytes)}`
      : "Latest installer on GitHub Releases";

  return (
    <span className={cn("inline-flex flex-col items-start gap-1.5", className)}>
      <Button
        asChild
        size={size}
        className="group font-semibold"
      >
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackDownloadClick(source, data?.version ?? null, window.location.pathname)}
          aria-label="Download DocuForge for Windows"
        >
          {isLoading ? <Loader2 className="animate-spin" aria-hidden="true" /> : <Download aria-hidden="true" />}
          Download for Windows
        </a>
      </Button>
      {showMeta && (
        <span className="text-xs text-muted-foreground" aria-live="polite">
          {meta}
        </span>
      )}
    </span>
  );
}
