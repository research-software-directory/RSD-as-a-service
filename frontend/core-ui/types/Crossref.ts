// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
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

export const crossrefType = {
  'book-section':{
    'id': 'book-section',
    'label': 'Book Section'
  },
  'monograph':{
    'id': 'monograph',
    'label': 'Monograph'
  },
  'report':{
    'id': 'report',
    'label': 'Report'
  },
  'peer-review':{
    'id': 'peer-review',
    'label': 'Peer Review'
  },
  'book-track':{
    'id': 'book-track',
    'label': 'Book Track'
  },
  'journal-article':{
    'id': 'journal-article',
    'label': 'Journal Article'
  },
  'book-part':{
    'id': 'book-part',
    'label': 'Part'
  },
  'other':{
    'id': 'other',
    'label': 'Other'
  },
  'book':{
    'id': 'book',
    'label': 'Book'
  },
  'journal-volume':{
    'id': 'journal-volume',
    'label': 'Journal Volume'
  },
  'book-set':{
    'id': 'book-set',
    'label': 'Book Set'
  },
  'reference-entry':{
    'id': 'reference-entry',
    'label': 'Reference Entry'
  },
  'proceedings-article':{
    'id': 'proceedings-article',
    'label': 'Proceedings Article'
  },
  'journal':{
    'id': 'journal',
    'label': 'Journal'
  },
  'component':{
    'id': 'component',
    'label': 'Component'
  },
  'book-chapter':{
    'id': 'book-chapter',
    'label': 'Book Chapter'
  },
  'proceedings-series':{
    'id': 'proceedings-series',
    'label': 'Proceedings Series'
  },
  'report-series':{
    'id':'report-series',
    'label': 'Report Series'
  },
  'proceedings':{
    'id': 'proceedings',
    'label': 'Proceedings'
  },
  'standard':{
    'id': 'standard',
    'label': 'Standard'
  },
  'reference-book':{
    'id': 'reference-book',
    'label': 'Reference Book'
  },
  'posted-content':{
    'id': 'posted-content',
    'label': 'Posted Content'
  },
  'journal-issue':{
    'id': 'journal-issue',
    'label': 'Journal Issue'
  },
  'dissertation':{
    'id': 'dissertation',
    'label': 'Dissertation'
  },
  'grant':{
    'id': 'grant',
    'label': 'Grant'
  },
  'dataset':{
    'id': 'dataset',
    'label': 'Dataset'
  },
  'book-series':{
    'id': 'book-series',
    'label': 'Book Series'
  },
  'edited-book':{
    'id': 'edited-book',
    'label': 'Edited Book'
  },
  'standard-series':{
    'id': 'standard-series',
    'label': 'Standard Series'
  }
}


// crossref metadata types
// as received from https://api.crossref.org/types
// const crossrefTypes = [
//   {
//     'id': 'book-section',
//     'label': 'Book Section'
//   },
//   {
//     'id': 'monograph',
//     'label': 'Monograph'
//   },
//   {
//     'id': 'report',
//     'label': 'Report'
//   },
//   {
//     'id': 'peer-review',
//     'label': 'Peer Review'
//   },
//   {
//     'id': 'book-track',
//     'label': 'Book Track'
//   },
//   {
//     'id': 'journal-article',
//     'label': 'Journal Article'
//   },
//   {
//     'id': 'book-part',
//     'label': 'Part'
//   },
//   {
//     'id': 'other',
//     'label': 'Other'
//   },
//   {
//     'id': 'book',
//     'label': 'Book'
//   },
//   {
//     'id': 'journal-volume',
//     'label': 'Journal Volume'
//   },
//   {
//     'id': 'book-set',
//     'label': 'Book Set'
//   },
//   {
//     'id': 'reference-entry',
//     'label': 'Reference Entry'
//   },
//   {
//     'id': 'proceedings-article',
//     'label': 'Proceedings Article'
//   },
//   {
//     'id': 'journal',
//     'label': 'Journal'
//   },
//   {
//     'id': 'component',
//     'label': 'Component'
//   },
//   {
//     'id': 'book-chapter',
//     'label': 'Book Chapter'
//   },
//   {
//     'id': 'proceedings-series',
//     'label': 'Proceedings Series'
//   },
//   {
//     'id': 'report-series',
//     'label': 'Report Series'
//   },
//   {
//     'id': 'proceedings',
//     'label': 'Proceedings'
//   },
//   {
//     'id': 'standard',
//     'label': 'Standard'
//   },
//   {
//     'id': 'reference-book',
//     'label': 'Reference Book'
//   },
//   {
//     'id': 'posted-content',
//     'label': 'Posted Content'
//   },
//   {
//     'id': 'journal-issue',
//     'label': 'Journal Issue'
//   },
//   {
//     'id': 'dissertation',
//     'label': 'Dissertation'
//   },
//   {
//     'id': 'grant',
//     'label': 'Grant'
//   },
//   {
//     'id': 'dataset',
//     'label': 'Dataset'
//   },
//   {
//     'id': 'book-series',
//     'label': 'Book Series'
//   },
//   {
//     'id': 'edited-book',
//     'label': 'Edited Book'
//   },
//   {
//     'id': 'standard-series',
//     'label': 'Standard Series'
//   }
// ]

// type CrossrefTypes = typeof crossrefTypes
