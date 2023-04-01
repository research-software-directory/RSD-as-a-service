// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

const doiRegex = /10(\.\w+)+\/\S+/

export type SearchTermInfo = {
  term: string,
  type: 'doi' | 'title'
}

export function extractSearchTerm(query: string): SearchTermInfo{
  const doiRegexMatch = query.match(doiRegex)
  if (doiRegexMatch != null) {
    return {term: doiRegexMatch[0], type: 'doi'}
  }
  // remove double spaces:
  query = query.trim()
  query = query.replaceAll(/\s+/g, ' ')
  return {term: query, type: 'title'}
}
