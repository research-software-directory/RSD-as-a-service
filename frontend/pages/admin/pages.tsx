// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'
import {GetServerSidePropsContext} from 'next'

import {app} from '../../config/app'
import RsdAdminContent from '~/auth/RsdAdminContent'
import DefaultLayout from '~/components/layout/DefaultLayout'
import {getPageLinks} from '~/components/page/useMarkdownPages'
import {RsdLink} from '~/config/rsdSettingsReducer'
import EditMarkdownPages from '~/components/page/edit'

type AdminPagesProps = {
  links: RsdLink[]
}

export default function AdminPages({links}:AdminPagesProps) {
  const pageTitle = `Admin pages | ${app.title}`

  // console.group('AdminPages')
  // console.log('selected...', selected)
  // console.log('page...', page)
  // console.log('loading...', loading)
  // console.groupEnd()

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <RsdAdminContent>
        <EditMarkdownPages links={links} />
      </RsdAdminContent>
    </DefaultLayout>
  )
}

// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  try{
    const {params, req} = context
    const token = req?.cookies['rsd_token']

    // get links to all pages server side
    const links = await getPageLinks({is_published: false, token})

    return {
      // passed to the page component as props
      props: {
        links
      },
    }
  }catch(e){
    return {
      notFound: true,
    }
  }
}
