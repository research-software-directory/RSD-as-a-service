// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import Slide from '@mui/material/Slide'

import {PageSnackbarType} from './MuiSnackbarContext'

export default function MuiSnackbar({options, setSnackbar}:PageSnackbarType){
  const {open, severity, message, duration, anchor} = options

  function slideTransition (props:any){
    // console.log("slideTransition.props: ", props)
    return <Slide {...props} direction="up" />
  };

  // console.log('PageSnackbar.options: ', options)
  function handleClose(event: React.SyntheticEvent | Event, reason?: string){
    if (reason!=='clickaway'){
      setSnackbar({
        ...options,
        open: false,
        message: ''
      })
    }
  }

  if (open === false) return null

  return (
    <Snackbar
      open={open}
      anchorOrigin={anchor}
      autoHideDuration={duration}
      onClose={handleClose}
      slots={{
        transition: slideTransition
      }}
    >
      <Alert severity={severity}
        elevation={6}
        variant="filled"
        onClose={handleClose}
        style={{'alignItems':'center'}}>
        {message}
      </Alert>
    </Snackbar>
  )
}
