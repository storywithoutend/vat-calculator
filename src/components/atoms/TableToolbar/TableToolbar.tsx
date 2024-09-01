import { Box } from "@mui/material"
import {
  GridToolbarColumnsButton,
  GridToolbarContainer,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarFilterButton,
} from "@mui/x-data-grid"

export const TableToolbar = ({ view }: { view?: 'file' | 'invoice' | 'output'}) => {
  return (
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <Box sx={{ flex: 1 }} />
      <GridToolbarExport
        csvOptions={{
          fileName: "test",
          delimiter: ";",
          includeHeaders: view !== 'output' 
        }}
      />
    </GridToolbarContainer>
  )
}

export const DefaultTableToolbar = () => <TableToolbar />

export const OutputTableToolbar = () => <TableToolbar view="output" />