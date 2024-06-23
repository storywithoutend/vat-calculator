export const dateToReport = (date: Date) => {
  const month = date.getMonth()
  const quarter = Math.floor(month / 3) + 1
  const year = date.getFullYear()
  return `Q${quarter} ${year}`
}