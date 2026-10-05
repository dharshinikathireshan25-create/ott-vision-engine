import { createFileRoute } from "@tanstack/react-router";
import { Database, Eraser, Wrench, Sigma, BrainCircuit, Users, ListChecks, Server, Sparkles, ClipboardCheck, Container, Cog, Globe, FlaskConical } from "lucide-react";
import { PageHeader } from "@/components/AppShell";

export const Route = createFileRoute("/architecture")({
  head: () => ({
    meta: [
      { title: "System Architecture — AudienceIQ" },
      { name: "description", content: "End-to-end pipeline: data, K-Means training, REST API, evaluator and Docker deployment." },
      { property: "og:title", content: "System Architecture — AudienceIQ" },
      { property: "og:description", content: "End-to-end pipeline: data, K-Means training, REST API, evaluator and Docker deployment." },
    ],
  }),
  component: Arch,
});

type Stage = { t: string; d: string; icon: typeof Database; svc: "trainer" | "api" | "eval" };
const FLOW: Stage[] = [
  { t: "User Activity Data", d: "Watch logs, sessions, genres", icon: Database, svc: "trainer" },
  { t: "Data Cleaning", d: "Nulls, outliers, dedupe", icon: Eraser, svc: "trainer" },
  { t: "Feature Engineering", d: "5 behavioral features", icon: Wrench, svc: "trainer" },
  { t: "Standardization", d: "Z-score scaling", icon: Sigma, svc: "trainer" },
  { t: "K-Means Clustering", d: "k = 4, seed fixed", icon: BrainCircuit, svc: "trainer" },
  { t: "Audience Segments", d: "Clusters → personas", icon: Users, svc: "api" },
  { t: "Personalization Rules", d: "Transparent segment rules", icon: ListChecks, svc: "api" },
  { t: "REST API", d: "/health · /recommend", icon: Server, svc: "api" },
  { t: "Recommendations", d: "Explainable picks", icon: Sparkles, svc: "api" },
  { t: "Evaluator", d: "Silhouette, tests", icon: ClipboardCheck, svc: "eval" },
  { t: "Docker Deployment", d: "3 containers", icon: Container, svc: "eval" },
];
const SVC = {
  trainer: { c: "var(--seg-0)", name: "Trainer" },
  api: { c: "var(--seg-1)", name: "API Service" },
  eval: { c: "var(--seg-2)", name: "Evaluator" },
};

function Arch() {
  return (
    <>
      <PageHeader eyebrow="How it works" title="System Architecture" desc="One connected pipeline across three containerized services: Trainer → API → Evaluator." />
      <div className="mb-4 flex flex-wrap gap-4 text-xs">
        {Object.values(SVC).map((s) => <span key={s.name} className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: s.c }} />{s.name}</span>)}
      </div>
      <div className="panel p-6">
        <div className="mx-auto flex max-w-md flex-col items-center">
          {FLOW.map((s, i) => (
            <div key={s.t} className="flex w-full flex-col items-center">
              <div className="panel-hover group flex w-full items-center gap-4 rounded-xl border bg-surface p-4 transition"
                style={{ borderColor: `color-mix(in oklab, ${SVC[s.svc].c} 40%, transparent)` }}>
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg" style={{ background: `color-mix(in oklab, ${SVC[s.svc].c} 18%, transparent)`, color: SVC[s.svc].c }}>
                  <s.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="font-display text-sm font-bold uppercase tracking-wide">{s.t}</div>
                  <div className="text-xs text-muted-foreground">{s.d}</div>
                </div>
                <span className="font-mono text-[10px] text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
              </div>
              {i < FLOW.length - 1 && <div className="flow-line h-6 w-0.5" />}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {[
          { k: "trainer" as const, icon: Cog, items: ["Data preprocessing", "Feature scaling", "K-Means training", "Model saving"] },
          { k: "api" as const, icon: Globe, items: ["REST API", "User prediction", "Segment assignment", "Recommendations", "Health check"] },
          { k: "eval" as const, icon: FlaskConical, items: ["Silhouette score", "Cluster balance", "API testing", "Invalid input testing", "Reproducibility"] },
        ].map((s, i) => (
          <div key={s.k} className="panel panel-hover relative overflow-hidden p-6">
            <div className="absolute inset-x-0 top-0 h-1" style={{ background: SVC[s.k].c }} />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3"><s.icon className="h-5 w-5" style={{ color: SVC[s.k].c }} /><h3 className="font-bold uppercase tracking-wide">{SVC[s.k].name}</h3></div>
              <span className="font-mono text-xs text-muted-foreground">step {i + 1}/3</span>
            </div>
            <ul className="mt-4 space-y-2 text-sm">
              {s.items.map((it) => <li key={it} className="flex items-center gap-2"><span className="h-1.5 w-1.5 rounded-full" style={{ background: SVC[s.k].c }} />{it}</li>)}
            </ul>
            <div className="mt-4 rounded-md bg-surface px-3 py-2 font-mono text-[11px] text-muted-foreground">docker: audienceiq-{s.k}</div>
          </div>
        ))}
      </div>
    </>
  );
}
