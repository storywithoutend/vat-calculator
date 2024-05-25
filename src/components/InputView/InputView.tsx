import { AmazonData } from "@/types"
import { tabDelimitedTextToJSON } from "@/utils/tabDelimitedTextToJSON"
import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import styles from './InputView.module.css'

export const InputView = ({ setData}: { setData: (data: AmazonData[]) => void}) => {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const txt = await acceptedFiles[0].text()
    const data = await tabDelimitedTextToJSON(txt) as AmazonData[]
    setData(data)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (
    <div>
      <div className={styles.dragNDrop}{...getRootProps()}>
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
