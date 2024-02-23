// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'

export default function ProjectCitationInfo() {
  return (
    <Alert severity="info">
      Here we list all the citations of your output that the RSD was able to find
      automatically by using the DOIs of your output and OpenAlex. On the project
      page these citations are shown in the impact section together with the items
      you added manually.
    </Alert>
  )
}
