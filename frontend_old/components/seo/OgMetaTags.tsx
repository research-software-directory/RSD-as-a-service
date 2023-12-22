// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'
import {app} from '../../config/app'
import {useCanonicalUrl} from './CanonicalUrl'

export default function OgMetaTags({title, description}:
  { title: string, description: string}) {
  const canonicalUrl = useCanonicalUrl()
  return (
    <Head>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content={app.title} />
    </Head>
  )
}
