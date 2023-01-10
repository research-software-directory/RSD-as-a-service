// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {Provider} from 'pages/api/fe/auth'

export default function useLoginProviders() {
  const [providers, setProviders] = useState<Provider[]>([])

  useEffect(() => {
    let abort = false

    if (abort === false) {
      setProviders([{
        name: 'test provider',
        redirectUrl: 'https://test-login-redirect.com'
      }])
    }

    return () => { abort = true }
  }, [])

  return providers
}
