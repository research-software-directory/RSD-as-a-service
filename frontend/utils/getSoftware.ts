// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 - 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {KeywordForSoftware, RepositoryInfo, SoftwareItem, SoftwareListItem} from '../types/SoftwareTypes'
import {extractCountFromHeader} from './extractCountFromHeader'
import logger from './logger'
import {createJsonHeaders, getBaseUrl} from './fetchHelpers'
import {RelatedProjectForSoftware} from '~/types/Project'
import {SoftwareReleaseInfo} from '~/components/organisation/releases/useSoftwareReleases'

/*
 * Software list for the software overview page
 * Note! url should contain all query params. Use softwareUrl helper fn to construct url.
 */
export async function getSoftwareList({url,token}:{url:string,token?:string }){
  try{
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        'Prefer':'count=exact'
      },
    })

    if ([200,206].includes(resp.status)){
      const json: SoftwareListItem[] = await resp.json()
      // set
      return {
        count: extractCountFromHeader(resp.headers),
        data: json
      }
    } else{
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
export async function getSoftwareItem(slug:string|undefined, token?:string){
  try {
    // console.log('token...', token)
    // this request is always perfomed from backend
    const url = `${process.env.POSTGREST_URL}/software?select=*,repository_url!left(url)&slug=eq.${slug}`
    let resp
    if (token) {
      resp = await fetch(url, {
        method: 'GET',
        headers: createJsonHeaders(token)
      })
    } else {
      resp = await fetch(url,{method:'GET'})
    }
    if (resp.status===200){
      const data:SoftwareItem[] = await resp.json()
      return data[0]
    }
  }catch(e:any){
    logger(`getSoftwareItem: ${e?.message}`,'error')
  }
}

// query for software item page based on software id
export async function getRepostoryInfoForSoftware(software: string | undefined, token?: string) {
  try {
    // console.log('token...', token)
    // this request is always perfomed from backend
    const url = `${process.env.POSTGREST_URL}/repository_url?software=eq.${software}`
    let resp
    if (token) {
      resp = await fetch(url, {
        method: 'GET',
        headers: createJsonHeaders(token)
      })
    } else {
      resp = await fetch(url, {method: 'GET'})
    }

    if (resp.status === 200) {
      const data:any = await resp.json()
      if (data?.length === 1) {
        const info: RepositoryInfo = {
          ...data[0],
          // parse JSONB
          // languages: JSON.parse(data[0].languages),
          languages: data[0].languages,
          // commit_history: JSON.parse(data[0].commit_history)
          commit_history: data[0].commit_history
        }
        return info
      }
      return null
    }
  } catch (e: any) {
    logger(`getRepostoryInfoForSoftware: ${e?.message}`, 'error')
    return null
  }
}

// Get
export type TagItem={
  count: number
  tag:string
  active:boolean
}
export async function getTagsWithCount(){
  try {
    // TODO! tags are replaced with keywords
    const tags:TagItem[]=[]
    // this request is always perfomed from backend
    // const url = `${process.env.POSTGREST_URL}/rpc/keyword_count_for_software?order=keyword.asc`
    // const resp = await fetch(url,{method:'GET'})
    // if (resp.status===200){
    //   const data:TagItem[] = await resp.json()
    //   return data
    // } else if (resp.status===404){
    //   logger(`getTagsWithCount: 404 [${url}]`,'error')
    //   // query not found
    //   return []
    // }
    return tags
  }catch(e:any){
    logger(`getTagsWithCount: ${e?.message}`,'error')
    return []
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


export async function getKeywordsForSoftware(uuid:string,frontend?:boolean,token?:string){
  try{
    // this request is always perfomed from backend
    // the content is order by tag ascending
    const query = `rpc/keywords_by_software?software=eq.${uuid}&order=keyword.asc`
    let url = `${process.env.POSTGREST_URL}/${query}`
    if (frontend === true) {
      url = `/api/v1/${query}`
    }
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

/**
 * LICENSE
 */

export type License = {
  id:string
  software:string
  license: string
}

export async function getLicenseForSoftware(uuid:string,frontend?:boolean,token?:string){
  try{
    // this request is always perfomed from backend
    // the content is order by license ascending
    let url = `${process.env.POSTGREST_URL}/license_for_software?&software=eq.${uuid}&order=license.asc`
    if (frontend === true) {
      url = `/api/v1/license_for_software?&software=eq.${uuid}&order=license.asc`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status===200){
      const data:License[] = await resp.json()
      return data
    } else if (resp.status===404){
      logger(`getLicenseForSoftware: 404 [${url}]`,'error')
      // query not found
      return null
    }
  }catch(e:any){
    logger(`getLicenseForSoftware: ${e?.message}`,'error')
    return null
  }
}

/**
 * Contributors and mentions counts
 */

export type ContributorMentionCount = {
  id: string
  contributor_cnt: number | null
  mention_cnt: number | null
}

export async function getContributorMentionCount(uuid: string,token?: string){
  try{
    // this request is always perfomed from backend
    // the content is order by id ascending
    const url = `${process.env.POSTGREST_URL}/rpc/count_software_contributors_mentions?id=eq.${uuid}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status===200){
      const data: ContributorMentionCount[] = await resp.json()
      if (data.length > 0) {
        return data[0]
      }
      return null
    } else if (resp.status===404){
      logger(`getContributorMentionCount: 404 [${url}]`,'error')
      // query not found
      return null
    }
  }catch(e:any){
    logger(`getContributorMentionCount: ${e?.message}`,'error')
    return null
  }
}

/**
 * REMOTE MARKDOWN FILE
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
      message: e?.message
    }
  }
}

// RELATED PROJECTS FOR SORFTWARE
export async function getRelatedProjectsForSoftware({software, token, frontend, approved=true}:
  { software: string, token?: string, frontend?: boolean, approved?:boolean }) {
  try {
    // construct api url based on request source
    let query = `rpc/related_projects_for_software?software_id=${software}&order=current_state.desc,date_start.desc,title.asc`
    if (approved) {
      // select only approved relations
      query +='&status=eq.approved&is_published=eq.true'
    }
    let url = `${process.env.POSTGREST_URL}/${query}`
    if (frontend) {
      url = `/api/v1/${query}`
    }
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
