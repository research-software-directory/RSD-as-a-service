// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Head from 'next/head'
import {GetServerSidePropsContext} from 'next/types'

import {app} from '../../../config/app'
import {useAuth} from '~/auth'
import RsdAdminContent from '~/auth/RsdAdminContent'
import DefaultLayout from '~/components/layout/DefaultLayout'
import {PageTitleSticky} from '~/components/layout/PageTitle'
import PagesNav from '~/components/admin/pages/PagesNav'
import {AdminMenuProps, pagesMenu} from '~/components/admin/pages/PagesNavItems'
import {fetchMarkdownPage, MarkdownPage} from '~/components/admin/pages/useMarkdownPages'

type AdminPagesProps = {
  slug: string
  page: MarkdownPage
}

export default function AdminPages({slug,page}:AdminPagesProps) {
  const {session} = useAuth()
  const [pageSection, setPageSection] = useState<AdminMenuProps>(pagesMenu[slug])
  const pageTitle = `${pageSection.label} | Admin | ${app.title}`

  // console.log('slug...', slug)
  // console.log('page...', page)

  useEffect(() => {
    let abort:boolean=false
    const newSection = pagesMenu[slug]
    if (newSection && abort === false) {
      setPageSection(newSection)
    }
    ()=>{abort=true}
  },[slug])

  function renderStepComponent() {
    if (pageSection.component) {
      return pageSection.component({page,token:session.token})
    }
  }

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <RsdAdminContent>
        <PageTitleSticky
          style={{padding:'1rem 0rem 2rem 0rem'}}
        >
          <h1 className="flex-1 w-full md:mt-4">Public pages</h1>
        </PageTitleSticky>

        <section className="flex-1 grid md:grid-cols-[1fr,2fr] xl:grid-cols-[1fr,4fr] gap-[3rem]">
          <div>
            <PagesNav
              selected={slug}
            />
          </div>
          {renderStepComponent()}
        </section>

      </RsdAdminContent>
    </DefaultLayout>
  )
}

// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try{
    const {params, req} = context

    const section = params?.section
    const token = req?.cookies['rsd_token']
    // console.log('getServerSideProps...params...', params)
    // console.log('getServerSideProps...token...', token)
    // console.log('getServerSideProps...section...', section)

    if (typeof section == 'undefined') {
      // 404 if no section parameter
      return {
        notFound: true,
      }
    }

    // try to load page section
    if (pagesMenu.hasOwnProperty(section.toString()) === false) {
      // 404 is section key does not exists
      return {
        notFound: true,
      }
    }

    // get page data
    const slug = section.toString()
    const {page} = await fetchMarkdownPage({
      slug,
      token,
      frontend:false
    })

    if (page === null) {
      // 404 is section key does not exists
      return {
        notFound: true,
      }
    }

    return {
      // passed to the page component as props
      props: {
        slug,
        page
      },
    }
  }catch(e){
    return {
      notFound: true,
    }
  }
}
