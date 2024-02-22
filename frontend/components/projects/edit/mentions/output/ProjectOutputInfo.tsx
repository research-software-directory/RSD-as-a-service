// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'

export default function ProjectOutputInfo() {
  return (
    <Alert severity="info">
      Here you can add output that was produced by the project itself, such as papers,
      books, articles, software, datasets, videos, blogs, etc. The RSD will periodically
      look for citations of this output using OpenAlex and add them to the citations list on this page.
    </Alert>
  )
}
