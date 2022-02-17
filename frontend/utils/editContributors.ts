/**
 * CONTRIBUTORS
 */

import {AutocompleteOption} from '../types/AutocompleteOptions'
import {Contributor, ContributorProps, SearchContributor} from '../types/Contributor'
import {createJsonHeaders, extractReturnMessage} from './fetchHelpers'
import {getORCID} from './getORCID'
import {getPropsFromObject} from './getPropsFromObject'
import logger from './logger'
import {sortOnStrProp} from './sortFn'

export function getAvatarUrl({id, avatar_mime_type}:{id?:string|null,avatar_mime_type?:string|null}) {
  if (avatar_mime_type) {
    // construct image path
    // currently we use posgrest + nginx approach image/rpc/get_contributor_image?id=15c8d47f-f8f0-45ff-861c-1e57640ebd56
    return `/image/rpc/get_contributor_image?id=${id}`
  }
  return null
}

export function getAvatarUrlAsBase64({avatar_mime_type,avatar_data}:
  {avatar_mime_type?: string | null, avatar_data: string | null}) {
  if (avatar_mime_type && avatar_data) {
    // construct the image src content for base64 images
    return `data:${avatar_mime_type};base64,${avatar_data}`
  }
  return null
}

export async function getContributorsForSoftware({software, token, frontend}:
  { software: string, token?: string, frontend?: boolean }) {
  try {
    // use standardized list of columns
    const columns = ContributorProps.join(',')

    let url = `${process.env.POSTGREST_URL}/contributor?select=${columns},avatar_data&software=eq.${software}&order=family_names.asc`
    if (frontend) {
      url = `/api/v1/contributor?select=${columns}&software=eq.${software}&order=family_names.asc`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      }
    })

    if (resp.status === 200) {
      const data: Contributor[] = await resp.json()
      return data.map(item => ({
        ...item,
        // add avatar url based on uuid
        avatar_url: getAvatarUrl(item)
      })).sort((a,b)=>sortOnStrProp(a,b,'given_names'))
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

    if (resp.status === 200) {
      const data: SearchContributor[] = await resp.json()
      const options: AutocompleteOption<SearchContributor>[] = data.map(item => {
        return {
          key: item.display_name ?? '',
          label: item.display_name ?? '',
          data: {
            ...item,
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

export async function addContributorToDb({contributor, token}: { contributor: Contributor, token: string }) {
  try {
    const url = '/api/v1/contributor'

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=headers-only'
      },
      body:JSON.stringify(contributor)
    })
    if (resp.status === 201) {
      // we need to return id of created record
      // it can be extracted from header.location
      const id = resp.headers.get('location')?.split('.')[1]
      return {
        status: 201,
        message: id
      }
    } else {
      return extractReturnMessage(resp)
    }
  } catch (e: any) {
    logger(`addContributorToDb: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function updateContributorInDb({data, token}: { data: Contributor, token: string }) {

  const contributor = prepareContributorData(data)
  const resp = await patchContributor({contributor, token})

  if (resp.status === 200) {
    // if we uploaded new image we remove
    // data and construct avatar_url
    const returned = removeBase64Data(data)
    // if (data.avatar_b64 &&
    //   data?.avatar_b64.length > 10) {
    //   // clean it from memory data
    //   data.avatar_b64 = null
    //   // and we use avatar url instead
    //   data.avatar_url = getAvatarUrl(data)
    // }
    return {
      status: 200,
      message: returned
    }
  } else {
    return resp
  }
}

export function prepareContributorData(data: Contributor) {
  const contributor = getPropsFromObject(data, ContributorProps)
  // do we need to save new base64 image
  if (data?.avatar_b64 &&
    data?.avatar_b64.length > 10 &&
    data?.avatar_mime_type !== null) {
    // split base64 to use only encoded content
    contributor.avatar_data = data?.avatar_b64.split(',')[1]
  }
  return contributor
}

export function removeBase64Data(contributor: Contributor) {
  if (contributor.avatar_b64 &&
    contributor?.avatar_b64.length > 10) {
    // clean it from memory data
    contributor.avatar_b64 = null
    // and we use avatar url instead
    contributor.avatar_url = getAvatarUrl(contributor)
  }
  return contributor
}

export async function patchContributor({contributor, token}: { contributor: Contributor, token: string }) {
  try {
    const url = `/api/v1/contributor?id=eq.${contributor.id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
      },
      body: JSON.stringify(contributor)
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    logger(`patchContributor: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}


export async function deleteContributorsById({ids,token}:{ids:string[],token:string}) {
  try{
    const url = `/api/v1/contributor?id=in.("${ids.join('","')}")`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token),
      }
    })
    return extractReturnMessage(resp, ids.toString())
  } catch (e: any) {
    logger(`deleteContributorsById: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}


export function combineRoleAndAffiliation(item:Contributor){
  if (item?.role && item?.affiliation) return `${item?.role}, ${item?.affiliation}`

  if (item?.role) return item?.role

  return item?.affiliation ?? ''
}
