// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2025 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

export default function SoftwareHeritageInfo() {

  return (
    <Alert
      severity="info"
      sx={{
        marginTop:'0.5rem'
      }}
    >
      <AlertTitle>Software Heritage Archive</AlertTitle>
      Use Add button to provide SoftWare Hash Identifier (SWHID) of your software.
      <p className='py-4 font-medium'>
        <a href="https://archive.softwareheritage.org/" target="_blank">
          Use Software Heritage search page to confirm your software is archived
          <OpenInNewIcon sx={{width:'1rem',marginLeft:'0.25rem'}}/>
        </a>
      </p>
    </Alert>
  )
}
