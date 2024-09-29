"use client"

import { Providers } from "@/components/providers/Providers"
import FileContent from "./content"
import { NextPage } from "next"

export type Tab = "file" | "invoice" | "output"

const FilePage: NextPage<{  
  searchParams: { id: string }
}> = (params) =>  {
  return (
    <Providers>
     <FileContent {...params} />
    </Providers>
  )
}

export default FilePage
