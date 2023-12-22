// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react'
import snackbarContext, {snackbarDefaults,SnackbarOptions} from './MuiSnackbarContext'

export default function useSnackbar() {
  const {setSnackbar} = useContext(snackbarContext)

  function showMessage(message: string, severity: SnackbarOptions['severity'],duration?:number) {
    // show notification
    setSnackbar({
      ...snackbarDefaults,
      open: true,
      severity,
      duration,
      message
    })
  }

  function showSuccessMessage(message: string) {
    showMessage(message,'success',5000)
  }

  function showInfoMessage(message: string) {
    showMessage(message,'info',5000)
  }

  function showWarningMessage(message: string) {
    showMessage(message,'warning',10000)
  }

  function showErrorMessage(message: string) {
    showMessage(message,'error')
  }

  return {
    showSuccessMessage,
    showInfoMessage,
    showWarningMessage,
    showErrorMessage
  }
}
