// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {Matomo} from './nodeCookies'

export function initMatomoCustomUrl() {
  // keep previousPath in memory
  let previousUrl: string | null = null
  /**
   * This function is used to register SPA router changes.
   * These route changes are not registerd by matomo automatically.
   * The function should be called after navigation is completed in order
   * to extract correct (dynamic) page title
   * https://matomo.org/faq/how-to/how-do-i-set-a-custom-url-using-the-matomo-javascript-tracker/
   * @param param0
   */
  function setCustomUrl({id, consent}: Matomo) {
    // console.group('setMatomoPage')
    // console.log('id...', id)
    // console.log('consent...', consent)
    // console.log('previousUrl...', previousUrl)
    if (id && consent &&
      typeof window != 'undefined' &&
      typeof location != 'undefined'
    ) {
      // extract push function from matomo/piwik
      const setValue = (window as any)?._paq?.push
      // console.log('typeof setValue...', typeof setValue)
      if (typeof setValue === 'function') {
        // extract current location
        const href = location.href
        // console.log('href...', href)
        // we use this method ONLY after initial landing
        // at initial landing we only save previousUrl
        if (previousUrl !== null && previousUrl !== href) {
          // set previous page/url
          setValue(['setReferrerUrl', previousUrl])
          // console.log('setReferrerUrl...', previousUrl)
          // set current page/url
          setValue(['setCustomUrl', href])
          // console.log('setCustomUrl...', href)
          // set page title
          setValue(['setDocumentTitle', document.title])
          // console.log('setDocumentTitle...', document.title)
          // this push triggers piwik.php script to track new page
          setValue(['trackPageView'])
        }
        // save current url as previuos url
        previousUrl=href
      }
    }
    // console.groupEnd()
  }
  return setCustomUrl
}
