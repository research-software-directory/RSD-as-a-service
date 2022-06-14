// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import ContentInTheMiddle from './ContentInTheMiddle'
import CircularProgress from '@mui/material/CircularProgress'

export default function ContentLoader() {
  return (
    <ContentInTheMiddle>
      <CircularProgress />
    </ContentInTheMiddle>
  )
}
