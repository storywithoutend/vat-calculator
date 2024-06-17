export const getFinancialQuarters = (date1?: Date, date2?: Date) => {
  if (!date1 || !date2) return []
  const minDate = date1 < date2 ? date1 : date2
  const maxDate = date1 < date2 ? date2 : date1
  const minMonth = minDate.getMonth()
  const maxMonth = maxDate.getMonth()
  const minQuarter = Math.floor(minMonth / 3) 
  const maxQuarter = Math.floor(maxMonth/ 3)
  const minYear = minDate.getFullYear()
  const maxYear = maxDate.getFullYear()
  let numQuarters = (maxYear - minYear) * 4 - minQuarter + maxQuarter + 1

  return Array.from({ length: numQuarters}, (_, i) => {
    const quarter = (minQuarter + i) % 4 + 1
    const year = minYear + Math.floor((minQuarter + i) / 4)
    return `Q${quarter} ${year}`
  })
}