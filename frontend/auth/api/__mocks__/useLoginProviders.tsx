// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {Provider} from '../getLoginProviders'


export default function useLoginProviders() {
  const [providers, setProviders] = useState<Provider[]>([])

  useEffect(() => {
    let abort = false

    if (abort === false) {
      setProviders([{
        name: 'test provider',
        signInUrl: 'https://test-login-redirect.com',
        accessType: 'EVERYONE',
        openidProvider: 'local'
      }])
    }

    return () => { abort = true }
  }, [])

  return providers
}
