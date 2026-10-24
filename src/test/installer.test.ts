import { describe, expect, it } from "vitest";
import {
  formatBytes,
  pickWindowsInstallerAsset,
  resolveInstallerFromRelease,
  type GitHubAsset,
  type GitHubRelease,
} from "@/lib/installer";

const asset = (name: string, size = 64_000_000, downloads = 0): GitHubAsset => ({
  name,
  browser_download_url: `https://github.com/rsyedmuhammad428-cmd/DocuForge.exe/releases/download/v0.5.1/${encodeURIComponent(name)}`,
  size,
  download_count: downloads,
});

const release = (overrides: Partial<GitHubRelease> = {}): GitHubRelease => ({
  tag_name: "v0.5.1",
  name: "DocuForge 0.5.1",
  published_at: "2026-10-23T18:38:36Z",
  draft: false,
  prerelease: false,
  assets: [asset("DocuForge.Setup.zip", 176_558_087, 1)],
  ...overrides,
});

describe("pickWindowsInstallerAsset", () => {
  it("links the real v0.5.1 ZIP asset and labels it as a zip archive — never as an EXE", () => {
    const picked = pickWindowsInstallerAsset([asset("DocuForge.Setup.zip")]);
    expect(picked?.asset.name).toBe("DocuForge.Setup.zip");
    expect(picked?.kind).toBe("zip-archive");
    expect(picked?.asset.name.toLowerCase().endsWith(".exe")).toBe(false);
  });

  it("prefers the .exe installer over a zip when both exist", () => {
    const picked = pickWindowsInstallerAsset([asset("DocuForge.Setup.zip"), asset("DocuForge-Setup-0.5.1.exe")]);
    expect(picked?.kind).toBe("exe-installer");
    expect(picked?.asset.name).toBe("DocuForge-Setup-0.5.1.exe");
  });

  it("prefers a Setup/Installer .exe when several exist", () => {
    const picked = pickWindowsInstallerAsset([asset("DocuForge-0.5.1-portable.exe"), asset("DocuForge-Setup-0.5.1.exe")]);
    expect(picked?.asset.name).toBe("DocuForge-Setup-0.5.1.exe");
  });

  it("returns null when there is no downloadable asset", () => {
    expect(pickWindowsInstallerAsset([asset("README.txt")])).toBeNull();
    expect(pickWindowsInstallerAsset([])).toBeNull();
  });
});

describe("resolveInstallerFromRelease", () => {
  it("maps tag, asset URL, size, verified GitHub download count and kind", () => {
    const info = resolveInstallerFromRelease(release({ assets: [asset("DocuForge.Setup.zip", 176_558_087, 1)] }));
    expect(info?.version).toBe("0.5.1");
    expect(info?.fileName).toBe("DocuForge.Setup.zip");
    expect(info?.downloadUrl).toBe(
      "https://github.com/rsyedmuhammad428-cmd/DocuForge.exe/releases/download/v0.5.1/DocuForge.Setup.zip",
    );
    expect(info?.sizeBytes).toBe(176_558_087);
    expect(info?.githubDownloads).toBe(1);
    expect(info?.kind).toBe("zip-archive");
    expect(info?.publishedAt).toBe("2026-10-23T18:38:36Z");
  });

  it("rejects drafts, prereleases and releases without a Windows download", () => {
    expect(resolveInstallerFromRelease(release({ draft: true }))).toBeNull();
    expect(resolveInstallerFromRelease(release({ prerelease: true }))).toBeNull();
    expect(resolveInstallerFromRelease(release({ assets: [asset("README.txt")] }))).toBeNull();
    expect(resolveInstallerFromRelease(null)).toBeNull();
  });
});

describe("formatBytes", () => {
  it("formats download sizes readably and tolerates unknown values", () => {
    expect(formatBytes(176_558_087)).toBe("168.4 MB");
    expect(formatBytes(2048)).toBe("2 KB");
    expect(formatBytes(null)).toBe("—");
    expect(formatBytes(undefined)).toBe("—");
  });
});
