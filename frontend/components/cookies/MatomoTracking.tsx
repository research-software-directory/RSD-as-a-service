// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

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

  function renderSwitch() {
    return (
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
    )
  }

  // return nothing if there is no matomo active
  if (matomoId === null || typeof consent === 'undefined') return null

  return (
    <>
      <h2 className="mb-4">Anonymous statistics</h2>

      <p className="mb-4">
        We use Matomo web analysis tool to anonymously record page visits.
        The cookies allow us to count visits and traffic sources so we can measure
        and improve the performance of our site. They help us to know which pages
        are the most popular and see how visitors move around the site.
      </p>
      <p className="mb-4">
        All information these cookies collect is anonymous.
        If you do not allow these cookies we will not know when you have visited our site,
        and will not be able to monitor its performance.
        Your consent to the use of Matomo can be revoked at any time by
        setting the &quot;Allow anonymous statistics&quot; to off position.
      </p>

      {renderSwitch()}

      <p className="py-8">
        Detailed information about Matomo&apos;s privacy settings is
        available at <a
          className="text-primary hover:text-secondary"
          target="_blank"
          href="https://matomo.org"
          rel="noreferrer"
        >Matomo website</a>.
      </p>
    </>
  )
}
