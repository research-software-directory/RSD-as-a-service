// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next/types'
import Head from 'next/head'

import {app} from '~/config/app'
import ProtectedContent from '~/auth/ProtectedContent'
import {getSoftwareToEdit} from '~/utils/editSoftware'
import DefaultLayout from '~/components/layout/DefaultLayout'
import ContentLoader from '~/components/layout/ContentLoader'
import {EditSoftwareProvider, SoftwareInfo} from '~/components/software/edit/editSoftwareContext'
import UserAgreementModal from '~/components/user/settings/agreements/UserAgreementModal'
import {editSoftwarePage} from '~/components/software/edit/editSoftwarePages'
import EditSoftwareStickyHeader from '~/components/software/edit/EditSoftwareStickyHeader'
import EditSoftwareNav from '~/components/software/edit/EditSoftwareNav'

const pageTitle = `Edit software | ${app.title}`

type SoftwareEditPageProps = {
  pageIndex: number
  software: SoftwareInfo
}

export default function SoftwareEditPages({pageIndex,software}:SoftwareEditPageProps) {
  const state = {
    pageIndex,
    software
  }
  const page = editSoftwarePage[pageIndex]

  // console.group('SoftwareEditPages')
  // console.log('pageIndex...', pageIndex)
  // console.log('state...', state)
  // console.log('software...', software)
  // console.groupEnd()

  function renderPageComponent() {
    if (page) {
      return page.render()
    }
    return <ContentLoader />
  }

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <noscript>
        <p style={{fontSize: '2rem', textAlign: 'center'}}>Please enable JavaScript to use this page</p>
      </noscript>
      <ProtectedContent slug={software.slug}>
        <UserAgreementModal />
        <EditSoftwareProvider state={state}>
          <EditSoftwareStickyHeader />
          <section className="md:flex gap-[3rem] mb-8">
            <EditSoftwareNav slug={software.slug} pageId={page.id} />
            {/* Here we load main component of each step */}
            {renderPageComponent()}
          </section>
        </EditSoftwareProvider>
      </ProtectedContent>
    </DefaultLayout>
  )
}


// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  const {params, req: {cookies}} = context
  // extract rsd_token
  const token = cookies['rsd_token'] ?? ''
  // get software slug
  const slug = params?.slug?.toString() ?? ''
  // get page id
  const page = params?.page?.toString() ?? ''

  const editSoftware = await getSoftwareToEdit({slug, token})

  // software not found in DB
  if (typeof editSoftware === 'undefined') {
    return {
      notFound: true,
    }
  }

  const pageIndex = editSoftwarePage.findIndex(p => p.id === page)
  // Edit software page not found in defs
  if (pageIndex===-1) {
    return {
      notFound: true,
    }
  }

  // will be passed as props to page
  // see params of SoftwareEditPages function
  return {
    props: {
      pageIndex,
      software: {
        id: editSoftware.id,
        slug: editSoftware.slug,
        brand_name: editSoftware.brand_name,
        concept_doi: editSoftware.concept_doi,
      }
    },
  }
}
