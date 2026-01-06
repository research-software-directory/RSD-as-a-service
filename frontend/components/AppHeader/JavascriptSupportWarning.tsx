// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'

export default function JavascriptSupportWarning() {
  return (
    <noscript>
      <Alert
        severity="warning"
        sx={{
          width: '100vw',
          justifyContent: 'center',
          marginTop: '1rem',
          zIndex:9
        }}>
        Limited functionality: Your browser does not support JavaScript.
      </Alert>
    </noscript>
  )
}
