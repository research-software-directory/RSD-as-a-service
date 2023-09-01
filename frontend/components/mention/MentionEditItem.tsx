// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
// import UpdateIcon from '@mui/icons-material/Update'
import {useSession} from '~/auth'
import MentionItemBase from './MentionItemBase'
import {MentionItemProps} from '~/types/Mention'
import useEditMentionReducer from './useEditMentionReducer'

type MentionListItem = {
  pos: number
  item: MentionItemProps
}

export default function MentionEditItem({item, pos}: MentionListItem) {
  const {user} = useSession()
  // use context methods to pass btn action
  // const {onUpdate, confirmDelete, setEditModal} = useContext(EditMentionContext)
  const {setEditModal,confirmDelete} = useEditMentionReducer()

  function onEdit() {
    setEditModal(item)
  }

  function renderButtons() {
    const html = []

    if (user?.role==='rsd_admin') {
      // items without DOI can be edited by rsd_admin
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
    <MentionItemBase
      item={item}
      pos={pos}
      nav={renderButtons()}
      role="list"
    />
  )
}
