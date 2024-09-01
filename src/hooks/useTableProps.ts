import {
  DefaultTableToolbar,
  OutputTableToolbar,
} from "@/components/atoms/TableToolbar/TableToolbar"
import { DBFileItem } from "@/db/db"
import { fileTeInvoice } from "@/utils/fileToInvoice/fileToInvoice"
import { INVOICE_SCHEMA, InvoiceItem } from "@/utils/invoice/invoiceSchema"
import { invoiceListToOutput } from "@/utils/invoiceListToOutput"
import { DataGridProps, GridSingleSelectColDef } from "@mui/x-data-grid"
import { useMemo } from "react"
import { match } from "ts-pattern"

export const useTableProps = ({
  fileItems = [],
  view = "file",
}: {
  fileItems?: DBFileItem[]
  view?: "file" | "invoice" | "output"
}): DataGridProps => {
  return useMemo(() => {
    return match(view)
      .with("output", () => {
        const invoiceList =
          fileItems
            ?.map(fileTeInvoice)
            .filter((item): item is InvoiceItem => !!item) || []
        const output = invoiceListToOutput(invoiceList).map((item, i) => ({
          id: i.toString(),
          ...item,
        }))
        return {
          rows: [
            {
              id: "header",
              0: "#v1.1",
              1: "",
              2: "",
              3: "",
              4: "",
              5: "",
              6: "",
              7: "",
              8: "",
            },
            ...output,
          ],
          columns: [0, 1, 2, 3, 4, 5, 6, 7, 8].map((key) => ({
            field: key.toString(),
            headerName: "",
            type: "singleSelect" as const,
          })),
          columnHeaderHeight: 0,
          slots: {
            toolbar: OutputTableToolbar,
          },
          
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
            type: "singleSelect" as const,
          })),
          slots: {
            toolbar: DefaultTableToolbar,
          },
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
              type: "singleSelect" as const,
            })),
          slots: {
            toolbar: DefaultTableToolbar,
          },
        }
      })
  }, [view, fileItems])
}
