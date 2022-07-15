import {useContext} from 'react'
import {RsdSettingsContext} from './RsdSettingsContext'
import {RsdActionType, RsdLinks, RsdTheme} from './rsdSettingsReducer'

// export async function getRsdSettings() {
//   const links = await getPublishedMarkdownPages(false)
//   return {
//     links,
//     theme:
//   }
// }

export default function useRsdSettings() {
  const {state, dispatch} = useContext(RsdSettingsContext)

  function setRsdLinks(links: RsdLinks) {
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
    links:state.links,
    theme: state.theme,
    embedMode: state.embed,
    setRsdLinks,
    setRsdTheme,
    setEmbedMode
  }
}
