import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, Layers, Clock, Target, ArrowRight } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { PageHeader, SegBadge, segColor, btn } from "@/components/AppShell";
import { SEGMENTS, USERS } from "@/lib/model";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AudienceIQ" },
      { name: "description", content: "Audience intelligence dashboard: 10,000 OTT users grouped into 4 K-Means segments." },
      { property: "og:title", content: "Dashboard — AudienceIQ" },
      { property: "og:description", content: "Audience intelligence dashboard: 10,000 OTT users grouped into 4 K-Means segments." },
    ],
  }),
  component: Dashboard,
});

export const tooltipStyle = { background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 10, color: "var(--foreground)", fontSize: 12 };

function Dashboard() {
  const metrics = [
    { label: "Total Users", value: "10,000", icon: Users, note: "+4.2% this month" },
    { label: "Active Segments", value: "4", icon: Layers, note: "K-Means, k=4" },
    { label: "Average Watch Time", value: "18.5 hrs", icon: Clock, note: "per user / month" },
    { label: "Best Silhouette Score", value: "0.61", icon: Target, note: "strong separation" },
  ];
  const perf = SEGMENTS.map((s) => ({ name: s.short, watch: s.avgWatch, session: s.avgSession, id: s.id }));
  const recent = USERS.slice(0, 8);

  return (
    <>
      <PageHeader eyebrow="Overview" title="Audience Intelligence Dashboard" desc="Live behavioral segmentation of your OTT audience, powered by unsupervised K-Means clustering."
        action={<Link to="/analyzer" className={btn.primary}>Analyze a user <ArrowRight className="h-4 w-4" /></Link>} />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {metrics.map((m, i) => (
          <div key={m.label} className="panel panel-hover relative overflow-hidden p-5">
            {i === 0 && <div className="absolute inset-x-0 top-0 h-0.5 bg-brand" />}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground sm:text-sm">{m.label}</span>
              <m.icon className="h-4 w-4 text-accent" />
            </div>
            <div className="mt-3 font-display text-2xl font-bold sm:text-3xl">{m.value}</div>
            <div className="mt-1 text-xs text-muted-foreground">{m.note}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <div className="panel p-6 lg:col-span-2">
          <h3 className="font-semibold">Audience Distribution</h3>
          <p className="text-xs text-muted-foreground">Share of users per cluster</p>
          <div className="relative h-56">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={SEGMENTS} dataKey="pct" nameKey="name" innerRadius={62} outerRadius={92} paddingAngle={3} stroke="none">
                  {SEGMENTS.map((s) => <Cell key={s.id} fill={segColor(s.id)} />)}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
              <div><div className="font-display text-2xl font-bold">10K</div><div className="text-xs text-muted-foreground">users</div></div>
            </div>
          </div>
          <div className="space-y-2">
            {SEGMENTS.map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: segColor(s.id) }} />{s.name}</span>
                <span className="font-mono font-semibold">{s.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel p-6 lg:col-span-3">
          <h3 className="font-semibold">Segment Performance</h3>
          <p className="text-xs text-muted-foreground">Avg watch time (hrs) vs avg session (mins)</p>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={perf} barGap={6}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--secondary)" }} />
                <Bar dataKey="watch" name="Watch hrs" radius={[6, 6, 0, 0]}>
                  {perf.map((p) => <Cell key={p.id} fill={segColor(p.id)} />)}
                </Bar>
                <Bar dataKey="session" name="Session mins" radius={[6, 6, 0, 0]} fill="var(--muted)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="panel mt-6 overflow-hidden">
        <div className="flex items-center justify-between p-6 pb-4">
          <div><h3 className="font-semibold">Recent User Analysis</h3><p className="text-xs text-muted-foreground">Latest cluster assignments</p></div>
          <Link to="/segments" className="text-sm text-accent hover:underline">All segments →</Link>
        </div>
        <UserTable users={recent} />
      </div>
    </>
  );
}

export function UserTable({ users }: { users: typeof USERS }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] text-sm">
        <thead>
          <tr className="border-y border-border bg-surface text-left text-xs uppercase tracking-wider text-muted-foreground">
            {["User ID", "Watch Time", "Session", "Visits/wk", "Top Genre", "Segment", "Confidence"].map((h) => <th key={h} className="px-6 py-3 font-medium">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.user_id} className="border-b border-border/60 transition hover:bg-secondary/50">
              <td className="px-6 py-3 font-mono text-accent">{u.user_id}</td>
              <td className="px-6 py-3">{u.watch_time_hours} h</td>
              <td className="px-6 py-3">{u.avg_session_mins} min</td>
              <td className="px-6 py-3">{u.visit_frequency}</td>
              <td className="px-6 py-3">{u.top_genre}</td>
              <td className="px-6 py-3"><SegBadge id={u.cluster} name={u.segment_name} /></td>
              <td className="px-6 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted"><div className={`h-full ${u.confidence >= 85 ? "bg-success" : "bg-warning"}`} style={{ width: `${u.confidence}%` }} /></div>
                  <span className="font-mono text-xs">{u.confidence}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
