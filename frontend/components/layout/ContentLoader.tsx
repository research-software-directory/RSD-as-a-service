// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import CircularProgress from '@mui/material/CircularProgress'
import ContentInTheMiddle from './ContentInTheMiddle'

export default function ContentLoader() {
  return (
    <ContentInTheMiddle>
      <CircularProgress />
    </ContentInTheMiddle>
  )
}
