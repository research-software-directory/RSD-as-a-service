// SPDX-FileCopyrightText: 2022 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
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
import {Fragment} from 'react'

export type InvitationType = 'software' | 'project' | 'organisation' | 'community' | 'rsd'

export type Invitation = {
  id: string,
  created_at: string,
  expires_at: string,
  type: InvitationType,
  uses_left?: number | null,
  comment?: string | null
}

type InvitationListProps=Readonly<{
  subject: string
  body: string
  invitations: Invitation[],
  onDelete: (invitation:Invitation)=>Promise<void>
  showTitle?: boolean,
  extraLineGenerators?: ((invitation: Invitation) => string)[]
}>

function getInviteText(invite: Invitation): {expiredText: string, usesLeftText: string | null, linkIsValid: boolean} {
  if (invite.uses_left !== undefined && invite.uses_left !== null && invite.uses_left <= 0) {
    return {
      expiredText: 'EXPIRED!',
      usesLeftText: 'Registration limit reached',
      linkIsValid: false
    }
  }

  let usesLeftText: string | null = null
  if (invite.uses_left !== undefined) {
    if (invite.uses_left === null) {
      usesLeftText = 'Unlimited number of registrations left'
    } else if (invite.uses_left === 1) {
      usesLeftText = '1 registration left'
    } else {
      usesLeftText = `${invite.uses_left} registrations left`
    }
  }

  const expiresAt = new Date(invite.expires_at)
  const daysValid = Math.ceil((expiresAt.valueOf() - new Date().valueOf()) / (1000 * 60 * 60 * 24))

  const linkIsValid: boolean = daysValid > 0

  let expiredText: string
  if (daysValid <= 0) {
    expiredText = 'EXPIRED!'
  } else if (daysValid === 1) {
    expiredText = 'expires in less than a day'
  } else {
    expiredText = `expires in ${daysValid} days`
  }

  return {
    expiredText,
    usesLeftText,
    linkIsValid
  }
}

function ExtraSecondaryLines({invitation, extraLineGenerators}: Readonly<{invitation: Invitation, extraLineGenerators: ((invitation: Invitation) => string)[]}>) {
  if (extraLineGenerators.length === 0) {
    return null
  }

  const lines: string[] = []
  for (const extraLineGenerator of extraLineGenerators) {
    const generatedLineTrimmed: string = extraLineGenerator(invitation).trim()
    if (generatedLineTrimmed.length > 0) {
      lines.push(generatedLineTrimmed)
    }
  }

  return lines.map(line => <Fragment key={line}><br/>{line}</Fragment>)
}

export default function InvitationList({
  subject,body,invitations,onDelete,showTitle=true,extraLineGenerators=[]
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
          const {expiredText, usesLeftText, linkIsValid} = getInviteText(inv)

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
                  <>
                    {usesLeftText ?
                      <span className="font-medium leading-[2rem]">{usesLeftText}</span>
                      :
                      <span>{currentLink}</span>}
                    <ExtraSecondaryLines invitation={inv} extraLineGenerators={extraLineGenerators}/>
                  </>
                }
              />
            </ListItem>
          )
        })}
      </List>
    </>
  )
}
