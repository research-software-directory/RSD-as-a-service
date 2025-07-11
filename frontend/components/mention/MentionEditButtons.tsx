// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useSession} from '~/auth/AuthProvider'
import useEditMentionReducer from './useEditMentionReducer'

import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import {MentionItemProps} from '~/types/Mention'

export default function MentionEditButtons({item}: {item:MentionItemProps}) {
  const {user} = useSession()
  const {setEditModal,confirmDelete} = useEditMentionReducer()
  const html = []

  // console.group('MentionEditButtons')
  // console.log('user...', user)
  // console.log('item...', item)
  // console.groupEnd()

  if (user?.role==='rsd_admin') {
    // items without DOI can be edited by rsd_admin
    html.push(
      <IconButton
        data-testid="edit-mention-btn"
        key="edit-button"
        onClick={()=>setEditModal(item)}>
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
