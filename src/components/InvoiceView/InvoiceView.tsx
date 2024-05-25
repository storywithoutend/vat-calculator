import { generateNormalizedInvoiceList } from "@/functions/generateInvoiceList"
import { AmazonData, Invoice } from "@/types"
import { useEffect, useState } from "react"

import styles from '../AmazonDataView/AmazonDataView.module.css'
import { Table } from "../Table/Table"

export const InvoiceView = ({ data }: { data: AmazonData[] }) => {
  const [invoiceData, setInvoiceData] = useState<Invoice[]>([])
  useEffect(() => {
    (async () => {
      const invoice = await generateNormalizedInvoiceList(data) as any
      console.log(invoice)
      setInvoiceData(invoice)
    })()
  }, [data])

  if (invoiceData.length === 0) return null
  return (
    <div className={styles.container}>
     <Table data={invoiceData} />
    </div>
  )
}
