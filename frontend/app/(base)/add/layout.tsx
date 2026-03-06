// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (NLEsc) <d.mijatovic@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

// force to be dynamic route
export const dynamic = 'force-dynamic'

/**
 * AddLayout is used on add pages. It adds article element with padding (pt-12) at the top of the base layout
 * @param param0
 * @returns
 */
export default function AddLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  return (
    <article className="flex-1 p-4 lg:pt-12">
      {children}
    </article>
  )

}
