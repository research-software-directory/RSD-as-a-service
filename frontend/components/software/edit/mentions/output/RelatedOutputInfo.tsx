// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'

export default function RelatedOutputInfo() {
  return (
    <Alert severity="info">
      Here you can add research output related to your software that cannot
      be found automatically by the RSD, such as papers, presentations, blogs,
      tutorials, news articles, videos, policy documents, etc. On the software
      page this output is shown in the mentions section together with citations
      that have been found automatically.
    </Alert>
  )
}
