import { FileResult } from "@/utils/parseFiles/parseFiles"
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Stack,
  Button,
  IconButton,
} from "@mui/material"
import { useLiveQuery } from "dexie-react-hooks"
import {
  SetStateAction,
  useState,
  Dispatch,
  ComponentProps,
  useEffect,
} from "react"
import { AddFilesModal } from "@/components/modals/AddFilesModal"
import { db } from "@/db/db"
import { Delete } from "@mui/icons-material"
import Link from "next/link"
import { DeleteFileModal } from "@/components/modals/DeleteFileModal"
import { useRouter } from "next/navigation"
import { useVATId } from "@/hooks/useVATId"
import { EditVatIdsModal } from "@/components/modals/EditVatIdsModal"
import { useExchangeRate } from "@/hooks/useExchangeRate/useExchangeRate"

const OutlinedPaper = (props: ComponentProps<typeof Paper>) => (
  <Paper {...props} variant='outlined' elevation={0} />
)

export const MainView = ({}: {}) => {
  const router = useRouter()

  const [vatIds, setVatIds] = useVATId()
  const [showEditVatIdsModal, setShowEditVatIdsModal] = useState(false)

  const [showAddFilesModal, setShowAddFilesModal] = useState(false)
  const [showDeleteFileModal, setShowDeleteFileModal] = useState<{
    fileId?: number
    open: boolean
  }>({ open: false })

  const files = useLiveQuery(() => db.files.toArray(), [])

  const [reports, setReports] = useState<{ report: string; count: number }[]>(
    [],
  )
  const reportIds = useLiveQuery(async () => {
    if ((await db.fileItems.count()) === 0) return []
    return db.fileItems.orderBy("report").uniqueKeys()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (!reportIds) return
      const reportData = await Promise.all(
        reportIds.map(async (reportId) => {
          const count = await db.fileItems
            .where("report")
            .equals(reportId)
            .count()
          console.log("count", count)
          return {
            report: reportId as string,
            count,
          }
        }),
      )
      setReports(reportData)
    })()
  }, [reportIds])

  const test = useExchangeRate({ financialQuarters: reports.map((r) => r.report)})
  console.log(test)

  return (
    <>
      <Stack gap={8}>
        <Stack gap={2}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography variant='h4'>Vat Ids</Typography>
            <Button
              variant='contained'
              disableElevation
              onClick={() => setShowEditVatIdsModal(true)}
            >
              Edit Vat Ids
            </Button>
          </Stack>
          <TableContainer component={OutlinedPaper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Country Code</TableCell>
                  <TableCell>Vat Id</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(vatIds).map(([countryCode, vatId], i) => (
                  <TableRow key={countryCode} hover>
                    <TableCell>
                      <Typography fontSize={14} fontWeight={"bold"}>
                        {countryCode}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography fontSize={14}>{vatId}</Typography>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
        <Stack gap={2}>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Typography variant='h4'>Files</Typography>
            <Button
              variant='contained'
              disableElevation
              onClick={() => setShowAddFilesModal(true)}
            >
              Add files
            </Button>
          </Stack>
          <TableContainer component={OutlinedPaper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Filename</TableCell>
                  <TableCell>Report</TableCell>
                  <TableCell>Size</TableCell>
                  <TableCell>Rows</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {files && files?.length > 0 ? (
                  files?.map((file, i) => (
                    <TableRow
                      key={file.id}
                      hover
                      component={Link}
                      href={`/file?id=${file.id}`}
                    >
                      <TableCell>
                        <Typography fontSize={14} fontWeight={"bold"}>
                          {file.name}
                        </Typography>
                        <Typography fontSize={12} textTransform={"capitalize"}>
                          {file.source}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography fontSize={14} fontWeight={"bold"}>
                          {file.reports.join(", ")}
                        </Typography>
                        <Typography fontSize={12}>
                          {file.minDate?.toLocaleDateString("default", {
                            month: "short",
                            year: "numeric",
                          })}
                          &nbsp;-&nbsp;
                          {file.maxDate?.toLocaleDateString("default", {
                            month: "short",
                            year: "numeric",
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {(file.size / 1000000).toFixed(1)} MB
                      </TableCell>
                      <TableCell>{(file.count / 1000).toFixed(1)}K</TableCell>
                      <TableCell width={50}>
                        <IconButton
                          onClick={(event) => {
                            event.stopPropagation()
                            event.preventDefault()
                            setShowDeleteFileModal({
                              fileId: file.id,
                              open: true,
                            })
                          }}
                        >
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
          <TableContainer component={OutlinedPaper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reporting Quarter</TableCell>
                  <TableCell>Size</TableCell>
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
                  reports.map(({ report, count }) => (
                    <TableRow
                      key={report}
                      hover
                      component={Link}
                      href={`/report?id=${report}`}
                    >
                      <TableCell>{report}</TableCell>
                      <TableCell>{count}</TableCell>
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
      <EditVatIdsModal
        open={showEditVatIdsModal}
        onClose={() => setShowEditVatIdsModal(false)}
      />
      <AddFilesModal
        open={showAddFilesModal}
        onClose={() => setShowAddFilesModal(false)}
      />
      <DeleteFileModal
        {...showDeleteFileModal}
        onClose={() => setShowDeleteFileModal({ open: false })}
      />
    </>
  )
}
