"use client"

import { db } from "@/db/db"
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
    console.log('fileItems', fileItems)
    return match(tab)
      .with("invoice", () => {
        return { rows: [], columns: [] }
      })
      .otherwise(() => {
        return {
          rows: fileItems || [],
          columns: Object.keys(fileItems?.[0] || {}).filter((value) => !['file', 'source'].includes(value)).map((key) => ({
            field: key,
            headerName: key,
          })),
        }
      })
  }, [tab, fileItems])
  return (
    <main>
      <Stack width={"100%"} gap={2}>
        <h1>{file?.name}</h1>
        <Tabs
            value={tab}
            onChange={(_, newValue) => setTab(newValue)}
          >
            <Tab label='File' value='file' />
            <Tab label='Invoice' value='invoice' />
          </Tabs>
        <Box
          width={"100%"}
          position='relative'
          display={"block"}
          overflow={"hidden"}
          style={{ background: "white" }}
        >
          <DataGrid rows={rows} columns={columns} slots={{toolbar: GridToolbar}}/>
        </Box>
      </Stack>
    </main>
  )
}
