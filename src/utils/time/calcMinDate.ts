export const calcMinDate = (...args: (Date | undefined)[]) => {
  return args.reduce((min, date) => {
    if (!min) return date
    if (!date) return min
    return date < min ? date : min
  })
}
