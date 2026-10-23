import { supabase } from "@/integrations/supabase/client";

export type DownloadSource = "navbar" | "hero" | "download" | "footer";

/**
 * Record an anonymous download-button click. No IP addresses, no user
 * identifiers, no PII — only the button placement, installer version and the
 * page it happened on. Failures are silently ignored so tracking never
 * blocks the download itself.
 */
export function trackDownloadClick(source: DownloadSource, version: string | null, pagePath: string): void {
  if (typeof window === "undefined") return;
  void supabase
    .from("download_clicks")
    .insert({ source, version, page_path: pagePath })
    .then(() => undefined, () => undefined);
}
