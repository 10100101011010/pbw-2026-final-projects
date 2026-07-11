import { describe, expect, it } from "vitest";
import { calculateEligibility } from "../src/modules/students/eligibility.service.js";

describe("calculateEligibility", () => {
  it("allows Sarjana-Magister students without PI when other requirements pass", () => {
    const result = calculateEligibility(
      { email: "rangga@student.gunadarma.ac.id" },
      { completedSks: 144, piCompleted: false, isSarMag: true },
      [{ isActive: true }]
    );

    expect(result.eligible).toBe(true);
    expect(result.status).toBe("ELIGIBLE");
  });

  it("blocks non Sarjana-Magister students who have not completed PI", () => {
    const result = calculateEligibility(
      { email: "ayu@student.gunadarma.ac.id" },
      { completedSks: 144, piCompleted: false, isSarMag: false },
      [{ isActive: true }]
    );

    expect(result.eligible).toBe(false);
    expect(result.reasons).toContain("Penulisan Ilmiah must be completed unless the student is Sarjana-Magister.");
  });
});
