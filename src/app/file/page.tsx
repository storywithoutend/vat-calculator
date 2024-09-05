"use client"

import { db } from "@/db/db"
import { useTableProps } from "@/hooks/useTableProps"
import { Box, Stack, Tab, Tabs } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import { useLiveQuery } from "dexie-react-hooks"
import { useState } from "react"

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

  const tableProps = useTableProps({ fileItems, view: tab })
  
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
         { ...tableProps }
        />
      </Box>
    </Stack>
  )
}
