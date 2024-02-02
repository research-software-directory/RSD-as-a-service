// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {sortOnNumProp} from '~/utils/sortFn'
import {MentionItemProps} from '~/types/Mention'
import {createJsonHeaders, getBaseUrl} from '~/utils/fetchHelpers'
import logger from '~/utils/logger'

type ImpactForProjectProps = {
  project: string,
  token:string
}

export async function getCitationsByProject({project, token}:
  {project: string, token?: string}) {
  try {
    // the content is ordered by type ascending
    const query = `project=eq.${project}&order=mention_type.asc`
    // construct url
    const url = `${getBaseUrl()}/rpc/citation_by_project?${query}`
    // make request
    const resp = await fetch(url, {
      method: 'GET',
      headers: {
        ...createJsonHeaders(token),
      }
    })
    if (resp.status === 200) {
      const json = await resp.json()
      // extract mentions from software object
      const mentions: MentionItemProps[] = json ?? []
      return mentions
    }
    logger(`getCitationsByProject: [${resp.status}] [${url}]`, 'error')
    // query not found
    return []
  } catch (e: any) {
    logger(`getCitationsByProject: ${e?.message}`, 'error')
    return []
  }
}


export default function useCitationsForProject({project, token}: ImpactForProjectProps) {
  const [loading,setLoading] = useState(false)
  const [mentions, setMentions] = useState<MentionItemProps[]>([])

  useEffect(() => {
    let abort = false
    async function getImpactFromApi() {
      setLoading(true)

      const mentionsForProject = await getCitationsByProject({
        project,
        token
      })
      if (abort === false) {
        const mentions:MentionItemProps[] = mentionsForProject
          .map((item:MentionItemProps) =>{
            // we need to select only props that fit into mention type
            // in order to update items (rsd-admin feature only)
            return {
              id: item.id,
              doi: item.doi,
              url: item.url,
              title: item.title,
              authors: item.authors,
              publisher: item.publisher,
              publication_year: item.publication_year,
              journal: item.journal,
              page: item.page,
              image_url: item.image_url,
              mention_type: item.mention_type,
              source: item.source,
              note: item.note
            }
          })
          .sort((a, b) => {
            // sort mentions on publication year, newest at the top
            return sortOnNumProp(a,b,'publication_year','desc')
          })
        // debugger
        setMentions(mentions)
        setLoading(false)
      }
    }
    if (project && token) {
      getImpactFromApi()
    }
    return () => { abort = true }
  },[project,token])

  // console.group('useCitationsForProject')
  // console.log('loading...', loading)
  // console.log('project...', project)
  // console.log('citationCnt...', mentions.length)
  // console.groupEnd()

  return {
    loading,
    mentions
  }
}
