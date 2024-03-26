// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {paginationUrlParams} from '~/utils/postgrestUrl'

export type AddNewsItem={
  slug: string
  title: string
  publication_date: string
}

export type NewsListItem=AddNewsItem & {
  id: string
  publication_date: string
  author: string|null
  is_published: boolean
  summary: string | null
  image_id: string | null
  updated_at: string
}

export type NewsItem=NewsListItem & {
  description: string
}

export type EditNewsItem=NewsItem & {
  image_b64?: string | null
  image_mime_type?: string | null
}

export async function getNewsItemBySlug({date,slug,token}: {date:string,slug:string,token?:string}) {
  try {
    if (!slug) return null

    // get news item
    let query = `slug=eq.${slug}&publication_date=eq.${date}`
    const url = `${getBaseUrl()}/news?${query}`

    // get page
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      }
    })

    if (resp.status === 200) {
      const json:NewsItem[] = await resp.json()
      return json[0]
    }
    logger(`getNewsItemBySlug failed: ${resp?.status} ${resp.statusText}`, 'error')
    return null

  } catch (e: any) {
    logger(`getNewsItemBySlug: ${e?.message}`, 'error')
    return null
  }
}

type GetNewsListProps={
  page: number
  rows: number
  is_published?: boolean,
  token?:string
  searchFor?: string
  orderBy?: string
}

export async function getNewsList({page,rows,is_published=true,token,searchFor,orderBy}: GetNewsListProps) {
  try {
    // use server side when available
    const select = 'id,slug,publication_date,author,is_published,title,summary,image_id'
    // get published meta pages ordered by position
    let query = paginationUrlParams({rows, page})
    if (searchFor) {
      query+=`&or=(title.ilike.*${searchFor}*,summary.ilike.*${searchFor}*,author.ilike.*${searchFor}*)`
    }
    if (orderBy) {
      query+=`&order=${orderBy}`
    } else {
      query+='&order=publication_date.desc'
    }
    if (is_published) {
      query += '&is_published=eq.true'
    }
    const url = `${getBaseUrl()}/news?select=${select}&${query}`

    // get page
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer': 'count=exact'
      }
    })

    if ([200,206].includes(resp.status)) {
      const json:NewsListItem[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        news: json
      }
    }
    logger(`getNewsList failed: ${resp?.status} ${resp.statusText}`, 'error')
    return {
      count: 0,
      news:[]
    }
  } catch (e: any) {
    logger(`getNewsList: ${e?.message}`, 'error')
    return {
      count: 0,
      news:[]
    }
  }
}

export async function addNewsItem({page,token}:{page:AddNewsItem,token:string}) {
  try {
    const query = 'news'
    const url = `/api/v1/${query}`

    const resp = await fetch(url,{
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(page)
    })
    if (resp.status === 201) {
      const json = await resp.json()
      // return created page
      return {
        status: 200,
        message: json[0]
      }
    } else {
      return extractReturnMessage(resp, '')
    }
  } catch (e: any) {
    logger(`addNewsItem: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}


export async function validSlugNews({date, slug, token}: {date:string, slug: string, token: string }) {
  // use server side when available
  const baseUrl = getBaseUrl()
  // get published meta pages ordered by position
  let query = `news?select=slug,publication_date&slug=eq.${slug}&publication_date=eq.${date}`
  const url = `${baseUrl}/${query}`

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

type PatchNewsProps = {
  slug?: string
  title?: string
  publication_date?: string
  author?: string|null
  is_published?: boolean
  subtitle?: string | null
  image_id?: string | null
  updated_at?: string
  description?: string
}

type PatchNewsTableProps={
  id: string,
  data: PatchNewsProps,
  token: string
}

export async function patchNewsTable({id,data,token}:PatchNewsTableProps) {
  try {
    const url = `/api/v1/news?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify(data)
    })

    // debugger
    return extractReturnMessage(resp, id)
  } catch (e: any) {
    logger(`patchNewsTable failed ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function deleteNewsItem({id,token}:{id:string,token:string}){
  try{
    const url = `/api/v1/news?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    // debugger
    return extractReturnMessage(resp, id)
  }catch(e:any){
    logger(`deleteNewsItem failed ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}
