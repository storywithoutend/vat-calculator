import { tabDelimitedTextToJSON } from '@/utils/tabDelimitedTextToJSON'
import { AmazonData } from '@/types/index';
import { AMAZON_DATA_SCHEMA, AmazonDataKey } from '@/utils/platforms/amazon/amazonDataSchema';


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