import { describe, it, expect } from "vitest";
import { parseFile } from "./parseFile";
import fs from 'fs';
import { tabDelimitedTextToJSON } from "../tabDelimitedTextToJSON";

const AMAZON_SAMPLE_DATA: [string][] = [['677835019730.txt'], ['682478019758.txt'], ['687194019786.txt'], ['692847019821.txt']]

describe("parseData", () => {
  it.each(AMAZON_SAMPLE_DATA)("should parse Amazon data %s", async (file) => {
    const rawData = fs.readFileSync(`../data/${file}`, "utf-8")
    const data = await tabDelimitedTextToJSON(rawData)
    const json = await parseFile(data)
})})