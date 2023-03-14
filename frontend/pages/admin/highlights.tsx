// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'

import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import TextField from '@mui/material/TextField'

import {app} from '../../config/app'
import RsdAdminContent from '~/auth/RsdAdminContent'
import DefaultLayout from '~/components/layout/DefaultLayout'
import useSnackbar from '~/components/snackbar/useSnackbar'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import DeleteIcon from '@mui/icons-material/Delete'
import {useSession} from '~/auth'
import {useEffect, useState} from 'react'
import {PageTitleSticky} from '~/components/layout/PageTitle'
import {createJsonHeaders, extractReturnMessage} from '~/utils/fetchHelpers'
import useRsdSettings from '~/config/useRsdSettings'
import {RsdHighlightsProps} from '~/config/rsdSettingsReducer'

type SoftwareHighlight = {
  id: string,
  slug: string,
  updated_at: string
}

export default function OrcidWitelistPage() {
  const {host} = useRsdSettings()
  const pageTitle = `${host.highlights?.titlePlural} | ${app.title}`
  const {showErrorMessage, showWarningMessage} = useSnackbar()

  const [highlights, setHighlights] = useState<SoftwareHighlight[]>([])
  const {token} = useSession()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function fetchHighlights() {
  const resp = await fetch('/api/v1/rpc/all_software_highlights', {
      headers: createJsonHeaders(token)
    })
    const respJson = await resp.json()
    setHighlights(respJson.map((highlight: SoftwareHighlight) => highlight))
  }

  async function submitHighlight() {
    const formField = document.getElementById('highlight-input') as HTMLInputElement
    const submittedSlug = encodeURI(formField.value)

    const respId = await fetch(`/api/v1/software?slug=eq.${submittedSlug}&select=id`)
    const errId = await extractReturnMessage(respId)
    if (errId.status !== 200 ) {
      showErrorMessage('Could not reach database.')
      return
    }

    const respJson = await respId.json()
    if (respJson.length === 0) {
      showErrorMessage('Could not find software.')
      return
    }

    const software = respJson[0].id
    const respPost = await fetch('/api/v1/software_highlight', {
      body: JSON.stringify({software}),
      headers: createJsonHeaders(token),
      method: 'POST'
    })
    if(respPost.status === 409) showWarningMessage(`${formField.value} is already a ${host.highlights?.title}.`)
    const err = await extractReturnMessage(respId)
    if(err.status !== 200) showErrorMessage(`Failed to add ${host.highlights?.title}: ${err.message}`)
    fetchHighlights()
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {fetchHighlights()}, [])

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
            <h1 className="flex-1 w-full md:mt-4">{host.highlights?.titlePlural}</h1>
          </div>
        </PageTitleSticky>
        <section className="flex flex-col-reverse gap-8 md:grid md:grid-cols-2">
          <div>
            <EditSectionTitle
              title={`Current ${host.highlights?.titlePlural}`}
            >
              <h2 className="pr-2">{highlights.length}</h2>
            </EditSectionTitle>
            <div className='py-2'></div>
            <HighlightsList
              highlights={highlights}
              token={token}
              highlightsConf={host.highlights}
              onDeleteCallback={() => fetchHighlights()}
            />
          </div>
          <div>
            <EditSectionTitle title={`Add a ${host.highlights?.title}`} />
            <div className='py-2'></div>
            <form onSubmit={(e) => {
              e.preventDefault()
              submitHighlight()
            }}>
              <TextField
                id="highlight-input"
                variant="standard"
                autoComplete='off'
                placeholder="software_slug"
                helperText="Enter a software slug"
                required
              />
              <Button variant="text" type='submit'>Add to list</Button>
            </form>
          </div>
        </section>
        <div className='py-8'></div>
      </RsdAdminContent>
    </DefaultLayout>
  )
}

function HighlightsList({highlights=[], token, highlightsConf, onDeleteCallback}:
  {highlights: SoftwareHighlight[], token: string, highlightsConf?: RsdHighlightsProps, onDeleteCallback: Function}) {
  const {showErrorMessage} = useSnackbar()

  const highlightTitle = highlightsConf?.title || 'Highlight'

  async function deleteHighlight(highlight: SoftwareHighlight) {
    const resp = await fetch(`/api/v1/software_highlight?software=eq.${highlight.id}`,
    {
      headers: createJsonHeaders(token),
      method: 'DELETE'
    })
    if (resp.status !== 204) showErrorMessage(`Could not delete ${highlightTitle} ${highlight.slug}`)
    onDeleteCallback()
  }

  return (
    <List>
      {
        highlights.map(highlight => {
          const updatedAt: String = new Date(highlight.updated_at).toLocaleString()
          return(
            <ListItem
              key={highlight.id}
              disableGutters
              secondaryAction={
                <IconButton onClick={() => deleteHighlight(highlight)}>
                  <DeleteIcon/>
                </IconButton>
              }
              className="flex flex-col"
            >
                <div className="w-full">{highlight.slug}</div>
                <div className="w-full text-base-content-disabled text-sm">Updated: {updatedAt}</div>
            </ListItem>
          )
        })
      }
    </List>
  )
}
