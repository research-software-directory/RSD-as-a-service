// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'
import {GetServerSidePropsContext} from 'next'

import {app} from '../../config/app'
import RsdAdminContent from '~/auth/RsdAdminContent'
import DefaultLayout from '~/components/layout/DefaultLayout'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import useSnackbar from '~/components/snackbar/useSnackbar'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {useSession} from '~/auth'
import {useEffect, useState} from 'react'
import Link from '@mui/material/Link'
import {Button, TextField} from '@mui/material'

export default function OrcidWitelistPage() {
  const pageTitle = `ORCID whitelist | ${app.title}`
  const {showErrorMessage, showInfoMessage} = useSnackbar()

  const [orcids, setOrcids] = useState<string[]>([])
  const {token} = useSession()

  async function fetchWhitelistedOrcids() {
    const resp = await fetch('/api/v1/orcid_whitelist', {
      headers: createJsonHeaders(token)
    })
    const respJson: {orcid: string}[] = await resp.json()
    setOrcids(respJson.map(orcidObject => orcidObject.orcid))
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {fetchWhitelistedOrcids()}, [])

  async function submitOrcid() {
    const formField = document.getElementById('orcid-input') as HTMLInputElement
    const submittedOrcid = formField.value

    const resp = await fetch('/api/v1/orcid_whitelist', {
      body: JSON.stringify({'orcid': submittedOrcid}),
      headers: createJsonHeaders(token),
      method: 'POST'
    })
    if (resp.status !== 201) showErrorMessage('Failed to add ORCID.')

    fetchWhitelistedOrcids()
  }

	return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <RsdAdminContent>
        <EditSectionTitle title={'Add an ORCID'}/>
        <form onSubmit={(e) => {e.preventDefault(); submitOrcid()}}>
          <TextField id="orcid-input" required placeholder="0000-0000-0000-0000" inputProps={{pattern: '^\\d{4}-\\d{4}-\\d{4}-\\d{3}[0-9X]$'}}/>
          <Button variant="contained" type='submit'>Add</Button>
        </form>
        <OrcidWhitelist
          orcids={orcids}
          onDeleteCallback={() => fetchWhitelistedOrcids()}
          token={token}/>
      </RsdAdminContent>
    </DefaultLayout>
  )
}

function OrcidWhitelist({orcids, onDeleteCallback, token}: {orcids: string[], onDeleteCallback: Function, token: string}) {
  const {showErrorMessage, showInfoMessage} = useSnackbar()

  async function deleteOrcid(orcid: string) {
    const resp = await fetch(`/api/v1/orcid_whitelist?orcid=eq.${orcid}`, {
      headers: createJsonHeaders(token),
      method: 'DELETE'
    })
    if (resp.status !== 204) showErrorMessage('Failed to delete ORCID.')
    onDeleteCallback()
  }


  return(
    <>
      <EditSectionTitle title={'Whitelisted ORCIDs'}/>
      <List>
        {orcids.map(orcid => {
          return (
            <ListItem key={orcid} disableGutters>
              <Link href={`https://orcid.org/${orcid}`} underline="always" target="_blank" rel="noreferrer">
                {orcid}
              </Link>
              <IconButton onClick={() => deleteOrcid(orcid)}><DeleteIcon/></IconButton>
            </ListItem>
          )
        })}
      </List>
    </>
  )
}
