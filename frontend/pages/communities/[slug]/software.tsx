// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next'

import {app} from '~/config/app'
import {getUserFromToken} from '~/auth'
import {getUserSettings} from '~/utils/userSettings'
import PageMeta from '~/components/seo/PageMeta'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import {KeywordFilterOption} from '~/components/filter/KeywordsFilter'
import {LanguagesFilterOption} from '~/components/filter/ProgrammingLanguagesFilter'
import {LicensesFilterOption} from '~/components/filter/LicensesFilter'
import {LayoutType} from '~/components/software/overview/search/ViewToggleGroup'
import {EditCommunityProps, getCommunityBySlug} from '~/components/communities/apiCommunities'
import CommunityPage from '~/components/communities/CommunityPage'
import CommunitySoftware from '~/components/communities/software'
import {SoftwareOfCommunity, ssrCommunitySoftwareProps} from '~/components/communities/software/apiCommunitySoftware'

type CommunitySoftwareProps={
  community: EditCommunityProps,
  software: SoftwareOfCommunity[],
  slug: string[],
  isMaintainer: boolean,
  rsd_page_rows: number,
  rsd_page_layout: LayoutType,
  count: number,
  keywordsList: KeywordFilterOption[],
  languagesList: LanguagesFilterOption[],
  licensesList: LicensesFilterOption[],
}

export default function CommunitySoftwarePage({
  community,slug,isMaintainer,
  rsd_page_rows, rsd_page_layout,
  software, count, keywordsList,
  languagesList, licensesList
}:CommunitySoftwareProps) {

  // console.group('CommunitySoftwarePage')
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
        rsd_page_rows={rsd_page_rows}
        rsd_page_layout={rsd_page_layout}
        selectTab='software'
      >
        <CommunitySoftware
          software={software}
          page={0}
          count={count}
          rows={rsd_page_rows}
          rsd_page_layout={rsd_page_layout}
          keywordsList={keywordsList}
          languagesList={languagesList}
          licensesList={licensesList}
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
      // community with updated keywords
      community
    } = await ssrCommunitySoftwareProps({
      community: com,
      software_status: 'approved',
      query: query,
      isMaintainer,
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
        rsd_page_layout,
        rsd_page_rows,
        count: software.count,
        software: software.data,
        keywordsList,
        languagesList,
        licensesList
      },
    }
  }catch(e){
    return {
      notFound: true,
    }
  }
}
