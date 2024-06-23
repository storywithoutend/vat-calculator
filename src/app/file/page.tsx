"use client"

import { db } from "@/db/db"
import { fileTeInvoice } from "@/utils/fileToInvoice/fileToInvoice"
import { INVOICE_SCHEMA, InvoiceItem } from "@/utils/invoice/invoiceSchema"
import { invoiceListToOutput } from "@/utils/invoiceListToOutput"
import { Box, Stack, Tab, Tabs } from "@mui/material"
import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { useLiveQuery } from "dexie-react-hooks"
import { useMemo, useState } from "react"
import { match } from "ts-pattern"

export type Tab = "file" | "invoice" | "output"

export default function File({
  searchParams,
}: {
  searchParams: { id: string }
}) {
  const { id } = searchParams
  const parsedId = parseInt(id)
  const file = useLiveQuery(() => db.files.get(parsedId))
  const fileItems = useLiveQuery(() =>
    db.fileItems.where({ file: parsedId }).toArray(),
  )

  const [tab, setTab] = useState<Tab>("file")
  const { rows, columns } = useMemo(() => {
    console.log("fileItems", fileItems)
    return match(tab)
      .with("output", () => {
        const invoiceList = fileItems?.map(fileTeInvoice).filter((item): item is InvoiceItem => !!item) || []
        const output = invoiceListToOutput(invoiceList).map((item, i) => ({id: i, ...item}))
        return {
          rows: output,
          columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((key) => ({
            field: key,
            headerName: "",
          })),
        }
      })
      .with("invoice", () => {
        return {
          rows:
            fileItems
              ?.map(fileTeInvoice)
              .filter((item): item is InvoiceItem => !!item) || [],
          columns: Object.keys(INVOICE_SCHEMA).map((key) => ({
            field: key,
            headerName: key,
          })),
        }
      })
      .otherwise(() => {
        return {
          rows: fileItems || [],
          columns: Object.keys(fileItems?.[0] || {})
            .filter(
              (value) => !["file", "source", "id", "report"].includes(value),
            )
            .map((key) => ({
              field: key,
              headerName: key,
            })),
        }
      })
  }, [tab, fileItems])
  return (
    <Stack
      width={"100%"}
      height={"calc(100vh - 110px)"}
      overflow={"hidden"}
      position={"relative"}
      gap={1}
    >
      <h1>{file?.name}</h1>
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
        <DataGrid
          // @ts-ignore
          rows={rows}
          // @ts-ignore
          columns={columns}
          slots={{ toolbar: GridToolbar }}
        />
      </Box>
    </Stack>
  )
}
