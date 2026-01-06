// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {RsdLink} from '~/config/rsdSettingsReducer'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

export type MarkdownPage = {
  id?: string
  slug?: string
  title?: string
  description?: string
  is_published?: boolean
  position?: number
}

type UseMarkdownpageProps = {
  slug?: string,
  is_published?: boolean
  token?: string
}

export async function ssrMarkdownPage(slug?: string) {
  // 404 if no slug
  if (!slug) {
    // 404 if no page returned
    return {
      notFound: true,
    }
  }
  // get about page if exists and is published
  const {page} = await getMarkdownPage({
    slug,
    is_published: true
  })
  if (page === null) {
    // 404 if no page returned
    return {
      notFound: true,
    }
  }
  const underConstuction = '![construction](https://media.giphy.com/media/BQvGzMlkwaCNq/giphy.gif)'
  // passed as props to page
  // if no content we shown under counstruction animated gif
  return {
    props: {
      title: page?.title,
      markdown: page.description ?? underConstuction
    },
  }
}

export async function getMarkdownPage(props:UseMarkdownpageProps) {
  try {
    const {slug, token, is_published} = props
    // use server side when available
    const baseUrl = getBaseUrl()
    // construct query string
    let query = `meta_page?slug=eq.${slug}`
    if (is_published) {
      // only published
      query+='&is_published=eq.true'
    }
    // construct complete url
    const url = `${baseUrl}/${query}`
    // get page
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        'Accept': 'application/vnd.pgrst.object + json',
      }
    })
    if (resp.status === 200) {
      const json:MarkdownPage = await resp.json()
      return {
        page: json,
        error: null
      }
    } else if ([404, 406].includes(resp.status) === true) {
      // page not found
      return {
        page: null,
        error: `${resp?.status} ${resp.statusText}`
      }
    }
    // log error
    logger(`fetchMarkdownPage failed: ${resp?.status} ${resp.statusText}`, 'warn')
    return {
      page: null,
      error: `${resp?.status} ${resp.statusText}`
    }
  } catch (e:any) {
    logger(`fetchMarkdownPage: ${e?.message}`, 'error')
    return {
      page: null,
      error: e?.message
    }
  }
}

export async function getPageLinks({is_published = true,token}: {is_published?: boolean,token?:string}) {
  try {
    // use server side when available
    const baseUrl = getBaseUrl()
    // get published meta pages ordered by position
    let query = 'meta_page?select=id,slug,title,position,is_published&order=position'
    if (is_published) {
      query += '&is_published=eq.true'
    }
    const url = `${baseUrl}/${query}`

    // get page
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      }
    })

    if (resp.status === 200) {
      const json:RsdLink[] = await resp.json()
      return json
    }
    logger(`getPageLinks failed: ${resp?.status} ${resp.statusText}`, 'error')
    return []

  } catch (e: any) {
    logger(`getPageLinks: ${e?.message}`, 'error')
    return []
  }
}

export async function validPageSlug({slug, token}: {slug: string, token: string}) {
  // get published meta pages ordered by position
  const query = `meta_page?select=slug,is_published&slug=eq.${slug}`
  const url = `${getBaseUrl()}/${query}`

  // get page
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      ...createJsonHeaders(token)
    }
  })

  if (resp.status === 200) {
    const json: [] = await resp.json()
    return json.length > 0
  }
  return false
}

