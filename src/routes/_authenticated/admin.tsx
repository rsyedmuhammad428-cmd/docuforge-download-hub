import { useMemo, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfDay,
  format,
  formatDistanceToNow,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfDay,
  startOfMonth,
  subDays,
  subMonths,
} from "date-fns";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertTriangle,
  Download as DownloadIcon,
  FileSpreadsheet,
  LogOut,
  MousePointerClick,
  RefreshCw,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/Logo";
import { getDownloadClicks, type DownloadClickRow } from "@/lib/admin-analytics";
import { releaseInfoQueryOptions } from "@/lib/release-info";
import { supabase } from "@/integrations/supabase/client";
import { formatBytes } from "@/lib/installer";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminDashboard,
  head: () => ({
    meta: [
      { title: "Download analytics · DocuForge Admin" },
      { name: "robots", content: "noindex" },
      { name: "description", content: "Private DocuForge admin dashboard for download-button analytics." },
    ],
  }),
});

interface DateRange {
  from: string; // yyyy-MM-dd
  to: string; // yyyy-MM-dd
}

const toISODate = (d: Date) => format(d, "yyyy-MM-dd");

const chartTooltipStyle = {
  backgroundColor: "var(--popover)",
  border: "1px solid var(--border)",
  borderRadius: "0.5rem",
  color: "var(--popover-foreground)",
  fontSize: "0.8rem",
};

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-paper">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <Icon className="size-4 text-gold" aria-hidden="true" />
      </div>
      <p className="mt-2 font-display text-3xl font-semibold tracking-tight">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function AdminDashboard() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fetchClicks = useServerFn(getDownloadClicks);

  const clicksQuery = useQuery({
    queryKey: ["admin-download-clicks"],
    queryFn: () => fetchClicks(),
  });
  const releaseQuery = useQuery(releaseInfoQueryOptions);

  const [range, setRange] = useState<DateRange>(() => ({
    from: toISODate(subDays(new Date(), 29)),
    to: toISODate(new Date()),
  }));

  const rows: DownloadClickRow[] = clicksQuery.data ?? [];

  const filtered = useMemo(() => {
    const from = startOfDay(parseISO(range.from));
    const to = endOfDay(parseISO(range.to));
    return rows.filter((r) => {
      const t = parseISO(r.clickedAt);
      return t >= from && t <= to;
    });
  }, [rows, range.from, range.to]);

  const daily = useMemo(() => {
    if (filtered.length === 0 && !range.from) return [];
    const from = startOfDay(parseISO(range.from));
    const to = startOfDay(parseISO(range.to));
    const days = eachDayOfInterval({ start: from, end: to });
    return days.map((d) => ({
      bucket: format(d, "MMM d"),
      clicks: filtered.filter((r) => isSameDay(parseISO(r.clickedAt), d)).length,
    }));
  }, [filtered, range.from, range.to]);

  const monthly = useMemo(() => {
    const months = eachMonthOfInterval({ start: subMonths(new Date(), 11), end: new Date() });
    return months.map((m) => ({
      bucket: format(m, "MMM yy"),
      clicks: rows.filter((r) => isSameMonth(parseISO(r.clickedAt), m)).length,
    }));
  }, [rows]);

  const byVersion = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of filtered) {
      const key = r.version ?? "unknown";
      map.set(key, (map.get(key) ?? 0) + 1);
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1]);
  }, [filtered]);

  const today = rows.filter((r) => isSameDay(parseISO(r.clickedAt), new Date())).length;
  const thisMonth = rows.filter((r) => isSameMonth(parseISO(r.clickedAt), new Date())).length;
  const githubDownloads = releaseQuery.data?.githubDownloads ?? null;

  function exportCsv() {
    const header = "clicked_at,source,version";
    const lines = filtered.map(
      (r) => `${r.clickedAt},${r.source},${r.version ?? ""}`,
    );
    const csv = [header, ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `docuforge-download-clicks-${toISODate(new Date())}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  }

  const isError = clicksQuery.isError;
  const isForbidden = isError && String(clicksQuery.error?.message ?? "").includes("Forbidden");

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <LogoMark className="size-8" />
            <div>
              <p className="font-display text-base font-semibold leading-tight">Download analytics</p>
              <p className="text-xs text-muted-foreground">DocuForge admin</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => clicksQuery.refetch()} disabled={clicksQuery.isFetching}>
              <RefreshCw className={clicksQuery.isFetching ? "animate-spin" : undefined} aria-hidden="true" />
              Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={handleSignOut}>
              <LogOut aria-hidden="true" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="container-page py-8">
        {clicksQuery.isPending ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-busy="true" aria-label="Loading analytics">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl border border-border bg-card" />
            ))}
            <div className="h-72 animate-pulse rounded-xl border border-border bg-card sm:col-span-2" />
            <div className="h-72 animate-pulse rounded-xl border border-border bg-card sm:col-span-2" />
          </div>
        ) : isForbidden ? (
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-10 text-center shadow-lift">
            <ShieldAlert className="mx-auto size-10 text-gold" aria-hidden="true" />
            <h1 className="mt-4 font-display text-2xl font-semibold">No admin access</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              This account isn't marked as a site administrator. Ask the site owner to
              grant admin access to this email.
            </p>
            <Button className="mt-6" onClick={handleSignOut}>
              Sign out
            </Button>
          </div>
        ) : isError ? (
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-card p-10 text-center shadow-lift">
            <AlertTriangle className="mx-auto size-10 text-destructive" aria-hidden="true" />
            <h1 className="mt-4 font-display text-2xl font-semibold">Couldn't load analytics</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {clicksQuery.error instanceof Error ? clicksQuery.error.message : "Something went wrong."}
            </p>
            <Button className="mt-6" onClick={() => clicksQuery.refetch()}>
              Try again
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Date filter */}
            <section className="flex flex-wrap items-end gap-4 rounded-xl border border-border bg-card p-4 shadow-paper">
              <div>
                <label htmlFor="from" className="mb-1 block text-xs font-medium text-muted-foreground">
                  From
                </label>
                <input
                  id="from"
                  type="date"
                  value={range.from}
                  max={range.to}
                  onChange={(e) => setRange((r) => ({ ...r, from: e.target.value }))}
                  className="h-10 rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
                />
              </div>
              <div>
                <label htmlFor="to" className="mb-1 block text-xs font-medium text-muted-foreground">
                  To
                </label>
                <input
                  id="to"
                  type="date"
                  value={range.to}
                  min={range.from}
                  onChange={(e) => setRange((r) => ({ ...r, to: e.target.value }))}
                  className="h-10 rounded-lg border border-input bg-card px-3 text-sm focus-visible:outline-2 focus-visible:outline-ring"
                />
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setRange({ from: toISODate(subDays(new Date(), 29)), to: toISODate(new Date()) })}
              >
                Reset to last 30 days
              </Button>
              <div className="ml-auto">
                <Button variant="outline" size="sm" onClick={exportCsv} disabled={filtered.length === 0}>
                  <FileSpreadsheet aria-hidden="true" />
                  Export CSV
                </Button>
              </div>
            </section>

            {/* Stats */}
            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" aria-label="Summary">
              <StatCard
                label="Total button clicks"
                value={String(rows.length)}
                hint="All time, all placements"
                icon={MousePointerClick}
              />
              <StatCard
                label="In selected range"
                value={String(filtered.length)}
                hint={`${range.from} → ${range.to}`}
                icon={TrendingUp}
              />
              <StatCard label="Today" value={String(today)} hint={`${thisMonth} this month`} icon={TrendingUp} />
              <StatCard
                label="GitHub release downloads"
                value={githubDownloads != null ? String(githubDownloads) : "—"}
                hint={
                  releaseQuery.data?.available
                    ? `${releaseQuery.data.fileName} · ${formatBytes(releaseQuery.data.sizeBytes)}`
                    : "No release published yet"
                }
                icon={DownloadIcon}
              />
            </section>

            {/* Charts */}
            <section className="grid gap-4 lg:grid-cols-2" aria-label="Charts">
              <div className="rounded-xl border border-border bg-card p-5 shadow-paper">
                <h2 className="font-display text-lg font-semibold">Daily clicks</h2>
                <p className="mb-4 text-xs text-muted-foreground">Selected date range</p>
                {daily.every((d) => d.clicks === 0) ? (
                  <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                    No clicks in this range yet.
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={daily} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="dailyFill" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.25} />
                            <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="var(--color-border)" vertical={false} />
                        <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} interval="preserveStartEnd" tickLine={false} axisLine={false} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={chartTooltipStyle} cursor={{ stroke: "var(--color-gold)" }} />
                        <Area type="monotone" dataKey="clicks" stroke="var(--color-chart-1)" strokeWidth={2} fill="url(#dailyFill)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-paper">
                <h2 className="font-display text-lg font-semibold">Monthly clicks</h2>
                <p className="mb-4 text-xs text-muted-foreground">Last 12 months</p>
                {monthly.every((m) => m.clicks === 0) ? (
                  <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
                    No clicks recorded yet.
                  </div>
                ) : (
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthly} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                        <CartesianGrid stroke="var(--color-border)" vertical={false} />
                        <XAxis dataKey="bucket" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} tickLine={false} axisLine={false} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={chartTooltipStyle} cursor={{ fill: "var(--color-gold-soft)" }} />
                        <Bar dataKey="clicks" fill="var(--color-chart-2)" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </section>

            {/* Version stats + recent activity */}
            <section className="grid gap-4 lg:grid-cols-2" aria-label="Details">
              <div className="rounded-xl border border-border bg-card p-5 shadow-paper">
                <h2 className="font-display text-lg font-semibold">Version-wise clicks</h2>
                <p className="mb-4 text-xs text-muted-foreground">Selected date range</p>
                {byVersion.length === 0 ? (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                    No data for this range yet.
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                        <th className="pb-2 font-medium">Version</th>
                        <th className="pb-2 text-right font-medium">Clicks</th>
                      </tr>
                    </thead>
                    <tbody>
                      {byVersion.map(([version, count]) => (
                        <tr key={version} className="border-t border-border">
                          <td className="py-2.5 font-medium">{version}</td>
                          <td className="py-2.5 text-right">{count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="rounded-xl border border-border bg-card p-5 shadow-paper">
                <h2 className="font-display text-lg font-semibold">Recent activity</h2>
                <p className="mb-4 text-xs text-muted-foreground">Newest button clicks</p>
                {filtered.length === 0 ? (
                  <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
                    Nothing here yet — clicks appear as visitors press download buttons.
                  </div>
                ) : (
                  <ul className="max-h-64 space-y-2 overflow-y-auto pr-1">
                    {filtered.slice(0, 20).map((r) => (
                      <li key={r.id} className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm">
                        <span className="capitalize">{r.source}</span>
                        <span className="text-muted-foreground">{r.version ? `v${r.version}` : "—"}</span>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(parseISO(r.clickedAt), { addSuffix: true })}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </section>

            <p className="pb-4 text-center text-xs text-muted-foreground">
              Clicks are anonymous button presses; GitHub release downloads are the
              verified count reported by GitHub. The two measure different things.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
