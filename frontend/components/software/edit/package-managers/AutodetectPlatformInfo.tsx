// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'

export default function AutodetectPlatformInfo() {
  return (
    <Alert
      severity="info"
      sx={{
        marginTop:'1.5rem'
      }}
    >
      <p>
        The RSD will autodetect the platform using the provided url. This information is used to retrieve additional information about you software. If the platform cannot be detected automatically you will need to select one yourself. Please select &quot;Other&quot; if the platform you use is not listed.
      </p>
    </Alert>
  )
}
