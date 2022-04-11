import {useEffect, useState} from 'react'
import router from 'next/router'
import App, {AppContext, AppProps} from 'next/app'
import Head from 'next/head'
import {ThemeProvider} from '@mui/material/styles'
import {CacheProvider, EmotionCache} from '@emotion/react'
import {rsdDarkMuiTheme, rsdMuiTheme} from '../styles/rsdMuiTheme'
import createEmotionCache from '../styles/createEmotionCache'
import {ThemeContext} from '~/components/layout/ThemeSwitcher'
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
  const [theme, toggleTheme] = useState('dark')

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
        {/* CssBaseline from MUI-5*/}
      <ThemeProvider theme={theme === 'dark' ? rsdDarkMuiTheme : rsdMuiTheme }>
        {/* <CssBaseline /> */}
        <AuthProvider session={session}>
          <PageSnackbarContext.Provider value={{options, setSnackbar}}>
            <ThemeContext.Provider value={{theme, toggleTheme}}>
              {/* TailwindCSS theme switcher*/}
              <div className={theme}>
                <Component {...pageProps} />
              </div>
            </ThemeContext.Provider>
          </PageSnackbarContext.Provider>
          <PageSnackbar options={options} setOptions={setSnackbar}/>
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
