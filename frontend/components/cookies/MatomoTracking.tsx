// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'

import {useEffect, useState} from 'react'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'

import {useMatomoConsent} from './useCookieConsent'

export type MatomoTrackingProps = {
  matomoId: string | null
  matomoConsent: boolean | null
}

export default function MatomoTracking({matomoId,matomoConsent}:MatomoTrackingProps) {
  const {setMatomoConsent} = useMatomoConsent()
  const [consent, setConsent]=useState<boolean>()

  // console.group('MatomoTracking')
  // console.log('matomoId...', matomoId)
  // console.log('matomoConsent...', matomoConsent)
  // console.log('consent...', consent)
  // console.groupEnd()

  useEffect(() => {
    if (matomoConsent === null) {
      // default value is OFF
      setMatomoConsent(false)

      setConsent(false)
    } else {
      setConsent(matomoConsent)
    }
  },[matomoConsent,setMatomoConsent])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const {checked} = event.target
    setMatomoConsent(checked)
    setConsent(checked)
  }

  // return nothing if there is no matomo active
  if (matomoId === null || typeof consent === 'undefined') return null

  return (
    <>
      <h2 className="mb-4">Tracking cookies</h2>

      <p className="mb-4">
        We use the <a
          className="text-primary hover:text-secondary"
          target="_blank"
          href="https://matomo.org"
          rel="noreferrer"
        >Matomo web analysis tool</a> to anonymously record page visits.
        Matomo is an open-source and self-hosted web analytics platform that allows us to collect
        information about visits to our web site. The collected data is only accessible to us and
        not shared with any commercial organization.
      </p>
      <p className="mb-4">
        We use this data to track which pages are the most popular and see how visitors move around the site.
        This allows us to estimate the impact of the research software listed on our site, as well as helping
        us improve the overall website performance.
      </p>
      <p className="mb-4">
        Matomo requires a functional cookie to remember if it is allowed to track you. If you do not accept
        being tracked (or block this cookie) we will not know when you have visited our site.
        If you give consent, Matomo will record anonymized information about your visit. It only stores the first
        half of your IP address, allowing us to estimate the country or region in which you are located.
        In addition, it collects information about which pages you visit, and what type of device you are
        using to visit our site.
      </p>
      <p className="mb-4">
        Your consent to be tracked by Matomo can be revoked at any time by setting the &quot;Allow anonymous statistics&quot; to off position.
      </p>

      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={consent}
              onChange={handleChange}
            />
          }
          label={`Allow anonymous statistics (${consent ? 'on' : 'off'})`}
        />
      </FormGroup>
    </>
  )
}
