import { ReactNode } from 'react'
import AppHeader from './AppHeader'
import AppFooter from './AppFooter'

export default function DefaultLayout({children,...props}:{children:ReactNode}) {
  return (
    <>
      <AppHeader/>
      <main className="flex flex-col container mx-auto flex-1">
        {children}
      </main>
      <AppFooter/>
    </>
  )
}