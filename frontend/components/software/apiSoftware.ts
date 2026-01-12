// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {RelatedProjectForSoftware} from '~/types/Project'
import {
  CategoriesForSoftware,
  CategoryForSoftwareIds,
  KeywordForSoftware,
  LicenseForSoftware,
  SoftwareOverviewItemProps,
  SoftwareTableItem
} from '~/types/SoftwareTypes'
import {CommunitiesOfSoftware} from '~/components/software/edit/communities/apiSoftwareCommunities'

/*
 * Software list for the software overview page
 * Note! url should contain all query params. Use softwareUrl helper fn to construct url.
 */
export async function getSoftwareList({url,token}:{url:string,token?:string}){
  try{
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        'Prefer':'count=exact'
      },
    })

    if ([200,206].includes(resp.status)){
      const json: SoftwareOverviewItemProps[] = await resp.json()
      // set
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        data: json
      }
    } else {
      logger(`getSoftwareList failed: ${resp.status} ${resp.statusText} ${url}`, 'warn')
      return {
        count:0,
        data:[]
      }
    }
  }catch(e:any){
    logger(`getSoftwareList: ${e?.message}`,'error')
    return {
      count:0,
      data:[]
    }
  }
}

// query for software item page based on slug
export async function getSoftwareItem({slug,token}:{slug:string|undefined, token?:string}){
  try {
    // console.log('token...', token)
    // this request is always performed from backend
    const url = `${getBaseUrl()}/software?slug=eq.${slug}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token),
    })
    if (resp.status === 200) {
      const data: SoftwareTableItem[] = await resp.json()
      return data[0]
    }
  }catch(e:any){
    logger(`getSoftwareItem: ${e?.message}`,'error')
  }
}

/**
 * CITATIONS
 * @param uuid as software_id
 * @returns SoftwareVersion[] | null
 */

export type SoftwareVersion = {
  doi: string,
  version: string,
  doi_registration_date: string
}

export async function getReleasesForSoftware(uuid:string,token?:string){
  try{
    // the releases are ordered by date descending
    const query = `select=release(mention(doi,version,doi_registration_date))&id=eq.${uuid}&release.mention.order=doi_registration_date.desc`
    const url = `${getBaseUrl()}/software?${query}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status===200){
      const data: any[] = await resp.json()
      if (data.length === 1 && data[0]?.release?.mention) {
        const releases: SoftwareVersion[] = data[0]['release']['mention']
        return releases
      }
      return null
    } else if (resp.status===404){
      logger(`getReleasesForSoftware: 404 [${url}]`,'error')
      // query not found
      return null
    }
    return null
  }catch(e:any){
    logger(`getReleasesForSoftware: ${e?.message}`,'error')
    return null
  }
}

