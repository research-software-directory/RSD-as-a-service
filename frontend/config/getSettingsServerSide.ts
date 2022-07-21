// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {IncomingMessage} from 'http'
import {ParsedUrlQuery} from 'querystring'
import {getPageLinks} from '~/components/page/useMarkdownPages'
import {RsdThemeHost, RsdThemeMode} from '~/styles/rsdMuiTheme'
import {defaultRsdSettings, RsdSettingsState} from './rsdSettingsReducer'


export async function getSettingsServerSide(req: IncomingMessage | undefined, query: ParsedUrlQuery): Promise<RsdSettingsState> {
  // if not SSR we return default
  if (typeof req === 'undefined') return defaultRsdSettings
  // get links
  const links = await getPageLinks({is_published: true})
  // extract embed flag
  const embed = typeof query?.embed !== 'undefined'
  // define theme
  const theme = {
    mode: 'default' as RsdThemeMode,
    host: process.env.RSD_THEME_HOST as RsdThemeHost
  }
  // update local cache
  return {
    ...defaultRsdSettings,
    links,
    embed,
    theme
  }
}
