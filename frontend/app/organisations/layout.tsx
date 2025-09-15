// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import AppFooter from '~/components/AppFooter'
import AppHeader from '~/components/AppHeader'
import PageBackground from '~/components/layout/PageBackground'
import MainContent from '~/components/layout/MainContent'

// force to be dynamic route
export const dynamic = 'force-dynamic'

export default function OrganisationsLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <PageBackground>
      {/* Header  */}
      <AppHeader />
      {/* Main content */}
      <MainContent>
        {children}
      </MainContent>
      {/* Footer */}
      <AppFooter />
    </PageBackground>
  )
}
