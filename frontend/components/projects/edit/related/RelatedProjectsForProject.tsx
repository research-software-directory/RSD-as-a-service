import {useEffect, useState} from 'react'

import {useAuth} from '~/auth'
import {cfgRelatedItems as config} from './config'
import {getRelatedProjectsForProject} from '~/utils/getProjects'
import {addRelatedProject, deleteRelatedProject} from '~/utils/editProject'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {sortOnStrProp} from '~/utils/sortFn'
import {RelatedProject, SearchProject} from '~/types/Project'
import FindRelatedProject from './FindRelatedProject'
import useProjectContext from '../useProjectContext'
import RelatedProjectList from './RelatedProjectList'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import isMaintainerOfProject from '~/auth/permissions/isMaintainerOfProject'
import {Status} from '~/types/Organisation'

export default function RelatedProjectsForProject() {
  const {session} = useAuth()
  const {showErrorMessage} = useSnackbar()
  const {setLoading,project} = useProjectContext()
  const [relatedProject, setRelatedProject] = useState<RelatedProject[]>()

  useEffect(() => {
    let abort = false
    async function getRelatedProjects() {
      setLoading(true)
      const projects = await getRelatedProjectsForProject({
        project: project.id,
        token: session.token,
        frontend: true,
        approved: false
      })
      // check abort
      if (abort) return null
      // set local state
      setRelatedProject(projects)
      setLoading(false)
    }
    if (project.id && session.token) {
      getRelatedProjects()
    }

    ()=>{abort=true}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[project.id,session.token])

  async function onAdd(selected: SearchProject) {
    if (typeof relatedProject=='undefined') return
    // check if already exists
    const find = relatedProject.filter(item => item.slug === selected.slug)
    // debugger
    if (find.length === 0) {
      // determine status of relation between projects 'ownership'
      const isMaintainer = await isMaintainerOfProject({
        slug: selected.slug,
        account: session.user?.account,
        token: session.token,
        frontend: true
      })
      const status:Status = isMaintainer ? 'approved' : 'requested_by_origin'
      // append(selected)
      const resp = await addRelatedProject({
        origin: project.id,
        relation: selected.id,
        status,
        token: session.token
      })
      if (resp.status !== 200) {
        showErrorMessage(`Failed to add related software. ${resp.message}`)
      } else {
        const newList = [
          ...relatedProject,
          {
            ...selected,
            image_id: null,
            updated_at: null,
            date_end: null,
            status
          }
        ].sort((a, b) => sortOnStrProp(a, b, 'title'))
        setRelatedProject(newList)
      }
    }
  }

  async function onRemove(pos: number) {
    if (typeof relatedProject=='undefined') return
    // remove(pos)
    const related = relatedProject[pos]
    if (related) {
      const resp = await deleteRelatedProject({
        origin: project.id,
        relation: related.id,
        token: session.token
      })
      if (resp.status !== 200) {
        showErrorMessage(`Failed to add related software. ${resp.message}`)
      } else {
        const newList = [
          ...relatedProject.slice(0, pos),
          ...relatedProject.slice(pos+1)
        ].sort((a, b) => sortOnStrProp(a, b, 'brand_name'))
        setRelatedProject(newList)
      }
    }
  }

  return (
    <>
      <EditSectionTitle
        title={config.relatedProject.title}
        subtitle={config.relatedProject.subtitle}
      >
        {/* add count to title */}
        {relatedProject && relatedProject.length > 0 ?
          <div className="pl-4 text-2xl">{relatedProject.length}</div>
          : null
        }
      </EditSectionTitle>
      <FindRelatedProject
        project={project.id}
        token={session.token}
        config={{
          freeSolo: false,
          minLength: config.relatedProject.validation.minLength,
          label: config.relatedProject.label,
          help: config.relatedProject.help,
          reset: true
        }}
        onAdd={onAdd}
      />
      <div className="py-8">
        <RelatedProjectList
          projects={relatedProject}
          onRemove={onRemove}
        />
      </div>
    </>
  )
}
