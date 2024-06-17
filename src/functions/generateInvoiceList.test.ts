import { generateInvoiceList } from "./generateInvoiceList.js";
import { describe, it, expect } from "vitest";
import fs from 'fs';
import { parseAmazonData } from "../utils/parseFile/parsers/parseAmazonData.js";

describe("generateInvoiceList", () => {
  it("should generate invoice list", async () => {
    const rawData = fs.readFileSync("../data/682478019758.txt", "utf-8")
    const amazonData = await parseAmazonData(rawData)
    const invoiceList = await generateInvoiceList(amazonData)
    expect(invoiceList.every((invoice) => true)).toBe(true)
    console.log(invoiceList)
  })})