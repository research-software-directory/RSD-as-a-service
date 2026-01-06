// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import ImageAsBackground from '../layout/ImageAsBackground'
import {MentionItemProps} from '../../types/Mention'
import MentionAuthors from './MentionAuthors'
import MentionPublisherItem from './MentionPublisherItem'

export default function MentionItemFeatured({mention}: {mention: MentionItemProps}) {
  // do not render if no data or no url
  if (!mention || mention.url===null) return null

  return (
    <Link href={mention.url ?? ''}
      data-testid="mention-is-featured"
      target="_blank"
      rel="noreferrer"
      passHref
    >
      <article className="mb-8 md:flex">
        <ImageAsBackground className="flex-1 h-[17rem]" src={mention.image_url} alt={mention.title ?? 'image'} />
        <div className="flex flex-col py-4 px-0 md:py-0 md:px-6 md:flex-1 lg:flex-2 text-primary-content">
          <h3
            title={mention.title ?? ''}
            className="text-[2rem] mb-4 text-accent leading-10 line-clamp-5">
            {mention.title}
          </h3>
          {/* <div>By {mention.authors}</div> */}
          <MentionAuthors
            authors={mention.authors}
            className="text-md max-h-[9rem] overflow-y-auto overflow-x-hidden"
          />
          <MentionPublisherItem
            publisher={mention?.publisher ?? ''}
            page={mention?.page ?? ''}
            publication_year={mention.publication_year}
            journal = {mention.journal}
            className="text-md py-2"
          />
        </div>
      </article>
    </Link>
  )
}
