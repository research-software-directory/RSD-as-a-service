// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState} from 'react'
import Alert from '@mui/material/Alert'

import InvitationList, {Invitation} from '~/components/maintainers/InvitationList'
import ContentLoader from '~/components/layout/ContentLoader'
import CreateRsdInvite from './CreateRsdInvite'
import {useRsdInvite} from './useRsdInvite'
import {NewAccountInvite} from './apiRsdInvite'

const extraLineGenerators: ((inv: Invitation) => string)[] = [inv => inv.id, inv => inv.comment ?? '']

export default function AdminRsdInvites() {
  const {loading,activeInvites,createInvite,deleteInvite} = useRsdInvite()
  // a11y feedback notifier state for dynamic list actions
  const [notification, setNotification] = useState('')


  if (loading) {
    return (
      <section className="flex-1 grid">
        <ContentLoader />
      </section>
    )
  }

  async function handleCreateInvitation(inv:NewAccountInvite) {
    try {
      setNotification('Generating new invitation link...')
      await createInvite(inv)
      setNotification('New invitation link successfully generated and added to the list below.')
    } catch {
      setNotification('Failed to generate invitation link. Please try again.')
    }
  }

  async function handleDeleteInvitation(inv: Invitation) {
    try {
      setNotification('Deleting invitation link...')
      await deleteInvite(inv)
      setNotification('Invitation link successfully deleted.')
    } catch {
      setNotification('Failed to delete invitation link.')
    }
  }

  return (
    <div className="flex-1 flex flex-col gap-8 xl:grid xl:grid-cols-[3fr_2fr]">
      <div className="order-2 xl:order-1">
        <h2 className="flex pr-4 pb-4 justify-between font-medium">
          <span>Invitations</span>
          <span>{activeInvites.length}</span>
        </h2>

        {
          activeInvites.length === 0 ?
            <div className="pt-4">
              <Alert severity="info">
                No invitations.
              </Alert>
            </div>
            :
            <InvitationList
              subject="Invite to register with RSD"
              body="You are welcome to join RSD! Click on the link below and login with your credentials to complete your registration."
              invitations={activeInvites}
              onDelete={handleDeleteInvitation}
              showTitle={false}
              extraLineGenerators={extraLineGenerators}
            />
        }
      </div>
      <section
        aria-label="Create new invitation"
        className="order-1 xl:order-2">
        {/* Visually hidden live region to catch both generation and deletion states */}
        <div
          role="status"
          aria-live="polite"
          className="sr-only absolute w-px h-px p-0 -m-px overflow-hidden clip whitespace-nowrap border-0"
        >
          {notification}
        </div>
        <CreateRsdInvite createInvite={handleCreateInvitation} />
      </section>
    </div>
  )
}
