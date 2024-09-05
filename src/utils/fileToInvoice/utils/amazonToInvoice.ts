import { DBAmazonFileItem } from '@/db/db';
import { getExchangeRate } from '@/utils/currency/getExchangeRate';
import { InvoiceItem } from '@/utils/invoice/invoiceSchema';
import { parseAmazonDate } from '@/utils/platforms/amazon/parseAmazonDate';

export const amazonToInvoice = ({
  id,
  // Typ
  SALES_CHANNEL,
  // Dokumentennummer
  VAT_INV_NUMBER,
  // Dokumentendatum
  TRANSACTION_COMPLETE_DATE,
  TRANSACTION_SELLER_VAT_NUMBER,
  // USIdNr. Kunde
  BUYER_VAT_NUMBER = '',
  // Versandstartland
  SALE_DEPART_COUNTRY,
  // Versandzielland
  SALE_ARRIVAL_COUNTRY,
  // Steuerland
  TAXABLE_JURISDICTION,
  // Bestellnummer
  TRANSACTION_EVENT_ID,
  // Steuersatz
  PRICE_OF_ITEMS_VAT_RATE_PERCENT,
  // Betrag USt
  TOTAL_ACTIVITY_VALUE_VAT_AMT,
  // Betrag Brutto
  TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL,
  // Währung
  TRANSACTION_CURRENCY_CODE,
  // PLZ
  ARRIVAL_POST_CODE,
  // Stadt
  ARRIVAL_CITY,
  TAX_REPORTING_SCHEME,
  EXPORT_OUTSIDE_EU,
  TAX_COLLECTION_RESPONSIBILITY,
}: DBAmazonFileItem): InvoiceItem => {
  
  const grossSale = parseFloat(TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL)
  const vat = parseFloat(TOTAL_ACTIVITY_VALUE_VAT_AMT)
  const netSale = grossSale - vat
  const transactionCurrency = TRANSACTION_CURRENCY_CODE 
  const exchangeRate = getExchangeRate('EUR', transactionCurrency)
  const totalSaleEuro = grossSale * exchangeRate
  const vatEuro = vat * exchangeRate
  const netSaleEuro = netSale * exchangeRate

  const isOSS = TAX_REPORTING_SCHEME === "UNION-OSS"
  const isExport = EXPORT_OUTSIDE_EU === "YES"
  const isMarketplace = TAX_COLLECTION_RESPONSIBILITY === "MARKETPLACE"
  const marketPlace = isOSS
    ? "OSS"
    : isExport
    ? "EXPORT"
    : isMarketplace
    ? "UVA MARKETPLACE"
    : "UVA"

  // If B2B, shoudl not be UNION-OSS
  const SALES_TYPE = BUYER_VAT_NUMBER ? "B2B" : "B2C"
  return {
    id,
    source: 'amazon',
    salesChannel: SALES_CHANNEL,
    vatInvoiceNumber: VAT_INV_NUMBER,
    transactionDate: parseAmazonDate(TRANSACTION_COMPLETE_DATE),
    buyerVatNumber: BUYER_VAT_NUMBER,
    sellerVatNumber: TRANSACTION_SELLER_VAT_NUMBER,
    departCountry: SALE_DEPART_COUNTRY,
    arrivalCountry: SALE_ARRIVAL_COUNTRY,
    vatCountry: TAXABLE_JURISDICTION,
    transactionId: TRANSACTION_EVENT_ID,
    netSale,
    vat,
    vatRate: PRICE_OF_ITEMS_VAT_RATE_PERCENT,
    grossSale,
    transactionCurrency,
    arrivalPostCode: ARRIVAL_POST_CODE,
    arrivalCity: ARRIVAL_CITY,
    taxReportingScheme: TAX_REPORTING_SCHEME,
    isExportOutsideEU: EXPORT_OUTSIDE_EU === 'YES',
    taxResponsibility: TAX_COLLECTION_RESPONSIBILITY,
    exchangeRate,
    vatEuro,
    totalSaleEuro,
    netSaleEuro, 
    marketPlace,
    salesType: SALES_TYPE,
  }
}