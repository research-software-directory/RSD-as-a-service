// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

export default function NoMentionItems() {
  return (
    <Alert severity="warning" sx={{marginTop: '0.5rem'}}>
      <AlertTitle sx={{fontWeight: 500}}>No items to show</AlertTitle>
      Add one using <strong>any available options!</strong>
    </Alert>
  )
}
