// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

import {packageManagerSettings, PackageManagerTypes} from './apiPackageManager'

export default function PackageManagersInfo() {
  // extract package manager names from settings
  const keys = Object.keys(packageManagerSettings)
  const managers:string[]=[]
  keys.forEach((key) => {
    if (packageManagerSettings[key as PackageManagerTypes].services?.length > 0){
      managers.push(packageManagerSettings[key as PackageManagerTypes].name)
    }
  })

  return (
    <Alert
      severity="info"
      sx={{
        marginTop:'0.5rem'
      }}
    >
      <AlertTitle>Where can I find software?</AlertTitle>
      Use Add button to provide <strong>download locations</strong> of your software.
      RSD will try to extract information about the downloads and/or dependencies from the
      package manager api. Collecting additional information by RSD scraper
      might take up to 1 day.
      {
        managers.length > 0 ?
          <p className="py-2">
          Supported package managers<br/> <strong>{managers.join(', ')}</strong>.
          </p>
          :null
      }
    </Alert>
  )
}
