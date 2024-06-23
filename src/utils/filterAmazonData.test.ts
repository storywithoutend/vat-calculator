import { filterAmazonData } from './filterAmazonData.mjs';
import { describe, it, expect } from 'vitest';
import fs from 'fs';
import { parseAmazonData } from './parseFile/parsers/parseAmazonData.js';

describe('filterAmazonData', () => {
  it('should filter Amazon data', async () => {
    const sampleData = fs.readFileSync("../data/682478019758.txt", "utf-8")
    const json = await parseAmazonData(sampleData)
    const filteredData = await filterAmazonData(json)
    expect(filteredData.every((item: any) => item.TAX_REPORTING_SCHEME === 'UNION-OSS')).toBe(true);
    expect(filteredData.length).toBeLessThanOrEqual(json.length);
    expect(filteredData.length).toBeGreaterThanOrEqual(0);
  });
});