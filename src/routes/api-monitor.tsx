import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, RotateCcw, Loader2, HeartPulse } from "lucide-react";
import { PageHeader, btn } from "@/components/AppShell";
import { analyzeUser, recommend, GENRES, type Genre } from "@/lib/model";

export const Route = createFileRoute("/api-monitor")({
  head: () => ({
    meta: [
      { title: "API Monitor — AudienceIQ" },
      { name: "description", content: "Monitor and test the AudienceIQ REST API: /health and /recommend endpoints." },
      { property: "og:title", content: "API Monitor — AudienceIQ" },
      { property: "og:description", content: "Monitor and test the AudienceIQ REST API: /health and /recommend endpoints." },
    ],
  }),
  component: Monitor,
});

const DEFAULT_REQ = JSON.stringify({ user_id: "USR-8192", watch_time_hours: 32.5, top_genres: ["Action", "Thriller"], avg_session_mins: 85 }, null, 2);

function Method({ m }: { m: "GET" | "POST" }) {
  return <span className={`rounded-md px-2 py-0.5 font-mono text-xs font-bold ${m === "GET" ? "bg-success/15 text-success" : "bg-primary/20 text-accent"}`}>{m}</span>;
}

function Monitor() {
  const [req, setReq] = useState(DEFAULT_REQ);
  const [res, setRes] = useState<{ status: string; ok: boolean; ms: number; body: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [health, setHealth] = useState({ ms: 12, checked: "just now" });
  const [hLoading, setHLoading] = useState(false);

  const send = () => {
    setLoading(true); setRes(null);
    setTimeout(() => {
      setLoading(false);
      try {
        const p = JSON.parse(req);
        if (typeof p.user_id !== "string" || typeof p.watch_time_hours !== "number" || typeof p.avg_session_mins !== "number" || !Array.isArray(p.top_genres)) throw new Error("bad");
        const genres = (p.top_genres as string[]).filter((g): g is Genre => (GENRES as string[]).includes(g));
        const a = analyzeUser({ userId: p.user_id, watch: p.watch_time_hours, session: p.avg_session_mins, visits: p.watch_time_hours > 25 ? "High" : p.watch_time_hours > 10 ? "Medium" : "Low", diversity: p.genre_diversity ?? genres.length, weekend: p.weekend_usage ?? 35, genres });
        setRes({ status: "HTTP 200 OK", ok: true, ms: 42, body: JSON.stringify({ user_id: p.user_id, segment_name: a.segment.name, recommendations: recommend(a).slice(0, 3).map((t) => t.title) }, null, 2) });
      } catch {
        setRes({ status: "HTTP 422 Unprocessable Entity", ok: false, ms: 9, body: JSON.stringify({ error: "Invalid input", detail: "Required: user_id (string), watch_time_hours (number), avg_session_mins (number), top_genres (array)" }, null, 2) });
      }
    }, 450);
  };

  const ping = () => { setHLoading(true); setTimeout(() => { setHealth({ ms: 8 + Math.floor(Math.random() * 10), checked: new Date().toLocaleTimeString() }); setHLoading(false); }, 350); };

  return (
    <>
      <PageHeader eyebrow="REST API" title="API Monitor" desc="Live endpoints exposed by the API Service container." />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="panel p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2"><Method m="GET" /><span className="font-mono">/health</span></div>
            <HeartPulse className="h-5 w-5 text-success" />
          </div>
          <div className="mt-5 space-y-3">
            {[["Status", "OK"], ["Model Loaded", "TRUE"], ["Service", "Running"], ["Latency", `${health.ms} ms`]].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2.5 text-sm">
                <span className="text-muted-foreground">{k}</span>
                <span className="flex items-center gap-2 font-mono font-semibold text-success">{k !== "Latency" && <span className="pulse-dot h-2 w-2 rounded-full bg-success" />}{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 text-xs text-muted-foreground">Last checked: {health.checked}</div>
          <button onClick={ping} className={`${btn.ghost} mt-4 w-full`}>{hLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <HeartPulse className="h-4 w-4" />}Ping /health</button>
        </div>

        <div className="panel p-6 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2"><Method m="POST" /><span className="font-mono">/recommend</span></div>
            <div className="flex gap-2">
              <button onClick={() => { setReq(DEFAULT_REQ); setRes(null); }} className={btn.ghost}><RotateCcw className="h-4 w-4" />Reset</button>
              <button onClick={send} disabled={loading} className={btn.primary}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}Send Request</button>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <div>
              <div className="mb-2 text-xs font-medium text-muted-foreground">Request body (editable)</div>
              <textarea value={req} onChange={(e) => setReq(e.target.value)} spellCheck={false}
                className="h-64 w-full resize-none rounded-lg border border-input bg-sidebar p-4 font-mono text-xs leading-relaxed text-accent outline-none focus:border-primary" />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-xs">
                <span className="font-medium text-muted-foreground">Response</span>
                {res && <span className="flex gap-3 font-mono"><span className={res.ok ? "text-success" : "text-destructive"}>{res.status}</span><span className="text-muted-foreground">Response Time: {res.ms} ms</span></span>}
              </div>
              <pre className="h-64 overflow-auto rounded-lg border border-input bg-sidebar p-4 font-mono text-xs leading-relaxed">
                {loading ? <span className="text-muted-foreground">Awaiting response…</span> : res ? <span className={res.ok ? "text-foreground" : "text-destructive"}>{res.body}</span> : <span className="text-muted-foreground">Click "Send Request" to call the endpoint.</span>}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
