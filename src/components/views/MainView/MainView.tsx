import { FileResult } from "@/utils/parseFiles/parseFiles"
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Typography,
  Stack,
  Button,
  IconButton,
} from "@mui/material"
import { useLiveQuery } from "dexie-react-hooks"
import { SetStateAction, useMemo, useState, Dispatch } from "react"
import { getFinancialQuarters } from "@/utils/time/getFinancialQuarters"
import { calcMinDate } from "@/utils/time/calcMinDate"
import { calcMaxDate } from "@/utils/time/calcMaxDate"
import { AddFilesModal } from "@/components/modals/AddFilesModal"
import { db } from "@/db/db"
import { Delete } from "@mui/icons-material"
import Link from "next/link"

export const MainView = ({
  files,
  setFiles,
}: {
  files: FileResult[]
  setFiles: Dispatch<SetStateAction<FileResult[]>>
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(-1)
  const [showAddFilesModal, setShowAddFilesModal] = useState(false)

  const files2 = useLiveQuery(() => db.files.toArray(), [])
  console.log("files", files2)

  const reports = useMemo(() => {
    return []
    const { minDate, maxDate } = files.reduce<{
      minDate?: Date
      maxDate?: Date
    }>((acc, file) => {
      const { minDate, maxDate } = file
      if (!minDate || !maxDate) return acc
      return {
        minDate: calcMinDate(minDate, acc.minDate),
        maxDate: calcMaxDate(maxDate, acc.maxDate),
      }
    }, {})
    return getFinancialQuarters(minDate, maxDate)
  }, [files])

  return (
    <>
      <Stack gap={8}>
        <Stack gap={2}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography variant='h4'>Files</Typography>
            <Button onClick={() => setShowAddFilesModal(true)}>
              Add files
            </Button>
          </Stack>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Filename</TableCell>
                  <TableCell>Dates</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Rows</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {files2 && files2?.length > 0 ? (
                  files2?.map((file, i) => (
                    <TableRow key={file.id} onClick={() => alert('testing')} hover component={Link} href={`/file?id=${file.id}`}>
                      <TableCell>
                        {file.name}
                        <div>
                          <Chip
                            variant='outlined'
                            size='small'
                            label={file.source}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        {file.minDate?.toLocaleDateString("default", {
                          month: "short",
                          year: "numeric",
                        })}
                        &nbsp;-&nbsp;
                        {file.maxDate?.toLocaleDateString("default", {
                          month: "short",
                          year: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        {(file.size / 1000000).toFixed(1)} MB
                      </TableCell>
                      <TableCell>{(file.count / 1000).toFixed(1)}K</TableCell>
                      <TableCell>
                        <IconButton onClick={(event) => {
                          event.stopPropagation()
                        }}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} align='center'>
                      No files
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
        <Stack gap={2}>
          <Stack direction={"row"}>
            <Typography variant='h4'>Reports</Typography>
          </Stack>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reporting Quarter</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {reports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align='center'>
                      No reports to generate at this time
                    </TableCell>
                  </TableRow>
                ) : (
                  reports.map((report) => (
                    <TableRow key={report}>
                      <TableCell>{report}</TableCell>
                      <TableCell>
                        <Button>View report</Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Stack>
      <AddFilesModal
        open={showAddFilesModal}
        onClose={() => setShowAddFilesModal(false)}
      />
    </>
  )
}
