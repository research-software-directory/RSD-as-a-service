/**
 * CONTRIBUTORS
 */

import {Contributor, ContributorProps} from '../types/Contributor'
import {createJsonHeaders} from './fetchHelpers'
import logger from './logger'

export function getAvatarUrl(item: Contributor) {
  if (item.avatar_mime_type) {
    // construct image path
    // currently we use posgrest + nginx approach image/rpc/get_contributor_image?id=15c8d47f-f8f0-45ff-861c-1e57640ebd56
    // NOTE! the images will fail when running frontend in development due to origin being localhost:3000 instead of localhost
    return `/image/rpc/get_contributor_image?id=${item.id}`
    // debugger
    // console.log('image',item.avatar_url)
  }
  return null
}

export async function getContributorsForSoftware({software, token, frontend}:
  { software: string, token?: string, frontend?: boolean }) {
  try {
    // this request is always perfomed from backend
    // the content is order by family_names ascending
    // const columns = 'id,software,is_contact_person,email_address,family_names,given_names,avatar_mime_type'
    const columns = ContributorProps.join(',')
    // debugger
    let url = `${process.env.POSTGREST_URL}/contributor?select=${columns}&software=eq.${software}&order=family_names.asc`
    if (frontend) {
      url = `/api/v1/contributor?select=${columns}&software=eq.${software}&order=family_names.asc`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      }
    })
    // debugger
    if (resp.status === 200) {
      const data: Contributor[] = await resp.json()
      return data.map(item => ({
        ...item,
        // add avatar url based on uuid
        avatar_url: getAvatarUrl(item)
      }))
    } else if (resp.status === 404) {
      logger(`getContributorsForSoftware: 404 [${url}]`, 'error')
      // query not found
      return []
    }
  } catch (e: any) {
    logger(`getContributorsForSoftware: ${e?.message}`, 'error')
    return []
  }
}
