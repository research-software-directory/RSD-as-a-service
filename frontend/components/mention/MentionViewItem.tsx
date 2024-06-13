// SPDX-FileCopyrightText: 2022 - 2024 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import Link from 'next/link'
import LinkIcon from '@mui/icons-material/Link'

import {MentionItemProps} from '../../types/Mention'
import MentionAuthors from './MentionAuthors'
import MentionPublisherItem from './MentionPublisherItem'
import MentionDoi from './MentionDoi'
import {MentionTitle} from './MentionItemBase'
import MentionNote from './MentionNote'

export default function MentionViewItem({item, pos}: {item: MentionItemProps, pos:number}) {

  function renderItemBody() {
    return (
      <div data-testid="mention-view-item-body" className="flex justify-start">
        <div className="min-w-[1rem] p-[0.2rem]">{pos}.</div>
        <div className='pl-4 flex-1'>
          <MentionTitle
            title={item?.title ?? ''}
            role="view"
            className="font-light text-lg line-clamp-5"
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
          <MentionDoi
            url={null}
            doi={item?.doi}
            className="text-sm"
          />
          <MentionNote note={item.note ?? null} />
        </div>
        <div className="flex justify-center items-center">
          {item?.url ? <LinkIcon /> : null}
        </div>
      </div>
    )
  }

  if (item?.url) {
    return (
      <Link
        href={item.url}
        className="flex-1 pr-8"
        target="_blank"
        rel="noreferrer"
        passHref
      >
        {renderItemBody()}
      </Link>
    )
  }
  return renderItemBody()
}
