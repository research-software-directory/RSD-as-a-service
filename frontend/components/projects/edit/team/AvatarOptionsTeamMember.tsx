// SPDX-FileCopyrightText: 2023 Dusan Mijatovic (dv4all)
// SPDX-FileCopyrightText: 2023 dv4all
//
// SPDX-License-Identifier: Apache-2.0

import {ChangeEvent} from 'react'
import {UseFormSetValue, UseFormWatch} from 'react-hook-form'

import useSnackbar from '~/components/snackbar/useSnackbar'
import {handleFileUpload} from '~/utils/handleFileUpload'
import AvatarOptions from '~/components/person/AvatarOptions'
import {NewRsdMember} from './AggregatedMemberModal'

type AvatarOptionsProps = {
  avatar_options: string[]
  watch: UseFormWatch<NewRsdMember>
  setValue: UseFormSetValue<NewRsdMember>
}

export default function AvatarOptionsTeamMember(props: AvatarOptionsProps) {
  const {showWarningMessage, showErrorMessage} = useSnackbar()
  const {setValue, avatar_options, watch} = props
  const [avatar_id, avatar_b64] = watch(['avatar_id', 'avatar_b64'])
  const [given_names, family_names] = watch(['given_names', 'family_names'])

  async function onFileUpload(e:ChangeEvent<HTMLInputElement>|undefined) {
    if (typeof e !== 'undefined') {
      const {status, message, image_b64, image_mime_type} = await handleFileUpload(e)
      if (status === 200 && image_b64 && image_mime_type) {
        saveImage(image_b64, image_mime_type)
      } else if (status===413) {
        showWarningMessage(message)
      } else {
        showErrorMessage(message)
      }
    }
  }

  function saveImage(avatar_b64: string, avatar_mime_type: string) {
    // console.log('saveImage...',avatar_mime_type)
    if (avatar_id) {
      // remove id in the form
      setValue('avatar_id', null)
    }
    // write new logo to logo_b64
    // we upload the image after submit
    setValue('avatar_b64', avatar_b64)
    setValue('avatar_mime_type', avatar_mime_type, {shouldDirty: true})
  }

  function deleteAvatar() {
    // console.log('deleteAvatar...')
    if (avatar_id) {
      // update form
      setValue('avatar_id', null, {shouldDirty: true,shouldValidate:true})
    }
    // just remove uploaded image from form
    // because it is not saved yet to DB
    setValue('avatar_b64', null)
    setValue('avatar_mime_type', null, {shouldDirty: true})
  }

  return (
    <AvatarOptions
      given_names={given_names}
      family_names={family_names}
      avatar_b64={avatar_b64}
      avatar_id={avatar_id}
      avatar_options={avatar_options}
      onSelectAvatar={(img) => setValue('avatar_id', img)}
      onNoAvatar={deleteAvatar}
      onFileUpload={onFileUpload}
    />
  )
}
