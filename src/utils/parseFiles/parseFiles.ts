import { parseFile } from "../parseFile/parseFile"
import { tabDelimitedTextToJSON } from "../tabDelimitedTextToJSON"

type Source = "amazon" | "shopify"

interface FileBaseResult<TData = unknown> {
  name: string
  size: number
  status?: "success" | "error"
  source?: Source
  count?: number
  items?: TData
  errorMessage?: string
  minDate?: Date
  maxDate?: Date
}

interface FileAmazonResult<TData = unknown> extends FileBaseResult<TData> {
  status: "success"
  source: "amazon"
  count: number
  items: TData
  errorMessage: undefined
}

interface FileErrorResult extends FileBaseResult<undefined> {
  status: "error"
  errorMessage: string
  source: undefined
  count: undefined
  items: undefined
}

export type FileResult = FileAmazonResult<any> | FileErrorResult

export const parseFiles = async (files: FileList): Promise<FileResult[]> => {
  const filesArray = Array.from(files)
  return Promise.all(
    filesArray.map(async (file) => {
      try {
        const contents = await file.text()
        const rawData = (await tabDelimitedTextToJSON(contents)) as unknown[]
        const data = await parseFile(rawData)
        return {
          ...data,
          name: file.name,
          size: file.size,
          status: "success",
        } as const
      } catch (e: unknown) {
        const error = e as Error
        return {
          name: file.name,
          size: file.size,
          status: "error",
          errorMessage: error.message,
          source: undefined,
          count: undefined,
          items: undefined,
        }
      }
    }),
  )
}
