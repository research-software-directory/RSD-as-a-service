// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {NewsListItemProps} from '~/components/news/apiNews'
import NoContent from '~/components/layout/NoContent'
import GridOverview from '~/components/layout/GridOverview'
import NewsCard from './card/NewsCard'

export type NewsGridProps = {
  news: NewsListItemProps[]
}

export default function NewsGrid({news}: NewsGridProps) {

  if (typeof news == 'undefined' || news.length===0){
    return <NoContent />
  }

  return (
    <GridOverview fullWidth={true} className="pt-12 pb-6 auto-rows-[27rem]">
      {news.map((news) => (
        <NewsCard key={`${news.publication_date}/${news.slug}`} item={news} />
      ))}
    </GridOverview>
  )
}
