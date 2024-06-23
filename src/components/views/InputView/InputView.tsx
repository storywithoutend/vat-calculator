import { SetStateAction, useCallback, Dispatch } from "react"
import { useDropzone } from "react-dropzone"
import styles from "./InputView.module.css"
import { FileResult, parseFiles } from "@/utils/parseFiles/parseFiles"

export const InputView = ({
  setData,
}: {
  setData: Dispatch<SetStateAction<FileResult[]>>
}) => {
  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const data = await parseFiles(acceptedFiles as unknown as FileList)
      setData((currentData: FileResult[]) => [...currentData, ...data])
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [setData],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div>
      <div className={styles.dragNDrop} {...getRootProps()}>
        <input {...getInputProps()} />
        <div>
          {isDragActive
            ? "Drop the file here"
            : "Drag and drop some files here, or click to select files"}
        </div>
      </div>
    </div>
  )
}
