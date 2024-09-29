import { DBAmazonFileItem, DBFileItem } from "@/db/db";
import { amazonToInvoice } from "./utils/amazonToInvoice";
import { InvoiceItem } from "../invoice/invoiceSchema";
import { UseExchangeRatesReturnType } from "@/hooks/useExchangeRate/useExchangeRate";

export type Dependencies = {
  exchangeRates: UseExchangeRatesReturnType[]
}

export const fileTeInvoice = (depedencies: Dependencies) => (fileItem: DBFileItem): InvoiceItem | null => {
  if (!fileItem) return null
  if (fileItem.source === 'amazon') return amazonToInvoice(depedencies)(fileItem as DBAmazonFileItem) as InvoiceItem
    console.error('fileToInvoice: unknown source', fileItem.source)
  return null
}

export const fileItemsToInvoiceItems = (depdencies: Dependencies) => ({ fileItems }: {fileItems: DBFileItem[]}): { data: InvoiceItem[]; errors: string[]} => {
  if (!fileItems) return { data: [], errors: ['fileItem does not exist']}
  const data = fileItems.map(fileTeInvoice(depdencies)).filter((item): item is InvoiceItem => !!item)
  return { data, errors: [] }
}