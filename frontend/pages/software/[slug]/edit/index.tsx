// SPDX-FileCopyrightText: 2021 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2021 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next/types'

import {app} from '~/config/app'
const pageTitle = `Edit software | ${app.title}`

export default function SoftwareEditPage() {
  // const router = useRouter()
  // const slug = router.query['slug']
  // const methods = useForm({
  //   mode:'onChange'
  // })

  // return (
  //   <DefaultLayout>
  //     <Head>
  //       <title>{pageTitle}</title>
  //     </Head>
  //     <UserAgrementModal />
  //     {/* form provider to share isValid, isDirty states in the header */}
  //     <FormProvider {...methods}>
  //       <EditSoftwareProvider>
  //         <EditSoftwarePage slug={slug?.toString() ?? ''} />
  //       </EditSoftwareProvider>
  //     </FormProvider>
  //   </DefaultLayout>
  // )
}

// REDIRECT to /edit/information location (default edit page)
// fetching data server side
// see documentation https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context:GetServerSidePropsContext) {
  const {params} = context

  const slug = params?.slug?.toString() ?? ''
  // Redirect to /edit/information location as default
  return {
    redirect: {
      destination: `/software/${slug}/edit/information`,
      permanent: false,
    },
  }
}
