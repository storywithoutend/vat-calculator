import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Modal,
  Typography,
} from "@mui/material"
import { ComponentProps, useState } from "react"
import { deleteFile } from "@/db/utils/deleteFile"
import { flushSync } from "react-dom"

type Props = Omit<ComponentProps<typeof Modal>, "children"> & {
  fileId?: number
}

export const DeleteFileModal = ({ fileId, open, onClose, ...props }: Props) => {
  const guardedOpen = open && fileId !== undefined

  const [isDeleting, setIsDeleting] = useState(false)

  return (
    <Modal open={guardedOpen} {...props} onClose={onClose}>
      <Card
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        <CardHeader title='Delete file?' />
        <CardContent>
          <Typography width="80vw" maxWidth={"700px"}>
            {isDeleting
              ? "Deleting file"
              : "Are you sure you want to delete this file?"}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            color='error'
            variant='outlined'
            disabled={isDeleting}
            onClick={() => onClose?.({}, "backdropClick")}
          >
            Cancel
          </Button>
          <Button
            color='error'
            variant='contained'
            disableElevation
            disabled={isDeleting}
            onClick={async () => {
              if (!fileId) return
              flushSync(() => setIsDeleting(true))
              await deleteFile(fileId)
              flushSync(() => setIsDeleting(false))
              onClose?.({}, "backdropClick")
            }}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
    </Modal>
  )
}
