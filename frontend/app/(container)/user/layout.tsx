import {Metadata} from 'next'
import {notFound} from 'next/navigation'

import {app} from '~/config/app'
import {getUserFromToken} from '~/auth/getSessionServerSide'
import ProtectedContent from '~/auth/ProtectedContent'
import PageErrorMessage from '~/components/layout/PageErrorMessage'
import {getUserSettings} from '~/components/user/ssrUserSettings'
import {UserContextProvider} from '~/components/user/context/UserContext'
import {getUserCounts} from '~/components/user/getUserCounts'
import UserMetadata from '~/components/user/metadata'
import UserAgreementModal from '~/components/user/settings/agreements/UserAgreementModal'
import {loadUserProfile} from '~/components/user/settings/profile/apiUserProfile'
import UserTabs from '~/components/user/tabs/UserTabs'

/**
 * Next.js app builtin function to dynamically create page metadata
 * @param param0
 * @returns
 */
export async function generateMetadata(): Promise<Metadata> {
  // read route params
  const {token} = await getUserSettings()
  const user = await getUserFromToken(token)

  // console.group('UserPageLayout.generateMetadata')
  // console.log('token...', token)
  // console.log('user...', user)
  // console.groupEnd()

  // if user exists we create metadata
  return {
    title: `${user?.name ?? 'User'} | ${app.title}`,
    description: `${user?.name ?? 'User'} pages`
  }

}

/**
 * (Partial) Layout of organisation page content.
 * Note! Base layout (PageBackground/AppHeader/MainContent/AppFooter) is defined in the parent layout.
 * @param param0
 * @returns
 */
export default async function UserPageLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: Readonly<{
  children: React.ReactNode,
}>) {
  // read route params
  const {token} = await getUserSettings()
  const user = await getUserFromToken(token ?? null)

  if (user === null) {
    // 401 if no user
    return (
      <PageErrorMessage
        status={401}
        message='UNAUTHORIZED'
      />
    )
  }

  const [
    counts,
    profile_logins,
  ] = await Promise.all([
    getUserCounts({token}),
    loadUserProfile({account:user?.account,token}),
  ])

  if (profile_logins?.profile === null) {
    // 404 if no profile
    return notFound()
  }

  // console.group('UserPageLayout')
  // console.log('pageSection...', pageSection)
  // console.log('pageTitle...', pageTitle)
  // console.log('section...', section)
  // console.log('counts...', counts)
  // console.log('rsd_page_rows...', rsd_page_rows)
  // console.log('rsd_page_layout...', rsd_page_layout)
  // console.log('profile...', profile)
  // console.log('logins...', logins)
  // console.groupEnd()


  return (
    <ProtectedContent>
      <UserAgreementModal />
      <UserContextProvider
        profile={profile_logins?.profile}
        logins={profile_logins?.logins}
        counts={counts}
      >
        {/* USER PAGE HEADER */}
        <UserMetadata/>
        {/* TABS */}
        <UserTabs counts={counts} />
        {/* TAB CONTENT */}
        <section className="flex md:min-h-[45rem]">
          {children}
        </section>
      </UserContextProvider>
    </ProtectedContent>
  )

}
