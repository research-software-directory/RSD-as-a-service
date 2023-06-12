// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useContext} from 'react'
import {RsdTheme} from '~/styles/rsdMuiTheme'
import {RsdSettingsContext} from './RsdSettingsContext'
import {RsdActionType, RsdLink, RsdHost} from './rsdSettingsReducer'


export default function useRsdSettings() {
  const {state, dispatch} = useContext(RsdSettingsContext)

  function setRsdLinks(links: RsdLink) {
    dispatch({
      type: RsdActionType.SET_LINKS,
      payload: links
    })
  }

  function setRsdTheme(theme: RsdTheme) {
    dispatch({
      type: RsdActionType.SET_THEME,
      payload: theme
    })
  }

  function setEmbedMode(embed: boolean=false) {
    dispatch({
      type: RsdActionType.SET_EMBED,
      payload: embed
    })
  }

  function setHost(host: RsdHost) {
    dispatch({
      type: RsdActionType.SET_HOST,
      payload: host
    })
  }

  return {
    host: state.host,
    pages: state.pages,
    links: state.links,
    theme: state.theme,
    embedMode: state.embed,
    setRsdLinks,
    setRsdTheme,
    setEmbedMode,
    setHost
  }
}
