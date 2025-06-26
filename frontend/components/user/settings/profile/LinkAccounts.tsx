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
import {useEffect, useState} from 'react'
import {getLoginProviders, Provider} from '~/auth/api/getLoginProviders'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

export default function LinkAccounts() {
  const {logins} = useUserContext()

  const [linkProviders, setLinkProviders] = useState<Provider[] | null>(null)

  useEffect(() => {
    getLoginProviders()
      .then(providers => setLinkProviders(providers))
  }, [])

  // console.group('LinkAccounts')
  // console.log('logins...',logins)
  // console.groupEnd()

  if (!linkProviders) {
    return null
  }

  return (
    <div>
      <h3>Link your accounts</h3>
      <List>

        {linkProviders.map(provider => {
          return (
            <ListItem key = {provider.openidProvider}>
              <LinkAccountBtn
                disabled = {findProviderSubInLogin(logins, provider.openidProvider) !== null}
                href = {provider.coupleUrl}
                label = {`Link my ${provider.name} account`}
              />
            </ListItem>
          )
        })}
      </List>
    </div>
  )
}
