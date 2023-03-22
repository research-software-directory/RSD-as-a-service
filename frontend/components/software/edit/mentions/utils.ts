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
  } catch (error) {
    if (error instanceof TypeError) return {term: query, type: 'title'}
    else throw error
  }
}
