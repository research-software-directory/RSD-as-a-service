// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {NewsListItem} from '~/components/news/apiNews'
import NoContent from '~/components/layout/NoContent'
import NewsCard from './card/NewsCard'

export type NewsGridProps = {
  news: NewsListItem[]
}

export default function NewsGrid({news}: NewsGridProps) {

  if (typeof news == 'undefined' || news.length===0){
    return <NoContent />
  }

  return (
    <section
      data-testid="news-overview-grid"
      className="my-12 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-[27rem]">
      {news.map((news) => (
        <NewsCard key={`${news.publication_date}/${news.slug}`} item={news} />
      ))}
    </section>
  )
}
