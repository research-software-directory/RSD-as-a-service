// SPDX-FileCopyrightText: 2023 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractErrorMessages, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {BasicApiParams, paginationUrlParams} from '~/utils/postgrestUrl'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {PackageManagerSettings, packageManagerSettings, PackageManagerTypes} from './config'

export type NewPackageManager = {
  id: string | null
  software: string,
  url: string,
  package_manager?: PackageManagerTypes,
  position: number
}

export type PackageManager = NewPackageManager & {
  id: string,
  download_count: number | null,
  download_count_scraped_at: string | null,
  download_count_last_error: string | null,
  download_count_scraping_disabled_reason: string | null,
  reverse_dependency_count: number | null,
  reverse_dependency_count_scraped_at: string | null,
  reverse_dependency_count_last_error: string | null,
  reverse_dependency_count_scraping_disabled_reason: string | null,
}

export async function getPackageManagersForSoftware({software, token}: {
  software: string,
  token?: string
}): Promise<PackageManager[]> {
  try {
    const query = `software=eq.${software}&order=position.asc,url.asc`
    const url = `${getBaseUrl()}/package_manager?${query}`

    // make request
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      },
    })

    if (resp.status === 200) {
      return await resp.json()
    }
    logger(`getPackageManagersForSoftware...${resp.status} ${resp.statusText}`, 'warn')
    return []
  } catch (e: any) {
    logger(`getPackageManagersForSoftware failed. ${e.message}`, 'error')
    return []
  }
}

export async function postPackageManager({data, token}: {data: NewPackageManager, token: string}) {
  try {
    const url = `${getBaseUrl()}/package_manager`

    // ELSE add new package manager
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
      },
      body: JSON.stringify(data)
    })

    return extractReturnMessage(resp)

  } catch (e: any) {
    logger(`postPackageManager failed. ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export type PatchPackageManagerProps={
  id: string,
  data: Partial<PackageManager>,
  token: string
}

export async function patchPackageManager({id, data, token}:PatchPackageManagerProps) {
  try {
    const query = `id=eq.${id}`
    const url = `${getBaseUrl()}/package_manager?${query}`
    // make request
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
      },
      body: JSON.stringify(data)
    })

    return extractReturnMessage(resp)

  } catch (e: any) {
    logger(`patchPackageManager failed. ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function patchPackageManagers({items, token}: {items: PackageManager[], token: string}) {
  try {
    // create all requests
    const requests = items.map(item => {
      return patchPackageManager({
        id: item.id,
        data:{
          position: item.position
        },
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
  } catch (e: any) {
    logger(`patchPackageManagers failed. ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function deletePackageManager({id, token}: {id: string, token: string}) {
  try {
    const url = `/api/v1/package_manager?id=eq.${id}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token),
      }
    })
    // extract errors
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`deletePackageManager failed. ${e.message}`, 'error')
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function getPackageManagerTypeFromUrl(url: string): Promise<PackageManagerTypes> {
  try {
    // julia URLs contain 'github.com', we need to prevent them from showing up as GitHub
    if (packageManagerSettings.julia.hostname.some(host => url.includes(host))) {
      return 'julia'
    }

    const urlObject = new URL(url)
    const keys = Object.keys(packageManagerSettings) as PackageManagerTypes[]

    // find first key to match the hostname
    const pm_key = keys.find(key => {
      const manager: PackageManagerSettings = packageManagerSettings[key]
      // match hostname
      return manager.hostname.includes(urlObject.hostname)
    })
    if (pm_key) {
      return pm_key
    }

    // If type not found in the pre-defined list
    // try to infer from the platforms already in the RSD
    // This is needed for Gitlab and other on premisses solutions
    const resp = await fetch(
      `${getBaseUrl()}/rpc/suggest_platform`,
      {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({hostname: urlObject.host})
      }
    )
    if (resp.status === 200) {
      const platform_type: PackageManagerTypes = await resp.json()
      if (platform_type !== null) {
        return platform_type
      }
      return 'other' as PackageManagerTypes
    }
    return 'other' as PackageManagerTypes
  } catch {
    return 'other' as PackageManagerTypes
  }
}

export function getPackageManagerServices(pm_key?: PackageManagerTypes) {
  // no services if no key
  if (!pm_key) return []
  // return services if key found
  if (Object.hasOwn(packageManagerSettings, pm_key)) {
    return packageManagerSettings[pm_key].services
  }
  // no services if key not found
  return []
}

export async function getPackageManagers({page,rows,searchFor,orderBy,token}:BasicApiParams){
  try{
    let query = '/package_manager?'
    if (orderBy){
      // disabled repos first
      query+=`order=${orderBy}`
    }else{
      // disabled repos first
      query+='order=download_count_scraping_disabled_reason.nullslast,reverse_dependency_count_scraping_disabled_reason.nullslast,url'
    }

    if (searchFor){
      const encodedSearch = encodeURIComponent(searchFor)
      query+=`&or=(url.ilike."*${encodedSearch}*",download_count_scraping_disabled_reason.ilike."*${encodedSearch}*",reverse_dependency_count_scraping_disabled_reason.ilike."*${encodedSearch}*")`
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
      const managers:PackageManager[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        managers
      }
    }

    logger(`getPackageManagers: ${resp.status} ${resp.statusText}`,'warn')

    return {
      count:0,
      managers:[]
    }
  }catch(e:any){
    logger(`getPackageManagers: ${e.message}`, 'error')
    return {
      count:0,
      managers:[]
    }
  }
}
