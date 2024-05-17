// SPDX-FileCopyrightText: 2024 Dusan Mijatovic (Netherlands eScience Center)
// SPDX-FileCopyrightText: 2024 Netherlands eScience Center
//
// SPDX-License-Identifier: Apache-2.0

import {ChangeEvent, useRef} from 'react'

import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import DeleteIcon from '@mui/icons-material/Delete'

import {UseFormSetValue} from 'react-hook-form'

import {useSession} from '~/auth'
import {deleteImage, getImageUrl} from '~/utils/editImage'
import useSnackbar from '~/components/snackbar/useSnackbar'
import {handleFileUpload} from '~/utils/handleFileUpload'

export type FormInputsForImage={
  logo_id: string|null
  logo_b64?: string|null
  logo_mime_type?: string|null
}

type ImageInputProps={
  name:string
  logo_b64?: string|null
  logo_id?: string|null
  setValue: UseFormSetValue<FormInputsForImage>
}

export default function ControlledImageInput({name,logo_b64,logo_id,setValue}:ImageInputProps) {
  const {token} = useSession()
  const {showWarningMessage,showErrorMessage} = useSnackbar()
  const imgInputRef = useRef<HTMLInputElement>(null)

  async function onFileUpload(e:ChangeEvent<HTMLInputElement>|undefined) {
    if (typeof e !== 'undefined') {
      const {status, message, image_b64, image_mime_type} = await handleFileUpload(e)
      if (status === 200 && image_b64 && image_mime_type) {
        // save image
        replaceLogo(image_b64,image_mime_type)
      } else if (status===413) {
        showWarningMessage(message)
      } else {
        showErrorMessage(message)
      }
    }
  }

  async function replaceLogo(logo_b64:string, logo_mime_type:string) {
    if (logo_id) {
      // remove old logo from db
      const del = await deleteImage({
        id: logo_id,
        token
      })
      setValue('logo_id', null)
    }
    // write new logo to logo_b64
    // we upload the image after submit
    setValue('logo_b64', logo_b64)
    setValue('logo_mime_type', logo_mime_type, {shouldDirty: true})
  }

  async function deleteLogo() {
    if (logo_id) {
      // remove old logo from db
      await deleteImage({
        id: logo_id,
        token
      })
    }
    // remove from form values
    setValue('logo_id', null)
    setValue('logo_b64', null)
    setValue('logo_mime_type', null, {shouldDirty: true})
    // remove image value from input
    if (imgInputRef.current){
      imgInputRef.current.value = ''
    }
  }

  return (
    <div>
      <label htmlFor="upload-avatar-image"
        style={{cursor:'pointer'}}
        title="Click to upload an image"
      >
        <Avatar
          alt={name ?? ''}
          src={logo_b64 ?? getImageUrl(logo_id ?? null) ?? undefined}
          sx={{
            width: '8rem',
            height: '8rem',
            fontSize: '3rem',
            marginRight: '0rem',
            '& img': {
              height:'auto'
            }
          }}
          variant="square"
        >
          {name ? name.slice(0,3) : ''}
        </Avatar>
      </label>
      <input
        ref={imgInputRef}
        id="upload-avatar-image"
        type="file"
        accept="image/*"
        onChange={onFileUpload}
        style={{display:'none'}}
      />
      <div className="flex pt-4">
        <Button
          title="Remove image"
          // color='primary'
          disabled={!logo_b64 && !logo_id}
          onClick={deleteLogo}
          endIcon={<DeleteIcon/>}
        >
          Remove
        </Button>
      </div>
    </div>
  )
}
