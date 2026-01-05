// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useState, useEffect} from 'react'
import Link from 'next/link'
import {usePathname, useSearchParams} from 'next/navigation'
import Button from '@mui/material/Button'
import CookieTwoToneIcon from '@mui/icons-material/CookieTwoTone'

import logger from '~/utils/logger'
import {useMatomoConsent} from './useCookieConsent'
import {Matomo} from './getMatomoSettings'

type CookieConsentMatomoProps = {
  matomo: Matomo
}

// keep previousPath in memory
let previousUrl: string | null = null

/**
 * The CookieConsent component will only open when Matomo is used
 * and matomo cookies (mtm_consent or mtm_consent_removed) are not present
 * @returns
 */
export default function CookieConsentMatomo({matomo}: CookieConsentMatomoProps) {
  const {setMatomoConsent} = useMatomoConsent()
  const route = usePathname()
  const search = useSearchParams()
  const [open, setOpen] = useState(false)

  // console.group('CookieConsentModal')
  // console.log('matomo...', matomo)
  // console.log('route...', route)
  // console.log('open...', open)
  // console.groupEnd()

  useEffect(() => {
    try {
      if (localStorage) {
        const cookieConsent = localStorage.getItem('rsd_cookies_consent')
        const showModal = cookieConsent === null && matomo.id !== null && matomo.consent === null && route !== '/cookies'

        setOpen(showModal)
      }
    } catch (e: any) {
      // just show info log
      logger(`CookieConsentMatomo.useEffect...${e.message}`,'info')
    }
  },[matomo.id,matomo.consent,route])

  /**
   * This effect is used to register next router changes.
   * These route changes are not registered by Matomo automatically.
   * The function should be called after navigation is completed in order
   * to extract correct (dynamic) page title
   * https://matomo.org/faq/how-to/how-do-i-set-a-custom-url-using-the-matomo-javascript-tracker/
   * @param param0
   */
  useEffect(()=>{
    if (matomo?.id && matomo?.consent && // NOSONAR
      typeof window != 'undefined' && // NOSONAR
      typeof location != 'undefined' // NOSONAR
    ) {
      // extract push function from matomo/piwik
      const setValue = (window as any)?._paq?.push // NOSONAR

      // console.log('typeof setValue...', typeof setValue)
      if (typeof setValue === 'function') {
        // if location changed
        if (previousUrl !== location.href) {
          // set previous page/url if not null
          if (previousUrl !== null) setValue(['setReferrerUrl', previousUrl])
          // console.log('setReferrerUrl...', previousUrl)
          // set current page/url
          setValue(['setCustomUrl', location.href])
          // console.log('setCustomUrl...', href)
          // set page title
          setValue(['setDocumentTitle', document.title])
          // console.log('setDocumentTitle...', document.title)
          // this push triggers piwik.php script to track new page
          setValue(['trackPageView'])
          // console.group('CookieConsentMatomo.useEffect')
          // console.log('matomo.id...', matomo.id)
          // console.log('matomo.consent...', matomo.consent)
          // console.log('setReferrerUrl...', previousUrl)
          // console.log('setCustomUrl...', location.href)
          // console.log('setDocumentTitle...', document.title)
          // console.log('setValue...', setValue)
          // console.log('route...', route)
          // console.log('search...', search)
          // console.groupEnd()
          // save current url as previous url
          previousUrl = location.href
        }
      }
    }
  },[matomo.id,matomo.consent,route,search])

  // do not render if matomo is not used
  if (matomo.id === null) return null
  // do not render on cookies page (page uses MatomoTracking component)
  if (route === '/cookies') return null
  // do not render if user already answered consent question
  if (matomo.id && matomo.consent !== null) return null
  // Hide the consent modal on click
  if (!open) return null

  return (
    <div
      className="fixed bottom-0 right-0 animated animatedFadeInUp fadeInUp"
      data-testid="cookie-consent-matomo"
    >
      <div className="container mx-auto sm:px-20">
        <div className="border border-b-base-content border-t-4 border-x-4 border-b-0 bg-base-100 shadow-lg p-6 rounded-tr-3xl sm:w-96">
          <div className="flex justify-center mb-3">
            <CookieTwoToneIcon
              sx={{
                fill: 'var(--rsd-primary,#006649)',
                width:'5rem',
                height: '5rem'
              }}
            />
          </div>
          <span
            className="w-full block leading-normal text-base-800 text-md mb-3">We use&nbsp;
            <span className="text-primary">
              <Link href="/cookies" passHref target="_blank" className="text-primary" rel="noopener noreferrer">
                cookies
              </Link>
            </span> with&nbsp;
            <Link href="https://matomo.org/" target="_blank" className="text-primary" rel="noopener noreferrer">
              matomo.org
            </Link> to provide a better user experience. </span>
          <div className="flex items-center justify-between">
            <Link href="/cookies" passHref className="text-xs text-base-700 mr-1 hover:underline">
              Read more
            </Link>
            <div className="flex gap-4">
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  setMatomoConsent(false)
                  setOpen(false)
                }}
              >
                Decline
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  setMatomoConsent(true)
                  setOpen(false)
                }}
              >
                Accept
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
