import { ReactNode } from 'react'
import AppHeader from './AppHeader'
import AppFooter from './AppFooter'

export default function DefaultLayout({children}:{children:ReactNode}) {
  return (
    <>
      <AppHeader/>
      <main className="container mx-auto flex flex-col flex-1">
        {children}
      </main>
      <AppFooter/>
    </>
  )
}