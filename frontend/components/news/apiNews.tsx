// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {getImageUrl} from '~/utils/editImage'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {paginationUrlParams} from '~/utils/postgrestUrl'

export type NewsImageProps={
  id:string,
  image_id: string,
  position: string
}

export type AddNewsItem={
  slug: string
  title: string
  publication_date: string
}

export type NewsListItemProps=AddNewsItem & {
  id: string
  publication_date: string
  author: string|null
  is_published: boolean
  summary: string | null
  image_for_news: NewsImageProps[]
  updated_at: string
}

export type NewsItem=NewsListItemProps & {
  description: string
}

export async function getNewsItemBySlug({date,slug,token}: {date:string,slug:string,token?:string}) {
  try {
    if (!slug || !date) return null

    // get news item, join with image_for_news
    const query = `slug=eq.${slug}&publication_date=eq.${date}&select=*,image_for_news(id,image_id,position)`
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
      // we should find 1 item
      if (json.length === 1){
        return json[0]
      }
      // item not found
      return null
    }
    logger(`getNewsItemBySlug failed: ${resp?.status} ${resp.statusText}`, 'error')
    return null

  } catch (e: any) {
    logger(`getNewsItemBySlug: ${e?.message}`, 'error')
    return null
  }
}

export async function getNewsImages({id,token}:{id:string,token?:string}){
  try{
    const url = `/api/v1/image_for_news?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    if (resp.status === 200) {
      const json: NewsImageProps[] = await resp.json()
      return json
    }
    logger(`getNewsImages failed: ${resp?.status} ${resp.statusText}`, 'error')
    return []
  }catch(e:any){
    logger(`getNewsImages failed ${e.message}`, 'error')
    return []
  }
}

export async function addNewsImage({id,image_id,token,position}:{id:string,image_id:string,token:string,position?:string}){
  try{
    const url = '/api/v1/image_for_news'
    const resp = await fetch(url, {
      body: JSON.stringify({
        news: id,
        image_id,
        position: position ?? 'card'
      }),
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=representation'
      },
      method: 'POST'
    })
    // check status
    if (resp.status===201){
      const images: NewsImageProps[] = await resp.json()
      return {
        status: 200,
        message: images[0]
      }
    }
    logger(`addNewsImage failed: ${resp?.status} ${resp.statusText}`, 'error')
    return {
      status: resp?.status ?? 400,
      message: resp.statusText
    }
  }catch(e:any){
    logger(`addNewsImage failed ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

/**
 * Delete specific news image by id
 * @param param0
 * @returns
 */
export async function deleteNewsImage({id,token}:{id:string,token:string}){
  try{
    const url = `/api/v1/image_for_news?id=eq.${id}`
    const resp = await fetch(url, {
      headers: {
        ...createJsonHeaders(token)
      },
      method: 'DELETE'
    })
    return extractReturnMessage(resp, '')
  }catch(e:any){
    logger(`deleteNewsImage failed ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

/**
 * Delete all news item images from image_for_news table
 * @param param0
 * @returns
 */
export async function deleteNewsImages({news_id,token}:{news_id:string,token:string}){
  try{
    const url = `/api/v1/image_for_news?news=eq.${news_id}`
    const resp = await fetch(url, {
      headers: {
        ...createJsonHeaders(token)
      },
      method: 'DELETE'
    })
    return extractReturnMessage(resp, '')
  }catch(e:any){
    logger(`deleteNewsImages failed ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

type GetNewsListProps={
  page: number
  rows: number
  is_published?: boolean,
  token?:string
  searchFor?: string|null
  orderBy?: string
}

export async function getNewsList({page,rows,is_published=true,token,searchFor,orderBy}: GetNewsListProps) {
  try {
    // use server side when available
    const select = 'id,slug,publication_date,author,is_published,title,summary,image_for_news(id,image_id,position)'
    // get published meta pages ordered by position
    let query = paginationUrlParams({rows, page})
    if (searchFor) {
      const encodedSearch = encodeURIComponent(searchFor)
      query+=`&or=(title.ilike."*${encodedSearch}*",summary.ilike."*${encodedSearch}*",author.ilike."*${encodedSearch}*")`
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
      const json:NewsListItemProps[] = await resp.json()
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


export async function validSlugNews({date, slug, token}: {date:string, slug: string, token: string}) {
  // use server side when available
  const baseUrl = getBaseUrl()
  // get published meta pages ordered by position
  const query = `news?select=slug,publication_date&slug=eq.${slug}&publication_date=eq.${date}`
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

export type TopNewsProps={
  id:string,
  slug: string,
  publication_date: string,
  title: string,
  summary: string|null
  image_id: string|null
}

export async function getTopNews(items:number) {
  try {
    // use server side when available
    const select = 'id,slug,publication_date,title,summary,is_published'
    // get top 4 published articles (newest at the top)
    const query = `${paginationUrlParams({rows:items, page:0})}&is_published=eq.true&order=publication_date.desc`
    const url = `${getBaseUrl()}/news?select=${select}&${query}`

    // get page
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders()
      }
    })

    if ([200,206].includes(resp.status)) {
      const json:TopNewsProps[] = await resp.json()
      return json
    }
    logger(`getTopNews failed: ${resp?.status} ${resp.statusText}`, 'error')
    return []
  } catch (e: any) {
    logger(`getTopNews: ${e?.message}`, 'error')
    return []
  }
}

export function getCardImageUrl(image_for_news:NewsImageProps[]){
  try{
    if (image_for_news?.length>0){
      // look for specified card image
      const cardImage = image_for_news.find(item=>item.position==='card')
      if (cardImage){
        return `${getImageUrl(cardImage.image_id) ?? null}`
      }
      // otherwise use first item
      return `${getImageUrl(image_for_news[0].image_id) ?? null}`
    }
    return null
  }catch(e:any){
    logger(`getCardImageUrl: ${e?.message}`, 'error')
    return null
  }
}
