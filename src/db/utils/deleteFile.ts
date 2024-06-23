import { db } from "@/db/db"

export const deleteFile = async (fileId: number) => {
  try {
    await db.files.delete(fileId)
    await db.fileItems.where({ file: fileId }).delete()
  } catch {
    alert("Failed to delete file")
  }
}