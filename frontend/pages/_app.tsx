// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {useRouter} from 'next/router'
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
import PageSnackbar from '../components/snackbar/PageSnackbar'
import PageSnackbarContext, {snackbarDefaults} from '../components/snackbar/PageSnackbarContext'
import CookieConsentMessage from '~/components/cookies/CookieConsentMessage'

// global CSS and tailwind
import '../styles/global.css'
// nprogress styles
import 'nprogress/nprogress.css'
import {RsdSettingsProvider} from '~/config/RsdSettingsContext'
import {RsdSettingsState} from '~/config/rsdSettingsReducer'
import {getPageLinks} from '~/components/page/useMarkdownPages'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

// extend Next app props interface with emotion cache
export interface MuiAppProps extends AppProps {
  emotionCache: EmotionCache
  session: Session,
  settings: RsdSettingsState
}

// define npgrogres setup, no spinner
// just a tiny bar at the top of the screen
nprogress.configure({showSpinner: false})

function RsdApp(props: MuiAppProps) {
  const {
    Component, emotionCache = clientSideEmotionCache,
    pageProps, session, settings
  } = props
  const [options, setSnackbar] = useState(snackbarDefaults)
  //currently we support only default (light) and dark RSD theme for MUI
  const muiTheme = loadMuiTheme(settings.theme.mode as RsdThemes)
  const router = useRouter()

  useEffect(()=>{
    router.events.on('routeChangeStart', ()=>{
      nprogress.start()
    })
    router.events.on('routeChangeComplete', ()=>{
      nprogress.done()
    })
    router.events.on('routeChangeError', ()=>{
      nprogress.done()
    })
    return () => {
      // on effect teardown
      nprogress.done()
    }
  })

  // save location cookie
  if (typeof document != 'undefined') {
    saveLocationCookie()
  }

  // console.group('RsdApp')
  // console.log('session...', session)
  // console.log('settings...', settings)
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
            <PageSnackbarContext.Provider value={{options, setSnackbar}}>
              <Component {...pageProps} />
            </PageSnackbarContext.Provider>
            <PageSnackbar options={options} setOptions={setSnackbar}/>
          </RsdSettingsProvider>
        </AuthProvider>
        <CookieConsentMessage route={router.pathname} />
      </ThemeProvider>
    </CacheProvider>
  )
}

/**
 * Extract session info from httpOnly cookie (server side)
 * NOTE! initially it runs server side but moves to client side
 * when Link or router.push is used.
 * see https://nextjs.org/docs/api-reference/data-fetching/get-initial-props
 * @param appContext
 * @returns
 */
RsdApp.getInitialProps = async(appContext:AppContext) => {
  const appProps = await App.getInitialProps(appContext)
  const {req, res} = appContext.ctx

  // extract user session from cookies
  const session = getSessionSeverSide(req, res)

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
  // console.groupEnd()

  // return app props and session info from cookie
  return {
    ...appProps,
    session,
    settings
  }
}

export default RsdApp
