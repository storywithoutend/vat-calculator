import { AMAZON_DATA_SCHEMA, AmazonDataKey } from "./amazonDataSchema"

const amazonDataKeys: AmazonDataKey[] = Object.keys(AMAZON_DATA_SCHEMA)

export const isAmazonFile = (data: unknown[]) => {
  const item = data[0] as any
  if (!item || typeof item !== "object") return false
  return amazonDataKeys.every((key) => {
    return !!item[key]
  })
}
