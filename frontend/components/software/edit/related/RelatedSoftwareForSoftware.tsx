// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'

import {useSession} from '~/auth'
import {RelatedSoftwareOfSoftware, SearchSoftware} from '~/types/SoftwareTypes'

import {cfgRelatedItems as config} from './config'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {sortOnStrProp} from '~/utils/sortFn'
import useSoftwareContext from '../useSoftwareContext'
import FindRelatedSoftware from '~/components/projects/edit/related/FindRelatedSoftware'
import {addRelatedSoftware, deleteRelatedSoftware, getRelatedSoftwareForSoftware} from '~/utils/editRelatedSoftware'

import RelatedSoftwareList from '../../../projects/edit/related/RelatedSoftwareList'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import {Status} from '~/types/Organisation'


export default function RelatedSoftwareForSoftware() {
  const {token} = useSession()
  const {showErrorMessage} = useSnackbar()
  const {software} = useSoftwareContext()
  const [relatedSoftware, setRelatedSoftware] = useState<RelatedSoftwareOfSoftware[]>()
  const [loadedSoftware, setLoadedSoftware] = useState('')

  useEffect(() => {
    let abort = false
    async function getRelatedSoftware() {
      const resp = await getRelatedSoftwareForSoftware({
        software: software.id ?? '',
        token,
        frontend: true
      })
      const softwareList = resp
        .map(item => {
          return {
            id: item.id,
            slug: item.slug,
            brand_name: item.brand_name,
            short_statement: item.short_statement,
            updated_at: item.updated_at ?? undefined,
            status: 'approved' as Status
          }
        }).sort((a, b) => sortOnStrProp(a, b, 'brand_name'))

      if (abort) return null
      // debugger
      setRelatedSoftware(softwareList)
      setLoadedSoftware(software?.id ?? '')
    }
    if (software.id && token &&
      software?.id !== loadedSoftware) {
      getRelatedSoftware()
    }
    return ()=>{abort=true}
  },[software.id,token,loadedSoftware])

  async function onAdd(selected: SearchSoftware) {
    if (typeof relatedSoftware == 'undefined') return
    // check if already exists
    const find = relatedSoftware.filter(item => item.slug === selected.slug)
    // debugger
    if (find.length === 0) {
      // append(selected)
      const resp = await addRelatedSoftware({
        origin: software.id ?? '',
        relation: selected.id,
        token
      })
      if (resp.status !== 200) {
        showErrorMessage(`Failed to add related software. ${resp.message}`)
      } else {
        const newList = [
          ...relatedSoftware, {
            ...selected,
            status: 'approved' as Status
          }

        ].sort((a, b) => sortOnStrProp(a, b, 'brand_name'))
        setRelatedSoftware(newList)
      }
    }
  }

  async function onRemove(pos: number) {
    if (typeof relatedSoftware == 'undefined') return
    // remove(pos)
    const related = relatedSoftware[pos]
    if (software && related) {
      const resp = await deleteRelatedSoftware({
        origin: software.id ?? '',
        relation: related.id ?? '',
        token
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
        software={software.id ?? ''}
        token={token}
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
