// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next'
import {getDomain} from '~/utils/getDomain'

export default function RobotsTxt() {
  // getServerSideProps will create response
}


async function generateRobotsFile(domain:string) {

  return `User-agent: *

Disallow: /admin/
Disallow: /auth/
Disallow: /invite/
Disallow: /login/
Disallow: /user/

Sitemap: ${domain}/sitemap/software.xml
Sitemap: ${domain}/sitemap/projects.xml
Sitemap: ${domain}/sitemap/organisations.xml
`
}

export async function getServerSideProps(context:GetServerSidePropsContext) {
  // We make an API call to gather the URLs for our site
  // const request = await fetch(EXTERNAL_DATA_URL)
  // const posts = await request.json()
  const {req, res} = context
  // use referer to extract the protocol
  // const protocol = req.headers['referer']?.split(':')[0]
  // console.log('getServerSideProps...req.headers...', req)
  // extract domain info from request headers
  const domain = getDomain(req)
  // We generate the XML sitemap with the posts data
  const content = await generateRobotsFile(domain)

  res.setHeader('Content-Type', 'text/plain; charset=UTF-8')
  res.setHeader('x-generator', 'custom-next-script')
  // we send the XML to the browser
  res.write(content)
  res.end()

  return {
    props: {},
  }
}
