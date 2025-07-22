// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2022 Jesús García Gonzalez (Netherlands eScience Center) <j.g.gonzalez@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState, useMemo} from 'react'
import {useRouter} from 'next/router'
import App, {AppContext, AppProps} from 'next/app'
import Head from 'next/head'
import {ThemeProvider} from '@mui/material/styles'
import {CacheProvider, Global} from '@emotion/react'

// global CSS and tailwind
import '../styles/global.css'

// authentication
import {Session, getSessionSeverSide, REFRESH_MARGIN} from '~/auth'
import {AuthProvider} from '~/auth/AuthProvider'
import {saveLocationCookie} from '~/auth/locationCookie'
import {getLoginProviders, Provider} from '~/auth/api/getLoginProviders'
import {LoginProvidersProvider} from '~/auth/loginProvidersContext'
// user settings (from cookies)
import {getUserAvatar, getUserSettings} from '~/utils/userSettings'
import {UserSettingsProps, UserSettingsProvider} from '~/config/UserSettingsContext'
// rsd settings
import {RsdSettingsProvider} from '~/config/RsdSettingsContext'
import {RsdSettingsState} from '~/config/rsdSettingsReducer'
import {getSettingsServerSide} from '~/config/getSettingsServerSide'
// plugin settings
import getPlugins from '~/config/getPlugins'
import PluginSettingsProvider, {PluginConfig} from '~/config/RsdPluginContext'
// theme
import {loadMuiTheme} from '~/styles/rsdMuiTheme'
import createEmotionCache from '~/styles/createEmotionCache'
import {getNonce} from '~/utils/contentSecurityPolicy'
// bprogress bar (provider) - replacing nprogress
import ProgressProviderPage from '~/components/bprogress/ProgressProviderPage'
// snackbar notifications
import MuiSnackbarProvider from '~/components/snackbar/MuiSnackbarProvider'
// Matomo cookie consent notification
import CookieConsentMatomo from '~/components/cookies/CookieConsentMatomo'
import {getMatomoConsent,Matomo} from '~/components/cookies/nodeCookies'
import {initMatomoCustomUrl} from '~/components/cookies/setMatomoPage'
import Announcement from '~/components/Announcement/Announcement'

// extend Next app props interface with emotion cache
export interface MuiAppProps extends AppProps {
  // emotionCache: EmotionCache
  session: Session,
  settings: RsdSettingsState,
  matomo: Matomo,
  userSettings?: UserSettingsProps,
  pluginSettings?: PluginConfig[],
  loginProviders: Provider[],
  nonce: string
}
// used to register SPA route changes
const setCustomUrl = initMatomoCustomUrl()

