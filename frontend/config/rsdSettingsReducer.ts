// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'

export type RsdLink = {
  id: string,
  position: number,
  title: string,
  slug: string,
  is_published?:boolean
}

export type RsdTheme = {
  mode: string
  host: string
}

export enum RsdActionType {
  SET_LINKS = 'SET_LINKS',
  SET_THEME = 'SET_THEME',
  SET_EMBED = 'SET_EMBED',
  SET_COOKIES_ACCEPTED = 'SET_COOKIES_ACCEPTED',
}

export type RsdSettingsState = {
  embed: boolean,
  theme: RsdTheme,
  links: RsdLink[],
  cookiesAccepted: boolean,
}

export type RsdSettingsAction = {
  type: RsdActionType,
  payload: any
}

export type RsdSettingsDispatch = (action: RsdSettingsAction)=>void

export const defaultRsdSettings = {
  embed: false,
  theme: {
    mode: 'default',
    host: 'default',
  },
  links: [],
  cookiesAccepted: false,
}

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
    case RsdActionType.SET_EMBED:
      return {
        ...state,
        embed: action.payload
      }
    case RsdActionType.SET_COOKIES_ACCEPTED:
      return {
        ...state,
        cookiesAccepted: action.payload
      }
    default:
      logger(`rsdSettingsReducer UNKNOWN ACTION TYPE ${action.type}`, 'warn')
      return state
  }
}
