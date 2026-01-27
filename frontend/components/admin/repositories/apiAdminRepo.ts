// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {BasicApiParams, paginationUrlParams} from '~/utils/postgrestUrl'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {RepositoryUrl} from '~/components/software/edit/repositories/apiRepositories'


export async function getRepositoryUrl({page,rows,searchFor,orderBy,token}:BasicApiParams){
  try{
    let query = '/repository_url?'
    if (orderBy){
      // disabled repos first
      query+=`order=${orderBy}`
    }else{
      // disabled repos first
      query+='order=scraping_disabled_reason.nullslast,url'
    }

    if (searchFor){
      const encodedSearch = encodeURIComponent(searchFor)
      query+=`&or=(url.ilike."*${encodedSearch}*",scraping_disabled_reason.ilike."*${encodedSearch}*")`
    }
    // add paginations params
    query+=paginationUrlParams({rows,page})

    const url = `${getBaseUrl()}${query}`
    // console.log('url...',url)
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer': 'count=exact'
      }
    })

    if (resp.ok) {
      const repositories:RepositoryUrl[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        repositories
      }
    }

    logger(`getRepositoryUrl: ${resp.status} ${resp.statusText}`,'warn')

    return {
      count:0,
      repositories:[]
    }
  }catch(e:any){
    logger(`getRepositoryUrl: ${e.message}`, 'error')
    return {
      count:0,
      repositories:[]
    }
  }
}

export async function patchRepositoryTable({id,data,token}:
{id:string,data:Partial<RepositoryUrl>,token:string}
){
  try {
    // add new repository
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/repository_url?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp, id)
  } catch (e: any) {
    logger(`patchRepositoryTable: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteRepository(id:string,token:string){
  try{
    // delete first all references in software table
    const query = `repository_url=eq.${id}`
    const url = `${getBaseUrl()}/repository_url_for_software?${query}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token),
      }
    })
    if (resp.ok){
      // now remove repository_url entry
      const query = `id=eq.${id}`
      const url = `${getBaseUrl()}/repository_url?${query}`
      const resp = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...createJsonHeaders(token),
        }
      })
      // extract errors
      return extractReturnMessage(resp)
    }
    // extract errors
    return extractReturnMessage(resp)
  }catch(e:any){
    logger(`deleteRepository: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
