// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

type MessageType = 'funder' | 'prefix' | 'member' | 'work' | 'work-list' | 'funder-list' | 'prefix-list' | 'member-list'

type CrossrefAuthor = {
  ORCID?: string
  suffix?: string
  given?:	string
  family: string
  affiliation: string[]
  name?: string
  prefix?: string
  sequence: string
}

type DatePart = [number,number?,number?]

export type CrossrefSelectItem = {
  DOI:string
  ISBN: string[]
  URL: string
  author: CrossrefAuthor[]
  page?: string
  published: {
    'date-parts': DatePart[]
  }
  publisher: string
  'container-title': string[]
  subject: string[]
  title: string[]
  type: string
}

type CrossrefMessageList = {
  'facets': any,
  'total-results': number,
  'items': CrossrefSelectItem[]
}


export type CrossrefResponse = {
  'status': string
  'message-type': MessageType
  'message-version': string,
  'message': CrossrefMessageList
}

// based on swagger documentation
// https://api.crossref.org/swagger-ui/index.html#/Works/get_works
export const crossrefSelectProps = [
  'DOI',
  'ISBN',
  // 'ISSN',
  'URL',
  // 'abstract',
  'author',
  // 'funder',
  // 'group-title',
  // 'is-referenced-by-count',
  // 'issue',
  // 'issued',
  // 'original-title',
  // pages of the book/article
  'page',
  // publishing date in the object date-parts = [YYYY,MM,DD]
  'published',
  // published-online
  // published-print
  'publisher',
  // publisher-location
  // reference
  // references-count
  // relation
  // score
  // short-container-title
  // 'short-title',
  // standards-body
  // array of subjects
  'subject',
  // 'subtitle',
  'title',
  // translator
  'type',
  // update-policy
  // update-to
  // updated-by
  // volume
]

