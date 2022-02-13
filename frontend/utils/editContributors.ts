/**
 * CONTRIBUTORS
 */

import {AutocompleteOption} from '../components/form/ControlledAutocomplete'
import {Contributor, ContributorProps, SearchContributor} from '../types/Contributor'
import {createJsonHeaders} from './fetchHelpers'
import {getORCID} from './getORCID'
import logger from './logger'

export function getAvatarUrl({id, avatar_mime_type}:{id?:string|null,avatar_mime_type?:string|null}) {
  if (avatar_mime_type) {
    // construct image path
    // currently we use posgrest + nginx approach image/rpc/get_contributor_image?id=15c8d47f-f8f0-45ff-861c-1e57640ebd56
    // NOTE! the images will fail when running frontend in development due to origin being localhost:3000 instead of localhost
    return `/image/rpc/get_contributor_image?id=${id}`
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


export async function searchForContributor({searchFor, token, frontend}:
  { searchFor: string, token?: string, frontend?: boolean }) {
  try {

    const [rsdContributor, orcidOptions] = await Promise.all([
      findRSDContributor({searchFor, token, frontend}),
      getORCID({searchFor})
    ])

    const options = [
      ...rsdContributor,
      ...orcidOptions
    ]

    return options

  } catch (e: any) {
    logger(`searchForContributor: ${e?.message}`, 'error')
    return []
  }
}

async function findRSDContributor({searchFor, token, frontend}:
  { searchFor: string, token?: string, frontend?: boolean }) {
  try {
    // debugger
    let url = `${process.env.POSTGREST_URL}/unique_countributors?display_name=ilike.*${searchFor}*&limit=20`
    if (frontend) {
      url = `/api/v1/unique_countributors?display_name=ilike.*${searchFor}*&limit=20`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      }
    })
    // debugger
    if (resp.status === 200) {
      const data: SearchContributor[] = await resp.json()
      const options: AutocompleteOption<SearchContributor>[] = data.map(item => {
        return {
          key: item.display_name ?? '',
          label: `${item.display_name} source: RSD`,
          data: {
            ...item,
            // add avatar url based on uuid
            // avatar_url: getAvatarUrl(item),
            source: 'RSD'
          }
        }
      })
      return options
    } else if (resp.status === 404) {
      logger('findRSDContributor ERROR: 404 Not found', 'error')
      // query not found
      return []
    }
    logger(`findRSDContributor ERROR: ${resp?.status} ${resp?.statusText}`, 'error')
    return []
  } catch (e: any) {
    logger(`findRSDContributor: ${e?.message}`, 'error')
    return []
  }
}
