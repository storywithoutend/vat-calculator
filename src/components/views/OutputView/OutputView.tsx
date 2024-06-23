import { generateInvoiceList } from "@/functions/generateInvoiceList"
import { generateOutput } from "@/functions/generateOutput"
import { AmazonData } from "@/types"
import { useEffect, useState } from "react"

import styles from "../AmazonDataView/AmazonDataView.module.css"
import { Table } from "@/components/atoms/Table/Table"

export const OutputView = ({ data }: { data: AmazonData[] }) => {
  const [output, setOutput] = useState<any[][]>([])
  useEffect(() => {
    ;(async () => {
      const invoice = await generateInvoiceList(data)
      const output = await generateOutput(invoice)
      console.log(output)
      setOutput(output)
    })()
  }, [data])

  if (output.length === 0) return null
  return (
    <div className={styles.container}>
     <Table data={output} />
    </div>
  )
}
