// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ReactNode} from 'react'

import {MentionItemProps} from '~/types/Mention'
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
      data-testid="mention-item-base" className="flex-1">
      {renderPublicationType()}
      <div className="flex-1 flex items-baseline">
        <MentionTitle
          pos={pos}
          title={item?.title ?? ''}
          url={item?.url}
          role={role}
          className="flex-1 font-medium"
        />
        <nav className="pl-4">
          {renderButtons()}
        </nav>
      </div>
      <MentionAuthors
        authors={item.authors}
        className="text-sm"
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
      <MentionNote note={item.note} />
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

  if (url && role === 'list') {
    return (
      <div className={className}>
        <a href={url} target="_blank" rel="noreferrer">
          {/* show pos if provided */}
          {pos ? `${pos}.` : null}{title}
        </a>
      </div>
    )
  }
  return (
    <div className={className}>
      {pos ? `${pos}.` : null}{title}
    </div>
  )
}
