// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {createContext,JSX} from 'react'

export type SnackbarOptions={
  severity:'error'|'info'|'warning'|'success',
  message: string | JSX.Element,
  open?: boolean,
  duration?: number,
  anchor?: {
    vertical:'top' | 'bottom',
    horizontal:'left' | 'center' | 'right'
  }
}

export const snackbarDefaults:SnackbarOptions={
  open: false,
  severity: 'info',
  message: '',
  duration: 5000,
  anchor: {
    vertical: 'bottom',
    horizontal: 'center'
  }
}

export type PageSnackbarType={
  options: SnackbarOptions,
  setSnackbar: (options:SnackbarOptions)=>void
}

const MuiSnackbarContext = createContext<PageSnackbarType>({
  options:snackbarDefaults,
  setSnackbar:()=>{}
})


export default MuiSnackbarContext
