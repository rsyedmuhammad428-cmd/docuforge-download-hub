import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

/**
 * Integration-owned protected gate. The session lives in localStorage, which
 * the server cannot read, so this subtree renders client-only and redirects
 * unauthenticated visitors to /auth before any child route loads.
 */
export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) {
      throw redirect({ to: "/auth" });
    }
  },
  component: () => <Outlet />,
});
