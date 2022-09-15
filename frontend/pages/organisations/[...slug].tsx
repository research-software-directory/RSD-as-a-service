// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Head from 'next/head'
import {GetServerSidePropsContext} from 'next/types'

import {app} from '../../config/app'
import useOrganisationMaintainer from '../../auth/permissions/useOrganisationMaintainer'
import DefaultLayout from '../../components/layout/DefaultLayout'
import {getOrganisationBySlug} from '../../utils/getOrganisations'
import OrganisationLogo from '../../components/organisation/settings/OrganisationLogo'
import ContentLoader from '../../components/layout/ContentLoader'
import OrganisationNav from '../../components/organisation/OrganisationNav'
import {organisationMenu, OrganisationMenuProps} from '../../components/organisation/OrganisationNavItems'
import OrganisationTitle from '../../components/organisation/OrganisationTitle'
import {OrganisationForOverview} from '../../types/Organisation'

import {SearchProvider} from '../../components/search/SearchContext'
import {PaginationProvider} from '../../components/pagination/PaginationContext'

export type OrganisationPageProps = {
  organisation: OrganisationForOverview,
  slug: string[],
  page: string
}

export default function OrganisationPage({organisation,slug,page}:OrganisationPageProps) {
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
      // default is the first item
      setPageState(organisationMenu[0])
    }
  },[page])

  // console.group('OrganisationPage')
  // console.log('organisation...', organisation)
  // console.log('slug....', slug)
  // console.log('page....', page)
  // console.groupEnd()

  function renderStepComponent() {
    if (loading || typeof pageState == 'undefined') return <ContentLoader />
    if (pageState.component) {
      return pageState.component({organisation,isMaintainer})
    }
  }

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <SearchProvider>
      <PaginationProvider>
        <OrganisationTitle
          title={organisation.name}
          slug={slug}
          showSearch={pageState?.showSearch ?? false}
        />
        <section className="flex-1 grid md:grid-cols-[1fr,2fr] xl:grid-cols-[1fr,4fr] gap-[3rem]">
          <div>
            <OrganisationNav
              organisation={organisation}
              isMaintainer={isMaintainer}
            />
            <OrganisationLogo
              isMaintainer={isMaintainer}
              {...organisation}
            />
          </div>
          <div className="flex flex-col min-h-[55rem]">
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

    return {
      // passed to the page component as props
      props: {
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
