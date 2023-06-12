// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react'
import Script from 'next/script'
import Document, {Html, Head, Main, NextScript, DocumentInitialProps} from 'next/document'
import createEmotionServer from '@emotion/server/create-instance'
import createEmotionCache from '../styles/createEmotionCache'
import {setContentSecurityPolicyHeader} from '~/utils/contentSecurityPolicy'

// extend type with nonce received from getInitialProps
type RsdDocumentInitialProps = DocumentInitialProps & {
  nonce: string
};

export default class MyDocument extends Document<RsdDocumentInitialProps>{
  readonly matomoUrl = process.env.MATOMO_URL
  readonly matomoId = process.env.MATOMO_ID

  render() {
    // extract nonce loaded by getInitialProps
    const {nonce} = this.props
    // console.group('MyDocument')
    // console.log('matomoId...', this.matomoId)
    // console.log('nonce...', nonce)
    // console.log('source...', source)
    // console.log('hash...', hash)
    // console.groupEnd()
    return (
      <Html lang="en">
        <Head nonce={nonce}>
          {/* Theme color for the browser, if it supports it, is REMOVED 2022-04-10 by Dusan */}
          {/* <meta name="theme-color" content={rsdMuiTheme.palette.primary.main} /> */}
          {/* PWA manifest.json for favicons */}
          <link rel="manifest" href="/manifest.json" />
          {/* mounted index.css with font definitions */}
          {/*eslint-disable-next-line @next/next/no-css-tags*/}
          <link href="/styles/index.css" rel="stylesheet" />
          {/*
            add support for gracefull fallback for aos animations when js is disabled
            NOTE! we use nonce to cover security audit
          */}
          <noscript dangerouslySetInnerHTML={{__html: `
            <style
              nonce="${nonce}"
              type="text/css">
              [data-aos] {
              opacity: 1 !important;
              transform: translate(0) scale(1) !important;
            }
            </style>
          `}} />
          {
            /* Matomo Tracking Code
               NOTE! we use nonce to cover security audit
               we use next Script tag to load script async (non-blocking)
            */
            this.matomoUrl !== undefined && this.matomoUrl.length !== 0 &&
            this.matomoId !== undefined && this.matomoId.length !== 0 &&
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
                  var u="${this.matomoUrl}";
                  _paq.push(['setTrackerUrl', u+'piwik.php']);
                  _paq.push(['setSiteId', '${this.matomoId}']);
                  var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
                  g.async=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
                })();
              `}
            </Script>
          }
        </Head>
        <body className="dark">
          <Main />
          <NextScript nonce={nonce}/>
        </body>
      </Html>
    )
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
// Resolution order
// On the server:
// 1. app.getInitialProps
// 2. page.getInitialProps
// 3. document.getInitialProps
// 4. app.render
// 5. page.render
// 6. document.render

// On the server with error:
// 1. document.getInitialProps
// 2. app.render
// 3. page.render
// 4. document.render

// On the client
// 1. app.getInitialProps
// 2. page.getInitialProps
// 3. app.render
// 4. page.render
MyDocument.getInitialProps = async (ctx) => {
  const originalRenderPage = ctx.renderPage

  // set security policy and get nonce to use
  const nonce:string = setContentSecurityPolicyHeader(ctx.res)

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache(nonce)
  const {extractCriticalToChunks} = createEmotionServer(cache)

  ctx.renderPage = () =>
    originalRenderPage({
      // eslint-disable-next-line react/display-name
      enhanceApp: (App:any) => (props) => <App emotionCache={cache} {...props} />,
    })

  const initialProps = await Document.getInitialProps(ctx)

  // This is important. It prevents emotion to render invalid HTML.
  // See https://github.com/mui-org/material-ui/issues/26561#issuecomment-855286153
  const emotionStyles = extractCriticalToChunks(initialProps.html)
  const emotionStyleTags = emotionStyles.styles.map((style:any) => (
    <style
      data-emotion={`${style.key} ${style.ids.join(' ')}`}
      key={style.key}
      // pass nonce for security headers
      nonce={nonce}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{__html: style.css}}
    />
  ))

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), ...emotionStyleTags],
    nonce
  }
}
