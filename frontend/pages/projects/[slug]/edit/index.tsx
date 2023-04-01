// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
//
// SPDX-License-Identifier: Apache-2.0

import {GetServerSidePropsContext} from 'next/types'

export default function ProjectEditPage() {
  // REDIRECT to /edit/information location (default edit page)
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
      destination: `/projects/${slug}/edit/information`,
      permanent: false,
    },
  }
}
