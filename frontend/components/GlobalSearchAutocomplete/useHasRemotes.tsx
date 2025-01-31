// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {getRemoteRsd} from '~/components/admin/remote-rsd/apiRemoteRsd'

export function useHasRemotes() {
  const [hasRemotes, setHasRemotes] = useState(false)

  useEffect(()=>{
    getRemoteRsd({page:0, rows:1})
      .then(({count})=>{
        setHasRemotes(count > 0)
      })
  },[])

  return {
    hasRemotes
  }
}
