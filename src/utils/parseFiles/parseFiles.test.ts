import { describe, it, expect } from "vitest";
import { parseFiles } from "./parseFiles";
import { readFileSync } from "fs";


const files = [
  'test/data/677835019730.txt'
].map((fileName) => ({
  name: fileName.split('/').reverse()[0],
  size: 234234234,
  text: () => Promise.resolve(readFileSync(fileName, 'utf-8'))
})) as unknown as FileList

console.log('files', files)

describe('paresFiles', () => {
  it('should work', async () => {
    const result = await parseFiles(files)
    // await expect(result).toEqual([
    //   {

    //   }
    // ])
  })

  it('should return error', async () => {
    const errorFile = [
      {
        name: 'error',
        size: 23423423423,
        text: () => {throw new Error('test error')}
      }
    ] as unknown as FileList
    const result = await parseFiles(errorFile)
    console.log('result', result)
  })
})