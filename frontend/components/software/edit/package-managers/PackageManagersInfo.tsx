// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import {packageManagerSettings, PackageManagerTypes} from './config'

export default function PackageManagersInfo() {
  // extract package manager names from settings
  const keys = Object.keys(packageManagerSettings)
  const managers:string[]=[]
  keys.forEach((key) => {
    managers.push(packageManagerSettings[key as PackageManagerTypes].name)
  })

  return (
    <Alert
      severity="info"
      sx={{
        marginTop:'0.5rem'
      }}
    >
      <AlertTitle>From which package managers is your software available?</AlertTitle>
      Use <strong>Add</strong> button to provide package manager locations for your software. This information is shown on the software page and used to retrieve additional information about you software, such as the number of downloads. Collecting additional information by RSD might take up to 1 day.
      {
        managers.length > 0 ?
          <p className="py-2">
            <strong>Supported package managers</strong><br/>{managers.join(', ')}.
          </p>
          :null
      }
    </Alert>
  )
}
