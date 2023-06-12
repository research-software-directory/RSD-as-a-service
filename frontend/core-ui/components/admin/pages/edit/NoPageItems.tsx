// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

export default function NoPageItems() {
  return (
    <Alert severity="warning" sx={{marginTop: '0.5rem'}}>
      <AlertTitle sx={{fontWeight: 500}}>Public markdown pages are not defined.</AlertTitle>
      Add one using <strong>+ ADD</strong> button.
    </Alert>
  )
}
