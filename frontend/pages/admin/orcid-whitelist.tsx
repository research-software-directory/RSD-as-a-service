// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Head from 'next/head'
import Link from '@mui/material/Link'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import ListItemText from '@mui/material/ListItemText'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import DeleteIcon from '@mui/icons-material/Delete'
import IconButton from '@mui/material/IconButton'

import {useSession} from '~/auth'
import {app} from '../../config/app'
import RsdAdminContent from '~/auth/RsdAdminContent'
import DefaultLayout from '~/components/layout/DefaultLayout'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import useSnackbar from '~/components/snackbar/useSnackbar'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {PageTitleSticky} from '~/components/layout/PageTitle'

export default function OrcidWitelistPage() {
  const pageTitle = `ORCID whitelist | ${app.title}`
  const {showErrorMessage} = useSnackbar()

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
            <h1 className="flex-1 w-full md:mt-4">ORCID whitelist</h1>
          </div>
        </PageTitleSticky>
        <section className="flex flex-col-reverse gap-8 md:grid md:grid-cols-2">
          <div>
            <EditSectionTitle
              title={'Allowed ORCIDs'}
            >
              <h2 className="pr-2">{orcids.length}</h2>
            </EditSectionTitle>
            <div className='py-2'></div>
            <OrcidWhitelist
              orcids={orcids}
              onDeleteCallback={() => fetchWhitelistedOrcids()}
              token={token} />
          </div>
          <div>
            <EditSectionTitle title={'Add an ORCID'} />
            <div className='py-2'></div>
            <form onSubmit={(e) => {
              e.preventDefault()
              submitOrcid()
            }}>
              <TextField
                id="orcid-input"
                variant="standard"
                autoComplete='off'
                placeholder="0000-0000-0000-0000"
                helperText="Provide valid orcid"
                inputProps={{pattern: '^\\d{4}-\\d{4}-\\d{4}-\\d{3}[0-9X]$'}}
                required
              />
              <Button variant="text" type='submit'>Add to whitelist</Button>
            </form>
          </div>
        </section>
        <div className='py-8'></div>
      </RsdAdminContent>
    </DefaultLayout>
  )
}

function OrcidWhitelist({orcids, onDeleteCallback, token}:
  { orcids: string[], onDeleteCallback: Function, token: string }) {
  const {showErrorMessage} = useSnackbar()
  const [names, setNames] = useState<Map<string, string>>(new Map())
  const [fetchingNames, setFetchingNames] = useState<boolean>(false)

  async function deleteOrcid(orcid: string) {
    const resp = await fetch(`/api/v1/orcid_whitelist?orcid=eq.${orcid}`, {
      headers: createJsonHeaders(token),
      method: 'DELETE'
    })
    if (resp.status !== 204) showErrorMessage('Failed to delete ORCID.')
    onDeleteCallback()
  }

  async function fetchNameFromOrcids(orcids: string[]): Promise<Map<string, string>> {
    if(orcids.length === 0) return new Map()

    const orcidsJoined = orcids.join('+')
    const url = `https://pub.orcid.org/v3.0/expanded-search/?q=orcid:(${orcidsJoined})`
    const response = await fetch(url, {headers: {...createJsonHeaders(undefined)}})

    if((response).status !== 200) return new Map()

    const json = await response.json()
    const results = json['expanded-result']
    const orcidNameMap = new Map()
    for (const result of results) {
      orcidNameMap.set(result['orcid-id'], result['given-names'] + ' ' + result['family-names'])
    }
    return orcidNameMap
  }

  async function setAllNames() {
    setFetchingNames(true)
    const oldNames = names
    const newNames = await fetchNameFromOrcids(orcids)

    for (const orcid of Array.from(oldNames.keys())) {
      if(!newNames.has(orcid) && typeof oldNames.get(orcid) === 'string') newNames.set(orcid, oldNames.get(orcid) as string)
    }

    setNames(newNames)
    setFetchingNames(false)
  }


  return (
    <>
      <div className='h-[2rem] mb-4'>
        {fetchingNames ?
          <CircularProgress size="2rem" />
          :
          <Button
            variant="contained"
            onClick={() => setAllNames()}>
            Fetch names
          </Button>
        }
      </div>
      <List>
        {orcids.map(orcid => {
          return (
            <ListItem
              key={orcid} disableGutters
              secondaryAction={
                <IconButton onClick={() => deleteOrcid(orcid)}><DeleteIcon/></IconButton>
              }
            >
              <ListItemText
                primary={
                  <Link href={`https://orcid.org/${orcid}`} underline="always" target="_blank" rel="noreferrer">
                    {orcid}
                  </Link>
                }
                secondary={
                  <span>{names.get(orcid) ?? ''}</span>
                }
              />
            </ListItem>
          )
        })}
      </List>
    </>
  )
}
