// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, extractErrorMessages, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {repositorySettings} from './config'

export type CodePlatform = keyof typeof repositorySettings

export type ProgrammingLanguages = {
  [key: string]: number
}

export type CommitHistory = {
  [key: string]: number
}

export type RepositoryUrl = {
  id: string | null
  url: string | null,
  // enum based on db enum defined as
  // platform_type in 005-create-relations-for-software.sql
  code_platform: CodePlatform | null,
  scraping_disabled_reason: string | null
  archived?: boolean,
  // options fields used to reset values on update
  // these are filled by scrapers
  license?: string | null,
  star_count?: number | null,
  fork_count?: number | null,
  open_issue_count?: number | null,
  basic_data_last_error?: string | null,
  basic_data_scraped_at?: string | null,
  languages?: ProgrammingLanguages,
  languages_last_error?: string | null,
  languages_scraped_at?: string | null,
  commit_history?: CommitHistory | null,
  commit_history_last_error?: string | null,
  commit_history_scraped_at?: string | null,
  contributor_count?: number | null,
  contributor_count_last_error?: string | null,
  contributor_count_scraped_at?: string | null
}

export type RepositoryForSoftware = RepositoryUrl & {
  // id: string|null,
  software: string,
  position: number | null
}
// Just a props needed for editing
export type EditRepositoryProps={
  position: number
  id: string | null
  url: string | null
  code_platform: CodePlatform | null
  scraping_disabled_reason: string | null
}

// query for software item page based on software id
export async function getRepositoryInfoForSoftware(software: string | undefined, token?: string) {
  try {
    // console.log('token...', token)
    // this request is always performed from backend
    const url = `${getBaseUrl()}/rpc/repository_by_software?software_id=${software}&order=position,url`

    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      }
    })

    if (resp.status === 200) {
      const data:RepositoryForSoftware[] = await resp.json()
      return data
    }
    return []
  } catch (e: any) {
    logger(`getRepositoryInfoForSoftware: ${e?.message}`, 'error')
    return []
  }
}

