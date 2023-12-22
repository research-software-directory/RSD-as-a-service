// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import RsdAdminContent from '~/auth/RsdAdminContent'
import AdminNav from '~/components/admin/AdminNav'
import {PageTitleSticky} from '~/components/layout/PageTitle'

type AdminPagWithNavProps = {
  title: string,
  children: any
}

export default function AdminPageWithNav({title,children}:AdminPagWithNavProps) {
  return (
    <RsdAdminContent>
      <PageTitleSticky
        style={{padding:'1rem 0rem 2rem 0rem'}}
      >
        {/* <div className="w-full flex justify-between items-center"> */}
        <h1 className="flex-1 w-full md:mt-4">{title ?? 'Admin page'}</h1>
        {/* </div> */}
      </PageTitleSticky>
      <section className="md:flex gap-8">
        <AdminNav />
        {children}
      </section>
      <div className='py-8'></div>
    </RsdAdminContent>
  )
}
