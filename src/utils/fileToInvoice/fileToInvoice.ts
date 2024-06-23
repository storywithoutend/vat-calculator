import { DBAmazonFileItem, DBFileItem } from "@/db/db";
import { amazonToInvoice } from "./utils/amazonToInvoice";
import { InvoiceItem } from "../invoice/invoiceSchema";

export const fileTeInvoice = (fileItem: DBFileItem): InvoiceItem | null => {
  if (!fileItem) return null
  if (fileItem.source === 'amazon') return amazonToInvoice(fileItem as DBAmazonFileItem) as InvoiceItem
    console.error('fileToInvoice: unknown source', fileItem.source)
  return null
}