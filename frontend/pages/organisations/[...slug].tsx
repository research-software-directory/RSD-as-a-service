// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next/types'

import {app} from '~/config/app'
import {getUserFromToken} from '~/auth'
import {isOrganisationMaintainer} from '~/auth/permissions/useOrganisationMaintainer'
import {getOrganisationMetadata, RORItem} from '~/utils/getROR'
import {getUserSettings} from '~/utils/userSettings'
import {OrganisationForOverview} from '~/types/Organisation'
import {getOrganisationBySlug} from '~/components/organisation/apiOrganisations'
import OrganisationMetadata from '~/components/organisation/metadata'
import PageMeta from '~/components/seo/PageMeta'
import BackgroundAndLayout from '~/components/layout/BackgroundAndLayout'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import OrganisationBreadcrumbs from '~/components/organisation/OrganisationBreadcrumbs'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import OrganisationTabs from '~/components/organisation/tabs/OrganisationTabs'
import TabContent from '~/components/organisation/tabs/TabContent'
import {TabKey} from '~/components/organisation/tabs/OrganisationTabItems'
import {OrganisationProvider} from '~/components/organisation/context/OrganisationContext'
import {LayoutType} from '~/components/software/overview/search/ViewToggleGroup'
import {UserSettingsProvider} from '~/components/organisation/context/UserSettingsContext'

export type OrganisationPageProps = {
  organisation: OrganisationForOverview,
  ror: RORItem | null
  slug: string[],
  tab: TabKey | null,
  isMaintainer: boolean,
  rsd_page_rows: number,
  rsd_page_layout: LayoutType
}

export default function OrganisationPage({
  organisation, slug, tab, ror,
  isMaintainer, rsd_page_rows, rsd_page_layout
}: OrganisationPageProps) {

  // console.group('OrganisationPage')
  // console.log('organisation...', organisation)
  // console.log('slug....', slug)
  // console.log('ror....', ror)
  // console.log('tab....', tab)
  // console.log('select_tab....', select_tab)
  // console.log('loading....', loading)
  // console.log('isMaintainer....', isMaintainer)
  // console.log('pageState....', pageState?.id)
  // console.groupEnd()


  function getMetaDescription() {
    // use organisation (short) description if available
    if (organisation.short_description) return organisation.short_description
    // else generate description message
    return `${organisation?.name ?? 'The organisation'} participates in the RSD with ${organisation.software_cnt ?? 0} software package(s) and ${organisation.project_cnt ?? 0} project(s).`
  }

  return (
    <>
      {/* Page Head meta tags */}
      <PageMeta
        title={`${organisation?.name} | ${app.title}`}
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
        <OrganisationProvider
          organisation={organisation}
          isMaintainer={isMaintainer}
        >
          {/* ORGANISATION HEADER */}
          <OrganisationBreadcrumbs slug={slug} />
          <OrganisationMetadata ror_info={ror} />

          {/* TABS */}
          <BaseSurfaceRounded
            className="my-4 p-2"
            type="section"
          >
            <OrganisationTabs tab_id={tab} />
          </BaseSurfaceRounded>
          {/* TAB CONTENT */}
          <section className="flex md:min-h-[60rem]">
            <TabContent tab_id={tab} />
          </section>
        </OrganisationProvider>
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
    const user = getUserFromToken(req?.cookies['rsd_token'] ?? null)
    // find organisation by slug
    const resp = await getOrganisationBySlug({
      slug: params?.slug as string[] ?? [],
      token: req?.cookies['rsd_token'],
      user
    })
    // console.log('organisation...', organisation)
    if (typeof resp == 'undefined'){
      // returning notFound triggers 404 page
      return {
        notFound: true,
      }
    }
    // extract data from response
    const {organisation,isMaintainer} = resp
    // make maintainer and ror requests
    const ror = await getOrganisationMetadata(organisation.ror_id ?? null)
    return {
      // passed to the page component as props
      props: {
        ror,
        organisation,
        slug: params?.slug,
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
