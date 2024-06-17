import { parseAmazonData } from "./parseAmazonData.js"
import { describe, it, expect } from "vitest"
import fs from 'fs';
import { AmazonData } from "@/types";

describe("parseAmazonData", () => {
  it("should parse Amazon data", async () => {
    const sampleData = fs.readFileSync("../data/682478019758.txt", "utf-8")
    const json = await parseAmazonData(sampleData)
    expect(json.every((row: AmazonData) => {
      // TODO: Add more tests
      return typeof row.SALES_CHANNEL === 'string'
    })).toBe(true)
  })
})
