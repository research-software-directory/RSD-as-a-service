// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Alert from '@mui/material/Alert'

import InvitationList from '~/components/maintainers/InvitationList'
import ContentLoader from '~/components/layout/ContentLoader'
import CreateRsdInvite from './CreateRsdInvite'
import {useRsdInvite} from './useRsdInvite'

export default function RsdInvites() {
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
            />
        }
      </div>
      <div className="order-1 xl:order-2">
        <CreateRsdInvite createInvite={createInvite} />
      </div>
    </section>
  )
}
