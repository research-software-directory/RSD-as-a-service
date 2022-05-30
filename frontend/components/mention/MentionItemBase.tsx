import {ReactNode} from 'react'

import {MentionItemProps} from '~/types/Mention'
import MentionAuthors from './MentionAuthors'
import MentionDoi from './MentionDoi'
import MentionPublisherItem from './MentionPublisherItem'

type MentionItemRole = 'list'|'find'|'view'

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
          is_featured={item?.is_featured}
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
        className="text-sm"
      />
      <MentionDoi
        url={item?.url}
        doi={item?.doi}
        className="text-sm"
      />
    </article>
  )
}


type MentionTitleProps = {
  title: string
  url?: string | null
  role?: MentionItemRole
  pos?: number
  is_featured?: boolean
  className?: string
}

export function MentionTitle({title, url, role, pos, is_featured, className}: MentionTitleProps) {

  function isFeatured() {
    if (is_featured) {
      return <span className="lowercase pl-2">[featured]</span>
    }
    return null
  }

  if (url && role === 'list') {
    return (
      <div className={className}>
        <a href={url} target="_blank" rel="noreferrer">
          {/* show pos if provided */}
          {pos ? `${pos}.` : null}{title}
          {isFeatured()}
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