export async function getSoftwareRepositoryByUrl(repo:string,token?:string){
  try{
    const query = `url=eq.${encodeURIComponent(repo)}&select=id,url,code_platform`
    const url = `${getBaseUrl()}/repository_url?${query}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token)
      }
    })

    if (resp.ok){
      const data = await resp.json()
      if (data.length>0){
        return {
          id: data[0].id as string,
          code_platform: data[0].code_platform as CodePlatform
        }
      }
      return {
        id: null,
        code_platform: null
      }
    }
    return {
      id: null,
      code_platform: null
    }
  }catch(e:any){
    logger(`getSoftwareRepositoryByUrl: ${e?.message}`, 'error')
    return {
      id: null,
      code_platform: null
    }
  }
}

export async function addSoftwareRepository({software, position, data, token}:
{software: string,position: number,data: EditRepositoryProps, token: string}) {
  try {
    // check if repo url already exists
    // let {id:repository_url} = await getSoftwareRepositoryByUrl(data?.url ?? '',token)
    const baseUrl = getBaseUrl()
    // if id is present than repository is already in collection
    if (data.id === null){
      // add new repository
      const url = `${baseUrl}/repository_url`
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          ...createJsonHeaders(token),
          // return record to extract id
          'Prefer': 'return=representation',
        },
        // url and code_platform are sufficient to create new entry
        body: JSON.stringify({
          url: data.url,
          code_platform: data.code_platform
        })
      })
      // debugger
      if (resp.ok){
        const repo:RepositoryForSoftware[] = await resp.json()
        if (repo.length>0){
          data.id = repo[0].id
        }
      }else{
        return extractReturnMessage(resp, software ?? '')
      }
    }
    // register repository for the software
    const url = `${baseUrl}/repository_url_for_software`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify({
        repository_url: data.id,
        software,
        position
      })
    })

    return extractReturnMessage(resp, software ?? '')

  } catch (e: any) {
    logger(`addSoftwareRepository: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteSoftwareRepository({software,repository_url,token}:
{software: string, repository_url:string, token: string}) {
  try {
    // DELETE from software repo table
    const query = `software=eq.${software}&repository_url=eq.${repository_url}`
    let url = `${getBaseUrl()}/repository_url_for_software?${query}`

    let resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })

    if (resp.ok){
      // DELETE from repository table
      url = `/api/v1/repository_url?id=eq.${repository_url}`
      resp = await fetch(url, {
        method: 'DELETE',
        headers: {
          ...createJsonHeaders(token)
        }
      })
      // conflict due to key reference is ignored
      if (resp.status===409){
        return {
          status:200,
          message:'OK'
        }
      }
      return extractReturnMessage(resp, software ?? '')
    }else{
      return extractReturnMessage(resp, software ?? '')
    }
  } catch (e: any) {
    logger(`deleteFromRepositoryTable: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function patchRepositoryForSoftware({software,repository_url,key, value, token}:
{software: string, repository_url:string, key: string, value: any, token: string}) {
  try {
    const query = `software=eq.${software}&repository_url=eq.${repository_url}`
    const url = `${getBaseUrl()}/repository_url_for_software?${query}`

    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
      },
      // just update position!
      body: JSON.stringify({
        [key]: value
      })
    })
    // extract errors
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`patchRepositoryForSoftware failed. ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function saveRepositoryPositions({items,token}:{items:RepositoryForSoftware[],token:string}){
  try {
    // create all requests
    const requests = items.map(item => {
      return patchRepositoryForSoftware({
        software: item.software,
        repository_url: item.id ?? '',
        key: 'position',
        value: item.position,
        token
      })
    })
    // execute them in parallel
    const responses = await Promise.all(requests)
    // check for errors
    const errors = extractErrorMessages(responses)
    if (errors.length > 0) {
      return errors[0]
    }
    // if no errors it's OK
    return {
      status: 200,
      message: 'OK'
    }
  }catch (e: any) {
    logger(`saveRepositoryPositions failed. ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function suggestPlatform(repositoryUrl: string | null){
  // console.log('repositoryUrl...',repositoryUrl)
  if (repositoryUrl === null) return {
    key: null,
    lock: true
  }

  if (repositoryUrl?.includes('github.')) {
    return {
      key:'github',
      lock: true
    }
  }
  if (repositoryUrl?.includes('gitlab.')) {
    return {
      key:'gitlab',
      lock:true
    }
  }
  if (repositoryUrl?.includes('bitbucket.')) {
    return {
      key: 'bitbucket',
      lock:true
    }
  }
  if (repositoryUrl?.includes('data.4tu.nl')) {
    return {
      key:'4tu',
      lock: true
    }
  }
  if (repositoryUrl?.includes('codeberg.org')) {
    return {
      key:'codeberg',
      lock: true
    }
  }

  try {
    const repositoryUrlDomain = new URL(repositoryUrl)
    const url = `${getBaseUrl()}/rpc/suggest_platform`
    const resp = await fetch(url,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({hostname: repositoryUrlDomain.host})
      })
    if (resp.status === 200) {
      const platform_type = await resp.json()
      return {
        key: platform_type,
        lock: false
      }
    }
    logger(`suggestPlatform: ${resp.status} ${resp.statusText}`, 'warn')
    return {
      key: null,
      lock: false
    }
  } catch (e: any) {
    logger(`suggestPlatform: ${e?.message}`, 'error')
    return {
      key: null,
      lock: false
    }
  }
}

export type PatchRepositoryUrlProps={
  id: string,
  token:string,
  data: Partial<RepositoryUrl>
}

export async function patchRepositoryUrl({id, token, data}:PatchRepositoryUrlProps){
  try {
    const query = `repository_url?id=eq.${id}`
    const url = `${getBaseUrl()}/${query}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`patchRepositoryUrl: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
