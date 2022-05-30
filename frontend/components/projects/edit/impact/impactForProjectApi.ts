import logger from '~/utils/logger'
import {CrossrefSelectItem} from '~/types/Crossref'
import {WorkResponse} from '~/types/Datacite'
import {
  crossrefItemToMentionItem,
  getCrossrefItemsByTitle
} from '~/utils/getCrossref'
import {
  dataCiteGraphQLItemToMentionItem,
  getDataciteItemsByTitleGraphQL
} from '~/utils/getDataCite'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import {MentionItemProps} from '~/types/Mention'
import {addMentionItem} from '~/utils/editMentions'

export async function findPublicationByTitle({project, searchFor, token}:
  { project: string, searchFor: string, token: string }) {
  const promises = [
    getCrossrefItemsByTitle(searchFor),
    getDataciteItemsByTitleGraphQL(searchFor),
    searchForAvailableImpact({
      project,
      searchFor,
      token
    })
  ]
  // make requests
  const [crossref, datacite, rsd] = await Promise.all(promises)
  // convert crossref responses to MentionItems
  const crosrefItems = crossref?.map(item => {
    return crossrefItemToMentionItem(item as CrossrefSelectItem)
  })
  // convert datacite responses to MentionItems
  const dataciteItems = datacite?.map(item => {
    return dataCiteGraphQLItemToMentionItem(item as WorkResponse)
  })
  // change items source to RSD for ones pulled from RSD
  const rsdItems: MentionItemProps[] = rsd.map(item => ({
    ...item as MentionItemProps,
    source: 'RSD'
  }))
  // return results
  return [
    // RSD items at the top
    ...rsdItems,
    ...crosrefItems,
    ...dataciteItems
  ]
}

/**
 * Searching for items in mention table which are NOT assigned to impact of the project already.
 * @returns MentionItem[]
 */
export async function searchForAvailableImpact({project, searchFor, token}:
  { project: string, searchFor: string, token: string }) {
  const url = '/api/v1/rpc/search_impact_for_project'
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      body: JSON.stringify({
        project_id: project,
        search_text: searchFor
      })
    })
    // debugger
    if (resp.status === 200) {
      const json: MentionItemProps[] = await resp.json()
      return json
    }
    logger(`searchForAvailableImpact: 404 [${url}]`, 'error')
    return []
  } catch (e: any) {
    logger(`searchForAvailableImpact: ${e?.message}`, 'error')
    return []
  }
}

export async function addImpactItem({item, project, token}: { item: MentionItemProps, project: string, token: string }) {
  let mention: MentionItemProps
  // new item not in rsd
  if (item.id === null) {
    // add mention item to RSD
    const resp = await addMentionItem({
      mention: item,
      token
    })
    if (resp.status !== 201) {
      // exit
      return {
        status: resp.status,
        message: `Failed to add ${item.title}. ${resp.message}`
      }
    }
    // assign created mention item
    mention = resp.message
  } else {
    // use existing RSD item
    mention = item
  }
  // add mention item to impact table
  if (mention && mention.id) {
    const resp = await addImpactToProject({
      project,
      mention: mention.id,
      token
    })
    if (resp.status !== 200) {
      return {
        status: resp.status,
        message: `Failed to add ${item.title}. ${resp.message}`
      }
    } else {
      // return mention in message
      return {
        status: 200,
        message: mention
      }
    }
  }
  return {
    status: 500,
    message: 'Failed to save item'
  }
}

export async function addImpactToProject({mention, project, token}: { mention: string, project: string, token: string }) {
  const url = '/api/v1/impact_for_project'
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: createJsonHeaders(token),
      body: JSON.stringify({
        project,
        mention
      })
    })

    return extractReturnMessage(resp, mention)

  } catch (e: any) {
    logger(`addImpactToProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}

export async function removeImpactForProject({mention, project, token}:
  { mention: string, project: string, token: string }) {
  const url = `/api/v1/impact_for_project?project=eq.${project}&mention=eq.${mention}`
  try {
    const resp = await fetch(url, {
      method: 'DELETE',
      headers: createJsonHeaders(token)
    })

    return extractReturnMessage(resp, mention)

  } catch (e: any) {
    logger(`removeImpactForProject: ${e?.message}`, 'error')
    return {
      status: 500,
      message: e?.message
    }
  }
}
