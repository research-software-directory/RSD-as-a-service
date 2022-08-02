// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
//
// SPDX-License-Identifier: Apache-2.0

import CookieConsent from 'react-cookie-consent'

export default function MatomoCookieConsentDialog() {
  const onAccept = () => {
    if ('_paq' in window) {
      (window as any)._paq.push(['rememberConsentGiven'])
    }
  }

  const onDecline = () => {
    if ('_paq' in window) {
      (window as any)._paq.push(['forgetConsentGiven'])
    }
  }

  return (
    <CookieConsent
      location="bottom"
      overlay
      enableDeclineButton
      flipButtons
      disableButtonStyles
      buttonText="Accept"
      declineButtonText="Decline"
      buttonClasses="rounded-full bg-primary text-secondary hover:bg-secondary hover:text-primary py-2 px-6 mt-4 mb-4 ml-5 mr-2"
      declineButtonClasses="rounded-full bg-primary text-secondary hover:bg-secondary hover:text-primary py-2 px-6 mt-4 mb-4 ml-2 mr-5"
      contentClasses="pb-2"
      overlayClasses=""
      onAccept={onAccept}
      onDecline={onDecline}
    >
      We use cookies that are necessary for the basic functionality of our
      website so that it can be continuously optimized for you and its
      user-friendliness improved. We also use the Matomo web analysis tool,
      which tracks data anonymously. This enables us to statistically evaluate
      the use of our website.
    </CookieConsent>
  )
}
