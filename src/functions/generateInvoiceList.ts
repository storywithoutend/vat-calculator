import { AmazonData, Invoice } from "../types"

const EXCHANGE_RATE_TABLE = {
  EUR: 1,
  GBP: 0.85873,
  PLN: 4.3648,
  SEK: 11.2834,
  CZK: 24.716,
}

export const generateInvoiceList = async (
  data: AmazonData[],
): Promise<Invoice[]> => {
  return data.map((invoice) => {
    const {
      // Typ
      SALES_CHANNEL,
      // Dokumentennummer
      VAT_INV_NUMBER,
      // Dokumentendatum
      TRANSACTION_COMPLETE_DATE,
      // USIdNr. Kunde
      BUYER_VAT_NUMBER,
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
    } = invoice

    const NET_ACTIVITY_VALUE_AMT =
      TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL - TOTAL_ACTIVITY_VALUE_VAT_AMT
    const EXCHANGE_RATE = EXCHANGE_RATE_TABLE[TRANSACTION_CURRENCY_CODE]
    const TOTAL_ACTIVITY_VALUE_VAT_AMT_IN_EURO =
      TOTAL_ACTIVITY_VALUE_VAT_AMT * EXCHANGE_RATE
    const TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL_IN_EURO =
      TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL * EXCHANGE_RATE
    const NET_ACTIVITY_VALUE_AMT_IN_EURO =
      NET_ACTIVITY_VALUE_AMT * EXCHANGE_RATE

    const isOSS = TAX_REPORTING_SCHEME === "UNION-OSS"
    const isExport = EXPORT_OUTSIDE_EU === "YES"
    const isMarketplace = TAX_COLLECTION_RESPONSIBILITY === "MARKETPLACE"
    const MARKETPLACE_PAID = isOSS
      ? "OSS"
      : isExport
      ? "EXPORT"
      : isMarketplace
      ? "UVA MARKETPLACE"
      : "UVA"
    const SALES_TYPE = BUYER_VAT_NUMBER ? "B2B" : "B2C"
    return {
      SALES_CHANNEL,
      VAT_INV_NUMBER,
      TRANSACTION_COMPLETE_DATE,
      BUYER_VAT_NUMBER,
      SALE_DEPART_COUNTRY,
      SALE_ARRIVAL_COUNTRY,
      TAXABLE_JURISDICTION,
      TRANSACTION_EVENT_ID,
      PRICE_OF_ITEMS_VAT_RATE_PERCENT,
      TOTAL_ACTIVITY_VALUE_VAT_AMT,
      TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL,
      TRANSACTION_CURRENCY_CODE,
      ARRIVAL_POST_CODE,
      ARRIVAL_CITY,
      TAX_REPORTING_SCHEME,
      EXPORT_OUTSIDE_EU,
      TAX_COLLECTION_RESPONSIBILITY,
      NET_ACTIVITY_VALUE_AMT,
      EXCHANGE_RATE,
      TOTAL_ACTIVITY_VALUE_VAT_AMT_IN_EURO,
      TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL_IN_EURO,
      NET_ACTIVITY_VALUE_AMT_IN_EURO,
      MARKETPLACE_PAID,
      SALES_TYPE,
    }
  })
}

const normalizeValue = (value?: any, fixed=2, postFix = '', multiplier = 1 ) => {
  if (!value || isNaN(value)) return ''
  return `${(value * multiplier).toFixed(fixed)}${postFix}`
}

export const generateNormalizedInvoiceList = async (data: AmazonData[]) => {
  const invoiceList = await generateInvoiceList(data)
  return invoiceList.map((invoice) => {
    return ({
    ...invoice,
    PRICE_OF_ITEMS_VAT_RATE_PERCENT: normalizeValue(invoice.PRICE_OF_ITEMS_VAT_RATE_PERCENT, 0, '%', 100),
    TOTAL_ACTIVITY_VALUE_VAT_AMT: normalizeValue(invoice.TOTAL_ACTIVITY_VALUE_VAT_AMT, 2),
    TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL: normalizeValue(invoice.TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL, 2),
    NET_ACTIVITY_VALUE_AMT: normalizeValue(invoice.NET_ACTIVITY_VALUE_AMT, 2),
    TOTAL_ACTIVITY_VALUE_VAT_AMT_IN_EURO: normalizeValue(invoice.TOTAL_ACTIVITY_VALUE_VAT_AMT_IN_EURO, 2),
    TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL_IN_EURO: normalizeValue(invoice.TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL_IN_EURO, 2),
    NET_ACTIVITY_VALUE_AMT_IN_EURO: normalizeValue(invoice.NET_ACTIVITY_VALUE_AMT_IN_EURO, 2),
  })})
}