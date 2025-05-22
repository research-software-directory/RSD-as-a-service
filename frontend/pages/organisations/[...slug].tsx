// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next/types'

import {app} from '~/config/app'
import {getUserFromToken} from '~/auth'
import {
  getOrganisationBySlug,
  getOrganisationChildren,
} from '~/components/organisation/apiOrganisations'
import OrganisationMetadata from '~/components/organisation/metadata'
import PageMeta from '~/components/seo/PageMeta'
import BackgroundAndLayout from '~/components/layout/BackgroundAndLayout'
import CanonicalUrl from '~/components/seo/CanonicalUrl'
import PageBreadcrumbs from '~/components/layout/PageBreadcrumbs'
import BaseSurfaceRounded from '~/components/layout/BaseSurfaceRounded'
import OrganisationTabs from '~/components/organisation/tabs/OrganisationTabs'
import TabContent from '~/components/organisation/tabs/TabContent'
import {TabKey} from '~/components/organisation/tabs/OrganisationTabItems'
import {OrganisationForContext, OrganisationProvider} from '~/components/organisation/context/OrganisationContext'
import {
  getReleasesCountForOrganisation, getReleasesForOrganisation,
  ReleaseCountByYear,
  SoftwareReleaseInfo
} from '~/components/organisation/releases/apiOrganisationReleases'

import {OrganisationUnitsForOverview} from '~/types/Organisation'

export type OrganisationPageProps = {
  organisation: OrganisationForContext,
  slug: string[],
  tab: TabKey | null,
  isMaintainer: boolean,
  units: OrganisationUnitsForOverview[]
  releaseCountsByYear: ReleaseCountByYear[] | null
  releases: SoftwareReleaseInfo[] | null
}

export default function OrganisationPage({
  organisation, slug, tab,
  isMaintainer, units,
  releaseCountsByYear, releases
}: OrganisationPageProps) {

  // console.group('OrganisationPage')
  // console.log('organisation...', organisation)
  // console.log('slug....', slug)
  // console.log('ror....', ror)
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
        <OrganisationProvider
          organisation={organisation}
          isMaintainer={isMaintainer}
        >
          {/* ORGANISATION HEADER */}
          <PageBreadcrumbs
            slug={slug}
            root={{
              label:'organisations',
              path:'/organisations'
            }}
          />
          <OrganisationMetadata />

          {/* TABS */}
          <BaseSurfaceRounded
            className="my-4 p-2"
            type="section"
          >
            <OrganisationTabs tab_id={tab} />
          </BaseSurfaceRounded>
          {/* TAB CONTENT */}
          <section className="flex md:min-h-[55rem]">
            <TabContent tab_id={tab} units={units} releaseCountsByYear={releaseCountsByYear} releases={releases} />
          </section>
        </OrganisationProvider>
      </BackgroundAndLayout>
    </>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/pages/building-your-application/data-fetching/get-server-side-props
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try{
    const {params, req, query} = context
    // extract user ID from session
    const token = req?.cookies['rsd_token']
    const user = getUserFromToken(token ?? null)
    // find organisation by slug
    const resp = await getOrganisationBySlug({
      slug: params?.slug as string[] ?? [],
      token: token,
      user
    })
    // console.log('organisation...', organisation)
    if (resp === undefined){
      // returning notFound triggers 404 page
      return {
        notFound: true,
      }
    }
    // extract data from response
    const {organisation,isMaintainer} = resp

    const tabId = query?.tab ?? null
    let units: OrganisationUnitsForOverview[] = []
    let releaseCountsByYear: ReleaseCountByYear[] | null = null
    let releases: SoftwareReleaseInfo[] | null = null
    //
    if (organisation.id !== undefined) {

      if (tabId === 'units') {
        units = await getOrganisationChildren({
          uuid: organisation.id,
          token: token ?? ''
        })
      } else if (tabId === 'releases') {
        releaseCountsByYear = await getReleasesCountForOrganisation({
          organisation_id: organisation.id,
          token: token ?? ''})

        if (releaseCountsByYear?.length) {
          const queryYear = query.year
          let release_year: number = parseInt(queryYear as string)
          if (isNaN(release_year)) {
            release_year = releaseCountsByYear[0].release_year
          }

          releases = await getReleasesForOrganisation({
            organisation_id: organisation.id,
            token: token ?? '',
            release_year: release_year.toString()
          })
        }
      }
    }

    return {
      // passed to the page component as props
      props: {
        organisation,
        slug: params?.slug,
        tab: query?.tab ?? null,
        isMaintainer,
        units: units,
        releaseCountsByYear: releaseCountsByYear,
        releases: releases
      },
    }
  }catch{
    return {
      notFound: true,
    }
  }
}
