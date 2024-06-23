import { getFinancialQuarters } from "./getFinancialQuarters";
import { describe, it, expect } from "vitest";

describe('getFinancialQuarters', () => {
  it('should be correct', () => {
    const result = getFinancialQuarters(new Date(2022, 1, 1), new Date(2022, 1, 30))
    expect(result).toStrictEqual(['Q1 2022'])
  }) 
  it('should be correct', () => {
    const result = getFinancialQuarters(new Date(2022, 1, 4), new Date(2023, 4, 4))
    expect(result).toStrictEqual(['Q1 2022', 'Q2 2022', 'Q3 2022', 'Q4 2022', 'Q1 2023', 'Q2 2023'])
  })
})