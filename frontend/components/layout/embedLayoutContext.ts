import {createContext} from 'react'

export type EmbedLayoutProp = {
  embedMode: boolean,
  setEmbedMode: (embedMode:boolean) => void
}

const EmbedLayoutContext = createContext<EmbedLayoutProp>({
  embedMode: false,
  setEmbedMode: (embedMode) => { }
})


export default EmbedLayoutContext

