// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Script from 'next/script'
import {MatomoSettings} from './getMatomoSettings'

type MatomoScriptProps = {
  matomo: MatomoSettings,
  nonce: string | null
}

export default function MatomoScript({matomo, nonce}:MatomoScriptProps) {

  if (matomo.id && matomo.url && nonce) {
    return (
      <Script
        id="matomo-script"
        strategy="lazyOnload"
        nonce={nonce}
      >
        {`
          var _paq = window._paq = window._paq || [];
          /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
          _paq.push(['requireConsent']);
          _paq.push(['trackPageView']);
          _paq.push(['enableLinkTracking']);
          (function() {
            var u="${matomo.url}";
            _paq.push(['setTrackerUrl', u+'piwik.php']);
            _paq.push(['setSiteId', '${matomo.id}']);
            var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
            g.async=true; g.nonce="${nonce}";g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
          })();
        `}
      </Script>
    )
  }

  return null
}
