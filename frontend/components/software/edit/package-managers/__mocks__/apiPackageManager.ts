// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

/**
 * DEFAULT MOCKS OF apiPackageManager methods
 */

import {BasicApiParams} from '~/utils/postgrestUrl'
import {packageManagerSettings, PackageManagerSettings} from '../config'
import mockPackageManagers from './package_manager.json'

export type PackageManagerTypes = keyof typeof packageManagerSettings

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getPackageManagersForSoftware=jest.fn(async({software, token}: {software: string, token: string})=>{
  // console.log('getPackageManagers...default MOCK')
  return mockPackageManagers
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const postPackageManager=jest.fn(async({data, token}: {data: NewPackageManager, token: string})=>{
  // console.log('postPackageManager...default MOCK')
  return {
    status: 200,
    message: 'OK'
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const patchPackageManagers=jest.fn(async({items, token}: {items: PackageManager[], token: string})=>{
  // console.log('patchPackageManagers...default MOCK')
  return {
    status: 200,
    message: 'OK'
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const deletePackageManager=jest.fn(async({id, token}: {id: string, token: string})=>{
  // console.log('deletePackageManager...default MOCK')
  return {
    status: 200,
    message: 'OK'
  }
})

export const getPackageManagerTypeFromUrl=jest.fn(async(url:string)=>{
  try {
    const urlObject = new URL(url)
    const keys = Object.keys(packageManagerSettings) as PackageManagerTypes[]

    // find first key to match the hostname
    const pm_key = keys.find(key => {
      const manager = packageManagerSettings[key as PackageManagerTypes] as PackageManagerSettings
      // match hostname
      return manager.hostname.includes(urlObject.hostname)
    })
    if (pm_key) {
      return pm_key
    }
    return 'other' as PackageManagerTypes
  } catch {
    return 'other' as PackageManagerTypes
  }
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getPackageManagerServices=jest.fn(async(pm_key:PackageManagerTypes|null)=>{
  // just return no services
  return []
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const getPackageManagers=jest.fn(async({page,rows,searchFor,orderBy,token}:BasicApiParams)=>{
  // just return no services
  return []
})
