import {useEffect,useState} from 'react'
import {EditProject, ProjectLink} from '~/types/Project'
import {getKeywordsForProject, getLinksForProject, getOrganisationsOfProject, getProjectItem, getResearchDomainsForProject} from '~/utils/getProjects'

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


export default function useGetProject({slug,token,reload=false}:
  {slug:string,token:string,reload?:boolean}) {
  const [project, setProject] = useState<EditProject>()
  const [loading, setLoading] = useState(true)

  // console.group('useGetProject')
  // console.log('slug...', slug)
  // console.log('reload...', reload)
  // console.log('token...', token)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    async function getProjectForEdit() {
      setLoading(true)
      const project = await getProjectItem({
        slug,
        token,
        frontend:true
      })
      if (abort) return
      if (project) {
        // load other project related data
        const [
          url_for_project,
          funding_organisations,
          research_domains,
          keywords
        ] = await Promise.all([
          getLinksForProject({project: project.id, token, frontend: true}),
          getOrganisationsOfProject({project: project.id, token, frontend: true, role: 'funding'}),
          getResearchDomainsForProject({project: project.id, token, frontend: true}),
          getKeywordsForProject({project: project.id, token, frontend: true})
        ])
        if (abort) return
        // debugger
        setProject({
          ...project,
          url_for_project: prepareUrlForProject(url_for_project),
          funding_organisations,
          research_domains,
          keywords,
          image_b64: null,
          image_mime_type: null,
        })
      } else {
        setProject(undefined)
      }
      if (abort) return
      setLoading(false)
    }

    if (slug && token) {
      getProjectForEdit()
    }
    return ()=>{abort=true}
  },[slug,token])

  return {
    loading,
    project
  }
}
