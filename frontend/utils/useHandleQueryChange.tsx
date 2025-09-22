// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useCallback} from 'react'
import {useRouter,usePathname,useSearchParams} from 'next/navigation'

import {encodeQueryValue} from './extractQueryParam'

/**
 * Generic hook to handle change in url params using next/navigation and URLSearchParams
 * @returns
 */
export default function useHandleQueryChange() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleQueryChange = useCallback((key: string, value: string | string[]) => {
    // start with existing searchParams
    const urlParams = new URLSearchParams(searchParams ?? '')
    // encode new param
    const encodedValue = encodeQueryValue(value)

    if (encodedValue){
      if (urlParams.has(key)){
        // update
        urlParams.set(key,encodedValue)
      }else{
        // append
        urlParams.append(key,encodedValue)
      }
    }else{
      // remove param if no value
      urlParams.delete(key)
    }

    // on each param change we reset page
    if (key !== 'page') {
      urlParams.set('page','1')
    }
    // construct url from pathname and urlParams
    // NOTE! pathname includes dynamic route value too
    const url = `${pathname}?${urlParams.toString()}`

    // on page change we scroll to top otherwise not
    router.push(url,{scroll: key === 'page'})

  }, [router,searchParams,pathname])

  return {
    handleQueryChange
  }
}
