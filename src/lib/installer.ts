/**
 * Pure helpers for resolving the DocuForge Windows installer from GitHub
 * Releases data. No server or client imports — safe to unit-test in Node.
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

export interface InstallerInfo {
  version: string;
  fileName: string;
  downloadUrl: string;
  sizeBytes: number;
  publishedAt: string | null;
  githubDownloads: number;
}

/** Pick the Windows .exe installer asset. Never returns a .zip as the installer. */
export function pickWindowsInstallerAsset(assets: GitHubAsset[]): GitHubAsset | null {
  const exes = (assets ?? []).filter((a) => a?.name?.toLowerCase().endsWith(".exe"));
  if (exes.length === 0) return null;
  const setup = exes.find((a) => /setup|install/i.test(a.name));
  return setup ?? exes[0];
}

/** Resolve the installer from a release, or null when there is none. */
export function resolveInstallerFromRelease(release: GitHubRelease | null | undefined): InstallerInfo | null {
  if (!release || release.draft || release.prerelease) return null;
  const asset = pickWindowsInstallerAsset(release.assets);
  if (!asset) return null;
  return {
    version: release.tag_name.replace(/^v/i, ""),
    fileName: asset.name,
    downloadUrl: asset.browser_download_url,
    sizeBytes: asset.size,
    publishedAt: release.published_at,
    githubDownloads: asset.download_count ?? 0,
  };
}

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes == null || !Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  const mb = bytes / (1024 * 1024);
  if (mb >= 1) return `${mb.toFixed(1)} MB`;
  return `${(bytes / 1024).toFixed(0)} KB`;
}
