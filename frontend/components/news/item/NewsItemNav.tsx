// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {JSX} from 'react'
import NewsItemBreadcrumbs from './NewsItemBreadcrumbs'

type NewsItemHeaderProps = {
  slug: string,
  children: JSX.Element|JSX.Element[],
}

export default function NewsItemNav({slug,children}:NewsItemHeaderProps) {
  return (
    <section className="flex md:gap-8 items-baseline py-4">
      <NewsItemBreadcrumbs slug={[slug]} />
      {children}
    </section>
  )
}
