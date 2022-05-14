import {useEffect, useState} from 'react'

import Chip from '@mui/material/Chip'

import {useAuth} from '~/auth'
import {cfgRelatedItems as config} from './config'
import {getRelatedProjectsForProject} from '~/utils/getProjects'
import {addRelatedProjects, deleteRelatedProject} from '~/utils/editProject'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {sortOnStrProp} from '~/utils/sortFn'
import {RelatedProject} from '~/types/Project'
import FindRelatedProject from './FindRelatedProject'
import useProjectContext from '../useProjectContext'


export default function RelatedProjectsForProject() {
  const {session} = useAuth()
  const {showErrorMessage} = useSnackbar()
  const {setLoading,project} = useProjectContext()
  const [relatedProject, setRelatedProject] = useState<RelatedProject[]>([])

  useEffect(() => {
    let abort = false
    async function getRelatedProjects() {
      setLoading(true)
      const resp = await getRelatedProjectsForProject({
        project: project.id,
        token: session.token,
        frontend: true
      })
      // extract software object
      const projects = resp
        .sort((a, b) => sortOnStrProp(a, b, 'title'))
      if (abort) return null
      setRelatedProject(projects)
      setLoading(false)
    }
    if (project.id && session.token) {
      getRelatedProjects()
    }

    ()=>{abort=true}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[project.id,session.token])

  async function onAdd(selected: RelatedProject) {
    // check if already exists
    const find = relatedProject.filter(item => item.slug === selected.slug)
    // debugger
    if (find.length === 0) {
      // append(selected)
      const resp = await addRelatedProjects({
        origin: project.id,
        relation: selected.id,
        token: session.token
      })
      if (resp.status !== 200) {
        showErrorMessage(`Failed to add related software. ${resp.message}`)
      } else {
        const newList = [
          ...relatedProject,
          selected
        ].sort((a, b) => sortOnStrProp(a, b, 'title'))
        setRelatedProject(newList)
      }
    }
  }

  async function onRemove(pos:number) {
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
      <div className="flex flex-wrap py-8">
      {relatedProject.map((project, pos) => {
        return(
          <div
            key={project.id}
            className="py-1 pr-1"
          >
            <Chip
              clickable
              title={project.subtitle}
              label={
                <a href={`/projects/${project.slug}`} target="_blank" rel="noreferrer">{project.title}</a>
              }
              onDelete={() => onRemove(pos)}
            />
          </div>
        )
      })}
      </div>
    </>
  )
}
