// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import logger from '~/utils/logger'
import {RsdTheme} from '~/styles/rsdMuiTheme'

import defaultSettings from '~/config/defaultSettings.json'

export type RsdSettingsState = {
  host?: string
  embed: boolean
  links: RsdLink[]
  theme: RsdTheme
}

export type RsdLink = {
  id: string,
  position: number,
  title: string,
  slug: string,
  is_published?:boolean
}

export enum RsdActionType{
  SET_LINKS = 'SET_LINKS',
  SET_THEME = 'SET_THEME',
  SET_EMBED = 'SET_EMBED',
  SET_HOST = 'SET_HOST'
}

export type RsdSettingsAction = {
  type: RsdActionType,
  payload: any
}

export type RsdSettingsDispatch = (action: RsdSettingsAction)=>void

export const defaultRsdSettings = {
  host: 'rsd',
  embed: false,
  links:[],
  theme: defaultSettings.theme
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
