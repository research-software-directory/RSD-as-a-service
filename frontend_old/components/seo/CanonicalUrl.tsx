// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'
import {useEffect, useState} from 'react'

export function useCanonicalUrl() {
  const [canonicalUrl,setCanonicalUrl] = useState<string>()
  useEffect(() => {
    if (typeof location != 'undefined') {
      setCanonicalUrl(location.href)
    }
  }, [])

  return canonicalUrl
}

export default function CanonicalUrl() {
  const canonicalUrl = useCanonicalUrl()

  if (typeof canonicalUrl === 'undefined') return null

  return (
    <Head>
      <link rel="canonical" href={canonicalUrl}/>
    </Head>
  )
}

