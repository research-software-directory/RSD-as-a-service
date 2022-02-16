import {useEffect, useState} from 'react'
import {AutocompleteOption} from '../types/AutocompleteOptions'
import {EditSoftwareItem, License, SoftwareItem, Tag} from '../types/SoftwareTypes'
import {getSoftwareToEdit} from './editSoftware'
import {getLicenseForSoftware, getTagsForSoftware} from './getSoftware'

export default function useEditSoftwareData({slug, token}: {slug: string, token: string}) {
  const [software, setSoftware] = useState<SoftwareItem>()
  const [editSoftware, setEditSoftware] = useState<EditSoftwareItem>()
  const [loading, setLoading] = useState(true)

  // console.group('useEditSoftwareData')
  // console.log('slug...', slug)
  // console.log('token...', token)
  // console.log('software...', software)
  // console.log('editSoftware...', editSoftware)
  // console.log('loading...', loading)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    if (slug && token) {
      getSoftwareToEdit({slug, token})
        .then(data => {
          // exit on abort
          if (abort) return
          // set data
          setSoftware(data)
        })
    }
    return ()=>{abort=true}
  },[slug,token])

  useEffect(() => {
    let abort=false
    if (software?.id) {
      // make all requests
      const requests = [
        getTagsForSoftware(software.id, true, token),
        getLicenseForSoftware(software.id, true, token)
      ]
      Promise.all(requests)
        .then(([respTag, respLicense]) => {
        // prepare tags
        const tags:AutocompleteOption<Tag>[] = respTag?.map((item:any) => {
          return {
            key: item.tag,
            label: item.tag,
            data: item
          }
        })||[]
        // prepare licenses
        const licenses:AutocompleteOption<License>[] = respLicense?.map((item:any) => {
          return {
            key: item.license,
            label: item.license,
            data: item
          }
        }) || []
        // exit on abort
        if (abort) return
        //send all data
        setEditSoftware({
          ...software,
          tags,
          licenses
        })
          setLoading(false)
      })
    }
    return ()=>{abort=true}
  },[software,slug,token])

  return {
    slug,
    loading,
    editSoftware,
    setEditSoftware
  }
}
