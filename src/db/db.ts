import Dexie, { type EntityTable} from "dexie";

export interface DBFile {
  id: number
  name: string
  size: number
  count: number
  minDate: Date
  maxDate: Date
  reports: string[]
  source: 'amazon' | 'shopify'
}

export interface DBFileItem {
  id: number,
  file: number,
  source: 'amazon' | 'shopify'
  report: string
  [key: string]: any
}

export interface DBAmazonFileItem extends DBFileItem {
  source: 'amazon'
  
}

const db = new Dexie("FilesDatabase") as Dexie & {
  files: EntityTable<DBFile, 'id'>
  fileItems: EntityTable<DBFileItem, 'id'>
}

db.version(1).stores({
  files: '++id',
  fileItems: '++id, file, report'
})

export type { DBFile as File }
export { db }