export async function getKeywordsForSoftware(uuid:string,token?:string){
  try{
    // this request is always performed from backend
    // the content is order by tag ascending
    const query = `rpc/keywords_by_software?software=eq.${uuid}&order=keyword.asc`
    const url = `${getBaseUrl()}/${query}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status===200){
      const data:KeywordForSoftware[] = await resp.json()
      return data
    } else if (resp.status===404){
      logger(`getKeywordsForSoftware: 404 [${url}]`,'error')
      // query not found
      return null
    }
  }catch(e:any){
    logger(`getKeywordsForSoftware: ${e?.message}`,'error')
    return null
  }
}

function prepareQueryURL(path: string, params?: Record<string, string>) {
  let url = `${getBaseUrl()}${path}`
  if (params) {
    const paramStr = Object.keys(params).map((key) => `${key}=${encodeURIComponent(params[key])}`).join('&')
    if (paramStr) url += '?' + paramStr
  }
  return url
}

export async function getCategoriesForSoftware(software_id: string, token?: string){
  try {
    const url = prepareQueryURL('/rpc/category_paths_by_software_expanded', {software_id})
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const data:CategoriesForSoftware = await resp.json()
      return data
    } else {
      logger(`getCategoriesForSoftware: ${resp.status} - ${resp.statusText} [${url}]`, 'error')
      return []
    }
  } catch (e: any) {
    logger(`getCategoriesForSoftware: ${e?.message}`, 'error')
    return []
  }
}

export async function getCategoryForSoftwareIds(software_id: string, token?: string): Promise<CategoryForSoftwareIds> {
  try {
    const url = prepareQueryURL('/category_for_software', {software_id: `eq.${software_id}`, select: 'category_id'})
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const data = await resp.json()
      return new Set(data.map((entry: any) => entry.category_id))
    } else if (resp.status === 404) {
      logger(`getCategoriesForSoftwareIds: 404 [${url}]`, 'error')
      throw new Error('Couldn\'t find the categories for this software')
    } else {
      logger(`getCategoriesForSoftwareIds: ${resp.status} [${url}]`, 'error')
      throw new Error('Couldn\'t load the categories for this software')
    }
  } catch (e: any) {
    logger(`getCategoriesForSoftwareIds: ${e?.message}`, 'error')
    throw e
  }
}

export async function addCategoryToSoftware(softwareId: string, categoryId: string, token: string) {
  const url = prepareQueryURL('/category_for_software')
  const data = {software_id: softwareId, category_id: categoryId}

  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      ...createJsonHeaders(token),
    },
    body: JSON.stringify(data),
  })

  if (resp.ok) {
    return null
  }
  throw new Error(`API returned: ${resp.status} ${resp.statusText}`)
}

export async function deleteCategoryToSoftware(softwareId: string, categoryId: string, token: string) {
  const url = prepareQueryURL(`/category_for_software?software_id=eq.${softwareId}&category_id=eq.${categoryId}`)

  const resp = await fetch(url, {
    method: 'DELETE',
    headers: {
      ...createJsonHeaders(token),
    },
  })

  if (resp.ok) {
    return null
  }
  throw new Error(`API returned: ${resp.status} ${resp.statusText}`)
}

/**
 * LICENSE FOR SOFTWARE
*/
export async function getLicenseForSoftware(uuid:string,token?:string){
  try{
    // this request is always performed from backend
    // the content is order by license ascending
    const url = `${getBaseUrl()}/license_for_software?&software=eq.${uuid}&order=license.asc`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status===200){
      const data:LicenseForSoftware[] = await resp.json()
      return data
    } else if (resp.status===404){
      logger(`getLicenseForSoftware: 404 [${url}]`,'error')
      // query not found
      return []
    }
  }catch(e:any){
    logger(`getLicenseForSoftware: ${e?.message}`,'error')
    return []
  }
}

/**
 * REMOTE MARKDOWN FILE called server side
 */
export async function getRemoteMarkdown(url: string) {
  try {
    const resp = await fetch(url)

    if (resp?.status === 200) {
      const markdown = await resp.text()
      return markdown
    }
    if ([400,404].includes(resp.status)) {
      return ({
        status: resp.status,
        message: 'Markdown file not found. Validate url.'
      })
    } else {
      // create error
      return ({
        status: resp.status ?? 404,
        message: resp?.statusText ?? 'Markdown file not found.'
      })
    }
  } catch (e: any) {
    logger(`getRemoteMarkdown: ${e?.message}`, 'error')
    return {
      status: 404,
      message: 'Markdown file not found. Validate url.'
    }
  }
}

/**
 * Get remote markdown using RSD api.
 * Validates the url returns text/markdown and not html page.
 * If html page it returns suggested rawUrl for Github/Gitlab
 * @param url
 * @returns
 */
export async function apiRemoteMarkdown(url:string){
  try{
    const api = `/api/fe/markdown/raw?url=${encodeURI(url)}`
    const resp = await fetch(api)
    if (resp.ok){
      const data:{
        status:number,
        message:string,
        rawUrl?:string
      } = await resp.json()
      return data
    }else{
      return {
        status: resp.status,
        message: resp.statusText
      }
    }
  }catch(e:any){
    return {
      status:500,
      message: e?.message as string ?? 'Unknown server error'
    }
  }
}

// RELATED PROJECTS FOR SOFTWARE
export async function getRelatedProjectsForSoftware({software, token, approved=true}:
{software: string, token?: string, approved?:boolean}) {
  try {
    // construct api url based on request source
    let query = `rpc/related_projects_for_software?software_id=${software}&order=current_state.desc,date_start.desc,title.asc`
    if (approved) {
      // select only approved relations
      query +='&status=eq.approved&is_published=eq.true'
    }
    const url = `${getBaseUrl()}/${query}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const data: RelatedProjectForSoftware[] = await resp.json()
      return data
    }
    logger(`getRelatedProjects: ${resp.status} ${resp.statusText} [${url}]`, 'warn')
    // query not found
    return []
  } catch (e: any) {
    logger(`getRelatedProjects: ${e?.message}`, 'error')
    return []
  }
}

type GetCommunitiesOfSoftware={
  software:string
  token?:string
}

export async function getCommunitiesOfSoftware({software,token}:GetCommunitiesOfSoftware){
  try{
    const query = `software_id=${software}&status=eq.approved&order=software_cnt.desc.nullslast,name`
    const url = `${getBaseUrl()}/rpc/communities_of_software?${query}`

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      }
    })
    if (resp.ok){
      const json:CommunitiesOfSoftware[] = await resp.json()
      return json
    }
    logger(`getCommunitiesOfSoftware: ${resp.status}:${resp.statusText}`, 'warn')
    return []
  }catch(e:any){
    logger(`getCommunitiesOfSoftware: ${e?.message}`, 'error')
    return []
  }
}
