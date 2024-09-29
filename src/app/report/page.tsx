"use client"

import { NextPage } from "next"
import ReportContent from "./content"
import { Providers } from "@/components/providers/Providers"

const Report: NextPage<{ searchParams: { id: string } }> = (params) => {
  return (
    <Providers>
      <ReportContent {...params} />
    </Providers>
  )
}

export default Report