function RsdApp(props: MuiAppProps) {
  const {
    Component,
    pageProps, session, settings, matomo, userSettings,
    pluginSettings, loginProviders
  } = props

  const router = useRouter()
  /**
   * NOTE! useState keeps settings and session values in memory after initial load (server side)
   * getInitialProps runs ONLY on client side when page does not use getServerSideProps.
   * In that case we cannot extract session from JWT cookie and settings that use node env variables.
   * In addition the context will be reloaded with new value which is not obtained server side.
   * In case of doubt enable console logs here and in the context provider and observe the behaviour.
   */
  const [rsdSession] = useState(session)
  const [rsdSettings] = useState(settings)
  const [rsdUserSettings] = useState(userSettings)
  const [rsdPluginSettings] = useState(pluginSettings)
  const [rsdLoginProviders] = useState(loginProviders)

  // request theme when options changed
  const {muiTheme, cssVariables} = useMemo(() => {
    return loadMuiTheme(rsdSettings.theme)
  }, [rsdSettings.theme])

  const emotionCache = useMemo(() => {
    // use props.nonce or get it from headers using getNonce()
    // note! this code runs both server and client side and props.nonce can be undefined
    // we use getNonce() to extract nonce from meta header on client side
    const nonce = props.nonce || getNonce()
    return createEmotionCache(nonce)
  }, [props.nonce])

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
  // console.log('rsdSettings...', rsdSettings)
  // console.log('rsdSession...', rsdSession)
  // console.log('userSettings...', userSettings)
  // console.log('rsdUserSettings...', rsdUserSettings)
  // console.log('pluginSettings...', pluginSettings)
  // console.log('rsdPluginSettings...', rsdPluginSettings)
  // console.log('loginProviders...', loginProviders)
  // console.log('rsdLoginProviders...', rsdLoginProviders)
  // console.log('nonce...', props.nonce)
  // console.log('emotionCache...', emotionCache)
  // console.groupEnd()

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <title>Research Software Directory</title>
        <meta name="viewport" content="width=device-width" />
      </Head>
      {/* MUI Theme provider */}
      <ThemeProvider theme={muiTheme}>
        {/* dynamically pass css variables when theme changes */}
        <Global styles={cssVariables} />
        {/* Authentication */}
        <AuthProvider session={rsdSession} refreshMarginInMs={REFRESH_MARGIN}>
          {/* RSD settings/config */}
          <RsdSettingsProvider settings={rsdSettings}>
            {/* Plugin slots context */}
            <PluginSettingsProvider settings={rsdPluginSettings}>
              {/* MUI snackbar service */}
              <MuiSnackbarProvider>
                {/* bprogress service */}
                <ProgressProviderPage>
                  {/* User settings rows, page layout etc. */}
                  <UserSettingsProvider user={rsdUserSettings}>
                    {/* Login providers list */}
                    <LoginProvidersProvider providers = {rsdLoginProviders}>
                      <Component {...pageProps} />
                    </LoginProvidersProvider>
                  </UserSettingsProvider>
                </ProgressProviderPage>
              </MuiSnackbarProvider>
            </PluginSettingsProvider>
          </RsdSettingsProvider>
        </AuthProvider>
        {/* Matomo cookie consent dialog */}
        <CookieConsentMatomo matomo={matomo} />
        {/* RSD admin announcements/ system notifications */}
        <Announcement announcement={rsdSettings?.announcement ?? null} />
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
  // init session, it is loaded by getInitialProps
  // when running in SSR mode (req,res are present)
  let session: Session | null = null
  // user settings variable to extract from cookies
  let userSettings:UserSettingsProps|null = null
  // List of all plugins that can be used by the user
  let pluginSettings: PluginConfig[] = []
  // list of login providers
  let loginProviders: Provider[] = []
  // Matomo cached settings passed via getInitialProps
  // Note! getInitialProps does not always run server side
  // so we keep the last obtained values in this object
  const matomo: Matomo = {
    // extract matomo if from env and
    id: process.env.MATOMO_ID || null,
    consent: null
  }
  // extract rsd settings
  const settings = await getSettingsServerSide(req)
  // extract user session from cookies and
  // matomo consent if matomo is used (id)
  // only in SSR mode (req && res present)
  if (req && res) {
    // session is declared as module variable at the top of the file
    session = getSessionSeverSide(req, res)
    if (matomo.id) {
      matomo.consent = getMatomoConsent(req).matomoConsent
    }
    // get user settings from cookies
    userSettings = getUserSettings(req)

    // get RSD plugins from config endpoint and avatar_id
    const [plugins, avatar_id, providers] = await Promise.all([
      getPlugins({
        plugins:settings.host.plugins,
        token:session?.token
      }),
      getUserAvatar(session?.user?.account,session?.token),
      getLoginProviders()
    ])
    // save plugin and avatar values
    pluginSettings = plugins
    userSettings.avatar_id = avatar_id
    loginProviders = providers
  }

  // get nonce from request header
  // note! after introducing middleware.ts the nonce is in x-nonce header
  const nonce = getNonce(appContext.ctx?.req?.headers)

  // console.group('RsdApp.getInitialProps')
  // console.log('session...', session)
  // console.log('settings...', settings)
  // console.log('matomo...', matomo)
  // console.log('nonce...', nonce)
  // console.groupEnd()

  // return app props and session info from cookie
  return {
    ...appProps,
    session,
    settings,
    matomo,
    userSettings,
    pluginSettings,
    loginProviders,
    nonce
  }
}

export default RsdApp
