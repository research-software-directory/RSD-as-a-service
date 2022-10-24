// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Button from '@mui/material/Button'
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh'
import EmailIcon from '@mui/icons-material/Email'
import CopyIcon from '@mui/icons-material/ContentCopy'

import {copyToClipboard,canCopyToClipboard} from '~/utils/copyToClipboard'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {organisationMaintainerLink} from './useOrganisationMaintainers'
import InvitationList from '~/components/layout/InvitationList'
import {Invitation} from '~/types/Invitation'
import {getUnusedInvitations} from '~/utils/getUnusedInvitations'

export default function OrganisationMaintainerLink({organisation, name, account, token}:
  {organisation: string, name: string, account: string, token: string}) {
  const {showErrorMessage,showInfoMessage} = useSnackbar()
  const [magicLink, setMagicLink] = useState(null)
  const [unusedInvitations, setUnusedInvitations] = useState<Invitation[]>([])
  const canCopy = useState(canCopyToClipboard())

  async function fetchUnusedInvitations() {
    setUnusedInvitations(await getUnusedInvitations('organisation', organisation, token))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {fetchUnusedInvitations()}, [])

  async function createInviteLink() {
    const resp = await organisationMaintainerLink({
      organisation,
      account,
      token
    })
    if (resp.status === 201) {
      setMagicLink(resp.message)
      fetchUnusedInvitations()
    } else {
      showErrorMessage(`Failed to generate maintainer link. ${resp.message}`)
    }
  }

  async function toClipboard() {
    if (magicLink) {
      // copy doi to clipboard
      const copied = await copyToClipboard(magicLink)
      // notify user about copy action
      if (copied) {
        showInfoMessage('Copied to clipboard')
      } else {
        showErrorMessage(`Failed to copy link ${magicLink}`)
      }
    }
  }

  function renderLinkOptions() {
    if (magicLink) {
      return (
        <div>
          <p>{magicLink}</p>
          <div className="py-4 flex justify-between">
            <Button
              disabled={!canCopy}
              startIcon={<CopyIcon />}
              onClick={toClipboard}
              sx={{
                marginRight:'1rem'
              }}
            >
              Copy to clipboard
            </Button>

            <Button
              startIcon={<EmailIcon />}
            >
            <a
              target="_blank"
              href={`mailto:?subject=Maintainer invite for organisation ${encodeURIComponent(name)}&body=Please use the following link to become a maintainer of the organisation ${encodeURIComponent(name)}. ${encodeURIComponent('\n')}${magicLink}`} rel="noreferrer">
              Email this invite
            </a>
            </Button>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <>
    <Button
      sx={{
        marginTop: '2rem',
        display: 'flex',
        alignItems: 'center'
      }}
      startIcon={<AutoFixHighIcon />}
      onClick={createInviteLink}
    >
      Generate invite link
    </Button>
    <div className="py-2"></div>
    {renderLinkOptions()}
    <InvitationList invitations={unusedInvitations} token={token} onDeleteCallback={() => fetchUnusedInvitations()}/>
    </>
  )
}
