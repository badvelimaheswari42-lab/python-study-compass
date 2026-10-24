export const TOPICS = [
  "Python Basics",
  "Loops",
  "Functions",
  "Data Structures",
  "Recursion",
] as const;

export type Difficulty = "Easy" | "Medium" | "Advanced";
export type Status = "Needs support" | "Developing" | "Strong";

export type Level = { difficulty: Difficulty; status: Status };

// Example lesson recommendations. Replace with links or lessons for your course.
export const LESSON_LIBRARY: Record<string, Record<"easy" | "medium" | "advanced", string>> = {
  "Python Basics": {
    easy: "Review variables, data types, and input/output.",
    medium: "Practice conditions and simple programming problems.",
    advanced: "Build a small Python program using multiple concepts.",
  },
  Loops: {
    easy: "Review for-loops and while-loops with simple examples.",
    medium: "Practice nested loops and loop-control questions.",
    advanced: "Solve pattern-printing and algorithmic loop problems.",
  },
  Functions: {
    easy: "Review function definitions, parameters, and return values.",
    medium: "Practice functions with multiple parameters and return values.",
    advanced: "Create reusable programs using functions and modular design.",
  },
  "Data Structures": {
    easy: "Review lists, tuples, sets, and dictionaries.",
    medium: "Practice searching, sorting, and dictionary problems.",
    advanced: "Solve problems using stacks, queues, and nested structures.",
  },
  Recursion: {
    easy: "Learn the base case and recursive case with simple examples.",
    medium: "Practice factorial and Fibonacci problems.",
    advanced: "Solve tree traversal and backtracking problems.",
  },
};

export function clampMarks(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

export function difficultyFor(score: number): Difficulty {
  if (score < 40) return "Easy";
  if (score < 70) return "Medium";
  return "Advanced";
}

export function statusFor(score: number): Status {
  if (score < 40) return "Needs support";
  if (score < 70) return "Developing";
  return "Strong";
}

export function levelFor(score: number): Level {
  return { difficulty: difficultyFor(score), status: statusFor(score) };
}

export function lessonFor(topic: string, score: number): string {
  const level = difficultyFor(score).toLowerCase() as "easy" | "medium" | "advanced";
  return (
    LESSON_LIBRARY[topic]?.[level] ??
    `Find ${level}-level learning materials for ${topic}.`
  );
}

export function weakestTopic(scores: Record<string, number>): string {
  return Object.keys(scores).reduce((a, b) => ((scores[b] ?? 0) < (scores[a] ?? 0) ? b : a));
}

export type Attempt = { at: string; scores: Record<string, number> };
export type Progress = Record<string, Attempt[]>;

const PROGRESS_KEY = "student_progress";

export function loadProgress(): Progress {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PROGRESS_KEY);
    return raw ? (JSON.parse(raw) as Progress) : {};
  } catch {
    return {};
  }
}

export function saveAttempt(name: string, scores: Record<string, number>): Attempt[] {
  const progress = loadProgress();
  const attempt: Attempt = { at: new Date().toISOString(), scores };
  const attempts = [...(progress[name] ?? []), attempt];
  try {
    window.localStorage.setItem(PROGRESS_KEY, JSON.stringify({ ...progress, [name]: attempts }));
  } catch {
    // storage unavailable (private mode etc.) — keep the in-memory report anyway
  }
  return attempts;
}

export function formatScore(score: number): string {
  return score.toFixed(1);
}
