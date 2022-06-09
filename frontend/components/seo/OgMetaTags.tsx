// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'
import {app} from '../../config/app'

export default function OgMetaTags({title, description, url}:
  { title:string,description:string,url:string }) {
  return (
    <Head>
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content={app.title} />
    </Head>
  )
}
