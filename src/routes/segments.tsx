import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { X, Eye } from "lucide-react";
import { PageHeader, segColor, btn } from "@/components/AppShell";
import { SEGMENTS, USERS } from "@/lib/model";
import { UserTable } from "./index";

export const Route = createFileRoute("/segments")({
  head: () => ({
    meta: [
      { title: "Audience Segments — AudienceIQ" },
      { name: "description", content: "Four automatically discovered OTT audience segments from K-Means clustering." },
      { property: "og:title", content: "Audience Segments — AudienceIQ" },
      { property: "og:description", content: "Four automatically discovered OTT audience segments from K-Means clustering." },
    ],
  }),
  component: Segments,
});

function Segments() {
  const [view, setView] = useState<number | null>(null);
  return (
    <>
      <PageHeader eyebrow="Clusters → Personas" title="Audience Segments" desc="K-Means discovered 4 natural groups in the behavioral feature space. Each cluster is translated into a human-readable persona." />
      <div className="grid gap-5 md:grid-cols-2">
        {SEGMENTS.map((s) => (
          <div key={s.id} className="panel panel-hover relative overflow-hidden p-6">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full opacity-25 blur-3xl" style={{ background: segColor(s.id) }} />
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-mono text-xs" style={{ color: segColor(s.id) }}>CLUSTER {s.id}</div>
                <h3 className="mt-1 text-xl font-bold">{s.name}</h3>
              </div>
              <div className="text-right">
                <div className="font-display text-3xl font-bold" style={{ color: segColor(s.id) }}>{s.pct}%</div>
                <div className="text-xs text-muted-foreground">{s.users.toLocaleString()} users</div>
              </div>
            </div>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full" style={{ width: `${s.pct * 3}%`, background: segColor(s.id) }} /></div>
            <div className="mt-5 grid grid-cols-3 gap-3">
              {[["Avg watch", `${s.avgWatch} h`], ["Avg session", `${s.avgSession} min`], ["Engagement", s.engagement]].map(([k, v]) => (
                <div key={k} className="rounded-lg border border-border bg-surface p-3">
                  <div className="text-[11px] text-muted-foreground">{k}</div>
                  <div className="mt-0.5 font-semibold">{v}</div>
                </div>
              ))}
            </div>
            <ul className="mt-4 space-y-1 text-sm text-muted-foreground">
              {s.traits.map((t) => <li key={t} className="flex gap-2"><span style={{ color: segColor(s.id) }}>▸</span>{t}</li>)}
            </ul>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {s.genres.map((g) => <span key={g} className="rounded-md bg-secondary px-2 py-0.5 text-xs">{g}</span>)}
              </div>
              <button className={btn.ghost} onClick={() => setView(s.id)}><Eye className="h-4 w-4" />View Users</button>
            </div>
          </div>
        ))}
      </div>

      {view !== null && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-background/80 backdrop-blur" onClick={() => setView(null)} />
          <div className="panel relative max-h-[85vh] w-full max-w-5xl overflow-auto">
            <div className="flex items-center justify-between p-6 pb-4">
              <div>
                <div className="font-mono text-xs" style={{ color: segColor(view) }}>CLUSTER {view} · SAMPLE USERS</div>
                <h3 className="text-lg font-bold">{SEGMENTS[view].name}</h3>
              </div>
              <button onClick={() => setView(null)} className="rounded-md p-2 hover:bg-secondary" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
            <UserTable users={USERS.filter((u) => u.cluster === view)} />
          </div>
        </div>
      )}
    </>
  );
}
