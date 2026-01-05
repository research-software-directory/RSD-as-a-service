// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ssrSoftwareParams} from '~/utils/extractQueryParam'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import FiltersPanel from '~/components/filter/FiltersPanel'
import PaginationLinkApp from '~/components/layout/PaginationLinkApp'
import {CommunityRequestStatus, getSoftwareForCommunity} from '~/components/communities/software/apiCommunitySoftware'
import {
  comSoftwareCategoriesFilter,
  comSoftwareKeywordsFilter,
  comSoftwareLanguagesFilter,
  comSoftwareLicensesFilter
} from '~/components/communities/software/filters/apiCommunitySoftwareFilters'
import {TabKey} from '~/components/communities/tabs/CommunityTabItems'
import CommunitySoftwareFilters from './filters'
import SearchCommunitySoftwareSection from './search'
import CommunitySoftwareOverview from './CommunitySoftwareOverview'

type CommunitySoftwareProps=Readonly<{
  tab: TabKey
  // community id
  communityId: string
  queryParams: {[key: string]: string | undefined}
  isMaintainer: boolean
}>

export default async function CommunitySoftware({
  queryParams,tab,communityId,isMaintainer
}:CommunitySoftwareProps) {

  // extract and decode query params
  const {search, keywords, prog_lang, licenses, categories, order, rows, page} = ssrSoftwareParams(queryParams)
  const {token,rsd_page_rows} = await getUserSettings()

  // decide on software filter
  let software_status:CommunityRequestStatus = 'pending'
  if (tab==='rejected') software_status = 'rejected'
  if (tab==='software') software_status = 'approved'

  const rowsPerPage = rows ?? rsd_page_rows ?? 12

  // get all data
  const [
    software,
    keywordsList,
    languagesList,
    licensesList,
    categoryList
  ] = await Promise.all([
    getSoftwareForCommunity({
      community:communityId,
      software_status,
      searchFor: search,
      keywords,
      prog_lang,
      licenses,
      categories,
      order,
      rows: rowsPerPage,
      page: page ? page-1 : 0,
      isMaintainer,
      token
    }),
    comSoftwareKeywordsFilter({
      id: communityId,
      software_status,
      search,
      keywords,
      prog_lang,
      licenses,
      categories,
      token
    }),
    comSoftwareLanguagesFilter({
      id: communityId,
      software_status,
      search,
      keywords,
      prog_lang,
      licenses,
      categories,
      token
    }),
    comSoftwareLicensesFilter({
      id: communityId,
      software_status,
      search,
      keywords,
      prog_lang,
      licenses,
      categories,
      token
    }),
    comSoftwareCategoriesFilter({
      id: communityId,
      software_status,
      search,
      keywords,
      prog_lang,
      licenses,
      categories,
      token
    })
  ])

  const pages = Math.ceil(software.count / rowsPerPage)

  // console.group('CommunitySoftware')
  // console.log('tab...', tab)
  // console.log('isMaintainer...', isMaintainer)
  // console.log('search...', search)
  // console.log('keywords...', keywords)
  // console.log('prog_lang...', prog_lang)
  // console.log('licenses...', licenses)
  // console.log('categories...', categories)
  // console.log('order...', order)
  // console.log('rows...', rows)
  // console.log('page...', page)
  // console.log('pages...', pages)
  // console.log('software...', software)
  // console.groupEnd()

  return (
    <div className="flex-1 grid md:grid-cols-[1fr_2fr] xl:grid-cols-[1fr_4fr] gap-4 mb-12">
      <FiltersPanel>
        <CommunitySoftwareFilters
          keywordsList={keywordsList}
          languagesList={languagesList}
          licensesList={licensesList}
          categoryList={categoryList}
        />
      </FiltersPanel>
      <div className="flex-1">
        {/* Search & mobile filter modal */}
        <SearchCommunitySoftwareSection
          count={software.count}
          keywordsList={keywordsList}
          languagesList={languagesList}
          licensesList={licensesList}
          categoryList={categoryList}
        />
        {/* software overview/content */}
        <CommunitySoftwareOverview
          software={software.data}
          isMaintainer={isMaintainer}
        />
        {/* Pagination */}
        <PaginationLinkApp
          count={pages}
          page={page ?? 1}
          className='mt-4'
        />
      </div>
    </div>
  )
}
