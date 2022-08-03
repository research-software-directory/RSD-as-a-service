// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import * as React from 'react'
import Document, {Html, Head, Main, NextScript} from 'next/document'
import createEmotionServer from '@emotion/server/create-instance'
import createEmotionCache from '../styles/createEmotionCache'

export default class MyDocument extends Document {
  readonly hotjarId = process.env.HOTJAR_ID
  readonly matomoUrl = process.env.MATOMO_URL
  readonly matomoId = process.env.MATOMO_ID

  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Theme color for the browser, if it supports it, is REMOVED 2022-04-10 by Dusan */}
          {/* <meta name="theme-color" content={rsdMuiTheme.palette.primary.main} /> */}
          {/* Roboto fonts */}
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:100,300,400&display=swap"
          />
          <link href="https://fonts.googleapis.com/css2?family=Work+Sans:wght@700&display=swap" rel="stylesheet" />
          {/* add support for gracefull fallback for aos animations when js is disabled */}
          <noscript dangerouslySetInnerHTML={{__html: `
            <style type="text/css">
              [data-aos] {
              opacity: 1 !important;
              transform: translate(0) scale(1) !important;
            }
            </style>
          `}} />

          {
            /* Hotjar Tracking Code */
            this.hotjarId !== undefined && this.hotjarId.length !== 0 &&
            <script
              dangerouslySetInnerHTML={{__html: `
              (function(h,o,t,j,a,r){
                    h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                    h._hjSettings={hjid:${parseInt(this.hotjarId)},hjsv:6};
                    a=o.getElementsByTagName('head')[0];
                    r=o.createElement('script');r.async=1;
                    r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                    a.appendChild(r);
                })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
              `,
              }}
            />
          }

          {
            /* Matomo Tracking Code */
            this.matomoUrl !== undefined && this.matomoUrl.length !== 0 &&
            this.matomoId !== undefined && this.matomoId.length !== 0 &&
            <script
              dangerouslySetInnerHTML={{__html: `
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
                `,
              }}
            />
          }

        </Head>
        <body className="dark">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

// `getInitialProps` belongs to `_document` (instead of `_app`),
// it's compatible with static-site generation (SSG).
MyDocument.getInitialProps = async (ctx) => {
  // Resolution order
  //
  // On the server:
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. document.getInitialProps
  // 4. app.render
  // 5. page.render
  // 6. document.render
  //
  // On the server with error:
  // 1. document.getInitialProps
  // 2. app.render
  // 3. page.render
  // 4. document.render
  //
  // On the client
  // 1. app.getInitialProps
  // 2. page.getInitialProps
  // 3. app.render
  // 4. page.render

  const originalRenderPage = ctx.renderPage

  // You can consider sharing the same emotion cache between all the SSR requests to speed up performance.
  // However, be aware that it can have global side effects.
  const cache = createEmotionCache()
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
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{__html: style.css}}
    />
  ))

  return {
    ...initialProps,
    // Styles fragment is rendered after the app and page rendering finish.
    styles: [...React.Children.toArray(initialProps.styles), ...emotionStyleTags],
  }
}
