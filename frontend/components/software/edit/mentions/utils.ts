// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

const doiRegex = /10(\.\w+)+\/\S+/

export function extractSearchTerm(query: string): {term: string, type: 'doi' | 'title' | 'url'} {
  const doiRegexMatch = query.match(doiRegex)
  if (doiRegexMatch != null) {
    return {term: doiRegexMatch[0], type: 'doi'}
  }

  query = query.trim()
  try {
    new URL(query)
    return {term: query, type: 'url'}
  } catch (error: any) {
    // we assume the only error that can be caught is due to the query not being a URL
    // if we get problems here, we need to handle different error types here
    // with e.g. if (error.constructor.name === 'TypeError') {}
    // remove double spaces:
    query = query.replaceAll(/\s+/g, ' ')
    return {term: query, type: 'title'}
  }
}
