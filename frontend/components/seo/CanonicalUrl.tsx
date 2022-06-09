// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'

export default function CanoncialUrl({canonicalUrl}:{canonicalUrl: string }) {
  return (
    <Head>
      <link rel="canonical" href={canonicalUrl}/>
    </Head>
  )
}
