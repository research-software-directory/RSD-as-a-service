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
  subtitle: string | null,
  publication_date: string | null
  author: string | null
}

export default function NewsItemHeader({title,subtitle,publication_date,author}: NewsItemHeaderProps) {

  return (
    <>
      <PublicationDate publication_date={publication_date} className="absolute right-4 top-4"/>
      <h1 className="text-[2rem] md:text-[3rem] lg:text-[4rem] leading-tight">
        {title}
      </h1>
      <p className="text-[1.5rem] lg:text-[2rem] lg:pb-4">
        {subtitle}
      </p>
      <NewsAuthors author={author} />
    </>
  )
}
