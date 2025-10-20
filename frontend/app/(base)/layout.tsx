// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import MainContent from '~/components/layout/MainContent'

// force to be dynamic route
export const dynamic = 'force-dynamic'

/**
 * Base layout with bg-base-100 (white) background on the main content.
 * Base layout does NOT use content container (lg:container) layout.
 * @param param0
 * @returns
 */
export default function BaseLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <MainContent className="bg-base-100">
      {children}
    </MainContent>
  )
}
