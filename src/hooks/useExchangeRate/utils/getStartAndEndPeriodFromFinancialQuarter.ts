export const getStartAndEndPeriodFromFinancialQuarter = (financialQuarter: string, days = 2) => {
  const matches = financialQuarter.match(/Q([1|2|3|4])\s(\d{4})/)
  const quarter = matches?.[1] ? parseInt(matches[1]) : null
  const year = matches?.[2] ? parseInt(matches[2]) : null
  if (!quarter || !year) return null

  const startPeriod = new Date(year, quarter * 3, 0)
  const endPeriod = new Date(startPeriod.getTime())
  endPeriod.setDate(endPeriod.getDate() + days)

  return {
    startPeriod: startPeriod.toLocaleDateString('en-CA'),
    endPeriod: endPeriod.toLocaleDateString('en-CA'),
  }
  
}