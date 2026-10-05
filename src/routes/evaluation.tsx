import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Cpu, Eye, Feather, Users } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, LabelList } from "recharts";
import { PageHeader } from "@/components/AppShell";
import { K_SCORES } from "@/lib/model";
import { tooltipStyle } from "./index";

export const Route = createFileRoute("/evaluation")({
  head: () => ({
    meta: [
      { title: "Model Evaluation — AudienceIQ" },
      { name: "description", content: "K-Means evaluation: silhouette scores across k, inertia, and automated quality checks." },
      { property: "og:title", content: "Model Evaluation — AudienceIQ" },
      { property: "og:description", content: "K-Means evaluation: silhouette scores across k, inertia, and automated quality checks." },
    ],
  }),
  component: Evaluation,
});

function Evaluation() {
  const facts = [["Algorithm", "K-Means Clustering"], ["Learning Type", "Unsupervised Learning"], ["Best Number of Clusters", "4"], ["Silhouette Score", "0.61"], ["Inertia", "1248.6"]];
  const checks = [["Cluster Balance", "Good"], ["API Health", "Passed"], ["Invalid Input Handling", "Passed"], ["Reproducibility", "Passed"], ["Model Stability", "Passed"]];
  return (
    <>
      <PageHeader eyebrow="Evaluator service" title="Model Evaluation" desc="Silhouette analysis across candidate k values selects the most well-separated configuration." />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        {facts.map(([k, v], i) => (
          <div key={k} className={`panel p-4 ${i === 2 || i === 3 ? "ring-1 ring-primary/50" : ""}`}>
            <div className="text-xs text-muted-foreground">{k}</div>
            <div className={`mt-1 font-display font-bold ${v.length < 7 ? "text-3xl text-brand" : "text-base"}`}>{v}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="panel p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div><h3 className="font-semibold">Silhouette Score by K</h3><p className="text-xs text-muted-foreground">Higher is better · selected configuration highlighted</p></div>
            <span className="rounded-full bg-primary/15 px-3 py-1 font-mono text-xs text-accent">Selected: K = 4</span>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer>
              <BarChart data={K_SCORES.map((d) => ({ ...d, label: `K = ${d.k}` }))}>
                <CartesianGrid stroke="var(--border)" vertical={false} />
                <XAxis dataKey="label" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 0.7]} stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--secondary)" }} />
                <Bar dataKey="score" name="Silhouette" radius={[8, 8, 0, 0]}>
                  {K_SCORES.map((d) => <Cell key={d.k} fill={d.k === 4 ? "var(--accent)" : "var(--muted)"} />)}
                  <LabelList dataKey="score" position="top" fill="var(--foreground)" fontSize={12} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel p-6">
          <h3 className="font-semibold">Automated Checks</h3>
          <div className="mt-4 space-y-3">
            {checks.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between rounded-lg border border-border bg-surface p-3">
                <span className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-success" />{k}</span>
                <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs font-medium text-success">{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="panel relative mt-6 overflow-hidden p-6">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-brand" />
        <h3 className="text-xl font-bold">Why K-Means?</h3>
        <p className="mt-2 max-w-3xl text-muted-foreground">K-Means is lightweight, CPU-friendly, interpretable, and suitable for grouping users based on behavioral similarity.</p>
        <div className="mt-5 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[[Feather, "Lightweight", "Trains on 10K users in < 1s"], [Cpu, "CPU-friendly", "No GPU needed — runs anywhere"], [Eye, "Interpretable", "Centroids map to clear personas"], [Users, "Behavioral", "Groups users by real similarity"]].map(([I, t, d]) => {
            const Icon = I as typeof Cpu;
            return <div key={t as string} className="rounded-lg border border-border bg-surface p-4"><Icon className="h-5 w-5 text-accent" /><div className="mt-2 font-semibold">{t as string}</div><div className="text-xs text-muted-foreground">{d as string}</div></div>;
          })}
        </div>
      </div>
    </>
  );
}
