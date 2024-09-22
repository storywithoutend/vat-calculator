"use client"

import { db } from "@/db/db"
import { useTableProps } from "@/hooks/useTableProps"
import { Box, Stack, Tab, Tabs } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useLiveQuery } from "dexie-react-hooks"
import {  useState } from "react"
import ReportContent from './content';

export type Tab = "file" | "invoice" | "output"

export default function Report({
  searchParams,
}: {
  searchParams: { id: string }
}) {

  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
    <ReportContent searchParams={searchParams} />
    </QueryClientProvider>
  )
}
