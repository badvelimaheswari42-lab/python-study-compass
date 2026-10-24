import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { TOPICS, clampMarks, levelFor, weakestTopic } from "@/lib/learning";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Personalized Learning System" },
      { name: "description", content: "Enter topic marks and get a personalized study plan." },
      { property: "og:title", content: "Personalized Learning System" },
      { property: "og:description", content: "Enter topic marks and get a personalized study plan." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const badge: Record<string, string> = {
  Easy: "bg-level-easy",
  Medium: "bg-level-medium",
  Advanced: "bg-level-advanced",
};

function Index() {
  const [name, setName] = useState("");
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [report, setReport] = useState<{ name: string; scores: Record<string, number> } | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const scores: Record<string, number> = {};
    TOPICS.forEach((t) => (scores[t] = clampMarks(parseFloat(marks[t] ?? ""))));
    setReport({ name: name.trim() || "Student", scores });
  };

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Study Planner</p>
        <h1 className="mt-2 font-display text-5xl text-foreground">Personalized Learning System</h1>

        <form onSubmit={submit} className="mt-10 rounded-2xl border bg-card p-6 shadow-soft">
          <label className="block text-sm font-medium">Student name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {TOPICS.map((t) => (
              <div key={t}>
                <label className="block text-sm font-medium">{t} (0–100)</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={marks[t] ?? ""}
                  onChange={(e) => setMarks({ ...marks, [t]: e.target.value })}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2"
                />
              </div>
            ))}
          </div>
          <button className="mt-6 rounded-md bg-primary px-5 py-2.5 font-medium text-primary-foreground hover:opacity-90">
            Generate report
          </button>
        </form>

        {report && (
          <section className="mt-10">
            <h2 className="font-display text-3xl">Report for {report.name}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {TOPICS.map((t) => {
                const m = report.scores[t];
                const l = levelFor(m);
                return (
                  <div key={t} className="rounded-xl border bg-card p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold">{t}</h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium text-primary-foreground ${badge[l.difficulty]}`}>
                        {l.difficulty}
                      </span>
                    </div>
                    <p className="mt-2 font-mono text-3xl">{m}%</p>
                    <div className="mt-2 h-2 rounded-full bg-muted">
                      <div className={`h-2 rounded-full ${badge[l.difficulty]}`} style={{ width: `${m}%` }} />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">{l.recommendation}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 rounded-xl bg-primary p-6 text-primary-foreground">
              <p className="font-mono text-xs uppercase tracking-widest opacity-80">Topic to improve</p>
              <p className="mt-1 font-display text-3xl">{weakestTopic(report.scores)}</p>
              <p className="mt-2 opacity-90">Study this topic and take another practice test.</p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
