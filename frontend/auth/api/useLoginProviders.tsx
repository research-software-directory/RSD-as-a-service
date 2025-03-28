// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {Provider} from 'pages/api/fe/auth'
import {getLoginProviders} from './getLoginProviders'

export default function useLoginProviders() {
  const [providers, setProviders] = useState<Provider[]>([])

  // console.group('useLoginProviders')
  // console.log('providers...', providers)
  // console.groupEnd()

  useEffect(() => {
    let abort = false

    getLoginProviders()
      .then(providers=>{
        if (abort) return
        setProviders(providers)
      })
      .catch(()=>setProviders([]))

    return () => { abort = true }
  }, [])

  return providers
}
