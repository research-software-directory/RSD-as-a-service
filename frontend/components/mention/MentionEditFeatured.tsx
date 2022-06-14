// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {IconButton} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import UpdateIcon from '@mui/icons-material/Update'
import MentionItemBase, {MentionTitle} from './MentionItemBase'
import {MentionItemProps, MentionTypeKeys} from '~/types/Mention'
import useEditMentionReducer from './useEditMentionReducer'
import ImageAsBackground from '../layout/ImageAsBackground'
import MentionAuthors from './MentionAuthors'
import MentionPublisherItem from './MentionPublisherItem'

type MentionListItem = {
  pos: number
  item: MentionItemProps
}

export default function MentionEditFeatured({item, pos}: MentionListItem) {
  // use context methods to pass btn action
  // const {onUpdate, confirmDelete, setEditModal} = useContext(EditMentionContext)
  const {setEditModal,onUpdate,confirmDelete} = useEditMentionReducer()

  function onEdit() {
    setEditModal(item)
  }

  function renderButtons() {
    const html = []

    if (item.source.toLowerCase() === 'manual' &&
      item.doi) {
      // we only update items with DOI
      html.push(
        <IconButton
          key="update-button"
          title={`Update from DOI: ${item.doi}`}
          onClick={() => onUpdate(item)}>
            <UpdateIcon />
        </IconButton>
      )
    } else if (item.source.toLowerCase() === 'manual') {
      // manual items without DOI can be edited
      html.push(
        <IconButton
          key="edit-button"
          onClick={onEdit}>
            <EditIcon />
        </IconButton>
      )
    }
    // all items can be deleted
    html.push(
      <IconButton
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
          className="text-sm"
        />
      </div>
      <nav>
        {renderButtons()}
      </nav>
    </article>
  )
}
