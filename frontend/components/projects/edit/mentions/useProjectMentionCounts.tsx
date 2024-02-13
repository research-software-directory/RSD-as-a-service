// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {useSession} from '~/auth'
import {getMentionsForProject} from '~/utils/getProjects'
import useProjectContext from '~/components/projects/edit/useProjectContext'
import {getCitationsByProject} from '~/components/projects/edit/mentions/citations/useCitationsForProject'

async function getMentionCounts(project:string,token:string){
  try{
    const [outputItems,impactItems,citationItems] = await Promise.all([
      getMentionsForProject({
        project,
        table:'output_for_project',
        token
      }),
      getMentionsForProject({
        project,
        table:'impact_for_project',
        token
      }),
      getCitationsByProject({
        project,
        token
      })
    ])
    // debugger
    return {
      output: outputItems?.length ?? 0,
      impact: impactItems?.length ?? 0,
      citation: citationItems?.length ?? 0
    }
  }catch(e:any){
    return {
      output: 0,
      citation: 0,
      impact: 0
    }
  }
}


export default function useProjectMentionCounts(){
  const {token} = useSession()
  const {project} = useProjectContext()
  const [loading, setLoading] = useState(true)
  const [counts,setCounts]= useState({
    output: 0,
    citation: 0,
    impact: 0
  })

  useEffect(()=>{
    if (project?.id,token){
      // debugger
      setLoading(true)
      getMentionCounts(project?.id,token)
        .then(counts=>setCounts(counts))
        .finally(()=>setLoading(false))
    }
  },[project?.id,token])

  return {
    counts,
    loading
  }
}
