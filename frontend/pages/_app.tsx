import {useEffect} from 'react'
import router from 'next/router'
import {SessionProvider} from 'next-auth/react'
import Head from 'next/head'
import {AppProps} from 'next/app'
import {ThemeProvider} from '@mui/material/styles'
// import CssBaseline from '@mui/material/CssBaseline'
import {CacheProvider, EmotionCache} from '@emotion/react'
import {rsdMuiTheme} from '../styles/rsdMuiTheme'
import createEmotionCache from '../styles/createEmotionCache'
// show loading bar at the top of the screen
import nprogress from 'nprogress'

// global CSS and tailwind
import '../styles/global.css'
// nprogress styles
import 'nprogress/nprogress.css'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

// extend Next app props interface with emotion cache
export interface MuiAppProps extends AppProps{
  emotionCache: EmotionCache
}

// define npgrogres setup, no spinner
// just a tiny bar at the top of the screen
nprogress.configure({showSpinner:false})

export default function RsdApp(props:MuiAppProps) {
  const {Component, emotionCache = clientSideEmotionCache, pageProps} = props
  const {pageProps:{session}} = props
  // console .log("session...", JSON.stringify(session))
  useEffect(()=>{
    router.events.on('routeChangeStart', ()=>{
      // console.log("routeChangeStart...")
      nprogress.start()
    })
    router.events.on('routeChangeComplete', ()=>{
      // console.log("routeChangeComplete...")
      nprogress.done()
    })
    router.events.on('routeChangeError', ()=>{
      // console.log("routeChangeError...")
      nprogress.done()
    })
  },[])

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Research Software Directory</title>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={rsdMuiTheme}>
        {/* CssBaseline from MUI-5*/}
        {/* <CssBaseline /> */}
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ThemeProvider>
    </CacheProvider>
  )
}
