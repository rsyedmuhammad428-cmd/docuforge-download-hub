import { createServerFn } from "@tanstack/react-start";
import { queryOptions } from "@tanstack/react-query";
import {
  resolveInstallerFromRelease,
  type GitHubRelease,
  type InstallerInfo,
  type InstallerKind,
} from "@/lib/installer";

/**
 * Release facts are always fetched live from GitHub — release tags, asset
 * names and file sizes are never hardcoded in the UI, because the source of
 * truth is the repository's Releases page.
 */
const GITHUB_REPO = "rsyedmuhammad428-cmd/DocuForge.exe";
export const GITHUB_RELEASES_URL = `https://github.com/${GITHUB_REPO}/releases`;
export const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO}`;

export interface ReleaseInfo {
  available: boolean;
  version: string | null;
  fileName: string | null;
  downloadUrl: string | null;
  sizeBytes: number | null;
  publishedAt: string | null;
  /** Verified GitHub download count for the release asset (null when unknown). */
  githubDownloads: number | null;
  /** "exe-installer" or "zip-archive"; null when no release is available. */
  kind: InstallerKind | null;
  /** Always-present fallback link to the GitHub Releases page. */
  releasesUrl: string;
}

const CACHE_TTL_MS = 5 * 60 * 1000;
// Short-lived cache: server functions run on stateless workers, so this only
// smooths bursts within one isolate. GitHub unauthenticated rate limits make
// it worthwhile; correctness never depends on it.
let githubCache: { at: number; value: ReleaseInfo } | null = null;

const fallbackInfo: ReleaseInfo = {
  available: false,
  version: null,
  fileName: null,
  downloadUrl: null,
  sizeBytes: null,
  publishedAt: null,
  githubDownloads: null,
  kind: null,
  releasesUrl: GITHUB_RELEASES_URL,
};

export const getReleaseInfo = createServerFn({ method: "GET" }).handler(async (): Promise<ReleaseInfo> => {
  if (githubCache && Date.now() - githubCache.at < CACHE_TTL_MS) {
    return githubCache.value;
  }
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      headers: { Accept: "application/vnd.github+json" },
      redirect: "follow",
    });
    if (!res.ok) {
      githubCache = { at: Date.now(), value: fallbackInfo };
      return fallbackInfo;
    }
    const release = (await res.json()) as GitHubRelease;
    const installer: InstallerInfo | null = resolveInstallerFromRelease(release);
    const value: ReleaseInfo = installer
      ? {
          available: true,
          version: installer.version,
          fileName: installer.fileName,
          downloadUrl: installer.downloadUrl,
          sizeBytes: installer.sizeBytes,
          publishedAt: installer.publishedAt,
          githubDownloads: installer.githubDownloads,
          kind: installer.kind,
          releasesUrl: GITHUB_RELEASES_URL,
        }
      : fallbackInfo;
    githubCache = { at: Date.now(), value };
    return value;
  } catch {
    // Network failures must never break the page — fall back to the Releases page.
    return fallbackInfo;
  }
});

export const releaseInfoQueryOptions = queryOptions({
  queryKey: ["release-info"],
  queryFn: () => getReleaseInfo(),
  staleTime: CACHE_TTL_MS,
});
