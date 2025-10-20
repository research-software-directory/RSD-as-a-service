// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {sortOnStrProp} from '~/utils/sortFn'
import {addRelatedSoftware, deleteRelatedSoftware, getRelatedSoftwareForSoftware} from '~/components/software/edit/related-software/apiRelatedSoftware'
import {RelatedSoftwareOfSoftware, SearchSoftware} from '~/types/SoftwareTypes'
import {OrganisationStatus} from '~/types/Organisation'
import useSnackbar from '~/components/snackbar/useSnackbar'
import FindRelatedSoftware from '~/components/projects/edit/related-software/FindRelatedSoftware'
import RelatedSoftwareList from '~/components/projects/edit/related-software/RelatedSoftwareList'
import EditSectionTitle from '~/components/layout/EditSectionTitle'
import EditSection from '~/components/layout/EditSection'
import useSoftwareContext from '../context/useSoftwareContext'
import {relatedSoftware as config} from './config'


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
        token
      })
      const softwareList = resp
        .map(item => {
          return {
            id: item.id,
            slug: item.slug,
            brand_name: item.brand_name,
            short_statement: item.short_statement,
            updated_at: item.updated_at ?? undefined,
            status: 'approved' as OrganisationStatus
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
            status: 'approved' as OrganisationStatus
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
    <EditSection className="flex-1 md:flex md:flex-col-reverse md:justify-end xl:grid xl:grid-cols-[3fr_2fr] xl:px-0 xl:gap-[3rem]">
      <section className="py-4">
        <EditSectionTitle
          title={config.title}
        // subtitle={config.subtitle}
        >
          {/* add count to title */}
          {relatedSoftware && relatedSoftware.length > 0 ?
            <div className="pl-4 text-2xl">{relatedSoftware.length}</div>
            : null
          }
        </EditSectionTitle>
        <RelatedSoftwareList
          software={relatedSoftware}
          onRemove={onRemove}
        />
      </section>
      <section className="py-4">
        <EditSectionTitle
          title={config.findTitle}
          subtitle={config.findSubTitle}
        />
        <FindRelatedSoftware
          software={software.id ?? ''}
          token={token}
          config={{
            freeSolo: false,
            minLength: config.validation.minLength,
            label: config.label,
            help: config.help,
            reset: true
          }}
          onAdd={onAdd}
        />
      </section>
    </EditSection>
  )
}
