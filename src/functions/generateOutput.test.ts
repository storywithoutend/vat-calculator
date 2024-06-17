import { generateOutput } from './generateOutput.js';
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import { parseAmazonData } from '../utils/parseFile/parsers/parseAmazonData.js';
import { generateInvoiceList } from './generateInvoiceList.js';

describe('generateOutput', () => {
  it('should generate output', async () => {
    const rawData = fs.readFileSync("../data/682478019758.txt", "utf-8")
    const amazonData = await parseAmazonData(rawData)
    const invoiceData = await generateInvoiceList(amazonData)
    const output = await generateOutput(invoiceData)

  })})