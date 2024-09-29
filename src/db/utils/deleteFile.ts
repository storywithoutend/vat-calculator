import { db } from "@/db/db"

export const deleteFile = async (fileId: number) => {
  try {
    await db.fileItems.where({ file: fileId }).delete()
    await db.files.delete(fileId)
  } catch {
    console.error("Failed to delete file")
  }
}