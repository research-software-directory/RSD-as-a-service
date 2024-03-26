// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {NewsListItem} from '~/components/news/apiNews'
import NoContent from '~/components/layout/NoContent'
import ListItemNews from './ListItemNews'

export type NewsListProps = {
  news: NewsListItem[]
}

export default function NewsList({news}: NewsListProps) {

  if (typeof news == 'undefined' || news.length===0){
    return <NoContent />
  }

  return (
    <section
      data-testid="news-overview-list"
      className="flex-1 my-12 flex flex-col gap-2">
      {news.map((news) => (
        <ListItemNews key={`${news.publication_date}/${news.slug}`} item={news} />
      ))}
    </section>
  )
}
