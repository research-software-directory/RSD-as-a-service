// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useState, useEffect} from 'react'
import Button from '@mui/material/Button'

import {Matomo} from './nodeCookies'
import {useMatomoConsent} from './useCookieConsent'
import Link from 'next/link'
import CookieTwoToneIcon from '@mui/icons-material/CookieTwoTone'

type CookieConsentMatomoProps = {
  matomo: Matomo,
  route: string
}

/**
 * The CookieConsent component will only open when Matomo is used
 * and matomo cookies (mtm_consent or mtm_consent_removed) are not present
 * @returns
 */
export default function CookieConsentMatomo({matomo, route}: CookieConsentMatomoProps) {
  const {setMatomoConsent} = useMatomoConsent()
  const [open, setOpen] = useState(false)

  // do not show backdrop by default
  const [display, setDisplay] = useState('none')

  // console.group('CookieConsentModal')
  // console.log('matomo...', matomo)
  // console.log('route...', route)
  // console.log('open...', open)
  // console.groupEnd()

  useEffect(() => {
    // Check if the cookies consent has been granted or not by the user
    if (typeof window !== 'undefined') {
      const cookieConsent = localStorage.getItem('rsd_cookies_consent')
      setOpen(cookieConsent === null && matomo.id !== null && matomo.consent === null && route !== '/cookies')
    }

    // when JS is disabled we render this component on server side
    // but when the component is hydrated in FE AND matomo.id is present
    // AND JS is disabled the component does not function properly and only
    // the backdrop is shown. The backdrop blocks the minimal website functionality
    // in this case. Therefore, we start with display none and change to flex when
    // the component is successfully loaded on the frontend (and JS is enabled).
    setDisplay('flex')
  }, [])

  // do not render if matomo is not used
  if (matomo.id === null) return null
  // do not render on cookies page (page uses MatomoTracking component)
  if (route === '/cookies') return null
  // do not render if user already answered consent question
  if (matomo.id && matomo.consent !== null) return null
  // Hide the consent modal on click
  if (!open) return null

  return (
    <div className=" fixed bottom-0 right-0 animated animatedFadeInUp fadeInUp"
         data-testid="cookie-consent-matomo"
    >
      <div className="container mx-auto px-20 ">
        <div
          className="border border-b-base-content border-t-4 border-x-4 border-t-4 border-b-0 w-96 bg-white shadow-lg p-6">
          <div className="w-16 mx-auto relative -mt-10 mb-3">
            <CookieTwoToneIcon className="scale-[2]  mb-3" color="primary" fontSize="large"/>
          </div>
          <span
            className="w-full block leading-normal text-gray-800 text-md mb-3">We use&nbsp;
            <span className="text-primary">
                <Link href="/cookies" passHref>
                <a target="_blank" className="text-primary" rel="noopener noreferrer">
                     cookies
                </a></Link>
              </span> with&nbsp;
            <Link href="https://matomo.org/">
                <a target="_blank" className="text-primary" rel="noopener noreferrer">
                     matomo.org
                </a>
              </Link> to provide a better user experience. </span>
          <div className="flex items-center justify-between">
            <Link href="/cookies" passHref>
              <a className="text-xs text-gray-400 mr-1 hover:text-gray-800 hover:underline">
                Read more
              </a>
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
