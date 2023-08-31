// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'

import MuiSnackbar from './MuiSnackbar'
import SnackbarContext, {snackbarDefaults} from './MuiSnackbarContext'

export default function MuiSnackbarProvider(props:any) {
  const [options, setSnackbar] = useState(snackbarDefaults)
  // console.group('SnackbarProvider')
  // console.log('options....', options)
  // console.groupEnd()
  return (
    <>
      <SnackbarContext.Provider value={{
        options,
        setSnackbar
      }}
      // we pass children etc...
      {...props}
      />
      <MuiSnackbar options={options} setSnackbar={setSnackbar}/>
    </>
  )
}
