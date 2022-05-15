import {useEffect, useState} from 'react'

import {useAuth} from '~/auth'
import {cfgRelatedItems as config} from './config'
import {getRelatedProjectsForSoftware} from '~/utils/getSoftware'
import {addRelatedSoftware, deleteRelatedSoftware} from '~/utils/editProject'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {sortOnStrProp} from '~/utils/sortFn'
import {RelatedProject} from '~/types/Project'
import useSoftwareContext from '../useSoftwareContext'
import FindRelatedProject from '~/components/projects/edit/related/FindRelatedProject'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import RelatedProjectList from '~/components/projects/edit/related/RelatedProjectList'

export default function RelatedProjectsForSoftware() {
  const {session} = useAuth()
  const {showErrorMessage} = useSnackbar()
  const {setLoading,software} = useSoftwareContext()
  const [relatedProject, setRelatedProject] = useState<RelatedProject[]>()

  useEffect(() => {
    let abort = false
    async function getRelatedProjects() {
      // setLoading(true)
      const resp = await getRelatedProjectsForSoftware({
        software: software.id ?? '',
        token: session.token,
        frontend: true
      })
      // extract software object
      const projects = resp
        .sort((a, b) => sortOnStrProp(a, b, 'title'))
      if (abort) return null
      // debugger
      setRelatedProject(projects)
      // setLoading(false)
    }
    if (software.id && session.token) {
      getRelatedProjects()
    }

    ()=>{abort=true}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[software.id,session.token])

  async function onAdd(selected: RelatedProject) {
    if (typeof relatedProject=='undefined') return
    // check if already exists
    const find = relatedProject.filter(item => item.slug === selected.slug)
    // debugger
    if (find.length === 0) {
      // append(selected)
      const resp = await addRelatedSoftware({
        software: software.id ?? '',
        project: selected.id,
        token: session.token
      })
      if (resp.status !== 200) {
        showErrorMessage(`Failed to add related project. ${resp.message}`)
      } else {
        const newList = [
          ...relatedProject,
          selected
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
      const resp = await deleteRelatedSoftware({
        software: software.id ?? '',
        project: related.id,
        token: session.token
      })
      if (resp.status !== 200) {
        showErrorMessage(`Failed to delete related project. ${resp.message}`)
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
        project={''}
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
