// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {extractSearchTerm} from '~/components/software/edit/mentions/utils'
import {SearchResult} from '.'
import {getMentionsByDoiFromRsd} from '~/components/mention/apiEditMentions'
import {getDoiRAList, getItemsFromCrossref, getItemsFromDatacite, getItemsFromOpenAlex} from '~/utils/getDOI'
import {MentionItemProps} from '~/types/Mention'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'

export type DoiBulkImportReport = Map<string, SearchResult> | null

export async function validateInputList(doiList: string[], mentions: MentionItemProps[], token: string) {
  // here we put validation results for each doi from doiList
  const mentionResultPerDoi: DoiBulkImportReport = new Map()

  // create DOI list of valid entries eligible for further processing
  const validDois: string[] = doiList
    // filter out lines with white space only
    .filter(input => input.trim().length > 0)
    // validate that input is of type="doi"
    .map(input => extractSearchTerm(input))
    // filter valid DOI type entries
    .filter(search => {
      // debugger
      switch (search.type) {
        case 'doi': {
          // convert to lower case
          const doi = search.term.toLowerCase()
          // validate if not already included
          const found = mentions.find(mention => mention.doi?.toLowerCase() === doi)
          if (found) {
            // flag item with DOI already processed
            mentionResultPerDoi.set(doi, {doi, status: 'alreadyImported', include: false})
            return false
          }
          return true
        }
        case 'openalex':
        case 'title':
          // flag invalid DOI entries
          mentionResultPerDoi.set(search.term, {doi: search.term, status: 'invalidDoi', include: false})
          return false
      }
    })
    // extract DOI string from search info
    .map(search => search.term.toLowerCase())

  // if no valid DOIs left return report
  if (validDois.length === 0) {
    return mentionResultPerDoi
  }

  // FIND DOIs already in RSD
  const existingMentionsResponse = await getMentionsByDoiFromRsd({dois: validDois, token})
  if (existingMentionsResponse.status === 200) {
    const existingMentions = existingMentionsResponse.message as MentionItemProps[]
    // update mention results
    existingMentions.forEach(mention => {
      if (mention.doi !== null) {
        mentionResultPerDoi.set(mention.doi.toLowerCase(),
          {doi: mention.doi.toLowerCase(), status: 'valid', include: true, source: 'RSD', mention: mention}
        )
      }
    })
  }

  // DOI NOT IN RSD
  // valid DOIs not present in mentionResultPerDoi map at this point are not in RSD
  const doisNotInDatabase: string[] = validDois.filter(entry => !mentionResultPerDoi.has(entry))

  if (doisNotInDatabase.length > 0) {
    // getDoiRAList method
    const doiRas = await getDoiRAList(doisNotInDatabase)

    // classify dois by RA
    const crossrefDois: string[] = []
    const dataciteDois: string[] = []
    const openalexDois: string[] = []
    doiRas.forEach(doiRa => {
      const doi = doiRa.DOI.toLowerCase()
      if (doiRa?.RA === undefined || doiRa.RA === 'invalid doi' || doiRa.RA === 'doi does not exist' || doiRa.RA === 'unknown') {
        // Invalid DOI -> RA not found
        mentionResultPerDoi.set(doi, {doi, status: 'doiNotFound', include: false})
      } else if (doiRa.RA === 'Crossref') {
        crossrefDois.push(doi)
      } else if (doiRa.RA === 'DataCite') {
        dataciteDois.push(doi)
      } else {
        openalexDois.push(doi)
      }
    })

    // get mentions from crossref
    const crossrefMentions = await getItemsFromCrossref(crossrefDois)
    // update mention results
    crossrefMentions.forEach(mention => {
      if (mention.doi !== null) {
        const doi = mention.doi.toLowerCase()
        mentionResultPerDoi.set(doi, {
          doi,
          status: 'valid',
          source: 'Crossref',
          include: true,
          mention
        })
      }
    })

    // get mentions from datacite
    const dataciteMentions = await getItemsFromDatacite(dataciteDois)
    // update mention results
    dataciteMentions.forEach(mention => {
      if (mention.doi !== null) {
        const doi = mention.doi.toLowerCase()
        mentionResultPerDoi.set(doi, {
          doi,
          status: 'valid',
          source: 'DataCite',
          include: true,
          mention
        })
      }
    })

    const openalexMentions = await getItemsFromOpenAlex(openalexDois)
    openalexMentions.forEach(mention => {
      if (mention.doi !== null) {
        const doi = mention.doi.toLowerCase()
        mentionResultPerDoi.set(doi, {
          doi,
          status: 'valid',
          source: 'OpenAlex',
          include: true,
          mention
        })
      }
    })

    // flag dois that are not updated
    doisNotInDatabase.forEach(doi => {
      if (!mentionResultPerDoi.has(doi)) {
        mentionResultPerDoi.set(doi, {doi, status: 'unknown', include: false})
      }
    })
  }

  return mentionResultPerDoi
}

export async function linkMentionToEntity({ids, table, entityName, entityId, token}: {
  ids: string[], table: string, entityName: string, entityId: string, token: string
}) {
  try {
    const url = `/api/v1/${table}`
    const body = ids.map(id => ({[entityName]: entityId, mention: id}))
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'resolution=ignore-duplicates'
      },
      body: JSON.stringify(body)
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    return {
      status: 500,
      message: e.message
    }
  }
}

export async function addMentions({mentions, token}: {mentions: MentionItemProps[], token: string}) {
  try {
    const url = '/api/v1/mention'
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(mentions)
    })
    if (resp.status === 201) {
      const json: MentionItemProps[] = await resp.json()
      return {
        status: 200,
        message: json
      }
    }
    return extractReturnMessage(resp)
  } catch (e: any) {
    return {
      status: 500,
      message: e.message
    }
  }
}
