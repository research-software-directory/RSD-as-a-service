// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {NewsListItemProps} from '~/components/news/apiNews'
import NoContent from '~/components/layout/NoContent'
import ListOverviewSection from '~/components/layout/ListOverviewSection'
import NewsListItem from './NewsListItem'

export type NewsListProps = {
  news: NewsListItemProps[]
}

export default function NewsList({news}: NewsListProps) {

  if (typeof news == 'undefined' || news.length===0){
    return <NoContent />
  }

  return (
    <ListOverviewSection className="my-12">
      {news.map((news) => (
        <NewsListItem key={`${news.publication_date}/${news.slug}`} item={news} />
      ))}
    </ListOverviewSection>
  )
}
