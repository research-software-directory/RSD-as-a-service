// SPDX-FileCopyrightText: 2026 Dusan Mijatovic (NLEsc) <d.mijatovic@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import Paper from '@mui/material/Paper'
import CircularProgress from '@mui/material/CircularProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Link from 'next/link'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {createJsonHeaders} from '~/utils/fetchHelpers'
import {getUserSettings} from '~/components/user/ssrUserSettings'

type MentionUsageType =
  'Software' |
  'SoftwareReferencePaper'|
  'ProjectImpact'|
  'ProjectOutput' |
  'Citation' |
  'Release'

type MentionBasicData = {
  name: string,
  slug: string | null,
}

const typeToHeader: Map<MentionUsageType, string> = new Map()
typeToHeader.set('Software', 'Software')
typeToHeader.set('SoftwareReferencePaper', 'Software reference papers')
typeToHeader.set('ProjectImpact', 'Project impact')
typeToHeader.set('ProjectOutput', 'Project output')
typeToHeader.set('Citation', 'Citation of')
typeToHeader.set('Release', 'Release of')

async function getUsageOfMention(id: string, token: string | undefined): Promise<Map<MentionUsageType, MentionBasicData[]>> {
  let select = 'software!mention_for_software(brand_name,slug)'
  select += ',softwareReference:software!reference_paper_for_software(brand_name,slug)'
  select += ',projectImpact:project!impact_for_project(title,slug)'
  select += ',projectOutput:project!output_for_project(title,slug)'
  select += ',citations:citation_for_mention!citation_for_mention_citation_fkey(mention!citation_for_mention_mention_fkey(id,doi,title))'
  select += ',releases:release(software!release_software_fkey(brand_name,slug))'

  const resp = await fetch(`/api/v1/mention?id=eq.${id}&select=${select}`, {
    headers: createJsonHeaders(token)
  })
  if (!resp.ok) {
    throw new Error(`Could not obtain usages of this mention with ID ${id}`)
  }

  const json = await resp.json()

  const result: Map<MentionUsageType, MentionBasicData[]> = new Map()
  result.set('Software', [])
  result.set('SoftwareReferencePaper', [])
  result.set('ProjectImpact', [])
  result.set('ProjectOutput', [])
  result.set('Citation', [])
  result.set('Release', [])

  const mentions = json[0]

  mentions.software.forEach((item: {brand_name: string; slug: string}) => {
    const name = item.brand_name
    const slug = item.slug
    result.get('Software')!.push({name, slug})
  })
  mentions.softwareReference.forEach((item: {brand_name: string; slug: string}) => {
    const name = item.brand_name
    const slug = item.slug
    result.get('SoftwareReferencePaper')!.push({name, slug})
  })
  mentions.projectImpact.forEach((item: {title: string; slug: string}) => {
    const name = item.title
    const slug = item.slug
    result.get('ProjectImpact')!.push({name, slug})
  })
  mentions.projectOutput.forEach((item: {title: string; slug: string}) => {
    const name = item.title
    const slug = item.slug
    result.get('ProjectOutput')!.push({name, slug})
  })
  mentions.citations.forEach((item: {mention: {id: string; doi: string | null, title: string}}) => {
    const name = `${item.mention.id}, ${item.mention.doi ?? 'no DOI'}, ${item.mention.title}`
    const slug = null
    result.get('Citation')!.push({name, slug})
  })
  mentions.releases.forEach((item: {software: {brand_name: string; slug: string}}) => {
    const name = item.software.brand_name
    const slug = item.software.slug
    result.get('Release')!.push({name, slug})
  })

  return result
}

function createLinkFromMentionItem(mentionBasicData: MentionBasicData, mentionUsGeType: MentionUsageType): string | null {
  switch(mentionUsGeType) {
    case 'Software':
    case 'SoftwareReferencePaper': return `/software/${mentionBasicData.slug}/edit/mentions`
    case 'ProjectImpact':
    case 'ProjectOutput': return `/projects/${mentionBasicData.slug}/edit/mentions`
    case 'Citation': return null
    case 'Release': return `/software/${mentionBasicData.slug}`
  }
}

export default function MentionLocations({mentionId}: Readonly<{mentionId: string}>) {
  const [mentionLocations, setMentionLocations] = useState<Map<MentionUsageType, MentionBasicData[]> | null>(null)
  const {showErrorMessage} = useSnackbar()

  useEffect(() => {
    getUserSettings()
      .then(({token}) => getUsageOfMention(mentionId, token))
      .then(mentionLocations => setMentionLocations(mentionLocations))
      .catch(reason => showErrorMessage(reason.toString()))
  }, [mentionId]) // eslint-disable-line react-hooks/exhaustive-deps


  if (mentionLocations === null) {
    return <CircularProgress/>
  }

  if (mentionLocations.values().every(arr => arr.length === 0)) {
    return (
      <div>
        No uses found
      </div>
    )
  }

  return (
    <>
      {Array.from(mentionLocations.entries()).map(entry => {
        if (entry[1].length === 0) {
          return null
        }

        return (
          <Paper
            key={typeToHeader.get(entry[0])}
            variant="outlined"
            sx={{
              padding: '1em',
              margin: '1em',
              backgroundColor: 'var(--rsd-base-200)'
            }}>
            <h3>{typeToHeader.get(entry[0])}:</h3>
            <List>
              {entry[1].map((item) => {
                const link = createLinkFromMentionItem(item, entry[0])
                return (
                  <ListItem key={item.slug}>
                    {link === null ? item.name : <Link href={link}>{item.name}</Link>}
                  </ListItem>
                )
              })}
            </List>
          </Paper>
        )
      })}
    </>
  )
}
