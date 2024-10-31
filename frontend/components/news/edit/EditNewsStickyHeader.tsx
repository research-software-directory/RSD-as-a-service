// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useState, useRef} from 'react'
import {useFormContext} from 'react-hook-form'

import StickyHeader from '~/components/layout/StickyHeader'
import useStickyHeaderBorder from '~/components/layout/useStickyHeaderBorder'
import ViewPageButton from '~/components/layout/ViewPageButton'
import {NewsItem} from '../apiNews'

export default function EditNewsStickyHeader() {
  const {watch} = useFormContext<NewsItem>()
  const headerRef = useRef(null)
  const [classes, setClasses] = useState('')

  const [title,slug,publication_date] = watch(['title','slug','publication_date'])

  // add border when header is at the top of the page
  useStickyHeaderBorder({
    headerRef, setClasses
  })

  return (
    <StickyHeader className={`bg-base-100 ${classes}`}>
      <h1
        ref={headerRef}
        className="flex-1 xl:text-4xl">
        {title}
      </h1>
      <ViewPageButton
        title={`View ${title ?? 'news page'}}`}
        url={`/news/${publication_date}/${slug}`}
        disabled={typeof slug === 'undefined'}
        label="View article"
      />
    </StickyHeader>
  )
}
