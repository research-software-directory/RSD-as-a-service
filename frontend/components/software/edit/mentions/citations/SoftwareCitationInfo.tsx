// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'

export default function SoftwareCitationInfo() {
  return (
    <Alert severity="info">
      Here we list all the citations of your reference papers that the RSD was able to find automatically.
      On the software page these citations are shown in the mentions section together with any items you
      have manually added in the related output section.
    </Alert>
  )
}
