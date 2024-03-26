// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import {NewsListItem} from '~/components/news/apiNews'
import NewsCardContent from './NewsCardContent'
import NewsCardNav from './NewsCardNav'

export default function NewsCard({item}:{item:NewsListItem}) {
  return (
    <div
      data-testid="admin-news-grid-card"
      className="relative h-full"
    >
      {/* standard project card with link */}
      <Link
        data-testid="project-grid-card"
        href={`/news/${item.publication_date}/${item.slug}`}
        className="h-full hover:text-inherit"
      >
        <NewsCardContent item={item} />
      </Link>
      <NewsCardNav item={item} />
    </div>
  )
}
