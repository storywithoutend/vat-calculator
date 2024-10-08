import { FileResult, parseFiles } from "@/utils/parseFiles/parseFiles"
import {
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardHeader,
  Chip,
  Modal,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { FileDownload } from "@mui/icons-material"
import { ComponentProps, useCallback, useEffect, useMemo, useState } from "react"
import { match, P } from "ts-pattern"
import { useDropzone } from "react-dropzone"
import { DBFile, db } from "@/db/db"
import { flushSync } from "react-dom"

type Props = Omit<ComponentProps<typeof Modal>, "children"> & {
  data?: FileResult
}

export const AddFilesModal = ({
  data,
  open,
  onClose,
  ...modalProps
}: Props) => {
  const [files, setFiles] = useState<FileResult[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const onDrop = useCallback(async (acceptedFile: File[]) => {
    flushSync(() => setIsUploading(true))
    const data = await parseFiles(acceptedFile as unknown as FileList)
    setFiles(data)
    flushSync(() => setIsUploading(false))
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const isSaveButtonDisabled = !files.some((file) => file.status === "success")

  const onSafeClose: ComponentProps<typeof Modal>["onClose"] = (
    event,
    reason,
  ) => {
    if (!onClose || isSaving) return
    onClose(event, reason)
    setFiles([])
  }

  return (
    <Modal open={open} onClose={onSafeClose} {...modalProps}>
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
        <Stack height={"100%"}>
          <CardHeader title='Add files'></CardHeader>
          <Box flex={"1"} padding={"0 16px"}>
            {match([isUploading || isSaving, files.length > 0])
              .with([true, P._], () => <div>{isSaving ? 'Saving files' : 'Loading files'}</div>)
              .with([false, true], () => (
                <Box>
                  <TableContainer
                    component={Paper}
                    elevation={0}
                    variant='outlined'
                  >
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Filename</TableCell>
                          <TableCell>Reports</TableCell>
                          <TableCell>Items</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {files.map((file, i) =>
                          file.status === "success" ? (
                            <TableRow key={i}>
                              <TableCell>
                                <Typography fontSize={14} fontWeight={"bold"}>
                                  {file.name}
                                </Typography>
                                <Typography
                                  fontSize={12}
                                  textTransform={"capitalize"}
                                >
                                  {file.source}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography fontSize={14} fontWeight={"bold"}>
                                  {file.reports?.join(", ")}
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
                                <Typography fontSize={14} fontWeight={"bold"}>
                                  {(file.count / 1000).toFixed(1)}K
                                </Typography>
                                <Typography fontSize={12}>
                                  {(file.size / 1000000).toFixed(1)} MB
                                </Typography>
                              </TableCell>
                            </TableRow>
                          ) : (
                            <TableRow key={i}>
                              <TableCell>
                                <Badge color='error' badgeContent='Failed'>
                                  {file.name}
                                  &nbsp;&nbsp;
                                  <Chip
                                    color='error'
                                    size='small'
                                    label='Failed'
                                  />
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ),
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              ))
              .otherwise(() => (
                <Box
                  {...getRootProps()}
                  style={{ background: "rgb(240,240,240)", color: "grey" }}
                  width={"100%"}
                  height={"100%"}
                  display={"flex"}
                  justifyContent={"center"}
                  alignItems={"center"}
                  flex={"1"}
                >
                  <Stack alignItems={"center"} gap={2}>
                    <Typography>
                      {isDragActive
                        ? "Drop the file here"
                        : "Drag and drop some files here, or click to select files"}
                    </Typography>
                    <FileDownload />
                  </Stack>
                  <input {...getInputProps()} />
                </Box>
              ))}
          </Box>
          <CardActions>
            <Button
              variant='outlined'
              disabled={isUploading || isSaving}
              onClick={() => {
                if (files.length > 0) {
                  // TODO: clear input as well
                  setFiles([])
                } else {
                  onSafeClose?.({}, "backdropClick")
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant='contained'
              disableElevation
              disabled={isSaveButtonDisabled || isUploading || isSaving}
              onClick={async () => {
                try {
                  flushSync(() => setIsSaving(true))
                  const successfullFiles = files.filter(
                    (file) => file.status === "success",
                  )

                  const fileObjects = successfullFiles.map(
                    ({ items, status, ...rest }) => rest,
                  ) as Omit<DBFile, "id">[]
                  const fileObjectIds = await db.files.bulkAdd(
                    fileObjects,
                    undefined,
                    { allKeys: true },
                  )

                  const fileItemObjects = successfullFiles.flatMap(
                    ({ items, source, status, ...rest }, i) =>
                      items.map((item: any) => ({
                        file: (fileObjectIds as unknown as number[])[i],
                        source,
                        ...item,
                      })),
                  )
                  await db.fileItems.bulkAdd(fileItemObjects)
                  onSafeClose?.({}, "backdropClick")
                } catch {
                  // Delete files if failed
                } finally {
                  flushSync(() => setIsSaving(false))
                }
              }}
            >
              Save
            </Button>
          </CardActions>
        </Stack>
      </Card>
    </Modal>
  )
}
