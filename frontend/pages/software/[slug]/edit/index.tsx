// SPDX-FileCopyrightText: 2021 - 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useRouter} from 'next/router'
import Head from 'next/head'

import {app} from '~/config/app'
import DefaultLayout from '~/components/layout/DefaultLayout'
import {EditSoftwareProvider} from '~/components/software/edit/editSoftwareContext'
import EditSoftwarePage from '~/components/software/edit/EditSoftwarePage'
import {FormProvider, useForm} from 'react-hook-form'

const pageTitle = `Edit software | ${app.title}`

export default function SoftwareEditPage() {
  const router = useRouter()
  const slug = router.query['slug']
  const methods = useForm({
    mode:'onChange'
  })

  // console.group('SoftwareEditPage')
  // console.log('slug...', slug)
  // console.log('pageState...', pageState)
  // console.groupEnd()

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      {/* form provider to share isValid, isDirty states in the header */}
      <FormProvider {...methods}>
        <EditSoftwareProvider>
          <EditSoftwarePage slug={slug?.toString() ?? ''} />
        </EditSoftwareProvider>
      </FormProvider>
    </DefaultLayout>
  )
}
