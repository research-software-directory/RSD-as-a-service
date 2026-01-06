// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import AlertTitle from '@mui/material/AlertTitle'
import Alert from '@mui/material/Alert'

export default function ReferencePapersInfo() {
  return (
    <Alert severity="info">
      <AlertTitle sx={{fontWeight:500}}>About Reference papers</AlertTitle>
      Here you can add reference papers of your software. The RSD will periodically
      look for citations of this output using OpenAlex and add them to the citations list on this page.
      <AlertTitle sx={{fontWeight:500, pt:'1rem'}}>What is a Reference paper?</AlertTitle>
      A reference paper is an article or artifact with a DOI that primarily describes your software, such as analysing its implementation efficiency or detailing new features.
      If other researchers use your software and mention it in their studies, please list these papers under &quot;Related output&quot;.
    </Alert>
  )
}
