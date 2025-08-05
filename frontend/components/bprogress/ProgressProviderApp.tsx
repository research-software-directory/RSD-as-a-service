// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {ProgressProvider} from '@bprogress/next/app'
import {app} from '~/config/app'

export default function ProgressProviderApp({children}:{children:any}) {
  return (
    <ProgressProvider
      height={app.bprogressHeight}
      color="var(--rsd-accent,'orange');"
      options={{showSpinner: false}}
      // this includes parameter changes
      shallowRouting={false}
    >
      {children}
    </ProgressProvider>
  )
}
