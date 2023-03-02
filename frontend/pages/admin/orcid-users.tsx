// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Head from 'next/head'

import {app} from '~/config/app'
import {useSession} from '~/auth'
import RsdAdminContent from '~/auth/RsdAdminContent'
import DefaultLayout from '~/components/layout/DefaultLayout'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {PageTitleSticky} from '~/components/layout/PageTitle'
import AdminNav, {adminPages} from '~/components/admin/AdminNav'
import OrcidUsersList from '~/components/admin/orcid-users/OrcidUsersList'
import AddOrcidUser from '~/components/admin/orcid-users/AddOrcidUser'

const pageTitle = `${adminPages['orcid'].title} | Admin page | ${app.title}`

export default function OrcidWitelistPage() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const [orcids, setOrcids] = useState<string[]>([])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {fetchWhitelistedOrcids()}, [])

  async function fetchWhitelistedOrcids() {
    const resp = await fetch('/api/v1/orcid_whitelist', {
      headers: createJsonHeaders(token)
    })
    const respJson: {orcid: string}[] = await resp.json()
    setOrcids(respJson.map(orcidObject => orcidObject.orcid))
  }

  async function submitOrcid() {
    const formField = document.getElementById('orcid-input') as HTMLInputElement
    const submittedOrcid = formField.value

    const resp = await fetch('/api/v1/orcid_whitelist', {
      body: JSON.stringify({'orcid': submittedOrcid}),
      headers: createJsonHeaders(token),
      method: 'POST'
    })

    const err = await extractReturnMessage(resp)

    if (err.status !== 200) showErrorMessage(`Failed to add ORCID. ${err.message} `)
    fetchWhitelistedOrcids()
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
          <div className="w-full flex justify-between items-center">
            <h1 className="flex-1 w-full md:mt-4">{adminPages['orcid'].title}</h1>
          </div>
        </PageTitleSticky>
        <section className="md:flex gap-8">
          <AdminNav />
          <section className="flex flex-col-reverse gap-8 md:grid md:grid-cols-2">
            <OrcidUsersList
              orcids={orcids}
              onDeleteOrcid={fetchWhitelistedOrcids}
            />
            <AddOrcidUser
              onSubmitOrcid={submitOrcid}
            />
          </section>
        </section>
        <div className='py-8'></div>
      </RsdAdminContent>
    </DefaultLayout>
  )
}
