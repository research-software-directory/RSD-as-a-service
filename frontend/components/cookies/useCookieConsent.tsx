// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useCallback, useEffect, useState} from 'react'
import logger from '~/utils/logger'

export function hasConsentCookie(name:string){
  try {
    const hasCookie = document.cookie
      .split(';')
      .some((item) => item.trim().startsWith(`${name}=`))
    return hasCookie
  } catch (e:any) {
    logger(`useCookieConsent.hasConsentCookie error: ${e.message}`, 'error')
    return false
  }
}

export function setConsentCookie(value:string,name:string='rsd_consent',path:string='/') {
  try {
    // match matomo cookie expiration time of 400 days
    const maxAgeInSeconds = 60 * 60 * 24 * (400)
    document.cookie = `${name}=${value};path=${path};SameSite=Lax;Secure;Max-Age=${maxAgeInSeconds};`
  } catch (e: any) {
    logger(`useCookieConsent.setConsentCookie error: ${e.message}`, 'error')
  }
}

export function useMatomoConsent() {
  const [usesMatomo, setUsesMatomo] = useState<boolean>()
  const [consent, setConsent] = useState<boolean>()

  useEffect(() => {
    // when matomo js script is injected
    // _pag object is present, see _document.tsx
    if ('_paq' in window) {

      setUsesMatomo(true)
    } else {
      setUsesMatomo(false)
    }
    if (document) {
      const consent = hasConsentCookie('mtm_consent')
      if (consent === false) {
        const declined = hasConsentCookie('mtm_consent_removed')
        if (declined===true) setConsent(false)
      } else {
        setConsent(consent)
      }
    }
  }, [])

  const setMatomoConsent = useCallback((value: boolean)=>{
    // Store cookie for in the local storage to avoid blocking by adblockers
    localStorage?.setItem('rsd_cookies_consent', JSON.stringify(value))
    if ('_paq' in window) {
      if (value === true) {
        (window as any)._paq.push(['rememberConsentGiven'])
      } else {
        (window as any)._paq.push(['forgetConsentGiven'])
      }
    }
    setConsent(value)
  },[])

  // console.group('useMatomoConsent')
  // console.log('usesMatomo...', usesMatomo)
  // console.log('matomoConsent...', consent)
  // console.groupEnd()

  return {
    usesMatomo,
    matomoConsent:consent,
    setMatomoConsent
  }
}
