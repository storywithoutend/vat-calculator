import { DBAmazonFileItem } from '@/db/db';
import { InvoiceItem } from '@/utils/invoice/invoiceSchema';
import { parseAmazonDate } from '@/utils/platforms/amazon/parseAmazonDate';

import { Dependencies } from '../fileToInvoice';
import { dateToReport } from '@/utils/time/dateToReport';

export const amazonToInvoice = ({ exchangeRates }: Dependencies) => (item: DBAmazonFileItem): InvoiceItem => {

  const {
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
    VAT_INV_EXCHANGE_RATE,
    VAT_INV_CURRENCY_CODE,
    VAT_INV_CONVERTED_AMT,
  } = item

  const date = parseAmazonDate(TRANSACTION_COMPLETE_DATE)
  const report = dateToReport(date)
  const getExchangeRate = (currency: string) => {
    if (currency === 'EUR' || '') return 1
    const currentData = exchangeRates.find(({ financialQuarter}) => financialQuarter === report)
    if (!currentData) {
      console.error('Exchange rate table not found', report, exchangeRates)
      return 1
    }
    const currencyCode = currency as keyof typeof currentData.exchangeRates
    if (currentData?.exchangeRates[currencyCode]) return currentData.exchangeRates[currencyCode] as number
    console.error('Exchange rate not found for', currency,'in', report)
    return 1
  }
  
  const grossSale = parseFloat(TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL)
  const vat = parseFloat(TOTAL_ACTIVITY_VALUE_VAT_AMT)
  const netSale = grossSale - vat
  const transactionCurrency = TRANSACTION_CURRENCY_CODE 
  const exchangeRate = getExchangeRate(transactionCurrency)
  const totalSaleEuro = grossSale / exchangeRate
  const vatEuro = vat / exchangeRate
  const netSaleEuro = netSale / exchangeRate

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

  if (isOSS && !!transactionCurrency && transactionCurrency !== 'EUR') console.log(SALE_DEPART_COUNTRY, '->', `${SALE_ARRIVAL_COUNTRY}:`, `currency = ${TRANSACTION_CURRENCY_CODE};`, `vat rate = ${VAT_INV_EXCHANGE_RATE || 'N/A'}`)

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