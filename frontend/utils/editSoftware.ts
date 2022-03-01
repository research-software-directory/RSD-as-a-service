import logger from './logger'

import {
  NewSoftwareItem, SoftwareTableItem,
  SoftwareItem, RepositoryUrl,
  SoftwarePropsToSave, Tag,
  EditSoftwareItem,
  License,
  SoftwareItemFromDB
} from '../types/SoftwareTypes'
import {getPropsFromObject} from './getPropsFromObject'
import {AutocompleteOption} from '../types/AutocompleteOptions'
import {createJsonHeaders, extractErrorMessages, extractReturnMessage} from './fetchHelpers'

export async function addSoftware({software, token}:
  { software: NewSoftwareItem, token: string}) {
  try {
    // console.log('addSoftware...called...', software)
    const url = '/api/v1/software'
    // make post request
    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
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
      headers: createJsonHeaders(token),
    })
    if (resp.status === 200) {
      const data:SoftwareItemFromDB[] = await resp.json()
      // fix repositoryUrl
      const software: SoftwareItem = getPropsFromObject(data[0], SoftwarePropsToSave)
      // repository url should at least be http://a.b
      if (data[0]?.repository_url[0]?.url?.length > 9) {
        software.repository_url = data[0]?.repository_url[0]?.url
      } else {
        software.repository_url = null
      }
      return software
    }
  } catch (e: any) {
    logger(`getSoftwareItem: ${e?.message}`, 'error')
  }
}

/**
 * Entry function to update all software info from edit page
 * It updates data in software, repostory_url, tags_for_software and licenses_for_software.
 * It returns status 200 only when update to all tables is successful.
 * On failure it returns the error status code of the first error.
 */
export async function updateSoftwareInfo({software, tagsInDb, licensesInDb, repositoryInDb, token}:{
  software: EditSoftwareItem, tagsInDb: AutocompleteOption<Tag>[], licensesInDb: AutocompleteOption<License>[],
  repositoryInDb: string|null, token: string
}) {
  try {
    // NOTE! update SoftwarePropsToSave list if the data structure changes
    const softwareTable = getPropsFromObject(software, SoftwarePropsToSave)
    // add update to software table async call
    const promises = [updateSoftwareTable({software: softwareTable, token})]
    // repository table
    if (repositoryInDb) {
      // we already had repositoryUrl entry
      if (!software?.repository_url) {
        // and now we have empty string or null => the record should be removed
        promises.push(deleteFromRepositoryTable({software:software.id,token}))
      } else if (software?.repository_url !== repositoryInDb) {
        // if the repo values are not equal => the record should be updated
        promises.push(updateRepositoryTable({
          data: {
            software: software.id,
            url: software?.repository_url
          },
          token
        }))
      }
    } else if (software?.repository_url) {
      // new entry to repository table
      promises.push(addToRepositoryTable({
        data: {
          software: software.id,
          url: software?.repository_url
        },
        token
      }))
    }
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
      if (tagsToAdd.length > 0) promises.push(addTagsForSoftware({
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
      if (licensesToAdd.length > 0) promises.push(addLicensesForSoftware({
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
        ...createJsonHeaders(token),
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

export async function addToRepositoryTable({data, token}:
  { data: RepositoryUrl, token: string }) {
  try {
    // add new repository
    const url = '/api/v1/repository_url'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        // merging also works with POST method
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

export async function updateRepositoryTable({data, token}:
  { data: RepositoryUrl, token: string }) {
  try {
    // PATCH
    const url = `/api/v1/repository_url?software=eq.${data.software}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        ...data,
        // we clean repo stats when url is changed
        languages: null,
        languages_scraped_at: null,
        license: null,
        license_scraped_at: null,
        commit_history: null,
        commit_history_scraped_at: null
      })
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


export async function deleteFromRepositoryTable({software, token}:
  { software: string, token: string }) {
  try {
    // DELETE
    const url = `/api/v1/repository_url?software=eq.${software}`
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: {
        ...createJsonHeaders(token)
      }
    })

    return extractReturnMessage(resp, software ?? '')

  } catch (e: any) {
    logger(`updateSoftware: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function addTagsForSoftware({software, data, token}:{software:string, data:Tag[],token:string}) {
  try {
    // POST
    const url = `/api/v1/tag_for_software?software=eq.${software}`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        // this will add new items and update existing
        // 'Prefer': 'resolution=merge-duplicates'
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
        ...createJsonHeaders(token),
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

export async function addLicensesForSoftware({software, data, token}:
  {software: string, data: License[], token: string}) {
  try {
    const url = `/api/v1/license_for_software?software=eq.${software}`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
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
        ...createJsonHeaders(token),
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
      headers: createJsonHeaders(token)
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

    return itemsNotInReferenceList
  }
  return []
}


// query for software item page based on slug
export async function validSoftwareItem(slug: string | undefined, token?: string) {
  try {
    // this request is always perfomed from frontend
    const url = `/api/v1/software?select=id,slug&slug=eq.${slug}`
    let resp
    if (token) {
      resp = await fetch(url, {
        method: 'GET',
        headers: createJsonHeaders(token)
      })
    } else {
      resp = await fetch(url, {method: 'GET'})
    }
    if (resp.status === 200) {
      const data = await resp.json()
      return data.length === 1
    }
    return false
  } catch (e: any) {
    logger(`validSoftwareItem: ${e?.message}`, 'error')
    return false
  }
}
