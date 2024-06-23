import { AmazonData } from "@/types";
import { parseAmazonDate } from "./parseAmazonDate";
import { dateToReport } from "@/utils/time/dateToReport";

export const parseAmazonFile = (file: AmazonData[]) => {

  const { minDate, maxDate, reports} = file.reduce<{ minDate?: Date, maxDate?: Date, reports: string[]}>((acc, cur) => {
    // @ts-ignore
    const dateStr = cur.TRANSACTION_COMPLETE_DATE as string
    if (!dateStr) return acc

    const date = parseAmazonDate(dateStr)
    const report = dateToReport(date)

    return {
      minDate: !acc.minDate || date < acc.minDate ? date : acc.minDate,
      maxDate: !acc.maxDate || date > acc.maxDate ? date : acc.maxDate,
      reports: acc.reports.includes(report) ? acc.reports : [...acc.reports, report]
    }
  }, {
    minDate: undefined,
    maxDate: undefined,
    reports: []
  })

  const items = file.map((item) => ({
    ...item,
    report: dateToReport(parseAmazonDate(item.TRANSACTION_COMPLETE_DATE))
  }))

  return {
    source: 'amazon',
    minDate,
    maxDate,
    reports,
    items,
    count: items.length
  } as const
}