import {
  DefaultTableToolbar,
  OutputTableToolbar,
} from "@/components/atoms/TableToolbar/TableToolbar"
import { DBFileItem } from "@/db/db"
import { fileItemsToInvoiceItems, fileTeInvoice } from "@/utils/fileToInvoice/fileToInvoice"
import { INVOICE_SCHEMA, InvoiceItem } from "@/utils/invoice/invoiceSchema"
import { invoiceListToOutput } from "@/utils/invoiceListToOutput"
import { DataGridProps } from "@mui/x-data-grid"
import { useMemo } from "react"
import { match } from "ts-pattern"
import { useVATId } from "./useVATId"
import { UseQueryResult } from "@tanstack/react-query"
import { UseExchangeRatesReturnType } from '@/hooks/useExchangeRate/useExchangeRate';

export const useTableProps = ({
  fileItems,
  view = "file",
  exchangeRates = []
}: {
  fileItems?: DBFileItem[]
  view?: "file" | "invoice" | "output"
  exchangeRates?: UseQueryResult<UseExchangeRatesReturnType>[]
}): DataGridProps | null => {
  const [vatIds] = useVATId()

  const isLoading = !exchangeRates || exchangeRates.some((query) => query.isLoading)

  const exchangeRatesData = useMemo(() => exchangeRates?.map((query) => query.data).filter((data): data is UseExchangeRatesReturnType => !!data) || [], [
    exchangeRates
  ])

  console.log('exchangeRatesData', exchangeRatesData)

  const safeView = isLoading || !!view && !!fileItems ? view : "loading"

  return useMemo(() => {
    if (!fileItems || isLoading) return null
    return match(safeView)
      .with("output", () => {
        const { data: invoiceItems} = fileItemsToInvoiceItems({ exchangeRates: exchangeRatesData })({fileItems})

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
              10: "",
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
              ?.map(fileTeInvoice({ exchangeRates: exchangeRatesData}))
              .filter((item): item is InvoiceItem => !!item) || [],
          columns: Object.keys(INVOICE_SCHEMA).map((key) => ({
            field: key,
            headerName: key,
            type: "string" as const,
          })),
          slots: {
            toolbar: DefaultTableToolbar,
          },
        }
      })
      .with("file", () => {
        return {
          rows: fileItems || [],
          columns: Object.keys(fileItems?.[0] || {})
            .filter(
              (value) => !["file", "source", "id", "report"].includes(value),
            )
            .map((key) => ({
              field: key,
              headerName: key,
              type: "string" as const,
            })),
          slots: {
            toolbar: DefaultTableToolbar,
          },
        }
      })
      .otherwise(() => null)
  }, [safeView, fileItems, vatIds, exchangeRatesData, isLoading])
}
