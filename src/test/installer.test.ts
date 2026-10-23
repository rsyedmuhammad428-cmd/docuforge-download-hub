import { describe, expect, it } from "vitest";
import {
  formatBytes,
  pickWindowsInstallerAsset,
  resolveInstallerFromRelease,
  type GitHubAsset,
  type GitHubRelease,
} from "@/lib/installer";

const exeAsset = (name: string, size = 64_000_000, downloads = 0): GitHubAsset => ({
  name,
  browser_download_url: `https://github.com/rsyedmuhammad428-cmd/DocuForge/releases/download/v0.5.0/${encodeURIComponent(name)}`,
  size,
  download_count: downloads,
});

const release = (overrides: Partial<GitHubRelease> = {}): GitHubRelease => ({
  tag_name: "v0.5.0",
  name: "DocuForge 0.5.0",
  published_at: "2026-10-20T12:00:00Z",
  draft: false,
  prerelease: false,
  assets: [exeAsset("DocuForge-Setup-0.5.0.exe")],
  ...overrides,
});

describe("pickWindowsInstallerAsset", () => {
  it("never labels a ZIP as the installer — picks the .exe asset", () => {
    const picked = pickWindowsInstallerAsset([exeAsset("DocuForge-0.5.0.zip"), exeAsset("DocuForge-Setup-0.5.0.exe")]);
    expect(picked?.name).toBe("DocuForge-Setup-0.5.0.exe");
    expect(picked?.name.toLowerCase().endsWith(".exe")).toBe(true);
  });

  it("prefers a Setup/Installer .exe when several exist", () => {
    const picked = pickWindowsInstallerAsset([exeAsset("DocuForge-0.5.0-portable.exe"), exeAsset("DocuForge-Setup-0.5.0.exe")]);
    expect(picked?.name).toBe("DocuForge-Setup-0.5.0.exe");
  });

  it("returns null when there is no .exe at all", () => {
    expect(pickWindowsInstallerAsset([exeAsset("DocuForge-0.5.0.zip")])).toBeNull();
    expect(pickWindowsInstallerAsset([])).toBeNull();
  });
});

describe("resolveInstallerFromRelease", () => {
  it("maps tag, asset URL, size and verified GitHub download count", () => {
    const info = resolveInstallerFromRelease(
      release({ assets: [exeAsset("DocuForge-Setup-0.5.0.exe", 62_914_560, 123)] }),
    );
    expect(info?.version).toBe("0.5.0");
    expect(info?.fileName).toBe("DocuForge-Setup-0.5.0.exe");
    expect(info?.downloadUrl).toContain("/releases/download/v0.5.0/DocuForge-Setup-0.5.0.exe");
    expect(info?.sizeBytes).toBe(62_914_560);
    expect(info?.githubDownloads).toBe(123);
    expect(info?.publishedAt).toBe("2026-10-20T12:00:00Z");
  });

  it("rejects drafts, prereleases and releases without a Windows installer", () => {
    expect(resolveInstallerFromRelease(release({ draft: true }))).toBeNull();
    expect(resolveInstallerFromRelease(release({ prerelease: true }))).toBeNull();
    expect(resolveInstallerFromRelease(release({ assets: [exeAsset("DocuForge-0.5.0.zip")] }))).toBeNull();
    expect(resolveInstallerFromRelease(null)).toBeNull();
  });
});

describe("formatBytes", () => {
  it("formats installer sizes readably and tolerates unknown values", () => {
    expect(formatBytes(62_914_560)).toBe("60.0 MB");
    expect(formatBytes(2048)).toBe("2 KB");
    expect(formatBytes(null)).toBe("—");
    expect(formatBytes(undefined)).toBe("—");
  });
});
