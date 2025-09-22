// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import AppFooter from '~/components/AppFooter'
import AppHeader from '~/components/AppHeader'

// force to be dynamic route
export const dynamic = 'force-dynamic'

export default function AddLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      {/* Header  */}
      <AppHeader />
      {/* Main content with white background */}
      <main className="flex-1 flex flex-col bg-base-100 pb-12">
        {children}
      </main>
      {/* Footer */}
      <AppFooter />
    </>
  )
}
