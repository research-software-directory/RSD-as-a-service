import {createContext} from 'react'

type EmbedLayoutProp = {
  embedMode: boolean,
  setEmbedMode: (embedMode:boolean) => void
}

const EmbedLayoutContext = createContext<EmbedLayoutProp>({
  embedMode: false,
  setEmbedMode: (embedMode) => { }
})


export default EmbedLayoutContext

