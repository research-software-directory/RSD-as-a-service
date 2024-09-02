// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

export default function NoCommunityAlert() {
  return (
    <Alert severity="warning">
      <AlertTitle sx={{fontWeight:500}}>No communities defined</AlertTitle>
      To add community to RSD <strong>use Add button on the right</strong>.
    </Alert>
  )
}
