// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'

export default function NewsItemInfo() {

  return (
    <Alert
      severity="info"
    >
      The article image can be used in two ways.

      <p className="py-2"><strong>1. Card image</strong></p>
      <p>
        The image is used in the news card on the news overview page.
      </p>

      <p className="py-2"><strong>2. In the markdown</strong></p>
      <p>
        You can use uploaded image in the markdown at any position you wish.
        Use &quot;Copy link&quot; button to copy image link in the markdown format.
        Then navigate to a position in the markdown where you want image to appear and
        paste the link.
      </p>
    </Alert>
  )
}
