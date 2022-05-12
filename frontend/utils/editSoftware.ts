import {UseFieldArrayUpdate} from 'react-hook-form'

import logger from './logger'
import {
  NewSoftwareItem, SoftwareTableItem,
  SoftwareItem, RepositoryUrl,
  SoftwarePropsToSave,
  EditSoftwareItem,
  License,
  SoftwareItemFromDB,
  KeywordForSoftware
} from '../types/SoftwareTypes'
import {getPropsFromObject} from './getPropsFromObject'
import {AutocompleteOption} from '../types/AutocompleteOptions'
import {createJsonHeaders, extractErrorMessages, extractReturnMessage} from './fetchHelpers'
import {itemsNotInReferenceList} from './itemsNotInReferenceList'
import {SoftwareKeywordsForSave} from '~/components/software/edit/information/softwareKeywordsChanges'
import {addKeywordsToSoftware, createKeyword, deleteKeywordFromSoftware} from './editKeywords'

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
    const select = '*,repository_url!left(url,code_platform)'
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
        software.repository_platform = data[0]?.repository_url[0]?.code_platform
      } else {
        software.repository_url = null
        software.repository_platform = null
      }
      return software
    }
  } catch (e: any) {
    logger(`getSoftwareItem: ${e?.message}`, 'error')
  }
}

/**
 * Entry function to update all software info from edit page
 * It updates data in software, repostory_url, keyword, keyword_for_software and licenses_for_software.
 * It returns status 200 only when update to all tables is successful.
 * On failure it returns the error status code of the first error.
 */
export type SaveSoftwareInfoProps = {
  software: EditSoftwareItem,
  keywords: SoftwareKeywordsForSave,
  licensesInDb: AutocompleteOption<License>[],
  repositoryInDb: string | null,
  repositoryPlatform: string | null,
  token: string
}
export async function updateSoftwareInfo({software, keywords, licensesInDb,
  repositoryInDb, repositoryPlatform, token}: SaveSoftwareInfoProps) {
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
      } else if (
        software?.repository_url !== repositoryInDb ||
        software.repository_platform != repositoryPlatform
      ) {
        // debugger
        // if the repo values are not equal => the record should be updated
        promises.push(updateRepositoryTable({
          data: {
            software: software.id,
            url: software?.repository_url,
            code_platform: software?.repository_platform ?? 'other',
          },
          token
        }))
      }
    } else if (software?.repository_url) {
      // debugger
      // new entry to repository table
      promises.push(addToRepositoryTable({
        data: {
          software: software.id,
          url: software?.repository_url,
          code_platform: software?.repository_platform ?? 'other',
        },
        token
      }))
    }
    // -----------------------------
    // Keywords
    // -----------------------------
    // create
    keywords.create.forEach(item => {
      promises.push(
        createKeywordAndAddToSoftware({
          data: item,
          token,
          // fn to update item in the form with uuid
          updateKeyword: keywords.updateKeyword
        })
      )
    })
    // add
    if (keywords.add.length > 0) {
      promises.push(
        addKeywordsToSoftware({
          // extract only needed data
          data: keywords.add.map(item => ({
            software: item.software,
            keyword: item.id ?? ''
          })),
          token
        })
      )
    }
    // delete
    keywords.delete.forEach(item => {
      promises.push(
        deleteKeywordFromSoftware({
          software: item.software,
          keyword: item.keyword,
          token
        })
      )
    })
    // --------------------------------
    // LICESES
    // --------------------------------
    // check if liceses need to be added
    if (software.licenses?.length > 0) {
      const licensesToAdd = itemsNotInReferenceList({
        list: software.licenses,
        referenceList: licensesInDb,
        key: 'key'
      }).map((item) => {
        return {
          software: software.id,
          license: item.key
        }
      })
      if (licensesToAdd.length > 0) promises.push(addLicensesForSoftware({
        software: software.id, data: licensesToAdd, token
      }))
    }
    // check if licenses need to be deleted
    if (licensesInDb.length > 0) {
      const licenseToDel = itemsNotInReferenceList({
        list: licensesInDb,
        referenceList: software.licenses,
        key: 'key'
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
    logger(`updateSoftwareTable: ${e?.message}`, 'error')
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
    logger(`addToRepositoryTable: ${e?.message}`, 'error')
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
    logger(`updateRepositoryTable: ${e?.message}`, 'error')
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
    logger(`deleteFromRepositoryTable: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
export async function createKeywordAndAddToSoftware({data, token, updateKeyword}:
  { data: KeywordForSoftware, token: string, updateKeyword: UseFieldArrayUpdate<EditSoftwareItem, 'keywords'> }) {
  try {
    const resp = await createKeyword({
      keyword: data.keyword,
      token
    })
    if (resp.status === 201) {
      // do update here?
      if (data && data.pos) {
        // debugger
        updateKeyword(data.pos, {
          id: resp.message,
          software: data.software,
          keyword: data.keyword
        })
      }
      return addKeywordsToSoftware({
        data: [{
          software: data.software,
          // id of new keyword is in message
          keyword: resp.message
        }],
        token
      })
    }
    // debugger
    return resp
  } catch (e: any) {
    logger(`createKeywordAndAddToProject: ${e?.message}`, 'error')
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
    logger(`addLicensesForSoftware: ${e?.message}`, 'error')
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
    logger(`deleteLicenses: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
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
