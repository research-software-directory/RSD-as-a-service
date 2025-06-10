// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next'
import {getDomain} from '~/utils/getDomain'
import {getCommunitiesSitemap} from '~/components/seo/getCommunitiesSitemap'

export default function RobotsTxt() {
  // getServerSideProps will create response
}

export async function getServerSideProps(context:GetServerSidePropsContext) {
  // extract response object
  const {req,res} = context
  // extract domain info from request headers
  const domain = getDomain(req)

  // generate the XML sitemap for software
  const content = await getCommunitiesSitemap(domain)

  res.setHeader('Content-Type', 'text/xml; charset=UTF-8')

  // send XML to the browser
  res.write(content)
  res.end()

  return {
    props: {},
  }
}
