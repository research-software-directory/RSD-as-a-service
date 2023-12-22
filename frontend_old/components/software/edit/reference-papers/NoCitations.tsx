// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

export default function NoCitations() {
  return (
    <Alert severity="warning" sx={{marginTop:'0.5rem'}}>
      <AlertTitle sx={{fontWeight:500}}>No citations to show</AlertTitle>
      Try <strong>adding the reference papers</strong> first. RSD scraper
      will then periodically run and find all citations using OpenAlex api.
    </Alert>
  )
}
