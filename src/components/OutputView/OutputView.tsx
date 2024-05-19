import { generateInvoiceList } from "@/functions/generateInvoiceList"
import { generateOutput } from "@/functions/generateOutput"
import { AmazonData } from "@/types"
import { useEffect, useState } from "react"

import styles from "../AmazonDataView/AmazonDataView.module.css"

export const OutputView = ({ data }: { data: AmazonData[] }) => {
  const [output, setOutput] = useState<any[][]>([])
  useEffect(() => {
    ;(async () => {
      const invoice = await generateInvoiceList(data)
      const output = await generateOutput(invoice)
      setOutput(output)
    })()
  }, [data])

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        {output.map((row, i) => (
          <tr key={i}>
            {row.map((cell, j) => (
              <td key={`cell-${i}-${j}`} className={styles.td}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </table>
    </div>
  )
}
