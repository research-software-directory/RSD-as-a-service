// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'

export default function ProjectImpactInfo() {
  return (
    <Alert severity="info">
      Here you can add mentions of your project that cannot be found automatically by the RSD.
      These can be papers by others re-using your project results, press articles or videos
      highlighting the project, policy documents, etc.
    </Alert>
  )
}
