// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

export default function NoImpactItems() {
  return (
    <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
      <AlertTitle sx={{fontWeight:500}}>No impact items to show</AlertTitle>
      You can manually add new items by using <strong>search, import or create options!</strong>
    </Alert>
  )
}
