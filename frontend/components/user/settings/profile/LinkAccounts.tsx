// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useUserContext} from '~/components/user/context/UserContext'
import LinkAccountBtn from './LinkAccountBtn'
import {findProviderSubInLogin} from './apiLoginForAccount'

export default function LinkAccounts() {
  const {logins,orcidAuthLink,linkedInAuthLink} = useUserContext()
  const orcid = findProviderSubInLogin(logins,'orcid')
  const linkedIn = findProviderSubInLogin(logins,'linkedin')

  // console.group('LinkAccounts')
  // console.log('orcidAuthLink...', orcidAuthLink)
  // console.log('linkedInAuthLink...', linkedInAuthLink)
  // console.log('orcid...',orcid)
  // console.log('linkedIn...',linkedIn)
  // console.log('logins...',logins)
  // console.groupEnd()

  if (orcidAuthLink || linkedIn){
    return (
      <div>
        <h3>Link your accounts</h3>
        <div className="flex gap-8 py-8">
          {orcidAuthLink ?
            <LinkAccountBtn
              disabled={orcid!==null}
              href={orcidAuthLink}
              label='Link my ORCID'
            />
            : null
          }
          {linkedInAuthLink ?
            <LinkAccountBtn
              disabled={linkedIn!==null}
              href={linkedInAuthLink}
              label='Link my LinkedIn'
            />
            : null
          }
        </div>
      </div>
    )
  }
  // omit link section if no ORCID
  return null
}
