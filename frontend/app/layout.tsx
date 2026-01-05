// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {Metadata} from 'next'
import {headers} from 'next/headers'
import {AppRouterCacheProvider} from '@mui/material-nextjs/v15-appRouter'

import {REFRESH_MARGIN} from '~/auth'
import {getAppSessionSeverSide} from '~/auth/getSessionServerSide'
import {AuthProvider} from '~/auth/AuthProvider'
import {getLoginProviders} from '~/auth/api/getLoginProviders'
import {LoginProvidersProvider} from '~/auth/loginProvidersContext'
import RsdPathnameCookie from '~/auth/RsdPathnameCookie'
import RsdThemeProvider from '~/styles/RsdThemeProvider'
import AosNoScript from '~/styles/AosNoScript'
import {getAppSettingsServerSide} from '~/config/getSettingsServerSide'
import {RsdSettingsProvider} from '~/config/RsdSettingsContext'
import getPlugins from '~/config/getPlugins'
import PluginSettingsProvider from '~/config/RsdPluginContext'
import {UserSettingsProvider} from '~/config/UserSettingsContext'
import AppHeader from '~/components/AppHeader'
import AppFooter from '~/components/AppFooter'
import {getMatomoSettings} from '~/components/cookies/getMatomoSettings'
import MatomoScript from '~/components/cookies/MatomoScript'
import MuiSnackbarProvider from '~/components/snackbar/MuiSnackbarProvider'
import {appUserSettings} from '~/components/cookies/appUserSettings'
import CookieConsentMatomo from '~/components/cookies/CookieConsentMatomo'
import Announcement from '~/components/Announcement/Announcement'
import ProgressProviderApp from '~/components/bprogress/ProgressProviderApp'

import '~/styles/global.css'

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to RSD',
}

// force to be dynamic route
export const dynamic = 'force-dynamic'

// SERVER SIDE component
export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode
}) {

  // load matomo, settings.json, session from cookie, providers and header
  const [matomo,settings,session,providers,header] = await Promise.all([
    getMatomoSettings(),
    getAppSettingsServerSide(),
    getAppSessionSeverSide(),
    getLoginProviders(),
    headers()
  ])
  // extract nonce from request header
  // the nonce and CSP are added by middleware.ts
  const nonce = header.get('x-nonce') as string
  // get RSD plugins from config endpoint and avatar_id
  const [plugins,userSettings] = await Promise.all([
    getPlugins({
      plugins:settings.host.plugins,
      token:session?.token
    }),
    appUserSettings({
      account:session?.user?.account,
      token:session?.token
    })
  ])

  // show values
  // console.group('RootLayout')
  // console.log('settings...', settings)
  // console.log('session...', session)
  // console.log('matomo...', matomo)
  // console.log('nonce...', nonce)
  // console.log('plugins...', plugins)
  // console.log('userSettings...', userSettings)
  // console.log('providers...', providers)
  // console.groupEnd()

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        {/* share nonce with _app for client side scripts */}
        <meta name="csp-nonce" content={nonce} />
        {/* PWA manifest.json for favicons */}
        <link rel="manifest" href="/manifest.json" />
        {/* mounted index.css with font definitions */}
        {/*eslint-disable-next-line @next/next/no-css-tags*/}
        <link href="/styles/index.css" rel="stylesheet" />
        {/* inject AOS noscript style */}
        <AosNoScript nonce={nonce}/>
        {/* inject matomo script */}
        <MatomoScript matomo={matomo} nonce={nonce} />
      </head>
      <body className="dark flex flex-col min-h-[100vh]">
        {/* material-ui cache provider */}
        <AppRouterCacheProvider options={{nonce}}>
          {/* material-ui theme provider */}
          <RsdThemeProvider rsdTheme={settings.theme}>
            {/* Authentication */}
            <AuthProvider session={session} refreshMarginInMs={REFRESH_MARGIN}>
              {/* RSD settings/config */}
              <RsdSettingsProvider settings={settings}>
                {/* Plugin slots context */}
                <PluginSettingsProvider settings={plugins}>
                  {/* MUI snackbar service */}
                  <MuiSnackbarProvider>
                    {/* bprogress service */}
                    <ProgressProviderApp>
                      {/* User settings rows, page layout etc. */}
                      <UserSettingsProvider user={userSettings}>
                        {/* Login providers list */}
                        <LoginProvidersProvider providers = {providers}>
                          <AppHeader />
                          {children}
                          <AppFooter/>
                        </LoginProvidersProvider>
                      </UserSettingsProvider>
                    </ProgressProviderApp>
                  </MuiSnackbarProvider>
                </PluginSettingsProvider>
              </RsdSettingsProvider>
            </AuthProvider>
            {/* Matomo cookie consent dialog */}
            <CookieConsentMatomo matomo={matomo} />
            {/* RSD admin announcements/ system notifications */}
            <Announcement announcement={settings?.announcement ?? null} />
            {/* Save location cookie */}
            <RsdPathnameCookie />
          </RsdThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
