export type InvoiceItem = {
  id: number
  source: 'amazon' | 'shopify'
  salesChannel: string
  vatInvoiceNumber: string
  transactionDate: Date
  buyerVatNumber: string
  sellerVatNumber: string
  departCountry: string
  arrivalCountry: string
  vatCountry: string
  transactionId: string
  netSale: number
  vat: number
  vatRate: number
  grossSale: number
  transactionCurrency: string
  arrivalPostCode: string
  arrivalCity: string
  taxReportingScheme: string
  isExportOutsideEU: boolean
  taxResponsibility: string
  exchangeRate: number
  vatEuro: number
  totalSaleEuro: number
  netSaleEuro: number 
  marketPlace: string
  salesType: string
}

export const INVOICE_SCHEMA = {
  salesChannel: 'string',
  vatInvoiceNumber: 'string',
  transactionDate: 'date',
  buyerVatNumber: 'string',
  sellerVatNumber: 'string',
  departCountry: 'string',
  arrivalCountry: 'string',
  vatCountry: 'string',
  transactionId: 'string',
  netSale: 'number',
  vat: 'number',
  vatRate: 'number',
  grossSale: 'number',
  transactionCurrency: 'string',
  arrivalPostCode: 'string',
  arrivalCity: 'string',
  taxReportingScheme: 'string',
  isExportOutsideEU: 'boolean',
  taxResponsibility: 'string',
  exchangeRate: 'number',
  vatEuro: 'number',
  totalSaleEuro: 'number',
  netSaleEuro: 'number', 
  marketPlace: 'string',
  salesType: 'string',
}