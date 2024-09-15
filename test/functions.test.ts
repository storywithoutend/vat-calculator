import { describe, it, expect } from "vitest"
import { readdirSync } from "fs"
import { resolve } from "path"
import { readFile } from "fs/promises"
import { tabDelimitedTextToJSON } from "@/utils/tabDelimitedTextToJSON"
import { parseFile } from "@/utils/parseFile/parseFile"
import { match, P } from "ts-pattern"
import { fileItemsToInvoiceItems, fileTeInvoice } from "@/utils/fileToInvoice/fileToInvoice"
import { invoiceListToOutput } from "@/utils/invoiceListToOutput"

const TEST_DATA = [
  {
    dir: 'Allmates/2024-2',
    result: 'Export-OSS 2024-Q2-2.csv'
  }
]

it.each(TEST_DATA)(`hello world`, async ({ dir, result}) => {
  const dirPath = resolve(__dirname, `../data/${dir}`)
  const dirContents = readdirSync(dirPath)

  if (!dirContents.includes(result)) throw 'no result file'
  
  const sourcefiles = dirContents.filter((filename) => filename !== result)
  if (sourcefiles.length === 0) throw 'no test files'

  const sources = await Promise.all(sourcefiles.map( async (sourceFile) => {
    const contents = await readFile(`${dirPath}/${sourceFile}`).then((data) => data.toString())
    const rawData = await tabDelimitedTextToJSON(contents)
    const data = await parseFile(rawData)
    return {
      name: sourceFile,
      size: 1232322,
      ...data
    }
  }))

  const fileItems = sources.flatMap(({ items, source }, i) => items.map((item: any) => ({
    file: i,
    source,
    ...item
  })))


  const { data: invoiceItems } = fileItemsToInvoiceItems({ fileItems })

  const output = invoiceListToOutput({ invoiceItems, vatIds: {} })
  const outputWithHeader = [['#v1.1', '', '', '', '', '', '', '', '', '', '', ''], ...output]
  const csv = outputWithHeader.map((line) => line.join(';'))

  const results = await readFile(`${dirPath}/${result}`).then((data) => data.toString())
  const resultLines = results.split('\n').map((line) => line.trim())

  for (const line of resultLines) {
    const predicate = match(line).when((l) => l.startsWith('#'), () => (m: string) => m.startsWith('#'))
    .when((l) => l.startsWith('1'), (l) => (m: string) => m.startsWith(l.slice(0,5)))
    .when((l) => l.startsWith('3'), (l) => (m: string) => m.startsWith(l.slice(0,5)))
    .otherwise(() => (m: string) => false)

    const index = csv.findIndex(predicate)
    if (index === -1) {
      console.log('missing line', line)
      continue
    }
    
    const csvLine = csv.splice(index, 1)[0]
    expect(csvLine).toBe(line)
  }

  console.log('csv', csv[0])
  console.log('-->', resultLines[0])
  
  
}, { timeout: 30000})