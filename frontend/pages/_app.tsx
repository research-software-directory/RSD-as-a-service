// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect} from 'react'
import Router, {useRouter} from 'next/router'
import App, {AppContext, AppProps} from 'next/app'
import Head from 'next/head'
import {ThemeProvider} from '@mui/material/styles'
import {CacheProvider, EmotionCache} from '@emotion/react'
import {loadMuiTheme, RsdThemes} from '../styles/rsdMuiTheme'
import createEmotionCache from '../styles/createEmotionCache'
// loading bar at the top of the screen
import nprogress from 'nprogress'

// authentication
import {AuthProvider, Session, getSessionSeverSide} from '../auth'
import {saveLocationCookie} from '../auth/locationCookie'
// snackbar notifications
import MuiSnackbarProvider from '../components/snackbar/MuiSnackbarProvider'
// Matomo cookie consent notification
import CookieConsentMatomo from '~/components/cookies/CookieConsentMatomo'

// global CSS and tailwind
import '../styles/global.css'
// nprogress styles
import 'nprogress/nprogress.css'
import {RsdSettingsProvider} from '~/config/RsdSettingsContext'
import {RsdSettingsState} from '~/config/rsdSettingsReducer'
import {getPageLinks} from '~/components/page/useMarkdownPages'
import {getMatomoConsent,Matomo} from '~/components/cookies/nodeCookies'
import {initMatomoCustomUrl} from '~/components/cookies/setMatomoPage'

// extend Next app props interface with emotion cache
export interface MuiAppProps extends AppProps {
  emotionCache: EmotionCache
  session: Session,
  settings: RsdSettingsState,
  matomo: Matomo
}

// define npgrogres setup, no spinner
// just a tiny bar at the top of the screen
nprogress.configure({showSpinner: false})

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()
// Matomo cached settings passed via getInitialProps
// Note! getInitalProps does not always run server side
// so we keep the last obtained values in this object
const matomo: Matomo = {
  // extract matomo if from env and
  id: process.env.MATOMO_ID || null,
  consent: null
}
const setCustomUrl = initMatomoCustomUrl()
// init session
let session: Session | null = null
// ProgressBar at the top
// listen to route change and drive nprogress status
// it's taken out of RsdApp to be initialized only once
Router.events.on('routeChangeStart', (props) => {
  // console.log('routeChangeStart...props...', props)
  nprogress.start()
})
Router.events.on('routeChangeComplete', (path) => {
  // console.log('routeChangeComplete...path...', path)
  nprogress.done()
})
Router.events.on('routeChangeError', ()=>{
  nprogress.done()
})

function RsdApp(props: MuiAppProps) {
  const {
    Component, emotionCache = clientSideEmotionCache,
    pageProps, session, settings, matomo
  } = props
  //currently we support only default (light) and dark RSD theme for MUI
  const muiTheme = loadMuiTheme(settings.theme.mode as RsdThemes)
  const router = useRouter()

  // Matomo customUrl method
  // to register SPA route changes
  useEffect(()=>{
    if (matomo?.id) {
      setCustomUrl(matomo)
    }
  },[router.asPath,matomo])

  // save location cookie
  if (typeof document != 'undefined') {
    saveLocationCookie()
  }

  // console.group('RsdApp')
  // console.log('session...', session)
  // console.log('settings...', settings)
  // console.log('matomo...', matomo)
  // console.groupEnd()

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Research Software Directory</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      {/* MUI Theme provider */}
      <ThemeProvider theme={muiTheme}>
        {/* Authentication */}
        <AuthProvider session={session}>
          {/* RSD settings/config */}
          <RsdSettingsProvider settings={settings}>
            {/* MUI snackbar service */}
            <MuiSnackbarProvider>
              <Component {...pageProps} />
            </MuiSnackbarProvider>
          </RsdSettingsProvider>
        </AuthProvider>
        {/* Matomo cookie consent dialog */}
        <CookieConsentMatomo matomo={matomo} route={router.pathname} />
      </ThemeProvider>
    </CacheProvider>
  )
}

/**
 * Extract session info from httpOnly cookie (server side)
 * NOTE! initially it runs server side but moves to client side
 * when Link or router.push is used.
 * see https://nextjs.org/docs/api-reference/data-fetching/get-initial-props
 * Resolution order
  On the server:
  1. app.getInitialProps
  2. page.getInitialProps
  3. document.getInitialProps
  4. app.render
  5. page.render
  6. document.render

  On the server with error:
  1. document.getInitialProps
  2. app.render
  3. page.render
  4. document.render

  On the client
  1. app.getInitialProps
  2. page.getInitialProps
  3. app.render
  4. page.render
 * @param appContext
 * @returns
 */
RsdApp.getInitialProps = async(appContext:AppContext) => {
  const appProps = await App.getInitialProps(appContext)
  const {req, res} = appContext.ctx

  // extract user session from cookies and
  // matomo consent if matomo is used (id)
  // only in SSR mode (req && res present)
  if (req && res) {
    session = getSessionSeverSide(req, res)
    if (matomo.id) {
      matomo.consent = getMatomoConsent(req).matomoConsent
    }
  }

  // get embed mode
  // provide embed param to remove headers
  const {embed} = appContext.router.query
  // get links
  const links = await getPageLinks({is_published:true})
  // create rsd settings
  const settings = {
    embed: typeof embed !== 'undefined',
    links,
    theme: {
      mode: 'default',
      host: 'default'
    }
  }

  // console.group('RsdApp.getInitialProps')
  // console.log('session...', session)
  // console.log('settings...', settings)
  // console.log('matomo...', matomo)
  // console.groupEnd()

  // return app props and session info from cookie
  return {
    ...appProps,
    session,
    settings,
    matomo
  }
}

export default RsdApp
