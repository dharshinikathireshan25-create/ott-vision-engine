import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ScanSearch, Sparkles, Wand2, Loader2 } from "lucide-react";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { PageHeader, SegBadge, segColor, btn } from "@/components/AppShell";
import { GENRES, SEGMENTS, DEMO_INPUT, analyzeUser, type UserInput, type VisitLevel, type Genre } from "@/lib/model";
import { useAnalysis } from "@/lib/store";
import { tooltipStyle } from "./index";

export const Route = createFileRoute("/analyzer")({
  head: () => ({
    meta: [
      { title: "User Analyzer — AudienceIQ" },
      { name: "description", content: "Assign any OTT user to a behavioral segment with K-Means nearest-centroid inference." },
      { property: "og:title", content: "User Analyzer — AudienceIQ" },
      { property: "og:description", content: "Assign any OTT user to a behavioral segment with K-Means nearest-centroid inference." },
    ],
  }),
  component: Analyzer,
});

const STEPS = ["Validating input", "Standardizing features", "Computing centroid distances", "Assigning cluster"];
const empty: UserInput = { userId: "", watch: 0, session: 0, visits: "Medium", diversity: 1, weekend: 0, genres: [] };

function Analyzer() {
  const { analysis, setAnalysis } = useAnalysis();
  const [form, setForm] = useState<UserInput>(analysis?.input ?? empty);
  const [step, setStep] = useState(-1);
  const [error, setError] = useState("");
  const set = <K extends keyof UserInput>(k: K, v: UserInput[K]) => setForm((f) => ({ ...f, [k]: v }));

  const run = () => {
    if (!form.userId.trim()) return setError("User ID is required.");
    if (form.watch <= 0 || form.session <= 0) return setError("Watch time and session duration must be greater than 0.");
    if (form.weekend < 0 || form.weekend > 100) return setError("Weekend usage must be between 0 and 100%.");
    if (!form.genres.length) return setError("Select at least one genre.");
    setError(""); setAnalysis(null);
    STEPS.forEach((_, i) => setTimeout(() => setStep(i), i * 380));
    setTimeout(() => { setAnalysis(analyzeUser(form)); setStep(-1); }, STEPS.length * 380 + 200);
  };

  const input = "w-full rounded-lg border border-input bg-surface px-3 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/30";
  const label = "mb-1.5 block text-xs font-medium text-muted-foreground";

  return (
    <>
      <PageHeader eyebrow="Real-time inference" title="User Analyzer" desc="Enter behavioral features. The model standardizes them and assigns the user to the nearest K-Means centroid."
        action={<button className={btn.ghost} onClick={() => setForm(DEMO_INPUT)}><Wand2 className="h-4 w-4" />Load demo user</button>} />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="panel p-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><label className={label}>User ID</label><input className={input} value={form.userId} placeholder="USR-8192" onChange={(e) => set("userId", e.target.value)} /></div>
            <div><label className={label}>Watch Time (hours)</label><input type="number" step="0.1" className={input} value={form.watch || ""} onChange={(e) => set("watch", +e.target.value)} /></div>
            <div><label className={label}>Avg Session (minutes)</label><input type="number" className={input} value={form.session || ""} onChange={(e) => set("session", +e.target.value)} /></div>
            <div><label className={label}>Visit Frequency</label>
              <select className={input} value={form.visits} onChange={(e) => set("visits", e.target.value as VisitLevel)}>
                {["Low", "Medium", "High"].map((v) => <option key={v}>{v}</option>)}
              </select></div>
            <div><label className={label}>Genre Diversity (1–8)</label><input type="number" min={1} max={8} className={input} value={form.diversity || ""} onChange={(e) => set("diversity", +e.target.value)} /></div>
            <div className="sm:col-span-2"><label className={label}>Weekend Usage: <span className="font-mono text-accent">{form.weekend}%</span></label>
              <input type="range" min={0} max={100} className="w-full accent-[var(--primary)]" value={form.weekend} onChange={(e) => set("weekend", +e.target.value)} /></div>
            <div className="sm:col-span-2"><label className={label}>Top Genres</label>
              <div className="flex flex-wrap gap-2">
                {GENRES.map((g) => {
                  const on = form.genres.includes(g);
                  return <button key={g} type="button" onClick={() => set("genres", on ? form.genres.filter((x) => x !== g) : [...form.genres, g as Genre])}
                    className={`rounded-full border px-3 py-1 text-xs transition ${on ? "border-primary bg-primary/20 text-foreground" : "border-border text-muted-foreground hover:border-primary/50"}`}>{g}</button>;
                })}
              </div></div>
          </div>
          {error && <p className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">{error}</p>}
          <button onClick={run} disabled={step >= 0} className={`${btn.primary} mt-6 w-full py-4 text-base tracking-wider`}>
            {step >= 0 ? <Loader2 className="h-5 w-5 animate-spin" /> : <ScanSearch className="h-5 w-5" />} ANALYZE USER
          </button>
        </div>

        <div className="lg:col-span-3">
          {step >= 0 ? (
            <div className="panel grid h-full min-h-80 place-items-center p-8">
              <div className="w-full max-w-sm space-y-3">
                <div className="mx-auto mb-6 h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-accent" />
                {STEPS.map((s, i) => (
                  <div key={s} className={`flex items-center gap-3 text-sm transition ${i <= step ? "text-foreground" : "text-muted-foreground/50"}`}>
                    <span className={`h-2 w-2 rounded-full ${i < step ? "bg-success" : i === step ? "bg-accent pulse-dot" : "bg-muted"}`} />{s}…
                  </div>
                ))}
              </div>
            </div>
          ) : analysis ? <Result /> : (
            <div className="panel grid h-full min-h-80 place-items-center p-8 text-center">
              <div><ScanSearch className="mx-auto h-10 w-10 text-muted-foreground" /><p className="mt-3 text-sm text-muted-foreground">Fill the form (or load the demo user) and click <b>ANALYZE USER</b>.</p></div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function Result() {
  const { analysis: a } = useAnalysis();
  if (!a) return null;
  const s = a.segment;
  const norm = (v: number, max: number) => Math.min(100, Math.round((v / max) * 100));
  const radar = [
    { f: "Watch time", user: norm(a.features.watch, 40), seg: norm(s.centroid.watch, 40) },
    { f: "Session", user: norm(a.features.session, 100), seg: norm(s.centroid.session, 100) },
    { f: "Visits", user: norm(a.features.visits, 7), seg: norm(s.centroid.visits, 7) },
    { f: "Diversity", user: norm(a.features.diversity, 8), seg: norm(s.centroid.diversity, 8) },
    { f: "Weekend", user: a.features.weekend, seg: s.centroid.weekend },
  ];
  return (
    <div className="panel animate-in fade-in slide-in-from-bottom-4 p-6 duration-500">
      <div className="font-mono text-xs tracking-widest text-accent">USER ANALYSIS RESULT</div>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
        <div><div className="text-xs text-muted-foreground">User ID</div><div className="font-mono text-lg">{a.input.userId}</div></div>
        <SegBadge id={s.id} name={`Cluster ${s.id}`} />
      </div>
      <div className="mt-4 rounded-xl border p-5" style={{ borderColor: `color-mix(in oklab, ${segColor(s.id)} 40%, transparent)`, background: `color-mix(in oklab, ${segColor(s.id)} 10%, transparent)` }}>
        <div className="text-xs text-muted-foreground">Predicted Segment</div>
        <div className="mt-1 font-display text-2xl font-bold" style={{ color: segColor(s.id) }}>{s.name}</div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {[["Cluster ID", `Cluster ${s.id}`], ["Engagement Level", s.engagement], ["Cluster Confidence", `${a.confidence}%`]].map(([k, v]) => (
          <div key={k} className="rounded-lg border border-border bg-surface p-3"><div className="text-[11px] text-muted-foreground">{k}</div><div className="mt-0.5 font-display text-lg font-bold">{v}</div></div>
        ))}
      </div>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        <div className="h-64">
          <ResponsiveContainer>
            <RadarChart data={radar} outerRadius="62%">
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="f" tick={{ fill: "var(--muted-foreground)", fontSize: 11 }} />
              <Radar name="Segment centroid" dataKey="seg" stroke={segColor(s.id)} fill={segColor(s.id)} fillOpacity={0.2} />
              <Radar name="This user" dataKey="user" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.35} />
              <Legend wrapperStyle={{ fontSize: 11 }} /><Tooltip contentStyle={tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
        <div>
          <div className="mb-2 text-xs font-medium text-muted-foreground">Distance to each centroid (lower = closer)</div>
          <div className="space-y-2">
            {SEGMENTS.map((seg) => (
              <div key={seg.id}>
                <div className="flex justify-between text-xs"><span>C{seg.id} · {seg.short}</span><span className="font-mono">{a.distances[seg.id]!.toFixed(2)}</span></div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full" style={{ width: `${Math.min(100, a.distances[seg.id]! * 20)}%`, background: segColor(seg.id), opacity: seg.id === s.id ? 1 : 0.4 }} /></div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-xs text-muted-foreground">Profile: {a.input.watch}h watch · {a.input.session}min sessions · {a.input.visits} visits · {a.input.weekend}% weekend · {a.input.genres.join(", ")}</div>
        </div>
      </div>
      <Link to="/recommendations" className={`${btn.primary} mt-5 w-full`}><Sparkles className="h-4 w-4" />View personalized recommendations</Link>
    </div>
  );
}
