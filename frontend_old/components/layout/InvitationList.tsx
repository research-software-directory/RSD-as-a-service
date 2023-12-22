// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Invitation} from '~/types/Invitation'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import CopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import copyToClipboard from '~/utils/copyToClipboard'
import useSnackbar from '~/components/snackbar/useSnackbar'
import ListItemText from '@mui/material/ListItemText'
import EditSectionTitle from './EditSectionTitle'

export default function InvitationList({invitations, token, onDeleteCallback}: {invitations: Invitation[], token: string, onDeleteCallback: Function}) {
  const {showErrorMessage, showInfoMessage} = useSnackbar()

  async function deleteMaintainerLink(invitation: Invitation) {
    const resp = await fetch(`/api/v1/invite_maintainer_for_${invitation.type}?id=eq.${invitation.id}`, {
      headers: createJsonHeaders(token),
      method: 'DELETE'
    })
    if (resp.status !== 204) showErrorMessage('Failed to delete invitation.')
    onDeleteCallback()
  }

  async function toClipboard(message?: string) {
    if (message) {
      const copied = await copyToClipboard(message)
      // notify user about copy action
      if (copied) {
        showInfoMessage('Copied to clipboard')
      } else {
        showErrorMessage(`Failed to copy link ${message}`)
      }
    }
  }

  if(invitations.length === 0) return null

  return (
    <>
      <EditSectionTitle title={'Unused invitations'} subtitle={'These invitations are not used yet'}/>
      <List>
        {invitations.map(inv => {
          const currentLink = `${location.origin}/invite/${inv.type}/${inv.id}`
          return (
            <ListItem key={inv.id} disableGutters>
              <ListItemText primary={'Created on ' + new Date(inv.created_at).toDateString()} secondary={currentLink}/>
              <IconButton onClick={() => toClipboard(currentLink)}><CopyIcon/></IconButton>
              <IconButton onClick={() => deleteMaintainerLink(inv)}><DeleteIcon/></IconButton>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}
