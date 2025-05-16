// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ParsedUrlQuery} from 'querystring'

import logger from '~/utils/logger'
import {extractCountFromHeader} from '~/utils/extractCountFromHeader'
import {createJsonHeaders, extractReturnMessage, getBaseUrl} from '~/utils/fetchHelpers'
import {baseQueryString} from '~/utils/postgrestUrl'
import {ssrSoftwareParams} from '~/utils/extractQueryParam'
import {getKeywordsByCommunity} from '~/components/communities/settings/general/apiCommunityKeywords'
import {CommunityListProps} from '~/components/communities/apiCommunities'
import {comSoftwareCategoriesFilter, comSoftwareKeywordsFilter, comSoftwareLanguagesFilter, comSoftwareLicensesFilter} from './filters/apiCommunitySoftwareFilters'
import {getSoftwareOrderOptions} from './filters/OrderCommunitySoftwareBy'

export type CommunityRequestStatus='approved'|'pending'|'rejected'

export type SoftwareForCommunityParams = {
  community: string,
  software_status: CommunityRequestStatus
  searchFor?: string
  keywords?: string[] | null
  prog_lang?: string[] | null
  licenses?: string[] | null
  categories?: string[] | null
  order?: string
  page: number,
  rows: number,
  isMaintainer: boolean
  token?: string,
}

export type SoftwareOfCommunity = {
  id: string
  slug: string
  brand_name: string
  short_statement: string
  image_id: string|null
  is_published: boolean
  updated_at: string
  status: CommunityRequestStatus
  keywords: string[],
  prog_lang: string[],
  categories: string[],
  licenses: string,
  contributor_cnt: number | null
  mention_cnt: number | null
}

export async function getSoftwareForCommunity({
  community, searchFor, keywords, prog_lang,
  licenses, categories, order, page, rows, token,
  isMaintainer, software_status
}: SoftwareForCommunityParams) {
  try {
    // baseUrl
    const baseUrl = getBaseUrl()
    let url = `${baseUrl}/rpc/software_by_community?community_id=${community}`
    // SEARCH
    if (searchFor) {
      // use different RPC for search
      const encodedSearch = encodeURIComponent(searchFor)
      url = `${baseUrl}/rpc/software_by_community_search?community_id=${community}&search=${encodedSearch}`
    }
    // filter for status
    url+= `&status=eq.${software_status}`
    // filter for approved only if not maintainer
    if (!isMaintainer) {
      url += '&is_published=eq.true'
    }
    // FILTERS
    const filters = baseQueryString({
      keywords,
      prog_lang,
      licenses,
      categories,
      limit: rows,
      offset: page ? page * rows : undefined
    })
    if (filters) {
      url += `&${filters}`
    }
    // ORDER
    if (order) {
      // extract order direction from definitions
      const orderInfo = getSoftwareOrderOptions(isMaintainer).find(item=>item.key===order)
      // ordering options require "stable" secondary order
      // to ensure proper pagination. We use slug for this purpose
      if (orderInfo) url += `&order=${order}.${orderInfo.direction},slug.asc`
    }else {
      // default order is mentions count
      url += '&order=mention_cnt.desc.nullslast,slug.asc'
    }
    // console.log('getSoftwareForCommunity...url...', url)
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
        // request record count to be returned
        // note: it's returned in the header
        'Prefer': 'count=exact'
      }
    })
    if ([200, 206].includes(resp.status)) {
      const json: SoftwareOfCommunity[] = await resp.json()
      return {
        count: extractCountFromHeader(resp.headers) ?? 0,
        data: json
      }
    }
    // otherwise request failed
    logger(`getSoftwareForCommunity: ${resp.status} ${resp.statusText}`, 'warn')
    // we log and return zero
    return {
      count: 0,
      data: []
    }
  } catch (e: any) {
    // otherwise request failed
    logger(`getSoftwareForCommunity: ${e.message}`, 'error')
    // we log and return zero
    return {
      count: 0,
      data: []
    }
  }
}

type SsrCommunitySoftwareDataProps={
  community: CommunityListProps,
  software_status: CommunityRequestStatus
  query: ParsedUrlQuery
  isMaintainer: boolean
  token?: string
  rsd_page_rows?: number
}

/**
 * Get community software page data server side.
 */
export async function ssrCommunitySoftwareProps({
  community,software_status,query,isMaintainer,token,rsd_page_rows
}:SsrCommunitySoftwareDataProps){
  try{
    // extract and decode query params
    const {search, keywords, prog_lang, licenses, categories, order, rows, page} = ssrSoftwareParams(query)

    // get other data
    const [
      software,
      keywordsList,
      languagesList,
      licensesList,
      categoryList,
      communityKeywords
    ] = await Promise.all([
      getSoftwareForCommunity({
        community: community.id,
        software_status,
        searchFor: search,
        keywords,
        prog_lang,
        licenses,
        categories,
        order,
        rows: rows ?? rsd_page_rows ?? 12,
        page: page ? page-1 : 0,
        isMaintainer,
        token
      }),
      comSoftwareKeywordsFilter({
        id: community.id,
        software_status,
        search,
        keywords,
        prog_lang,
        licenses,
        categories,
        token
      }),
      comSoftwareLanguagesFilter({
        id: community.id,
        software_status,
        search,
        keywords,
        prog_lang,
        licenses,
        categories,
        token
      }),
      comSoftwareLicensesFilter({
        id: community.id,
        software_status,
        search,
        keywords,
        prog_lang,
        licenses,
        categories,
        token
      }),
      comSoftwareCategoriesFilter({
        id: community.id,
        software_status,
        search,
        keywords,
        prog_lang,
        licenses,
        categories,
        token
      }),
      getKeywordsByCommunity(community.id,token)
    ])

    return{
      isMaintainer,
      software,
      keywordsList,
      languagesList,
      licensesList,
      categoryList,
      community:{
        ...community,
        // use keywords for editing
        keywords: communityKeywords
      }
    }

  }catch(e:any){
    // otherwise request failed
    logger(`ssrCommunitySoftwareProps: ${e.message}`, 'error')
    // we log and return zero
    return {
      isMaintainer: false,
      communityKeywords:[],
      software:{
        count:0,
        data: []
      },
      keywordsList:[],
      languagesList:[],
      licensesList:[],
      categoryList:[],
      community
    }
  }
}


export async function patchSoftwareForCommunity({software, community, data, token}:
  { software: string, community: string, data: any, token: string }) {
  try {
    const query = `software=eq.${software}&community=eq.${community}`
    const url = `${getBaseUrl()}/software_for_community?${query}`
    const resp = await fetch(url, {
      method: 'PATCH',
      headers: {
        ...createJsonHeaders(token),
        'Prefer': 'return=headers-only'
      },
      body: JSON.stringify(data)
    })
    return extractReturnMessage(resp)
  } catch (e: any) {
    // debugger
    return {
      status: 500,
      message: e?.message
    }
  }
}
