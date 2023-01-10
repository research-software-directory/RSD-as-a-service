// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2022 Christian Meeßen (GFZ) <christian.meessen@gfz-potsdam.de>
// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 Helmholtz Centre Potsdam - GFZ German Research Centre for Geosciences
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {AutocompleteOption} from '../../../../types/AutocompleteOptions'
import {EditSoftwareItem, KeywordForSoftware, License} from '../../../../types/SoftwareTypes'
import {getSoftwareToEdit} from '../../../../utils/editSoftware'
import {getKeywordsForSoftware, getLicenseForSoftware} from '../../../../utils/getSoftware'

function prepareLicenses(rawLicense: License[]=[]) {
  const license:AutocompleteOption<License>[] = rawLicense?.map((item: any) => {
    return {
      key: item.license,
      label: item.license,
      data: item
    }
  })
  return license
}


export async function getSoftwareInfoForEdit({slug, token}: { slug: string, token: string }) {
  const software = await getSoftwareToEdit({slug, token})

  if (software) {
    const requests = [
      getKeywordsForSoftware(software.id, true, token),
      getLicenseForSoftware(software.id, true, token)
    ]
    // other api requests
    const [keywords, respLicense,] = await Promise.all(requests)

    const data:EditSoftwareItem = {
      ...software,
      keywords: keywords as KeywordForSoftware[],
      licenses: prepareLicenses(respLicense as License[]),
      image_b64: null,
      image_mime_type: null,
    }

    return data
  }
}

export default function useSoftwareToEdit({slug, token}: {slug: string, token: string}) {
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
      setLoading(true)
      const software = await getSoftwareInfoForEdit({slug, token})
      if (abort) return
      setEditSoftware(software)
      setLoadedSlug(slug)
      setLoading(false)
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
