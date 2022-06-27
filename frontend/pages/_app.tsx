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

import EmbedLayoutContext from '~/components/layout/embedLayoutContext'

// global CSS and tailwind
import '../styles/global.css'
// nprogress styles
import 'nprogress/nprogress.css'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

// extend Next app props interface with emotion cache
export interface MuiAppProps extends AppProps {
  emotionCache: EmotionCache
  session: Session
}

// define npgrogres setup, no spinner
// just a tiny bar at the top of the screen
nprogress.configure({showSpinner: false})

function RsdApp(props: MuiAppProps) {
  const {Component, emotionCache = clientSideEmotionCache, pageProps, session} = props
  const [options, setSnackbar] = useState(snackbarDefaults)
  //currently we support only default (light) and dark RSD theme for MUI
  const muiTheme = loadMuiTheme('default')
  const router = useRouter()
  // provide embed param to remove headers
  const {embed} = router.query
  const [embedMode, setEmbedMode] = useState(typeof embed !== 'undefined')

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
  }, [])

  // save location cookie
  if (typeof document != 'undefined') {
    saveLocationCookie()
  }

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
        <AuthProvider session={session}>
          <EmbedLayoutContext.Provider value={{embedMode,setEmbedMode}}>
          <PageSnackbarContext.Provider value={{options, setSnackbar}}>
            <Component {...pageProps} />
          </PageSnackbarContext.Provider>
          <PageSnackbar options={options} setOptions={setSnackbar} />
          </EmbedLayoutContext.Provider>
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}

/**
 * Extract session info from httpOnly cookie (server side)
 * @param appContext
 * @returns
 */
RsdApp.getInitialProps = async(appContext:AppContext) => {
  const appProps = await App.getInitialProps(appContext)
  const {req, res} = appContext.ctx

  // extract user session from cookies
  const session = getSessionSeverSide(req, res)

  // console.group('RsdApp.getInitialProps')
  // console.log('session...', session)
  // console.groupEnd()

  // return app props and session info from cookie
  return {
    ...appProps,
    session
  }
}

export default RsdApp
