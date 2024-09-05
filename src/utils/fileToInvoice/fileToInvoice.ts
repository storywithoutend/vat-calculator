import { DBAmazonFileItem, DBFileItem } from "@/db/db";
import { amazonToInvoice } from "./utils/amazonToInvoice";
import { InvoiceItem } from "../invoice/invoiceSchema";

export const fileTeInvoice = (fileItem: DBFileItem): InvoiceItem | null => {
  if (!fileItem) return null
  if (fileItem.source === 'amazon') return amazonToInvoice(fileItem as DBAmazonFileItem) as InvoiceItem
    console.error('fileToInvoice: unknown source', fileItem.source)
  return null
}

export const fileItemsToInvoiceItems = ({ fileItems }: {fileItems: DBFileItem[]}): { data: InvoiceItem[]; errors: string[]} => {
  if (!fileItems) return { data: [], errors: ['fileItem does not exist']}
  const data = fileItems.map(fileTeInvoice).filter((item): item is InvoiceItem => !!item)
  return { data, errors: [] }
}