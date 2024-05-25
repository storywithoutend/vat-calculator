"use client"

import { useState } from "react"
import { match } from "ts-pattern"
import { TabController } from "@/components/TabController/TabController"
import { AmazonDataView } from "@/components/AmazonDataView/AmazonDataView"
import { AmazonData } from "@/types"
import { InvoiceView } from "@/components/InvoiceView/InvoiceView"
import { OutputView } from "@/components/OutputView/OutputView"
import { InputView } from "@/components/InputView/InputView"

export type Tab = "amazon" | "invoice" | "output"

export default function Home() {
  const [tab, setTab] = useState<Tab>("amazon")
  const [data, setData] = useState<AmazonData[]>([])

  if (data.length === 0) return <InputView setData={setData}/>
  return (
    <>
      <TabController tab={tab} onChange={setTab} />
      {match(tab)
        .with("invoice", () => <InvoiceView data={data} />)
        .with("output", () => <OutputView data={data} />)
        .otherwise(() => (
          <AmazonDataView data={data}/>
        ))}
    </>
  )
}
