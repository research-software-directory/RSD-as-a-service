// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (NLEsc) <d.mijatovic@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {useState} from 'react'
import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import HubIcon from '@mui/icons-material/Hub'
import DeleteIcon from '@mui/icons-material/Delete'
import Alert from '@mui/material/Alert'
import {useSession} from '~/auth/AuthProvider'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import {MentionItemProps} from '~/types/Mention'
import MentionViewItem from '~/components/mention/MentionViewItem'
import EditMentionModal from '~/components/mention/EditMentionModal'
import useSnackbar from '~/components/snackbar/useSnackbar'
import MentionLocations from '~/components/admin/mentions/MentionLocations'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'
import ConfirmDeleteModal from '~/components/layout/ConfirmDeleteModal'
import Tooltip from '@mui/material/Tooltip'

function leaveOutSomeFieldsReplacer(key: string, value: any) {
  if (key === 'id' || key === 'doi_registration_date' || key === 'created_at' || key === 'updated_at') {
    return undefined
  } else {
    return value
  }
}

function AdminMention({mention, idx, onUpdate}: Readonly<{mention: MentionItemProps, idx: number, onUpdate: () => void}>) {
  const [isOpenMentionLocations, setIsOpenMentionLocations] = useState<boolean>(false)
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {page, rows} = usePaginationWithSearch('Find mentions')
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
  const [confirmation, setConfirmation] = useState<string>('')

  async function updateMention(data: MentionItemProps) {
    const id = data.id as string
    const body = JSON.stringify(data, leaveOutSomeFieldsReplacer)
    const resp = await fetch(`/api/v1/mention?id=eq.${id}`, {
      method: 'PATCH',
      body: body,
      headers: createJsonHeaders(token)
    })
    if (resp.ok) {
      setEditModalOpen(false)
      onUpdate()
    } else {
      showErrorMessage(`got status ${resp.status}:${await resp.text()}`)
    }
  }

  async function deleteMention(mentionId: string) {
    const body = JSON.stringify({mention_id: mentionId})
    const resp = await fetch('/api/v1/rpc/delete_mention', {
      method: 'POST',
      body: body,
      headers: createJsonHeaders(token)
    })
    if (resp.ok) {
      setDeleteModalOpen(false)
      onUpdate()
    } else {
      showErrorMessage(`got status ${resp.status}:${await resp.text()}`)
    }
  }

  return(
    <ListItem sx={{display: 'list-item'}}>
      <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center hover:bg-base-200">
        <MentionViewItem item={mention} pos={page * rows + idx + 1} />
        <Tooltip title={'Edit'} placement={'top'} >
          <IconButton
            onClick={() => setEditModalOpen(true)}
            aria-label={`Edit the mention ${mention.title}`}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={'View usages'} placement={'top'} >
          <IconButton
            aria-label={isOpenMentionLocations ? `Hide usages of ${mention.title}` : `Show usages of ${mention.title}`}
            onClick={() => setIsOpenMentionLocations(!isOpenMentionLocations)}
          >
            <HubIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={'Delete'} placement={'top'} >
          <IconButton
            aria-label={`Delete the mention ${mention.title}; (you will be asked to confirm this before we delete it)`}
            onClick={() => setDeleteModalOpen(!deleteModalOpen)}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
      {isOpenMentionLocations ?
        <MentionLocations mentionId={mention.id as string}/>
        : null
      }
      {editModalOpen ?
        <EditMentionModal
          title={mention.id as string}
          open={editModalOpen}
          pos={undefined} //why does this exist?
          item={mention}
          onCancel={() => setEditModalOpen(false)}
          onSubmit={({data}) => {updateMention(data)}}
        />
        : null
      }
      {deleteModalOpen ?
        <ConfirmDeleteModal
          open={deleteModalOpen}
          title='Delete mention'
          onCancel={() => setDeleteModalOpen(false)}
          onDelete={() => deleteMention(mention.id!)}
          removeDisabled={confirmation !== mention.id}
          body={
            <>
              <p>
                Are you sure you want to remove <strong>{mention.title}</strong> with ID <strong>{mention.id}</strong>?
              </p>
              <TextField
                label="ID of the mention to delete"
                helperText={
                  <span>Type the mention ID exactly as shown above.</span>
                }
                value = {confirmation}
                onChange={({target})=>setConfirmation(target.value)}
                sx={{
                  width: '100%',
                  margin: '1rem 0rem'
                }}
              />
            </>
          }
        />
        : null
      }
    </ListItem>
  )
}

export default function MentionsOverviewList({list, onUpdate}: {list: MentionItemProps[], onUpdate: ()=>void}) {
  if (list.length === 0) {
    return (
      <Alert severity="info" sx={{margin:'1rem 0rem'}}>
        No mentions found
      </Alert>
    )
  }

  return (
    <List>
      {list.map((mention, idx) => <AdminMention key={mention.id} mention={mention} idx={idx} onUpdate={onUpdate} />)}
    </List>
  )
};

