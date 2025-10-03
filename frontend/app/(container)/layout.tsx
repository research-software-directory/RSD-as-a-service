// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import MainLayout from '~/components/layout/MainLayout'

// force to be dynamic route
export const dynamic = 'force-dynamic'

/**
 * ContainerLayout applies lightgrey background (bg-base-200) on the main content element.
 * It adds article element as content container element using px-4, lg:container, lg:mx-auto tailwind classes.
 * @param param0
 * @returns
 */
export default function ContainerLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <MainLayout className="bg-base-200">
      <article className="flex-1 flex flex-col px-4 lg:container lg:mx-auto">
        {children}
      </article>
    </MainLayout>
  )
}
