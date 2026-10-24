import { describe, it, expect } from "vitest";
import {
  clampMarks,
  difficultyFor,
  statusFor,
  lessonFor,
  weakestTopic,
  formatScore,
} from "@/lib/learning";

describe("learning rules", () => {
  it("clamps marks to 0-100", () => {
    expect(clampMarks(150)).toBe(100);
    expect(clampMarks(-5)).toBe(0);
  });
  it("below 40 is Easy / Needs support", () => {
    expect(difficultyFor(39.9)).toBe("Easy");
    expect(statusFor(39.9)).toBe("Needs support");
  });
  it("40 to below 70 is Medium / Developing", () => {
    expect(difficultyFor(40)).toBe("Medium");
    expect(difficultyFor(69)).toBe("Medium");
    expect(statusFor(40)).toBe("Developing");
  });
  it("70 and up is Advanced / Strong", () => {
    expect(difficultyFor(70)).toBe("Advanced");
    expect(statusFor(70)).toBe("Strong");
  });
  it("uses the lesson library for the matching difficulty", () => {
    expect(lessonFor("Recursion", 10)).toBe(
      "Learn the base case and recursive case with simple examples."
    );
    expect(lessonFor("Loops", 55)).toBe("Practice nested loops and loop-control questions.");
    expect(lessonFor("Functions", 90)).toBe(
      "Create reusable programs using functions and modular design."
    );
  });
  it("falls back for unknown topics", () => {
    expect(lessonFor("OOP", 50)).toBe("Find medium-level learning materials for OOP.");
  });
  it("picks the first lowest topic", () =>
    expect(weakestTopic({ A: 50, B: 20, C: 20 })).toBe("B"));
  it("formats scores with one decimal", () => {
    expect(formatScore(75)).toBe("75.0");
    expect(formatScore(66.666)).toBe("66.7");
  });
});
