// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {IconButton} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import UpdateIcon from '@mui/icons-material/Update'
import MentionItemBase from './MentionItemBase'
import {MentionItemProps, MentionTypeKeys} from '~/types/Mention'
import useEditMentionReducer from './useEditMentionReducer'

type MentionListItem = {
  pos: number
  type: MentionTypeKeys
  item: MentionItemProps
}

export default function MentionEditItem({item, pos, type}: MentionListItem) {
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
    <MentionItemBase
      item={item}
      pos={pos}
      nav={renderButtons()}
      role="list"
    />
  )
}
