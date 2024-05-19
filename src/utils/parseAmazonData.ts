import { tabDelimitedTextToJSON } from "./tabDelimitedTextToJSON"
import { AmazonData } from '../types/index';

type RawType = 'string' | 'number' | 'boolean' | 'undefined'

const AMAZON_DATA_SCHEMA: {
  [key in string]: RawType[] | RawType
} = {
    // Typ
    SALES_CHANNEL: 'string',
    // Dokumentennummer
    VAT_INV_NUMBER: 'string',
    // Dokumentendatum
    TRANSACTION_COMPLETE_DATE: 'string',
    // USIdNr. Kunde
    BUYER_VAT_NUMBER: ['string', 'undefined'],
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

type AmazonDataSchema = typeof AMAZON_DATA_SCHEMA
type AmazonDataKey = keyof AmazonDataSchema

const parseBooleanValue = (value: unknown): boolean => {
  if (value === 'YES') return true
  if (value === true) return true
  return false
}

export const parseAmazonData = async (text: string): Promise<AmazonData[]> => {
  let total =0
  let error: any = {}
  const data = await tabDelimitedTextToJSON(text)
  const results = data.map((row) => { 
    total += 1
    return Object.fromEntries(Object.entries(row).map(([key, value]) => {
    const rawTypes = AMAZON_DATA_SCHEMA[key as AmazonDataKey] 
    if (!rawTypes) return [key, value]
    const types = Array.isArray(rawTypes) ? rawTypes : [rawTypes]
    if (types.includes('undefined') && !value) return [key, undefined]
    if (types.includes('boolean')) return [key, parseBooleanValue(value)]
    if (types.includes('number')) return [key, parseFloat(value as string)]
    if (types.includes('string') && value) return [key, value.toString()]
    console.log(`Invalid value for key ${key}: ${value}`)
    if (error[key]) error[key] += 1 
    else error[key] = 1
    return [key, value]
  }))}) as AmazonData[]
  return results
}