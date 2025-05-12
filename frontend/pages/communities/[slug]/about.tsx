// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next'

import {app} from '~/config/app'
import {getUserFromToken} from '~/auth'
import {EditCommunityProps, getCommunityBySlug} from '~/components/communities/apiCommunities'
import PageMeta from '~/components/seo/PageMeta'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import AboutCommunityPage from '~/components/communities/about'
import CommunityPage from '~/components/communities/CommunityPage'
import {getKeywordsByCommunity} from '~/components/communities/settings/general/apiCommunityKeywords'

type CommunityAboutPage={
  community: EditCommunityProps,
  slug: string[],
  isMaintainer: boolean
}

export default function CommunityAboutPage({
  community,slug,isMaintainer,
}:CommunityAboutPage) {

  // console.group('CommunityAboutPage')
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
      {/* <TabContent tab_id={tab} /> */}
      <CommunityPage
        community={community}
        slug={slug}
        isMaintainer={isMaintainer}
        selectTab='about'
      >
        <AboutCommunityPage description={community?.description ?? ''} />
      </CommunityPage>
    </>
  )
}


// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try{
    const {params, req, query} = context
    // extract user id from session
    const token = req?.cookies['rsd_token']
    const user = getUserFromToken(token)
    // find community by slug
    const {community:com, isMaintainer} = await getCommunityBySlug({
      slug: params?.slug?.toString() ?? null,
      token: req?.cookies['rsd_token'],
      user
    })
    // console.log('community...', community)
    if (com === null || com?.description === null){
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
        isMaintainer
      },
    }
  }catch{
    return {
      notFound: true,
    }
  }
}
