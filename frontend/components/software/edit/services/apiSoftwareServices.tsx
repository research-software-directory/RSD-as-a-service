// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {PackageManagerTypes} from '~/components/software/edit/package-managers/config'
import {CodePlatform} from '~/components/software/edit/repositories/apiRepositories'

export type SoftwareServices = {
  software:string,
  url:string,
  code_platform: CodePlatform,
  basic_data_scraped_at: string|null,
  basic_data_last_error: string|null,
  languages_scraped_at: string|null,
  languages_last_error: string|null,
  commit_history_scraped_at: string|null,
  commit_history_last_error: string|null,
  scraping_disabled_reason: string|null,
}

export type PackageManagerService = {
  software:string
  url: string,
  package_manager: PackageManagerTypes,
  download_count_scraped_at: string|null,
  download_count_last_error: string|null,
  download_count_scraping_disabled_reason: string|null,
  reverse_dependency_count_scraped_at: string|null,
  reverse_dependency_count_last_error: string|null,
  reverse_dependency_count_scraping_disabled_reason: string|null,
}

export async function getSoftwareServices(id:string,token:string){
  try{
    const select='select=software,url,code_platform,basic_data_scraped_at,basic_data_last_error,languages_scraped_at,languages_last_error,commit_history_scraped_at,commit_history_last_error,scraping_disabled_reason'
    const query = `${select}&software=eq.${id}`
    const url = `${getBaseUrl()}/repository_url?${query}`

    // make request
    const resp = await fetch(url,{
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      },
    })

    if (resp.status === 200) {
      const json:SoftwareServices[] = await resp.json()
      return json[0]
    }
    logger(`getSoftwareServices...${resp.status} ${resp.statusText}`,'warn')
  }catch(e:any){
    logger(`getSoftwareServices failed. ${e.message}`,'error')
  }
}

export async function getPackageManagerServices(id:string,token:string){
  try{
    const select='select=software,url,package_manager,download_count_scraped_at,download_count_last_error,download_count_scraping_disabled_reason,reverse_dependency_count_scraped_at,reverse_dependency_count_last_error,reverse_dependency_count_scraping_disabled_reason'
    const query = `${select}&software=eq.${id}&order=position`
    const url = `${getBaseUrl()}/package_manager?${query}`

    // make request
    const resp = await fetch(url,{
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      },
    })

    if (resp.status === 200) {
      const json:PackageManagerService[] = await resp.json()
      return json
    }
    logger(`getPackageManagerServices...${resp.status} ${resp.statusText}`,'warn')
    return []
  }catch(e:any){
    logger(`getPackageManagerServices failed. ${e.message}`,'error')
    return []
  }
}

export async function deleteServiceDataFromDb({dbprops, software, token}:
{dbprops:string[], software: string, token:string}){
  try {
    const query = `repository_url?software=eq.${software}`
    const url = `${getBaseUrl()}/${query}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token)
      },
      body: JSON.stringify(
        dbprops.reduce((acc, dbprop) => ({...acc, [dbprop]: null}), {})
      )
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`deleteServiceDataFromDb: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
