import { Button, Card, CardActions, CardContent, CardHeader, Modal, Typography } from "@mui/material"
import { ComponentProps } from "react"
import { deleteFile } from "@/db/utils/deleteFile"

type Props = Omit<ComponentProps<typeof Modal>, 'children'> & { fileId?: number}

export const DeleteFileModal = ({fileId, open, onClose, ...props}: Props) => {

  const guardedOpen = open && fileId !== undefined

  return <Modal open={guardedOpen} {...props} onClose={onClose}>
    <Card 
       style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: "translate(-50%,-50%)",
    }}>
      <CardHeader title='Delete file?' />
      <CardContent>
        <Typography>
          Are you sure you want to delete this file?
        </Typography>
      </CardContent>
      <CardActions>
        <Button color="error" variant="outlined" onClick={() => onClose?.({}, 'backdropClick')}>Cancel</Button>
        <Button color="error" variant="contained" disableElevation onClick={ async () => {
          if (!fileId) return
          await deleteFile(fileId)
          onClose?.({}, 'backdropClick')
        }}>Delete</Button>
      </CardActions>
    </Card>
  </Modal>
}