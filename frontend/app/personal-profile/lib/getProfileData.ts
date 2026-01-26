// SPDX-FileCopyrightText: 2026 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2026 Paula Stock (GFZ) <paula.stock@gfz.de>
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {paginationUrlParams} from '~/utils/postgrestUrl'

export type UserProfile = {
  account: string
  given_names: string
  family_names: string
  email_address: string
  role: string
  affiliation: string
  is_public: boolean
  avatar_id: string
  description: string
  created_at: string
  updated_at: string
}

export type getPublicProfileProps = {
  account: string
  token?: string
}

export async function getPublicProfileData({account, token}: getPublicProfileProps) {
  try {
    console.log('Calling getPublicProfileData')
    const url = getBaseUrl() + `/user_profile?account=eq.${account}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createJsonHeaders(token)
    })
    if (resp.status === 200) {
      const data: UserProfile[] = await resp.json()
      console.log(`getPublicProfileData request successful: ${data}`)
      return data[0]
    }
    console.log(`getPublicProfileData not 200: ${resp.status} - ${resp.body}`)
    logger(`getPublicProfileData not 200: ${resp.status} - ${resp.body}`, 'error')
    return null
  } catch (e: any) {
    console.log(`getPublicProfileData: ${e?.message}`)
    logger(`getPublicProfileData: ${e?.message}`, 'error')
    return null
  }
}

export type SoftwareByMaintainer={
  id:string ,
	slug:string,
	brand_name:string,
	short_statement:string,
	is_published:boolean,
	image_id:string|null
	updated_at:string,
	contributor_cnt:number,
	mention_cnt:number
}

export type UserSoftwareProp = {
  searchFor?: string
  page: number,
  rows: number,
  token?: string,
  account: string
}

export async function getSoftwareForMaintainer({
  searchFor, page, rows, account, token}:UserSoftwareProp
) {
  try {
    // baseUrl
    let url = getBaseUrl() +`/rpc/software_by_maintainer?maintainer_id=${account}&order=brand_name`
    // search
    if (searchFor) {
      url+=`&or=(brand_name.ilike."*${searchFor}*", short_statement.ilike."*${searchFor}*")`
    }
    // pagination
    url += paginationUrlParams({rows, page})
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
      const json: SoftwareByMaintainer[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        software: json
      }
    }
    // otherwise request failed
    logger(`getSoftwareForMaintainer: ${resp.status} ${resp.statusText}`, 'warn')
    // we log and return zero
    return {
      count: 0,
      software:[]
    }

  } catch (e:any) {
    // otherwise request failed
    logger(`getSoftwareForMaintainer: ${e.message}`, 'error')
    // we log and return zero
    return {
      count: 0,
      software: []
    }
  }
}

export async function getProfileData(userId: string, token: string | undefined, searchFor?: string) {
  const [profileData, profileSoftware] = await Promise.all([
    getPublicProfileData({account: userId, token: token}),
    getSoftwareForMaintainer({
      searchFor,
      page: 0,
      rows: 0,
      token,
      account: userId
    })
  ])

  return {profileData, profileSoftware}
}
