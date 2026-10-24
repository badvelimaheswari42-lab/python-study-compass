import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  TOPICS,
  clampMarks,
  formatScore,
  levelFor,
  lessonFor,
  saveAttempt,
  statusFor,
  weakestTopic,
  type Attempt,
} from "@/lib/learning";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI-Powered Personalized Learning System" },
      {
        name: "description",
        content:
          "Enter topic marks and get a personalized report: knowledge gaps, adaptive difficulty, topic recommendations and progress across repeated attempts.",
      },
      { property: "og:title", content: "AI-Powered Personalized Learning System" },
      {
        property: "og:description",
        content:
          "Rule-based personalized learning: performance analysis, knowledge-gap detection, adaptive difficulty and topic recommendations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const difficultyBadge: Record<string, string> = {
  Easy: "bg-level-easy",
  Medium: "bg-level-medium",
  Advanced: "bg-level-advanced",
};

const statusBadge: Record<string, string> = {
  "Needs support": "bg-level-easy",
  Developing: "bg-level-medium",
  Strong: "bg-level-advanced",
};

function Index() {
  const [name, setName] = useState("");
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [report, setReport] = useState<{
    name: string;
    scores: Record<string, number>;
    attempts: Attempt[];
  } | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const student = name.trim() || "Student";
    const scores: Record<string, number> = {};
    TOPICS.forEach((t) => (scores[t] = clampMarks(parseFloat(marks[t] ?? ""))));
    const attempts = saveAttempt(student, scores);
    setReport({ name: student, scores, attempts });
  };

  const attemptNumber = report ? report.attempts.length : 0;
  const previous = report && report.attempts.length > 1 ? report.attempts[report.attempts.length - 2] : null;

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-primary">Study Planner</p>
        <h1 className="mt-2 font-display text-5xl text-foreground">
          AI-Powered Personalized Learning System
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Performance analysis, knowledge-gap detection, adaptive difficulty, topic recommendations
          and continuous feedback through repeated attempts. Uses transparent rule-based scoring —
          not a trained ML model.
        </p>

        <form onSubmit={submit} className="mt-10 rounded-2xl border bg-card p-6 shadow-soft">
          <label htmlFor="student-name" className="block text-sm font-medium">Student name</label>
          <input
            id="student-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="mt-1 w-full rounded-md border bg-background px-3 py-2"
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {TOPICS.map((t) => (
              <div key={t}>
                <label htmlFor={`topic-${t}`} className="block text-sm font-medium">{t} (0–100)</label>
                <input
                  id={`topic-${t}`}
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
            <div className="rounded-2xl border bg-card p-6 shadow-soft">
              <h2 className="font-display text-3xl">Personalized Learning Report — {report.name}</h2>
              <p className="mt-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Attempt #{attemptNumber} · {new Date().toLocaleString()}
              </p>

              <div className="mt-6 space-y-4">
                {TOPICS.map((t) => {
                  const m = report.scores[t] ?? 0;
                  const difficulty = levelFor(m).difficulty;
                  const status = statusFor(m);
                  const prev = previous?.scores[t];
                  const delta = prev === undefined ? null : m - prev;
                  return (
                    <div key={t} className="rounded-xl border bg-background p-5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <h3 className="font-semibold">{t}</h3>
                        <div className="flex gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium text-primary-foreground ${statusBadge[status]}`}
                          >
                            {status}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-medium text-primary-foreground ${difficultyBadge[difficulty]}`}
                          >
                            Suggested: {difficulty}
                          </span>
                        </div>
                      </div>
                      <p className="mt-2 font-mono text-3xl">{formatScore(m)}%</p>
                      {delta !== null && (
                        <p
                          className={`font-mono text-xs ${delta >= 0 ? "text-emerald-600" : "text-red-600"}`}
                        >
                          {delta >= 0 ? "▲" : "▼"} {delta >= 0 ? "+" : ""}
                          {formatScore(delta)}% since last attempt
                        </p>
                      )}
                      <div className="mt-2 h-2 rounded-full bg-muted">
                        <div
                          className={`h-2 rounded-full ${difficultyBadge[difficulty]}`}
                          style={{ width: `${m}%` }}
                        />
                      </div>
                      <p className="mt-3 text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">Recommendation:</span>{" "}
                        {lessonFor(t, m)}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-xl bg-primary p-6 text-primary-foreground">
                <p className="font-mono text-xs uppercase tracking-widest opacity-80">
                  Personalized recommendation
                </p>
                <p className="mt-1 font-display text-3xl">Topic to improve: {weakestTopic(report.scores)}</p>
                <p className="mt-2 opacity-90">
                  Recommended action: study this topic and take another practice test.
                </p>
              </div>

              <p className="mt-6 text-xs text-muted-foreground">
                Progress is saved on this device, so repeated attempts build up a history for{" "}
                {report.name}. Enter new marks and generate the report again to see score changes.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
