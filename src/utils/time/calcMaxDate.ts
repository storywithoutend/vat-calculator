export const calcMaxDate = (...args: (Date | undefined)[]) => {
  return args.reduce((max, date) => {
    if (!max) return date
    if (!date) return max
    return date < max ? max : date
  })
}
