import {useEffect, useState} from 'react'

import Chip from '@mui/material/Chip'

import {useAuth} from '~/auth'
import {RelatedSoftware} from '~/types/SoftwareTypes'
import FindRelatedSoftware from './FindRelatedSoftware'
import {cfgRelatedItems as config} from './config'
import {getRelatedToolsForProject} from '~/utils/getProjects'
import {addRelatedSoftware, deleteRelatedSoftware} from '~/utils/editProject'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {sortOnStrProp} from '~/utils/sortFn'
import useProjectContext from '../useProjectContext'
import RelatedSoftwareList from './RelatedSoftwareList'
import EditSectionTitle from '~/components/layout/EditSectionTitle'


export default function RelatedSoftwareForProject() {
  const {session} = useAuth()
  const {showErrorMessage} = useSnackbar()
  const {setLoading, project} = useProjectContext()
  const [relatedSoftware, setRelatedSoftware] = useState<RelatedSoftware[]>()

  useEffect(() => {
    let abort = false
    async function getRelatedSoftware() {
      setLoading(true)
      const resp = await getRelatedToolsForProject({
        project: project.id,
        token: session.token,
        frontend: true
      })
      // extract software object
      const software = resp
        .map(item => item.software)
        .sort((a, b) => sortOnStrProp(a, b, 'brand_name'))
      if (abort) return null
      setRelatedSoftware(software)
      setLoading(false)
    }
    if (project.id && session.token) {
      getRelatedSoftware()
    }

    ()=>{abort=true}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[project.id,session.token])

  async function onAdd(selected: RelatedSoftware) {
    if (typeof relatedSoftware == 'undefined') return
    // check if already exists
    const find = relatedSoftware.filter(item => item.slug === selected.slug)
    // debugger
    if (find.length === 0) {
      // append(selected)
      const resp = await addRelatedSoftware({
        project: project.id,
        software: selected.id,
        token: session.token
      })
      if (resp.status !== 200) {
        showErrorMessage(`Failed to add related software. ${resp.message}`)
      } else {
        const newList = [
          ...relatedSoftware,
          selected
        ].sort((a, b) => sortOnStrProp(a, b, 'brand_name'))
        setRelatedSoftware(newList)
      }
    }
  }

  async function onRemove(pos: number) {
    if (typeof relatedSoftware == 'undefined') return
    // remove(pos)
    const software = relatedSoftware[pos]
    if (software) {
      const resp = await deleteRelatedSoftware({
        project: project.id,
        software: software.id,
        token: session.token
      })
      if (resp.status !== 200) {
        showErrorMessage(`Failed to add related software. ${resp.message}`)
      } else {
        const newList = [
          ...relatedSoftware.slice(0, pos),
          ...relatedSoftware.slice(pos+1)
        ].sort((a, b) => sortOnStrProp(a, b, 'brand_name'))
        setRelatedSoftware(newList)
      }
    }
  }

  return (
    <>
      <EditSectionTitle
        title={config.relatedSoftware.title}
        subtitle={config.relatedSoftware.subtitle}
      >
        {/* add count to title */}
        {relatedSoftware && relatedSoftware.length > 0 ?
          <div className="pl-4 text-2xl">{relatedSoftware.length}</div>
          : null
        }
      </EditSectionTitle>
      <FindRelatedSoftware
        software={''}
        token={session.token}
        config={{
          freeSolo: false,
          minLength: config.relatedSoftware.validation.minLength,
          label: config.relatedSoftware.label,
          help: config.relatedSoftware.help,
          reset: true
        }}
        onAdd={onAdd}
      />
      <div className="py-8">
        <RelatedSoftwareList
          software={relatedSoftware}
          onRemove={onRemove}
        />
      </div>
    </>
  )
}
