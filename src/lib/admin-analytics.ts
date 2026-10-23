import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface DownloadClickRow {
  id: string;
  clickedAt: string;
  source: string;
  version: string | null;
}

/**
 * Raw click rows for the admin dashboard. Aggregation happens client-side so
 * the date-range filter recomputes instantly without extra round trips.
 * Access is admin-only: the caller's role is verified server-side via
 * public.has_role before anything is returned.
 */
export const getDownloadClicks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<DownloadClickRow[]> => {
    const { data: isAdmin, error: roleError } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleError) throw new Error(roleError.message);
    if (!isAdmin) throw new Error("Forbidden");

    const { data, error } = await context.supabase
      .from("download_clicks")
      .select("id, clicked_at, source, version")
      .order("clicked_at", { ascending: false });

    if (error) throw new Error(error.message);
    return (data ?? []).map((row) => ({
      id: row.id,
      clickedAt: row.clicked_at,
      source: row.source,
      version: row.version,
    }));
  });
