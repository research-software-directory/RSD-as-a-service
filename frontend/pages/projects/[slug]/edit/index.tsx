// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import Head from 'next/head'
import {useForm, FormProvider} from 'react-hook-form'

import {app} from '../../../../config/app'
import DefaultLayout from '../../../../components/layout/DefaultLayout'
import {EditProjectProvider} from '~/components/projects/edit/editProjectContext'
import EditProjectPage from '~/components/projects/edit/EditProjectPage'
import UserAgrementModal from '~/components/user/settings/UserAgreementModal'

const pageTitle = `Edit project | ${app.title}`

export default function ProjectEditPage() {
  const methods = useForm({
    mode:'onChange'
  })
  const router = useRouter()
  const slug = router.query['slug']

  // console.group('ProjectEditPage')
  // console.log('slug...', slug)
  // console.groupEnd()

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <UserAgrementModal />
      {/* form provider to share isValid, isDirty states in the header */}
      <FormProvider {...methods}>
        {/* edit project context is share project info between pages */}
        <EditProjectProvider>
          <EditProjectPage slug={slug?.toString() ?? ''} />
        </EditProjectProvider>
      </FormProvider>
    </DefaultLayout>
  )
}
