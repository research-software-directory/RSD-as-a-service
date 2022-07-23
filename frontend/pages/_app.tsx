// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState, useMemo} from 'react'
import {useRouter} from 'next/router'
import App, {AppContext, AppProps} from 'next/app'
import Head from 'next/head'
import {ThemeProvider} from '@mui/material/styles'
import {CacheProvider, EmotionCache, Global} from '@emotion/react'
import {loadMuiTheme} from '../styles/rsdMuiTheme'
import createEmotionCache from '../styles/createEmotionCache'
// loading bar at the top of the screen
import nprogress from 'nprogress'

// authentication
import {AuthProvider, Session, getSessionSeverSide} from '../auth'
import {saveLocationCookie} from '../auth/locationCookie'
// snackbar notifications
import PageSnackbar from '../components/snackbar/PageSnackbar'
import PageSnackbarContext, {snackbarDefaults} from '../components/snackbar/PageSnackbarContext'

// global CSS and tailwind
import '../styles/global.css'

import {RsdSettingsProvider} from '~/config/RsdSettingsContext'
import {RsdSettingsState} from '~/config/rsdSettingsReducer'
import {getSettingsServerSide} from '~/config/getSettingsServerSide'

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
  const router = useRouter()
  const [options, setSnackbar] = useState(snackbarDefaults)
  /**
   * NOTE! useState keeps settings and session values in memory after inital load (server side)
   * getInitalProps runs ONLY on client side when page does not use getServerSideProps.
   * In that case we cannot extract session from JWT cookie and settings that use node env variables.
   */
  const [rsdSession] = useState(session)
  const [rsdSettings] = useState(settings)
  // request theme when options changed
  const {muiTheme, cssVariables} = useMemo(() => {
    return loadMuiTheme(rsdSettings.theme)
  }, [rsdSettings.theme])

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
  // console.log('rsdSettings...', rsdSettings)
  // console.log('rsdSession...', rsdSession)
  // console.groupEnd()

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Research Software Directory</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      {/* MUI Theme provider */}
      <ThemeProvider theme={muiTheme}>
        {/* CssBaseline from MUI-5*/}
        {/* <CssBaseline /> */}
        {/* dynamically pass css variables when theme changes */}
        <Global styles={cssVariables} />
        <AuthProvider session={rsdSession}>
          <RsdSettingsProvider settings={rsdSettings}>
          <PageSnackbarContext.Provider value={{options, setSnackbar}}>
            <Component {...pageProps} />
          </PageSnackbarContext.Provider>
          <PageSnackbar options={options} setOptions={setSnackbar} />
          </RsdSettingsProvider>
        </AuthProvider>
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
  // extract rsd settings
  const settings = await getSettingsServerSide(req, appContext.router.query)

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
