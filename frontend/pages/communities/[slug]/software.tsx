// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next'

import {app} from '~/config/app'
import {getUserFromToken} from '~/auth'
import {getUserSettings} from '~/utils/userSettings'
import {CommunityListProps, getCommunityBySlug} from '~/components/communities/apiCommunities'
import {LayoutType} from '~/components/software/overview/search/ViewToggleGroup'
import PageMeta from '~/components/seo/PageMeta'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import BackgroundAndLayout from '~/components/layout/BackgroundAndLayout'
import {UserSettingsProvider} from '~/components/organisation/context/UserSettingsContext'
import PageBreadcrumbs from '~/components/layout/PageBreadcrumbs'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import CommunityMetadata from '~/components/communities/metadata'
import CommunityTabs from '~/components/communities/tabs'
import {isCommunityMaintainer} from '~/auth/permissions/isMaintainerOfCommunity'

type CommunitySoftwareProps={
  community: CommunityListProps,
  slug: string[],
  isMaintainer: boolean,
  rsd_page_rows: number,
  rsd_page_layout: LayoutType
}

export default function CommunitySoftwarePage({
  community,slug,isMaintainer,
  rsd_page_rows, rsd_page_layout
}:CommunitySoftwareProps) {

  console.group('CommunitySoftwarePage')
  console.log('community...', community)
  console.log('slug....', slug)
  console.log('isMaintainer....', isMaintainer)
  console.log('rsd_page_rows....', rsd_page_rows)
  console.log('rsd_page_layout....', rsd_page_layout)
  console.groupEnd()


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
      <BackgroundAndLayout>
        <UserSettingsProvider
          settings={{
            rsd_page_layout,
            rsd_page_rows
          }}
        >
          {/* COMMUNITY HEADER */}
          <PageBreadcrumbs
            slug={slug}
            root={{
              label:'communities',
              path:'/communities'
            }}
          />
          <CommunityMetadata
            id={community.id}
            name={community.name}
            short_description={community.short_description}
            logo_id={community.logo_id}
            isMaintainer={isMaintainer}
            links={[]}
          />

          {/* TABS */}
          <BaseSurfaceRounded
            className="my-4 p-2"
            type="section"
          >
            <CommunityTabs
              tab={'software'}
              software_cnt={community.software_cnt ?? 0}
              description={null}
              isMaintainer={false}
            />
          </BaseSurfaceRounded>
          {/* TAB CONTENT */}
          <section className="flex md:min-h-[60rem]">
            {/* <TabContent tab_id={tab} /> */}
            <h1>Community software - TO DO!</h1>
          </section>
        </UserSettingsProvider>
      </BackgroundAndLayout>
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
    const community = await getCommunityBySlug({
      slug: params?.slug?.toString() ?? null,
      token: req?.cookies['rsd_token'],
      user
    })
    // console.log('community...', community)
    if (community === null){
      // returning notFound triggers 404 page
      return {
        notFound: true,
      }
    }
    // get info if the user is maintainer
    const isMaintainer = await isCommunityMaintainer({
      community: community.id,
      role: user?.role,
      account: user?.account,
      token
    })

    return {
      // passed to the page component as props
      props: {
        community,
        slug: [params?.slug],
        tab: query?.tab ?? null,
        isMaintainer,
        rsd_page_layout,
        rsd_page_rows
      },
    }
  }catch(e){
    return {
      notFound: true,
    }
  }
}