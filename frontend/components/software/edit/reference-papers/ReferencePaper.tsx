// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import IconButton from '@mui/material/IconButton'
import DeleteIcon from '@mui/icons-material/Delete'

import {MentionItemProps} from '~/types/Mention'
import MentionAuthors from '~/components/mention/MentionAuthors'
import MentionDoi from '~/components/mention/MentionDoi'
import {MentionTitle} from '~/components/mention/MentionItemBase'
import MentionPublisherItem from '~/components/mention/MentionPublisherItem'
import {getMentionType} from '~/components/mention/config'

export type ReferencePaperProps = {
  item: MentionItemProps
  onDelete: () => void
}

export default function ReferencePaper({item,onDelete}:ReferencePaperProps){
  const mentionType = getMentionType(item?.mention_type,'singular')
  return (
    <div data-testid="reference-paper-item-body" className="py-2 px-4 hover:bg-base-200">

      <div className="flex-1 flex items-center">
        <div className="flex-1">
          <div className="text-base-content-disabled">
            {mentionType}
          </div>
          <MentionTitle
            title={item?.title ?? ''}
            role="list"
            url={item.url}
            className="text-base"
          />
        </div>
        <IconButton
          data-testid="delete-mention-btn"
          key="delete-button"
          sx={{
            marginLeft:'1rem'
          }}
          onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </div>

      <MentionAuthors
        authors={item.authors}
        className="text-sm text-base-content-secondary"
      />
      <MentionPublisherItem
        publisher={item?.publisher ?? ''}
        page={item?.page ?? ''}
        publication_year={item.publication_year}
        journal = {item.journal}
        className="text-sm text-base-content-secondary"
      />
      <MentionDoi
        url={item?.url}
        doi={item?.doi}
        className="text-sm"
      />
    </div>
  )
}
