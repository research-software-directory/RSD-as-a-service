import {ReactNode,useContext} from 'react'
import AppHeader from './AppHeader'
import AppFooter from './AppFooter'

import EmbedLayoutContext from './embedLayoutContext'

export default function DefaultLayout({children}: { children: ReactNode }) {
  const {embedMode} = useContext(EmbedLayoutContext)

  return (
    <>
      <AppHeader />
      <main className="flex flex-col flex-1 px-4 lg:container lg:mx-auto">
        {children}
      </main>
      <AppFooter />
    </>
  )
}
