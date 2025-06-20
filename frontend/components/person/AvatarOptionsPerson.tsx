// SPDX-FileCopyrightText: 2023 - 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2023 - 2025 Netherlands eScience Center
// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
// SPDX-FileCopyrightText: 2025 Ewan Cahen (Netherlands eScience Center) <e.cahen@esciencecenter.nl>
//
// SPDX-License-Identifier: Apache-2.0

import {ChangeEvent, useEffect, useState} from 'react'
import {UseFormSetValue, UseFormWatch} from 'react-hook-form'

import useSnackbar from '~/components/snackbar/useSnackbar'
import {handleFileUpload} from '~/utils/handleFileUpload'
import AvatarOptions from '~/components/person/AvatarOptions'

export type RequiredAvatarProps={
  avatar_id: string | null
  avatar_options: string[]
  given_names: string
  family_names: string
}

export type AvatarOptionsProps = {
  avatar_options: string[]
  watch: UseFormWatch<RequiredAvatarProps>
  setValue: UseFormSetValue<RequiredAvatarProps>
  loading: boolean
}

export default function AvatarOptionsPerson(props: AvatarOptionsProps) {
  const {showWarningMessage, showErrorMessage} = useSnackbar()
  const {setValue, avatar_options, watch, loading} = props
  const [avatar_id,given_names,family_names] = watch(['avatar_id','given_names','family_names'])
  // We need to keep local avatar options state because
  // images of persons without ORCID cannot be aggregated from RSD
  const [options, setOptions] = useState<string[]>([])

  // console.group('AvatarOptionsPerson')
  // console.log('avatar_id...', avatar_id)
  // console.log('avatar_b64...', avatar_b64)
  // console.log('avatar_options...', avatar_options)
  // console.log('options...', options)
  // console.groupEnd()

  useEffect(()=>{
    if (loading===false){
      // aggregate old and new items
      setOptions((old)=>{
        // add old first to list
        const merged = [...old]
        // deduplicate options
        avatar_options.forEach(item=>{
          if (merged.includes(item)===false){
            merged.push(item)
          }
        })
        // check if avatar_id is included
        if (avatar_id &&
          merged.includes(avatar_id)===false &&
          //DO NOT add newly uploaded image to collection (before saved)
          avatar_id.startsWith('data:')===false
        ){
          // add it to fist place
          merged.unshift(avatar_id)
        }
        return merged
      })
    }
  },[avatar_options,avatar_id,loading])

  async function onFileUpload(e: ChangeEvent<HTMLInputElement> | {target: {files: FileList | Blob[]}} | undefined): Promise<void> {
    if (e === undefined) {
      return
    }

    const {status, message, image_b64, image_mime_type} = await handleFileUpload(e)
    if (status === 200 && image_b64 && image_mime_type) {
      // save it as selected
      setValue('avatar_id', image_b64, {shouldDirty: true, shouldValidate:true})
    } else if (status===413) {
      showWarningMessage(message)
    } else {
      showErrorMessage(message)
    }
  }

  function deleteAvatar() {
    // console.log('deleteAvatar...')
    if (avatar_id) {
      // update form
      setValue('avatar_id', null, {shouldDirty: true, shouldValidate:true})
    }
  }

  return (
    <AvatarOptions
      given_names={given_names}
      family_names={family_names}
      avatar_id={avatar_id}
      avatar_options={options}
      onSelectAvatar={(img) => {
        setValue('avatar_id', img, {shouldDirty: true, shouldValidate:true})
      }}
      onNoAvatar={deleteAvatar}
      onFileUpload={onFileUpload}
      loading={loading}
    />
  )
}
