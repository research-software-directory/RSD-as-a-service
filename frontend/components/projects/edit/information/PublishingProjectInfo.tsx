// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import Link from 'next/link'

export default function PublishingProjectInfo() {
  return (
    <Alert
      severity="info"
      sx={{
        marginTop:'1rem'
      }}
    >
      <AlertTitle>Publishing project page</AlertTitle>
      Setting the page status to published will expose the project page to all visitors.
      Unpublished project can be found under <strong>
        <Link href="/user/projects">your profile</Link>
      </strong> page.
    </Alert>
  )
}
