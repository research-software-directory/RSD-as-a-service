import logger from './logger'

import {
  NewSoftwareItem, SoftwareTableItem,
  SoftwareItem, RepositoryUrl,
  SoftwarePropsToSave, Tag,
  EditSoftwareItem,
  License
} from '../types/SoftwareTypes'
import {getPropsFromObject} from './getPropsFromObject'
import {AutocompleteOption} from '../types/AutocompleteOptions'

type AuthHeader = {
  'Content-Type': string;
  Authorization?: string;
}
export function createHeaders(token?: string): AuthHeader {
  if (token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  }
  return {
    'Content-Type': 'application/json'
  }
}

export async function addSoftware({software, token}:
  { software: NewSoftwareItem, token: string}) {
  try {
    // console.log('addSoftware...called...', software)
    const url = '/api/v1/software'
    // make post request
    const resp = await fetch(url, {
      method: 'POST',
      headers: createHeaders(token),
      body: JSON.stringify(software)
    })
    if (resp.status === 201) {
      // no data response
      return {
        status: 201,
        message: software.slug
      }
    }
    // construct message
    const data = await resp.json()
    const message = data?.message ?? resp.statusText
    logger(`addSoftware: ${message}`, 'warn')
    // return message
    return {
      status: resp.status,
      message
    }
  } catch (e: any) {
    logger(`addSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function getSoftwareToEdit({slug, token, baseUrl}:
  { slug: string, token: string, baseUrl?: string }) {
  try {
    // GET
    const select = '*,repository_url!left(url)'
    const url = baseUrl
      ? `${baseUrl}/software?select=${select}&slug=eq.${slug}`
      : `/api/v1/software?select=${select}&slug=eq.${slug}`
    const resp = await fetch(url, {
      method: 'GET',
      headers: createHeaders(token),
    })
    if (resp.status === 200) {
      const data: SoftwareItem[] = await resp.json()
      return data[0]
    }
  } catch (e: any) {
    logger(`getSoftwareItem: ${e?.message}`, 'error')
  }
}

/**
 * Entry function to update all software info from edit page
 * It updates data in software, repostory_url, tags_for_software, licenses_for_software tables.
 * It returns status 200 only when update to all tables is successful.
 * On failure it return error status code from the first error.
 */
export async function updateSoftwareInfo({software,tagsInDb,licensesInDb, token}:
  {software: EditSoftwareItem,tagsInDb:AutocompleteOption<Tag>[],licensesInDb: AutocompleteOption<License>[],token:string}) {
  try {
    // NOTE! update this list when
    const softwareTable = getPropsFromObject(software, SoftwarePropsToSave)
    const repoTable = {
      software: software.id,
      url: software?.repository_url[0]?.url
    }
    const promises = [updateSoftwareTable({software: softwareTable, token})]
    // update repo table
    promises.push(updateRepositoryTable({data: repoTable, token}))
    // check if tags need to be added
    if (software.tags?.length > 0) {
      const tagsToAdd = tagsNotInReferenceList({
        tagList: software.tags,
        referenceList: tagsInDb
      }).map(item => {
        return {
          software: software.id,
          tag: item.data.tag
        }
      })
      // add tags to tags_for_software table
      if (tagsToAdd.length > 0) promises.push(upsertTagsForSoftware({
        software: software.id, data: tagsToAdd, token
      }))
    }
    // check if tags need to be deleted from db
    if (tagsInDb.length > 0){
      // delete tags from tags_for_software table
      const tagsToDel = tagsNotInReferenceList({
        tagList: tagsInDb,
        referenceList: software.tags
      }).map(item => item.data.tag)
      // add delete tags api call
      if (tagsToDel.length > 0) promises.push(deleteTagsForSoftware({
        software: software.id, tags: tagsToDel, token
      }))
    }
    // check if liceses need to be added
    if (software.licenses?.length > 0) {
      const licensesToAdd = licensesNotInReferenceList({
        list: software.licenses,
        referenceList: licensesInDb
      }).map((item)=>{
        return {
          software: software.id,
          license: item.key
        }
      })
      // add tags update to list
      if (licensesToAdd.length > 0) promises.push(upsertLicensesForSoftware({
        software: software.id, data: licensesToAdd, token
      }))
    }
    // check if licenses need to be deleted
    if (licensesInDb.length > 0) {
      const licenseToDel = licensesNotInReferenceList({
        list: licensesInDb,
        referenceList: software.licenses
      }).map((item) => {
        return item?.data?.id ?? ''
      })
      if (licenseToDel.length > 0) promises.push(deleteLicenses({
        ids: licenseToDel, token
      }))
    }
    // make all requests
    const responses = await Promise.all(promises)
    const errors = extractErrorMessages(responses)
    // return result
    if (errors.length > 0) {
      // return first error for now
      return {
        status: errors[0].status,
        message: errors[0].message
      }
    }
    return {
      status: 200,
      message: software.id
    }
  } catch (e: any) {
    logger(`updateSoftwareInfo: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}


export async function updateSoftwareTable({software, token}:
  { software: SoftwareTableItem, token:string }) {
  try {
    // PATCH
    const url = `/api/v1/software?id=eq.${software.id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createHeaders(token),
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(software)
    })

    return extractReturnMessage(resp, software.id)

  } catch (e: any) {
    logger(`updateSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function updateRepositoryTable({data, token}:
  { data: RepositoryUrl, token: string }) {
  try {
    // PATCH
    const url = `/api/v1/repository_url?software=eq.${data.software}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createHeaders(token),
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    })

    return extractReturnMessage(resp, data.software ?? '')

  } catch (e: any) {
    logger(`updateSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function addToRepositoryTable({data, token}:
  { data: RepositoryUrl, token: string }) {
  try {
    // add new repository
    const url = '/api/v1/repository_url'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createHeaders(token),
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    })

    return extractReturnMessage(resp, data.software ?? '')

  } catch (e: any) {
    logger(`updateSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteFromRepositoryTable({data, token}:
  { data: RepositoryUrl, token: string }) {
  try {
    // PATCH
    const url = `/api/v1/repository_url?software=eq.${data.software}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createHeaders(token)
      },
      body: JSON.stringify(data)
    })

    return extractReturnMessage(resp, data.software ?? '')

  } catch (e: any) {
    logger(`updateSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function upsertTagsForSoftware({software, data, token}:{software:string, data:Tag[],token:string}) {
  try {
    // PATCH
    const url = `/api/v1/tag_for_software?software=eq.${software}`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createHeaders(token),
        // this will add new items and update existing
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    })

    return extractReturnMessage(resp, software ?? '')

  } catch (e: any) {
    logger(`upsertTagsForSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteTagsForSoftware({software,tags,token}: { software: string,tags:string[],token: string }) {
  try {
    if (!software) return {
      status: 400,
      message: 'Missing software id'
    }
    // DELETE where software uuid and tag in list
    const url = `/api/v1/tag_for_software?software=eq.${software}&tag=in.("${encodeURIComponent(tags.join('","'))}")`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createHeaders(token),
      }
    })

    return extractReturnMessage(resp, software ?? '')

  } catch (e: any) {
    logger(`upsertTagsForSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

// NOT NEEDED FOR NOW
// export async function deleteAllTagsForSoftware({software, token}: { software: string, token: string }) {
//   try {
//     // DELETE where software uuid
//     const url = `/api/v1/tag_for_software?software=eq.${software}`
//     const resp = await fetch(url, {
//       method: 'DELETE',
//       headers: {
//         ...createHeaders(token),
//       }
//     })

//     return extractReturnMessage(resp, software ?? '')

//   } catch (e: any) {
//     logger(`upsertTagsForSoftware: ${e?.message}`, 'error')
//     return {
//       status: 500,
//       message: e?.message
//     }
//   }
// }

export async function upsertLicensesForSoftware({software, data, token}:
  {software: string, data: License[], token: string}) {
  try {
    const url = `/api/v1/license_for_software?software=eq.${software}`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createHeaders(token),
        // this will add new items and update existing
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    })

    return extractReturnMessage(resp, software ?? '')

  } catch (e: any) {
    logger(`upsertLicensesForSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function deleteLicenses({ids, token}:
  {ids: string[], token: string}) {
  try {
    const url = `/api/v1/license_for_software?id=in.("${ids.join('","')}")`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createHeaders(token),
      }
    })

    return extractReturnMessage(resp, ids.toString())

  } catch (e: any) {
    logger(`upsertLicensesForSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function isMaintainerOfSoftware({slug, account,token,frontend=true}:
  { slug?: string, account?: string, token?: string,frontend?:boolean}) {
  try {
    // return false directly when missing info
    if (!slug || !account || !token) return false
    // build url
    let url = `/api/v1/maintainer_for_software_by_slug?maintainer=eq.${account}&slug=eq.${slug}`
    if (frontend==false) {
      url = `${process.env.POSTGREST_URL}/maintainer_for_software_by_slug?maintainer=eq.${account}&slug=eq.${slug}`
    }
    const resp = await fetch(url, {
      method: 'GET',
      headers: createHeaders(token)
    })
    // MAINTAINER
    if (resp.status === 200) {
      const json = await resp.json()
      // it should return exactly 1 item
      if (json?.length === 1) {
        // having maintainer equal to uid
        return json[0].maintainer === account
      }
      return false
    }
    // ERRORS AS NOT MAINTAINER
    logger(`isMaintainerOfSoftware: Not a maintainer of ${slug}. ${resp.status}:${resp.statusText}`,'warn')
    return false
  } catch (e:any) {
    logger(`isMaintainerOfSoftware: ${e?.message}`, 'error')
    // ERRORS AS NOT MAINTAINER
    return false
  }
}


function extractReturnMessage(resp:Response, dataId:string) {
  // OK
  if ([200,201,204].includes(resp.status)) {
    // just return id
    return {
      status: 200,
      message: dataId
    }
  }
  // not authorized, 404 seem to be returned mostly
  if ([401, 403, 404].includes(resp.status)) {
    return {
      status: resp.status,
      message: `
          ${resp.statusText}.
          You might not have sufficient priveleges to edit this software.
          Please contact site administrators.
        `
    }
  } else {
    return {
      status: resp.status,
      message: `
          Failed to save changes.
          ${resp.statusText}.
          Please contact site administrators.
        `
    }
  }
}

export function tagsNotInReferenceList({tagList, referenceList}:
  { tagList: AutocompleteOption<Tag>[], referenceList: AutocompleteOption<Tag>[] }) {
  if (tagList.length > 0) {
    // tagList in initalList not present in saveList should be removed from db
    const tagsNotInReferenceList = tagList.filter(({data: {tag: iTag}}) => {
      // if item cannot be found in saveList
      return !referenceList.some(({data: {tag: sTag}}) => {
        // compare inital item with items in saveList
        return iTag === sTag
      })
    })
    // debugger
    return tagsNotInReferenceList
  }
  return []
}

export function licensesNotInReferenceList({list, referenceList}:
  { list: AutocompleteOption<License>[], referenceList: AutocompleteOption<License>[] }) {
  if (list.length > 0) {
    // list in initalList not present in saveList should be removed from db
    const itemsNotInReferenceList = list.filter(({data: {license: lLicense}}) => {
      // if item cannot be found in saveList
      return !referenceList.some(({data: {license: rLicense}}) => {
        // compare inital item with items in saveList
        return lLicense === rLicense
      })
    })
    // debugger
    return itemsNotInReferenceList
  }
  return []
}


function extractErrorMessages(responses: { status: number, message: string }[]) {
  let errors: { status: number, message: string }[] = []
  responses.forEach(resp => {
    if (resp.status !== 200) {
      errors.push(resp)
    }
  })
  return errors
}
