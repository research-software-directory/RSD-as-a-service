// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next'

import {app} from '~/config/app'
import {getUserFromToken} from '~/auth'
import {getUserSettings} from '~/utils/userSettings'
import {EditCommunityProps, getCommunityBySlug} from '~/components/communities/apiCommunities'
import PageMeta from '~/components/seo/PageMeta'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import CommunitySettingsContent from '~/components/communities/settings'
import CommunityPage from '~/components/communities/CommunityPage'
import {getKeywordsByCommunity} from '~/components/communities/settings/general/apiCommunityKeywords'

type CommunitySoftwareProps={
  community: EditCommunityProps,
  slug: string[],
  isMaintainer: boolean
}

export default function CommunitySettingsPage({
  community,slug, isMaintainer
}:CommunitySoftwareProps) {

  // console.group('CommunitySettingsPage')
  // console.log('community...', community)
  // console.log('slug....', slug)
  // console.log('isMaintainer....', isMaintainer)
  // console.log('rsd_page_rows....', rsd_page_rows)
  // console.log('rsd_page_layout....', rsd_page_layout)
  // console.groupEnd()


  function getMetaDescription() {
    // use organisation (short) description if available
    if (community.short_description) return community.short_description
    // else generate description message
    return `${community?.name ?? 'The RSD community'} with ${community.software_cnt ?? 0} software packages.`
  }

  return (
    <>
      {/* Page Head meta tags */}
      <PageMeta
        title={`${community?.name} | ${app.title}`}
        description={getMetaDescription()}
      />
      <CanonicalUrl />
      <CommunityPage
        community={community}
        slug={slug}
        isMaintainer={isMaintainer}
        selectTab='settings'
      >
        <CommunitySettingsContent
          isMaintainer = {isMaintainer}
        />
      </CommunityPage>
    </>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try{
    const {params, req, query} = context
    // extract user settings from cookie
    const {rsd_page_layout, rsd_page_rows} = getUserSettings(req)
    // extract user id from session
    const token = req?.cookies['rsd_token']
    const user = getUserFromToken(token)

    // find community by slug
    const {community:com,isMaintainer} = await getCommunityBySlug({
      slug: params?.slug?.toString() ?? null,
      token: req?.cookies['rsd_token'],
      user
    })
    // console.log('community...', community)
    if (com === null){
      // returning notFound triggers 404 page
      return {
        notFound: true,
      }
    }
    // get info if the user is maintainer
    const keywords = await getKeywordsByCommunity(com.id,token)

    return {
      // passed to the page component as props
      props: {
        community:{
          ...com,
          // use keywords for editing
          keywords
        },
        slug: [params?.slug],
        tab: query?.tab ?? null,
        isMaintainer,
        rsd_page_layout,
        rsd_page_rows
      },
    }
  }catch{
    return {
      notFound: true,
    }
  }
}
