// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import NewsAuthors from '../overview/card/NewsAuthors'
import PublicationDate from '../overview/card/PublicationDate'

type NewsItemHeaderProps = {
  title: string,
  publication_date: string | null
  author: string | null
}

export default function NewsItemHeader({title,publication_date,author}: NewsItemHeaderProps) {

  return (
    <>
      <h1 className="text-[2rem] md:text-[3rem] leading-tight">
        {title}
      </h1>
      <div className="flex justify-between gap-8 pt-4">
        <PublicationDate publication_date={publication_date}/>
        <NewsAuthors author={author} />
      </div>
    </>
  )
}
