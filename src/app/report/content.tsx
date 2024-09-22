"use client"

import { db } from "@/db/db"
import { useTableProps } from "@/hooks/useTableProps"
import { Box, Stack, Tab, Tabs } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useLiveQuery } from "dexie-react-hooks"
import { useState } from "react"

export type Tab = "file" | "invoice" | "output"

export default function ReportContent({
  searchParams,
}: {
  searchParams: { id: string }
}) {
  const { id: reportId } = searchParams
  const fileItems = useLiveQuery(() =>
    db.fileItems.where({ report: reportId }).toArray(),
  )

  const [queryClient] = useState(() => new QueryClient())

  const [tab, setTab] = useState<Tab>("file")

  const tableProps = useTableProps({ fileItems, view: tab })

  if (!tableProps) return "loading..."
  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        width={"100%"}
        height={"calc(100vh - 110px)"}
        overflow={"hidden"}
        position={"relative"}
        gap={1}
      >
        <h1>{reportId}</h1>
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
          <Tab label='File' value='file' />
          <Tab label='Invoice' value='invoice' />
          <Tab label='Output' value='output' />
        </Tabs>
        <Box
          width={"100%"}
          position='relative'
          display={"block"}
          overflow={"hidden"}
          style={{ background: "white" }}
        >
          <DataGrid {...tableProps} />
        </Box>
      </Stack>
    </QueryClientProvider>
  )
}
