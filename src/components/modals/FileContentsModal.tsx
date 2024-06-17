import { FileResult } from "@/utils/parseFiles/parseFiles"
import {
  Box,
  Card,
  CardContent,
  Modal,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material"
import { ComponentProps, useMemo, useState } from "react"
import { DataGrid } from "@mui/x-data-grid"
import { match } from "ts-pattern"
import { amazonToInvoice } from "@/utils/platforms/amazon/amazonToInvoice"
import { AmazonData } from "@/types"
import { INVOICE_SCHEMA } from "@/utils/invoice/invoiceSchema"

type Props = Omit<ComponentProps<typeof Modal>, "children"> & {
  data?: FileResult
}

type Tab = "file" | "invoice"
export const FileContentsModal = ({ data, open, ...modalProps }: Props) => {
  const [tabValue, setTabValue] = useState("file")

  const open_ = open && !!data
  const columns = useMemo(() => {
    return match(tabValue)
    .with('invoice', () => Object.keys(INVOICE_SCHEMA).map((key) => ({
      field: key,
      headerName: key
    })))
    .otherwise(() =>
      Object.keys(data?.items?.[0] || {}).map((key) => ({
        field: key,
        headerName: key,
      })),
    )
  }, [tabValue, data?.items])

  const rows = useMemo(() => {
    return (
      match([tabValue, data?.source])
        .with(["invoice", "amazon"], () => {
          return amazonToInvoice(data?.items || []).map(
            (item: AmazonData, i: number) => ({
              id: i,
              ...item,
            }),
          )
        })
        .otherwise(() =>
          data?.items.map((item: any, i: number) => ({
            id: i,
            ...item,
          })),
        ) || []
    )
  }, [tabValue, data?.items, data?.source])

  return (
    <Modal open={open_} {...modalProps}>
      <Card
        style={{
          width: "80vw",
          height: "80vh",
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        <Box height='100%' display={"flex"} flexDirection={"column"}>
          <Box padding={"16px 16px 0"}>
            <Typography variant='h5'>{data?.name}</Typography>
          </Box>
          <Tabs
            value={tabValue}
            onChange={(_, newValue) => setTabValue(newValue)}
          >
            <Tab label='File' value='file' />
            <Tab label='Invoice' value='invoice' />
          </Tabs>
          <Box flex={1} display={"block"} overflow={"hidden"}>
            <DataGrid rows={rows} columns={columns} />
          </Box>
        </Box>
      </Card>
    </Modal>
  )
}
