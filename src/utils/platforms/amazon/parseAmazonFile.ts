import { AmazonData } from "@/types";
import { parseAmazonDate } from "./parseAmazonDate";

export const parseAmazonFile = (file: AmazonData[]) => {
  const { minDate, maxDate} = file.reduce<{ minDate?: Date, maxDate?: Date}>((acc, cur) => {
    // @ts-ignore
    const dateStr = cur.TRANSACTION_COMPLETE_DATE as string
    if (!dateStr) return acc

    const date = parseAmazonDate(dateStr)

    return {
      minDate: !acc.minDate || date < acc.minDate ? date : acc.minDate,
      maxDate: !acc.maxDate || date > acc.maxDate ? date : acc.maxDate
    }
  }, {
    minDate: undefined,
    maxDate: undefined
  })
  return {
    source: 'amazon',
    minDate,
    maxDate,
    items: file,
    count: file.length
  } as const
}