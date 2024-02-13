// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {getMentionsForProject} from '~/utils/getProjects'

import {sortOnNumProp} from '~/utils/sortFn'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'

type ImpactForProjectProps = {
  project: string,
  token:string
}

export default function useImpactForProject({project, token}: ImpactForProjectProps) {
  const {mentions, setMentions, loading, setLoading} = useEditMentionReducer()
  const [loadedProject, setLoadedProject] = useState('')

  useEffect(() => {
    let abort = false
    async function getImpactFromApi() {
      setLoading(true)

      const mentionsForProject = await getMentionsForProject({
        project,
        table:'impact_for_project',
        token
      })

      if (abort === false) {
        mentionsForProject.sort((a, b) => {
          // sort mentions on publication year, newest at the top
          return sortOnNumProp(a,b,'publication_year','desc')
        })
        setMentions(mentionsForProject)
        setLoadedProject(project)
        setLoading(false)
      }
    }
    if (project && token && project!==loadedProject) {
      getImpactFromApi()
    }
    return () => { abort = true }
    // we skip setMentions and setLoading methods in the deps to avoid loop
    // TODO! try wrapping methods of useEditMentionReducer in useCallback?
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[project,token,loadedProject])

  // console.group('useImpactForProject')
  // console.log('loading...', loading)
  // console.log('project...', project)
  // console.log('impactCnt...', mentions.length)
  // console.log('loadedProject...', loadedProject)
  // console.groupEnd()

  return {
    loading,
    impactCnt: mentions.length,
  }
}
