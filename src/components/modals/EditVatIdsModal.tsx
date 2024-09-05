import {
  Box,
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
import { useVATId } from "@/hooks/useVATId"
import Input from "@mui/material/Input"
import TextField from "@mui/material/TextField"

type Props = Omit<ComponentProps<typeof Modal>, "children"> & {
  fileId?: number
}

export const EditVatIdsModal = ({ open, onClose, ...props }: Props) => {
  const [vatIds, setVatIds] = useVATId()

  const [newVatIds, setNewVatIds] = useState(vatIds)

  return (
    <Modal open={open} {...props} onClose={onClose}>
      <Card
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
        }}
      >
        <CardHeader title='Edit VAT ids' />
        <CardContent
          style={{
            width: "90vw",
            maxWidth: "600px",
            maxHeight: "50vh",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            overflowY: "auto",
          }}
        >
          {Object.entries(newVatIds).map(([countryCode, vatId]) => (
            <TextField
              key={countryCode}
              fullWidth
              label={countryCode}
              value={vatId}
              variant="standard"
              onChange={(e) =>
                setNewVatIds({ ...newVatIds, [countryCode]: e.target.value })
              }
              
            />
          ))}
        </CardContent>
        <CardActions>
          <Button
            variant='outlined'
            onClick={() => onClose?.({}, "backdropClick")}
          >
            Cancel
          </Button>
          <Button
            variant='contained'
            disableElevation
            onClick={async (e) => {
              setVatIds(newVatIds)
              onClose?.(e, "backdropClick")
            }}
          >
            Save
          </Button>
        </CardActions>
      </Card>
    </Modal>
  )
}
