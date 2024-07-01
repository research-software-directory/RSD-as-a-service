// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {ReactNode} from 'react'

import {MentionItemProps} from '~/types/Mention'
import SanitizedMathMLBox from '~/components/layout/SanitizedMathMLBox'
import MentionAuthors from './MentionAuthors'
import MentionDoi from './MentionDoi'
import MentionNote from './MentionNote'
import MentionPublisherItem from './MentionPublisherItem'

export type MentionItemRole = 'list'|'find'|'view'

type MentionItemCardProps = {
  item: MentionItemProps,
  pos?: number,
  nav?: ReactNode,
  // mention type by RSD
  type?: string
  // list item has link on title and shows is_featured
  role?: MentionItemRole
}

export default function MentionItemBase({item,pos,nav,type,role='find'}:MentionItemCardProps) {
  function renderButtons() {
    if (nav) return nav
    return null
  }
  function renderPublicationType() {
    if (type) {
      return (
        <div className="text-sm">
          {type}
        </div>
      )
    }
    return null
  }
  return (
    <article
      data-testid="mention-item-base"
      className="flex-1"
    >
      {renderPublicationType()}
      <div className="flex-1 flex items-baseline">
        <MentionTitle
          pos={pos}
          title={item?.title ?? ''}
          url={item?.url}
          role={role}
          className="flex-1 font-medium line-clamp-5"
        />
        <nav className="pl-4">
          {renderButtons()}
        </nav>
      </div>
      <MentionAuthors
        authors={item.authors}
        className="text-sm max-h-[9rem] overflow-y-auto overflow-x-hidden"
      />
      <MentionPublisherItem
        publisher={item?.publisher}
        page={item?.page}
        publication_year={item.publication_year}
        journal = {item.journal}
        className="text-sm"
      />
      <MentionDoi
        url={item?.url}
        doi={item?.doi}
        className="text-sm"
        role={role}
      />
      <MentionNote note={item.note ?? null} />
    </article>
  )
}


type MentionTitleProps = {
  title: string
  url?: string | null
  role?: MentionItemRole
  pos?: number
  className?: string
}

export function MentionTitle({title, url, role, pos, className}: MentionTitleProps) {
  const rawHtml = pos ? `${pos}. ${title}` : title
  if (url && role === 'list') {
    return (
      <div
        title={title}
        className={className}>
        <SanitizedMathMLBox
          component="a"
          target="_blank"
          rel="noreferrer"
          href={url}
          rawHtml={rawHtml}
        />
      </div>
    )
  }
  return (
    <SanitizedMathMLBox
      title={title}
      component="div"
      className={className}
      rawHtml={rawHtml}
    />
  )
}
