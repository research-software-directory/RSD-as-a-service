// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next'
import {getActiveModuleNames} from '~/config/getSettingsServerSide'
import {RsdModuleName} from '~/config/rsdSettingsReducer'
import {getDomain} from '~/utils/getDomain'

export default function RobotsTxt() {
  // getServerSideProps will create response
}


async function generateRobotsFile(domain:string, modules: RsdModuleName[]) {
  // base body
  let robots = `User-agent: *

Disallow: /admin/
Disallow: /auth/
Disallow: /invite/
Disallow: /login/
Disallow: /user/
`
  // conditional bodu based on enabled modules
  if (modules.includes('software')){
    robots+= `
Sitemap: ${domain}/sitemap/software.xml`
  }

  if (modules.includes('projects')){
    robots+= `
Sitemap: ${domain}/sitemap/projects.xml`
  }

  if (modules.includes('organisations')){
    robots+= `
Sitemap: ${domain}/sitemap/organisations.xml`
  }

  if (modules.includes('communities')){
    robots+= `
Sitemap: ${domain}/sitemap/communities.xml`
  }

  if (modules.includes('persons')){
    robots+= `
Sitemap: ${domain}/sitemap/persons.xml`
  }

  if (modules.includes('news')){
    robots+= `
Sitemap: ${domain}/sitemap/news.xml`
  }

  return robots
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
  const activeModules = await getActiveModuleNames()
  // We generate the XML sitemap with the posts data
  const content = await generateRobotsFile(domain,activeModules)

  res.setHeader('Content-Type', 'text/plain; charset=UTF-8')
  res.setHeader('x-generator', 'custom-next-script')
  // we send the XML to the browser
  res.write(content)
  res.end()

  return {
    props: {},
  }
}
