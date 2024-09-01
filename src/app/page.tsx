"use client"

import { useState } from "react"
import { match } from "ts-pattern"
import { TabController } from "@/components/molecules/TabController/TabController"
import { AmazonData } from "@/types"
import { InvoiceView } from "@/components/views/InvoiceView/InvoiceView"
import { OutputView } from "@/components/views/OutputView/OutputView"
import { InputView } from "@/components/views/InputView/InputView"
import { FileResult } from "@/utils/parseFiles/parseFiles"
import { MainView } from "@/components/views/MainView/MainView"

export type Tab = "amazon" | "invoice" | "output"

export default function Home() {
  const [files, setFiles] = useState<FileResult[]>([])
  
  return <MainView files={files} setFiles={setFiles}/>
}
