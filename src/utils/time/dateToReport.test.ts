import { describe, it, expect } from "vitest";
import { dateToReport } from "./dateToReport";

describe("dateToReport", () => {
  it.each([
    [new Date("2021-01-01"), "Q1 2021"],
    [new Date("2021-02-01"), "Q1 2021"],
    [new Date("2021-03-01"), "Q1 2021"],
    [new Date("2021-04-01"), "Q2 2021"],
    [new Date("2021-05-01"), "Q2 2021"],
    [new Date("2021-06-01"), "Q2 2021"],
    [new Date("2021-07-01"), "Q3 2021"],
    [new Date("2021-08-01"), "Q3 2021"],
    [new Date("2021-09-01"), "Q3 2021"],
    [new Date("2021-10-01"), "Q4 2021"],
    [new Date("2021-11-01"), "Q4 2021"],
    [new Date("2021-12-01"), "Q4 2021"],
  ])("should return correct report for date %s", (date, report) => {
    expect(dateToReport(date)).toBe(report)
  })
})