// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import Alert from '@mui/material/Alert'
import {useSession} from '~/auth/AuthProvider'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import {MentionItemProps} from '~/types/Mention'
import MentionViewItem from '~/components/mention/MentionViewItem'
import EditMentionModal from '~/components/mention/EditMentionModal'
import useSnackbar from '~/components/snackbar/useSnackbar'

function leaveOutSomeFieldsReplacer(key: string, value: any) {
  if (key === 'id' || key === 'doi_registration_date' || key === 'created_at' || key === 'updated_at') {
    return undefined
  } else {
    return value
  }
}

export default function MentionsOverviewList({list, onUpdate}: {list: MentionItemProps[], onUpdate: ()=>void}) {
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [mentionToEdit, setMentionToEdit] = useState<MentionItemProps | undefined>(undefined)
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {page, rows} = usePaginationWithSearch('Find mentions')

  async function updateMention(data: MentionItemProps) {
    const id = data.id as string
    const body = JSON.stringify(data, leaveOutSomeFieldsReplacer)
    const resp = await fetch(`/api/v1/mention?id=eq.${id}`, {
      method: 'PATCH',
      body: body,
      headers: createJsonHeaders(token)
    })
    if (resp.ok) {
      setModalOpen(false)
      onUpdate()
    } else {
      showErrorMessage(`got status ${resp.status}:${await resp.text()}`)
    }
  }

  if (list.length === 0) {
    return (
      <Alert severity="info" sx={{margin:'1rem 0rem'}}>
        No mentions to show
      </Alert>
    )
  }

  return (
    <>
      <List>
        {list.map((mention, idx) => {
          return (
            <ListItem
              key={mention.id}
              secondaryAction={
                <IconButton onClick={() => {setModalOpen(true); setMentionToEdit(mention)}} ><EditIcon></EditIcon></IconButton>
              }
              className="hover:bg-base-200 flex-1 pr-4"
            >
              <MentionViewItem item={mention} pos={page * rows + idx + 1} />
            </ListItem>
          )
        })}
      </List>
      {modalOpen ?
        <EditMentionModal
          title={mentionToEdit?.id as string ?? 'undefined'}
          open={modalOpen}
          pos={undefined} //why does this exist?
          item={mentionToEdit}
          onCancel={() => setModalOpen(false)}
          onSubmit={({data}) => {updateMention(data)}}
        />
        : null
      }
    </>
  )
};

