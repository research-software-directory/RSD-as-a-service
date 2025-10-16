// SPDX-FileCopyrightText: 2023 - 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2025 Dusan Mijatovic (Netherlands eScience Center)
//
// SPDX-License-Identifier: Apache-2.0

import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'
import {SortableTableProperties} from './SortableTable'

export type ProjectQualityProps = {
  slug: string,
  title: string,
  has_subtitle: boolean,
  is_published: boolean,
  date_start: string | null,
  date_end: string | null,
  grant_id: string | null,
  has_image: boolean,
  has_contact_person: boolean,
  team_member_cnt: number,
  participating_org_cnt: number,
  funding_org_cnt: number,
  software_cnt: number,
  project_cnt: number,
  keyword_cnt: number,
  research_domain_cnt: number,
  impact_cnt: number,
  output_cnt: number,
  category_cnt: number,
  score: number
}

export type ProjectQualityKeys = keyof ProjectQualityProps

export const colLabels = new Map<string, SortableTableProperties>()
colLabels.set('title', {'label': 'Title', 'type': 'link', sx:{minWidth:'14rem'}})
colLabels.set('score', {'label': 'Metadata score', 'type': 'pct'})
colLabels.set('has_subtitle', {'label': 'Subtitle', 'type': 'boolean'})
colLabels.set('is_published', {'label': 'Published', 'type': 'boolean'})
colLabels.set('date_start', {'label': 'Start date', 'type': 'text', sx:{'whiteSpace': 'nowrap'}})
colLabels.set('date_end', {'label': 'End date', 'type': 'text', sx:{'whiteSpace': 'nowrap'}})
colLabels.set('grant_id', {'label': 'Grant ID', 'type': 'text'})
colLabels.set('has_image', {'label': 'Image', 'type': 'boolean'})
colLabels.set('has_contact_person', {'label': 'Contact person', 'type': 'boolean'})
colLabels.set('team_member_cnt', {'label': 'Team members', 'type': 'number'})
colLabels.set('participating_org_cnt', {'label': 'Participating organisations', 'type': 'number'})
colLabels.set('funding_org_cnt', {'label': 'Funding organisations', 'type': 'number'})
colLabels.set('software_cnt', {'label': 'Related software', 'type': 'number'})
colLabels.set('project_cnt', {'label': 'Related projects', 'type': 'number'})
colLabels.set('keyword_cnt', {'label': 'Keywords', 'type': 'number'})
colLabels.set('research_domain_cnt', {'label': 'Research domains', 'type': 'number'})
colLabels.set('impact_cnt', {'label': 'Impact', 'type': 'number'})
colLabels.set('output_cnt', {'label': 'Output', 'type': 'number'})
colLabels.set('category_cnt', {'label': 'Categories', 'type': 'number'})

export async function fetchProjectQuality(showAll: boolean, token?:string): Promise<ProjectQualityProps[]> {
  try {
    const url = getBaseUrl() + `/rpc/project_quality?show_all=${showAll}`
    const resp = await fetch(url, {
      headers: {
        ...createJsonHeaders(token),
      }
    })
    if (resp.status === 200) {
      const json:ProjectQualityProps[] = await resp.json()
      return handleData(json)
    }
    logger(`fetchProjectQuality...${resp.status}: ${resp.statusText}`)
    return []
  } catch (e: any) {
    logger(`fetchProjectQuality...error: ${e.message}`)
    return []
  }
}

function handleData(data: ProjectQualityProps[]): ProjectQualityProps[] {
  data.forEach(element => {
    element.score = calculateScore(element)
  })
  return data
}

function calculateScore(element:ProjectQualityProps): number {
  let score = 0
  let kpiCount = 0

  const keys = Object.keys(element) as ProjectQualityKeys[]
  keys.forEach((key) => {
    if (key === 'title' || key === 'slug' || key === 'score') {
      return
    }

    const value = element[key]
    if (typeof value !== 'undefined' && (value === true || (Number.isInteger(value) && value as number > 0) || typeof value === 'string')){
      score += 1
    }
    kpiCount +=1
  })

  if (kpiCount === 0) return 0
  return Math.round((score/kpiCount)*100)
}
