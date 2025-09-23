// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
// SPDX-FileCopyrightText: 2023 Felix Mühlbauer (GFZ) <felix.muehlbauer@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2024 - 2026 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 - 2026 Netherlands eScience Center
// SPDX-FileCopyrightText: 2024 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useEffect, useState} from 'react'
import {AutocompleteOption} from '~/types/AutocompleteOptions'
import {EditSoftwareItem, KeywordForSoftware, License, LicenseForSoftware} from '~/types/SoftwareTypes'
import {
  getCategoriesForSoftware,
  getCategoryForSoftwareIds,
  getKeywordsForSoftware,
  getLicenseForSoftware,
  getSoftwareItem
} from '~/components/software/apiSoftware'

function prepareLicenses(rawLicense: LicenseForSoftware[]=[]) {
  const license:AutocompleteOption<License>[] = rawLicense?.map((item: any) => {
    return {
      key: item.license,
      label: item.name,
      data: item
    }
  })
  return license
}

export async function getSoftwareInfoForEdit({slug, token}: {slug: string, token: string}) {
  const software = await getSoftwareItem({slug, token})

  if (software) {
    const requests = [
      getKeywordsForSoftware(software.id, token),
      getCategoriesForSoftware(software.id, token),
      getCategoryForSoftwareIds(software.id, token),
      getLicenseForSoftware(software.id, token),
    ] as const
    // other api requests
    const [keywords, categories, categoryForSoftwareIds, respLicense] = await Promise.all(requests)
    const data:EditSoftwareItem = {
      ...software,
      keywords: keywords as KeywordForSoftware[],
      categories,
      categoryForSoftwareIds,
      licenses: prepareLicenses(respLicense),
      image_b64: null,
      image_mime_type: null,
    }

    return data
  }
}

export default function useSoftwareToEdit({slug, token}: {slug: string|null, token: string}) {
  const [editSoftware, setEditSoftware] = useState<EditSoftwareItem>()
  const [loading, setLoading] = useState(true)
  const [loadedSlug, setLoadedSlug] = useState<string>('')

  // console.group('useSoftwareToEdit')
  // console.log('slug...', slug)
  // console.log('token...', token)
  // console.log('editSoftware...', editSoftware)
  // console.log('loading...', loading)
  // console.groupEnd()

  useEffect(() => {
    let abort = false
    async function getSoftwareToEdit() {
      if (slug !== null) {
        setLoading(true)
        const software = await getSoftwareInfoForEdit({slug, token})
        if (abort) return
        setEditSoftware(software)
        setLoadedSlug(slug)
        setLoading(false)
      }
    }
    if (slug && token &&
      slug !== loadedSlug) {
      getSoftwareToEdit()
    }
    return ()=>{abort=true}
  },[slug,token,loadedSlug])

  return {
    slug,
    loading,
    editSoftware,
    setEditSoftware
  }
}
