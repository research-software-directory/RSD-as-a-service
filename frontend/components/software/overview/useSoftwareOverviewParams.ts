// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'

import logger from '~/utils/logger'
import {ssrSoftwareParams} from '~/utils/extractQueryParam'
import {QueryParams, ssrViewUrl} from '~/utils/postgrestUrl'
import {useUserSettings} from '~/config/UserSettingsContext'

export default function useSoftwareOverviewParams() {
  const router = useRouter()
  const {rsd_page_rows, setPageRows} = useUserSettings()

  /**
 * NOTE! This hook is used on software and spotlight pages.
 * We use router pathname to extract the current page to use.
 * The default value is software page.
 * @returns string
 */
  function getCurrentPage(){
    try{
      // extract page from the path (segment 1)
      const paths = router.pathname?.split('/')
      const view = paths?.length > 0 ? paths[1] : 'software'
      return view
    }catch(e:any){
      logger(`getCurrentPage...${e.message}`,'warn')
      // default is software page
      return 'software'
    }
  }

  function createUrl(key: string, value: string | string[]) {
    // console.log('createUrl...',key,value, router.query)
    const params: QueryParams = {
      // take existing params from url (query)
      ...ssrSoftwareParams(router.query),
      [key]: value,
    }
    // on each param change we reset page
    if (key !== 'page') {
      params['page'] = 1
    }
    if (typeof params['rows'] === 'undefined' || params['rows'] === null) {
      // use value from user settings if none provided
      params['rows'] = rsd_page_rows
    }
    // construct and encode url with all query params
    const url = ssrViewUrl({
      view: getCurrentPage(),
      params: params
    })
    return url
  }

  function handleQueryChange(key: string, value: string | string[]) {
    const url = createUrl(key, value)
    if (key === 'rows'){
      // save number of rows in user settings (saves to cookie too)
      setPageRows(parseInt(value.toString()))
    }
    if (key === 'page') {
      // when changing page we scroll to top
      router.push(url,url,{scroll: true})
    } else {
      // update page url but keep scroll position
      router.push(url,url,{scroll: false})
    }
  }

  function resetFilters() {
    // remove params from url, keep order and keep scroll position
    const order = router.query['order'] ?? 'mention_cnt'
    const url = `${router.pathname}?order=${order}`
    router.push(url,url,{scroll: false})
  }

  return {
    handleQueryChange,
    resetFilters,
    createUrl
  }
}

