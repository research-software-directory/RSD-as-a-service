// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useContext,JSX} from 'react'
import snackbarContext, {snackbarDefaults,SnackbarOptions} from './MuiSnackbarContext'

export default function useSnackbar() {
  const {setSnackbar} = useContext(snackbarContext)

  function showMessage(message: string | JSX.Element, severity: SnackbarOptions['severity'],duration?:number) {
    // show notification
    setSnackbar({
      ...snackbarDefaults,
      open: true,
      severity,
      duration,
      message
    })
  }

  function showSuccessMessage(message: string | JSX.Element) {
    showMessage(message,'success',5000)
  }

  function showInfoMessage(message: string | JSX.Element) {
    showMessage(message,'info',5000)
  }

  function showWarningMessage(message: string | JSX.Element) {
    showMessage(message,'warning',10000)
  }

  function showErrorMessage(message: string | JSX.Element) {
    showMessage(message,'error')
  }

  return {
    showSuccessMessage,
    showInfoMessage,
    showWarningMessage,
    showErrorMessage
  }
}
