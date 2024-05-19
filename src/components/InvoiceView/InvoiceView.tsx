import { generateInvoiceList } from "@/functions/generateInvoiceList"
import { AmazonData, Invoice } from "@/types"
import { useEffect, useState } from "react"

import styles from '../AmazonDataView/AmazonDataView.module.css'

export const InvoiceView = ({ data }: { data: AmazonData[] }) => {
  const [invoiceData, setInvoiceData] = useState<Invoice[]>([])
  useEffect(() => {
    (async () => {
      const invoice = await generateInvoiceList(data)
      console.log(invoice)
      setInvoiceData(invoice)
    })()
  }, [data])

  if (invoiceData.length === 0) return null

  const headers = Object.keys(invoiceData[0]) as (keyof Invoice)[]

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} className={styles.th}>{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
            { invoiceData.map((row, i) => <tr key={i}>
              { headers.map((header, j) => <td key={`header-${i}-${j}`} className={styles.td}>{row[header]?.toString()}</td>)}
            </tr>)}
        </tbody>
      </table>
    </div>
  )
}
