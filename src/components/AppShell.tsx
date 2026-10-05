import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { LayoutDashboard, Users, ScanSearch, Sparkles, Gauge, Network, Activity, Menu, X, BrainCircuit } from "lucide-react";
import { useAnalysis } from "@/lib/store";

const NAV = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/segments", label: "Audience Segments", icon: Users },
  { to: "/analyzer", label: "User Analyzer", icon: ScanSearch },
  { to: "/recommendations", label: "Recommendations", icon: Sparkles },
  { to: "/evaluation", label: "Model Evaluation", icon: Gauge },
  { to: "/architecture", label: "System Architecture", icon: Network },
  { to: "/api-monitor", label: "API Monitor", icon: Activity },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { analysis } = useAnalysis();

  const sidebar = (
    <div className="flex h-full flex-col gap-6 p-5">
      <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
        <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand shadow-glow">
          <BrainCircuit className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <div className="font-display text-lg font-bold leading-none">Audience<span className="text-brand">IQ</span></div>
          <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">Audience Intelligence</div>
        </div>
      </Link>
      <nav className="flex flex-col gap-1">
        {NAV.map((n, i) => {
          const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
          return (
            <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
              className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${active ? "bg-primary/15 text-foreground ring-1 ring-primary/40" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>
              <span className={`font-mono text-[10px] ${active ? "text-accent" : "text-muted-foreground/60"}`}>0{i + 1}</span>
              <n.icon className={`h-4 w-4 ${active ? "text-accent" : ""}`} />
              {n.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-3">
        {analysis && (
          <div className="rounded-lg border border-border bg-surface p-3 text-xs">
            <div className="text-muted-foreground">Last analyzed</div>
            <div className="font-mono text-accent">{analysis.input.userId}</div>
            <div className="mt-1 truncate">Cluster {analysis.segment.id} · {analysis.confidence}%</div>
          </div>
        )}
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface p-3 text-xs">
          <span className="pulse-dot h-2 w-2 rounded-full bg-success" />
          <span className="text-muted-foreground">K-Means v1.4 · k=4</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen lg:flex">
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-border bg-sidebar lg:block">{sidebar}</aside>
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-background/80 backdrop-blur" onClick={() => setOpen(false)} />
          <aside className="relative h-full w-72 border-r border-border bg-sidebar">{sidebar}</aside>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-40 flex items-center justify-between border-b border-border bg-background/70 px-4 py-3 backdrop-blur lg:px-8">
          <div className="flex items-center gap-3">
            <button className="rounded-md p-2 hover:bg-secondary lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
            <span className="hidden text-sm text-muted-foreground sm:block">AI-Powered Audience Intelligence &amp; Personalization</span>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs text-success">
            <span className="pulse-dot h-2 w-2 rounded-full bg-success" /> Model Status: Active
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

export function PageHeader({ eyebrow, title, desc, action }: { eyebrow: string; title: string; desc?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 font-mono text-xs uppercase tracking-widest text-accent">{eyebrow}</div>
        <h1 className="text-2xl font-bold sm:text-3xl">{title}</h1>
        {desc && <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{desc}</p>}
      </div>
      {action}
    </div>
  );
}

export const segColor = (id: number) => `var(--seg-${id})`;

export function SegBadge({ id, name }: { id: number; name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium"
      style={{ borderColor: `color-mix(in oklab, ${segColor(id)} 45%, transparent)`, background: `color-mix(in oklab, ${segColor(id)} 14%, transparent)`, color: segColor(id) }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: segColor(id) }} />{name}
    </span>
  );
}

export const btn = {
  primary: "inline-flex items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-primary-foreground shadow-glow transition hover:opacity-90 disabled:opacity-50",
  ghost: "inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-medium transition hover:border-primary/50",
};
