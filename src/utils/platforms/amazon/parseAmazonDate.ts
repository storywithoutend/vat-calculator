export const parseAmazonDate = (dateStr: string) => {
  const [day, month, year] = dateStr.split('-')
    if (!day || !month || !year) throw new Error(`parseAmazonData: ${dateStr} could not be parsed into a date`)
    return new Date([month, day, year].join('/'))
}