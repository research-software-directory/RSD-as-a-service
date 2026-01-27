// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'
import {RepoPlatform, repositorySettings} from './config'

export default function SoftwareRepositoriesInfo() {
  // extract package manager names from settings
  const keys = Object.keys(repositorySettings)
  const repos:string[] = []

  keys.forEach(key=>{
    repos.push(repositorySettings[key as RepoPlatform].name)
  })

  return (
    <Alert
      severity="info"
      sx={{
        marginTop:'0.5rem'
      }}
    >
      <AlertTitle>Where can the source code be found?</AlertTitle>
      Use the Add button to provide a <strong>URL to the repository</strong> of your software.
      If needed, multiple repositories can be provided.
      <p className="py-4">
        The RSD background services will try to extract additional information about the software using the repository APIs.
      </p>
      <p>
        It may take up to 24 hour for the RSD background services to collect additional information.
        See <a href="/documentation/users/scrapers/" target="_blank"><u>documentation about scrapers</u></a> for more information.
      </p>
      {
        repos.length > 0 ?
          <p className="py-2">
            <strong>Supported repositories</strong><br/>{repos.join(', ')}.
          </p>
          :null
      }
    </Alert>
  )
}
