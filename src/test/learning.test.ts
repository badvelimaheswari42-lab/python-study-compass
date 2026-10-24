import { describe, it, expect } from "vitest";
import { clampMarks, levelFor, weakestTopic } from "@/lib/learning";

describe("learning rules", () => {
  it("clamps marks to 0-100", () => {
    expect(clampMarks(150)).toBe(100);
    expect(clampMarks(-5)).toBe(0);
  });
  it("below 40 is Easy", () => expect(levelFor(39.9).difficulty).toBe("Easy"));
  it("40 to below 70 is Medium", () => {
    expect(levelFor(40).difficulty).toBe("Medium");
    expect(levelFor(69).difficulty).toBe("Medium");
  });
  it("70 and up is Advanced", () => expect(levelFor(70).difficulty).toBe("Advanced"));
  it("picks the first lowest topic", () =>
    expect(weakestTopic({ A: 50, B: 20, C: 20 })).toBe("B"));
});
