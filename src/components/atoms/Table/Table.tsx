import { DataType } from "ka-table"
import { SortingMode, Table as KATable } from "ka-table"
import "ka-table/style.css"
import { useState } from "react"
import styles from "./Table.module.css"

export const Table = ({ data }: { data: any }) => {
  const headers = Object.keys(data[0])
  const _data = data.map((item: any, i: number) => ({
    ...item,
    id: i,
  }))

  const [tableProps, setTableProps] = useState({
    columns: headers.map((header) => ({
      key: header,
      title: header,
      dataType: DataType.String,
      width: 190,
    })),
    data: _data,
    rowKeyField: "id",
    sortingMode: SortingMode.None,
    paging: { enabled: true, pageSize: 100 },
    childComponents: {
      headCell: {
        elementAttributes: (props: any) => {
          if (props.column.key === "0") {
            return {
              style: {
                ...props.column.style,
                position: "sticky",
                left: 0,
                zIndex: 10,
              },
            }
          }
        },
      },
    },
  })
  return (
    <div className={styles.container}>
      <KATable
        {...tableProps}
        dispatch={(action) => {
          console.log(action)
          switch (action.type) {
            case "UpdatePageIndex": {
              setTableProps((props) => ({
                ...props,
                paging: {
                  ...props.paging,
                  pageIndex: action.pageIndex,
                },
              }))
            }
            case "UpdatePageSize": {
              setTableProps((props) => ({
                ...props,
                paging: {
                  ...props.paging,
                  pageSize: action.pageSize,
                },
              }))
            }
          }
          return tableProps
        }}
      />
    </div>
  )
}
