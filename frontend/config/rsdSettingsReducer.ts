// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2025 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2024 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {RsdTheme} from '~/styles/rsdMuiTheme'
import defaultSettings from '~/config/defaultSettings.json'

export type RsdModuleName = keyof typeof defaultSettings.modules
export type RsdModule = {
  active: boolean,
  name: RsdModuleName,
  // if omitted/undefined or null menu item will not be shown
  menuItem?: string | null
}
export type RsdModules = {
  [K in RsdModuleName]: RsdModule
}

export type RsdSettingsState = {
  host: RsdHost,
  modules: RsdModules,
  theme: RsdTheme,
  links?: CustomLink[]
  pages?: RsdLink[]
  announcement?: string | null
}

export type RsdHost = {
  name: string,
  email: string,
  emailHeaders?: string[],
  website?: string,
  logo_url?: string,
  feedback?: {
    enabled: boolean,
    url: string,
    issues_page_url: string,
    host_label?: string
  },
  login_info_url?: string,
  terms_of_service_url?: string,
  privacy_statement_url?: string,
  software_highlights?: {
    title: string,
    limit: number,
    description?: string | null
  },
  plugins?: string[],
  orcid_search?: boolean
}

export type CustomLink = {
  label: string
  url: string
  target: string
}

export type RsdLink = {
  id: string,
  position: number,
  title: string,
  slug: string,
  is_published?: boolean
}

export enum RsdActionType {
  SET_LINKS = 'SET_LINKS',
  SET_THEME = 'SET_THEME',
  SET_HOST = 'SET_HOST'
}

export type RsdSettingsAction = {
  type: RsdActionType,
  payload: any
}

export type RsdSettingsDispatch = (action: RsdSettingsAction) => void

export const defaultRsdSettings = defaultSettings as unknown as RsdSettingsState

export function rsdSettingsReducer(state: RsdSettingsState, action: RsdSettingsAction) {
  // console.group('rsdSettingsReducer')
  // console.log('action...', action)
  // console.log('stateBefore...', state)
  // console.groupEnd()
  switch (action.type) {
    case RsdActionType.SET_LINKS:
      return {
        ...state,
        links: action.payload
      }
    case RsdActionType.SET_THEME:
      return {
        ...state,
        theme: action.payload
      }
    case RsdActionType.SET_HOST:
      return {
        ...state,
        host: action.payload
      }
    default:
      logger(`rsdSettingsReducer UNKNOWN ACTION TYPE ${action.type}`, 'warn')
      return state
  }
}

export function activeModulesKeys(modules: RsdModules) {
  try {
    // filter out active modules (keys)
    const keys = Object.keys(modules) as RsdModuleName[]
    const activeModules = keys
      .filter(key => modules[key].active)
    return activeModules
  } catch (e: any) {
    logger(`activeModulesKeys error: ${e.message}`, 'warn')
    return []
  }
}
