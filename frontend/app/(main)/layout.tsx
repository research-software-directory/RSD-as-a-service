// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import MainLayout from '~/components/layout/MainLayout'

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
    <MainLayout>
      {children}
    </MainLayout>
  )

}
