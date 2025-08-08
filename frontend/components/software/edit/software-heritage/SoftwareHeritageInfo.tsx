// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

export default function SoftwareHeritageInfo() {

  return (
    <Alert
      severity="info"
      sx={{
        marginTop:'0.5rem'
      }}
    >
      <AlertTitle>Software Heritage Archive</AlertTitle>
      Use Add button to provide <strong>swhid</strong> of your software.
      You can archive your software for free on <a href="https://www.softwareheritage.org/" target="_blank">Software Heritage</a>.
    </Alert>
  )
}
