// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import MainContent from '~/components/layout/MainContent'

// force to be dynamic route
export const dynamic = 'force-dynamic'

/**
 * SoftwareOverviewLayout applies lightgrey background (bg-base-200) to main element.
 * This layout does not use container (lg:container) layout because Highglights section requires full page access.
 * @param param0
 * @returns
 */
export default function SoftwareOverviewLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <MainContent className="bg-base-200">
      {children}
    </MainContent>
  )
}
