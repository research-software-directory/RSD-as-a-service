// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useEffect, useState} from 'react'
import MentionsOverviewList from '~/components/admin/mentions/MentionsOverviewList'
import {extractSearchTerm, SearchTermInfo} from '~/components/software/edit/mentions/utils'
import Searchbox from '~/components/search/Searchbox'
import Pagination from '~/components/pagination/Pagination'
import usePaginationWithSearch from '~/utils/usePaginationWithSearch'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {paginationUrlParams} from '~/utils/postgrestUrl'

const uuidRegex = /^\w{8}-\w{4}-\w{4}-\w{4}-\w{12}$/

export default function MentionsOverview() {
  const [mentionList, setMentionList] = useState([])
  const {searchFor, page, rows, setCount} = usePaginationWithSearch('Find mentions')

  const sanitisedSearch = sanitiseSearch(searchFor)
  useEffect(() => {
    fetchAndSetMentionList(sanitisedSearch)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sanitisedSearch, page, rows])

  function fetchAndSetMentionList(sanitisedSearch: undefined | string): void {
    fetch(`/api/v1/mention?${createSearchQueryParameters(sanitisedSearch)}&${paginationUrlParams({rows, page})}`, {
      headers: {
        'Prefer': 'count=exact'
      }
    })
      .then(res => {
        setCount(extractCountFromHeader(res.headers) ?? 0)
        return res.json()
      })
      .then(arr => setMentionList(arr))
  }

  function createSearchQueryParameters(sanitisedSearch: undefined | string): string {
    if (sanitisedSearch === undefined) {
      return ''
    }

    if (uuidRegex.test(sanitisedSearch.trim())) {
      return `id=eq.${sanitisedSearch.trim().toLowerCase()}`
    }

    const searchTypeTerm: SearchTermInfo = extractSearchTerm(sanitisedSearch)
    const termEscaped = encodeURIComponent(sanitisedSearch)
    switch (searchTypeTerm.type) {
      case 'doi':
        return `doi=eq.${termEscaped}`
      case 'openalex':
        return `openalex_id=eq.${termEscaped}`
      case 'title':
        return `or=(title.ilike."*${termEscaped}*",authors.ilike."*${termEscaped}*",journal.ilike."*${termEscaped}*",url.ilike."*${termEscaped}*",note.ilike."*${termEscaped}*",openalex_id.ilike."*${termEscaped}*")`
    }
  }

  function sanitiseSearch(search: string): string | undefined {
    if (!search || search.length < 3 ) {
      return undefined
    }
    return search
  }

  return (
    <section className="flex-1">
      <div className="flex flex-wrap items-center justify-end">
        <Searchbox/>
        <Pagination/>
      </div>
      <div>
        <MentionsOverviewList list={mentionList} onUpdate={() => fetchAndSetMentionList(sanitisedSearch)}></MentionsOverviewList>
      </div>
    </section>
  )
}
