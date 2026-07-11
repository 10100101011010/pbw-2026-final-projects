import { describe, expect, it } from "vitest";
import { addDaysToDateString, dateStringDayOfWeek, jakartaDateTimeToUtc, minutesFromTime, timeFromMinutes } from "../src/utils/date.js";

describe("Jakarta scheduling helpers", () => {
  it("maps documented Tuesday day-of-week to 2", () => {
    expect(dateStringDayOfWeek("2026-07-07")).toBe(2);
  });

  it("converts Jakarta local time to UTC instants", () => {
    expect(jakartaDateTimeToUtc("2026-07-07", "09:00").toISOString()).toBe("2026-07-07T02:00:00.000Z");
  });

  it("splits times through minute conversion without drift", () => {
    expect(timeFromMinutes(minutesFromTime("09:30") + 30)).toBe("10:00");
    expect(addDaysToDateString("2026-07-31", 1)).toBe("2026-08-01");
  });
});
