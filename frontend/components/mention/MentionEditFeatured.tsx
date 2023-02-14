// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {useSession} from '~/auth'
import {MentionTitle} from './MentionItemBase'
import {MentionItemProps} from '~/types/Mention'
import useEditMentionReducer from './useEditMentionReducer'
import ImageAsBackground from '../layout/ImageAsBackground'
import MentionAuthors from './MentionAuthors'
import MentionPublisherItem from './MentionPublisherItem'

type MentionListItem = {
  item: MentionItemProps
}

export default function MentionEditFeatured({item}: MentionListItem) {
  const {user} = useSession()
  const {setEditModal,onUpdate,confirmDelete} = useEditMentionReducer()

  function onEdit() {
    setEditModal(item)
  }

  function renderButtons() {
    const html = []

    if (item.doi) {
      // WE do not allow update of mentions with DOI from FE
      // Dusan 2022-10-19
      // html.push(
      //   <IconButton
      //     key="update-button"
      //     title={`Update from DOI: ${item.doi}`}
      //     onClick={() => onUpdate(item)}>
      //       <UpdateIcon />
      //   </IconButton>
      // )
    } else if (user?.role==='rsd_admin') {
      // manual items without DOI can be edited
      html.push(
        <IconButton
          data-testid="edit-mention-btn"
          key="edit-button"
          onClick={onEdit}>
            <EditIcon />
        </IconButton>
      )
    }
    // all items can be deleted
    html.push(
      <IconButton
        data-testid="delete-mention-btn"
        key="delete-button"
        sx={{
          marginLeft:'1rem'
        }}
        onClick={() => confirmDelete(item)}>
        <DeleteIcon />
      </IconButton>
    )

    return html
  }

  return (
    <article className="mb-8 md:flex">
      <ImageAsBackground className="flex-1 min-h-[6rem]" src={item.image_url} alt={item.title ?? 'image'} />
      <div className="flex flex-col py-4 px-0 md:py-0 md:px-6 md:flex-1 lg:flex-[2]">
        <MentionTitle
          title={item.title ?? ''}
          url={item.url}
          role="list"
          className="font-medium pb-1"
        />
        <MentionAuthors
          authors={item.authors}
          className="text-sm"
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
        {renderButtons()}
      </nav>
    </article>
  )
}
