// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {useSession} from '~/auth'
import {TeamMember} from '~/types/Project'
import {getTeamForProject} from '~/utils/getProjects'
import useProjectContext from '../useProjectContext'

export default function useTeamMembers({slug}:{slug:string}) {
  const {token} = useSession()
  const {project, loading, setLoading} = useProjectContext()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loadedSlug,setLoadedSlug] = useState('')

  useEffect(() => {
    let abort = false
    async function getMembers() {
      setLoading(true)
      const members = await getTeamForProject({
        project: project.id,
        token,
        frontend: true
      })
      // debugger
      setMembers(members)
      setLoadedSlug(slug)
      setLoading(false)
    }
    if (slug && token &&
      project.id &&
      slug!==loadedSlug) {
      getMembers()
    }
    return () => { abort = true }
  },[slug,loadedSlug,token,project.id,setLoading])

  return {
    token,
    loading,
    members,
    project,
    setMembers
  }
}
