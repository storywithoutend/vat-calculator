import {
  DefaultTableToolbar,
  OutputTableToolbar,
} from "@/components/atoms/TableToolbar/TableToolbar"
import { DBFileItem } from "@/db/db"
import { fileItemsToInvoiceItems, fileTeInvoice } from "@/utils/fileToInvoice/fileToInvoice"
import { INVOICE_SCHEMA, InvoiceItem } from "@/utils/invoice/invoiceSchema"
import { invoiceListToOutput } from "@/utils/invoiceListToOutput"
import { DataGridProps, GridSingleSelectColDef } from "@mui/x-data-grid"
import { useMemo } from "react"
import { match } from "ts-pattern"
import { useVATId } from "./useVATId"

export const useTableProps = ({
  fileItems = [],
  view = "file",
}: {
  fileItems?: DBFileItem[]
  view?: "file" | "invoice" | "output"
}): DataGridProps => {
  const [vatIds] = useVATId()

  return useMemo(() => {
    return match(view)
      .with("output", () => {
        const { data: invoiceItems} = fileItemsToInvoiceItems({fileItems})

        const output = invoiceListToOutput({invoiceItems, vatIds}).map((item, i) => ({
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
              9: "",
            },
            ...output,
          ],
          columns: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((key) => ({
            field: key.toString(),
            headerName: "",
            type: "string" as const,
          })),
          columnHeaderHeight: 1,
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
