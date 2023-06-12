// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next'

import {getProjectsSitemap} from '~/components/seo/getProjectsSitemap'
import {getDomain} from '~/utils/getDomain'

export default function RobotsTxt() {
  // getServerSideProps will create response
}

export async function getServerSideProps(context:GetServerSidePropsContext) {
  // extract response object
  const {req,res} = context
  // extract domain info from request headers
  const domain = getDomain(req)
  // generate the XML sitemap for software
  const content = await getProjectsSitemap(domain)

  res.setHeader('Content-Type', 'text/xml; charset=UTF-8')

  // send XML to the browser
  res.write(content)
  res.end()

  return {
    props: {},
  }
}
