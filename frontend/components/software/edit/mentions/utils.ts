// SPDX-FileCopyrightText: 2023 - 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

const DOI_REGEX = /(10(\.\w+)+)(\/|%2F)(\S+)/i
export const DOI_REGEX_STRICT = /^10(\.\w+)+\/\S+$/
const OPENALEX_ID_REGEX = /https:\/\/openalex\.org\/([WwAaSsIiCcPpFf]\d{3,13})/

export type SearchTermInfo = {
  term: string,
  type: 'doi' | 'title' | 'openalex'
}
export function extractSearchTerm(query: string): SearchTermInfo{

  const doiRegexMatch = DOI_REGEX.exec(query)
  if (doiRegexMatch != null) {
    return {term: doiRegexMatch[1] + '/' + doiRegexMatch[4], type: 'doi'}
  }
  const openalexRegexMatch = OPENALEX_ID_REGEX.exec(query)
  if (openalexRegexMatch != null) {
    return {term: openalexRegexMatch[0], type: 'openalex'}
  }
  // remove double spaces:
  query = query.trim()
  query = query.replaceAll(/\s+/g, ' ')
  return {term: query, type: 'title'}
}
