/**
 * Pure helpers for resolving the DocuForge Windows download from GitHub
 * Releases data. No server or client imports — safe to unit-test in Node.
 *
 * Rule: the real asset is always what gets linked. A ZIP archive is labeled
 * as a ZIP archive — never presented as an EXE installer.
 */

export interface GitHubAsset {
  name: string;
  browser_download_url: string;
  size: number;
  download_count: number;
}

export interface GitHubRelease {
  tag_name: string;
  name: string | null;
  published_at: string | null;
  draft: boolean;
  prerelease: boolean;
  assets: GitHubAsset[];
}

export type InstallerKind = "exe-installer" | "zip-archive";

export interface InstallerInfo {
  version: string;
  fileName: string;
  downloadUrl: string;
  sizeBytes: number;
  publishedAt: string | null;
  githubDownloads: number;
  kind: InstallerKind;
}

/** Pick the download asset: prefer the .exe installer, else the first .zip archive. */
export function pickWindowsInstallerAsset(assets: GitHubAsset[]): { asset: GitHubAsset; kind: InstallerKind } | null {
  const list = assets ?? [];
  const exes = list.filter((a) => a?.name?.toLowerCase().endsWith(".exe"));
  if (exes.length > 0) {
    const chosen = exes.find((a) => /setup|install/i.test(a.name)) ?? exes[0];
    if (!chosen) return null;
    return { asset: chosen, kind: "exe-installer" };
  }
  const zip = list.find((a) => a?.name?.toLowerCase().endsWith(".zip"));
  if (zip) return { asset: zip, kind: "zip-archive" };
  return null;
}

/** Resolve the download from a release, or null when there is none. */
export function resolveInstallerFromRelease(release: GitHubRelease | null | undefined): InstallerInfo | null {
  if (!release || release.draft || release.prerelease) return null;
  const picked = pickWindowsInstallerAsset(release.assets);
  if (!picked) return null;
  return {
    version: release.tag_name.replace(/^v/i, ""),
    fileName: picked.asset.name,
    downloadUrl: picked.asset.browser_download_url,
    sizeBytes: picked.asset.size,
    publishedAt: release.published_at,
    githubDownloads: picked.asset.download_count ?? 0,
    kind: picked.kind,
  };
}

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}
