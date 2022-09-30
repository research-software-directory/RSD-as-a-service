// SPDX-FileCopyrightText: 2022 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {useEffect, useState} from 'react'
import {useSession} from '~/auth'
import {Contributor} from '~/types/Contributor'
import {getContributorsForSoftware} from '~/utils/editContributors'
import useSoftwareContext from '../useSoftwareContext'

export default function useSoftwareContributors() {
  const {token} = useSession()
  const {software} = useSoftwareContext()
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)
  const [loadedSoftware, setLoadedSoftware] = useState<string>('')

  useEffect(() => {
    let abort = false
    const getContributors = async (software: string, token: string) => {
      setLoading(true)
      const resp = await getContributorsForSoftware({
        software,
        token,
        frontend:true
      })
      if (abort) return
      // update state
      setContributors(resp ?? [])
      setLoadedSoftware(software)
      setLoading(false)
    }
    if (software?.id && token &&
      software.id !== loadedSoftware) {
      getContributors(software.id,token)
    }
    return () => { abort = true }
  }, [software?.id,loadedSoftware,token])

  return {
    loading,
    contributors,
    setContributors,
    setLoading
  }
}


// export async function importContributorsFromDoi() {
//     setLoading(true)

//     const contribDoi: Contributor[] = await getContributorsFromDoi(
//       software?.id ?? '', software?.concept_doi ?? ''
//     )

//     if (!contribDoi || contribDoi.length === 0) {
//       showErrorMessage(
//         `Contributors could not be added from DOI ${software?.concept_doi}`
//       )
//       setLoading(false)
//       return
//     }

//     // extract only new Contributors
//     // for now using only family names as key
//     const newContributors = itemsNotInReferenceList({
//       list: contribDoi,
//       referenceList: contributors,
//       key: 'family_names'
//     })

//     if (newContributors.length === 0) {
//       showInfoMessage(
//         `No new contributors to add from DOI ${software?.concept_doi} based on family_names.`
//       )
//       setLoading(false)
//       return
//     }

//     for (const c of newContributors) {
//       const contributor = prepareContributorData(c)
//       const resp = await addContributorToDb({contributor, token})

//       if (resp.status === 201) {
//         // update item in newContributors
//         c.id = resp.message
//         // no image provided by datacite
//         c.avatar_data = null
//         c.avatar_url = null
//       } else {
//         showErrorMessage(
//           `Failed to add ${getDisplayName(contributor)}. Error: ${resp.message}`
//         )
//       }
//     }

//     const list = [
//       ...contributors,
//       ...newContributors
//     ].sort((a, b) => sortOnStrProp(a, b, 'given_names'))
//     setContributors(list)

//     setLoading(false)
//   }
