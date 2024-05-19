"use client"

import styles from "./page.module.css"
import { useEffect, useState } from "react"
import { match } from "ts-pattern"
import { TabController } from "@/components/TabController/TabController"
import { tabDelimitedTextToJSON } from "@/utils/tabDelimitedTextToJSON"
import { AmazonDataView } from "@/components/AmazonDataView/AmazonDataView"
import { AmazonData } from "@/types"
import { InvoiceView } from "@/components/InvoiceView/InvoiceView"
import { OutputView } from "@/components/OutputView/OutputView"

export type Tab = "amazon" | "invoice" | "output"

export default function Home() {
  const [tab, setTab] = useState<Tab>("amazon")
  const [data, setData] = useState<AmazonData[]>([])

  useEffect(() => {
    (async () => {
      const res = await fetch("/682478019758.txt")
      const txt = await res.text()
      const data = await tabDelimitedTextToJSON(txt) as AmazonData[]
      setData(data)
    })()
  }, [])

  if (data.length === 0) return null
  return (
    <main className={styles.main}>
      <h1>Testing</h1>
      <TabController tab={tab} onChange={setTab} />
      {match(tab)
        .with("invoice", () => <InvoiceView data={data} />)
        .with("output", () => <OutputView data={data} />)
        .otherwise(() => (
          <AmazonDataView data={data}/>
        ))}
    </main>
  )
}
