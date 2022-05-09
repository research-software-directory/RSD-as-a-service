import {ReactNode} from 'react'
import {useRouter} from 'next/router'
import AppHeader from './AppHeader'
import AppFooter from './AppFooter'

export default function DefaultLayout({children}:{children:ReactNode}) {
  const router = useRouter()
  const {embed} = router.query
  return (
    <>

      { (typeof embed === 'undefined') && <AppHeader /> }
      <main className="flex flex-col flex-1 px-4 lg:container lg:mx-auto">
        {children}
      </main>
      { (typeof embed === 'undefined') && <AppFooter /> }
    </>
  )
}
