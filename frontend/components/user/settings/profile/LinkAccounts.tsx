// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useUserContext} from '~/components/user/context/UserContext'
import LinkAccountBtn from './LinkAccountBtn'
import {findProviderSubInLogin} from './apiLoginForAccount'
import Stack from '@mui/material/Stack'
import useLoginProviders from '~/auth/api/useLoginProviders'


export default function LinkAccounts() {
  const {logins} = useUserContext()

  const {providers} = useLoginProviders()

  // console.group('LinkAccounts')
  // console.log('logins...',logins)
  // console.groupEnd()

  if (!providers || providers.length <= 1) {
    return null
  }

  return (
    <div>
      <h3 className="mb-4">Link your accounts</h3>
      <Stack
        spacing={2}
        sx={{
          padding:'0.5rem 0rem'
        }}
      >
        {providers.map(provider => {
          return (
            <LinkAccountBtn
              key = {provider.openidProvider}
              disabled = {findProviderSubInLogin(logins, provider.openidProvider) !== null}
              href = {provider.coupleUrl}
              label = {`${provider.name}`}
            />
          )
        })}
      </Stack>
    </div>
  )
}
