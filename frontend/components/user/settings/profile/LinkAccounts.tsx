// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useUserContext} from '~/components/user/context/UserContext'
import LinkOrcidButton from './LinkOrcidButton'
import {findOrcidInLogin} from './apiLoginForAccount'

export default function LinkAccounts() {
  const {logins,orcidAuthLink} = useUserContext()
  const orcid = findOrcidInLogin(logins)

  // console.group('LinkOrcidButton')
  // console.log('orcidAuthLink...', orcidAuthLink)
  // console.log('orcid...',orcid)
  // console.log('logins...',logins)
  // console.groupEnd()

  if (orcidAuthLink){
    return (
      <div>
        <h3>Link your accounts</h3>
        <div className="flex gap-8 py-8">
          <LinkOrcidButton
            disabled={orcid!==null}
            href={orcidAuthLink}
          />
        </div>
      </div>
    )
  }
  // omit link section if no ORCID
  return null
}
