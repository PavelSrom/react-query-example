import React, { useState } from "react"
import { useSnackbars } from "./contexts/snackbars"
import { Snackbar } from "@material-ui/core"
import { Alert } from "@material-ui/lab"

const AlertBox = () => {
  const [open, setOpen] = useState(true)
  const { snackbars } = useSnackbars()

  const handleClose = (event, reason) => {
    if (reason === "clickaway") return

    setOpen(false)
  }

  return (
    snackbars.length > 0 &&
    snackbars.map(({ message, type, isSnackbar, id }) => {
      return isSnackbar ? (
        <Snackbar
          key={id}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          message={message}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          ContentProps={{ style: { minWidth: 650 } }}
        />
      ) : (
        <Snackbar
          key={id}
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
        >
          <Alert variant="filled" severity={type}>
            {message}
          </Alert>
        </Snackbar>
      )
    })
  )
}

export default AlertBox
