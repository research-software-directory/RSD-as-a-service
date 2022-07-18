import {useContext} from 'react'
import {RsdSettingsContext} from './RsdSettingsContext'
import {RsdActionType, RsdLink, RsdTheme} from './rsdSettingsReducer'

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

  return {
    links: state.links,
    theme: state.theme,
    embedMode: state.embed,
    setRsdLinks,
    setRsdTheme,
    setEmbedMode
  }
}
