// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2025 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2025 - 2026 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect,useState} from 'react'
import {SearchOrganisation} from '~/types/Organisation'
import {EditProject, OrganisationsOfProject, ProjectLink} from '~/types/Project'
import {getKeywordsForProject, getLinksForProject, getOrganisationsOfProject, getProjectItem, getResearchDomainsForProject} from '~/components/projects/apiProjects'

function prepareUrlForProject(url_for_project:ProjectLink[]) {
  const data = url_for_project.map((item, pos) => {
    return {
      id: item.id,
      // move id to uuid to avoid prop clash
      // with react-hook-form useFieldArray hook
      uuid: item.id,
      position: pos,
      title: item.title,
      url: item.url,
      project: item.project
    }
  })
  return data
}

function prepareFundingOrganisations(organisations:OrganisationsOfProject[]) {
  const data:SearchOrganisation[] = organisations.map((item, pos) => {
    return {
      ...item,
      pos,
      source: 'RSD',
      description: null
    }
  })
  return data
}

async function getProjectInfoForEdit({slug,token}:
{slug:string,token:string}):Promise<EditProject|undefined> {

  const project = await getProjectItem({
    slug,
    token
  })

  if (project) {
    // load other project related data
    const [
      url_for_project,
      funding_organisations,
      research_domains,
      keywords
    ] = await Promise.all([
      getLinksForProject({project: project.id, token}),
      getOrganisationsOfProject({project: project.id, token, roles:['funding']}),
      getResearchDomainsForProject({project: project.id, token}),
      getKeywordsForProject({project: project.id, token})
    ])

    const data = {
      ...project,
      url_for_project: prepareUrlForProject(url_for_project),
      funding_organisations: prepareFundingOrganisations(funding_organisations),
      research_domains,
      keywords,
      image_b64: null,
      image_mime_type: null,
    }
    // console.log('getProjectInfoForEdit...', data)
    return data
  }
  // return null
}

export default function useProjectToEdit({slug,token}:
{slug:string,token:string,reload?:boolean}) {
  const [project, setProject] = useState<EditProject>()
  const [loading, setLoading] = useState(true)
  const [loadedSlug, setLoadedSlug] = useState<string>('')

  // console.group('useProjectToEdit')
  // console.log('slug...', slug)
  // console.log('loadedSlug...', loadedSlug)
  // console.log('loading...', loading)
  // console.log('project...', project)
  // console.log('token...', token)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    async function getProjectForEdit() {
      setLoading(true)
      const project = await getProjectInfoForEdit({
        slug,
        token
      })
      if (abort) return
      setProject(project)
      setLoadedSlug(slug)
      setLoading(false)
      // debugger
    }
    if (slug && token &&
      slug !== loadedSlug) {
      // debugger
      getProjectForEdit()
    }
    return ()=>{abort=true}
  },[slug,token,loadedSlug])

  return {
    loading,
    project
  }
}
