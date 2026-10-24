export const TOPICS = ["Python Basics", "Loops", "Functions", "Data Structures"] as const;

export type Level = { difficulty: "Easy" | "Medium" | "Advanced"; recommendation: string };

export function clampMarks(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(100, n));
}

export function levelFor(marks: number): Level {
  if (marks < 40)
    return { difficulty: "Easy", recommendation: "Learn the basics and practice simple exercises." };
  if (marks < 70)
    return { difficulty: "Medium", recommendation: "Revise concepts and solve more practice questions." };
  return { difficulty: "Advanced", recommendation: "Try advanced exercises and projects." };
}

export function weakestTopic(scores: Record<string, number>): string {
  return Object.keys(scores).reduce((a, b) => (scores[b] < scores[a] ? b : a));
}
