// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next/types'
import Head from 'next/head'

import {app} from '~/config/app'
import ProtectedContent from '~/auth/ProtectedContent'
import DefaultLayout from '~/components/layout/DefaultLayout'
import {EditProjectProvider, ProjectInfo} from '~/components/projects/edit/editProjectContext'
import UserAgrementModal from '~/components/user/settings/UserAgreementModal'
import {editProjectPage} from '~/components/projects/edit/editProjectPages'
import EditProjectNav from '~/components/projects/edit/EditProjectNav'
import ContentLoader from '~/components/layout/ContentLoader'
import {getProjectItem} from '~/utils/getProjects'
import EditProjectStickyHeader from '~/components/projects/edit/EditProjectStickyHeader'

const pageTitle = `Edit project | ${app.title}`

type ProjectEditPageProps = {
  pageIndex: number
  project: ProjectInfo
}

export default function ProjectEditPage({pageIndex,project}:ProjectEditPageProps) {
  const state = {
    pageIndex,
    project
  }
  const page = editProjectPage[pageIndex]
  // console.group('ProjectEditPage')
  // console.log('pageIndex...', pageIndex)
  // console.log('project...', project)
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
      <ProtectedContent slug={project.slug} pageType="project">
        <UserAgrementModal />
        {/* edit project context is share project info between pages */}
        <EditProjectProvider state={state}>
          <EditProjectStickyHeader />
          <section className="md:flex">
            <EditProjectNav slug={project.slug} pageId={page.id}/>
            {/* Here we load main component of each step */}
            {renderPageComponent()}
          </section>
        </EditProjectProvider>
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
  // get project slug
  const slug = params?.slug?.toString() ?? ''
  // get page id
  const page = params?.page?.toString() ?? ''

  const editProject = await getProjectItem({slug, token})

  // project not found in DB
  if (typeof editProject === 'undefined') {
    return {
      notFound: true,
    }
  }

  let pageIndex = editProjectPage.findIndex(p => p.id === page)
  // Edit project page not found in defs
  if (pageIndex===-1) {
    return {
      notFound: true,
    }
  }

  // will be passed as props to page
  // see params of ProjectEditPageProps function
  return {
    props: {
      pageIndex,
      project: {
        id: editProject.id,
        slug: editProject.slug,
        title: editProject.title
      }
    },
  }
}
