// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {MentionTitle} from './MentionItemBase'
import {MentionItemProps} from '~/types/Mention'
import ImageAsBackground from '../layout/ImageAsBackground'
import MentionAuthors from './MentionAuthors'
import MentionPublisherItem from './MentionPublisherItem'
import MentionEditButtons from './MentionEditButtons'

type MentionListItem = {
  item: MentionItemProps
}

export default function MentionEditFeatured({item}: MentionListItem) {
  return (
    <article className="mb-8 md:flex">
      <ImageAsBackground className="flex-1 min-h-[6rem]" src={item.image_url} alt={item.title ?? 'image'} />
      <div className="flex flex-col py-4 px-0 md:py-0 md:px-6 md:flex-1 lg:flex-2">
        <MentionTitle
          title={item.title ?? ''}
          url={item.url}
          role="list"
          className="font-medium pb-1 line-clamp-5"
        />
        <MentionAuthors
          authors={item.authors}
          className="text-sm max-h-[9rem] overflow-y-auto overflow-x-hidden"
        />
        <MentionPublisherItem
          publisher={item?.publisher ?? ''}
          page={item?.page ?? ''}
          publication_year={item.publication_year}
          journal = {item.journal}
          className="text-sm"
        />
      </div>
      <nav>
        <MentionEditButtons item={item}/>
      </nav>
    </article>
  )
}
