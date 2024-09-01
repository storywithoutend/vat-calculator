"use client"

import { TableToolbar } from "@/components/atoms/TableToolbar/TableToolbar"
import { db } from "@/db/db"
import { useTableProps } from "@/hooks/useTableProps"
import { fileTeInvoice } from "@/utils/fileToInvoice/fileToInvoice"
import { INVOICE_SCHEMA, InvoiceItem } from "@/utils/invoice/invoiceSchema"
import { invoiceListToOutput } from "@/utils/invoiceListToOutput"
import { Box, Stack, Tab, Tabs } from "@mui/material"
import { DataGrid, GridToolbar, GridToolbarExport } from "@mui/x-data-grid"
import { useLiveQuery } from "dexie-react-hooks"
import { useMemo, useState } from "react"
import { match } from "ts-pattern"

export type Tab = "file" | "invoice" | "output"

export default function File({
  searchParams,
}: {
  searchParams: { id: string }
}) {
  const { id: reportId } = searchParams
  const fileItems = useLiveQuery(() =>
    db.fileItems.where({ report: reportId }).toArray(),
  )

  const [tab, setTab] = useState<Tab>("file")

  const tableProps = useTableProps({ fileItems, view: tab })

  return (
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
  )
}
