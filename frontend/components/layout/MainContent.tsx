// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ReactNode} from 'react'

export type MainContainerProps = Readonly<{
  className?: string
  props?: any
  children: ReactNode
}>

export default function MainContent({className, children, ...props}: MainContainerProps) {
  // keep these styles in sync with AppHeader and AppFooter
  return (
    <main
      // a11y id to be used to skip to main content link
      id="main-content"
      className={`flex-1 flex flex-col py-4 lg:pb-12 outline-none ${className ?? ''}`}
      {...props}
    >
      {children}
    </main>
  )
}
