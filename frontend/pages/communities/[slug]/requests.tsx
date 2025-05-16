// SPDX-FileCopyrightText: 2024 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next'

import {app} from '~/config/app'
import {getUserFromToken} from '~/auth'
import {getUserSettings} from '~/utils/userSettings'
import PageMeta from '~/components/seo/PageMeta'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import {getCommunityBySlug} from '~/components/communities/apiCommunities'
import CommunityPage from '~/components/communities/CommunityPage'
import CommunitySoftware from '~/components/communities/software'
import {ssrCommunitySoftwareProps} from '~/components/communities/software/apiCommunitySoftware'
import {CommunitySoftwareProps} from './software'

export default function RequestsToJoinCommunity({
  community,slug,isMaintainer, software, count,
  keywordsList, languagesList, licensesList,
  categoryList
}:CommunitySoftwareProps) {

  // console.group('RequestsToJoinCommunity')
  // console.log('community...', community)
  // console.log('slug....', slug)
  // console.log('software....', software)
  // console.log('isMaintainer....', isMaintainer)
  // console.log('rsd_page_rows....', rsd_page_rows)
  // console.log('rsd_page_layout....', rsd_page_layout)
  // console.log('keywordsList....', keywordsList)
  // console.log('languagesList....', languagesList)
  // console.log('licensesList....', licensesList)
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
        selectTab='requests'
      >
        <CommunitySoftware
          software={software}
          page={0}
          count={count}
          keywordsList={keywordsList}
          languagesList={languagesList}
          licensesList={licensesList}
          categoryList={categoryList}
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
    const {rsd_page_rows} = getUserSettings(req)

    // extract user id from session
    const token = req?.cookies['rsd_token']
    const user = getUserFromToken(token)

    // get community by slug and isMaintainer info
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
    // deconstruct data
    const {
      software,
      keywordsList,
      languagesList,
      licensesList,
      categoryList,
      // community with updated keywords
      community
    } = await ssrCommunitySoftwareProps({
      community: com,
      software_status: 'pending',
      query: query,
      isMaintainer,
      rsd_page_rows,
      token
    })

    // update community count to actual count
    // community.software_cnt = software.count
    return {
      // passed to the page component as props
      props: {
        community,
        slug: [params?.slug],
        isMaintainer,
        count: software.count,
        software: software.data,
        keywordsList,
        languagesList,
        licensesList,
        categoryList
      },
    }
  }catch{
    return {
      notFound: true,
    }
  }
}
