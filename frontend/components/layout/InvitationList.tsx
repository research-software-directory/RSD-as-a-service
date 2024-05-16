// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import CopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'

import {createJsonHeaders} from '~/utils/fetchHelpers'
import copyToClipboard from '~/utils/copyToClipboard'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {Invitation} from '../maintainers/apiMaintainers'
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

  function getExpiredText(daysValid: number): string {
    if (daysValid <= 0) {
      return 'this invitation is expired'
    } else if (daysValid === 1) {
      return 'expires in less than a day'
    } else {
      return `expires in ${daysValid} days`
    }
  }

  if(invitations.length === 0) return null
  const now = new Date()

  return (
    <>
      <EditSectionTitle
        title={'Unused invitations'}
        subtitle={'These invitations are not used yet'}
      />
      <List>
        {invitations.map(inv => {
          const currentLink = `${location.origin}/invite/${inv.type}/${inv.id}`
          const expiresAt = new Date(inv.expires_at)
          const daysValid = Math.ceil((expiresAt.valueOf() - now.valueOf()) / (1000 * 60 * 60 * 24))
          let expiredText: string
          expiredText = getExpiredText(daysValid);
          return (
            <ListItem key={inv.id} disableGutters>
              <ListItemText primary={'Created on ' + new Date(inv.created_at).toDateString() + ', ' + expiredText} secondary={currentLink}/>
              <IconButton onClick={() => toClipboard(currentLink)}><CopyIcon/></IconButton>
              <IconButton onClick={() => deleteMaintainerLink(inv)}><DeleteIcon/></IconButton>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}
