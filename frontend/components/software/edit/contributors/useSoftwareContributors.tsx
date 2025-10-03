// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all) (dv4all)
//
// SPDX-License-Identifier: Apache-2.0

import {useCallback, useEffect, useState} from 'react'
import {useSession} from '~/auth/AuthProvider'
import {Contributor, PatchContributor, PersonProps} from '~/types/Contributor'
import {deleteImage, saveBase64Image} from '~/utils/editImage'
import {getDisplayName} from '~/utils/getDisplayName'
import {sortOnNumProp} from '~/utils/sortFn'
import useSnackbar from '~/components/snackbar/useSnackbar'
import useSoftwareContext from '../context/useSoftwareContext'
import {
  getContributorsForSoftware, postContributor,
  patchContributor, patchContributorPositions,
  deleteContributorsById
} from './apiContributors'
import {FormPerson} from '~/components/person/AggregatedPersonModal'
import {getPropsFromObject} from '~/utils/getPropsFromObject'

/**
 * Replace contributor item and reset contact person flag on other items in the list
 * if the contributor is contact person (it can be only ONE contact person in the list).
 * @param contributor
 * @param contributors
 * @returns contributors (updated)
 */
function resetContactPersons(contributor:Contributor,contributors:Contributor[],token:string){
  // const resetContactPersons:Contributor[] = []
  const newList = contributors.map(item=>{
    // if current contributor
    if (item.id === contributor.id){
      // replace item with new contributor data
      return contributor
    }else if (item.is_contact_person===true && contributor.is_contact_person===true){
      // change item value to false because it can only be one contact person
      item.is_contact_person = false
      // patch contributor table without waiting for response
      patchContributor({
        contributor:{
          id: item.id ?? '',
          is_contact_person: item.is_contact_person
        } as PatchContributor,
        token
      })
      return item
    } else {
      return item
    }
  })
  // return updated contributors list
  return newList
}

export default function useSoftwareContributors() {
  const {token} = useSession()
  const {software} = useSoftwareContext()
  const {showErrorMessage} = useSnackbar()
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState(true)
  const [loadedSoftware, setLoadedSoftware] = useState<string>('')

  const addContributor = useCallback(async(person:FormPerson)=>{
    if (software.id){
      // new base64 image to upload
      if (person.avatar_id && person.avatar_id.startsWith('data:')===true){
        const upload = await saveBase64Image({
          base64: person.avatar_id,
          token
        })
        // debugger
        if (upload.status === 201) {
          // update avatar_id
          person.avatar_id = upload.message
        } else {
          showErrorMessage(`Failed to upload image. ${upload.message}`)
          return
        }
      }
      // construct contributor
      const contributor = {
        ...getPropsFromObject(person,PersonProps,true),
        software: software.id
      }
      // new contributor to add
      const resp = await postContributor({
        contributor,
        token
      })
      // debugger
      if (resp.status === 201) {
        // update contributor id
        contributor.id = resp.message

        if (contributor.is_contact_person===true){
          const newList = [
            ...resetContactPersons(contributor,contributors,token),
            contributor
          ]
          setContributors(newList)
        }else {
          const newList = [
            ...contributors,
            contributor
          ]
          setContributors(newList)
        }
      } else {
        showErrorMessage(`Failed to add contributor. ${resp.message}`)
      }
    }
  // ignore showErrorMessage as dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[software.id,contributors,token])

  const updateContributor = useCallback(async(person:FormPerson)=>{
    if (software.id){
      // new base64 image to upload
      if (person.avatar_id && person.avatar_id.startsWith('data:')===true){
        const upload = await saveBase64Image({
          base64: person.avatar_id,
          token
        })
        // debugger
        if (upload.status === 201) {
          // update avatar_id
          person.avatar_id = upload.message
        } else {
          showErrorMessage(`Failed to upload image. ${upload.message}`)
          return
        }
      }
      if (person.initial_avatar_id && person.avatar_id !== person.initial_avatar_id){
        // debugger
        // avatar is changed, try to remove old avatar from rsd without waiting
        deleteImage({
          id: person.initial_avatar_id,
          token
        })
      }
      // construct contributor
      const contributor:PatchContributor = {
        ...getPropsFromObject(person,PersonProps,true),
        software: software.id
      }
      // update existing contributor
      const resp = await patchContributor({
        contributor,
        token
      })
      // debugger
      if (resp.status === 200) {
        const newList = resetContactPersons(contributor,contributors,token)
        setContributors(newList)
      } else {
        showErrorMessage(`Failed to update contributor. ${resp.message}`)
      }
    }
  // ignore showErrorMessage as dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[software.id,contributors,token])

  const sortedContributors = useCallback(async(newList:Contributor[])=>{
    if (newList.length > 0) {
      const oldList = [...contributors]
      // update ui first
      setContributors(newList)
      // update db
      const resp = await patchContributorPositions({
        contributors: newList,
        token
      })
      // debugger
      if (resp.status !== 200) {
        // revert back
        setContributors(oldList)
        // show error message
        showErrorMessage(`Failed to update contributor positions. ${resp.message}`)
      }
    } else {
      setContributors([])
    }
  // ignore showErrorMessage as dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token,contributors])

  const deleteContributor = useCallback(async(contributor:Contributor)=>{
    // existing contributor
    if (contributor.id) {
      // remove from database
      const ids = [contributor.id]
      const resp = await deleteContributorsById({ids, token})
      // debugger
      if (resp.status === 200) {
        const newList = contributors
          // remove contributor from the list
          .filter(item=>item.id !== contributor.id)
          // renumber positions
          .map((item, pos) => {
            item.position = pos + 1
            return item
          })
          // order by position
          .sort((a,b)=>sortOnNumProp(a,b,'position'))
        // now patch the positions
        sortedContributors(newList)
      } else {
        showErrorMessage(`Failed to remove ${getDisplayName(contributor)}. Error: ${resp.message}`)
      }
      // try to remove member avatar
      // without waiting for result
      if (contributor.avatar_id) {
        deleteImage({
          id: contributor.avatar_id,
          token
        })
      }
    } else {
      showErrorMessage(`Failed to remove ${getDisplayName(contributor)}. Error: contributor id missing`)
    }
  // ignore showErrorMessage as dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[token,contributors,sortedContributors])

  useEffect(() => {
    let abort = false
    const getContributors = async (software: string, token: string) => {
      setLoading(true)
      const data = await getContributorsForSoftware({
        software,
        token
      }) as Contributor[]
      if (abort) return
      // update state
      setContributors(data ?? [])
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
    addContributor,
    updateContributor,
    deleteContributor,
    sortedContributors,
    setContributors
  }
}
