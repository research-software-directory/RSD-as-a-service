import {useEffect, useState} from 'react'

import Chip from '@mui/material/Chip'

import {useAuth} from '~/auth'
import {RelatedSoftware} from '~/types/SoftwareTypes'

import {cfgRelatedItems as config} from './config'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {sortOnStrProp} from '~/utils/sortFn'
import useSoftwareContext from '../useSoftwareContext'
import FindRelatedSoftware from '~/components/projects/edit/related/FindRelatedSoftware'
import {addRelatedSoftware, deleteRelatedSoftware, getRelatedToolsForSoftware} from '~/utils/editRelatedSoftware'


export default function RelatedSoftwareForSoftware() {
  const {session} = useAuth()
  const {showErrorMessage} = useSnackbar()
  const {setLoading, software} = useSoftwareContext()
  const [relatedSoftware, setRelatedSoftware] = useState<RelatedSoftware[]>([])

  useEffect(() => {
    let abort = false
    async function getRelatedSoftware() {
      setLoading(true)
      const resp = await getRelatedToolsForSoftware({
        software: software.id ?? '',
        token: session.token,
        frontend: true
      })
      const softwareList = resp
        .map(item => item.software)
        .sort((a, b) => sortOnStrProp(a, b, 'brand_name'))
      if (abort) return null
      setRelatedSoftware(softwareList)
      setLoading(false)
    }
    if (software.id && session.token) {
      getRelatedSoftware()
    }

    ()=>{abort=true}
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[software.id,session.token])

  async function onAdd(selected: RelatedSoftware) {
    // check if already exists
    const find = relatedSoftware.filter(item => item.slug === selected.slug)
    // debugger
    if (find.length === 0) {
      // append(selected)
      const resp = await addRelatedSoftware({
        origin: software.id ?? '',
        relation: selected.id,
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

  async function onRemove(pos:number) {
    // remove(pos)
    const related = relatedSoftware[pos]
    if (software && related) {
      const resp = await deleteRelatedSoftware({
        origin: software.id ?? '',
        relation: related.id ?? '',
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
      <FindRelatedSoftware
        software={software.id ?? ''}
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
      <div className="flex flex-wrap py-8">
      {relatedSoftware.map((software, pos) => {
        return(
          <div
            key={software.id}
            className="py-1 pr-1"
          >
            <Chip
              clickable
              title={software.short_statement}
              label={
                <a href={`/software/${software.slug}`} target="_blank" rel="noreferrer">{software.brand_name}</a>
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
