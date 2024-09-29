import { describe, it, expect } from "vitest";
import { getStartAndEndPeriodFromFinancialQuarter } from "./getStartAndEndPeriodFromFinancialQuarter";

describe("getStartAndEndPeriodFromFinancialQuarter", () => {
  it.each([
    ["Q1 2022", "2022-03-31", "2022-04-02"],
    ["Q2 2022", "2022-06-30", "2022-07-02"],
    ["Q3 2022", "2022-09-30", "2022-10-02"],
    ["Q4 2022", "2022-12-31", "2023-01-02"],
  ])("should return the start and end period of a financial quarter %s", (financialQuarter, expectedStartPeriod, expectedEndPeriod) => {
    const result = getStartAndEndPeriodFromFinancialQuarter(financialQuarter);
    const startPeriod = result?.startPeriod;
    const endPeriod = result?.endPeriod;
    expect(startPeriod).toBe(expectedStartPeriod);
    expect(endPeriod).toBe(expectedEndPeriod);
  });
});