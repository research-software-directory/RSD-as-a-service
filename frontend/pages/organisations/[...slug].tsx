// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Head from 'next/head'
import {GetServerSidePropsContext} from 'next/types'

import {app} from '../../config/app'
import useOrganisationMaintainer from '../../auth/permissions/useOrganisationMaintainer'
import DefaultLayout from '../../components/layout/DefaultLayout'
import {getOrganisationBySlug} from '../../utils/getOrganisations'
import OrganisationMetadata from '../../components/organisation/metadata'
import ContentLoader from '../../components/layout/ContentLoader'
import OrganisationNav from '../../components/organisation/OrganisationNav'
import {organisationMenu, OrganisationMenuProps} from '../../components/organisation/OrganisationNavItems'
import OrganisationTitle from '../../components/organisation/OrganisationTitle'
import {OrganisationForOverview} from '../../types/Organisation'

import {SearchProvider} from '../../components/search/SearchContext'
import {PaginationProvider} from '../../components/pagination/PaginationContext'
import {getOrganisationMetadata, RORItem} from '~/utils/getROR'
import PageMeta from '~/components/seo/PageMeta'

export type OrganisationPageProps = {
  organisation: OrganisationForOverview,
  ror: RORItem | null
  slug: string[],
  page: string
}

export default function OrganisationPage({organisation,slug,page,ror}:OrganisationPageProps) {
  const [pageState, setPageState] = useState<OrganisationMenuProps>()
  const {loading, isMaintainer} = useOrganisationMaintainer({
    organisation: organisation.id
  })
  const pageTitle = `${organisation.name} | ${app.title}`

  useEffect(() => {
    if (page && page!=='') {
      const nextStep = organisationMenu.find(item => item.id === page)
      if (nextStep) {
        setPageState(nextStep)
      }
    } else {
      // if there is description
      if (organisation.description) {
        // we show about page
        setPageState(organisationMenu[0])
      } else {
        // otherwise software is default
        setPageState(organisationMenu[1])
      }
    }
  },[page,organisation.description])

  // console.group('OrganisationPage')
  // console.log('organisation...', organisation)
  // console.log('slug....', slug)
  // console.log('page....', page)
  // console.log('ror....', ror)
  // console.log('loading....', loading)
  // console.log('isMaintainer....', isMaintainer)
  // console.log('pageState....', pageState?.id)
  // console.groupEnd()

  function renderStepComponent() {
    if (loading || typeof pageState == 'undefined') return <ContentLoader />
    if (pageState.component) {
      return pageState.component({organisation,isMaintainer})
    }
  }

  return (
    <DefaultLayout>
      {/* Page Head meta tags */}
      <PageMeta
        title={`${organisation?.name} | ${app.title}`}
        description={organisation.description ?? `The organisation participates in RSD with ${organisation.software_cnt} registered software item(s).`}
      />
      <SearchProvider>
      <PaginationProvider>
        <OrganisationTitle
          title={organisation.name}
          slug={slug}
        />
        <section className="flex-1 grid md:grid-cols-[1fr,2fr] xl:grid-cols-[1fr,4fr] gap-[3rem]">
          <div>
            <OrganisationNav
              organisation={organisation}
              isMaintainer={isMaintainer}
            />
            <OrganisationMetadata
              organisation={organisation}
              isMaintainer={isMaintainer}
              meta={ror}
            />
          </div>
          <div
            data-testid={`organisation-content-${pageState?.id ?? 'loading'}`}
            className="flex flex-col relative md:min-h-[55rem] md:pb-8">
            {renderStepComponent()}
          </div>
        </section>
      </PaginationProvider>
      </SearchProvider>
    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try{
    const {params,req,query} = context
    // console.log('getServerSideProps...params...', params)
    const organisation = await getOrganisationBySlug({
      slug: params?.slug as string[],
      token: req?.cookies['rsd_token'] ?? ''
    })
    if (typeof organisation == 'undefined'){
      // returning notFound triggers 404 page
      return {
        notFound: true,
      }
    }
    // get organisation metadata from ROR
    const ror = await getOrganisationMetadata(organisation.ror_id ?? null)
    return {
      // passed to the page component as props
      props: {
        ror,
        organisation,
        slug: params?.slug,
        page: query?.page ?? '',
      },
    }
  }catch(e){
    return {
      notFound: true,
    }
  }
}
