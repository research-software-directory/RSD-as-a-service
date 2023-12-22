// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import useEditMentionReducer from '~/components/mention/useEditMentionReducer'
import {MentionItemProps} from '~/types/Mention'
import {getMentionsForProject} from '~/utils/getProjects'
import {sortOnNumProp} from '~/utils/sortFn'

type OutputForProjectProps = {
  project: string,
  token:string
}

export default function useOutputForProject({project, token}: OutputForProjectProps) {
  const {setLoading, setMentions, loading, mentions} = useEditMentionReducer()
  const [loadedProject, setLoadedProject] = useState('')

  useEffect(() => {
    let abort = false
    async function getImpact() {
      setLoading(true)
      const mentions = await getMentionsForProject({
        project,
        table:'output_for_project',
        token
      })
      const output:MentionItemProps[] = mentions.sort((a, b) => {
        // sort mentions on publication year, newest at the top
        return sortOnNumProp(a,b,'publication_year','desc')
      })
      // debugger
      if (mentions && abort === false) {
        setMentions(output)
        setLoadedProject(project)
        setLoading(false)
      }
    }
    if (project && token && project!==loadedProject) {
      getImpact()
    }

    return () => { abort = true }
    // we skip setMentions and setLoading methods in the deps to avoid loop
    // TODO! try wrapping methods of useEditMentionReducer in useCallback?
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[project,token,loadedProject])

  // console.group('useOutputForProject')
  // console.log('loading...', loading)
  // console.log('outputCnt...', mentions.length)
  // console.groupEnd()

  return {
    loading,
    outputCnt: mentions.length,
  }
}
