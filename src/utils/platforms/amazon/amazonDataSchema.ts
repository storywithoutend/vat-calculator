type RawType = 'string' | 'number' | 'boolean' | 'undefined'

export const AMAZON_DATA_SCHEMA: {
  [key in string]: RawType[] | RawType
} = {
    // Typ
    SALES_CHANNEL: 'string',
    // Dokumentennummer
    VAT_INV_NUMBER: 'string',
    // Dokumentendatum
    TRANSACTION_COMPLETE_DATE: 'string',
    // USIdNr. Kunde
    // BUYER_VAT_NUMBER: ['string', 'undefined'],
    // Versandstartland
    SALE_DEPART_COUNTRY: 'string',
    // Versandzielland
    SALE_ARRIVAL_COUNTRY: 'string',
    // Steuerland
    TAXABLE_JURISDICTION: 'string',
    // Bestellnummer
    TRANSACTION_EVENT_ID: 'string',
    // Steuersatz
    PRICE_OF_ITEMS_VAT_RATE_PERCENT: 'number',
    // Betrag USt
    TOTAL_ACTIVITY_VALUE_VAT_AMT: 'number',
    // Betrag Brutto
    TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL: 'number',
    // Währung
    TRANSACTION_CURRENCY_CODE: 'string',
    // PLZ
    ARRIVAL_POST_CODE: 'string',
    // Stadt
    ARRIVAL_CITY: 'string',
    TAX_REPORTING_SCHEME: 'string',
    EXPORT_OUTSIDE_EU: 'boolean',
    TAX_COLLECTION_RESPONSIBILITY: 'string',
} as const

export type AmazonDataSchema = typeof AMAZON_DATA_SCHEMA
export type AmazonDataKey = keyof AmazonDataSchema