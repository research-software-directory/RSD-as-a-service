// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import Alert from '@mui/material/Alert'

import InvitationList, {Invitation} from '~/components/maintainers/InvitationList'
import ContentLoader from '~/components/layout/ContentLoader'
import CreateRsdInvite from './CreateRsdInvite'
import {useRsdInvite} from './useRsdInvite'

const extraLineGenerators: ((inv: Invitation) => string)[] = [inv => inv.id, inv => inv.comment ?? '']

export default function AdminRsdInvites() {
  const {loading,activeInvites,createInvite,deleteInvite} = useRsdInvite()

  if (loading) {
    return (
      <section className="flex-1 grid">
        <ContentLoader />
      </section>
    )
  }

  return (
    <section className="flex-1 flex flex-col gap-8 xl:grid xl:grid-cols-[3fr_2fr]">
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
              onDelete={deleteInvite}
              showTitle={false}
              extraLineGenerators={extraLineGenerators}
            />
        }
      </div>
      <div className="order-1 xl:order-2">
        <CreateRsdInvite createInvite={createInvite} />
      </div>
    </section>
  )
}
