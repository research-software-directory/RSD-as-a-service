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

export function createHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
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
    const select = '*,repository_url!left(id,url)'
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
 * It updates data in software and repostory_url tables.
 * Only on successful update on all tables returns status 200.
 */
export async function updateSoftwareInfo({software, token}:
  { software: EditSoftwareItem,token:string}) {
  try {
    // NOTE! update this list when
    const softwareTable = getPropsFromObject(software, SoftwarePropsToSave)
    const repoTable = {
      id: software?.repository_url[0].id,
      software: software.id,
      url: software?.repository_url[0].url
    }
    const promises = [updateSoftwareTable({software: softwareTable, token})]
    // decide on repo table action
    if (repoTable.url != '') {
      if (repoTable.id){
        promises.push(updateRepositoryTable({data: repoTable, token}))
      }else {
        promises.push(addToRepositoryTable({data: repoTable, token}))
      }
    } else if (repoTable.url === '' && repoTable.id) {
      // not possible to foreign key relations - do nothing for now
      // promises.push(deleteFromRepositoryTable({data: repoTable, token}))
    }
    // check if tags need to be added
    if (software.tags?.length > 0) {
      const tags = AutocompleteToTags(software.tags,software.id)
      // add tags update to list
      if (tags.length>0) promises.push(upsertTagsForSoftware({software:software.id, data:tags, token}))
    }
    // check if liceses need to be added
    if (software.licenses?.length > 0) {
      const licenses = AutocompleteToLicenses(software.licenses,software.id)
      // add tags update to list
      if (licenses.length>0) promises.push(upsertLicensesForSoftware({software: software.id, data: licenses, token}))
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
    const url = `/api/v1/repository_url?id=eq.${data.id}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createHeaders(token),
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(data)
    })

    return extractReturnMessage(resp, data.id ?? '')

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

    return extractReturnMessage(resp, data.id ?? '')

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
    const url = `/api/v1/repository_url?id=eq.${data.id}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createHeaders(token)
      },
      body: JSON.stringify(data)
    })

    return extractReturnMessage(resp, data.id ?? '')

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

export async function upsertLicensesForSoftware({software, data, token}: { software: string, data: License[], token: string }) {
  try {
    // PATCH
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


export async function isMaintainerOfSoftware({slug, uid, token}:
  {slug: string, uid: string, token: string}) {
  try {
    // return false directly when missing info
    if (!slug || !uid || !token) return false
    // build url
    const url = `/api/v1/maintainer_for_software_by_slug?maintainer=eq.${uid}&slug=eq.${slug}`
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
        return json[0].maintainer === uid
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

function extractErrorMessages(responses: { status: number, message: string }[]) {
  let errors: { status: number, message: string }[] = []
  responses.forEach(resp => {
    if (resp.status !== 200) {
      errors.push(resp)
    }
  })
  return errors
}

function AutocompleteToTags(options: AutocompleteOption<Tag>[],softwareId: string) {
  const tags: Tag[] = options
    .filter(item => !item.data.software)
    // only new items to be added
    .map(item => {
      return {
        software: softwareId,
        tag: item.data.tag
      }
    })
  debugger
  return tags
}

function AutocompleteToLicenses(options: AutocompleteOption<License>[],softwareId: string) {
  const items: License[] = options
    // only new items to be added
    .filter(item=>item.data.hasOwnProperty('id')===false)
    .map(item => {
      return {
        software: softwareId,
        license: item.key
      }
    })
  debugger
  return items
}

