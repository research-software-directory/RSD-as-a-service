// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next/types'
import Head from 'next/head'

import {app} from '~/config/app'
import ProtectedContent from '~/auth/ProtectedContent'
import DefaultLayout from '~/components/layout/DefaultLayout'
import {EditSoftwareProvider, SoftwareInfo} from '~/components/software/edit/editSoftwareContext'
import UserAgrementModal from '~/components/user/settings/UserAgreementModal'
import {getSoftwareToEdit} from '~/utils/editSoftware'
import {editSoftwarePage} from '~/components/software/edit/editSoftwarePages'
import EditSoftwareStickyHeader from '~/components/software/edit/EditSoftwareStickyHeader'
import EditSoftwareNav from '~/components/software/edit/EditSoftwareNav'
import ContentLoader from '~/components/layout/ContentLoader'

const pageTitle = `Edit software | ${app.title}`

type SoftwareEditPageProps = {
  pageIndex: number
  software: SoftwareInfo
}

export default function SoftwareEditPages({pageIndex,software}:SoftwareEditPageProps) {
  const state = {
    page: editSoftwarePage[pageIndex],
    software
  }

  // console.group('SoftwareEditPages')
  // console.log('pageIndex...', pageIndex)
  // console.log('state...', state)
  // console.log('software...', software)
  // console.groupEnd()

  function renderPageComponent() {
    if (state.page) {
      return state.page.render()
    }
    return <ContentLoader />
  }

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <ProtectedContent slug={software.slug}>
        <UserAgrementModal />
        <EditSoftwareProvider state={state}>
          <EditSoftwareStickyHeader />
          <section className="md:flex">
            <EditSoftwareNav slug={software.slug} pageId={state.page.id} />
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

  let pageIndex = editSoftwarePage.findIndex(p => p.id === page)
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
