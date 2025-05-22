// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next/types'

import {app} from '~/config/app'
import {getUserFromToken, useSession} from '~/auth'
import ProtectedContent from '~/auth/ProtectedContent'
import {getRedirectUrl} from '~/auth/api/authHelpers'
import PageMeta from '~/components/seo/PageMeta'
import BackgroundAndLayout from '~/components/layout/BackgroundAndLayout'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import {getUserCounts} from '~/components/user/getUserCounts'
import {orcidCoupleProps} from '~/components/user/settings/apiLinkOrcidProps'
import {loadUserProfile, UserProfile} from '~/components/user/settings/profile/apiUserProfile'
import {UserContextProvider, UserCounts} from '~/components/user/context/UserContext'
import UserMetadata from '~/components/user/metadata'
import UserTabs from '~/components/user/tabs/UserTabs'
import UserTabContent from '~/components/user/tabs/UserTabContent'
import {UserPageId} from '~/components/user/tabs/UserTabItems'
import UserAgreementModal from '~/components/user/settings/agreements/UserAgreementModal'
import {LoginForAccount} from '~/components/user/settings/profile/apiLoginForAccount'
import {linkedInCoupleProps} from '~/components/user/settings/apiLinkLinkedInProps'

type UserPagesProps = Readonly<{
  section: UserPageId,
  counts: UserCounts,
  orcidAuthLink: string|null,
  linkedInAuthLink: string|null,
  profile: UserProfile
  logins: LoginForAccount[]
}>

export default function UserPages({
  section,counts,orcidAuthLink,linkedInAuthLink,
  profile,logins
}:UserPagesProps) {
  const {user} = useSession()
  const pageTitle = `${user?.name ?? 'User'} | ${app.title}`

  // console.group('UserPages')
  // console.log('pageSection...', pageSection)
  // console.log('pageTitle...', pageTitle)
  // console.log('orcidAuthLink...', orcidAuthLink)
  // console.log('linkedInAuthLink...', linkedInAuthLink)
  // console.log('section...', section)
  // console.log('counts...', counts)
  // console.log('rsd_page_rows...', rsd_page_rows)
  // console.log('rsd_page_layout...', rsd_page_layout)
  // console.log('profile...', profile)
  // console.log('logins...', logins)
  // console.groupEnd()

  return (
    <>
      <PageMeta
        title={pageTitle}
        description={`${user?.name ?? 'User'} pages`}
      />
      <BackgroundAndLayout>
        <ProtectedContent>
          <UserAgreementModal />
          <UserContextProvider
            profile={profile}
            logins={logins}
            counts={counts}
            orcidAuthLink={orcidAuthLink}
            linkedInAuthLink={linkedInAuthLink}
          >
            {/* USER PAGE HEADER */}
            <UserMetadata/>
            {/* TABS */}
            <BaseSurfaceRounded
              className="my-4 p-2"
              type="section"
            >
              <UserTabs tab={section} counts={counts}/>
            </BaseSurfaceRounded>
            {/* TAB CONTENT */}
            <section className="flex md:min-h-[45rem] mb-12">
              <UserTabContent tab={section} />
            </section>
          </UserContextProvider>
        </ProtectedContent>
      </BackgroundAndLayout>
    </>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try{
    const {params, req} = context
    const section = params?.section
    const token = req?.cookies['rsd_token']
    // placeholder for orcid/linkedIn couple link
    let orcidAuthLink:string|null=null
    let linkedInAuthLink:string|null=null
    // extract user settings from cookie
    // const {rsd_page_layout, rsd_page_rows} = getUserSettings(req)
    const user = getUserFromToken(token)
    // console.log('getServerSideProps...params...', params)
    // console.log('getServerSideProps...token...', token)
    // console.log('getServerSideProps...user...', user)
    if (typeof section == 'undefined') {
      // 404 if no section parameter
      return {
        notFound: true,
      }
    }

    const [
      counts,
      profile_logins,
      orcid,
      linkedIn
    ] = await Promise.all([
      getUserCounts({token}),
      loadUserProfile({account:user?.account,token}),
      orcidCoupleProps(),
      linkedInCoupleProps()
    ])

    if (profile_logins?.profile === null) {
      // 404 if no profile
      return {
        notFound: true,
      }
    }

    if (orcid?.redirect_couple_uri){
      // getRedirectUrl uses redirect_uri to construct redirectURL
      orcid.redirect_uri = orcid.redirect_couple_uri
      orcidAuthLink = getRedirectUrl(orcid)
    }
    if (linkedIn?.redirect_couple_uri){
      // getRedirectUrl uses redirect_uri to construct redirectURL
      linkedIn.redirect_uri = linkedIn.redirect_couple_uri
      linkedInAuthLink = getRedirectUrl(linkedIn)
    }

    return {
      // passed to page component as props
      props: {
        section,
        counts,
        orcidAuthLink,
        linkedInAuthLink,
        ...profile_logins
      },
    }
  }catch{
    return {
      notFound: true,
    }
  }
}
