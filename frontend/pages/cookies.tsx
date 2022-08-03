// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import {getCookie, setCookie} from 'react-use-cookie'
import DefaultLayout from '~/components/layout/DefaultLayout'
import useRsdSettings from '~/config/useRsdSettings'

export default function Cookies() {
  const matomoUrl = process.env.MATOMO_URL
  const matomoId = process.env.MATOMO_ID
  const matomoEnabled = matomoUrl !== undefined && matomoUrl.length !== 0
    && matomoId !== undefined && matomoId.length !== 0
  const {cookiesAccepted, setCookiesAccepted} = useRsdSettings()

  useEffect(
    () => {
      setCookiesAccepted(getCookie('cookie_consent') === 'true')
    },
    // call setCookiesAccepted only once, use an empty array
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const onDeclineMatomo = () => {
    if ('_paq' in window) {
      (window as any)._paq.push(['forgetConsentGiven'])
    }
    setCookie('cookie_consent', 'false')
    setCookiesAccepted(false)
  }

  const onAcceptMatomo = () => {
    if ('_paq' in window) {
      (window as any)._paq.push(['rememberConsentGiven'])
    }
    setCookie('cookie_consent', 'true')
    setCookiesAccepted(true)
  }

  const buttonClasses = 'rounded-full text-secondary bg-primary hover:bg-secondary hover:text-primary py-2 px-6'

  return (
    <DefaultLayout>
      <div className="p-12">
        <h1 className="mb-5">Cookies</h1>
        <p className="mb-5">
          Cookies are stored on the user&apos;s computer, from where they are
          sent to our website. This means that users have full control over the
          use of cookies. Users can deactivate or restrict the transmission of
          cookies by changing their web browser settings. Any cookies already
          stored can be deleted at any time. This can also be effected
          automatically. If cookies are deactivated for this website, it may
          no longer be possible to use all the website&apos;s functions in
          full.
        </p>

        { /* Matomo specific section */ }
        {
          matomoEnabled &&
          <h2 className="mb-5">Matomo Tracking</h2>
        }
        {
          matomoEnabled &&
          <p className="mb-5">
            Detailed information about Matomo&apos;s privacy settings is
            available at <a
              className="text-primary hover:text-secondary"
              target="_blank"
              href="https://matomo.org/docs/privacy"
              rel="noreferrer"
            >https://matomo.org/docs/privacy</a>.
          </p>
        }

        {
          matomoEnabled &&
          cookiesAccepted &&
          <p>
            <button onClick={onDeclineMatomo} className={buttonClasses}>
              Revoke tracking consent
            </button>
          </p>
        }

        {
          matomoEnabled &&
          !cookiesAccepted &&
          <p>
            <button onClick={onAcceptMatomo} className={buttonClasses}>
              Accept tracking
            </button>
          </p>
        }
      </div>
    </DefaultLayout>
  )
}
