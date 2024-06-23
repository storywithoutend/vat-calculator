import { parseAmazonFile } from "../platforms/amazon/parseAmazonFile"
import { isAmazonFile } from "../platforms/amazon/isAmazonFile"
import { AmazonData } from "@/types"

export type Data = {
  source: 'amazon',
  minDate?: Date,
  maxDate?: Date,
  report?: string,
  items: any[],
  count: number
}

export const parseFile = (data: unknown[]): Data => {
  if (isAmazonFile(data)) return parseAmazonFile(data as AmazonData[])
  throw new Error('parseData: could not identify file type')
}