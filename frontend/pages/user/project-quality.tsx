// SPDX-FileCopyrightText: 2023 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import Head from 'next/head'
import {app} from '../../config/app'
import {useAuth} from '~/auth'
import ProtectedContent from '~/auth/ProtectedContent'
import DefaultLayout from '~/components/layout/DefaultLayout'
import SortableTable, {SortableTableProperties} from '~/components/SortableTable'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import {useState} from 'react'
import {useEffect} from 'react'
import Switch from '@mui/material/Switch'


export default function ProjectQuality() {
  const [dataLoaded, setDataLoaded]= useState(false)
  const [data, setData]= useState<any[]>([])
  const [showAll, setShowAll]= useState(false)
  const {session} = useAuth()
  const pageTitle = `${session.user?.name} | ${app.title}`
  const isAdmin = session.user?.role === 'rsd_admin'

  const realLabels = new Map<string, SortableTableProperties>()
  realLabels.set('title', {'label': 'Title', 'type': 'text'})
  realLabels.set('has_subtitle', {'label': 'Subtitle', 'type': 'boolean'})
  realLabels.set('is_published', {'label': 'Published', 'type': 'boolean'})
  realLabels.set('has_start_date', {'label': 'Start date', 'type': 'boolean'})
  realLabels.set('has_end_date', {'label': 'End date', 'type': 'boolean'})
  realLabels.set('has_image', {'label': 'Image', 'type': 'boolean'})
  realLabels.set('team_member_cnt', {'label': 'Team members', 'type': 'number'})
  realLabels.set('has_contact_person', {'label': 'Contact person', 'type': 'boolean'})
  realLabels.set('participating_org_cnt', {'label': 'Participating orgs', 'type': 'number'})
  realLabels.set('funding_org_cnt', {'label': 'Funding orgs', 'type': 'number'})
  realLabels.set('keyword_cnt', {'label': 'Keywords', 'type': 'number'})
  realLabels.set('research_domain_cnt', {'label': 'Research domains', 'type': 'number'})
  realLabels.set('impact_cnt', {'label': 'Impact', 'type': 'number'})
  realLabels.set('output_cnt', {'label': 'Output', 'type': 'number'})
  realLabels.set('score', {'label': 'Score', 'type': 'number'})
  realLabels.set('view', {'label': 'View', 'type': 'link'})
  realLabels.set('edit', {'label': 'Edit', 'type': 'link'})

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {fetchProjectQuality(false)}, [])

  async function fetchProjectQuality(showAll: boolean) {
    return await fetch(getBaseUrl() + `/rpc/project_quality?show_all=${showAll}`, {
      headers: {
        ...createJsonHeaders(session.token),
      }
    })
      .then(res => res.json())
      .then(data => handleData(data))
  }

  function handleData(data: any[]) {
    data.forEach(element => {
      element.view = {slug: `/projects/${element.slug}`, text: '👁️'}
      element.edit = {slug: `/projects/${element.slug}/edit`, text: '✒️'}
      element.score = calculateScore(element)
    })
    setData(data)
    setDataLoaded(true)
  }

  function calculateScore(element: any) {
    let score = 0
    for (const property in element) {
      if (element[property] === true || (Number.isInteger(element[property]) && element[property] > 0)) score += 1
    }
    return score
  }

  async function handleShowAll(newShowAll: boolean) {
    setDataLoaded(false)
    fetchProjectQuality(newShowAll)
    setShowAll(newShowAll)
  }

  return (
    <DefaultLayout>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <ProtectedContent>
        {!dataLoaded && 'Loading...'}
        {dataLoaded &&
          <>
            {isAdmin && <><Switch checked={showAll} onChange={event => handleShowAll(event.target.checked)}/> Show all</>}
            <SortableTable metadata={realLabels} initialData={data}/>
          </>
        }
      </ProtectedContent>
    </DefaultLayout>
  )
}
