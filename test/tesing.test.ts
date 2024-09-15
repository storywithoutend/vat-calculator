import { describe, it, expect } from "vitest"
import { readdirSync } from "fs"
import { resolve } from "path"
import { readFile } from "fs/promises"
import { tabDelimitedTextToJSON } from "@/utils/tabDelimitedTextToJSON"
import { parseFile } from "@/utils/parseFile/parseFile"
import { match, P } from "ts-pattern"
import {
  fileItemsToInvoiceItems,
  fileTeInvoice,
} from "@/utils/fileToInvoice/fileToInvoice"
import { invoiceListToOutput } from "@/utils/invoiceListToOutput"
import Decimal from "decimal.js"

const TEST_DATA = [
  {
    dir: "Allmates/2024-2",
    result: "Export-OSS 2024-Q2-2.csv",
  },
]

it.each(TEST_DATA)(
  `hello world`,
  async ({ dir, result }) => {
    const dirPath = resolve(__dirname, `../data/${dir}`)
    const dirContents = readdirSync(dirPath)

    if (!dirContents.includes(result)) throw "no result file"

    const sourcefiles = dirContents.filter((filename) => filename !== result)
    if (sourcefiles.length === 0) throw "no test files"

    const sources = await Promise.all(
      sourcefiles.map(async (sourceFile) => {
        const contents = await readFile(`${dirPath}/${sourceFile}`).then(
          (data) => data.toString(),
        )
        const rawData = await tabDelimitedTextToJSON(contents)
        const data = await parseFile(rawData)
        return {
          name: sourceFile,
          size: 1232322,
          ...data,
        }
      }),
    )

    const fileItems = sources.flatMap(({ items, source }, i) =>
      items.map((item: any) => ({
        file: i,
        source,
        ...item,
      })),
    )

    let counter = 0
    let refundCounter = 0
    let net = 0
    let test = 0
    let decimal = new Decimal(0)

    let object: any = {}
  
    for (const fileItem of fileItems) {
      const {
        SALE_ARRIVAL_COUNTRY,
        SALE_DEPART_COUNTRY,
        TAX_REPORTING_SCHEME,
        TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL,
        TOTAL_ACTIVITY_VALUE_VAT_AMT,
        TRANSACTION_TYPE,
        PRICE_OF_ITEMS_AMT_VAT_EXCL,
        TOTAL_ACTIVITY_VALUE_AMT_VAT_EXCL,
        TOTAL_PRICE_OF_ITEMS_AMT_VAT_EXCL,
        PRICE_OF_ITEMS_VAT_RATE_PERCENT
      } = fileItem

      const isInteresting = SALE_ARRIVAL_COUNTRY === "AT" && SALE_DEPART_COUNTRY === "DE" && TAX_REPORTING_SCHEME === "UNION-OSS"
      if (!isInteresting) continue
     
      counter++
      if (TRANSACTION_TYPE === "REFUND") {
        refundCounter++
        // console.log('refund', fileItem)
      }

      if (PRICE_OF_ITEMS_VAT_RATE_PERCENT !== '0.2') console.log(PRICE_OF_ITEMS_VAT_RATE_PERCENT)

      const GROSS = new Decimal(TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL)
      const VAT = new Decimal(TOTAL_ACTIVITY_VALUE_VAT_AMT)
      const NET = VAT.div('0.2').toDecimalPlaces(2)

      if (!GROSS.equals(NET.plus(VAT))) {
        console.log('GROSS', GROSS, NET.plus(VAT), TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL, TOTAL_ACTIVITY_VALUE_AMT_VAT_EXCL, TOTAL_ACTIVITY_VALUE_VAT_AMT, TRANSACTION_TYPE)
      }

      

      // if (!GROSS.div('1.2').equals(VAT)) {
      //   console.log(GROSS.div('1.2'), VAT, NET.times('0.2'))
      // }
      

      
      const grossSale = parseFloat(TOTAL_ACTIVITY_VALUE_AMT_VAT_INCL)
      const vat = parseFloat(TOTAL_ACTIVITY_VALUE_VAT_AMT)
      const netSale = grossSale - vat
      net += netSale
      const testItem = parseFloat(TOTAL_PRICE_OF_ITEMS_AMT_VAT_EXCL)
      // if (!isNaN(testItem)) test += testItem
      decimal = decimal.plus(VAT)

      if (!object['VAT']) object['VAT'] = new Decimal(0) 
      object['VAT'] = object['VAT'].plus(VAT)

      if (!object['GROSS']) object['GROSS'] = new Decimal(0)
      object['GROSS'] = object['GROSS'].plus(GROSS)

      if (!object['NET']) object['NET'] = new Decimal(0)
      object['NET'] = object['NET'].plus(NET)
    }

    console.log(counter, refundCounter)
    console.log(net)
    console.log(decimal)
    console.log(object)
  },
  { timeout: 30000 },
)
