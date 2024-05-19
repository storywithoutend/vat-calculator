import csvtojson from 'csvtojson';

export const tabDelimitedTextToJSON = async <T extends {}>(text: string): Promise<T[]> => {
  return csvtojson({delimiter: '\t'}).fromString(text) as unknown as T[]
}