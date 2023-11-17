// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {RsdAccount} from './useRsdAccounts'

export default function RsdLoginForAccount({logins}:{logins:RsdAccount[]}) {
  return (
    <ul className="text-sm">
      {logins.map(login => {
        const {id, name, email, home_organisation, provider} = login
        return (
          <li key={id}>
            {name ? name : 'Name missing'}{email ? `, ${email}`:', Email missing'}{home_organisation ? `, ${home_organisation}`:', Affiliation missing'} {provider ? `, ${provider}`:', Provider missing'}
          </li>
        )
      })}
    </ul>
  )
}
