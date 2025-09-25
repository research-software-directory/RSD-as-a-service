// SPDX-FileCopyrightText: 2022 - 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2022 - 2023 dv4all
// SPDX-FileCopyrightText: 2023 - 2025 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

'use client'
import {useCallback, useEffect, useState} from 'react'

import {useSession} from '~/auth/AuthProvider'
import {TeamMember} from '~/types/Project'
import {PatchPerson, PersonProps} from '~/types/Contributor'
import {getTeamForProject} from '~/components/projects/apiProjects'
import {deleteImage, saveBase64Image} from '~/utils/editImage'
import {getPropsFromObject} from '~/utils/getPropsFromObject'
import {sortOnNumProp} from '~/utils/sortFn'
import {getDisplayName} from '~/utils/getDisplayName'
import {FormPerson} from '~/components/person/AggregatedPersonModal'
import useSnackbar from '~/components/snackbar/useSnackbar'
import useProjectContext from '../context/useProjectContext'
import {
  deleteTeamMemberById, patchTeamMember,
  patchTeamMemberPositions, postTeamMember
} from './apiTeamMembers'

/**
 * Replace member item and reset contact person flag on other items in the list
 * if the member is contact person (it can be only ONE contact person in the list).
 * @param member
 * @param members
 * @returns members (updated)
 */
function resetContactPersons(member:TeamMember,members:TeamMember[],token:string){
  // const resetContactPersons:Contributor[] = []
  const newList = members.map(item=>{
    // if current member
    if (item.id === member.id){
      // replace item with new member data
      return member
    }else if (item.is_contact_person===true && member.is_contact_person===true){
      // change item value to false because it can only be one contact person
      item.is_contact_person = false
      // patch member table without waiting for response
      patchTeamMember({
        member:{
          id: item.id ?? '',
          is_contact_person: item.is_contact_person
        } as PatchPerson,
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

export default function useTeamMembers() {
  const {token} = useSession()
  const {project} = useProjectContext()
  const {showErrorMessage} = useSnackbar()
  const [members, setMembers] = useState<TeamMember[]>([])
  const [loadedSlug, setLoadedSlug] = useState('')
  const [loading, setLoading] = useState(true)

  const addMember = useCallback(async(person:FormPerson)=>{
    if (project.id){
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
      // construct team member
      const member = {
        ...getPropsFromObject(person,PersonProps,true),
        project: project.id
      }
      // new team member to add
      const resp = await postTeamMember({
        member,
        token
      })
      // debugger
      if (resp.status === 201) {
        // update team member id
        member.id = resp.message

        if (member.is_contact_person===true){
          const newList = [
            ...resetContactPersons(member,members,token),
            member
          ]
          setMembers(newList)
        }else {
          const newList = [
            ...members,
            member
          ]
          setMembers(newList)
        }
      } else {
        showErrorMessage(`Failed to add team member. ${resp.message}`)
      }
    }
  // ignore showErrorMessage as dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[project.id,members,token])

  const updateMember = useCallback(async(person:FormPerson)=>{
    if (project.id){
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
      // construct member
      const member = {
        ...getPropsFromObject(person,PersonProps,true),
        project: project.id
      }
      // update existing member
      const resp = await patchTeamMember({
        member,
        token
      })
      // debugger
      if (resp.status === 200) {
        const newList = resetContactPersons(member,members,token)
        setMembers(newList)
      } else {
        showErrorMessage(`Failed to update team member. ${resp.message}`)
      }
    }
  // ignore showErrorMessage as dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[project.id,members,token])

  const sortedMembers = useCallback(async(newList:TeamMember[])=>{
    if (newList.length > 0) {
      const oldList = [...members]
      // update ui first
      setMembers(newList)
      // update db
      const resp = await patchTeamMemberPositions({
        members: newList,
        token
      })
      // debugger
      if (resp.status !== 200) {
        // revert back
        setMembers(oldList)
        // show error message
        showErrorMessage(`Failed to update contributor positions. ${resp.message}`)
      }
    } else {
      setMembers([])
    }
  // ignore showErrorMessage as dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[project.id,members,token])

  const deleteMember = useCallback(async(member:TeamMember)=>{
    if (member.id){
      // remove from database
      const ids = [member.id]
      const resp = await deleteTeamMemberById({ids, token})
      // debugger
      if (resp.status === 200) {
        const newList = members
          // remove contributor from the list
          .filter(item=>item.id !== member.id)
          // renumber positions
          .map((item, pos) => {
            item.position = pos + 1
            return item
          })
          // order by position
          .sort((a,b)=>sortOnNumProp(a,b,'position'))
        // now patch the positions
        sortedMembers(newList)
      } else {
        showErrorMessage(`Failed to remove ${getDisplayName(member)}. Error: ${resp.message}`)
      }
      // try to remove member avatar
      // without waiting for result
      if (member.avatar_id) {
        deleteImage({
          id: member.avatar_id,
          token
        })
      }
    }else {
      showErrorMessage(`Failed to remove ${getDisplayName(member)}. Error: contributor id missing`)
    }
  // ignore showErrorMessage as dependency
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[members,sortedMembers,token])

  useEffect(() => {
    let abort = false
    async function getMembers() {
      setLoading(true)
      const members = await getTeamForProject({
        project: project.id,
        token
      })
      // check abort
      if (abort) return
      // debugger
      setMembers(members)
      setLoadedSlug(project.id)
      setLoading(false)
    }
    if (token && project.id &&
      project.id!==loadedSlug) {
      getMembers()
    }
    return () => { abort = true }
  },[loadedSlug,token,project.id,setLoading])

  return {
    loading,
    members,
    addMember,
    updateMember,
    sortedMembers,
    deleteMember
  }
}
