import {useContext} from 'react'
import Button from '@mui/material/Button'
import Snackbar from '@mui/material/Snackbar'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'

import snackbarContext from './SnackbarContext'
import {ConnectingAirportsOutlined} from '@mui/icons-material'


function useSnackInfo(){
  const {open, message, onClose, action, duration=4000} = useContext(snackbarContext)
  // eslint-ignore
  console.group('SnackbarSimple')
  console.log('open...', open)
  console.log('message...', message)
  console.log('onClose...', message)
  console.log('action...', action )
  console.log('duration...', action )
  console.groupEnd()
}


/**
 * Simple snackbar to use from all components
 * the state is shared using snackbarContext
 * @returns
 */
export default function SnackbarSimple() {
  // shared state using snackbar context
  // the provider is in _app.tsx
  const snack = useContext(snackbarContext)
  const info = useSnackInfo()

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      snack.open = false
      return
    }
    if (snack.onClose) snack.onClose(event,reason)
  }

  // Example of action components
  // const action = (
  //   <>
  //     <Button color="secondary" size="small" onClick={handleClose}>
  //       UNDO
  //     </Button>
  //     <IconButton
  //       size="small"
  //       aria-label="close"
  //       color="inherit"
  //       onClick={handleClose}
  //     >
  //       <CloseIcon fontSize="small" />
  //     </IconButton>
  //   </>
  // )

  return (
    <Snackbar
      open={snack.open}
      autoHideDuration={snack.duration}
      onClose={handleClose}
      message={snack.message}
      action={snack?.action ?? null}
    />
  )
}
