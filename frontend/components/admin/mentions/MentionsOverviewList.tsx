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
  const [modalOpen, setModalOpen] = useState<boolean>(false)

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

  return(
    <ListItem sx={{display: 'list-item'}}>
      <div className="grid grid-cols-[1fr_auto_auto] items-center hover:bg-base-200">
        <MentionViewItem item={mention} pos={page * rows + idx + 1} />
        <IconButton onClick={() => setModalOpen(true)} ><EditIcon></EditIcon></IconButton>
        <IconButton
          aria-label={isOpenMentionLocations ? `Hide usages of ${mention.title}` : `Show usages of ${mention.title}`}
          onClick={() => setIsOpenMentionLocations(!isOpenMentionLocations)}
        >
          <HubIcon />
        </IconButton>
      </div>
      {isOpenMentionLocations ?
        <MentionLocations mentionId={mention.id as string}/>
        : null
      }
      {modalOpen ?
        <EditMentionModal
          title={mention.id as string ?? 'undefined'}
          open={modalOpen}
          pos={undefined} //why does this exist?
          item={mention}
          onCancel={() => setModalOpen(false)}
          onSubmit={({data}) => {updateMention(data)}}
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
        No mentions to show
      </Alert>
    )
  }

  return (
    <List>
      {list.map((mention, idx) => <AdminMention key={mention.id} mention={mention} idx={idx} onUpdate={onUpdate} />)}
    </List>
  )
};

