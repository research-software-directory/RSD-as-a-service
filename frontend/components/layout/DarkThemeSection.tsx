// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {JSX} from 'react'
import DarkThemeProvider from './DarkThemeProvider'

export default function DarkThemeSection({children}:{children:JSX.Element[]|JSX.Element}) {
  return (
    <section className="bg-secondary">
      <DarkThemeProvider>
        {children}
      </DarkThemeProvider>
    </section>
  )
}
