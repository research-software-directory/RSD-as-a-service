import {ReactNode} from 'react'
import AppHeader from './AppHeader'
import AppFooter from './AppFooter'

export default function DefaultLayout({children}:{children:ReactNode}) {
  return (
    <>
      <AppHeader/>
      <main className="flex flex-col flex-1 px-4 lg:container lg:mx-auto">
        {children}
      </main>
      <AppFooter/>
    </>
  )
}
