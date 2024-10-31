// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Matthias Rüster (GFZ) <matthias.ruester@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'
import {GetServerSidePropsContext} from 'next'

import {app} from '../../config/app'
import DefaultLayout from '~/components/layout/DefaultLayout'
import {getPageLinks} from '~/components/admin/pages/useMarkdownPages'
import {RsdLink} from '~/config/rsdSettingsReducer'
import EditMarkdownPages from '~/components/admin/pages/edit'
import RsdAdminContent from '~/auth/RsdAdminContent'
import {adminPages} from '~/components/admin/AdminNav'

type AdminPagesProps = {
  links: RsdLink[]
}

const pageTitle = `${adminPages['pages'].title} | Admin page | ${app.title}`

export default function AdminPublicPages({links}:AdminPagesProps) {

  // console.group('AdminPublicPages')
  // console.log('links...', links)
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
    const {req} = context
    const token = req?.cookies['rsd_token']

    // get links to all pages server side
    const links = await getPageLinks({is_published: false, token})

    return {
      // passed to the page component as props
      props: {
        links
      },
    }
  }catch{
    return {
      notFound: true,
    }
  }
}
