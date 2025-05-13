// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import CopyIcon from '@mui/icons-material/ContentCopy'
import DeleteIcon from '@mui/icons-material/Delete'
import EmailIcon from '@mui/icons-material/Email'
import IconButton from '@mui/material/IconButton'
import ListItemText from '@mui/material/ListItemText'

import copyToClipboard from '~/utils/copyToClipboard'
import useSnackbar from '~/components/snackbar/useSnackbar'
import EditSectionTitle from '~/components/layout/EditSectionTitle'

export type InvitationType = 'software' | 'project' | 'organisation' | 'community' | 'rsd'

export type Invitation = {
    id: string,
    created_at: string,
    expires_at: string,
    type: InvitationType,
    uses_left?: number | null
}

type InvitationListProps=Readonly<{
  subject:string
  body:string
  invitations: Invitation[],
  onDelete: (invitation:Invitation)=>Promise<void>
  showTitle?: boolean
}>

function getInviteText(invite:Invitation){
  const expiresAt = new Date(invite.expires_at)
  const daysValid = Math.ceil((expiresAt.valueOf() - new Date().valueOf()) / (1000 * 60 * 60 * 24))
  let usesText: string|null = null
  let linkIsValid:boolean = true

  if (invite?.uses_left===null){
    usesText = 'Unlimited number of registrations left'
  }else if (invite?.uses_left===0){
    usesText = 'Registration limit reached'
    linkIsValid = false
    return {
      expiredText: 'EXPIRED!',
      usesText,
      linkIsValid
    }
  }else if (invite?.uses_left===1){
    usesText = '1 registration left'
  }else if (invite?.uses_left && invite?.uses_left > 1){
    usesText = `${invite?.uses_left} registrations left`
  }

  if (daysValid <= 0) {
    linkIsValid = false
    return {
      expiredText: 'EXPIRED!',
      usesText,
      linkIsValid
    }
  } else if (daysValid === 1) {
    return {
      expiredText: 'expires in less than a day',
      usesText,
      linkIsValid
    }
  } else {
    return {
      expiredText: `expires in ${daysValid} days`,
      usesText,
      linkIsValid
    }
  }
}

export default function InvitationList({
  subject,body,invitations,onDelete,showTitle=true
}:InvitationListProps) {
  const {showErrorMessage, showInfoMessage} = useSnackbar()

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
      {showTitle ?
        <EditSectionTitle
          title={'Unused invitations'}
          subtitle={'These invitations are not used yet'}
        />
        : null
      }
      <List>
        {invitations.map(inv => {
          const currentLink = `${location.origin}/invite/${inv.type}/${inv.id}`
          const {expiredText, usesText, linkIsValid} = getInviteText(inv)

          return (
            <ListItem
              data-testid="unused-invitation-item"
              key={inv.id}
              disableGutters
              secondaryAction={
                <div className="flex gap-2">
                  <IconButton
                    disabled = {!linkIsValid}
                    title="Email invitation using my email app"
                    href={`mailto:?subject=${subject}&body=${body}${encodeURIComponent('\n')}${currentLink}`}
                    target='_blank'
                    rel="noreferrer"
                  >
                    <EmailIcon/>
                  </IconButton>
                  <IconButton
                    disabled = {!linkIsValid}
                    title="Copy link to clipboard"
                    onClick={() => toClipboard(currentLink)}>
                    <CopyIcon/>
                  </IconButton>
                  <IconButton
                    title="Delete invitation"
                    onClick={() => onDelete(inv)}>
                    <DeleteIcon/>
                  </IconButton>
                </div>
              }
              sx={{
                // make space for 3 buttons
                paddingRight:'9rem'
              }}
            >
              <ListItemText
                primary={`Created on ${new Date(inv.created_at).toLocaleString()} [${expiredText}]`}
                secondary={
                  usesText ?
                    <span className="font-medium leading-[2rem]">{usesText}</span>
                    :
                    <span>{currentLink}</span>
                }
              />
            </ListItem>
          )
        })}
      </List>
    </>
  )
}
