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
import { ComponentProps, useCallback, useMemo, useState } from "react"
import { match } from "ts-pattern"
import { useDropzone } from "react-dropzone"
import { DBFile, db } from "@/db/db"

type Props = Omit<ComponentProps<typeof Modal>, "children"> & {
  data?: FileResult
}

type Tab = "file" | "invoice"
export const AddFilesModal = ({ data, open, onClose, ...modalProps }: Props) => {

  const [files, setFiles] = useState<FileResult[]>([])

  const onDrop = useCallback(async (acceptedFile: File[]) => {
    const data = await parseFiles(acceptedFile as unknown as FileList)
    setFiles(data)
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const isSaveButtonDisabled = !files.some((file) => file.status === "success")


  const onSafeClose: ComponentProps<typeof Modal>['onClose'] = (event, reason) => {
    onClose?.(event, reason)
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
            {match(files.length > 0)
              .with(true, () => (
                <Box>
                  <TableContainer component={Paper} elevation={0} variant="outlined">
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Filename</TableCell>
                          <TableCell>Dates</TableCell>
                          <TableCell>Size</TableCell>
                          <TableCell>Rows</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {files.map((file, i) =>
                          file.status === "success" ? (
                            <TableRow key={i}>
                              <TableCell>
                                <Badge
                                  color='primary'
                                  badgeContent={file.source}
                                >
                                  {file.name}
                                </Badge>
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
                              <TableCell>
                                {(file.count / 1000).toFixed(1)}K
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
            <Button variant='outlined' onClick={() => {
              if (files.length > 0) {
                // TODO: clear input as well
                setFiles([])
              } else {
                onSafeClose?.({}, 'backdropClick')
              }
            }}>Cancel</Button>
            <Button variant='contained' disableElevation disabled={isSaveButtonDisabled} onClick={async () => {
              try {
                const successfullFiles = files.filter((file) => file.status === "success")
                const fileObjects = successfullFiles.map(({ items, status, ...rest}) => rest) as Omit<DBFile, 'id'>[]
                const fileObjectIds = await db.files.bulkAdd(fileObjects, undefined, {allKeys: true})

                const fileItemObjects = successfullFiles.flatMap(({ items, source, status, ...rest}, i) => items.map((item: any) => ({
                  file: (fileObjectIds as unknown as number[])[i],
                  source,
                  ...item
                })))
                await db.fileItems.bulkAdd(fileItemObjects)  
                onSafeClose?.({}, 'backdropClick')
              } catch {
                // Delete files if failed
              }
            }}>
              Save
            </Button>
          </CardActions>
        </Stack>
      </Card>
    </Modal>
  )
}
