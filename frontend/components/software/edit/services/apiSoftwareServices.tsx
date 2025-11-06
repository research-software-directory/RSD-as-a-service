// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2025 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2025 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {PackageManagerTypes} from '../package-managers/apiPackageManager'

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

// TODO! Adjust repository_url query for new tables
export async function deleteServiceDataFromDb({dbprops, id, token}:
  {dbprops:string[], id: string, token:string}){
  try {
    const query = `repository_url?id=eq.${id}`
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
